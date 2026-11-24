# Chetan Studio portfolio

The [live Chetan Studio portfolio](https://chetan-studio-work.earthykayak64.chatgpt.site) presents professional websites, booking experiences, business tools and digital products for modern businesses. Open the [industry directory](https://chetan-studio-work.earthykayak64.chatgpt.site/industries) to choose a website to share with a prospect.

The [redesign plan](docs/INDUSTRY-REDESIGN-PLAN.md) records the research and customer journey for each industry. The [visual overview](docs/redesigned-demo-overview.jpg) shows the redesigned websites side by side.

- `studio/` — the website (vinext / Next-compatible, Cloudflare Workers + D1). See `studio/README.md`.
- `PORTFOLIO-PLAN.md` — build and outreach plan.

## Projects and addresses
Project records live in `studio/site/catalog.js`. `kind` (website, product, tool) drives filters and labels; `ownership`, `hosted`, `url`, `previewUrl`, `image` and `status` are separate facts. `Client work` is only for confirmed commissions (Manakar, Nukkad Naai).

| Address | What it is |
|---|---|
| `/work/<slug>` | Case study |
| `/site/<slug>` | Standalone website (not indexed) |
| `/demo/<slug>/…` | Earlier address; redirects to `/site/<slug>/…` with its subpage and query |

**State of the hosted websites (24 November 2026).** Locally implemented: browsing, planners, estimates and saved requests run in the visitor's browser and send nothing. Awaiting configuration: each business's own phone, email, WhatsApp and booking or payment service. The studio's own `/sample` form saves enquiries to D1.

Checks (from `studio/`): `node scripts/check-demos.mjs`, `node scripts/check-brand-routes.mjs`, `npm run lint`, `npm run build`.

## Other files
- `SKILLS-MAP.md`, `LAPTOP-SKILLS*.tsv` — skill inventory used while building.

## Run locally
```sh
cd studio
npm ci
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute SITE_DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_messy_brother_voodoo.sql
npm start -- --port 8788
```
Owner inbox: `/owner` (needs `INTAKE_ADMIN_TOKEN`, 32+ chars, set as a secret).

## Deploy (Cloudflare Workers + D1, free tier)
```sh
cd studio
npx wrangler login                                   # once, in your browser
npx wrangler d1 create chetan-studio-db              # copy the database_id it prints
export D1_DATABASE_NAME=chetan-studio-db D1_DATABASE_ID=<id>
npm run build
npx wrangler d1 execute SITE_DB --remote --config dist/server/wrangler.json --file drizzle/0000_messy_brother_voodoo.sql
npx wrangler deploy --config dist/server/wrangler.json
npx wrangler secret put INTAKE_ADMIN_TOKEN --config dist/server/wrangler.json   # 32+ chars, unlocks /owner
```
