import { esc } from "../common.mjs";
import { photos } from "./photos.mjs";
import { services, projects, articles, studio } from "./editorial.mjs";

export const service = (key) => services.find((item) => item.key === key);
export const project = (key) => projects.find((item) => item.key === key);
export const money = (value) =>
  value == null
    ? "Custom quotation"
    : "₹" + Number(value).toLocaleString("en-IN");
export const dataBlock = (id, data) =>
  '<script type="application/json" id="' +
  id +
  '">' +
  JSON.stringify(data).replace(/</g, "\\u003c") +
  "</script>";
export function photograph(record, options = {}) {
  const { eager = false, sizes = "(max-width: 660px) 100vw, 50vw" } = options;
  const responsive =
    record.small && record.small !== record.src
      ? ` srcset="${esc(record.small)} ${record.smallWidth || Math.min(640, record.width)}w, ${esc(record.src)} ${record.width}w" sizes="${sizes}"`
      : "";
  return `<img src="${esc(record.src)}"${responsive} width="${record.width}" height="${record.height}" alt="${esc(record.alt)}" decoding="async" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}>`;
}
export const picture = (key, index = 0, options) =>
  photograph(photos[key][index % photos[key].length], options);
export const slugOf = (p) => "work/" + p.slug;
export const arrow = '<span aria-hidden="true" class="ff-plus">+</span>';
export const mark =
  '<span class="ff-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span>';
export const wordmark = mark + "<span>Frame <i>&amp;</i> Field</span>";
export const eyebrow = (t) => '<p class="ff-kicker">' + esc(t) + "</p>";
export const line = (c, path, label, params = {}) =>
  c.link(path, esc(label), "ff-line", params);
export const button = (c, path, label, params = {}) =>
  c.link(path, esc(label), "ff-button", params);
export const list = (items) =>
  '<ul class="ff-list">' +
  items.map((v) => "<li>" + esc(v) + "</li>").join("") +
  "</ul>";
export const faqList = (items) =>
  '<div class="ff-accordion">' +
  items
    .map(
      ({ q, a }) =>
        "<details><summary>" +
        esc(q) +
        arrow +
        "</summary><p>" +
        esc(a) +
        "</p></details>",
    )
    .join("") +
  "</div>";
export const heading = (kicker, title, intro = "") =>
  `<header class="ff-title">${eyebrow(kicker)}<h1>${esc(title)}</h1>${intro ? "<p>" + esc(intro) + "</p>" : ""}</header>`;
export function projectTile(c, p, i = 0, eager = false) {
  return `<article class="ff-project-tile" data-item data-category="${p.category}" data-search="${esc([p.title, p.dek, service(p.category).title].join(" ").toLowerCase())}">${c.link(slugOf(p), "<figure>" + picture(p.key, 0, { eager }) + '</figure><div class="ff-caption"><span>' + esc(p.title) + "</span><small>" + esc(service(p.category).short || service(p.category).title) + "</small></div>")}</article>`;
}
export function journalTile(c, a) {
  return `<article class="ff-journal-tile" data-item data-category="${esc(a.category)}" data-search="${esc([a.title, a.dek, a.category].join(" ").toLowerCase())}">${c.link("journal/" + a.slug, "<figure>" + picture(a.photoKey) + "</figure>" + eyebrow(a.category + " / " + a.minutes + " min read") + "<h3>" + esc(a.title) + "</h3>")}</article>`;
}
export function menu(c) {
  const entries = [
    ["work", "Work"],
    ["services", "Services"],
    ["about", "About"],
    ["studio", "Studio"],
    ["journal", "Journal"],
  ];
  return `<a class="ff-skip" href="#ff-content">Skip to content</a><header class="ff-head">${c.link("", wordmark, "ff-wordmark")}<button class="ff-menu" aria-controls="ff-nav" aria-expanded="false" type="button">Menu</button><nav id="ff-nav" aria-label="Studio navigation">${entries.map(([p, t]) => c.link(p, t, c.path.split("/")[0] === p ? "current" : "")).join("")}${button(c, "book", "Book a shoot")}</nav></header>`;
}
export function footer(c) {
  const socials = studio.socials.filter(({url,label}) => label && /^https:\/\//i.test(url)).map(({url,label}) => '<a href="'+esc(url)+'">'+esc(label)+'</a>').join('');

  const groups = [
    [
      "Explore",
      [
        ["selected", "Selected work"],
        ["work", "Portfolio"],
        ["about", "Our story"],
        ["journal", "Journal"],
      ],
    ],
    [
      "Commission",
      [
        ["services", "Photography services"],
        ["pricing", "Packages & pricing"],
        ["quote", "Custom quote"],
        ["contact", "Contact"],
      ],
    ],
    [
      "Visit",
      [
        ["studio", "Our studio"],
        ["faq", "FAQs"],
        ["privacy", "Privacy"],
        ["terms", "Booking terms"],
      ],
    ],
  ];
  return `<footer class="ff-footer"><div class="ff-foot-grid"><div>${c.link("", wordmark, "ff-wordmark")}<p>${esc(studio.location)}<br>${esc(studio.hours)}</p>${socials}</div>${groups.map(([title, links]) => "<div><b>" + title + "</b>" + links.map(([p, t]) => c.link(p, t)).join("") + "</div>").join("")}</div><div class="ff-colophon"><span>© ${new Date().getFullYear()} Frame &amp; Field · Fictional studio concept</span><a href="/work/frame-field">Website by Chetan Studio</a></div></footer>`;
}
export function closing(c) {
  return `<section class="ff-close">${eyebrow("Commissions")}<h2>Let’s make a <em>picture.</em></h2>${button(c, "book", "Plan your shoot")} ${line(c, "quote", "Request a custom quote")}</section>`;
}
export function articleRows(c, count = 3) {
  return (
    '<div class="ff-journal-grid">' +
    articles
      .slice(0, count)
      .map((a) => journalTile(c, a))
      .join("") +
    "</div>"
  );
}
