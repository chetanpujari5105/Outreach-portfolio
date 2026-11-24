import { context, credit, mast } from "./common.mjs";
import { archive } from "./archive.mjs";
import { mill } from "./collections.mjs";
import { forma } from "./forma.mjs";
import { nest, wagtail } from "./visits.mjs";
import { hall } from "./hall.mjs";
import { kinetic } from "./yard.mjs";
import { casa } from "./casa.mjs";
import { daybreak } from "./daybreak.mjs";
import { brightpath, stillwater, loom, gloss, north } from "./practices.mjs";
const entries = {
  "daybreak-cafe": [daybreak, "Daybreak Café", "Book a table"],
  "salon-booking": [forma, "Studio Forma", "Book an appointment"],
  "frame-field": [archive, "Frame & Field", "Commission brief"],
  "mill-crate": [mill, "Mill & Crate", "Configure packaging"],
  "kinetic-yard": [kinetic, "Kinetic Yard", "Trial pass"],
  "casa-neem": [casa, "Casa Neem", "Stay enquiry"],
  "hall-eleven": [hall, "Hall Eleven", "Plan an event"],
  brightnest: [nest, "Brightnest", "Visit estimator"],
  "wagtail-lodge": [wagtail, "Wagtail Lodge", "Plan a stay"],
  brightpath: [brightpath, "Brightpath", "Trial lesson"],
  stillwater: [stillwater, "Stillwater", "Appointment request"],
  "loom-lane": [loom, "Loom & Lane", "Hold a piece"],
  "gloss-lab": [gloss, "Gloss Lab", "Drop-off estimate"],
  northline: [north, "Northline Advisory", "Consultation brief"],
  "studio-billing": [ledger, "Ledger Desk", "Invoice editor"],
};
function ledger(c) {
  const { path, result, link } = c;
  const top = mast(c, "Ledger Desk", [
    ["", "Register"],
    ["customers", "Customers"],
    ["request", "Invoice editor"],
  ]);
  if (!path)
    return result(
      "Invoice register",
      top +
        `<section class="ledger-app"><aside><b>Studio accounts</b>${link("", "Invoice register")}${link("customers", "Customer directory")}</aside><article><div class="spread-title"><h1>Invoices</h1>${link("request", "Create invoice", "action")}</div><p>Issued in this browser session</p><div data-register></div></article></section>`,
      "ledger-hero",
    );
  if (path === "customers")
    return result(
      "Customer directory",
      top +
        '<section class="inner"><h1>Customer directory</h1>' +
        ["Fern House Studio", "Sunday Goods", "Mira & Co."]
          .map((n, i) =>
            link("request", n + "<small>Prepare invoice</small>", "menu-line", {
              customer: i,
            }),
          )
          .join("") +
        "</section>",
    );
}
// Each website stands alone at /site/<slug>: its own brand, no portfolio navigation.
export function brandPage(slug, path, query) {
  if (!Object.hasOwn(entries, slug)) return;
  const [render, name, cta] = entries[slug],
    c = context(slug, path, query, "/site/" + slug);
  // A full-site renderer may draw its own request page; otherwise wrap the booking flow in the plain mast.
  let p =
    render(c) ||
    (path === "request"
      ? c.result(
          cta,
          mast(c, name, [["", "Back to " + name]]) +
            `<div class="workflow"><h1>${cta}</h1><div id="demo-root" data-slug="${slug}"></div></div>`,
        )
      : undefined);
  if (!p) return;
  const ink = { "casa-neem": ["#a64c26", "#f6efe1"], "salon-booking": ["#a52f2d", "#eee8df"], "kinetic-yard": ["#ff5a1f", "#0c0c0c"], "hall-eleven": ["#d8b46a", "#10142a"], "daybreak-cafe": ["#15392d", "#f8f3e5"] }[slug] || ["#232421", "#f8f7f2"];
  const favicon = "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${ink[0]}"/><text x="32" y="45" text-anchor="middle" font-family="Georgia,serif" font-size="40" fill="${ink[1]}">${name[0]}</text></svg>`);
  return {
    brand: true,
    status: p.status,
    favicon,
    theme: ink[1],
    clean: true, // read by render.mjs: the page title belongs to the business
    noindex: true, // no hosted website represents a business that is ready for public indexing
    // A full brand site can opt out of demos.css (category: "brand"), which only styles the older one-page demos.
    category: p.category || "demos",
    // Full brand sites without a kits.js flow still get their own kit-<slug>.css.
    kit: c.kit || ["salon-booking", "daybreak-cafe"].includes(slug) ? slug : "",
    title: p.title + " · " + name,
    description: p.description || p.title + " · " + name,
    image:
      "/assets/" +
      (p.image ||
        c.kit?.hero.img ||
        (slug === "studio-billing" ? "ledger-hero" : "salon-hero")) +
      ".webp",
    body: `<section class="brand b-${slug}">${p.html}${/class="(site-foot|ff-footer)/.test(p.html) ? "" : `<footer class="brand-credit">${credit}</footer>`}</section>`,
  };
}
