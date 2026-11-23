// Casa Neem: a full homestay website. Every person, review, number and price here is fictional.
import { rupees, icon, whatsapp, stars, faq, siteHeader, siteFooter, dock } from "./common.mjs";
import { todayAt, dayOffset, dateText } from "../site/demos.js";

const WA = whatsapp("+91 99999 01931", "Hi Casa Neem, I'd like to check dates for a stay.");
const more = {
  garden: { bed: "Queen bed", size: "28 m²", view: "Opens onto the courtyard", pics: ["neem-garden", "neem-bath", "neem-breakfast"], text: "The quietest room in the house, on the ground floor with its own verandah under the neem. Mornings start with birdsong and coffee two steps from the bed." },
  loft: { bed: "King bed + daybed", size: "36 m²", view: "Tree-top views", pics: ["neem-loft", "neem-dusk", "neem-bath"], text: "Up a short teak staircase, under the old roof beams. A daybed by the window catches the sunset over the paddy fields, and sleeps a third guest." },
  family: { bed: "King + two singles", size: "54 m²", view: "Private garden corner", pics: ["neem-family", "neem-pool", "neem-breakfast"], text: "Two rooms, a kitchenette and a shaded sit-out of its own. Built for families and old friends who want to share a stay without sharing a room." },
};
const day = [
  ["7:30", "Breakfast on the verandah", "Poi bread from the village bakery, papaya from the garden, eggs your way and strong Goan coffee.", "neem-breakfast"],
  ["11:00", "The pool under the jackfruit tree", "A small, cool plunge pool with loungers in the shade. Towels and fresh lime soda are on the house.", "neem-pool"],
  ["17:30", "A slow walk through Assagao", "Whitewashed chapels, paddy fields and the lanes the village is known for. We'll mark the good ones on a map.", "neem-lane"],
  ["20:00", "Dinner in the courtyard", "On request, a home-cooked Goan dinner by lantern light: xacuti, fish curry rice, and bebinca to finish.", "neem-dusk"],
];
const amenities = [
  ["coffee", "Goan breakfast", "Served 8–10:30 on the verandah"],
  ["pool", "Plunge pool", "Shaded, open 7am–8pm"],
  ["wifi", "Fast Wi-Fi", "Fibre, good enough for video calls"],
  ["fan", "Air-conditioning", "Plus ceiling fans in every room"],
  ["car", "Parking", "Two cars, free, inside the gate"],
  ["bike", "Scooter hire", "Delivered to the gate, ₹500/day"],
];
const reviews = [
  ["We came for three nights and stayed six. Anita's breakfast alone is worth the drive from Mumbai.", "Priya & Karan", "Mumbai · Garden Room"],
  ["Quiet, green, and ten minutes from everything loud. The loft at sunset is something else.", "Tom H.", "London · Loft Suite"],
  ["Two kids and two grandparents, and nobody wanted to leave. The cottage kitchen saved our mornings.", "The Fernandes family", "Bengaluru · Family Cottage"],
  ["Rui had scooters, a boat trip and a dinner table sorted before we'd even asked. Hosts like this are rare.", "Aditi S.", "Delhi · Loft Suite"],
];
const places = [
  ["Anjuna Beach", "12 min", "The closest beach, and the Wednesday flea market."],
  ["Vagator cliffs", "18 min", "Sunset from the red cliffs above the sea."],
  ["Mapusa market", "15 min", "Friday market for spices, sausages and cashews."],
  ["Thivim station", "25 min", "Konkan Railway; we can arrange a pickup."],
  ["Mopa airport (GOX)", "40 min", "Airport pickup ₹1,800, booked with your stay."],
];
const questions = [
  ["What time are check-in and check-out?", "Check-in is from 1pm and check-out is at 11am. If your flight lands early, leave your bags with us and have breakfast while your room is made up. Late check-out until 3pm is ₹1,200 when the room is free."],
  ["Is breakfast included?", "Breakfast is ₹450 per guest per night, or free when you book directly with us for three nights or more."],
  ["Can we bring children?", "Yes. Children under five stay free, and the Family Cottage has a kitchenette and a fenced garden corner. We keep a cot and a high chair."],
  ["Do you allow pets?", "Well-behaved dogs are welcome in the Family Cottage with a ₹800 cleaning fee. Please tell us when you enquire."],
  ["How do we pay, and can we cancel?", "We confirm availability first and send a UPI or card link for a 30% advance. Cancel up to 14 days before arrival for a full refund."],
  ["What is the monsoon like?", "From June to September the garden is at its greenest and rates drop by a quarter. Some beach shacks close, but the village is beautiful."],
];
const foot = {
  name: "Casa Neem",
  blurb: "A five-room homestay around an old neem tree in Assagao, North Goa. Hosted by Anita and Rui since 2019.",
  address: "House 214, Bairo Alto, Assagao, Bardez, Goa 403507",
  hours: "Front desk 8am–9pm, every day",
  phone: "+91 99999 01931",
  email: "stay@casaneem.example",
  insta: "@casaneem.goa",
  links: [["rooms", "Rooms & rates"], ["assagao", "Around Assagao"], ["request", "Send an enquiry"]],
};

