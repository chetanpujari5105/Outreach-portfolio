import { context, mast } from "./common.mjs";
import { archive } from "./archive.mjs";
import { forma, mill } from "./collections.mjs";
import { kinetic, hall, nest, wagtail } from "./visits.mjs";
import { casa } from "./casa.mjs";
import { brightpath, stillwater, loom, gloss, north } from "./practices.mjs";
const entries = {
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
// clean: the white-label /site/<slug> copy a prospect sees, with no studio bar and no "studio demo" wording.
export function brandPage(slug, path, query, clean = false) {
  if (!Object.hasOwn(entries, slug)) return;
  const [render, name, cta] = entries[slug],
    c = context(slug, path, query, (clean ? "/site/" : "/demo/") + slug);
  c.clean = clean;
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
  const bar = clean
    ? ""
    : `<div class="studio-return"><a href="/work/${slug}">Chetan Studio</a><span>Studio demo</span><a href="/site/${slug}${path ? "/" + path : ""}">Clean share link</a><a href="/sample?project=${slug}">Request a similar site</a></div>`;
  const ink = { "casa-neem": ["#a64c26", "#f6efe1"] }[slug] || ["#232421", "#f8f7f2"];
  const favicon = "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${ink[0]}"/><text x="32" y="45" text-anchor="middle" font-family="Georgia,serif" font-size="40" fill="${ink[1]}">${name[0]}</text></svg>`);
  return {
    brand: true,
    favicon,
    theme: ink[1],
    clean,
    noindex: clean,
    category: "demos",
    kit: c.kit ? slug : "",
    title: clean ? p.title + " · " + name : p.title,
    description: p.description || p.title + " · " + name + (clean ? "" : " studio demo"),
    image:
      "/assets/" +
      (p.image ||
        c.kit?.hero.img ||
        (slug === "studio-billing" ? "ledger-hero" : "salon-hero")) +
      ".webp",
    body: `${bar}<section class="brand b-${slug}${clean ? " is-clean" : ""}">${p.html}</section>`,
  };
}
