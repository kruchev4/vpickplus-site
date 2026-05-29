# public/assets — image and static asset directory

This is where your existing images go. Copy your current site's `/assets/` folder
contents into this directory. The most important files referenced by the new site:

## Required (referenced throughout the site)

- `brand/vpickplus-logo.svg` — your logo (the teal V + "Pick" SVG)
- `icons/favicon-32.png`
- `icons/apple-touch-icon.png`
- `icons/voice.svg`, `icons/screen.svg`, `icons/scan.svg`, `icons/silentscan.svg` — multimodal mode icons
- `hero/operator-android-headset.jpg` — VPick+ product page hero image
- `hero/generic-android-device.png` — leasing page hero image
- `livemap-banner.png` — LiveMap homepage and product page banner
- `social/vpickplus-social.png` — Open Graph / Twitter share image

## Optional (used by /qms when you swap placeholders to real images)

- `qms/dashboard.png`
- `qms/env.png`
- `qms/workorders.png`
- `qms/documents.png`
- `qms/alerts.png`
- `qms/training.png`
- `qms/hero.png` (for the QMS product page hero)

If any of these are missing, the corresponding image just won't display — the rest
of the page still works.
