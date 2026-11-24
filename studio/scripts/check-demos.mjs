// Catalog self-check: every industry points at a real project, every hosted project can mount, every image exists.
// Run before committing: node scripts/check-demos.mjs
import { existsSync, readFileSync } from "node:fs";
import { industries, projects, solutions, kinds } from "../site/catalog.js";

const problems = [];
const demosSrc = readFileSync(new URL("../site/demos.js", import.meta.url), "utf8");
const custom = ["salon-booking", "daybreak-cafe", "studio-billing"].filter((s) => demosSrc.includes(`"${s}"`));
let kits = {};
try {
  globalThis.sessionStorage ??= { getItem: () => null, setItem() {} };
  ({ kits } = await import("../site/kits.js"));
} catch (e) {
  problems.push("kits.js failed to load: " + e.message);
}
if (projects[0].slug !== "sidekick" || projects.at(-1).slug !== "studio-billing") problems.push("collection must open with Sidekick and close with Ledger Desk");
const has = (s) => projects.some((p) => p.slug === s);
for (const i of industries) if (!has(i.project)) problems.push(`industry ${i.slug} → missing project ${i.project}`);
for (const s of solutions) for (const p of s.projects) if (!has(p)) problems.push(`solution ${s.slug} → missing project ${p}`);
for (const p of projects) {
  if (!existsSync(new URL("../public" + p.image, import.meta.url))) problems.push(`${p.slug}: card image ${p.image} missing`);
  if (!Object.hasOwn(kinds, p.kind)) problems.push(`${p.slug}: unknown kind ${p.kind}`);
  if (p.badge === "Client work" && p.ownership !== "client") problems.push(`${p.slug}: client badge on studio-owned work`);
  if (p.slug !== "daybreak-cafe")
    for (const shot of ["desktop", "mobile"]) if (!existsSync(new URL(`../public/assets/case-${p.slug}-${shot}.webp`, import.meta.url))) problems.push(`${p.slug}: case-${p.slug}-${shot}.webp missing`);
  if (!p.hosted) continue;
  if (p.url !== "/site/" + p.slug) problems.push(`${p.slug}: hosted address should be /site/${p.slug}`);
  const kit = kits[p.slug];
  if (!custom.includes(p.slug) && !kit) problems.push(`${p.slug}: hosted project has no kit or custom flow`);
  if (!kit) continue;
  if (!existsSync(new URL(`../site/kit-${p.slug}.css`, import.meta.url))) problems.push(`${p.slug}: site/kit-${p.slug}.css missing`);
  const imgs = [kit.hero.img];
  for (const step of kit.steps)
    for (const f of step.fields) {
      const opts = typeof f.options === "function" ? f.options({}) : f.options || [];
      for (const o of opts) if (o.img) imgs.push(o.img);
    }
  for (const img of imgs) if (!existsSync(new URL(`../public/assets/${img}.webp`, import.meta.url))) problems.push(`${p.slug}: /assets/${img}.webp missing`);
  if (kit.key !== p.slug) problems.push(`${p.slug}: kit key ${kit.key} should match slug`);
}
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`ok: ${industries.length} industries, ${projects.length} projects, ${Object.keys(kits).length} kits`);
