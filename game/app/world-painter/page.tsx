
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Download, Upload, Grid3X3, MapPin, Route, Brush, Eraser } from "lucide-react";

const W = 240;
const H = 180;
const SIZE = W * H;

// ⚠️ Tile IDs must match your engine renderer.
// This palette uses your current world tile IDs (0–9) + roads (27–31) + town interior (20–26).
const TILE_PALETTE = [
  { id: 0, name: "Grass", color: "#4caf50" },
  { id: 1, name: "Forest", color: "#2e7d32" },
  { id: 2, name: "Mountain", color: "#7b7b7b" },
  { id: 3, name: "Deep Water", color: "#0b3d91" },
  { id: 4, name: "Shallow", color: "#2aa7d6" },
  { id: 5, name: "Town", color: "#c9a227" },
  { id: 6, name: "Sand", color: "#d9c27e" },
  { id: 7, name: "Danger", color: "#b71c1c" },
  { id: 8, name: "Blight", color: "#2b2626" },
  { id: 9, name: "Volcano", color: "#5d1a1a" },
  { id: 27, name: "Road Dirt", color: "#8b6a44" },
  { id: 28, name: "Road Stone", color: "#7c7f86" },
  { id: 29, name: "Road Obsidian", color: "#1b1b22" },
  { id: 30, name: "Road Blight", color: "#3a2f2f" },
  { id: 31, name: "Road Runic", color: "#0f0f18" },
  { id: 20, name: "Town Floor", color: "#6d4c41" },
  { id: 21, name: "Town Wall", color: "#2a1d1a" },
  { id: 22, name: "Smithy", color: "#a33" },
  { id: 23, name: "Alchemist", color: "#3a3" },
  { id: 24, name: "Library", color: "#33a" },
  { id: 25, name: "Town Exit", color: "#c090ff" },
  { id: 26, name: "Town Deco", color: "#6a1b9a" },
];

function idx(x, y) {
  return y * W + x;
}

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

