export interface IndustryContent {
  slug: string
  name: string
  shortName: string
  heroSub: string
  whyItWorks: { label: string; body: string }[]
  builtFor: { heading: string; body: string; checklist: string[] }
  useCases: { title: string; body: string }[]
  cardSummary: { tagline: string; bullets: string[] }
}

export const industries: IndustryContent[] = [
  {
    slug: '3pl',
    name: '3PL & Logistics',
    shortName: '3PL',
    heroSub:
      'Standardize processes across customers, buildings, and regions. Multimodal picking that adapts per client and workflow — without legacy lock-in.',
    whyItWorks: [
      { label: 'Onboard fast', body: 'Familiar Android UI and clear prompts get seasonal staff productive in hours, not days.' },
      { label: 'Consistent across sites', body: 'Same workflows, prompts, and confirmations from one building to the next.' },
      { label: 'Device flexibility', body: 'Mix handhelds, wearables, and BYO Android devices across large fleets.' },
      { label: 'SilentScan™', body: 'Quiet voice during scan streaks in noisy cross-dock and outbound areas.' },
    ],
    builtFor: {
      heading: 'Built for Multi-Client Operations',
      body: 'Configure workflows per customer or zone while keeping core processes consistent.',
      checklist: [
        'Android-native device flexibility for large fleets',
        'Per-customer workflow configuration',
        'Lower TCO across multi-site deployments',
      ],
    },
    useCases: [
      { title: 'Case & Each Picking', body: 'Voice for pace, scan for accuracy across mixed-customer workflows.' },
      { title: 'Putaway & Replenishment', body: 'Guided moves with verification, suited to high-velocity cross-docks.' },
      { title: 'Inventory & Cycle Counts', body: 'Scan-driven counts with exception notes, audit-ready output.' },
    ],
    cardSummary: {
      tagline: 'Standardize processes across customers, buildings, and regions.',
      bullets: [
        'Fast onboarding for seasonal surges',
        'Consistent workflows across sites',
        'SilentScan™ for noisy areas',
      ],
    },
  },
  {
    slug: 'retail-distribution',
    name: 'Retail & Distribution Centers',
    shortName: 'Retail & DC',
    heroSub:
      'High throughput and accuracy at scale. Multimodal picking keeps aisles flowing: voice for pace, screen for clarity, scan for verification.',
    whyItWorks: [
      { label: 'Peak-proof throughput', body: 'Keep pace during promos and seasonal surges without retraining.' },
      { label: 'Store-friendly accuracy', body: 'Scan checks reduce returns and chargebacks.' },
      { label: 'Onboarding in hours', body: 'Familiar Android UI plus voice guidance accelerates new-hire ramp.' },
      { label: 'SilentScan™', body: 'Suppress voice during rapid scan runs in loud or high-traffic zones.' },
    ],
    builtFor: {
      heading: 'Built for Your Operation',
      body: 'Adapt prompts, confirmations, and checks per department, site, or customer channel — without rebuilding processes.',
      checklist: [
        'Android-native devices (handhelds, wearables)',
        'Flexible integrations to WMS/ERP',
        'Role-based guidance and permissions',
      ],
    },
    useCases: [
      { title: 'Wave & Batch Picking', body: 'Voice navigation for pace, on-screen clarity for multi-line orders, scan checks to reduce errors.' },
      { title: 'Store Replenishment', body: 'Accurate case/eaches with barcode verification and clear exceptions.' },
      { title: 'Cycle Count & Audits', body: 'Guided counts with scan capture and exception notes, reducing recounts.' },
    ],
    cardSummary: {
      tagline: 'Maintain throughput and accuracy at scale with multimodal prompts on rugged Android devices.',
      bullets: [
        'High pick rates with fewer errors',
        'Configurable workflows per department',
        'Clear prompts for faster training',
      ],
    },
  },
  {
    slug: 'ecommerce',
    name: 'eCommerce Fulfillment',
    shortName: 'eCommerce',
    heroSub:
      'Dense SKU environments with short SLAs demand precision. Multimodal blends voice navigation with visual cues and barcode verification — keeping pickers fast and accurate.',
    whyItWorks: [
      { label: 'Accuracy at speed', body: 'Scan checks prevent look-alike mispicks and keep return rates down.' },
      { label: 'Short SLAs, steady pace', body: 'Voice guides movement while on-screen details handle complex lines.' },
      { label: 'Peak-ready onboarding', body: 'Familiar Android UI reduces training time for seasonal teams.' },
      { label: 'SilentScan™', body: 'When scan streaks accelerate, voice mutes automatically so workers stay focused.' },
    ],
    builtFor: {
      heading: 'Built for Dense SKU Ops',
      body: 'Guide each-picking and cluster workflows with barcode verification and clear exception handling — without rigid, legacy stacks.',
      checklist: [
        'Android-native devices (handhelds, wearables)',
        'Flexible integrations to WMS/ERP',
        'Configurable routes, prompts, and confirmations',
      ],
    },
    useCases: [
      { title: 'Each & Cluster Picking', body: 'Voice for navigation, on-screen clarity for item images/options, scan to confirm every pick.' },
      { title: 'Returns & QC', body: 'Guided checks with barcode capture and notes for re-stock or disposition.' },
      { title: 'Packout Handoffs', body: 'SilentScan™ during rapid scan streaks; minimal noise and maximum focus at pack stations.' },
    ],
    cardSummary: {
      tagline: 'Accuracy and speed for dense SKU environments and fast order cycles.',
      bullets: [
        'Item-level confirmations',
        'Structured routes and prompts',
        'Reliable performance at peak',
      ],
    },
  },
  {
    slug: 'manufacturing-kitting',
    name: 'Manufacturing & Kitting',
    shortName: 'Manufacturing',
    heroSub:
      'Verified steps and component accuracy. Multimodal guidance combines voice pacing, on-screen visuals, and barcode checks to standardize assemblies and kits.',
    whyItWorks: [
      { label: 'Step certainty', body: 'Voice pacing plus on-screen visuals ensure correct sequence and orientation.' },
      { label: 'Component verification', body: 'Barcode scans capture lots/serials at the point of use.' },
      { label: 'Quality gates', body: 'Insert mandatory checks or secondary approvals where needed.' },
      { label: 'SilentScan™', body: 'Mutes voice during scan-heavy phases, switching back automatically when scanning slows.' },
    ],
    builtFor: {
      heading: 'Integrates with Your Processes',
      body: 'Connect to WMS/ERP and MES via APIs or files; configure prompts per assembly, line, or station.',
      checklist: [
        'Android-native across handhelds and wearables',
        'Part/lot verification via scanning',
        'Role-based workflows and sign-offs',
      ],
    },
    useCases: [
      { title: 'BOM-Driven Kitting', body: 'Guide each component pick with scan checks and on-screen visuals for variants.' },
      { title: 'Light Assembly', body: 'Voice-paced steps with embedded quality gates and barcode confirmations for critical parts.' },
      { title: 'Lot/Serial Capture', body: 'Scan and store lot/serials at point of use for traceability and audits.' },
    ],
    cardSummary: {
      tagline: 'Guided steps and verified components for assembly and light manufacturing.',
      bullets: [
        'Standardized instructions',
        'Barcode checks for parts',
        'Hands-free pace with voice',
      ],
    },
  },
  {
    slug: 'grocery-cpg',
    name: 'Grocery & CPG',
    shortName: 'Grocery & CPG',
    heroSub:
      'Reliable performance in ambient, cooler, and freezer zones. Multimodal picking combines voice pace, on-screen clarity, and barcode checks.',
    whyItWorks: [
      { label: 'Temperature-tough', body: 'Voice prompts remain clear; on-screen cues help with substitutions and catch-weight items.' },
      { label: 'Accuracy where it counts', body: 'Scan checks for date/lot, regulated items, and similar-looking SKUs.' },
      { label: 'Hands-free pace', body: 'Keep case and each picks moving in high-volume areas.' },
      { label: 'SilentScan™', body: 'Mute voice during rapid scan streaks near fans, docks, or packout; resume voice automatically.' },
    ],
    builtFor: {
      heading: 'Built for Real Aisles',
      body: 'Support case/eaches, backroom replenishment, and aisle moves with flexible prompts and confirmations per department.',
      checklist: [
        'Android-native on rugged handhelds and wearables',
        'Lot/expiry capture via scanning',
        'Configurable workflows per zone or store format',
      ],
    },
    useCases: [
      { title: 'Case & Each Picking', body: 'Voice for pace; scan for accuracy on similar SKUs, substitutions, or catch-weight items.' },
      { title: 'Replenishment', body: 'Guided moves across temperature zones with barcode confirmation and exception notes.' },
      { title: 'Expiry/Lot Capture', body: 'Capture and validate date/lot at pick time; support audits and recalls.' },
    ],
    cardSummary: {
      tagline: 'Dependable operations in demanding, temperature-tough environments.',
      bullets: [
        'Consistent picks across shifts',
        'Android-native device options',
        'Multimodal guidance for accuracy',
      ],
    },
  },
]