export function casa(c) {
  const { path, opts, img, link, result, action, query } = c;
  const rooms = opts("room").map((r) => ({ ...r, ...more[r.id] }));
  const start = dayOffset(todayAt("Asia/Kolkata"), 2);
  // Impossible dates like 2026-13-01 make an Invalid Date, so check getTime before toISOString (which throws).
  const valid = (v) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v || "") || v < start || v > dayOffset(start, 200)) return false;
    const t = new Date(v + "T12:00:00Z");
    return Number.isFinite(t.getTime()) && t.toISOString().startsWith(v);
  };
  const checkin = valid(query.get("checkin")) ? query.get("checkin") : start;
  const out = query.get("checkout");
  const checkout = valid(out) && out > checkin && out <= dayOffset(checkin, 21) ? out : dayOffset(checkin, 3);
  const adults = Math.min(6, Math.max(1, Math.round(Number(query.get("adults"))) || 2));
  const stay = { checkin, checkout, adults };
  const nights = Math.round((new Date(checkout) - new Date(checkin)) / 864e5);
  const when = `${dateText(checkin, "en-IN", { day: "numeric", month: "short" })} – ${dateText(checkout, "en-IN", { day: "numeric", month: "short" })}`;

  const header = (over = false) =>
    siteHeader(c, { name: "Casa <i>Neem</i>", over, links: [["rooms", "Rooms"], ["assagao", "Assagao"], ["", "The house"]], cta: ["request", "Check availability", stay] });
  const page = (title, html, image, over = false) =>
    result(title, header(over) + html + siteFooter(c, foot) + dock(c, WA, ["rooms", "Check dates", stay]), image);
  const widget = (cls = "") =>
    `<form class="stay-bar ${cls}" action="${c.href("rooms")}"><label><span>Arrive</span><input name="checkin" type="date" min="${start}" value="${checkin}" required></label><label><span>Depart</span><input name="checkout" type="date" min="${dayOffset(checkin, 1)}" value="${checkout}" required></label><label><span>Guests</span><select name="adults">${[1, 2, 3, 4, 5, 6].map((n) => `<option value="${n}"${n === adults ? " selected" : ""}>${n} guest${n > 1 ? "s" : ""}</option>`).join("")}</select></label><button>Find a room ${icon("arrow")}</button></form>`;
  const roomRow = (r, i) => {
    const fits = adults <= r.sleeps;
    return `<article class="room-row${i % 2 ? " flip" : ""}" data-reveal>${link("rooms/" + r.id, img(r.img, r.label + " at Casa Neem"), "room-pic", stay)}<div class="room-copy"><h3>${link("rooms/" + r.id, r.label, "", stay)}</h3><p>${r.text}</p><ul class="room-facts"><li>${icon("bed")}${r.bed}</li><li>${icon("users")}Sleeps ${r.sleeps}</li><li>${icon("ruler")}${r.size}</li></ul><div class="room-price"><p><b>${rupees(r.price)}</b> / night</p>${fits ? link("rooms/" + r.id, "See the room " + icon("arrow"), "pill", stay) : `<p class="too-small">Sleeps ${r.sleeps}, too small for ${adults}</p>`}</div></div></article>`;
  };

  if (!path)
    return page(
      "A five-room homestay in Assagao, Goa",
      `<section class="cover"><div class="cover-img">${img("neem-hero", "The courtyard at Casa Neem with the neem tree, bougainvillea and indigo cushions", "", true)}</div><div class="cover-copy"><h1>A house<br>in <em>Assagao.</em></h1><p>Five rooms around an old neem tree, ten minutes from Anjuna and a world away from it.</p></div>${widget("on-cover")}</section>
<section class="welcome" data-reveal><div class="welcome-text"><p class="lede">Built in 1931 for a family of rice farmers, restored by hand in 2019. We kept the red-oxide floors, the carved doors and the tree. We added cold showers, good mattresses and very fast Wi-Fi.</p><div class="host"><p><b>Anita &amp; Rui D’Souza</b>Your hosts, who live in the house next door</p><p class="rating">${stars(5)}<span><b>4.9</b> from 212 Google reviews</span></p></div></div><figure class="welcome-pic">${img("neem-hosts", "Anita and Rui sitting on the verandah steps of Casa Neem")}<figcaption>Anita and Rui on the verandah steps</figcaption></figure></section>
<section class="rooms" id="rooms"><div class="sec-head"><h2>Three ways to stay</h2>${link("rooms", "All rooms & rates " + icon("arrow"), "text-link", stay)}</div>${rooms.map(roomRow).join("")}</section>
<section class="day" data-day aria-label="A day at Casa Neem"><div class="day-pics">${day.map((d, i) => `<figure data-day-img class="${i ? "" : "on"}">${img(d[3], d[1])}</figure>`).join("")}</div><div class="day-steps"><h2>A day at the house</h2><ol>${day.map((d) => `<li data-day-step><time>${d[0]}</time><h3>${d[1]}</h3><p>${d[2]}</p></li>`).join("")}</ol></div></section>
<section class="amen" data-reveal><h2>Everything you need, nothing that hums</h2><ul>${amenities.map(([i, t, d]) => `<li>${icon(i)}<div><b>${t}</b><span>${d}</span></div></li>`).join("")}</ul></section>
<section class="voices" aria-label="Guest reviews"><div class="sec-head"><h2>Guests, in their words</h2><div class="rail-ctl"><button type="button" data-rail-prev aria-label="Previous review">${icon("left")}</button><button type="button" data-rail-next aria-label="Next review">${icon("right")}</button></div></div><div class="rail" data-rail tabindex="0">${reviews.map(([q, who, where]) => `<blockquote>${stars(5)}<p>“${q}”</p><footer><b>${who}</b>${where}</footer></blockquote>`).join("")}</div></section>
<section class="gallery" id="instagram"><div class="sec-head"><h2>From the house</h2><a class="text-link" href="#instagram">${icon("insta")} ${foot.insta}</a></div><div class="mosaic" data-gallery>${["neem-hero", "neem-breakfast", "neem-loft", "neem-pool", "neem-dusk"].map((g, i) => `<a href="/assets/${g}.webp" class="m${i}">${img(g, "Casa Neem photograph " + (i + 1))}</a>`).join("")}</div></section>
<section class="around" data-reveal><figure>${img("neem-lane", "A whitewashed chapel on a lane in Assagao")}</figure><div><h2>Around Assagao</h2><p>The village sits inland, between paddy fields and the hills. Close enough to the beaches to be there by breakfast, far enough to sleep.</p><ul class="dist">${places.map(([p, t]) => `<li><span>${p}</span><b>${t}</b></li>`).join("")}</ul>${link("assagao", "Our neighbourhood guide " + icon("arrow"), "text-link")}</div></section>
<section class="questions" data-reveal><h2>Before you ask</h2>${faq(questions)}</section>
<section class="direct" data-reveal><div><h2>Book direct, breakfast is on us.</h2><p>Stay three nights or more and breakfast is free for everyone in the room. No platform fees, and you talk to the people who'll be cooking it.</p></div><div class="direct-act">${link("request", "Check availability", "pill solid", stay)}<a class="pill" href="${WA}">${icon("chat")} WhatsApp Anita</a></div></section>`,
      "neem-hero",
      true,
    );

  if (path === "rooms")
    return page(
      "Rooms & rates",
      `<section class="page-top"><h1>Rooms &amp; rates</h1><p>Three rooms, each with its own door to the garden. Rates are per room per night, before 12% GST.</p>${widget()}<p class="stay-note">${icon("check")} ${nights} night${nights > 1 ? "s" : ""}, ${when} · ${adults} guest${adults > 1 ? "s" : ""}</p></section><section class="rooms">${rooms.map(roomRow).join("")}</section><section class="questions" data-reveal><h2>Good to know</h2>${faq(questions.slice(0, 3))}</section>`,
      "neem-loft",
    );

  if (path === "assagao")
    return page(
      "Around Assagao",
      `<section class="page-top"><h1>A morning in <em>Assagao</em></h1><p>Our favourite things within half an hour of the gate. Ask us for the hand-drawn map at check-in.</p></section><section class="guide">${img("neem-lane", "A lane in Assagao")}<ol>${places.map(([p, t, d]) => `<li data-reveal><b>${p}</b><span>${t} by car</span><p>${d}</p></li>`).join("")}</ol></section><section class="direct" data-reveal><div><h2>We'll plan the day for you.</h2><p>Scooters, boat trips, a cooking class with Anita: tell us when you enquire.</p></div><div class="direct-act">${link("rooms", "Browse the rooms", "pill solid", stay)}</div></section>`,
      "neem-lane",
    );

  if (path === "request")
    return page(
      "Check availability",
      `<section class="page-top slim"><h1>Check availability</h1><p>Tell us your dates and who's coming. Anita replies within a few hours, and nothing is charged until you confirm.</p></section><div class="workflow"><div id="demo-root" data-slug="${c.slug}"></div></div>`,
      "neem-hero",
    );

  const r = rooms.find((o) => path === "rooms/" + o.id);
  if (!r) return;
  const sub = r.price * nights;
  const fits = adults <= r.sleeps;
  return page(
    r.label,
    `<section class="room-hero"><div class="room-gal" data-gallery>${r.pics.map((g, i) => `<a href="/assets/${g}.webp" class="g${i}">${img(g, r.label + " photograph " + (i + 1))}</a>`).join("")}</div></section><section class="room-body"><article><nav class="crumbs">${link("rooms", "Rooms", "", stay)} / ${r.label}</nav><h1>${r.label}</h1><p class="lede">${r.text}</p><ul class="room-facts">${[["bed", r.bed], ["users", "Sleeps " + r.sleeps], ["ruler", r.size], ["leaf", r.view]].map(([i, t]) => `<li>${icon(i)}${t}</li>`).join("")}</ul><h2>In the room</h2><ul class="ticks">${["Air-conditioning and ceiling fan", "Rain shower and organic toiletries", "Cotton bedlinen, block-printed in Jaipur", "Desk, fast Wi-Fi and plenty of sockets", "Kettle, Goan coffee and a fridge"].map((t) => `<li>${icon("check")}${t}</li>`).join("")}</ul></article><aside class="quote" aria-label="Your stay"><p class="q-rate"><b>${rupees(r.price)}</b> / night</p><dl><div><dt>Dates</dt><dd>${when}</dd></div><div><dt>Guests</dt><dd>${adults}</dd></div><div><dt>${rupees(r.price)} × ${nights} night${nights > 1 ? "s" : ""}</dt><dd>${rupees(sub)}</dd></div><div><dt>GST (12%)</dt><dd>${rupees(Math.round(sub * 0.12))}</dd></div><div class="tot"><dt>Total</dt><dd>${rupees(Math.round(sub * 1.12))}</dd></div></dl>${fits ? action("Request these dates", { room: r.id, ...stay }) : `<p class="too-small">This room sleeps ${r.sleeps}. ${link("rooms/family", "Try the Family Cottage", "", stay)}</p>`}<p class="small">Pay nothing now. We confirm availability first.</p>${link("rooms", "Change dates", "text-link", stay)}</aside></section><section class="rooms others"><div class="sec-head"><h2>Other rooms</h2></div>${rooms.filter((o) => o !== r).map(roomRow).join("")}</section>`,
    r.img,
  );
}
