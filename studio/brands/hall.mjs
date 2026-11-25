// Hall Eleven: a full event-venue website. Every person, review, number and price here is fictional.
import { rupees, icon, whatsapp, stars, reviewNote, faq, siteHeader, siteFooter, dock } from "./common.mjs";

const WA = whatsapp("+91 99999 01111", "Hi Hall Eleven, I'd like to check a date for an event.");
const setupMore = {
  banquet: { best: "Wedding receptions, anniversaries, award dinners", feel: "Round tables of ten under the chandeliers, a dance floor in front of the stage and a served dinner.", dims: ["18 rounds of 10", "Dance floor 30 × 24 ft", "Head table on the stage"] },
  theatre: { best: "Town halls, launches, ceremonies, screenings", feel: "Rows of velvet chairs facing a low stage, with a 16-foot screen and a sound desk at the back.", dims: ["Up to 260 seats", "16 ft screen and two lapel mics", "Green room behind the stage"] },
  cocktail: { best: "Sangeets, company parties, milestone birthdays", feel: "Standing high tables, two bars and live food counters along the walls, with the terrace open for air.", dims: ["Up to 320 standing", "Two bars, four live counters", "Terrace open till 11 pm"] },
};
const events = {
  weddings: { title: "Weddings & receptions", short: "Receptions, sangeets and engagements for up to 320.", img: "hall-wedding", lede: "Receptions, sangeets and engagements for 80 to 320, with one events manager from the first visit to the last guest.", occasion: "reception", points: ["Baraat-friendly drive-in with valet", "Two green rooms for the families", "Mandap and stage décor through our florist, or your own", "Jain, vegan and Satvik menus on request"] },
  corporate: { title: "Corporate evenings", short: "Town halls, launches and award nights, AV included.", img: "hall-corporate", lede: "Town halls, launches, award nights and offsites, with AV that works the first time and invoices your finance team will like.", occasion: "corporate", points: ["Theatre to cocktail turnaround in 45 minutes", "16 ft screen, four mics and a sound engineer", "GST invoices and a single point of contact", "Weekday rates 20% lower"] },
  celebrations: { title: "Birthdays & milestones", short: "Fiftieths, anniversaries and reunions, terrace included.", img: "hall-terrace", lede: "Fiftieth birthdays, anniversaries and family reunions, indoors under the chandeliers or out on the terrace.", occasion: "birthday", points: ["Terrace for 90 standing, with string lights", "Slideshow and speeches on the big screen", "A cake table and photo corner set up for you", "From 40 guests on weekdays"] },
};
const menuMore = {
  classic: ["Two starters passed on trays", "Three mains, dal, rice and breads", "One dessert and a coffee station"],
  signature: ["Four starters, two from live counters", "A chef's table with regional specials", "Two desserts and a paan counter"],
  grand: ["Seven plated courses", "Paired mocktails or wine service", "Dessert bar and late-night chai"],
};
const reviews = [
  ["Our reception for 240 ran to the minute. Naina had a plan B for rain that we never needed, but it was there.", "Ritika & Aman", "Wedding reception · Feb 2026"],
  ["Third year running our town hall here. The AV just works, and the food is what people talk about on Monday.", "Kavya S.", "People team, Pune tech firm"],
  ["My father's 70th: theatre for the slideshow, then cocktails on the terrace. The switch took twenty minutes.", "Siddharth N.", "Milestone birthday · Oct 2025"],
  ["Seven courses for 150 and not one cold plate. The Grand menu was ridiculous in the best way.", "Meher & Joel", "Anniversary dinner · Dec 2025"],
];
const questions = [
  ["What's included in the venue hire?", "The hall for five hours (one for setup), tables, chairs, linen, house lighting, two green rooms and a dedicated events manager. Extra hours are ₹8,000 each."],
  ["Can we bring our own decorator or caterer?", "Decorators, yes: from our list or your own with a ₹15,000 supervision fee. Food is cooked in our own kitchen, and the chef will happily build Jain, vegan or regional menus with you."],
  ["How far ahead should we book?", "Saturdays from November to February go six to nine months ahead. Weekdays and summer dates are often free within a month."],
  ["How do the deposit and cancellation work?", "A 25% deposit holds your date. Cancel more than 90 days before for a full refund less 10%; after that the deposit moves to another date within a year."],
  ["Is there parking?", "Eighty cars on site plus the street. Valet is an add-on at ₹12,000 for the evening, and we recommend it above 150 guests."],
  ["Do you serve alcohol?", "Through our licensed bar partner, with the one-day permit handled for you. Dry events are just as welcome."],
];
const foot = {
  name: "Hall Eleven",
  blurb: "An event hall for 20 to 320 guests in Kalyani Nagar, Pune. One room, three setups, a kitchen that cooks every plate on site.",
  address: "11 North Main Road, Kalyani Nagar, Pune 411006",
  hours: "Site visits daily, 11 am – 7 pm",
  phone: "+91 99999 01111",
  email: "events@halleleven.example",
  insta: "@halleleven.pune",
  links: [["spaces/banquet", "Setups"], ["menus", "Menus"], ["events/weddings", "Weddings"], ["events/corporate", "Corporate"], ["request", "Plan an event"]],
};
// Schematic floor plans, drawn to scale-ish: stage at the top, entrance at the bottom.
const plan = (id) => {
  let marks = "";
  if (id === "banquet") for (let r = 0; r < 3; r++) for (let k = 0; k < 6; k++) marks += `<circle cx="${70 + k * 52}" cy="${118 + r * 46}" r="15"/>`;
  if (id === "theatre") for (let r = 0; r < 9; r++) for (let k = 0; k < 16; k++) if (k !== 7 && k !== 8) marks += `<rect x="${46 + k * 19}" y="${92 + r * 16}" width="12" height="8" rx="2"/>`;
  if (id === "cocktail") {
    marks += '<rect x="24" y="96" width="14" height="110" rx="3"/><rect x="362" y="96" width="14" height="110" rx="3"/>';
    for (const [x, y] of [[90, 110], [150, 140], [210, 105], [270, 145], [330, 115], [110, 185], [180, 200], [250, 190], [320, 205], [215, 160]]) marks += `<circle cx="${x}" cy="${y}" r="7"/>`;
  }
  const dance = id === "banquet" ? '<rect class="soft" x="150" y="52" width="100" height="40" rx="3"/><text x="200" y="72">Dance floor</text>' : "";
  return `<svg class="plan" viewBox="0 0 400 260" role="img" aria-label="${id} floor plan, with the stage opposite the entrance"><rect class="wall" x="8" y="8" width="384" height="244" rx="6"/><rect class="stage" x="120" y="16" width="160" height="${id === "theatre" ? 50 : 30}" rx="3"/><text x="200" y="${id === "theatre" ? 41 : 31}">Stage</text>${dance}<g class="marks">${marks}</g><text x="200" y="239">Entrance</text><path class="door" d="M176 252h48"/></svg>`;
};

