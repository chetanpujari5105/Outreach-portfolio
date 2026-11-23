# Industry demo matrix

One studio demo per industry on /industries. Each uses the shared flow engine
(`site/flow.js`) with its own config (`site/kits.js`), stylesheet
(`site/kit-<name>.css`), fonts and ChatGPT photography (hero + 3).
Images: one ChatGPT chat per demo; every prompt says "single standalone photo,
not a collage" and "no text". Originals in `design-sources/<name>/`.

Already done (custom code in `site/demos.js`): salons → Studio Forma,
cafés → Daybreak Café, billing → Ledger Desk. "Other businesses" stays a finder.
Real projects (Manakar, LaptopBuyGuide, Velluto GT, Pocket Portfolio) stay as related work.

| # | Industry | Demo | Palette | Fonts | Layout | Core interaction | Images | Status |
|---|----------|------|---------|-------|--------|------------------|--------|--------|
| 1 | hospitality | Casa Neem homestay | terracotta, indigo, sand | Fraunces / Work Sans | postcard split | room cards → dates + guests (capacity) → add-ons → nightly total | hero, room-garden, room-loft, room-family | |
| 2 | events | Hall Eleven venue | midnight navy, champagne | Cormorant Garamond / Inter Tight | full-bleed night | event type → guests + setup (capacity per setup) → add-ons → per-head estimate | hero, setup-banquet, setup-theatre, setup-cocktail | |
| 3 | home-services | Brightnest cleaning | mint, sunshine yellow, white | Outfit | rounded friendly | property → bed/bath steppers → extras → frequency discount → visit slot | hero, clean-standard, clean-deep, clean-moveout | |
| 4 | fitness-studios | Kinetic Yard | black, electric orange | Unbounded / Inter | bold poster | goal + level → timetable with spots left → trial booking | hero, class-strength, class-flow, class-box | |
| 5 | education | Brightpath Tutors | sky blue, tangerine, ruled paper | Bricolage Grotesque / Literata | notebook | subject + level → format → weekly slot → trial lesson | hero, subject-maths, subject-science, subject-english | |
| 6 | pet-care | Wagtail Lodge | plum, mustard, cream | Fredoka / Nunito Sans | playful rounded | pet size + count → suite → dates → add-ons + vaccination check | hero, suite-standard, suite-garden, suite-deluxe | |
| 7 | therapy-practices | Stillwater Practice | sage, lilac, mist | Lora / Karla | calm airy | support type → mode → first-session slot → gentle intake | hero, room-session, room-online, room-garden | |
| 8 | creatives | Frame & Field | monochrome, film orange | Syne / IBM Plex Sans | gallery grid | portfolio filter → shoot type → deliverables + usage → brief | hero, shoot-portrait, shoot-product, shoot-event | |
| 9 | retail | Loom & Lane | denim indigo, oat | DM Serif Display / Jost | shop grid | filter products → size/colour → quantity → item enquiry | hero, product-jacket, product-tote, product-scarf | |
| 10 | automotive | Gloss Lab | carbon, signal orange, chrome | Chakra Petch / Inter | tech dashboard | vehicle size → package → add-ons → total + duration → drop-off | hero, pkg-wash, pkg-polish, pkg-ceramic | |
| 11 | professionals | Northline Advisory | navy, brass, paper | Newsreader / Inter | editorial memo | topic → stage + urgency → documents → consultation length | hero, topic-tax, topic-growth, topic-legal | |
| 12 | wholesale | Mill & Crate | kraft, industrial blue | IBM Plex Sans / IBM Plex Mono | spec sheet | product → material + size + finish → qty (MOQ, tiered price) → RFQ | hero, box-mailer, box-rigid, box-shipper | |
