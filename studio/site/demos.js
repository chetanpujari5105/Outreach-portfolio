// Each demo keeps its fictional records in the current tab.
export const money = (value, currency, locale = undefined) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
export const button = (action, label, style = "", attrs = "") =>
  `<button type="button" data-action="${action}" class="dm-button ${style}" ${attrs}>${label}</button>`;
export const notice = (message) => `<p class="dm-note">${message}</p>`;
export const next = '<span aria-hidden="true">↗</span>';
export function todayAt(zone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const part = (key) => parts.find((p) => p.type === key).value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}
export function dayOffset(iso, days) {
  const date = new Date(iso + "T12:00:00Z");
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
export function dateText(
  iso,
  locale,
  opts = { weekday: "short", month: "short", day: "numeric" },
) {
  return new Intl.DateTimeFormat(locale, { ...opts, timeZone: "UTC" }).format(
    new Date(iso + "T12:00:00Z"),
  );
}
export function readRows(key) {
  try {
    const parsed = JSON.parse(
      sessionStorage.getItem("studio-demo-v1-" + key) || "[]",
    );
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
export function saveRows(key, rows) {
  try {
    sessionStorage.setItem("studio-demo-v1-" + key, JSON.stringify(rows));
  } catch {
    /* Memory remains available in restricted browsers. */
  }
}
export function setView(root, html, focus = true) {
  root.innerHTML = html;
  if (focus) root.querySelector("[data-focus]")?.focus({ preventScroll: true });
}
export function wire(root, handler) {
  root.onclick = (event) => {
    const control = event.target.closest("button[data-action]");
    if (control && root.contains(control) && !control.disabled)
      handler(control.dataset.action, control);
  };
}
const locations = {
  pune: {
    city: "Pune",
    area: "Koregaon Park",
    country: "India",
    locale: "en-IN",
    zone: "Asia/Kolkata",
    currency: "INR",
    tz: "India Standard Time",
    contact: "WhatsApp",
    hours: "10 am – 7 pm",
    start: 10,
    end: 19,
  },
  london: {
    city: "London",
    area: "Hackney",
    country: "UK",
    locale: "en-GB",
    zone: "Europe/London",
    currency: "GBP",
    tz: "London local time",
    contact: "Email",
    hours: "9 am – 6 pm",
    start: 9,
    end: 18,
  },
};
// Indexes 0–2 predate the full Forma site and appear in old links, so new services are appended.
// len: priced by hair length (short, shoulder, long); +20% per step.
export const salonServices = [
  { name: "Cut & finish", detail: "Consultation, wash, a precision cut and a blow-dry.", duration: 60, prices: [1600, 65], len: true, img: "salon-cut" },
  { name: "Lived-in colour", detail: "Hand-painted balayage or ribbons, toned with a gloss. Blow-dry included.", duration: 120, prices: [4200, 150], len: true, img: "salon-colour" },
  { name: "Signature blowout", detail: "Wash, scalp massage and a round-brush finish that lasts three days.", duration: 45, prices: [950, 42], len: true, img: "salon-blowout" },
  { name: "Men's cut", detail: "Scissor or clipper cut, wash and a style you can repeat at home.", duration: 45, prices: [900, 38], img: "forma-crop" },
  { name: "Root touch-up", detail: "Single-process colour on up to 3 cm of regrowth.", duration: 75, prices: [2200, 85], img: "forma-basin" },
  { name: "Tonal gloss", detail: "A demi-permanent gloss for shine and tone that fades softly over six weeks.", duration: 45, prices: [1800, 70], len: true, img: "forma-gloss" },
];
export const hairLengths = ["Short", "Shoulder", "Long"];
export const salonPrice = (s, length = 0, place = 0) => {
  const base = salonServices[s].prices[place];
  if (!salonServices[s].len) return base;
  const p = base * (1 + 0.2 * length);
  return place ? Math.round(p) : Math.round(p / 50) * 50;
};
const services = salonServices;
const stylists = ["Any available stylist", "Mira", "Alex"];
const stylistImg = [null, "mira", "alex"];
const calendarLabels = ["Service", "Stylist", "Date & time", "Review"];
function salon(root) {
  let city = "pune",
    service = 0,
    stylist = 0,
    length = 0,
    step = 0,
    date,
    slot = "",
    receipt = null,
    owner = false;
  let rows = readRows("salon").filter(
    (r) =>
      r &&
      Object.hasOwn(locations, r.city) &&
      Number.isInteger(r.service) &&
      services[r.service] &&
      [1, 2].includes(r.assigned) &&
      /^\d{4}-\d{2}-\d{2}$/.test(r.date) &&
      /^\d{1,2}:\d{2}$/.test(r.slot),
  );
  const incoming = new URLSearchParams(location.search);
  if (/^[0-5]$/.test(incoming.get("service") || "")) service = Number(incoming.get("service"));
  if (/^[0-2]$/.test(incoming.get("length") || "")) length = Number(incoming.get("length"));
  if (["1","2"].includes(incoming.get("stylist"))) stylist = Number(incoming.get("stylist"));
  const loc = () => locations[city];
  const firstDay = () => dayOffset(todayAt(loc().zone), 1);
  date = firstDay();
  const price = (i, len = length) =>
    money(
      salonPrice(i, len, city === "pune" ? 0 : 1),
      loc().currency,
      loc().locale,
    );
  const minutes = (time) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };
  function displayTime(time, place = loc()) {
    const [h, m] = time.split(":").map(Number);
    return new Intl.DateTimeFormat(place.locale, {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(2000, 0, 1, h, m)));
  }
  function available() {
    const list = [];
    for (
      let t = loc().start * 60;
      t + services[service].duration <= loc().end * 60;
      t += 30
    ) {
      const end = t + services[service].duration;
      const possible = (stylist ? [stylist] : [1, 2]).filter((person) => {
        // Illustrative shift patterns and a lunch break keep the timetable realistic.
        if (person === 2 && t < (loc().start + 1) * 60) return false;
        const lunch = person === 1 ? 13 * 60 : 14 * 60;
        if (t < lunch + 60 && end > lunch) return false;
        return !rows.some(
          (r) =>
            r.city === city &&
            r.date === date &&
            r.assigned === person &&
            t < minutes(r.slot) + services[r.service].duration &&
            end > minutes(r.slot),
        );
      });
      if (possible.length)
        list.push({
          time: Math.floor(t / 60) + ":" + String(t % 60).padStart(2, "0"),
          person: possible[0],
        });
    }
    return list;
  }
  function summary(r) {
    const place = locations[r.city];
    return `<dl class="dm-facts"><div><dt>Service</dt><dd>${services[r.service].name}${services[r.service].len && r.length != null ? " · " + hairLengths[r.length].toLowerCase() + " hair" : ""}</dd></div><div><dt>Stylist</dt><dd>${stylists[r.assigned]}</dd></div><div><dt>When</dt><dd>${dateText(r.date, place.locale)} · ${displayTime(r.slot, place)}</dd></div><div><dt>Studio</dt><dd>${place.area}, ${place.city}</dd></div></dl>`;
  }
  function serviceRow(s, i) {
    return `<button type="button" class="dm-choice dm-forma-card" data-action="service" data-i="${i}" aria-pressed="${service === i}"><img class="dm-forma-card-img" src="/assets/${s.img}.webp" alt="" width="640" height="640" loading="lazy"><span class="dm-forma-card-body"><span class="dm-forma-card-name"><span class="dm-radio" aria-hidden="true"></span><strong>${s.name}</strong></span><small>${s.detail}</small><span class="dm-choice-end">${price(i)}<small>${s.duration} min</small></span></span></button>`;
  }
  function render(focus = true) {
    const place = loc();
    let panel = "";
    if (owner) {
      panel = `<h2 tabindex="-1" data-focus>Saved requests</h2>${
        rows.length
          ? [...rows]
              .reverse()
              .map(
                (r) =>
                  `<section class="dm-record"><strong>Appointment request · ${locations[r.city].city}</strong>${summary(r)}</section>`,
              )
              .join("")
          : "<p>Requests you save appear here.</p>"
      }${button("customer", "Back to booking", "dm-primary")}`;
    } else if (receipt) {
      panel = `<p class="dm-kicker">Saved on this device</p><h2 tabindex="-1" data-focus>Your request is ready.</h2><p>Review your requested appointment below. Nothing has been sent, booked or charged; contact the studio to confirm the time.</p>${summary(receipt)}${button("owner", "See saved requests", "dm-primary")} ${button("new", "Plan another service", "dm-link")}`;
    } else {
      let content = "";
      if (step === 0)
        content = `<div class="dm-len" role="group" aria-label="Hair length"><span>Hair length</span>${hairLengths.map((l, i) => button("length", l, "dm-chip", `data-i="${i}" aria-pressed="${length === i}"`)).join("")}</div><div class="dm-forma-grid">${services.map(serviceRow).join("")}</div>`;
      if (step === 1)
        content = `<div class="dm-forma-grid dm-forma-people">${stylists
          .map(
            (s, i) =>
              `<button type="button" class="dm-choice dm-forma-card" data-action="stylist" data-i="${i}" aria-pressed="${stylist === i}">${stylistImg[i] ? `<img class="dm-forma-card-img" src="/assets/salon-stylist-${stylistImg[i]}.webp" alt="" width="640" height="800" loading="lazy">` : `<span class="dm-forma-card-img dm-forma-any" aria-hidden="true">Any</span>`}<span class="dm-forma-card-body"><span class="dm-forma-card-name"><span class="dm-radio" aria-hidden="true"></span><strong>${s}</strong></span><small>${["See every available time", "Cutting and soft colour", "Colour and styling"][i]}</small></span></button>`,
          )
          .join("")}</div>`;
      if (step === 2) {
        const times = available();
        content = `<label class="dm-field">Preferred date<input type="date" data-date min="${firstDay()}" max="${dayOffset(firstDay(), 27)}" value="${date}" required></label><p class="dm-meta">${place.tz} · ${services[service].duration} minutes</p><div class="dm-slots">${times.map((t) => button("slot", displayTime(t.time), "dm-chip", `data-value="${t.time}" aria-pressed="${slot === t.time}"`)).join("") || "<p>Choose another date or stylist to see times.</p>"}</div>`;
      }
      if (step === 3) {
        const selected = available().find((t) => t.time === slot);
        if (!selected) {
          step = 2;
          slot = "";
          return render(focus);
        }
        content =
          summary({ city, service, length, date, slot, assigned: selected.person }) +
          `<div class="dm-total"><span>Service total</span><strong>${price(service)}</strong></div>`;
      }
      const headings = [
        "Choose a service",
        "Choose your stylist",
        "Find a time",
        "Review your request",
      ];
      panel = `<ol class="dm-steps" aria-label="Booking progress">${calendarLabels.map((s, i) => `<li ${i === step ? 'aria-current="step"' : ""}>${i + 1}. ${s}</li>`).join("")}</ol><h2 data-focus tabindex="-1">${headings[step]}</h2>${content}<div class="dm-controls">${step ? button("back", "← Back", "dm-link") : ""}${button("continue", step === 3 ? "Save request " + next : "Continue " + next, "dm-primary", step === 2 && !slot ? "disabled" : "")}</div>`;
    }
    setView(
      root,
      `<div class="dm dm-salon"><div class="dm-brandbar"><span class="dm-wordmark">Forma<small>studio</small></span><span>Hair atelier · ${place.area}, ${place.city}</span></div><header class="dm-forma-hero"><img class="dm-forma-hero-img" src="/assets/salon-hero.webp" alt="A Studio Forma client with a sharp black bob and a red silk scarf" width="1536" height="1024" fetchpriority="high"><div class="dm-forma-hero-copy"><p class="dm-kicker">Hair &amp; colour atelier</p><h1>Your hair,<br><em>your hour.</em></h1><p>${place.area}, ${place.city} · ${place.hours} · By appointment</p></div><ul class="dm-forma-index" aria-hidden="true"><li><b>01</b> Cut</li><li><b>02</b> Colour</li><li><b>03</b> Blowout</li></ul></header><div class="dm-layout"><aside class="dm-intro"><p class="dm-kicker">Book in four steps</p><p class="dm-forma-lede">Pick a service, a stylist and a time. Every time is subject to the studio’s confirmation.</p><p class="dm-forma-hours"><span>Open</span>${place.hours}<br><span>Zone</span>${place.tz}</p><label class="dm-field">Location<select data-city>${Object.entries(
        locations,
      )
        .map(
          ([k, v]) =>
            `<option value="${k}" ${k === city ? "selected" : ""}>${v.city}, ${v.country}</option>`,
        )
        .join(
          "",
        )}</select></label></aside><section class="dm-panel">${panel}</section></div><footer class="dm-foot"><span>Illustrative prices and times. Requests are kept in this browser tab and are not sent.</span><div>${button("owner", "Saved requests", "dm-link")}${button("reset", "Clear all", "dm-link")}</div></footer></div>`,
      focus,
    );
  }
  function restart() {
    service = 0;
    stylist = 0;
    step = 0;
    date = firstDay();
    slot = "";
    receipt = null;
    owner = false;
  }
  wire(root, (action, el) => {
    if (action === "service" || action === "stylist") {
      if (action === "service") service = Number(el.dataset.i);
      else stylist = Number(el.dataset.i);
      slot = "";
      el.parentElement
        .querySelectorAll("button.dm-choice")
        .forEach((btn) => btn.setAttribute("aria-pressed", String(btn === el)));
      return;
    }
    if (action === "length") {
      length = Number(el.dataset.i);
      return render(false);
    }
    if (action === "slot") {
      slot = el.dataset.value;
      root
        .querySelectorAll(".dm-slots button")
        .forEach((btn) => btn.setAttribute("aria-pressed", String(btn === el)));
      root.querySelector('[data-action="continue"]').disabled = false;
      return;
    }
    if (action === "back") step = Math.max(0, step - 1);
    if (action === "continue" && !receipt) {
      if (
        step === 2 &&
        (!slot || !root.querySelector("[data-date]").reportValidity())
      )
        return;
      if (step < 3) step++;
      else {
        const selected = available().find((t) => t.time === slot);
        if (!selected) {
          step = 2;
          slot = "";
        } else {
          receipt = { city, service, length, date, slot, assigned: selected.person };
          rows.push(receipt);
          saveRows("salon", rows);
        }
      }
    }
    if (action === "owner") owner = true;
    if (action === "customer") owner = false;
    if (action === "new") restart();
    if (action === "reset") {
      city = "pune";
      rows = [];
      saveRows("salon", rows);
      restart();
    }
    render();
  });
  root.onchange = (e) => {
    if (e.target.matches("[data-city]")) {
      city = e.target.value;
      restart();
      render();
    }
    if (e.target.matches("[data-date]")) {
      slot = "";
      root.querySelector('[data-action="continue"]').disabled = true;
      if (!e.target.validity.valid) {
        root.querySelector(".dm-slots").replaceChildren();
        e.target.reportValidity();
        return;
      }
      date = e.target.value;
      render(false);
      root.querySelector("[data-date]").focus({ preventScroll: true });
    }
  };
  render(false);
}

const dishes = [
  {
    name: "Flat white",
    img: "/assets/daybreak-dish-flat-white.webp",
    category: "Coffee",
    price: 210,
    description: "A double shot of house espresso with silky steamed milk.",
    detail: "Espresso, milk. Oat milk available.",
    tag: "House blend",
  },
  {
    name: "Citrus cold brew",
    img: "/assets/daybreak-dish-cold-brew.webp",
    category: "Coffee",
    price: 240,
    description: "Slow-steeped coffee, orange peel and plenty of ice.",
    detail: "Cold brew, orange, filtered water.",
    tag: "Iced",
  },
  {
    name: "Mushroom toast",
    img: "/assets/daybreak-dish-mushroom-toast.webp",
    category: "Kitchen",
    price: 360,
    description: "Garlic mushrooms, whipped feta and toasted sourdough.",
    detail: "Contains dairy and wheat.",
    tag: "Vegetarian",
  },
  {
    name: "Soft scramble",
    img: "/assets/daybreak-dish-soft-scramble.webp",
    category: "Kitchen",
    price: 340,
    description: "Soft-folded eggs, chive butter and a slice of country loaf.",
    detail: "Contains eggs, dairy and wheat.",
    tag: "All day",
  },
  {
    name: "Almond croissant",
    img: "/assets/daybreak-dish-almond-croissant.webp",
    category: "Bakery",
    price: 230,
    description: "Twice-baked butter pastry with almond frangipane.",
    detail: "Contains almonds, eggs, dairy and wheat.",
    tag: "Baked daily",
  },
  {
    name: "Orange olive oil cake",
    img: "/assets/daybreak-dish-orange-cake.webp",
    category: "Bakery",
    price: 220,
    description: "A thick slice with orange zest and a light citrus glaze.",
    detail: "Contains eggs and wheat.",
    tag: "By the slice",
  },
];
function cafe(root) {
  let filter = "All",
    dialog = null,
    ack = null;
  const zone = "Asia/Kolkata",
    locale = "en-IN";
  function render(focus = false) {
    const menu = dishes
      .map((dish, i) =>
        filter === "All" || dish.category === filter
          ? `<button class="dm-dish" type="button" data-action="dish" data-i="${i}"><img class="dm-dish-img" src="${dish.img}" alt="" width="640" height="640" loading="lazy" decoding="async"><span class="dm-dish-top"><small>${dish.category}</small><span>${money(dish.price, "INR", locale)}</span></span><strong>${dish.name}</strong><span class="dm-dish-description">${dish.description}</span><small class="dm-dish-foot">${dish.tag}<b aria-hidden="true">↗</b></small></button>`
          : "",
      )
      .join("");
    setView(
      root,
      `<div class="dm dm-cafe"><div class="dm-brandbar"><span class="dm-wordmark">Daybreak <i>Café</i></span><span>Deccan · Pune</span></div><div class="dm-cafe-cover"><img src="/assets/daybreak-cafe-hero.webp" alt="Morning light through the arched window at Daybreak Café, with a flat white and an almond croissant on a marble table" width="1600" height="1067" fetchpriority="high"><div class="dm-cover-copy"><p class="dm-kicker">Coffee, kitchen &amp; bakery</p><h1>A table at<br><em>Daybreak.</em></h1><p>Garden Lane, Deccan · Pune<br>Daily, 8 am – 6 pm · India Standard Time</p>${button("group", "Enquire about a group table " + next, "dm-primary")}</div><svg class="dm-stamp" viewBox="0 0 120 120" aria-hidden="true"><defs><path id="dm-stamp-ring" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0"/></defs><text><textPath href="#dm-stamp-ring">DAYBREAK · COFFEE · KITCHEN · BAKERY · </textPath></text><circle cx="60" cy="60" r="20"/><text x="60" y="66" text-anchor="middle" class="dm-stamp-sun">☼</text></svg></div><div class="dm-ticker" aria-hidden="true"><span>${dishes.map((d) => d.name).join(" ✦ ")} ✦ ${dishes.map((d) => d.name).join(" ✦ ")} ✦ </span></div><section class="dm-menu"><div class="dm-menu-top"><h2 data-focus tabindex="-1">The menu</h2><div class="dm-filter" aria-label="Menu categories">${["All", "Coffee", "Kitchen", "Bakery"].map((s) => button("filter", s, "dm-chip", `data-category="${s}" aria-pressed="${s === filter}"`)).join("")}</div></div><div class="dm-dishes">${menu}</div></section><section class="dm-space"><img src="/assets/daybreak-cafe-space.webp" alt="A long communal table set for eight under brass pendant lamps" width="900" height="1125" loading="lazy" decoding="async"><div><p class="dm-kicker">Our space</p><h2>Room for the<br><em>whole table.</em></h2><p>The long table seats up to twelve for birthdays, team breakfasts and slow Sunday catch-ups. Tell us the date and party size and the café team will get back to you.</p>${button("group", "Ask about a group table " + next, "dm-primary")}</div></section><footer class="dm-foot"><span>Illustrative menu and location</span>${button("reset", "Reset", "dm-link")}</footer><dialog class="dm-dialog" aria-labelledby="dm-dialog-title"></dialog></div>`,
      focus,
    );
    dialog = root.querySelector("dialog");
    dialog.onclick = (e) => {
      if (e.target === dialog) dialog.close();
    };
  }
  function openDialog(html) {
    dialog.innerHTML = html;
    if (!dialog.open) dialog.showModal();
    else dialog.querySelector("h2")?.focus();
  }
  const close = button(
    "close",
    'Close <span aria-hidden="true">×</span>',
    "dm-link",
  );
  wire(root, (action, el) => {
    if (action === "filter") {
      filter = el.dataset.category;
      render();
      root
        .querySelector('[data-category="' + filter + '"]')
        .focus({ preventScroll: true });
    }
    if (action === "close") dialog.close();
    if (action === "dish") {
      const d = dishes[Number(el.dataset.i)];
      openDialog(
        `<div class="dm-dialog-top"><span class="dm-kicker">${d.category}</span>${close}</div><img class="dm-dialog-img" src="${d.img}" alt="${d.name} at Daybreak Café" width="640" height="640"><h2 id="dm-dialog-title" tabindex="-1">${d.name}</h2><strong>${money(d.price, "INR", locale)}</strong><p>${d.description}</p>${notice(d.detail)}`,
      );
    }
    if (action === "group") {
      const min = dayOffset(todayAt(zone), 1);
      openDialog(
        `<div class="dm-dialog-top"><span class="dm-kicker">Group dining</span>${close}</div><h2 id="dm-dialog-title" tabindex="-1">A table for friends.</h2><form data-enquiry><label class="dm-field">Party size<select name="guests">${[4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => `<option>${n}</option>`).join("")}</select></label><label class="dm-field">Preferred date<input type="date" name="date" min="${min}" max="${dayOffset(min, 89)}" value="${min}" required></label>${notice("Your enquiry is prepared in this tab and is not sent. Contact the café to confirm a table.")}<button class="dm-button dm-primary" type="submit">Prepare enquiry ${next}</button></form>`,
      );
    }
    if (action === "reset") {
      ack = null;
      filter = "All";
      render(true);
    }
  });
  root.onsubmit = (e) => {
    if (!e.target.matches("[data-enquiry]")) return;
    e.preventDefault();
    if (!e.target.reportValidity()) return;
    const data = new FormData(e.target);
    ack = { guests: Number(data.get("guests")), date: data.get("date") };
    openDialog(
      `<div class="dm-dialog-top"><span class="dm-kicker">Enquiry ready</span>${close}</div><h2 id="dm-dialog-title" tabindex="-1">Your enquiry is ready.</h2><p>Your enquiry for ${ack.guests} guests on ${dateText(ack.date, locale)} is ready to review. Nothing has been sent and no reservation has been made.</p>${button("close", "Return to menu", "dm-primary")}`,
    );
  };
  render();
}

const billingCurrencies = {
  INR: { locale: "en-IN", prices: [165000, 95000, 42500, 17500] },
  GBP: { locale: "en-GB", prices: [6500, 4200, 1700, 800] },
  USD: { locale: "en-US", prices: [7900, 4500, 2200, 1000] },
};
const products = ["Studio session", "Styling service", "Care kit", "Gift wrap"];
const productImg = ["session", "styling", "care-kit", "gift-wrap"];
const customers = ["Fern House Studio", "Sunday Goods", "Mira & Co."];
export function billingRecords() {
  try {
    if (sessionStorage.getItem("studio-demo-v1-billing") === null) {
      const day = todayAt("Asia/Kolkata");
      saveRows("billing", [
        {id:101,customer:0,currency:"INR",discount:0,date:dayOffset(day,-2),items:[{product:0,qty:2}]},
        {id:102,customer:1,currency:"INR",discount:10,date:dayOffset(day,-1),items:[{product:2,qty:4}]},
        {id:103,customer:2,currency:"INR",discount:0,date:day,items:[{product:1,qty:3}]}
      ]);
    }
  } catch { /* The invoice editor can also run without persistent storage. */ }
  return readRows("billing");
}
export function invoiceValue(r) {
  const prices=billingCurrencies[r.currency].prices;
  const sub=r.items.reduce((sum,line)=>sum+prices[line.product]*line.qty,0);
  return (sub-Math.round(sub*r.discount/100))/100;
}
function billing(root) {
  let currency = "INR",
    customer = 0,
    discount = 0,
    items = [],
    screen = "edit",
    active = null;
  let invoices = billingRecords().filter(
    (r) =>
      r &&
      Object.hasOwn(billingCurrencies, r.currency) &&
      Number.isInteger(r.id) &&
      customers[r.customer] &&
      /^\d{4}-\d{2}-\d{2}$/.test(r.date) &&
      Number.isInteger(r.discount) &&
      r.discount >= 0 &&
      r.discount <= 100 &&
      Array.isArray(r.items) &&
      r.items.every(
        (i) =>
          i &&
          Number.isInteger(i.product) &&
          products[i.product] &&
          Number.isInteger(i.qty) &&
          i.qty > 0 &&
          i.qty <= 99,
      ),
  );
  function newDraft() {
    customer = 0;
    discount = 0;
    items = [{ product: 0, qty: 1 }];
    screen = "edit";
    active = null;
  }
  newDraft();
  const params = new URLSearchParams(location.search);
  if (["0","1","2"].includes(params.get("customer"))) customer = Number(params.get("customer"));
  const saved = invoices.find(inv => String(inv.id) === params.get("invoice"));
  if (saved) { active = saved; screen = "issued"; }
  const format = (minor, code = currency) =>
    money(minor / 100, code, billingCurrencies[code].locale);
  const prices = (code) => billingCurrencies[code].prices;
  function totals(list, d, code) {
    const subtotal = list.reduce(
      (sum, i) => sum + prices(code)[i.product] * i.qty,
      0,
    );
    const deduction = Math.round((subtotal * d) / 100);
    return { subtotal, deduction, total: subtotal - deduction };
  }
  const number = (id) => "LD-" + String(id).padStart(4, "0");
  function amounts(list, d, code) {
    const t = totals(list, d, code);
    return `<dl class="dm-facts"><div><dt>Subtotal</dt><dd>${format(t.subtotal, code)}</dd></div><div><dt>Discount (${d}%)</dt><dd>−${format(t.deduction, code)}</dd></div></dl><div class="dm-total"><span>Invoice total <small>${code}</small></span><strong>${format(t.total, code)}</strong></div>`;
  }
  function snapshot(r) {
    return `<div class="dm-invoice-meta"><div><small>Bill to</small><strong>${customers[r.customer]}</strong></div><div><small>Issued on</small><strong>${dateText(r.date, billingCurrencies[r.currency].locale, { day: "numeric", month: "short", year: "numeric" })}</strong></div></div><div class="dm-invoice-lines">${r.items.map((i) => `<div><span>${products[i.product]}<small>${i.qty} × ${format(prices(r.currency)[i.product], r.currency)}</small></span><strong>${format(prices(r.currency)[i.product] * i.qty, r.currency)}</strong></div>`).join("")}</div>${amounts(r.items, r.discount, r.currency)}`;
  }
  function editLines() {
    return items
      .map(
        (item, i) =>
          `<div class="dm-line"><div class="dm-ledger-item"><img src="/assets/ledger-${productImg[item.product]}.webp" alt="" width="96" height="96" loading="lazy"><span><strong>${products[item.product]}</strong><small>${format(prices(currency)[item.product])} / unit</small></span></div><label class="dm-field"><span>Qty</span><input type="number" min="1" max="99" step="1" required value="${item.qty}" data-qty="${i}" aria-label="Quantity for ${products[item.product]}, line ${i + 1}"></label><strong data-line-total="${i}">${format(prices(currency)[item.product] * item.qty)}</strong>${button("remove", "×", "dm-remove", `data-i="${i}" aria-label="Remove ${products[item.product]}, line ${i + 1}"`)}</div>`,
      )
      .join("");
  }
  function render(focus = true) {
    let content = "";
    if (screen === "edit") {
      content = `<div class="dm-form-main"><p class="dm-kicker">Invoice builder</p><h2 data-focus tabindex="-1">New invoice</h2><div class="dm-pair"><label class="dm-field">Bill to<select data-customer>${customers.map((c, i) => `<option value="${i}" ${customer === i ? "selected" : ""}>${c}</option>`).join("")}</select></label><label class="dm-field">Currency<select data-currency>${Object.keys(
        billingCurrencies,
      )
        .map((c) => `<option ${currency === c ? "selected" : ""}>${c}</option>`)
        .join(
          "",
        )}</select></label></div><h3>Line items</h3>${editLines() || "<p>Choose an item to start this invoice.</p>"}<h3>Add from the catalog</h3><div class="dm-ledger-catalog">${products.map((p, i) => `<button type="button" class="dm-ledger-tile" data-action="add" data-p="${i}" aria-label="Add ${p}, ${format(prices(currency)[i])}"><img src="/assets/ledger-${productImg[i]}.webp" alt="" width="320" height="320" loading="lazy"><span><strong>${p}</strong><small>${format(prices(currency)[i])}</small></span><b aria-hidden="true">+</b></button>`).join("")}</div></div><aside class="dm-sheet-summary"><p class="dm-kicker">Summary</p><label class="dm-field">Discount (%)<input type="number" min="0" max="100" step="1" value="${discount}" data-discount required></label><div data-amounts>${amounts(items, discount, currency)}</div>${button("review", "Review invoice " + next, "dm-primary", !items.length ? "disabled" : "")}<p class="dm-note">Illustrative prices in ${currency}. No payment is collected.</p></aside>`;
    } else if (screen === "list") {
      content = `<div class="dm-record-view"><p class="dm-kicker">Register</p><h2 data-focus tabindex="-1">Issued invoices</h2>${
        invoices.length
          ? [...invoices]
              .reverse()
              .map(
                (r) =>
                  `<button type="button" data-action="open" data-id="${r.id}" class="dm-list-row"><span><strong>${number(r.id)}</strong><small>${customers[r.customer]}</small></span><span>${format(totals(r.items, r.discount, r.currency).total, r.currency)} ↗</span></button>`,
              )
              .join("")
          : "<p>Issued invoices appear in this tab.</p>"
      }${button("editor", "Return to editor", "dm-secondary")}</div>`;
    } else {
      const issued = screen === "issued",
        r = active;
      content = `<div class="dm-record-view"><div class="dm-print-sheet"><p class="dm-kicker">Ledger Desk · Invoice</p><h2 tabindex="-1" data-focus>${issued ? number(r.id) : "Review invoice"}</h2>${snapshot(r)}</div><div class="dm-controls">${issued ? button("print", "Print invoice", "dm-primary") + button("new", "Start new invoice", "dm-secondary") : button("editor", "← Edit invoice", "dm-link") + button("issue", "Issue invoice " + next, "dm-primary")}</div></div>`;
    }
    setView(
      root,
      `<div class="dm dm-bill"><div class="dm-brandbar"><span class="dm-wordmark"><span class="dm-ledger-icon" aria-hidden="true">LD</span>Ledger Desk</span><span>Studio accounts</span></div><header class="dm-bill-header"><div class="dm-ledger-title"><p class="dm-kicker">Studio workspace</p><h1>Billing desk<span>.</span></h1><p class="dm-ledger-sub">Pick items from the catalog, check the totals and issue an invoice to the register.</p>${button("list", "Issued invoices (" + invoices.length + ")", "dm-secondary")}</div><img class="dm-ledger-photo" src="/assets/ledger-hero.webp" alt="" width="1536" height="1024" fetchpriority="high"><div class="dm-ledger-stat"><small>Issued</small><strong>${String(invoices.length).padStart(2, "0")}</strong></div><div class="dm-ledger-stat dm-ledger-stat-lime"><small>Currency</small><strong>${currency}</strong></div></header><div class="dm-bill-layout">${content}</div><footer class="dm-foot"><span>Illustrative customers and prices. Invoices are kept in this browser tab.</span>${button("reset", "Clear all", "dm-link")}</footer></div>`,
      focus,
    );
  }
  function updateTotals() {
    const invalid = [...root.querySelectorAll("input")].some(
      (input) => !input.validity.valid,
    );
    root.querySelector('[data-action="review"]').disabled =
      !items.length || invalid;
    root.querySelector("[data-amounts]").innerHTML = invalid
      ? notice("Enter a valid quantity and discount to calculate your total.")
      : amounts(items, discount, currency);
  }
  root.oninput = (e) => {
    const el = e.target;
    if (el.matches("[data-qty]")) {
      const i = Number(el.dataset.qty);
      if (el.validity.valid) items[i].qty = el.valueAsNumber;
      root.querySelector('[data-line-total="' + i + '"]').textContent = el
        .validity.valid
        ? format(prices(currency)[items[i].product] * items[i].qty)
        : "—";
      updateTotals();
    }
    if (el.matches("[data-discount]")) {
      if (el.validity.valid) discount = el.valueAsNumber;
      updateTotals();
    }
  };
  root.onchange = (e) => {
    if (e.target.matches("[data-currency]")) {
      currency = e.target.value;
      render(false);
      root.querySelector("[data-currency]").focus({ preventScroll: true });
    }
    if (e.target.matches("[data-customer]")) customer = Number(e.target.value);
  };
  wire(root, (action, el) => {
    if (action === "add") {
      const id = Number(el.dataset.p);
      items.push({ product: id, qty: 1 });
      render(false);
      root
        .querySelector(`[data-qty="${items.length - 1}"]`)
        .focus({ preventScroll: true });
      return;
    }
    if (action === "remove") items.splice(Number(el.dataset.i), 1);
    if (action === "review") {
      if (
        !items.length ||
        [...root.querySelectorAll("input")].some(
          (input) => !input.reportValidity(),
        )
      )
        return;
      active = {
        currency,
        customer,
        discount,
        items: items.map((i) => ({ ...i })),
        date: todayAt(
          Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
        ),
      };
      screen = "review";
    }
    if (action === "issue" && screen === "review") {
      active = { ...active, id: Math.max(0, ...invoices.map((r) => r.id)) + 1 };
      invoices.push(active);
      saveRows("billing", invoices);
      screen = "issued";
    }
    if (action === "editor") screen = "edit";
    if (action === "new") newDraft();
    if (action === "list") screen = "list";
    if (action === "open") {
      active = invoices.find((r) => r.id === Number(el.dataset.id));
      if (active) screen = "issued";
    }
    if (action === "print" && screen === "issued") {
      window.print();
      return;
    }
    if (action === "reset") {
      currency = "INR";
      invoices = [];
      saveRows("billing", invoices);
      newDraft();
    }
    render();
  });
  render(false);
}

export function mountDemo(root, slug) {
  root.onclick = null;
  root.onchange = null;
  root.oninput = null;
  root.onsubmit = null;
  const demos = {
    "salon-booking": salon,
    "daybreak-cafe": cafe,
    "studio-billing": billing,
  };
  if (Object.hasOwn(demos, slug)) demos[slug](root);
  else import("./flow.js").then(({ mountKit }) => mountKit(root, slug));
}
