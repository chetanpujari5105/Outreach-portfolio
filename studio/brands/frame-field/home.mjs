import { services, studio } from "./editorial.mjs";
import { esc } from "../common.mjs";
import {
  project,
  slugOf,
  projectTile,
  picture,
  button,
  line,
  eyebrow,
  closing,
  articleRows,
} from "./components.mjs";

export const process = [
  [
    "Discover",
    "Start with where the pictures will live. A wall print, a profile and a shop window each ask for a different frame.",
  ],
  [
    "Creative direction",
    "Agree a palette, a short set of references and a shot list with space for one unplanned frame.",
  ],
  [
    "The shoot",
    "Set the light, test the first picture together and work through the brief while the set is still in place.",
  ],
  [
    "Post-production",
    "Select a sequence, balance colour across it and agree the retouching before finishing the files.",
  ],
  [
    "Delivery",
    "Prepare the agreed print and screen exports, named and organised for the people who will use them.",
  ],
];
export function home(c) {
  const cover = project("fashion-a"),
    feature = project("products-a");
  return `<section class="ff-cover"><div class="ff-cover-text">${eyebrow("Independent photography studio")}<h1>A different<br>way of <br><em>seeing.</em></h1><div class="ff-cover-lower"><p>Photography and creative production for people, objects and the spaces between.</p>${line(c, "selected", "Explore selected work")}</div></div><figure class="ff-cover-image">${c.link(slugOf(cover), '<picture><source media="(max-width: 680px)" srcset="/assets/frame-field-cover-mobile.webp" width="800" height="697">' + picture(cover.key, 0, { eager: true, sizes: "58vw" }) + "</picture>")}<figcaption><span>${esc(cover.title)}</span>${c.link(slugOf(cover), "View story")}</figcaption></figure></section>
  <div class="ff-strip"><span>Pune, India</span><span>Studio &amp; on location</span><span>Available across India</span></div>
  <section class="ff-section"><div class="ff-section-head"><div>${eyebrow("From the archive")}<h2>Selected <em>work.</em></h2></div>${line(c, "work", "Complete portfolio")}</div><div class="ff-selected">${["portraits-a", "products-a", "weddings-a", "architecture-a"].map((k, i) => projectTile(c, project(k), i)).join("")}</div></section>
  <section class="ff-manifesto">${eyebrow("The studio’s point of view")}<h2>A little less direction.<br><em>A little more looking.</em></h2><p>A shoulder drops between takes. Sunlight reaches the edge of a bottle. We build a set carefully enough to notice what happens on its own.</p>${line(c, "about", "Our approach")}</section>
  <section class="ff-section"><div class="ff-section-head"><div>${eyebrow("Commissions")}<h2>What we <em>shoot.</em></h2></div>${line(c, "pricing", "Packages & pricing")}</div><div class="ff-service-index">${services.map((s) => c.link("services/" + s.key, esc(s.title) + '<span aria-hidden="true">↗</span>')).join("")}</div></section>
  <section class="ff-feature"><div>${eyebrow("Project in focus")}<h2>${esc(feature.title)}</h2><p>${esc(feature.objective)}</p><p>${esc(feature.approach)}</p>${line(c, slugOf(feature), "Open the case study")}</div><figure>${picture(feature.key, 1)}</figure><figure>${picture(feature.key, 2)}</figure></section>
  <section class="ff-section ff-duet"><figure>${picture("studio")}</figure><div>${eyebrow("The space / Pune")}<h2>Room for the <em>light.</em></h2><p>A window bay for portraits, a table for small objects and enough room to walk around a set before choosing the frame.</p>${line(c, "studio", "Inside the studio")}</div></section>
  <section class="ff-section ff-method"><div>${eyebrow("From brief to delivery")}<h2>How we <em>work.</em></h2></div><ol>${process.map(([t, d]) => "<li><h3>" + t + "</h3><p>" + d + "</p></li>").join("")}</ol></section>
  <section class="ff-founder"><div>${eyebrow("Behind the camera")}<h2>Meet the <em>photographer.</em></h2><p>${esc(typeof studio.founder === "string" ? studio.founder : studio.founder.name)} leads the fictional studio’s creative direction, starting each session with a conversation about what the picture needs to say.</p>${line(c, "about", "Meet the team")}</div><figure>${picture("studio", 4)}</figure></section>
  <section class="ff-section"><div class="ff-section-head"><div>${eyebrow("Field notes")}<h2>The <em>journal.</em></h2></div>${line(c, "journal", "All stories")}</div>${articleRows(c)}</section>${closing(c)}`;
}
