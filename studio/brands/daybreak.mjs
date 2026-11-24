// Daybreak Café: a full multi-page café website. Every person, quote, price and contact detail is fictional.
import { esc, rupees, icon, whatsapp, faq, siteHeader, dock } from "./common.mjs";
import { cafe, categories, menu, optionSets, dietLabel, allergenLabel } from "./daybreak-menu.mjs";

const WA = whatsapp(cafe.whatsapp, "Hi Daybreak, I'd like to ask about a table.");
// Photo library: id → [width, height, alt, gallery tag]. One place for alt text, sizes and the gallery.
const L = [1536, 1024], P = [1024, 1536], S = [1254, 1254];
const photos = {
  "daybreak-cafe-hero": [[1600, 1067], "Morning sun through the arched window at Daybreak, a cappuccino and an almond croissant on a marble table", "space"],
  "daybreak-interior": [L, "The main room at Daybreak: an oak coffee bar, cane chairs, marble tables and tall arched windows", "space"],
  "daybreak-exterior": [L, "Daybreak's forest-green shopfront on a leafy lane, with cane chairs outside and bougainvillea over the door", "space"],
  "daybreak-window": [P, "A cushioned window seat with a cappuccino and an open book in the morning sun", "space"],
  "daybreak-outdoor": [L, "The courtyard under the neem tree, with cane chairs and marble bistro tables", "space"],
  "daybreak-evening": [L, "Daybreak in the early evening, brass lamps glowing against a blue dusk", "space"],
  "daybreak-cafe-space": [[900, 1125], "The long communal table set for a group breakfast under brass pendant lamps", "space"],
  "daybreak-espresso": [P, "A barista pulling an espresso shot into a cream ceramic cup", "coffee"],
  "daybreak-beans": [L, "Freshly roasted beans, a pour-over dripper and a brass kettle on the oak counter", "coffee"],
  "daybreak-cappuccino": [S, "A cappuccino with rosetta latte art on a marble table", "coffee"],
  "daybreak-spanish-latte": [S, "An iced Spanish latte layered with condensed milk", "coffee"],
  "daybreak-matcha": [S, "An iced matcha latte beside a bamboo whisk", "coffee"],
  "daybreak-seasonal": [P, "Jaggery and cinnamon cold brew with an orange twist", "coffee"],
  "daybreak-croissants": [L, "A tray of golden butter croissants cooling on the bakery counter", "food"],
  "daybreak-sourdough": [P, "Country sourdough loaves on oak shelves behind the bakery counter", "food"],
  "daybreak-avocado": [S, "Avocado sourdough toast with chilli, seeds and microgreens", "food"],
  "daybreak-benedict": [S, "Eggs benedict with brown-butter hollandaise", "food"],
  "daybreak-pancakes": [S, "Blueberry pancakes with maple syrup", "food"],
  "daybreak-cheesecake": [S, "A slice of burnt Basque cheesecake with filter coffee", "food"],
  "daybreak-founders": [L, "Ananya and Kabir Rao, Daybreak's founders, behind the coffee bar", "people"],
  "daybreak-barista": [P, "Rohan, head barista, steaming milk at the espresso machine", "people"],
  "daybreak-baker": [P, "Meera, the pastry chef, shaping croissants on the floured bench", "people"],
  "daybreak-gathering": [L, "A small birthday gathering around the long oak table", "people"],
  "daybreak-workshop": [L, "A coffee cupping workshop around the oak table", "people"],
};
// Dish photos (generated in ChatGPT, 1254px square, one art direction): menu and dish pages only, kept out of the gallery.
const dishAlt = {
  espresso: "A double espresso in a speckled cream cup with a glass of water",
  cortado: "A cortado in a small glass on a marble table",
  "flat-white": "A flat white with tulip latte art in a speckled cream cup",
  "filter-kaapi": "South Indian filter kaapi, frothed in a steel tumbler and dabarah",
  "cold-brew": "Slow cold brew over a large ice cube",
  "iced-americano": "An iced americano in a tall glass",
  "espresso-tonic": "An espresso tonic layered over ice with an orange twist",
  "cardamom-honey-latte": "A cardamom honey latte beside a dish of honey and green cardamom pods",
  "gulkand-latte": "A rose-tinted gulkand latte scattered with dried rose petals",
  "masala-chai": "Masala chai in a glass beside a brass pan, fresh ginger and whole spices",
  "hibiscus-iced-tea": "A deep red hibiscus iced tea with lime",
  darjeeling: "Darjeeling tea in a speckled cup with a small teapot and loose leaves",
  "soft-scramble": "Soft scrambled eggs with chives on sourdough",
  "granola-bowl": "House granola on hung curd with guava, pomegranate and honey",
  "akuri-toast": "Akuri, Parsi-style spiced scrambled eggs, on sourdough with a lime wedge",
  shakshuka: "Green shakshuka with spinach, leek, feta and baked eggs, served with focaccia",
  "big-breakfast": "The big breakfast: fried eggs, mushrooms, baked beans, roast tomato, crisp potatoes and sourdough",
  "masala-omelette": "A masala omelette with coriander and buttered toast",
  "mushroom-toast": "Garlic-roasted mushrooms with thyme and shaved cheese on sourdough",
  "chilli-cheese-toastie": "A chilli cheese toastie pulled apart, with a bowl of chilli jam",
  "chicken-pesto-focaccia": "A chicken pesto focaccia sandwich with rocket and sun-dried tomato",
  "almond-croissant": "A twice-baked almond croissant with flaked almonds and icing sugar",
  "pain-au-chocolat": "Pain au chocolat on an oak board, one cut open to show the chocolate",
  "cardamom-bun": "Cardamom knots glazed with cardamom sugar",
  "banana-bread": "Slices of walnut banana bread with fresh banana",
  "orange-cake": "A slice of orange and olive oil cake topped with candied orange",
  tiramisu: "A square of tiramisu dusted with cocoa",
  "dark-chocolate-tart": "A slice of dark chocolate tart with sea salt",
};
for (const [id, alt] of Object.entries(dishAlt)) photos["daybreak-dish-" + id] = [S, alt, "dish"];

function pic(id, { cls = "", eager = false, sizes = "100vw", alt } = {}) {
  const [[w, h], a] = photos[id];
  // Every photo has a 760px-wide phone copy (cwebp -resize 760 0); dish photos also have a 240px copy for menu thumbnails.
  // Wide photos (1400px+) add an 1180px copy: 3x phones otherwise jump straight to the full file.
  const thumb = id.startsWith("daybreak-dish-") ? `/assets/${id}-240.webp 240w, ` : "";
  const mid = w >= 1400 ? `/assets/${id}-1180.webp 1180w, ` : "";
  return `<img class="${cls}" src="/assets/${id}.webp" srcset="${thumb}/assets/${id}-760.webp 760w, ${mid}/assets/${id}.webp ${w}w" width="${w}" height="${h}" alt="${esc(alt ?? a)}" sizes="${sizes}" decoding="async"${eager ? ' fetchpriority="high"' : ' loading="lazy"'}>`;
}
// Brand mark: a sun breaking the horizon, the italic wordmark and the spaced "Coffee House" line from the original identity.
const sun = `<svg class="db-sun" viewBox="0 0 48 26" aria-hidden="true"><path d="M12 21a12 12 0 0 1 24 0z" fill="currentColor"/><path d="M24 2v5M9.5 8l3.2 3.6M38.5 8l-3.2 3.6M3 15.5l4.6 1.4M45 15.5l-4.6 1.4M1 23.5h46" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
const mark = `<span class="db-mark">${sun}<span class="db-word">Daybreak</span><small>Coffee House</small></span>`;

const byId = Object.fromEntries(menu.map((d) => [d.id, d]));
const catName = Object.fromEntries(categories.map(([id, n]) => [id, n]));
// India's veg/non-veg mark: a green square with a dot (veg, vegan) or a brown triangle (egg, meat); the label carries the meaning for screen readers.
const dietMark = (d) =>
  `<svg class="diet diet-${d.diet}" viewBox="0 0 14 14" role="img" aria-label="${dietLabel[d.diet]}"><rect x=".75" y=".75" width="12.5" height="12.5" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.5"/>${d.diet === "nonveg" || d.diet === "egg" ? '<path d="M7 3.5 10.5 10h-7z" fill="currentColor"/>' : '<circle cx="7" cy="7" r="3.2" fill="currentColor"/>'}</svg>`;
