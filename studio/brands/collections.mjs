import { mast, details, rupees, printButton, esc } from "./common.mjs";
export function forma(c) {
  const { path, img, link, action, result } = c;
  const looks = [
    [
      "blunt-bob",
      "The blunt bob",
      "salon-hero",
      "Mira",
      0,
      "A clean perimeter with a little weight left through the ends.",
    ],
    [
      "soft-layers",
      "Soft layers",
      "salon-cut",
      "Alex",
      0,
      "Long layers shaped to move when the hair dries naturally.",
    ],
    [
      "brushed-waves",
      "Brushed waves",
      "salon-blowout",
      "Mira",
      2,
      "A round-brush finish with soft lift at the roots.",
    ],
    [
      "ribbon-colour",
      "Ribbon colour",
      "salon-colour",
      "Alex",
      1,
      "Fine ribbons of colour through the mid-lengths.",
    ],
    [
      "gloss-finish",
      "Gloss finish",
      "salon-colour",
      "Mira",
      1,
      "A tonal gloss with a quiet, reflective finish.",
    ],
    [
      "volume-set",
      "Volume set",
      "salon-blowout",
      "Alex",
      2,
      "A full blow-dry with rounded ends and a swept parting.",
    ],
  ];
  const prices = ["₹1,600 · 60 min", "₹4,200 · 120 min", "₹950 · 45 min"];
  const card = (l) =>
    link(
      "looks/" + l[0],
      img(l[2], l[1]) +
        `<strong>${l[1]}</strong><small>${l[3]} · ${prices[l[4]]}</small>`,
    );
  const top = mast(c, "FORMA", [
    ["", "Lookbook"],
    ["stylists", "The stylists"],
    ["services", "Service menu"],
  ]);
  if (!path || path === "looks") {
    const filter = c.query.get("stylist");
    const shown = looks.filter(
      (l) => !["Mira", "Alex"].includes(filter) || l[3] === filter,
    );
    return result(
      "Forma · The lookbook",
      top +
        `<section class="fashion-cover">${img("salon-hero", "Sculpted dark bob in profile")}<div><p>Koregaon Park · Hair studio</p><h1>The<br><i>lookbook.</i></h1>${link("looks/blunt-bob", "Explore the blunt bob", "action")}</div></section><section class="inner"><div class="spread-title"><h2>Cut, colour & finish</h2><nav>${[
          ["", "All looks"],
          ["Mira", "Mira"],
          ["Alex", "Alex"],
        ]
          .map(([v, t]) => link("looks", t, "", { stylist: v }))
          .join(
            " ",
          )}</nav></div><div class="looks">${shown.map(card).join("")}</div></section>`,
      "salon-hero",
    );
  }
  const l = looks.find((x) => path === "looks/" + x[0]);
  if (l)
    return result(
      l[1],
      top +
        `<section class="look-detail">${img(l[2], l[1])}<article><p>Lookbook / ${l[3]}</p><h1>${l[1]}</h1><p>${l[5]}</p>${details(
          [
            ["At the studio", prices[l[4]]],
            ["Stylist", link("stylists/" + l[3].toLowerCase(), l[3])],
          ],
        )}${action("Book this look", { service: l[4], stylist: l[3] === "Mira" ? 1 : 2 })}</article></section>`,
      l[2],
    );
  if (path === "services")
    return result(
      "Service menu",
      top +
        '<section class="inner"><h1>Service menu</h1>' +
        ["Cut & finish", "Lived-in colour", "Signature blowout"]
          .map(
            (s, i) =>
              `<div class="menu-line"><b>${s}</b><span>${prices[i]}</span>${action("Choose a time", { service: i })}</div>`,
          )
          .join("") +
        "</section>",
    );
  if (
    path === "stylists" ||
    ["stylists/mira", "stylists/alex"].includes(path)
  ) {
    const staff = ["Mira", "Alex"].filter(
      (s) => path === "stylists" || path.endsWith(s.toLowerCase()),
    );
    return result(
      "The stylists",
      top +
        '<section class="inner"><h1>The stylists</h1><div class="looks">' +
        staff
          .map((s) =>
            link(
              "stylists/" + s.toLowerCase(),
              img("salon-stylist-" + s.toLowerCase(), s) + "<h2>" + s + "</h2>",
            ),
          )
          .join("") +
        '</div><h2>Selected looks</h2><div class="looks">' +
        looks
          .filter((l) => staff.includes(l[3]))
          .map(card)
          .join("") +
        "</div></section>",
    );
  }
}
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
