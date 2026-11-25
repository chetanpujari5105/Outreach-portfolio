import {
  projects,
  services,
  articles,
  packages,
  studio,
} from "./editorial.mjs";
import { photos } from "./photos.mjs";
import { esc } from "../common.mjs";
import {
  picture,
  photograph,
  projectTile,
  project,
  slugOf,
  service,
  button,
  line,
  heading,
  eyebrow,
  list,
  faqList,
  closing,
  journalTile,
  money,
} from "./components.mjs";
import { process } from "./home.mjs";

export function collection(c, journal = false, selected = false) {
  const path = journal ? "journal" : "work";
  const all = journal
    ? articles
    : selected
      ? [
          "fashion-a",
          "portraits-a",
          "products-a",
          "architecture-b",
          "weddings-a",
          "events-a",
        ].map(project)
      : projects;
  const categories = journal
    ? [...new Set(articles.map((a) => a.category))].map((t) => [t, t])
    : services.map((s) => [s.key, s.short]);
  const query = c.query.get("q") || "",
    cat = categories.find(([id]) => id === c.query.get("category"))?.[0] || "";
  const tools = selected
    ? ""
    : `<form data-filter class="ff-filters" role="search"><label>Search ${journal ? "articles" : "projects"}<input name="q" type="search" value="${esc(query)}" placeholder="${journal ? "A subject or technique" : "A series, subject or service"}"></label><label>Category<select name="category"><option value="">All ${journal ? "topics" : "work"}</option>${categories.map(([id, t]) => `<option value="${esc(id)}" ${cat === id ? "selected" : ""}>${esc(t)}</option>`).join("")}</select></label><button type="submit">Search</button><a href="${c.href(path)}" data-reset>Reset</a></form>`;
  return (
    heading(
      journal ? "Field notes" : "Photography portfolio",
      journal
        ? "Studio journal."
        : selected
          ? "Selected work."
          : "The archive.",
      journal
        ? "Lighting notes, session guides and working methods from behind the camera."
        : selected
          ? "Six series from the studio, sequenced across people, objects and places."
          : "Sixteen photographic studies. Browse by subject or find a series by name.",
    ) +
    `<section class="ff-section ff-index">${tools}<p class="ff-count" aria-live="polite" data-count></p><h2 class="ff-sr">${journal ? "Articles" : "Photographic series"}</h2><div class="${journal ? "ff-journal-grid" : "ff-project-grid"}">${all.map((a, i) => (journal ? journalTile(c, a) : projectTile(c, a, i, i === 0))).join("")}</div><div data-empty hidden><h2>No matching ${journal ? "articles" : "projects"}.</h2><p>Try a shorter search or explore all categories.</p>${line(c, path, "Clear filters")}</div>${selected ? line(c, "work", "Browse all sixteen projects") : ""}</section>`
  );
}
export function projectPage(c, p, start = -1) {
  const frames = photos[p.key],
    pi = projects.indexOf(p),
    related = projects.filter((x) => x.category === p.category && x !== p);
  return `<header class="ff-project-head">${line(c, "work", "Back to archive")}${eyebrow(service(p.category).title + " / Concept series")}<h1>${esc(p.title)}</h1><p>${esc(p.dek)}</p></header><figure class="ff-panorama">${picture(p.key, 0, { eager: true, sizes: "100vw" })}</figure>
  <section class="ff-section ff-notes"><div>${eyebrow("Creative brief")}<h2>About this <em>series.</em></h2></div><div><h3>Objective</h3><p>${esc(p.objective)}</p><h3>Visual concept</h3><p>${esc(p.concept)}</p><h3>Art direction</h3><p>${esc(p.direction)}</p><h3>Photographic approach</h3><p>${esc(p.approach)}</p></div></section>
  <section class="ff-section ff-print-room"><div class="ff-section-head"><div>${eyebrow("Contact sheet")}<h2>Photographs.</h2></div><span>Open a print to enlarge</span></div><div class="ff-gallery group-${p.category}" data-gallery data-start="${start}">${frames.map((r, i) => `<figure><a href="${esc(r.src)}" data-print-index="${i}">${photograph(r)}</a><figcaption><span>${String(i + 1).padStart(2, "0")}</span> ${esc(r.alt)}</figcaption></figure>`).join("")}</div></section>
  <dialog class="ff-lightbox" aria-labelledby="ff-view-title"><header><b id="ff-view-title">${esc(p.title)}</b><button type="button" data-close>Close</button></header><div class="ff-stage"><img alt=""><span data-loading role="status"></span></div><div class="ff-controls"><button type="button" data-prev>Previous</button><span data-index aria-live="polite"></span><button type="button" data-next>Next</button><button type="button" data-zoom aria-pressed="false">Zoom</button></div><p data-caption></p><div class="ff-thumbs">${frames.map((r, i) => `<button type="button" data-thumb="${i}" aria-label="View photograph ${i + 1}">${photograph(r, { sizes: "64px" })}</button>`).join("")}</div></dialog>
  <section class="ff-section ff-project-end">${button(c, "book", "Commission a similar project", { service: p.category, project: p.slug })}${line(c, slugOf(related[0]), "Related series · " + related[0].title)}<nav aria-label="Adjacent projects">${line(c, slugOf(projects[(pi - 1 + projects.length) % projects.length]), "Previous project")}${line(c, slugOf(projects[(pi + 1) % projects.length]), "Next project")}</nav></section>`;
}
export function serviceIndex(c) {
  return (
    heading(
      "Commissions",
      "Photography services.",
      "Find the session, crew and delivery format that fit the way your pictures will be used.",
    ) +
    '<section class="ff-section ff-service-cards">' +
    services
      .map((s) =>
        c.link(
          "services/" + s.key,
          "<figure>" +
            picture(s.key + "-a") +
            "</figure><div>" +
            eyebrow("Commission") +
            "<h2>" +
            esc(s.title) +
            "</h2><p>" +
            esc(s.overview) +
            "</p></div>",
        ),
      )
      .join("") +
    "</section>" +
    closing(c)
  );
}
export function servicePage(c, s) {
  const rates = packages.filter(
    (p) => p.category === s.key && Number.isFinite(p.price),
  );
  return `<section class="ff-split-title"><div>${line(c, "services", "All services")}${eyebrow("Studio commissions")}<h1>${esc(s.title)}</h1><p>${esc(s.overview)}</p>${button(c, "book", "Plan a shoot", { service: s.key })}</div><figure>${picture(s.key + "-a", 0, { eager: true })}</figure></section><section class="ff-section ff-info-grid"><div>${eyebrow("Who it is for")}<h2>Commissioning <em>details.</em></h2><p>${esc(s.audience)}</p></div><div><h3>Typical assignments</h3>${list(s.assignments)}<h3>What you receive</h3>${list(s.deliverables)}<h3>How we approach the shoot</h3>${list(s.process)}<h3>Before the session</h3>${list(s.prep)}<h3>Illustrative pricing</h3><p>${rates.length ? "From " + money(Math.min(...rates.map((p) => p.price))) + " for a starting package." : "Quoted to the brief."}</p>${line(c, "pricing", "Compare packages", { service: s.key })}</div></section><section class="ff-section"><h2>Related work.</h2><div class="ff-project-grid">${projects
    .filter((p) => p.category === s.key)
    .map((p) => projectTile(c, p))
    .join(
      "",
    )}</div></section><section class="ff-section ff-notes"><h2>Before you book.</h2>${faqList(s.faq)}</section>${closing(c)}`;
}
export function articlePage(c, a) {
  return `<article><header class="ff-project-head">${line(c, "journal", "All field notes")}${eyebrow(a.category + " / " + a.minutes + " min read")}<h1>${esc(a.title)}</h1><p>${esc(a.dek)}</p></header><figure class="ff-article-image">${picture(a.photoKey, 1, { eager: true, sizes: "85vw" })}</figure><div class="ff-prose">${a.sections.map((s) => "<section><h2>" + esc(s.title) + "</h2><p>" + esc(s.body) + "</p></section>").join("")}<button type="button" data-share>Share article</button> <button type="button" data-copy-link>Copy link</button><p role="status" data-share-status></p></div></article><section class="ff-section"><h2>Keep reading.</h2><div class="ff-journal-grid">${articles
    .filter((x) => x !== a)
    .sort(
      (x, y) =>
        Number(y.category === a.category) - Number(x.category === a.category),
    )
    .slice(0, 3)
    .map((x) => journalTile(c, x))
    .join("")}</div></section>`;
}
const commonFaq = [
  {
    q: "Can I reserve a date here?",
    a: "You can prepare an enquiry with a preferred date. This fictional studio does not reserve slots or take payments.",
  },
  {
    q: "What should I bring to a portrait sitting?",
    a: "Bring two outfits, a reference you like and an example of where the final photograph will appear. Share any access or changing-room needs in the brief.",
  },
  {
    q: "What does the price cover?",
    a: "Each package lists session time and final deliverables. Travel, third-party rentals and usage extensions need a separate agreement.",
  },
  {
    q: "Do you work outside Pune?",
    a: "The studio concept supports location work across India. A quote should include travel days, permits and transport before agreeing a fee.",
  },
  {
    q: "How should we agree image usage?",
    a: "List the channels, territory, duration and final file sizes in the brief. Review the exact scope with the photographer before commissioning work.",
  },
];
export function information(c, path) {
  if (path === "faq")
    return (
      heading("Studio information", "Questions, answered.") +
      '<section class="ff-prose">' +
      faqList(commonFaq) +
      "</section>" +
      closing(c)
    );
  if (path === "privacy" || path === "terms") {
    const privacy = path === "privacy";
    const blocks = privacy
      ? [
          [
            "Your enquiry",
            "The brief editor runs in your browser. Typing, previewing and calculating a price keeps your entries in the current page.",
          ],
          [
            "Saving on this device",
            "Choosing Save on this device stores a copy, including contact details, in this browser’s local storage. Delete it from the same enquiry tool or clear site data. Avoid saving on a shared device.",
          ],
          [
            "Files and contact",
            "Copying or downloading a brief places it on your clipboard or device. You decide if and where to send it. The hosting provider can receive ordinary page requests. On Vercel, Web Analytics measures page visits. The tracking script strips query strings and fragments and receives no form fields from the planner.",
          ],
        ]
      : [
          [
            "Planning a shoot",
            "Dates and times in the planner are preferences. Preparing a brief does not reserve the studio, engage a photographer or create a contract.",
          ],
          [
            "Estimates and production",
            "Prices are illustrative INR amounts. Agree schedule, image count, usage, travel, taxes and third-party costs in writing before a real production.",
          ],
          [
            "Delivery and changes",
            "Agree proof selection, revisions, file formats, delivery deadline and cancellation arrangements when commissioning a photographer. This concept collects no deposits or payments.",
          ],
        ];
    return (
      heading("Studio information", privacy ? "Privacy." : "Booking terms.") +
      '<article class="ff-prose">' +
      blocks
        .map(
          ([t, d]) => "<section><h2>" + t + "</h2><p>" + d + "</p></section>",
        )
        .join("") +
      "</article>"
    );
  }
  const about = path === "about";
  const founder =
    typeof studio.founder === "string" ? studio.founder : studio.founder.name;
  return `<section class="ff-split-title"><div>${eyebrow(about ? "About Frame & Field" : "Studio / Pune")}<h1>${about ? "The people behind the pictures." : "Inside the studio."}</h1><p>${about ? "An independent photography and creative production concept in Pune. We start with a question about the subject before deciding where to put a light." : "A working plan for a daylight photography space. Walk through the settings for portraits, product tests and small productions."}</p></div><figure>${picture("studio", about ? 4 : 0, { eager: true })}</figure></section>
  <section class="ff-section ff-notes"><div>${eyebrow(about ? "Creative direction" : "Studio guide")}<h2>${about ? esc(founder) : "Working areas."}</h2></div><div>${about ? "<p>Our illustrative founder works between portraiture and still life. In a portrait sitting, the conversation continues between exposures. On the tabletop, that same patience goes into waiting for a reflection to settle.</p><h3>A small working team</h3><p>The photographer shapes the light, a producer keeps the shot list moving and a stylist tends to surfaces and wardrobe. The client joins the tether review before a setup changes.</p><h3>Artistic values</h3><p>Keep skin recognisable, show materials honestly and leave gestures room to breathe. Test ideas openly and agree selections together.</p>" : studio.spaces.map(({title, body}) => "<h3>" + esc(title) + "</h3><p>" + esc(body) + "</p>").join("")}</div></section>
  <div class="ff-pair">${picture("studio", 1)}${picture("studio", 2)}</div>
  ${about ? "" : '<section class="ff-section"><div class="ff-section-head"><h2>On the floor.</h2></div><div class="ff-gallery">'+[3,5,6,7].map(i=>'<figure>'+picture('studio',i)+'<figcaption>'+esc(photos.studio[i].alt)+'</figcaption></figure>').join('')+'</div></section>'}
  <section class="ff-section ff-notes"><h2>${about ? "On assignment." : "Plan a visit."}</h2><div>${about ? process.map(([t, d]) => "<h3>" + t + "</h3><p>" + d + "</p>").join("") : "<h3>Equipment &amp; preparation</h3><p>Outline your lens, lighting, backdrop and power needs in the brief. For products, bring a clean spare and the intended packaging. Equipment and third-party hire would be agreed in advance.</p><h3>Accessibility &amp; policies</h3><p>Specify step-free access, seating, quiet breaks, companions or changing needs when preparing a brief. This is an illustrative space with no physical premises or walk-in appointments.</p><h3>Session hours</h3><p>" + esc(studio.hours) + "</p>"}</div></section>${closing(c)}`;
}