const tags = (d) =>
  [d.best ? '<span class="tag best">Bestseller</span>' : "", d.diet === "vegan" ? '<span class="tag">Vegan</span>' : "", d.diet === "egg" ? '<span class="tag">Contains egg</span>' : ""].join("");
// Search text for instant filtering; the server uses the same text so shared ?q= links match what the page shows.
const haystack = (d) => [d.name, d.line, catName[d.cat], ...d.ingredients, dietLabel[d.diet]].join(" ").toLowerCase();
const dietOk = (d, diet) => (diet === "veg" ? d.diet === "veg" || d.diet === "vegan" : diet === "vegan" ? d.diet === "vegan" : true);
const matches = (d, q, diet) => dietOk(d, diet) && q.split(/\s+/).filter(Boolean).every((t) => haystack(d).includes(t));

const guestNote = '<p class="disclose">Illustrative guest notes written for this concept site. Not real reviews.</p>';
const notes = [
  ["I came for the croissant and stayed for three hours. The window seat in the morning is the best seat in Pune.", "A regular, Saturday mornings"],
  ["The filter kaapi tastes exactly like my grandmother's. I did not expect that from a place with a pour-over menu.", "A Deccan neighbour"],
  ["We booked the long table for my mother's seventieth. They printed a little menu with her name on it.", "A birthday breakfast for twelve"],
  ["Quiet enough to work, busy enough to feel alive. The Wi-Fi is good and nobody hurries you.", "A weekday laptop regular"],
  ["Rohan talked me through three pour-overs before I found one I loved. Now I buy the beans every fortnight.", "A home brewer"],
];
const questions = {
  "Reservations": [
    ["Do I need to book?", "Not for two or three on a weekday; walk in and we will find you a seat. We recommend booking for weekend mornings, for groups of five or more, and for the window seat."],
    ["How far ahead can I ask for a table?", "Up to 60 days ahead. For weekend brunch, a week ahead is usually plenty."],
    ["How long can we keep a table?", "As long as you like on weekdays. On weekend mornings we hold tables for 90 minutes when there is a queue, and we will always tell you when you book."],
    ["What if we are running late?", "Message us. We hold a table for 15 minutes, longer if we know you are on your way."],
  ],
  "Food & dietary needs": [
    ["Do you have vegan and eggless options?", "Yes. Every dish is marked vegetarian, vegan, contains egg or non-vegetarian. Following Indian practice, dishes with egg are not marked vegetarian, so the Vegetarian filter shows only egg-free dishes. The banana bread and chocolate tart are fully vegan."],
    ["Can you cater for allergies?", "Every dish lists its main allergens. Our kitchen handles gluten, dairy, egg and tree nuts, so we cannot promise a completely allergen-free plate; please tell your server before you order."],
    ["Is there a gluten-free option?", "The orange and olive oil cake is made with polenta and almond flour. Most egg dishes can be served without toast."],
    ["Do you serve non-vegetarian food?", "Two dishes: the eggs benedict with smoked chicken ham, and the roast chicken and pesto focaccia. Both are marked non-vegetarian, and meat is prepared and stored separately. The benedict can be made vegetarian with spinach."],
  ],
  "Coffee": [
    ["Which milks do you have?", "Whole milk from a dairy in Mulshi, oat milk and almond milk. Plant milks are ₹60 extra."],
    ["Can I buy your beans?", "Yes. The house blend and the weekly single origin are on the shelf by the counter in 250 g bags, ground to order if you like."],
    ["Do you run brewing classes?", "Twice a month: a cupping on the first Saturday and a home-brewing class on the third. See the events page for details."],
  ],
  "Visiting": [
    ["Is there parking?", "Two-wheeler parking outside the café. For cars, there is paid parking on Bhandarkar Road, a two-minute walk away."],
    ["Is the café accessible?", "The main room and the washroom are step-free from the lane. The courtyard has one shallow step, and we have a ramp for it."],
    ["Can I work from the café?", "Of course. Wi-Fi is free and there are sockets along the banquette. On weekend mornings we ask laptop guests to share the long table."],
    ["Are pets welcome?", "Dogs on a lead are welcome in the courtyard, and we keep a water bowl by the gate."],
  ],
  "Events": [
    ["How many people can you host?", "Up to 14 at the long table, 16 in the courtyard, and 40 if you take the whole café for an evening after 8 pm."],
    ["Can we bring our own cake?", "Yes, with a ₹500 cake-cutting fee, or our pastry kitchen can make one with five days' notice."],
    ["Is there a minimum spend?", "Weekday group tables have none. Weekend group bookings and private evenings have a minimum spend, which we confirm with you before anything is booked."],
  ],
};
const formats = [
  ["Birthdays & small celebrations", "Up to 14 guests at the long table", "From ₹650 per guest", "daybreak-gathering", "A set breakfast or brunch menu, a cake from our pastry kitchen if you'd like one, and the table dressed with flowers. Mornings are best; the light is beautiful until noon."],
  ["Coffee workshops", "6 to 12 guests, 2 hours", "₹1,800 per guest", "daybreak-workshop", "A public cupping on the first Saturday of each month and a home-brewing class on the third, or a private session for your team or friends. Everyone goes home with a bag of beans."],
  ["Team breakfasts", "8 to 16 guests, weekdays", "From ₹550 per guest", "daybreak-cafe-space", "Pastries, coffee and one hot plate each, laid out by 8:30 so you can start the meeting on time. We can invoice your company."],
  ["Private evenings", "Up to 40 guests, after 8 pm", "Minimum spend confirmed on enquiry", "daybreak-evening", "The whole café after closing: lamps low, a coffee and dessert bar, small plates and your own playlist. Ideal for book launches, intimate engagements and farewells."],
];