function makeDefaultWorld(id = "overworld_C") {
  const tiles = new Array(SIZE).fill(0);
  const variants = new Array(SIZE).fill(0);
  return {
    id,
    name: id,
    type: "world",
    meta: {
      biome: "grasslands",
      baseTile: 0,
      accentTile: 1,
      tier: 0,
      spawnOffset: { x: 0, y: 0 },
      distanceFromSpawn: 0,
      encounterRate: 0.08,
      monsterScaleMultiplier: 1.0,
      lootTier: 0,
      description: "",
    },
    capitol: null,
    towns: [],
    portals: [],
    bosses: [],
    specialFeatures: [],
    entryPoints: {
      N: { x: 120, y: 178, tile: 0 },
      S: { x: 120, y: 1, tile: 0 },
      W: { x: 238, y: 90, tile: 0 },
      E: { x: 1, y: 90, tile: 0 },
    },
    blimpRoutes: [],
    width: W,
    height: H,
    tiles,
    variants,
  };
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export default function WorldMapPainter() {
  const canvasRef = useRef(null);
  const [world, setWorld] = useState(() => makeDefaultWorld("overworld_SW"));
  const [activeTile, setActiveTile] = useState(0);
  const [tool, setTool] = useState("paint"); // paint | erase | town | portal | boss | entry
  const [brush, setBrush] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [zoom, setZoom] = useState(3); // px per tile
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [lastPos, setLastPos] = useState(null);
  const [jsonText, setJsonText] = useState("");

  const tileColor = useMemo(() => {
    const m = new Map();
    TILE_PALETTE.forEach((t) => m.set(t.id, t.color));
    return m;
  }, []);

  const draw = () => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    const widthCss = 900;
    const heightCss = 600;
    c.style.width = widthCss + "px";
    c.style.height = heightCss + "px";
    c.width = Math.floor(widthCss * dpr);
    c.height = Math.floor(heightCss * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.clearRect(0, 0, widthCss, heightCss);

    // viewport -> tiles
    const px = zoom;
    const ox = pan.x;
    const oy = pan.y;

    const startX = clamp(Math.floor((-ox) / px), 0, W - 1);
    const startY = clamp(Math.floor((-oy) / px), 0, H - 1);
    const endX = clamp(Math.ceil((widthCss - ox) / px), 0, W);
    const endY = clamp(Math.ceil((heightCss - oy) / px), 0, H);

    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        const t = world.tiles[idx(x, y)] ?? 0;
        ctx.fillStyle = tileColor.get(t) || "#222";
        ctx.fillRect(ox + x * px, oy + y * px, px, px);
      }
    }

    // overlays: towns/portals/bosses
    const drawMarker = (x, y, color, label) => {
      ctx.save();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(ox + x * px + px / 2, oy + y * px + px / 2, Math.max(3, px * 0.35), 0, Math.PI * 2);
      ctx.fill();
      if (px >= 8) {
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.font = "10px ui-sans-serif";
        ctx.fillText(label, ox + x * px + 2, oy + y * px + 10);
      }
      ctx.restore();
    };

    (world.towns || []).forEach((t) => drawMarker(t.x, t.y, "#f59e0b", "T"));
    (world.portals || []).forEach((p) => drawMarker(p.x, p.y, "#a78bfa", "P"));
    (world.bosses || []).forEach((b) => drawMarker(b.x, b.y, "#ef4444", "B"));

    // entry points
    if (world.entryPoints) {
      Object.entries(world.entryPoints).forEach(([k, v]) => {
        if (!v) return;
        drawMarker(v.x, v.y, "#22c55e", k);
      });
    }

    if (showGrid && px >= 6) {
      ctx.strokeStyle = "rgba(0,0,0,0.15)";
      ctx.lineWidth = 1;
      for (let x = startX; x <= endX; x++) {
        ctx.beginPath();
        ctx.moveTo(ox + x * px, oy + startY * px);
        ctx.lineTo(ox + x * px, oy + endY * px);
        ctx.stroke();
      }
      for (let y = startY; y <= endY; y++) {
        ctx.beginPath();
        ctx.moveTo(ox + startX * px, oy + y * px);
        ctx.lineTo(ox + endX * px, oy + y * px);
        ctx.stroke();
      }
    }
  };

  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [world, activeTile, tool, brush, showGrid, zoom, pan]);

  const screenToTile = (clientX, clientY) => {
    const c = canvasRef.current;
    const rect = c.getBoundingClientRect();
    const sx = clientX - rect.left;
    const sy = clientY - rect.top;
    const px = zoom;
    const x = Math.floor((sx - pan.x) / px);
    const y = Math.floor((sy - pan.y) / px);
    return { x, y };
  };

  const paintAt = (x, y, tileId) => {
    const r = brush;
    const next = deepClone(world);
    for (let yy = y - r + 1; yy <= y + r - 1; yy++) {
      for (let xx = x - r + 1; xx <= x + r - 1; xx++) {
        if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
        next.tiles[idx(xx, yy)] = tileId;
      }
    }
    setWorld(next);
  };

  const placeTown = (x, y) => {
    const next = deepClone(world);
    const id = `town_${next.towns.length + 1}`;
    next.towns.push({ x, y, name: `Town ${next.towns.length + 1}`, id, tier: next.meta?.tier ?? 0, services: ["Inn", "Shop"] });
    // also paint a town tile at that location
    next.tiles[idx(x, y)] = 5;
    setWorld(next);
  };

  const placePortal = (x, y) => {
    const next = deepClone(world);
    next.portals.push({ x, y, campaignId: `campaign_${next.portals.length + 1}`, name: `Portal ${next.portals.length + 1}`, minLevel: 1, maxLevel: 5 });
    setWorld(next);
  };

  const placeBoss = (x, y) => {
    const next = deepClone(world);
    next.bosses.push({ id: `boss_${next.bosses.length + 1}`, name: `Boss ${next.bosses.length + 1}`, icon: "👑", x, y, hp: 5000, hp_max: 5000, alive: true, homeX: x, homeY: y });
    setWorld(next);
  };

  const setEntry = (dir, x, y) => {
    const next = deepClone(world);
    next.entryPoints = next.entryPoints || {};
    next.entryPoints[dir] = { x, y, tile: next.tiles[idx(x, y)] ?? 0 };
    setWorld(next);
  };

  const onMouseDown = (e) => {
    if (e.button === 1 || e.button === 2) {
      setDragging(true);
      setLastPos({ x: e.clientX, y: e.clientY });
      return;
    }

    const { x, y } = screenToTile(e.clientX, e.clientY);
    if (x < 0 || y < 0 || x >= W || y >= H) return;

    if (tool === "paint") paintAt(x, y, activeTile);
    else if (tool === "erase") paintAt(x, y, 0);
    else if (tool === "town") placeTown(x, y);
    else if (tool === "portal") placePortal(x, y);
    else if (tool === "boss") placeBoss(x, y);
    else if (tool.startsWith("entry:")) setEntry(tool.split(":")[1], x, y);
  };

  const onMouseMove = (e) => {
    if (dragging && lastPos) {
      const dx = e.clientX - lastPos.x;
      const dy = e.clientY - lastPos.y;
      setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
      setLastPos({ x: e.clientX, y: e.clientY });
      return;
    }

    if ((tool === "paint" || tool === "erase") && (e.buttons & 1)) {
      const { x, y } = screenToTile(e.clientX, e.clientY);
      if (x < 0 || y < 0 || x >= W || y >= H) return;
      paintAt(x, y, tool === "erase" ? 0 : activeTile);
    }
  };

  const onMouseUp = () => {
    setDragging(false);
    setLastPos(null);
  };

  const exportJson = () => {
    const out = deepClone(world);
    // ensure required fields
    out.width = W;
    out.height = H;
    if (!out.variants || out.variants.length !== SIZE) out.variants = new Array(SIZE).fill(0);
    setJsonText(JSON.stringify(out, null, 2));
  };

  const importJson = () => {
    try {
      const obj = JSON.parse(jsonText);
      if (!obj || typeof obj !== "object") return;
      if (!Array.isArray(obj.tiles) || obj.tiles.length !== SIZE) {
        alert("Import failed: tiles must be an array of length 43200 (240×180). ");
        return;
      }
      if (!Array.isArray(obj.variants) || obj.variants.length !== SIZE) {
        obj.variants = new Array(SIZE).fill(0);
      }
      obj.width = W;
      obj.height = H;
      setWorld(obj);
    } catch (e) {
      alert("Import failed: invalid JSON");
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">World Map Painter (Prototype)</h1>
          <p className="text-sm text-muted-foreground">
            Paint tiles on a 240×180 grid, place towns/portals/bosses, and export a world JSON prefix like your new schema.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowGrid((v) => !v)}>
            <Grid3X3 className="h-4 w-4 mr-2" /> {showGrid ? "Hide" : "Show"} Grid
          </Button>
          <Button variant="outline" onClick={() => setZoom((z) => clamp(z + 1, 2, 12))}>+</Button>
          <Button variant="outline" onClick={() => setZoom((z) => clamp(z - 1, 2, 12))}>-</Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Canvas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-2xl overflow-hidden border bg-black/5">
              <canvas
                ref={canvasRef}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onContextMenu={(e) => e.preventDefault()}
                className="block"
              />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Tip: Left-click paints/places. Hold left-click to paint. Middle/right drag pans.
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-12 lg:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Tools & Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tool</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button variant={tool === "paint" ? "default" : "outline"} onClick={() => setTool("paint")}>
                  <Brush className="h-4 w-4 mr-2" /> Paint
                </Button>
                <Button variant={tool === "erase" ? "default" : "outline"} onClick={() => setTool("erase")}>
                  <Eraser className="h-4 w-4 mr-2" /> Erase
                </Button>
                <Button variant={tool === "town" ? "default" : "outline"} onClick={() => setTool("town")}>
                  <MapPin className="h-4 w-4 mr-2" /> Town
                </Button>
                <Button variant={tool === "portal" ? "default" : "outline"} onClick={() => setTool("portal")}>
                  <Plus className="h-4 w-4 mr-2" /> Portal
                </Button>
                <Button variant={tool === "boss" ? "default" : "outline"} onClick={() => setTool("boss")}>
                  <MapPin className="h-4 w-4 mr-2" /> Boss
                </Button>
                <Select value={tool.startsWith("entry:") ? tool : ""} onValueChange={(v) => setTool(v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Entry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry:N">Entry N</SelectItem>
                    <SelectItem value="entry:S">Entry S</SelectItem>
                    <SelectItem value="entry:E">Entry E</SelectItem>
                    <SelectItem value="entry:W">Entry W</SelectItem>
                    <SelectItem value="entry:NE">Entry NE</SelectItem>
                    <SelectItem value="entry:NW">Entry NW</SelectItem>
                    <SelectItem value="entry:SE">Entry SE</SelectItem>
                    <SelectItem value="entry:SW">Entry SW</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Brush size</Label>
              <div className="flex items-center gap-2">
                <Input type="number" value={brush} min={1} max={6} onChange={(e) => setBrush(clamp(Number(e.target.value || 1), 1, 6))} />
                <Badge variant="secondary">tiles</Badge>
              </div>
            </div>

            <Separator />

            <Tabs defaultValue="palette">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="palette">Palette</TabsTrigger>
                <TabsTrigger value="meta">Meta</TabsTrigger>
                <TabsTrigger value="json">JSON</TabsTrigger>
              </TabsList>

              <TabsContent value="palette" className="space-y-3">
                <div className="grid grid-cols-2 gap-2 max-h-[320px] overflow-auto pr-1">
                  {TILE_PALETTE.map((t) => (
                    <button
                      key={t.id}
                      className={`flex items-center gap-2 rounded-xl border p-2 text-left hover:bg-muted ${activeTile === t.id ? "ring-2 ring-primary" : ""}`}
                      onClick={() => setActiveTile(t.id)}
                    >
                      <span className="h-4 w-4 rounded" style={{ background: t.color }} />
                      <span className="text-xs">{t.id}: {t.name}</span>
                    </button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="meta" className="space-y-3">
                <div className="space-y-2">
                  <Label>World Id</Label>
                  <Input value={world.id} onChange={(e) => setWorld((w) => ({ ...w, id: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={world.name} onChange={(e) => setWorld((w) => ({ ...w, name: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Biome</Label>
                  <Input value={world.meta?.biome || ""} onChange={(e) => setWorld((w) => ({ ...w, meta: { ...(w.meta||{}), biome: e.target.value } }))} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Tier</Label>
                    <Input type="number" value={world.meta?.tier ?? 0} onChange={(e) => setWorld((w) => ({ ...w, meta: { ...(w.meta||{}), tier: Number(e.target.value||0) } }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Loot Tier</Label>
                    <Input type="number" value={world.meta?.lootTier ?? 0} onChange={(e) => setWorld((w) => ({ ...w, meta: { ...(w.meta||{}), lootTier: Number(e.target.value||0) } }))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={world.meta?.description || ""} onChange={(e) => setWorld((w) => ({ ...w, meta: { ...(w.meta||{}), description: e.target.value } }))} />
                </div>
              </TabsContent>

              <TabsContent value="json" className="space-y-3">
                <div className="flex gap-2">
                  <Button onClick={exportJson}>
                    <Download className="h-4 w-4 mr-2" /> Export
                  </Button>
                  <Button variant="outline" onClick={importJson}>
                    <Upload className="h-4 w-4 mr-2" /> Import
                  </Button>
                </div>
                <Textarea className="min-h-[320px] font-mono text-xs" value={jsonText} onChange={(e) => setJsonText(e.target.value)} placeholder="Exported JSON appears here…" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
