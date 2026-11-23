import { mast, details, rupees, esc, printButton } from "./common.mjs";
import { todayAt, dayOffset, dateText } from "../site/demos.js";
export function kinetic(c) {
  const { path, opts, link, result, img, action, query } = c;
  const goals = opts("goal");
  const today = todayAt("Asia/Kolkata");
  const dates = Array.from({ length: 7 }, (_, i) => dayOffset(today, i + 1));
  const date = dates.includes(query.get("date")) ? query.get("date") : dates[0];
  const top = mast(c, "KINETIC/YARD", [
    ["", "Timetable"],
    ["coaches", "Coaches"],
    ["first-visit", "First visit"],
  ]);
  const coaches = ["Dev", "Leena", "Kabir"];
  if (!path) {
    const evening = query.get("session") === "evening";
    const list = goals
      .flatMap((g, i) =>
        opts("klass", { goal: g.id, date, level: "new" }).map((s) => ({
          ...s,
          g,
          i,
        })),
      )
      .sort((a, b) => a.id.localeCompare(b.id))
      .filter((r) => !evening || r.id >= "17:00");
    return result(
      "Training timetable",
      top +
        `<section class="track-head"><h1>Training<br>timetable</h1>${img("yard-hero", "Strength training floor")}</section><section class="track-board"><nav class="weekdays">${dates.map((d) => link("", dateText(d, "en-IN", { weekday: "short", day: "numeric" }), d === date ? "active" : "", { date: d, session: evening ? "evening" : "all" })).join("")}</nav><div class="board-date"><h2>${dateText(date, "en-IN")}</h2>${link("", evening ? "All times" : "Evening sessions", "", { date, session: evening ? "all" : "evening" })}</div>${list.map((r) => link("classes/" + r.g.id, r.id + "<b>" + r.label.split(" · ")[1] + "</b><small>" + coaches[r.i] + " · " + r.detail + "</small>", "board-row", { date, klass: r.id })).join("")}</section>`,
      "yard-hero",
    );
  }
  if (path === "first-visit")
    return result(
      "First visit",
      top +
        '<article class="essay"><h1>First time on the floor?</h1><p>Arrive ten minutes before your session. Bring training shoes and water. Meet your coach at the front desk for a tour and a warm-up.</p>' +
        link("", "Choose your first class", "action") +
        "</article>",
    );
  if (path === "coaches")
    return result(
      "Coaching team",
      top +
        '<section class="inner"><h1>On the floor</h1>' +
        goals
          .map((g, i) =>
            link(
              "coaches/" + coaches[i].toLowerCase(),
              "<b>" + coaches[i] + "</b><span>" + g.label + "</span>",
              "menu-line",
            ),
          )
          .join("") +
        "</section>",
    );
  const coach = coaches.findIndex((n) => path === "coaches/" + n.toLowerCase());
  if (coach >= 0) {
    const goal = goals[coach];
    const bios = [
      "Dev focuses on the first five lifts, setting a comfortable starting load and repeating sound technique.",
      "Leena teaches short mobility sequences that can be adapted to a desk break or a full morning session.",
      "Kabir alternates short boxing intervals with deliberate recovery. Each session has a lower-impact option.",
    ];
    return result(
      "Coach " + coaches[coach],
      top +
        `<section class="product-detail">${img(goal.img, goal.label)}<article><p>Coaching team / ${goal.label}</p><h1>${coaches[coach]}</h1><p>${bios[coach]}</p>${link("classes/" + goal.id, "Explore the class", "action")}</article></section>`,
      goal.img,
    );
  }
  const i = goals.findIndex((g) => path === "classes/" + g.id);
  if (i >= 0) {
    const g = goals[i];
    const slots = opts("klass", { goal: g.id, date, level: "new" });
    const s = slots.find((v) => v.id === query.get("klass")) || slots[0];
    return result(
      s.label,
      top +
        `<section class="product-detail">${img(g.img, g.label)}<article><p>${dateText(date, "en-IN")} · ${s.id}</p><h1>${s.label.split(" · ")[1]}</h1><p>${g.detail} ${s.detail}</p>${link("coaches/" + coaches[i].toLowerCase(), "Meet " + coaches[i])}<p>${s.disabled ? link("", "Find another class", "action", { date }) : action("Claim a trial pass", { goal: g.id, date, klass: s.id })}</p></article></section>`,
      g.img,
    );
  }
}
export function hall(c) {
  const { path, opts, img, link, result, action } = c;
  const spaces = opts("setup");
  const top = mast(c, "HALL XI", [
    ["", "The floor"],
    ["menus", "Menus"],
    ["visit", "Plan a visit"],
  ]);
  if (!path)
    return result(
      "Explore the event floor",
      top +
        `<section class="venue-title">${img("hall-hero", "Hall Eleven dining room at night")}<h1>The evening,<br><i>in plan.</i></h1></section><section class="plan-room"><header><p>Hall Eleven · Baner</p><h2>Walk the floor</h2></header><div class="floorplan">${spaces.map((o, i) => link("spaces/" + o.id, "<span>" + o.label + "</span><small>Up to ${o.cap} guests</small>", "space s" + i)).join("")}</div></section>`,
      "hall-hero",
    );
  if (path === "menus")
    return result(
      "Menu packages",
      top +
        '<section class="inner"><h1>The table</h1>' +
        opts("menu")
          .map(
            (o) =>
              `<div class="menu-line"><b>${o.label}</b><p>${o.detail}</p>${action(rupees(o.price) + " / guest", { menu: o.id })}</div>`,
          )
          .join("") +
        "</section>",
    );
  if (path === "visit")
    return result(
      "Plan a visit",
      top +
        '<article class="essay"><h1>Walk through your evening.</h1><p>Bring your guest count, event date and preferred seating arrangement to compare the floor configurations.</p>' +
        action("Plan an event") +
        "</article>",
    );
  const o = spaces.find((o) => path === "spaces/" + o.id);
  if (o)
    return result(
      o.label + " layout",
      top +
        `<section class="product-detail">${img(o.img, o.label + " configuration")}<article><p>Hall Eleven · Floor layouts</p><h1>${o.label}</h1><p>${o.detail || o.label + " configuration for your event."}</p>${action("Estimate this setup", { setup: o.id })}${link("menus", "Explore menus", "text-act")}</article></section>`,
      o.img,
    );
}
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
        `<section class="clean-cover"><div><p>Pune home cleaning</p><h1>A clean home,<br>on your street.</h1><form><label>Check your neighbourhood<input required name="area" list="areas" value="${esc(area)}" placeholder="e.g. Hadapsar"></label><datalist id="areas">${areas.map((a) => "<option>" + a + "</option>").join("")}</datalist><button>Check coverage</button></form>${area ? (found ? "We cover " + esc(found) + ". " + link("services", "Choose a clean") : "Outside our sample service area. Try " + areas.join(", ") + ".") : ""}</div>${img("nest-hero", "Sunlit living room after cleaning")}</section><section class="inner">${rows}</section>`,
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
