import { mast, details, rupees, printButton, esc } from "./common.mjs";
export function mill(c) {
  const { path, link, img, opts, result, action } = c;
  const rows = opts("box");
  const top = mast(c, "MILL & CRATE", [
    ["", "Catalog"],
    ["compare", "Compare specs"],
    ["rfq", "RFQ basket"],
  ]);
  const codes = ["MC–102", "MC–204", "MC–306"];
  const dimensions = [
    "200 × 150 × 80 mm",
    "200 × 150 × 80 mm",
    "200 × 150 × 80 mm",
  ];
  const table = (rs) =>
    `<div class="sku-table"><div class="sku-head"><span>Part / family</span><span>Standard size</span><span>Base unit</span></div>${rs
      .map((o) => {
        const i = rows.indexOf(o);
        return link(
          "sku/" + o.id,
          img(o.img, o.label) +
            `<strong>${o.label}<small>${codes[i]}</small></strong><span>${dimensions[i]}</span><b>${rupees(o.price)}</b>`,
          "sku-row",
        );
      })
      .join("")}</div>`;
  if (!path) {
    const q = c.query.get("q") || "";
    return result(
      "Packaging catalog",
      top +
        `<section class="industrial"><div class="tech-head"><div><p>Chakan MIDC / Packaging supply</p><h1>Packaging<br>catalogue.</h1></div>${img("mill-hero", "Corrugated packaging on the production floor")}</div><form class="search-line"><label>Find a box or part number<input type="search" name="q" value="${esc(q)}" placeholder="Mailer, carton, MC…"></label><button>Search</button></form>${table(rows.filter((r, i) => (r.label + codes[i]).toLowerCase().includes(q.toLowerCase().replaceAll("-", "–"))))}${q ? link("", "Clear search") : ""}</section>`,
      "mill-hero",
    );
  }
  if (path === "compare")
    return result(
      "Compare packaging specifications",
      top +
        '<section class="industrial"><h1>Compare specifications</h1>' +
        table(rows) +
        details([
          ["Minimum run", "250 units per SKU"],
          ["1,000+ units", "12% volume reduction"],
          ["5,000+ units", "22% volume reduction"],
        ]) +
        printButton +
        "</section>",
    );
  if (path === "rfq")
    return result(
      "RFQ basket",
      top +
        '<section class="industrial"><h1>Request worksheet</h1><p>Natural kraft · standard size · plain print. Ex-works estimate before tax and freight.</p><div data-basket="mill-crate"></div>' +
        link("", "Add another box", "action") +
        " " +
        printButton +
        "</section>",
    );
  const o = rows.find((o) => path === "sku/" + o.id);
  if (o) {
    const i = rows.indexOf(o);
    return result(
      o.label,
      top +
        `<section class="product-detail">${img(o.img, o.label)}<article><p>Part ${codes[i]}</p><h1>${o.label}</h1><p>${o.detail}</p>${details(
          [
            ["Dimensions", dimensions[i]],
            ["Base unit", rupees(o.price)],
            ["Minimum run", "250 units"],
          ],
        )}<form data-add="mill-crate" data-id="${o.id}"><label>Quantity<input type="number" name="qty" value="1000" min="250" max="20000" step="250" required></label><button>Add to RFQ basket</button></form>${action("Configure material and print", { box: o.id })}</article></section>`,
      o.img,
    );
  }
}