export function hall(c) {
  const { path, opts, img, link, result, action } = c;
  const setups = opts("setup");
  const occasions = opts("occasion");
  const menus = opts("menu");
  const addons = opts("addons");

  const header = () =>
    siteHeader(c, { name: "Hall Eleven", links: [["spaces/banquet", "The space"], ["menus", "Menus"], ["events/weddings", "Weddings"], ["events/corporate", "Corporate"]], cta: ["request", "Plan an event"] });
  const page = (title, html, image) =>
    result(title, header() + html + siteFooter(c, foot) + dock(c, WA, ["request", "Plan an event"]), image);

  // The setup switcher works on radios + :has, so it needs no script.
  const switcher = (on = "banquet") =>
    `<div class="setups"><div class="setup-tabs" role="radiogroup" aria-label="Room setup">${setups.map((s) => `<label><input type="radio" name="setup-view" value="${s.id}"${s.id === on ? " checked" : ""}><span>${s.label}<small>up to ${s.cap}</small></span></label>`).join("")}</div>${setups
      .map((s) => {
        const m = setupMore[s.id];
        return `<div class="setup-panel" data-setup="${s.id}"><figure>${img(s.img, s.label + " setup at Hall Eleven")}</figure><div class="setup-info">${plan(s.id)}<p>${m.feel}</p><ul>${m.dims.map((d) => `<li>${icon("check")}${d}</li>`).join("")}</ul><p class="best"><b>Best for</b>${m.best}</p>${link("spaces/" + s.id, "See the " + s.label.toLowerCase() + " setup " + icon("arrow"), "text-link")}</div></div>`;
      })
      .join("")}</div>`;
  // Live estimate: a plain GET form to the request page, so it still works without JavaScript.
  const estimator = () => {
    const start = { occasion: occasions[0], setup: setups[0], menu: menus[1], guests: 120 };
    const total = start.occasion.price + start.menu.price * start.guests;
    return `<form class="est" data-est action="${c.href("request")}">
<div class="est-quick"><p>Estimated total <strong data-quick-total>${rupees(total)}</strong></p><a href="#estimate-breakdown" class="text-link">Breakdown <span aria-hidden="true">↓</span></a></div>
<div class="est-in"><fieldset><legend>Occasion</legend>${occasions.map((o, i) => `<label class="chip"><input type="radio" name="occasion" value="${o.id}" data-price="${o.price}"${i ? "" : " checked"}><span>${o.label}</span></label>`).join("")}</fieldset><fieldset><legend>Setup</legend>${setups.map((s, i) => `<label class="chip"><input type="radio" name="setup" value="${s.id}" data-cap="${s.cap}"${i ? "" : " checked"}><span>${s.label}</span></label>`).join("")}</fieldset><label class="guests"><span>Guests <output data-guests-out>${start.guests}</output></span><input type="range" name="guests" min="20" max="${setups[0].cap}" step="10" value="${start.guests}"><small data-cap-note>Banquet holds up to ${setups[0].cap}</small></label><fieldset><legend>Menu, per guest</legend>${menus.map((m, i) => `<label class="chip"><input type="radio" name="menu" value="${m.id}" data-price="${m.price}"${i === 1 ? " checked" : ""}><span>${m.label} · ${rupees(m.price)}</span></label>`).join("")}</fieldset><fieldset><legend>Add-ons</legend>${addons.map((a) => `<label class="chip"><input type="checkbox" name="addons" value="${a.id}" data-price="${a.price}"><span>${a.label} · ${rupees(a.price)}</span></label>`).join("")}</fieldset></div><aside class="est-out" id="estimate-breakdown" aria-live="polite"><p class="est-k">Your estimate</p><p class="est-total" data-total>${rupees(total)}</p><p class="est-per"><span data-per>${rupees(Math.round(total / start.guests))}</span> per guest, before GST</p><dl data-lines><div><dt>Venue hire</dt><dd>${rupees(start.occasion.price)}</dd></div><div><dt>${start.menu.label} menu × ${start.guests}</dt><dd>${rupees(start.menu.price * start.guests)}</dd></div></dl><button type="submit" class="pill solid">Continue to enquiry ${icon("arrow")}</button><p class="small">A 25% deposit holds the date. Dates are subject to availability.</p></aside></form>`;
  };
  const eventCard = (id) => {
    const e = events[id];
    return link("events/" + id, `<figure>${img(e.img, e.title)}</figure><span><b>${e.title}</b><small>${e.short}</small></span>`, "ev-card");
  };
  const menuCols = () =>
    `<div class="menu-tiers">${menus.map((m, i) => `<article class="tier${i === 1 ? " hot" : ""}" data-reveal><p class="tier-k">${["Classic", "Most booked", "For the big night"][i]}</p><h3>${m.label}</h3><p class="tier-p">${rupees(m.price)}<span>per guest</span></p><p>${m.detail}</p><ul>${menuMore[m.id].map((t) => `<li>${t}</li>`).join("")}</ul>${action("Choose " + m.label, { menu: m.id })}</article>`).join("")}</div>`;
  const voices = () =>
    `<div class="rail" data-rail tabindex="0">${reviews.map(([q, n, e]) => `<blockquote><p>“${q}”</p><footer>${stars(5)}<b>${n}</b>${e}</footer></blockquote>`).join("")}</div>${reviewNote}`;

  if (!path)
    return page(
      "Event hall for 20 to 320 guests in Kalyani Nagar, Pune",
      `<section class="h-cover" data-dock-after aria-labelledby="hall-cover-title">
  <div class="h-cover-copy">
    <p class="h-kicker">A private venue in Pune</p>
    <h1 id="hall-cover-title">Gather in<br><em>Kalyani Nagar.</em></h1>
    <p>Host a wedding reception, a company dinner or a family celebration in our private hall, with an open-air terrace and a kitchen on site.</p>
    <div class="h-act">${link("request", "Plan an event " + icon("arrow"), "pill solid")}<a class="text-link" href="#estimate">Get an estimate</a></div>
  </div>
  <figure class="h-cover-photo">
    ${img("hall-hero", "A long candlelit dinner table under the chandeliers at Hall Eleven", "", true)}
    <figcaption><span>The hall set for dinner</span><a class="text-link" href="#gallery">View gallery ${icon("arrow")}</a></figcaption>
  </figure>
  <dl class="h-facts"><div><dt>Guest capacity</dt><dd>20–320</dd></div><div><dt>Indoor space</dt><dd>6,400 sq ft</dd></div><div><dt>Room layouts</dt><dd>Banquet, theatre &amp; cocktail</dd></div></dl>
</section>
<section class="h-setups" id="setups"><div class="sec-head"><div><p class="h-kicker">The space</p><h2>See what fits your guest list.</h2></div><p>From a seated dinner to a standing reception, compare capacities and floor plans before you visit.</p></div>${switcher()}</section>
<section class="h-est" id="estimate"><div class="sec-head"><div><p class="h-kicker">Event estimate</p><h2>What will it cost?</h2></div><p>Choose your setup, guest count and menu to see an itemised estimate. You can carry it into a date enquiry.</p></div>${estimator()}<script type="module" src="/ui/hall.js"></script></section>
<section class="h-events"><div class="sec-head"><div><p class="h-kicker">Occasions</p><h2>Events at Hall Eleven</h2></div></div><div class="ev-grid">${Object.keys(events).map(eventCard).join("")}</div></section>
<section class="h-kitchen"><figure>${img("hall-chef", "A chef plating at a live counter during a reception")}</figure><div class="h-kitchen-copy" data-reveal><p class="h-kicker">The kitchen</p><h2>From our kitchen to your table.</h2><p class="lede">Chef Rohan and his team cook in the kitchen behind the hall. Choose from three menus, with Jain, vegan and regional options on request.</p>${link("menus", "See the menus " + icon("arrow"), "text-link")}</div></section>
<section class="h-intro"><figure>${img("hall-naina", "Naina Kapoor in the hall before an event")}</figure><div><p class="h-kicker">Your events manager</p><h2>Meet Naina Kapoor.</h2><p class="lede">Naina is your point of contact from the first walkthrough to the evening itself. She’ll help you choose a layout, plan timings and coordinate with your vendors.</p>${link("request", "Plan a visit " + icon("arrow"), "text-link")}</div></section>
<section class="h-voices" aria-label="Reviews"><div class="sec-head"><div><p class="h-kicker">${stars(5)} 4.9 from 180 client reviews</p><h2>What guests remember</h2></div><div class="rail-ctl"><button type="button" data-rail-prev aria-label="Previous review">${icon("left")}</button><button type="button" data-rail-next aria-label="Next review">${icon("right")}</button></div></div>${voices()}</section>
<section class="h-gallery" id="gallery"><div class="sec-head" id="instagram"><h2>Inside Hall Eleven</h2></div><div class="h-mosaic" data-gallery>${[["hall-hero", "Candlelit dinner in the main hall"], ["hall-wedding", "Wedding reception under the chandeliers"], ["hall-cocktail", "Cocktail tables in the main hall"], ["hall-terrace", "Open-air terrace with string lights"], ["hall-theatre", "Theatre seating facing the stage"], ["hall-banquet", "Banquet layout with round dining tables"]].map(([photo, alt], i) => `<a href="/assets/${photo}.webp" class="m${i}">${img(photo, alt)}</a>`).join("")}</div></section>
<section class="h-find" data-reveal><div><p class="h-kicker">Getting here</p><h2>Visit us in Kalyani Nagar.</h2><dl><div><dt>Address</dt><dd>${foot.address}</dd></div><div><dt>From Pune airport</dt><dd>15 minutes by car</dd></div><div><dt>Parking</dt><dd>80 cars on site, valet on request</dd></div><div><dt>Stay nearby</dt><dd>Four hotels within 1 km, with group rates for your guests</dd></div></dl></div><div class="h-find-act"><a class="pill solid" href="https://www.google.com/maps/search/?api=1&amp;query=Kalyani+Nagar+Pune" rel="noopener" target="_blank">${icon("pin")} Get directions</a><a class="pill" href="${WA}">${icon("chat")} WhatsApp Naina</a></div></section>
<section class="questions" data-reveal><h2>Before you book</h2>${faq(questions)}</section>
<section class="h-cta" data-reveal><p class="h-kicker">Site visits daily, 11 am – 7 pm</p><h2>Come see the hall.</h2><p>Walk through the room and terrace with Naina and talk through the setup for your date.</p><div class="h-act">${link("request", "Plan an event " + icon("arrow"), "pill solid")}<a class="pill" href="${WA}">${icon("chat")} WhatsApp</a></div></section>`,
      "hall-hero",
    );

  if (path === "menus")
    return page(
      "Menus",
      `<section class="h-top"><p class="h-kicker">Menus</p><h1>Cooked here, <em>served hot.</em></h1><p>Three menus to start from. Every one can go Jain, vegan or regional, and Chef Rohan will run a tasting for weddings over 150.</p></section><section class="h-menus solo">${menuCols()}</section><section class="h-kitchen"><figure>${img("hall-chef", "A chef plating at a live counter")}</figure><div class="h-kitchen-copy"><h2>Add a <em>live counter</em></h2><p class="lede">Chaat, dosa, pasta or a tandoor on wheels, from ₹180 per guest. Ask when you send your estimate.</p></div></section>`,
      "hall-chef",
    );

  const s = setups.find((x) => path === "spaces/" + x.id);
  if (s) {
    const m = setupMore[s.id];
    return page(
      s.label + " setup",
      `<section class="h-top"><nav class="crumbs">${link("", "Hall Eleven")} / Setups</nav><h1>The <em>${s.label.toLowerCase()}</em> setup</h1><p>${m.feel}</p></section><section class="h-setups solo">${switcher(s.id)}</section><section class="h-voices"><div class="sec-head"><h2>Planned <em>here before</em></h2><div class="rail-ctl"><button type="button" data-rail-prev aria-label="Previous review">${icon("left")}</button><button type="button" data-rail-next aria-label="Next review">${icon("right")}</button></div></div>${voices()}</section><section class="h-cta"><h2>Plan for up to <em>${s.cap} guests.</em></h2><div class="h-act">${action("Estimate this setup " + icon("arrow"), { setup: s.id })}</div></section>`,
      s.img,
    );
  }

  const id = path.startsWith("events/") ? path.slice(7) : "";
  if (Object.hasOwn(events, id)) {
    const e = events[id];
    return page(
      e.title,
      `<section class="h-event"><div class="h-event-img">${img(e.img, e.title + " at Hall Eleven", "", true)}</div><div class="h-event-copy"><nav class="crumbs">${link("", "Hall Eleven")} / ${e.title}</nav><h1>${e.title}</h1><p class="lede">${e.lede}</p><ul class="ticks">${e.points.map((t) => `<li>${icon("check")}${t}</li>`).join("")}</ul>${action("Plan yours " + icon("arrow"), { occasion: e.occasion })}</div></section><section class="h-menus"><div class="sec-head"><div><p class="h-kicker">Menus</p><h2>What we'll <em>serve</em></h2></div></div>${menuCols()}</section><section class="h-events"><div class="sec-head"><h2>Also <em>at the hall</em></h2></div><div class="ev-grid two">${Object.keys(events).filter((k) => k !== id).map(eventCard).join("")}</div></section>`,
      e.img,
    );
  }

  if (path === "request")
    return page(
      "Plan an event",
      `<section class="h-top slim"><p class="h-kicker">Event enquiry</p><h1>Plan your event.</h1><p>Build an estimate for your date and guest list, then save it in this browser. Contact the hall to confirm availability and pricing.</p></section><div class="workflow"><div id="demo-root" data-slug="${c.slug}" data-scroll-step></div></div>`,
      "hall-hero",
    );
}