export function daybreak(c) {
  const { path, link, result, query } = c;
  const head = (over = false) =>
    siteHeader(c, {
      name: mark,
      links: [["menu", "Menu"], ["coffee", "Our Coffee"], ["story", "Our Story"], ["gallery", "Gallery"], ["visit", "Visit Us"], ["events", "Events"], ["faq", "FAQ"]],
      cta: ["request", "Book a Table"],
      over,
    });
  const open = `<p class="open-now" data-open="${cafe.open.join(",")}"><span></span><b>Open daily</b> 7 am – 8 pm</p>`;
  const page = (title, html, { image, over = false, description, status } = {}) => ({
    ...result(title, `<link rel="preload" href="/assets/daybreak-serif-400.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/assets/daybreak-serif-400-italic.woff2" as="font" type="font/woff2" crossorigin><a class="skip" href="#db-main">Skip to content</a>` + head(over) + `<div class="db-page" id="db-main" tabindex="-1">${html}</div>` + footer() + dock(c, WA, ["request", "Book a Table"]) + `<script type="module" src="/ui/daybreak.js"></script>`, image),
    description,
    status,
    category: "brand",
  });
  const arrow = icon("arrow");
  const btn = (p, label, cls = "", params = {}) => link(p, `<span>${label}</span>${arrow}`, "db-btn " + cls, params);
  const crumbs = (trail) => `<nav class="crumbs" aria-label="Breadcrumb"><ol>${trail.map(([p, l], i) => `<li>${i < trail.length - 1 ? link(p, l) : `<span aria-current="page">${l}</span>`}</li>`).join("")}</ol></nav>`;
  const intro = (kicker, title, lede, trail) =>
    `<header class="db-intro">${trail ? crumbs(trail) : ""}<p class="kicker">${kicker}</p><h1 class="db-h1">${title}</h1>${lede ? `<p class="lede">${lede}</p>` : ""}</header>`;

  function footer() {
    const credit = `<p class="credit">Website by <a href="/">Chetan Studio</a> · Concept website for a fictional café. Names, people, menu and contact details are illustrative.</p>`;
    return `<footer class="site-foot db-foot"><div class="db-foot-top"><p class="db-foot-line">Good mornings<br><em>begin here.</em></p>${btn("request", "Book a table", "light")}</div><div class="foot-grid"><div class="foot-brand">${link("", mark, "site-name")}<p>An independent coffee house and bakery in ${cafe.area}. Coffee, kitchen and a little space to slow down.</p></div><div><h2>Hours</h2><dl class="db-hours">${cafe.hours.map(([d, t]) => `<div><dt>${d}</dt><dd>${t}</dd></div>`).join("")}</dl></div><div><h2>Find us</h2><p>${cafe.address}</p><p><a href="tel:${cafe.phone.replace(/\s/g, "")}">${cafe.phone}</a></p><p><a href="mailto:${cafe.email}">${cafe.email}</a></p><p><a href="${c.href("gallery")}">${icon("insta")} ${cafe.insta}</a></p></div><div><h2>Explore</h2><nav aria-label="Footer">${[["menu", "Full menu"], ["coffee", "Our coffee"], ["story", "Our story"], ["gallery", "Gallery"], ["events", "Events & gatherings"], ["visit", "Visit us"], ["faq", "Questions"], ["request", "Book a table"]].map(([p, l]) => link(p, l)).join("")}</nav></div></div><div class="foot-base"><span>© ${new Date().getFullYear()} ${cafe.name}</span>${credit}</div></footer>`;
  }

  // A menu line: name, dotted leader and price, like the printed card on the counter.
  const line = (d, { thumb = true, hidden = false } = {}) =>
    `<li class="mi" data-dish data-diet="${d.diet}" data-text="${esc(haystack(d))}"${hidden ? " hidden" : ""}>${link("menu/" + d.id, `${thumb && d.img ? pic(d.img, { cls: "mi-pic", sizes: "88px", alt: "" }) : ""}<span class="mi-body"><span class="mi-top"><span class="mi-name">${dietMark(d)}${d.name}</span><span class="mi-lead" aria-hidden="true"></span><span class="mi-price">${rupees(d.price)}</span></span><span class="mi-line">${d.line}</span><span class="mi-tags">${tags(d)}</span></span>`, "mi-link")}</li>`;
  const tile = (d, cls = "") =>
    `<article class="sig ${cls}" data-reveal>${link("menu/" + d.id, `<figure>${pic(d.img, { sizes: "(max-width: 760px) 90vw, 40vw" })}</figure><span class="sig-top"><span class="sig-name">${dietMark(d)}${d.name}</span><span class="sig-price">${rupees(d.price)}</span></span><span class="sig-line">${d.line}</span><span class="mi-tags">${tags(d)}</span>`, "sig-link")}</article>`;

  // ── Home
  if (!path) {
    const sig = ["classic-cappuccino", "avocado-sourdough-toast", "spanish-latte", "almond-croissant", "iced-matcha-latte", "eggs-benedict"].map((id) => byId[id]);
    const day = [
      ["7:00", "The shutters go up", "The first croissants come out of the oven and the bar dials in the espresso. The lane is still quiet; the regulars are not.", "daybreak-exterior"],
      ["8:30", "The morning rush, gently", "Filter kaapi for the walkers from the Law College hill, flat whites for the office crowd, and the window seat already taken.", "daybreak-espresso"],
      ["10:30", "Slow breakfasts", "Pancakes for the table, a second coffee, the newspaper passed between strangers. Nobody is rushing you out.", "daybreak-cafe-hero"],
      ["1:00", "Lunch under the neem", "The courtyard fills with toasties and iced tea. Cardamom knots come out at eleven and are mostly gone by now.", "daybreak-outdoor"],
      ["6:30", "Lamps on", "The light turns gold, then blue. Cold brew becomes decaf, the last loaves go home in paper bags, and the music gets a little softer.", "daybreak-evening"],
    ];
    const team = [
      ["daybreak-barista", "Rohan Desai", "Head barista", "Q-grader in training. Will happily talk about water chemistry for longer than you'd like."],
      ["daybreak-baker", "Meera Joshi", "Pastry chef", "Trained in Lyon, laminates every croissant by hand and starts work at 3:30 am."],
    ];
    const gal = ["daybreak-interior", "daybreak-cappuccino", "daybreak-croissants", "daybreak-window", "daybreak-benedict", "daybreak-outdoor", "daybreak-matcha", "daybreak-evening"];
    return page(
      "Specialty coffee, bakery & breakfast in Deccan, Pune",
      `<section class="db-hero" aria-labelledby="hero-title"><figure class="db-hero-pic">${pic("daybreak-cafe-hero", { eager: true })}</figure><div class="db-hero-copy"><p class="kicker">Coffee house &amp; bakery · ${cafe.area}</p><h1 id="hero-title" class="db-display"><span class="ln"><span>Good mornings</span></span> <span class="ln"><span><em>begin here.</em></span></span></h1><p class="lede">Thoughtfully brewed coffee, freshly baked favourites and a little space to slow down.</p><div class="db-act">${btn("menu", "Explore our menu", "sun")}${btn("request", "Book a table", "ghost")}</div></div><div class="db-hero-foot">${open}<a href="#visit">${icon("pin")} Garden Lane, off Bhandarkar Road</a><p>${icon("coffee")} Breakfast served until 4 pm</p></div></section>


<section class="db-sigs" aria-labelledby="sig-title"><div class="db-sec-head"><div><p class="kicker">The signatures</p><h2 id="sig-title" class="db-h2">What people come back <em>for.</em></h2></div><p>Six plates and cups we would order every day. Tap one for ingredients, allergens and what to pair it with.</p></div><div class="sig-grid">${sig.map((d, i) => tile(d, i === 0 || i === sig.length - 1 ? "wide" : "")).join("")}</div><div class="db-center">${btn("menu", "See the full menu", "dark")}</div></section>

<section class="db-coffee" aria-labelledby="coffee-title"><figure class="db-coffee-pic">${pic("daybreak-beans", { sizes: "(max-width: 900px) 100vw, 55vw" })}</figure><div class="db-coffee-copy" data-reveal><p class="kicker">The coffee</p><h2 id="coffee-title" class="db-h2">From the hills of Karnataka <em>to the cup in your hand.</em></h2><p>We buy directly from four family estates, roast in small batches every Tuesday and rest the beans a week before they reach the grinder. The bar weighs every shot, times every pour, and tastes the espresso again after lunch.</p><dl class="db-recipe"><div><dt>House espresso</dt><dd>18 g in · 36 g out · 28 s</dd></div><div><dt>Roasted</dt><dd>Every Tuesday, 6 kg at a time</dd></div><div><dt>This week's pour-over</dt><dd>Baba Budangiri natural</dd></div></dl>${btn("coffee", "Our coffee", "light")}</div></section>

<section class="db-season" aria-labelledby="season-title"><div class="season-card" data-reveal><p class="season-top"><span>Winter menu</span><span>November – February</span></p><h2 id="season-title">The <em>season's</em> specials</h2><p class="season-sub">Available while the mornings are cool and the oranges are in.</p><ul>${[["jaggery-cold-brew", "Kolhapur jaggery, Ceylon cinnamon, orange peel"], ["gulkand-latte", "Sun-cured rose preserve, espresso, milk"], ["orange-olive-oil-cake", "Nagpur oranges, olive oil, polenta"], ["granola-bowl", "This month: guava and pomegranate"], ["cardamom-bun", "Out of the oven at 11 am"]].map(([id, note]) => `<li>${link("menu/" + id, `<span class="s-name">${byId[id].name}</span><span class="mi-lead" aria-hidden="true"></span><span class="s-price">${rupees(byId[id].price)}</span><small>${note}</small>`)}</li>`).join("")}</ul><p class="season-sign">${sun} Daybreak Coffee House</p></div><figure class="season-pic" data-reveal>${pic("daybreak-seasonal", { sizes: "(max-width: 900px) 80vw, 34vw" })}<figcaption>Jaggery &amp; cinnamon cold brew, ₹280</figcaption></figure></section>

<section class="db-oven" aria-labelledby="oven-title"><figure class="oven-a">${pic("daybreak-croissants", { sizes: "(max-width: 900px) 100vw, 60vw" })}</figure><div class="oven-copy" data-reveal><p class="kicker">Fresh from the oven</p><h2 id="oven-title" class="db-h2">Baked here, <em>before you're awake.</em></h2><p>Meera and her team start at 3:30 am. Everything on the counter is laminated, proved and baked in our own kitchen, and when a tray is empty it is gone until tomorrow.</p><ol class="oven-times">${[["7:00", "butter-croissant", "Butter croissants"], ["7:30", "sourdough-loaf", "Country sourdough"], ["10:00", "almond-croissant", "Almond croissants, second bake"], ["11:00", "cardamom-bun", "Cardamom knots"]].map(([t, id, n]) => `<li><time>${t}</time>${link("menu/" + id, n)}</li>`).join("")}</ol></div><figure class="oven-b" data-reveal>${pic("daybreak-sourdough", { sizes: "(max-width: 900px) 50vw, 24vw" })}</figure></section>

<section class="db-day" data-day aria-label="A morning at Daybreak"><div class="day-pics">${day.map((d, i) => `<figure data-day-img class="${i ? "" : "on"}">${pic(d[3], { alt: d[1] })}</figure>`).join("")}</div><div class="day-steps"><p class="kicker">A day at Daybreak</p><h2 class="db-h2">From first light <em>to lamps on.</em></h2><ol>${day.map((d) => `<li data-day-step><time>${d[0]}</time><h3>${d[1]}</h3><p>${d[2]}</p></li>`).join("")}</ol></div></section>

<section class="db-space" aria-labelledby="space-title"><div class="db-sec-head"><div><p class="kicker">The space</p><h2 id="space-title" class="db-h2">Pull up a chair, <em>any chair.</em></h2></div><p>Forty seats across three rooms and a courtyard. Pick the corner that suits your morning.</p></div><div class="space-grid">${[["daybreak-interior", "The main room", "Twenty seats, the bar and the pastry counter."], ["daybreak-window", "The window seat", "Four seats, the best light in the house. Book it."], ["daybreak-cafe-space", "The long table", "Fourteen seats for groups, or for sharing with strangers."], ["daybreak-outdoor", "The courtyard", "Sixteen seats under the neem tree. Dogs welcome."]].map(([id, t, d], i) => `<figure class="sp sp-${i}" data-reveal>${pic(id, { sizes: "(max-width: 760px) 100vw, 50vw" })}<figcaption><b>${t}</b>${d}</figcaption></figure>`).join("")}</div></section>

<section class="db-people" aria-labelledby="people-title"><figure class="people-main" data-reveal>${pic("daybreak-founders", { sizes: "(max-width: 900px) 100vw, 58vw" })}</figure><div class="people-copy" data-reveal><p class="kicker">The people behind Daybreak</p><h2 id="people-title" class="db-h2">Ananya &amp; Kabir, <em>and the morning crew.</em></h2><p>Ananya left a decade in hotel kitchens to roast coffee; Kabir left a laptop job to learn to bake. They met over a bad cappuccino in 2017 and promised each other a better one.</p>${link("story", "Meet the team " + arrow, "text-link")}</div><ul class="people-team">${team.map(([id, n, r, d]) => `<li data-reveal><figure>${pic(id, { sizes: "(max-width: 760px) 44vw, 18vw" })}</figure><b>${n}</b><span>${r}</span><p>${d}</p></li>`).join("")}</ul></section>

<section class="db-notes" aria-labelledby="notes-title"><div class="db-sec-head"><div><p class="kicker">From our guests</p><h2 id="notes-title" class="db-h2">Kind words, <em>overheard.</em></h2></div><div class="rail-ctl"><button type="button" data-rail-prev aria-label="Previous note">${icon("left")}</button><button type="button" data-rail-next aria-label="Next note">${icon("right")}</button></div></div><div class="rail notes-rail" data-rail tabindex="0" aria-label="Guest notes">${notes.map(([q, who]) => `<blockquote><p>“${q}”</p><footer>${who}</footer></blockquote>`).join("")}</div>${guestNote}</section>

<section class="db-events" aria-labelledby="events-title"><figure>${pic("daybreak-gathering", { sizes: "(max-width: 900px) 100vw, 50vw" })}</figure><div class="events-copy" data-reveal><p class="kicker">Events &amp; private gatherings</p><h2 id="events-title" class="db-h2">Bring <em>everyone.</em></h2><ul class="events-list">${formats.map(([t, cap]) => `<li><b>${t}</b><span>${cap}</span></li>`).join("")}</ul><div class="db-act">${btn("request", "Enquire about a group", "dark", { type: "group" })}${link("events", "How events work " + arrow, "text-link")}</div></div></section>

<section class="db-gallery" aria-labelledby="gallery-title"><div class="db-sec-head"><div><p class="kicker">${icon("insta")} ${cafe.insta}</p><h2 id="gallery-title" class="db-h2">Mornings, <em>lately.</em></h2></div>${link("gallery", "Open the gallery " + arrow, "text-link")}</div><div class="gal-strip" data-gallery>${gal.map((id) => `<a href="/assets/${id}.webp" class="g">${pic(id, { sizes: "(max-width: 760px) 50vw, 25vw" })}</a>`).join("")}</div></section>

<section class="db-visit" id="visit" aria-labelledby="visit-title"><div class="visit-copy" data-reveal><p class="kicker">Visit us</p><h2 id="visit-title" class="db-h2">On a quiet lane <em>off Bhandarkar Road.</em></h2>${open}<dl class="db-hours big">${cafe.hours.map(([d, t]) => `<div><dt>${d}</dt><dd>${t}</dd></div>`).join("")}</dl><p class="addr">${icon("pin")} ${cafe.address}</p><div class="db-act">${`<a class="db-btn dark" href="${cafe.maps}" target="_blank" rel="noopener"><span>Get directions</span>${arrow}</a>`}${link("visit", "Parking & getting here " + arrow, "text-link")}</div></div><figure>${pic("daybreak-exterior", { sizes: "(max-width: 900px) 100vw, 55vw" })}</figure></section>`,
      { image: "daybreak-cafe-hero", over: true, description: "Daybreak is an independent specialty coffee house and bakery in Deccan Gymkhana, Pune. Coffee roasted every Tuesday, croissants baked before sunrise, breakfast until 4 pm." },
    );
  }

  // ── Full menu: server renders the filter state from the URL, so ?q= and ?diet= links are shareable; daybreak.js filters instantly.
  if (path === "menu") {
    const q = (query.get("q") || "").trim().toLowerCase().slice(0, 40);
    // "eggless" was a filter before egg moved out of vegetarian; old shared links still land on Vegetarian.
    const diet = new Map([["veg", "veg"], ["eggless", "veg"], ["vegan", "vegan"]]).get(query.get("diet")) || "";
    const shown = menu.filter((d) => matches(d, q, diet));
    const diets = [["", "Everything"], ["veg", "Vegetarian"], ["vegan", "Vegan"]];
    return page(
      "Menu",
      `${intro("The menu", "Coffee, kitchen <em>&amp; bakery.</em>", "Thirty-nine things we make every day, with prices in rupees including GST. Every dish shows whether it is vegetarian, contains egg or is vegan, and its main allergens.", [["", "Home"], ["menu", "Menu"]])}
<div class="menu-tools" data-menu-tools><form class="menu-search" role="search" action="${c.href("menu")}" method="get"><label for="menu-q" class="sr">Search the menu</label>${icon("coffee")}<input id="menu-q" name="q" type="search" value="${esc(q)}" placeholder="Search: latte, croissant, oat milk…" autocomplete="off" maxlength="40"><fieldset class="diet-pick"><legend class="sr">Dietary preference</legend>${diets.map(([v, l]) => `<label><input type="radio" name="diet" value="${v}"${v === diet ? " checked" : ""}><span>${l}</span></label>`).join("")}</fieldset><button type="submit" class="db-btn dark menu-go">Search</button></form><nav class="cat-nav" aria-label="Menu sections"><ul>${categories.map(([id, n]) => `<li><a href="#${id}">${n}</a></li>`).join("")}</ul></nav></div>
<p class="menu-count" role="status" data-menu-count>${q || diet ? `${shown.length} of ${menu.length} items match` : ""}</p>
<div class="menu-book">${categories
        .map(([id, n, blurb]) => {
          const items = menu.filter((d) => d.cat === id);
          const any = items.some((d) => shown.includes(d));
          return `<section class="menu-cat" id="${id}" data-cat${any ? "" : " hidden"}><header><h2>${n}</h2><p>${blurb}</p></header><ul>${items.map((d) => line(d, { hidden: !shown.includes(d) })).join("")}</ul></section>`;
        })
        .join("")}<div class="menu-empty" data-menu-empty${shown.length ? " hidden" : ""}><p class="db-h2">Nothing on the menu <em>matches that.</em></p><p>Try a simpler word, like <a href="${c.href("menu", { q: "latte" })}">latte</a>, <a href="${c.href("menu", { q: "croissant" })}">croissant</a> or <a href="${c.href("menu", { q: "egg" })}">egg</a>, or ${link("menu", "clear your search", "clear")}.</p></div></div>
<aside class="menu-foot"><p><b>Allergies?</b> Our kitchen handles gluten, dairy, egg, nuts, soy and sesame. Please tell us before you order; we can't guarantee a dish is completely free of traces.</p><p>${dietMark({ diet: "veg" })} Vegetarian &nbsp; ${dietMark({ diet: "nonveg" })} Non-vegetarian · Prices include GST · No service charge</p></aside>`,
      { image: "daybreak-croissants", description: "The full Daybreak menu: specialty coffee, matcha and tea, breakfast, brunch, toasts, bakery and desserts, with dietary and allergen information and INR prices." },
    );
  }

  // ── Dish detail: options come from the URL so a chosen drink is shareable; daybreak.js updates price and URL live.
  const d = path.startsWith("menu/") && byId[path.slice(5)];
  if (d && Object.hasOwn(byId, path.slice(5))) {
    const sets = optionSets[d.options] || [];
    const chosen = sets.map(([f, , vals]) => vals.find(([v]) => v === query.get(f)) || vals[0]);
    const price = d.price + chosen.reduce((s, [, , delta]) => s + delta, 0);
    const related = menu.filter((x) => x.cat === d.cat && x !== d).slice(0, 4);
    const visual = d.img
      ? `<figure class="dish-pic">${pic(d.img, { eager: true, sizes: "(max-width: 900px) 100vw, 50vw", alt: d.name + " at Daybreak Café" })}</figure>`
      : `<div class="dish-card" role="img" aria-label="${esc(d.name)}, ${catName[d.cat]}"><span>${sun}</span><p>${catName[d.cat]}</p><strong>${d.name}</strong><small>Daybreak Coffee House</small></div>`;
    return page(
      d.name,
      `<article class="dish">${visual}<div class="dish-copy">${crumbs([["", "Home"], ["menu", "Menu"], ["menu#" + d.cat, catName[d.cat]], ["menu/" + d.id, d.name]])}<p class="kicker">${catName[d.cat]}</p><h1 class="db-h1">${d.name}</h1><p class="dish-price"><output data-price data-base="${d.price}" aria-live="polite">${rupees(price)}</output>${d.best ? '<span class="tag best">Bestseller</span>' : ""}</p><p class="lede">${d.line}</p><p>${d.story}</p>${
        sets.length
          ? `<form class="dish-opts" data-dish-opts>${sets
              .map(([f, legend, vals], i) => `<fieldset><legend>${legend}</legend><div>${vals.map(([v, l, delta]) => `<label><input type="radio" name="${f}" value="${v}" data-delta="${delta}"${v === chosen[i][0] ? " checked" : ""}><span>${l}${delta ? ` <small>+${rupees(delta)}</small>` : ""}</span></label>`).join("")}</div></fieldset>`)
              .join("")}<p class="small">Your choice updates the price and this page's link, so you can send it to whoever's ordering.</p></form>`
          : ""
      }<dl class="dish-facts"><div><dt>Dietary</dt><dd>${dietMark(d)} ${dietLabel[d.diet]}</dd></div><div><dt>Allergens</dt><dd>${d.allergens.length ? d.allergens.map((a) => allergenLabel[a]).join(", ") : "None of the major allergens"}</dd></div><div><dt>Ingredients</dt><dd>${d.ingredients.join(", ")}</dd></div></dl><div class="db-act">${btn("request", "Book a table", "dark")}${link("menu#" + d.cat, icon("left") + " Back to the menu", "text-link back")}</div></div></article>
<section class="dish-more"><h2 class="db-h3">Lovely with</h2><ul class="pair-list">${d.pairs.map((id) => line(byId[id])).join("")}</ul>${related.length ? `<h2 class="db-h3">More ${catName[d.cat].toLowerCase()}</h2><ul class="pair-list">${related.map((x) => line(x)).join("")}</ul>` : ""}</section>`,
      { image: d.img || "daybreak-interior", description: `${d.name} at Daybreak Café, Pune: ${d.line} ${rupees(d.price)}.` },
    );
  }

  // ── Our coffee
  if (path === "coffee") {
    const steps = [
      ["Source", "Four family estates in Chikmagalur and Coorg, visited every harvest. We pay well above the market and buy the same lots year after year."],
      ["Roast", "Six kilos at a time on a small drum roaster every Tuesday, light for filter and a touch darker for espresso."],
      ["Rest", "Beans rest seven to ten days so the gas settles and the sweetness comes forward. Nothing goes in the grinder younger than a week."],
      ["Brew", "Weighed, timed and tasted. The bar re-dials the espresso after lunch, when the room warms up and the coffee changes."],
    ];
    const methods = [
      ["espresso", "Espresso", "18 g in, 36 g out, 28 seconds", "Cocoa, jaggery, orange peel"],
      ["pour-over", "Pour-over", "15 g to 250 ml, 3½ minutes", "This week: blueberry and cacao nib"],
      ["filter-kaapi", "Filter kaapi", "Brass filter, 20% chicory, 20 minutes", "Dark, sweet, nostalgic"],
      ["cold-brew", "Cold brew", "Steeped 18 hours, served on one large cube", "Smooth, chocolatey, low bitterness"],
    ];
    return page(
      "Our coffee",
      `<section class="db-cover">${pic("daybreak-beans", { eager: true })}<div>${crumbs([["", "Home"], ["coffee", "Our coffee"]])}<p class="kicker">Our coffee</p><h1 class="db-display small">Grown in Karnataka, <em>roasted on Tuesdays.</em></h1></div></section>
<section class="db-statement" data-reveal><p>Indian coffee has always been good. We just wanted to treat it the way the best roasters in the world treat theirs: <em>know the farm, roast it fresh, and pour it like it matters.</em></p></section>
<section class="coffee-steps"><ol>${steps.map(([t, p], i) => `<li data-reveal><span class="n">0${i + 1}</span><h2 class="db-h3">${t}</h2><p>${p}</p></li>`).join("")}</ol><figure data-reveal>${pic("daybreak-espresso", { sizes: "(max-width: 900px) 100vw, 40vw" })}</figure></section>
<section class="blend" aria-labelledby="blend-title"><div class="blend-card" data-reveal><p class="kicker">The house blend</p><h2 id="blend-title" class="db-h2">Daybreak <em>No. 1</em></h2><dl>${[["Origin", "Chikmagalur (60%) and Coorg (40%), Karnataka"], ["Varieties", "SLN 795, Chandragiri"], ["Process", "Washed and natural"], ["Altitude", "1,100 – 1,450 m"], ["Roast", "Medium, for espresso and milk"], ["Tastes of", "Milk chocolate, jaggery, a little orange"]].map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl><p class="small">Take home 250 g for ₹650, whole bean or ground to order at the counter.</p></div><figure data-reveal>${pic("daybreak-cappuccino", { sizes: "(max-width: 900px) 100vw, 45vw" })}</figure></section>
<section class="methods" aria-labelledby="methods-title"><div class="db-sec-head"><div><p class="kicker">On the bar</p><h2 id="methods-title" class="db-h2">Four ways <em>to drink it.</em></h2></div></div><ul>${methods.map(([id, n, recipe, notes]) => `<li data-reveal>${link("menu/" + id, `<span class="m-name">${n}</span><span class="m-recipe">${recipe}</span><span class="m-notes">${notes}</span><span class="m-price">${rupees(byId[id].price)} ${arrow}</span>`)}</li>`).join("")}</ul></section>
<section class="db-events slim"><figure>${pic("daybreak-workshop", { sizes: "(max-width: 900px) 100vw, 50vw" })}</figure><div class="events-copy" data-reveal><p class="kicker">Learn with us</p><h2 class="db-h2">Cupping &amp; <em>brewing classes.</em></h2><p>A public cupping on the first Saturday of every month and a home-brewing class on the third. Six to twelve guests, two hours, ₹1,800 including a bag of beans.</p><div class="db-act">${btn("request", "Ask about a class", "dark", { type: "group", occasion: "workshop" })}${link("events", "All events " + arrow, "text-link")}</div></div></section>`,
      { image: "daybreak-beans", description: "How Daybreak sources, roasts and brews its coffee: four Karnataka estates, a Tuesday roast, and espresso, pour-over, filter kaapi and cold brew on the bar." },
    );
  }

  // ── Our story
  if (path === "story") {
    const years = [
      ["2017", "A bad cappuccino", "Ananya and Kabir meet in a Koregaon Park queue, both complaining about the same coffee."],
      ["2019", "Saturday stall", "A folding table at the Sunday market: one grinder, a hand-lever espresso machine and Kabir's first croissants."],
      ["2021", "Garden Lane", "The old tailor's shop on Garden Lane becomes Daybreak. Twenty-two seats, one oven, a lot of green paint."],
      ["2023", "The courtyard", "The neighbours' garden opens up behind us. Sixteen more seats under the neem tree, and dogs welcome."],
      ["2025", "Our own roaster", "A six-kilo drum roaster arrives. Every bean we pour is now roasted by us, every Tuesday."],
    ];
    const suppliers = [["Coffee", "Four family estates in Chikmagalur and Coorg"], ["Milk", "A small dairy outside Mulshi, delivered at 6 am"], ["Eggs", "Free-range, from a farm on the Paud road"], ["Mushrooms", "A grower in Talegaon"], ["Jaggery", "Organic, from Kolhapur"], ["Chocolate", "A bean-to-bar maker in Kerala"]];
    return page(
      "Our story",
      `<section class="story-top">${intro("Our story", "Two people, one lane, <em>a lot of mornings.</em>", "", [["", "Home"], ["story", "Our story"]])}<figure data-reveal>${pic("daybreak-founders", { eager: true, sizes: "100vw" })}<figcaption>Ananya and Kabir Rao, founders</figcaption></figure></section>
<section class="letter" data-reveal><p class="dropcap">We wanted a place that felt like the first hour of the day: unhurried, a little golden, full of good smells. A place where the person making your coffee knows the farm it came from and the person baking your croissant started before sunrise.</p><p>Ananya spent ten years in hotel kitchens before falling for coffee on a trip to Chikmagalur. Kabir was a software engineer who baked on weekends until the weekends weren't enough. Daybreak is where those two lives meet: her coffee, his bread, and a room we hope you'll treat as your own.</p><p class="sig">— Ananya &amp; Kabir</p></section>
<section class="timeline" aria-labelledby="tl-title"><h2 id="tl-title" class="db-h2">How we <em>got here.</em></h2><ol>${years.map(([y, t, p]) => `<li data-reveal><time>${y}</time><h3>${t}</h3><p>${p}</p></li>`).join("")}</ol></section>
<section class="crew" aria-labelledby="crew-title"><div class="db-sec-head"><div><p class="kicker">The morning crew</p><h2 id="crew-title" class="db-h2">Fourteen people, <em>one long table at staff lunch.</em></h2></div></div><div class="crew-grid">${[["daybreak-barista", "Rohan Desai", "Head barista", "Joined as a weekend barista in 2021. Now trains everyone on the bar, and runs the cupping classes."], ["daybreak-baker", "Meera Joshi", "Pastry chef", "Trained in Lyon. Laminates every croissant by hand and keeps the sourdough starter, Bhau, alive."]].map(([id, n, r, p]) => `<article data-reveal><figure>${pic(id, { sizes: "(max-width: 760px) 100vw, 40vw" })}</figure><h3>${n}</h3><p class="role">${r}</p><p>${p}</p></article>`).join("")}</div></section>
<section class="suppliers" aria-labelledby="sup-title"><div><p class="kicker">Who we buy from</p><h2 id="sup-title" class="db-h2">Close to home, <em>wherever we can.</em></h2></div><dl>${suppliers.map(([k, v]) => `<div data-reveal><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl></section>
<section class="db-close"><figure>${pic("daybreak-interior", { alt: "" })}</figure><div data-reveal><h2 class="db-display small">Come and <em>say hello.</em></h2><div class="db-act">${btn("visit", "Plan your visit", "sun")}${btn("menu", "See the menu", "ghost")}</div></div></section>`,
      { image: "daybreak-founders", description: "The story of Daybreak Café, its founders and the people and farms behind its coffee and bakery." },
    );
  }

  // ── Gallery: tag filter works as plain links; the lightbox comes from business.js.
  if (path === "gallery") {
    const tagsList = [["", "All"], ["space", "The space"], ["coffee", "Coffee"], ["food", "Food"], ["people", "People"]];
    const tag = tagsList.some(([v]) => v && v === query.get("tag")) ? query.get("tag") : "";
    const ids = Object.keys(photos).filter((id) => photos[id][2] !== "dish" && (!tag || photos[id][2] === tag));
    return page(
      "Gallery",
      `${intro(`${icon("insta")} ${cafe.insta}`, "Mornings, <em>lately.</em>", "The room, the plates and the people. Tap any photo to see it full screen; use the arrow keys or swipe to move through.", [["", "Home"], ["gallery", "Gallery"]])}<nav class="chips" aria-label="Filter photos">${tagsList.map(([v, l]) => link("gallery", l, v === tag ? "on" : "", v ? { tag: v } : {})).join("")}</nav><div class="gal-grid" data-gallery>${ids.map((id, i) => `<a href="/assets/${id}.webp" class="g g-${photos[id][0][1] > photos[id][0][0] ? "tall" : photos[id][0][0] > photos[id][0][1] ? "wide" : "sq"}"${i < 4 ? "" : " data-reveal"}>${pic(id, { sizes: "(max-width: 760px) 50vw, 33vw", eager: i < 2 })}</a>`).join("")}</div>`,
      { image: "daybreak-interior", description: "Photographs of Daybreak Café: the space, the coffee, the food and the people." },
    );
  }

  // ── Events
  if (path === "events") {
    return page(
      "Events & private gatherings",
      `<section class="db-cover">${pic("daybreak-gathering", { eager: true })}<div>${crumbs([["", "Home"], ["events", "Events"]])}<p class="kicker">Events &amp; private gatherings</p><h1 class="db-display small">The long table <em>is yours.</em></h1></div></section>
<section class="db-statement" data-reveal><p>Birthdays, team breakfasts, coffee classes and quiet engagements. We host <em>one group at a time</em>, so it always feels like your morning, not a function.</p></section>
<section class="formats">${formats.map(([t, cap, price, img, p], i) => `<article class="fmt${i % 2 ? " flip" : ""}"><figure data-reveal>${pic(img, { sizes: "(max-width: 900px) 100vw, 50vw" })}</figure><div data-reveal><span class="n">0${i + 1}</span><h2 class="db-h2">${t}</h2><p>${p}</p><dl><div><dt>Group size</dt><dd>${cap}</dd></div><div><dt>Price</dt><dd>${price}</dd></div></dl>${btn("request", "Enquire", "dark", { type: "group", occasion: ["birthday", "workshop", "work", "celebration"][i] })}</div></article>`).join("")}</section>
<section class="how" aria-labelledby="how-title"><h2 id="how-title" class="db-h2">How it <em>works.</em></h2><ol>${[["Send an enquiry", "Tell us the date, the number of guests and what you're celebrating. It takes two minutes."], ["We call you back", "Within a day, to talk through the menu, timings and anything special."], ["We confirm in writing", "Only then is your date held. We take a small deposit for weekends and private evenings."], ["You turn up", "The table is dressed, the coffee is on, and we take care of the rest."]].map(([t, p], i) => `<li data-reveal><span class="n">${i + 1}</span><h3>${t}</h3><p>${p}</p></li>`).join("")}</ol></section>
<section class="questions" data-reveal><h2 class="db-h2">Good to <em>know.</em></h2>${faq(questions["Events"])}</section>
<section class="db-close"><figure>${pic("daybreak-cafe-space", { alt: "" })}</figure><div data-reveal><h2 class="db-display small">Planning <em>something?</em></h2><p>Weekend dates go a few weeks ahead. Tell us early and we'll hold the morning for you.</p><div class="db-act">${btn("request", "Start a group enquiry", "sun", { type: "group" })}</div></div></section>`,
      { image: "daybreak-gathering", description: "Birthdays, team breakfasts, coffee workshops and private evenings at Daybreak Café, Pune." },
    );
  }

  // ── Visit
  if (path === "visit") {
    const ways = [
      ["car", "By car", "Paid parking on Bhandarkar Road, two minutes' walk. Garden Lane is narrow, so please don't park on it."],
      ["bike", "Two-wheeler", "Free parking for scooters and bikes right outside the café."],
      ["pin", "Auto or cab", "Ask for Garden Lane, off Bhandarkar Road, next to the old Deccan post office. Drivers usually know it."],
      ["users", "Metro & walking", "Deccan Gymkhana metro station is a twelve-minute walk. Fergusson College Road is five."],
    ];
    return page(
      "Visit us",
      `<section class="visit-top"><div>${intro("Visit us", "Garden Lane, <em>Deccan Gymkhana.</em>", "A short walk from FC Road, on a lane lined with gulmohar trees. Look for the green door and the bicycle.", [["", "Home"], ["visit", "Visit us"]])}${open}<p class="addr">${icon("pin")} ${cafe.address}</p><div class="db-act"><a class="db-btn dark" href="${cafe.maps}" target="_blank" rel="noopener"><span>Open in Google Maps</span>${arrow}</a>${btn("request", "Book a table", "ghost-dark")}</div></div><figure>${pic("daybreak-exterior", { eager: true, sizes: "(max-width: 900px) 100vw, 50vw" })}</figure></section>
<section class="visit-grid"><div class="v-hours" data-reveal><h2 class="db-h3">Opening hours</h2><dl class="db-hours big">${cafe.hours.map(([d, t]) => `<div><dt>${d}</dt><dd>${t}</dd></div>`).join("")}</dl><p class="small">Open every day except Diwali and 1 January. Hours may change on public holidays; we post them on Instagram.</p></div><div class="v-ways" data-reveal><h2 class="db-h3">Getting here</h2><ul>${ways.map(([ic, t, p]) => `<li>${icon(ic)}<div><b>${t}</b><p>${p}</p></div></li>`).join("")}</ul></div><div class="v-contact" data-reveal><h2 class="db-h3">Get in touch</h2><p><a href="tel:${cafe.phone.replace(/\s/g, "")}">${icon("phone")} ${cafe.phone}</a></p><p><a href="${WA}">${icon("chat")} WhatsApp us</a></p><p><a href="mailto:${cafe.email}">${icon("mail")} ${cafe.email}</a></p><p class="small">Step-free entrance from the lane and an accessible washroom. Dogs welcome in the courtyard.</p></div></section>
<section class="db-space slim"><div class="space-grid two">${[["daybreak-outdoor", "The courtyard", "Sixteen seats under the neem tree."], ["daybreak-evening", "After 6 pm", "Lamps on, music down, decaf on the bar."]].map(([id, t, p]) => `<figure class="sp" data-reveal>${pic(id, { sizes: "(max-width: 760px) 100vw, 50vw" })}<figcaption><b>${t}</b>${p}</figcaption></figure>`).join("")}</div></section>
<section class="questions" data-reveal><h2 class="db-h2">Before <em>you come.</em></h2>${faq(questions["Visiting"])}</section>`,
      { image: "daybreak-exterior", description: "Find Daybreak Café on Garden Lane, Deccan Gymkhana, Pune: opening hours, directions, parking and contact details." },
    );
  }

  // ── FAQ
  if (path === "faq") {
    const groups = Object.entries(questions);
    const slug = (s) => s.toLowerCase().replace(/[^a-z]+/g, "-").replace(/-$/, "");
    return page(
      "Questions",
      `${intro("Questions", "Everything you <em>might ask.</em>", "Bookings, allergies, parking, dogs and cake. If your question isn't here, message us and a real person will answer.", [["", "Home"], ["faq", "Questions"]])}<div class="faq-wrap"><nav class="faq-nav" aria-label="Question topics"><ul>${groups.map(([g]) => `<li><a href="#${slug(g)}">${g}</a></li>`).join("")}</ul></nav><div>${groups.map(([g, list]) => `<section id="${slug(g)}" class="faq-group"><h2 class="db-h3">${g}</h2>${faq(list)}</section>`).join("")}</div></div>
<section class="faq-cta" data-reveal><h2 class="db-h2">Still <em>wondering?</em></h2><div class="db-act"><a class="db-btn dark" href="${WA}"><span>WhatsApp us</span>${arrow}</a>${btn("request", "Book a table", "ghost-dark")}</div></section>`,
      { image: "daybreak-interior", description: "Answers about reservations, dietary needs, coffee, parking, accessibility and events at Daybreak Café." },
    );
  }

  // ── Reservations & group enquiries: the form is real HTML; daybreak.js adds validation, review, local save and sharing.
  if (path === "request") {
    const group = query.get("type") === "group";
    const occasions = [["", "No particular occasion"], ["birthday", "Birthday"], ["anniversary", "Anniversary"], ["date", "Coffee date"], ["catch-up", "Catching up with friends"], ["work", "Work meeting or team breakfast"], ["workshop", "Coffee workshop"], ["celebration", "Other celebration"]];
    const occ = occasions.some(([v]) => v && v === query.get("occasion")) ? query.get("occasion") : "";
    const seats = [["any", "No preference", 1, 8], ["window", "Window seat", 1, 4], ["indoor", "Main room", 1, 8], ["courtyard", "Courtyard", 1, 16], ["long", "The long table", 6, 14], ["whole", "Whole café, private evening from 8 pm", 15, 40]];
    const guests = Math.min(40, Math.max(1, parseInt(query.get("guests"), 10) || (group ? 10 : 2)));
    const times = [];
    for (let m = 7 * 60; m <= 19 * 60 + 30; m += 30) times.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${m % 60 ? "30" : "00"}`);
    const label12 = (t) => { const [h, m] = t.split(":").map(Number); return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`; };
    const field = (id, labelText, control, hint = "") => `<div class="fld" data-field="${id}"><label for="r-${id}">${labelText}</label>${control}${hint ? `<p class="hint" id="h-${id}">${hint}</p>` : ""}<p class="err" id="e-${id}" aria-live="polite"></p></div>`;
    return page(
      "Book a table",
      `<section class="book">${intro("Reservations &amp; group enquiries", group ? "Plan a <em>gathering.</em>" : "Book a <em>table.</em>", "Tell us when you'd like to come and how many of you there will be. We read every request and reply within a few hours, between 7 am and 8 pm.", [["", "Home"], ["request", "Book a table"]])}
<div class="book-grid"><div class="book-main"><ol class="book-steps" aria-label="Progress"><li class="on" data-step-dot="form">Your details</li><li data-step-dot="review">Review</li><li data-step-dot="done">Saved</li></ol>
<form class="book-form" data-book novalidate action="${c.href("request")}" method="get"><fieldset class="kind"><legend>What would you like?</legend><label><input type="radio" name="type" value="table"${group ? "" : " checked"}><span><b>A table</b><small>1 to 8 guests</small></span></label><label><input type="radio" name="type" value="group"${group ? " checked" : ""}><span><b>A group or event</b><small>6 to 40 guests</small></span></label></fieldset>
<div class="row">${field("date", "Date", `<input id="r-date" name="date" type="date" required aria-describedby="h-date e-date" value="${esc(/^\d{4}-\d{2}-\d{2}$/.test(query.get("date") || "") ? query.get("date") : "")}">`, "Up to 60 days ahead.")}${field("time", "Preferred time", `<select id="r-time" name="time" required aria-describedby="h-time e-time"><option value="">Choose a time</option>${times.map((t) => `<option value="${t}">${label12(t)}</option>`).join("")}<option value="20:00" data-private disabled>8:00 pm · private evening</option></select>`, "Kitchen until 4 pm, coffee and bakery until 8.")}${field("guests", "Guests", `<input id="r-guests" name="guests" type="number" inputmode="numeric" min="1" max="40" step="1" required value="${guests}" aria-describedby="h-guests e-guests">`, "Including children.")}</div>
${field("seating", "Seating preference", `<select id="r-seating" name="seating" aria-describedby="h-seating e-seating">${seats.map(([v, l, min, max]) => `<option value="${v}" data-min="${min}" data-max="${max}">${l} (${min === max ? max : `${min}–${max}`} guests)</option>`).join("")}</select>`, "We'll do our best; seating is confirmed when we reply.")}
${field("occasion", "Occasion", `<select id="r-occasion" name="occasion">${occasions.map(([v, l]) => `<option value="${v}"${v === occ ? " selected" : ""}>${l}</option>`).join("")}</select>`)}
<div class="row two">${field("name", "Your name", `<input id="r-name" name="name" type="text" autocomplete="name" required maxlength="60" aria-describedby="e-name">`)}${field("phone", "Mobile number", `<input id="r-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required placeholder="98xxx xxxxx" aria-describedby="h-phone e-phone">`, "Indian mobile, 10 digits. We'll only use it about this booking.")}</div>
${field("email", "Email", `<input id="r-email" name="email" type="email" autocomplete="email" required aria-describedby="e-email">`)}
${field("notes", "Special requests <small>(optional)</small>", `<textarea id="r-notes" name="notes" rows="4" maxlength="400" aria-describedby="h-notes e-notes" placeholder="High chair, a cake, allergies, a quiet corner…"></textarea>`, '<span data-count-for="notes">0</span>/400')}
<p class="form-err" role="alert" data-form-err></p><button type="submit" class="db-btn dark wide"><span>Review my request</span>${arrow}</button><noscript><p class="small">This booking form needs JavaScript. You can also call or WhatsApp us on ${cafe.phone}.</p></noscript></form>
<section class="book-review" data-review hidden tabindex="-1" aria-labelledby="rv-title"><h2 id="rv-title" class="db-h3">Check your request</h2><dl data-summary></dl><p class="honest">This is a demonstration website. Saving keeps your request <b>in this browser only</b>. It is not sent to the café and is <b>not a confirmed booking</b>.</p><div class="db-act"><button type="button" class="db-btn dark" data-confirm><span>Save my request</span>${arrow}</button><button type="button" class="db-btn ghost-dark" data-edit><span>Edit details</span></button></div></section>
<section class="book-done" data-done hidden tabindex="-1" aria-labelledby="dn-title"><p class="kicker" data-ref></p><h2 id="dn-title" class="db-h2">Request saved <em>on this device.</em></h2><p class="honest"><b>Not yet sent and not confirmed.</b> On the café's live website this would go straight to the team. For now, copy it, download it, or send it yourself.</p><dl data-summary></dl><div class="db-act share"><button type="button" class="db-btn dark" data-copy><span>Copy summary</span></button><button type="button" class="db-btn ghost-dark" data-download><span>Download .txt</span></button><a class="db-btn ghost-dark" data-wa href="${WA}"><span>Send on WhatsApp</span></a><a class="db-btn ghost-dark" data-mail href="mailto:${cafe.email}"><span>Send by email</span></a></div><p class="small" role="status" data-share-status></p><div class="db-act"><button type="button" class="text-link" data-edit>Edit this request</button><button type="button" class="text-link" data-new>Start a new request</button></div></section>
<section class="book-saved" data-saved hidden aria-labelledby="sv-title"><h2 id="sv-title" class="db-h3">Saved on this device</h2><p class="small">Kept only in this browser, never sent anywhere. Requests for dates that have passed are removed automatically.</p><ul data-saved-list></ul><button type="button" class="text-link" data-clear>Delete all saved requests</button></section></div>
<aside class="book-side"><figure>${pic(group ? "daybreak-cafe-space" : "daybreak-window", { sizes: "(max-width: 900px) 100vw, 30vw" })}</figure><h2 class="db-h3">Good to know</h2><ul><li>Two or three on a weekday? Just walk in.</li><li>We hold tables for 15 minutes.</li><li>Groups of 9 or more: choose <b>A group or event</b> and we'll call you to plan the menu.</li><li>Weekend group bookings and private evenings need a small deposit, only once we've confirmed.</li></ul><p class="small">${icon("phone")} ${cafe.phone} · ${icon("clock")} 7 am – 8 pm daily</p></aside></div></section>`,
      { image: "daybreak-window", description: "Book a table or send a group and event enquiry to Daybreak Café, Pune." },
    );
  }

  // Any other address inside the site: a branded 404 that keeps visitors in the café, not the studio.
  return page(
    "Page not found",
    `<section class="db-404">${intro("Error 404", "This page has <em>gone cold.</em>", "The address may be mistyped, or the page has moved. The menu, the coffee and the booking form are all still here.")}<div class="db-act">${btn("", "Back to home", "dark")}${btn("menu", "See the menu", "ghost-dark")}${btn("request", "Book a table", "ghost-dark")}</div></section>`,
    { status: 404, description: "This page could not be found on the Daybreak Café website." },
  );
}
