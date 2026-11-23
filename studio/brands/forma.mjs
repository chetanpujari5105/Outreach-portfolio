// Studio Forma: a full hair-studio website. Every person, review, number and price here is fictional.
import { rupees, icon, whatsapp, stars, faq, siteHeader, siteFooter, dock } from "./common.mjs";
import { salonServices, salonPrice, hairLengths } from "../site/demos.js";

const WA = whatsapp("+91 99999 04112", "Hi Forma, I'd like to book a chair.");
const people = {
  mira: { n: 1, name: "Mira Kulkarni", first: "Mira", img: "salon-stylist-mira", role: "Cutting & soft colour", years: 11, insta: "@mira.cuts.pune", quote: "A good cut should look better on day ten than day one.", bio: "Mira trained in London and spent six years on the floor of a Bandra salon before opening Forma in 2019. She is known for heavy, swinging bobs and layers that dry well without a brush." },
  alex: { n: 2, name: "Alex Fernandes", first: "Alex", img: "salon-stylist-alex", role: "Colour, styling & men's cuts", years: 8, insta: "@alex.colours", quote: "Colour should grow out like it was always yours.", bio: "Alex is a colourist first. Hand-painted ribbons, glosses that don't go brassy, and blowouts that survive a Pune monsoon. He also does most of the studio's men's cuts." },
};
// [id, name, image, stylist, service index, hair length, description, upkeep]
const looks = [
  ["blunt-bob", "The blunt bob", "salon-hero", "mira", 0, 0, "A clean, heavy line just below the jaw, with weight left through the ends so it swings rather than flicks.", "Trim every 8 weeks"],
  ["soft-layers", "Soft layers", "forma-layers", "mira", 0, 2, "Long, face-framing layers cut dry, so they fall where they will after you towel off and walk out the door.", "Trim every 12 weeks"],
  ["brushed-waves", "Brushed waves", "forma-waves", "alex", 2, 1, "A round-brush blowout brushed out into soft, glossy waves with lift at the roots. Built for a wedding weekend.", "Lasts 3 days"],
  ["ribbon-colour", "Ribbon colour", "forma-ribbon", "alex", 1, 2, "Fine, hand-painted ribbons of copper and caramel through the mid-lengths, kept off the root so it grows out softly.", "Refresh every 4 months"],
  ["gloss-finish", "Gloss finish", "forma-gloss", "mira", 5, 0, "A tonal espresso gloss over a chin-length cut. No lift, no damage, just shine you can see across the room.", "Fades softly in 6 weeks"],
  ["textured-crop", "Textured crop", "forma-crop", "alex", 3, 0, "Scissor-cut texture on top with a soft taper at the sides. Styled with a little clay in under a minute.", "Tidy every 4 weeks"],
].map(([id, name, pic, who, s, len, text, care]) => ({ id, name, pic, who, s, len, text, care }));
const groups = [["Cut", [0, 3]], ["Colour", [1, 4, 5]], ["Finish", [2]]];
const visit = [
  ["salon-cut", "Consultation", "10 min", "We look at your hair dry, talk through the photos you bring, and agree a plan and a price before anything is cut."],
  ["forma-basin", "Wash & scalp massage", "10 min", "Sulphate-free wash, a slow scalp massage at the basin, and a warm towel."],
  ["salon-colour", "Cut or colour", "30–90 min", "Precision cutting with scissors and razor, or colour mixed by hand for your hair, never from a chart."],
  ["salon-blowout", "Finish & a lesson", "15 min", "A blow-dry, and five minutes on how to get the same shape at home with the brush you already own."],
];
const reviews = [
  ["Mira listened for ten minutes before she touched my hair. Best bob I've had in years.", "Neha R.", "The blunt bob"],
  ["Finally a colourist who doesn't go brassy. Alex's ribbons still look good four months on.", "Sana K.", "Ribbon colour"],
  ["On time, no upselling, and the scalp massage at the basin is unreal.", "Rohan M.", "Men's cut"],
  ["I messaged at 11 and was in the chair by 4. The blowout lasted the whole wedding weekend.", "Ishita P.", "Signature blowout"],
  ["Small, calm, no loud music. You can actually hear yourself think while your colour develops.", "Farah D.", "Tonal gloss"],
];
const questions = [
  ["Do I need a patch test before colour?", "Yes, if you are new to Forma or have not had colour with us in six months. Drop in any day at least 48 hours before your appointment; it takes five minutes and is free."],
  ["What if I'm running late?", "Message us on WhatsApp. Up to 15 minutes late we can usually still do everything. After that we may shorten the finish or move you to the next free chair."],
  ["How do cancellations work?", "Cancel or move your appointment up to 12 hours before at no cost. Later than that, or a no-show, and we ask for 50% of the service at your next visit."],
  ["How do you price by hair length?", "Short is above the jaw, shoulder reaches the collarbone, long is below it. We confirm the price at the consultation, before we start."],
  ["Should I bring photos?", "Please do, two or three on your phone of hair you like, and one you don't. It is the fastest way for us to understand each other."],
  ["How can I pay?", "UPI, all cards and cash. Gift cards are available at the front desk in any amount."],
];
const foot = {
  name: "Forma",
  blurb: "A small hair and colour studio in Koregaon Park, Pune. Two stylists, three chairs, one appointment at a time.",
  address: "14 Lane 6, Koregaon Park, Pune 411001",
  hours: "Open daily, 10 am – 7 pm",
  phone: "+91 99999 04112",
  email: "hello@formastudio.example",
  insta: "@forma.pune",
  links: [["looks", "Lookbook"], ["services", "Menu & prices"], ["stylists", "Stylists"], ["request", "Book a chair"]],
};

