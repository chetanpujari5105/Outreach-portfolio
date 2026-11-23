import { mast } from "./common.mjs";
const series = [
  [
    "portrait",
    "Portrait studies",
    "People in the studio",
    [
      ["frame-portrait", "Side light"],
      ["salon-stylist-mira", "Mira, a studio sitting"],
      ["salon-stylist-alex", "Alex, a studio sitting"],
    ],
  ],
  [
    "product",
    "Objects in light",
    "A study of texture and surfaces",
    [
      ["frame-product", "Glass and shadow"],
      ["ledger-care-kit", "The care set"],
      ["loom-pouch", "Indigo cloth"],
    ],
  ],
  [
    "event",
    "After hours",
    "Light, tables and the gathering room",
    [
      ["frame-event", "The gathering"],
      ["hall-cocktail", "Before the doors open"],
      ["hall-banquet", "Dinner tables"],
    ],
  ],
];
export function archive(c) {
  const { path, img, link, result, action } = c;
  const top = mast(c, "Frame & Field", [
    ["", "Archive"],
    ["commission", "Commissions"],
  ]);
  if (!path)
    return result(
      "Photographic archive",
      top +
        `<section class="archive"><aside><h1>Selected<br>photographs</h1><p>Pune & on location</p>${series.map((s) => link("series/" + s[0], s[1])).join("")}</aside><div class="contact-sheet">${series.map(([id, title, , photos]) => link("series/" + id, img(photos[0][0], title) + "<span>" + title + "</span>")).join("")}</div></section>`,
      "frame-portrait",
    );
  if (path === "commission")
    return result(
      "Commission information",
      top +
        '<article class="essay"><h1>Commission a series</h1><p>For a portrait sitting, bring one reference image and an idea of where the portrait will appear. For an object study, agree the surfaces, scale and delivery format before the shoot.</p>' +
        action("Prepare a shoot brief") +
        "</article>",
    );
  for (const [id, title, desc, photos] of series) {
    const root = "series/" + id;
    if (path === root)
      return result(
        title,
        top +
          `<section class="inner"><h1>${title}</h1><p>${desc}</p><div class="series-sheet">${photos.map(([pic, cap], i) => link(root + "/image/" + (i + 1), img(pic, cap) + "<span>" + cap + "</span>")).join("")}</div>${action("Commission this series", { shoot: id })}</section>`,
        photos[0][0],
      );
    const index = photos.findIndex(
      (_, i) => path === root + "/image/" + (i + 1),
    );
    if (index < 0) continue;
    const [pic, cap] = photos[index];
    return result(
      cap,
      top +
        `<figure class="image-view">${img(pic, cap)}<figcaption><b>${title}</b><span>${cap} · ${index + 1} / ${photos.length}</span></figcaption></figure><div class="archive-nav">${link(root + "/image/" + (((index + photos.length - 1) % photos.length) + 1), "Previous photograph", "prev-photo")}${link(root, "Close viewer")}${link(root + "/image/" + (((index + 1) % photos.length) + 1), "Next photograph", "next-photo")}</div>`,
      pic,
    );
  }
}
