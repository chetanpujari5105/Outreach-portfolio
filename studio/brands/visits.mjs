import { mast, details, rupees, esc, printButton } from "./common.mjs";
import { todayAt, dayOffset, dateText } from "../site/demos.js";
export function nest(c) {
  const { path, opts, img, link, result, action } = c;
  const top = mast(c, "brightnest", [
    ["", "Coverage"],
    ["services", "Cleaning menu"],
    ["prepare", "Before we arrive"],
  ]);
  const types = opts("clean");
  const areas = ["Hadapsar", "Kharadi", "Aundh", "Baner", "Koregaon Park"];
  const area = (c.query.get("area") || "").trim().slice(0, 100);
  const found = areas.find((a) => a.toLowerCase() === area.toLowerCase());
  const rows = types
    .map((o) =>
      link(
        "services/" + o.id,
        "<b>" + o.label + "</b><span>" + o.detail + "</span>",
        "menu-line",
      ),
    )
    .join("");
  if (!path)
    return result(
      "Home cleaning in Pune",
      top +
        `<section class="clean-cover"><div><p>Pune home cleaning</p><h1>A clean home,<br>on your street.</h1><form><label>Check your neighbourhood<input required name="area" list="areas" value="${esc(area)}" placeholder="e.g. Hadapsar"></label><datalist id="areas">${areas.map((a) => "<option>" + a + "</option>").join("")}</datalist><button>Check coverage</button></form>${area ? (found ? "We cover " + esc(found) + ". " + link("services", "Choose a clean") : "Outside our service area. Try " + areas.join(", ") + ".") : ""}</div>${img("nest-hero", "Sunlit living room after cleaning")}</section><section class="inner">${rows}</section>`,
      "nest-hero",
    );
  if (path === "services")
    return result(
      "Cleaning menu",
      top +
        '<section class="inner"><h1>Cleaning menu</h1>' +
        rows +
        "</section>",
    );
  if (path === "prepare")
    return result(
      "Before we arrive",
      top +
        '<article class="essay"><h1>Before your visit</h1><ul><li>Clear counters and floors of personal belongings.</li><li>Identify delicate finishes during the walkthrough.</li><li>Set aside keys or parking instructions for the team.</li></ul>' +
        action("Estimate a visit") +
        "</article>",
    );
  const o = types.find((o) => path === "services/" + o.id);
  if (o)
    return result(
      o.label,
      top +
        `<section class="product-detail">${img(o.img, o.label + " cleaning")}<article><h1>${o.label}</h1><p>${o.detail}</p><h2>Optional tasks</h2><p>Fridge interiors, ovens, balconies and windows can be added separately.</p>${action("Price this clean", { clean: o.id })}</article></section>`,
      o.img,
    );
}
export function wagtail(c) {
  const { path, opts, img, link, result, action } = c;
  const suites = opts("suite", { size: "small", species: "dog", pets: 1 });
  const top = mast(c, "Wagtail Lodge", [
    ["", "Lodge tour"],
    ["routine", "Daily routine"],
    ["packing", "Packing list"],
  ]);
  if (!path)
    return result(
      "Tour the lodge",
      top +
        `<section class="lodge"><header><h1>Come on in.</h1><p>A tour of the boarding lodge in Wakad.</p></header><div class="lodge-map">${suites.map((s, i) => link("suites/" + s.id, img(s.img, s.label) + "<strong>" + s.label + "</strong>", "cabin c" + i)).join("")}</div></section>`,
      "wag-hero",
    );
  if (path === "packing")
    return result(
      "Packing checklist",
      top +
        '<article class="essay"><h1>In their bag</h1>' +
        [
          "Labelled food portions",
          "A familiar blanket",
          "A well-fitting lead or carrier",
          "Vaccination record for check-in",
        ]
          .map(
            (t) =>
              '<label class="check"><input type="checkbox"> ' + t + "</label>",
          )
          .join("") +
        printButton +
        "</article>",
    );
  if (path === "routine")
    return result(
      "A day at the lodge",
      top +
        '<article class="essay"><h1>A day at the lodge</h1>' +
        details([
          ["Morning", "Breakfast and a quiet settling-in walk"],
          ["Afternoon", "Rest in the suite and supervised play"],
          ["Evening", "Dinner and a final garden visit"],
        ]) +
        link("packing", "Open packing checklist", "action") +
        "</article>",
    );
  const o = suites.find((r) => path === "suites/" + r.id);
  if (o)
    return result(
      o.label,
      top +
        `<section class="product-detail">${img(o.img, o.label)}<article><h1>${o.label}</h1><p>${o.detail}</p>${details(
          [
            ["Nightly rate", rupees(o.price)],
            ["Capacity", o.cap + " pets"],
          ],
        )}${action("Plan their stay", { suite: o.id })}</article></section>`,
      o.img,
    );
}