export function forma(c) {
  const { path, img, link, result, action, query } = c;
  const length = /^[0-2]$/.test(query.get("length") || "") ? Number(query.get("length")) : 1;
  const who = Object.hasOwn(people, query.get("stylist") || "") ? query.get("stylist") : "";
  const price = (s, len) => rupees(salonPrice(s, len));

  const header = () =>
    siteHeader(c, { name: "Forma", links: [["looks", "Lookbook"], ["services", "Menu & prices"], ["stylists", "Stylists"]], cta: ["request", "Book a chair"] });
  const page = (title, html, image) =>
    result(title, header() + html + siteFooter(c, foot) + dock(c, WA, ["request", "Book a chair"]), image);
  const open = `<p class="open-now" data-open="10,19"><span></span><b>Open daily</b> 10 am – 7 pm</p>`;

  const lookCard = (l, i) =>
    link("looks/" + l.id, `${img(l.pic, l.name + " by " + people[l.who].first)}<span class="lk-n">${String(i + 1).padStart(2, "0")}</span><span class="lk-t"><b>${l.name}</b><small>${people[l.who].first} · from ${price(l.s, l.len)}</small></span>`, "look");
  // The length radios drive prices through CSS :has, so the menu works before (and without) JavaScript.
  const menu = () =>
    `<div class="menu" data-menu-len><fieldset class="len"><legend>Your hair length</legend>${hairLengths.map((l, i) => `<label><input type="radio" name="length" value="${i}"${i === length ? " checked" : ""}><span>${l}</span></label>`).join("")}<p>Short is above the jaw, shoulder reaches the collarbone, long is below it.</p></fieldset><div class="menu-cols">${groups
      .map(
        ([g, list]) =>
          `<section><h3>${g}</h3>${list
            .map((s) => {
              const sv = salonServices[s];
              const cost = sv.len ? [0, 1, 2].map((len) => `<b class="p${len}">${price(s, len)}</b>`).join("") : `<b>${price(s, 0)}</b>`;
              return `<div class="item"><div><h4>${sv.name}</h4><p>${sv.detail}</p></div><div class="item-end"><span class="cost">${cost}</span><small>${sv.duration} min</small>${link("request", "Book", "item-book", { service: s, length })}</div></div>`;
            })
            .join("")}</section>`,
      )
      .join("")}</div></div>`;
  const stylistBlock = (id, full = false) => {
    const p = people[id];
    return `<article class="stylist" data-reveal>${link("stylists/" + id, img(p.img, p.name + ", stylist at Forma"), "st-pic")}<div class="st-copy"><p class="st-role">${p.role} · ${p.years} years</p><h3>${link("stylists/" + id, full ? p.name : p.first)}</h3><blockquote>“${p.quote}”</blockquote>${full ? `<p>${p.bio}</p>` : ""}<div class="st-act">${action("Book with " + p.first, { stylist: p.n })}${full ? "" : link("stylists/" + id, "Profile & looks " + icon("arrow"), "text-link")}</div></div></article>`;
  };
  const rating = `<div class="score"><b>4.8</b><div>${stars(5)}<span>286 Google reviews</span></div></div>`;

  if (!path)
    return page(
      "Hair & colour studio in Koregaon Park, Pune",
      `<section class="f-cover"><div class="f-cover-copy"><p class="kicker">Hair &amp; colour studio · Koregaon Park, Pune</p><h1>Your hair,<br><em>your hour.</em></h1><p class="lede">Two stylists, three chairs and one client at a time. Cuts that grow out well, colour that never goes brassy, and nobody rushing you out of the chair.</p><div class="f-cover-act">${link("request", "Book a chair " + icon("arrow"), "pill solid")}${link("services", "See the menu", "pill")}</div><div class="f-cover-meta">${open}${rating}</div></div><figure class="f-cover-pic">${img("salon-hero", "A Forma client with a sharp black bob and an oxblood silk scarf", "", true)}<figcaption>The blunt bob, by Mira</figcaption></figure></section>
<div class="ticker" aria-hidden="true"><div>${"<span>Precision cuts</span><span>Lived-in colour</span><span>Tonal gloss</span><span>Signature blowouts</span><span>Men's cuts</span>".repeat(4)}</div></div>
<section class="lookbook" id="instagram"><div class="sec-head"><div><p class="kicker">${icon("insta")} ${foot.insta}</p><h2>The lookbook</h2></div><div class="rail-ctl"><button type="button" data-rail-prev aria-label="Previous look">${icon("left")}</button><button type="button" data-rail-next aria-label="Next look">${icon("right")}</button></div></div><div class="rail looks-rail" data-rail tabindex="0">${looks.map(lookCard).join("")}</div>${link("looks", "Open the full lookbook " + icon("arrow"), "text-link")}</section>
<section class="f-menu" id="menu"><div class="f-menu-head"><h2>The menu</h2><p>Pick your hair length and every price updates. What you see is what you pay; we confirm it at the consultation, before we start.</p></div>${menu()}</section>
<section class="stylists"><div class="sec-head"><h2>Two stylists, <em>no juniors.</em></h2></div><div class="st-grid">${stylistBlock("mira")}${stylistBlock("alex")}</div></section>
<section class="visit-steps"><div class="sec-head"><h2>What happens in your hour</h2></div><ol>${visit.map(([pic, t, mins, d], i) => `<li data-reveal style="--i:${i}">${img(pic, t)}<span class="vs-n">${String(i + 1).padStart(2, "0")} · ${mins}</span><h3>${t}</h3><p>${d}</p></li>`).join("")}</ol></section>
<section class="f-reviews" aria-label="Client reviews"><div class="sec-head">${rating}<div class="rail-ctl"><button type="button" data-rail-prev aria-label="Previous review">${icon("left")}</button><button type="button" data-rail-next aria-label="Next review">${icon("right")}</button></div></div><div class="rail" data-rail tabindex="0">${reviews.map(([q, n, s]) => `<blockquote><p>“${q}”</p><footer><b>${n}</b>${s}</footer></blockquote>`).join("")}</div></section>
<section class="find" id="visit"><figure>${img("forma-studio", "Inside Forma: round mirrors, an oxblood chair and window light")}</figure><div class="find-copy" data-reveal><h2>Find the studio</h2>${open}<dl><div><dt>Address</dt><dd>${foot.address}</dd></div><div><dt>Getting here</dt><dd>Two minutes' walk from the Lane 6 junction, first floor above the bakery. Street parking is easiest after 11 am.</dd></div><div><dt>Call or WhatsApp</dt><dd><a href="tel:+919999904112">${foot.phone}</a></dd></div></dl><div class="find-act"><a class="pill solid" href="https://www.google.com/maps/search/?api=1&amp;query=Lane+6+Koregaon+Park+Pune" rel="noopener" target="_blank">${icon("pin")} Get directions</a><a class="pill" href="${WA}">${icon("chat")} WhatsApp us</a></div></div></section>
<section class="questions" data-reveal><h2>Before your appointment</h2>${faq(questions)}</section>
<section class="f-cta" data-reveal><h2>Your chair is <em>waiting.</em></h2><p>Most weeks we have same-day chairs after 3 pm.</p><div class="f-cta-act">${link("request", "Book a chair " + icon("arrow"), "pill solid")}<a class="pill" href="${WA}">${icon("chat")} WhatsApp</a></div></section>`,
      "salon-hero",
    );

  if (path === "services")
    return page(
      "Menu & prices",
      `<section class="f-top"><p class="kicker">Menu &amp; prices</p><h1>Priced by <em>length,</em><br>not by guesswork.</h1><p>Every service starts with a consultation. Prices include GST.</p></section><section class="f-menu solo">${menu()}</section><section class="questions" data-reveal><h2>Good to know</h2>${faq(questions.slice(0, 4))}</section>`,
      "salon-colour",
    );

  if (path === "looks") {
    const shown = looks.filter((l) => !who || l.who === who);
    return page(
      "The lookbook",
      `<section class="f-top"><p class="kicker">${icon("insta")} ${foot.insta}</p><h1>The <em>lookbook.</em></h1><p>Recent work from the studio floor. Tap a look to see what it takes and book it with the stylist who made it.</p><nav class="chips" aria-label="Filter by stylist">${[["", "All looks"], ["mira", "Mira"], ["alex", "Alex"]].map(([v, t]) => link("looks", t, v === who ? "on" : "", v ? { stylist: v } : {})).join("")}</nav></section><section class="look-grid">${shown.map((l) => lookCard(l, looks.indexOf(l))).join("")}</section>`,
      "salon-hero",
    );
  }

  const l = looks.find((x) => path === "looks/" + x.id);
  if (l) {
    const p = people[l.who];
    const sv = salonServices[l.s];
    const others = looks.filter((x) => x.who === l.who && x !== l);
    return page(
      l.name,
      `<section class="look-hero"><figure>${img(l.pic, l.name + " by " + p.first, "", true)}</figure><article><nav class="crumbs">${link("looks", "Lookbook")} / ${l.name}</nav><h1>${l.name}</h1><p class="lede">${l.text}</p><dl class="look-facts"><div><dt>Stylist</dt><dd>${link("stylists/" + l.who, p.name)}</dd></div><div><dt>Service</dt><dd>${sv.name}</dd></div><div><dt>Time in the chair</dt><dd>${sv.duration} min</dd></div><div><dt>Upkeep</dt><dd>${l.care}</dd></div><div class="tot"><dt>Price${sv.len ? ` · ${hairLengths[l.len].toLowerCase()} hair` : ""}</dt><dd>${price(l.s, l.len)}</dd></div></dl>${action("Book this look " + icon("arrow"), { service: l.s, stylist: p.n, length: l.len })}<p class="small">Bring a photo of this page. ${p.first} confirms the price at your consultation.</p></article></section><section class="lookbook more"><div class="sec-head"><h2>More by ${p.first}</h2>${link("looks", "All looks " + icon("arrow"), "text-link")}</div><div class="look-grid">${others.map((x) => lookCard(x, looks.indexOf(x))).join("")}</div></section>`,
      l.pic,
    );
  }

  if (path === "stylists" || path === "stylists/mira" || path === "stylists/alex") {
    const ids = path === "stylists" ? ["mira", "alex"] : [path.slice(9)];
    const one = people[ids[0]];
    return page(
      ids.length > 1 ? "The stylists" : one.name,
      `<section class="f-top"><p class="kicker">The stylists</p><h1>${ids.length > 1 ? "Two stylists, <em>no juniors.</em>" : "Meet <em>" + one.first + ".</em>"}</h1><p>${ids.length > 1 ? "Whoever you book is who cuts your hair, from the consultation to the last blast of the dryer." : one.role + ", " + one.years + " years at the chair."}</p></section><section class="stylists solo"><div class="st-grid">${ids.map((id) => stylistBlock(id, true)).join("")}</div></section>${ids
        .map((id) => `<section class="lookbook more"><div class="sec-head"><h2>Looks by ${people[id].first}</h2><span class="kicker">${icon("insta")} ${people[id].insta}</span></div><div class="look-grid">${looks.filter((x) => x.who === id).map((x) => lookCard(x, looks.indexOf(x))).join("")}</div></section>`)
        .join("")}`,
      one.img,
    );
  }

  if (path === "request")
    return page(
      "Book a chair",
      `<section class="f-top slim"><p class="kicker">Book a chair</p><h1>Pick a service, a stylist <em>and a time.</em></h1><p>We confirm on WhatsApp, usually within the hour. Nothing is charged until your visit.</p></section><div class="workflow"><div id="demo-root" data-slug="${c.slug}"></div></div>`,
      "salon-hero",
    );
}
