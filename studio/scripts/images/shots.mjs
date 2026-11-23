// node shots.mjs <prefix> <path>...  → full-page JPEGs at 1440 and 390 (reduced motion) + console errors.
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("/Users/chetan/Documents/pocket-portfolio-template/node_modules/playwright-core");
const dir = process.env.OUT || "/tmp/";
const [pre, ...paths] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
for (const [tag, viewport] of [["d", { width: 1440, height: 900 }], ["m", { width: 390, height: 844 }]]) {
  const ctx = await browser.newContext({ viewport, reducedMotion: process.env.MOTION ? "no-preference" : "reduce", deviceScaleFactor: 1 });
  for (const p of paths) {
    const page = await ctx.newPage(); const errs = [];
    page.on("console", (m) => m.type() === "error" && errs.push(m.text())); page.on("pageerror", (e) => errs.push(String(e)));
    await page.goto("http://localhost:4321" + p, { waitUntil: "networkidle" });
    for (let y = 0; y < (await page.evaluate(() => document.body.scrollHeight)); y += 700) { await page.evaluate((y) => scrollTo(0, y), y); await page.waitForTimeout(60); }
    await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(400);
    const f = `${dir}${pre}${p.replace(/[/?=&]/g, "_")}-${tag}.jpg`;
    await page.screenshot({ path: f, fullPage: true, type: "jpeg", quality: 55 });
    const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    console.log(f, errs.length ? "ERR " + errs.join(" | ") : "", over > 0 ? "OVERFLOW " + over : "");
    await page.close();
  }
  await ctx.close();
}
await browser.close();
