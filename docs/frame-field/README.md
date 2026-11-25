# Frame & Field

Frame & Field is a fictional Pune photography studio built as a Chetan Studio portfolio example. Projects, people and INR prices are illustrative. Enquiries, quote briefs and contact messages can be copied, downloaded or optionally saved on a visitor’s device.

## Explore

- [Standalone studio](https://studio-lilac-five.vercel.app/site/frame-field)
- [Demo with portfolio navigation](https://studio-lilac-five.vercel.app/demo/frame-field)
- [Chetan Studio case study](https://studio-lilac-five.vercel.app/work/frame-field)
- [Research and baseline review](research.md), [photography inventory](photography.md), [browser QA and screenshots](qa.md), [Lighthouse measurements](performance.md)

## Website contents

Both studio prefixes serve the homepage, selected work, the complete archive, 16 project case studies, services index, eight dedicated service guides, pricing, about, the studio tour, journal, seven articles, booking planner, quotation planner, contact, FAQs, privacy, booking terms and a branded missing-page response. Previous series and individual photograph links remain usable.

The source lives under `studio/brands/frame-field/`. The browser module and stylesheet are `studio/site/frame-field-studio.js` and `studio/site/kit-frame-field.css`. The configuration in `editorial.mjs` contains studio details, packages and extras. Real business contacts can be added when commissioned. The standalone site and its portfolio preview use noindex metadata.

Vercel Web Analytics is integrated in the Vercel HTML entry point. It measures public page visits and excludes the owner page. The before-send hook removes URL queries and fragments. Brief contents and contact fields are never passed to analytics.
