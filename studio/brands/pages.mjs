import { context, mast } from "./common.mjs";
import { archive } from "./archive.mjs";
import { forma, mill } from "./collections.mjs";
import { kinetic, casa, hall, nest, wagtail } from "./visits.mjs";
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
export function brandPage(slug, path, query) {
  if (!Object.hasOwn(entries, slug)) return;
  const [render, name, cta] = entries[slug],
    c = context(slug, path, query);
  let p =
    path === "request"
      ? c.result(
          cta,
          mast(c, name, [["", "Back to " + name]]) +
            `<div class="workflow"><h1>${cta}</h1><div id="demo-root" data-slug="${slug}"></div></div>`,
        )
      : render(c);
  if (!p) return;
  return {
    brand: true,
    category: "demos",
    kit: c.kit ? slug : "",
    title: p.title,
    description: p.title + " · " + name + " studio demo",
    image:
      "/assets/" +
      (p.image ||
        c.kit?.hero.img ||
        (slug === "studio-billing" ? "ledger-hero" : "salon-hero")) +
      ".webp",
    body: `<div class="studio-return"><a href="/work/${slug}">Chetan Studio</a><span>Studio demo</span><a href="/sample?project=${slug}">Request a similar site</a></div><section class="brand b-${slug}">${p.html}</section>`,
  };
}
