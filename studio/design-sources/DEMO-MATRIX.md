# Industry demo matrix

One studio demo per industry on /industries. Each uses the shared flow engine
(`site/flow.js`) with its own config (`site/kits.js`), stylesheet
(`site/kit-<name>.css`), fonts and ChatGPT photography (hero + 3).
Image file names (public/assets/<name>.webp) must match kits.js; `node scripts/check-demos.mjs` lists any missing.
Images: one ChatGPT chat per demo; every prompt says "single standalone photo,
not a collage" and "no text". Originals in `design-sources/<name>/`.

Already done (custom code in `site/demos.js`): salons → Studio Forma,
cafés → Daybreak Café, billing → Ledger Desk. "Other businesses" stays a finder.
Real projects (Manakar, LaptopBuyGuide, Velluto GT, Pocket Portfolio) stay as related work.

| # | Industry | Demo | Palette | Fonts | Layout | Core interaction | Images | Status |
|---|----------|------|---------|-------|--------|------------------|--------|--------|
| 1 | hospitality | Casa Neem homestay | terracotta, indigo, sand | Fraunces / Work Sans | postcard split | room cards → dates + guests (capacity) → add-ons → nightly total | neem-hero, neem-garden, neem-loft, neem-family | done: photos + QA 1440/800/390 |
| 2 | events | Hall Eleven venue | midnight navy, champagne | Cormorant Garamond / Inter Tight | full-bleed night | event type → guests + setup (capacity per setup) → add-ons → per-head estimate | hall-hero, hall-banquet, hall-theatre, hall-cocktail | done: photos + QA 1440/800/390 |
| 3 | home-services | Brightnest cleaning | mint, sunshine yellow, white | Outfit | rounded friendly | property → bed/bath steppers → extras → frequency discount → visit slot | nest-hero, nest-standard, nest-deep, nest-move | done: photos + QA 1440/800/390 |
| 4 | fitness-studios | Kinetic Yard | black, electric orange | Unbounded / Inter | bold poster | goal + level → timetable with spots left → trial booking | yard-hero, yard-strength, yard-flow, yard-box | done: photos + QA 1440/800/390 |
| 5 | education | Brightpath Tutors | sky blue, tangerine, ruled paper | Bricolage Grotesque / Literata | notebook | subject + level → format → weekly slot → trial lesson | path-hero, path-maths, path-science, path-english | done: photos + QA 1440/800/390 |
| 6 | pet-care | Wagtail Lodge | plum, mustard, cream | Fredoka / Nunito Sans | playful rounded | pet size + count → suite → dates → add-ons + vaccination check | wag-hero, wag-standard, wag-garden, wag-deluxe | done: photos + QA 1440/800/390 |
| 7 | therapy-practices | Stillwater Practice | sage, lilac, mist | Lora / Karla | calm airy | support type → mode → first-session slot → gentle intake | still-hero, still-session, still-online, still-garden | done: photos + QA 1440/800/390 |
| 8 | creatives | Frame & Field | monochrome, film orange | Syne / IBM Plex Sans | gallery grid | portfolio filter → shoot type → deliverables + usage → brief | frame-hero, frame-portrait, frame-product, frame-event | done: photos + QA 1440/800/390 |
| 9 | retail | Loom & Lane | denim indigo, oat | DM Serif Display / Jost | shop grid | filter products → size/colour → quantity → item enquiry | loom-hero, loom-jacket, loom-shirt, loom-tote, loom-scarf, loom-throw, loom-pouch | done: photos + QA 1440/800/390 |
| 10 | automotive | Gloss Lab | carbon, signal orange, chrome | Chakra Petch / Inter | tech dashboard | vehicle size → package → add-ons → total + duration → drop-off | gloss-hero, gloss-wash, gloss-polish, gloss-ceramic | done: photos + QA 1440/800/390 |
| 11 | professionals | Northline Advisory | navy, brass, paper | Newsreader / Inter | editorial memo | topic → stage + urgency → documents → consultation length | north-hero, north-tax, north-growth, north-legal | done: photos + QA 1440/800/390 |
| 12 | wholesale | Mill & Crate | kraft, industrial blue | IBM Plex Sans / IBM Plex Mono | spec sheet | product → material + size + finish → qty (MOQ, tiered price) → RFQ | mill-hero, mill-mailer, mill-rigid, mill-shipper | done: photos + QA 1440/800/390 |
