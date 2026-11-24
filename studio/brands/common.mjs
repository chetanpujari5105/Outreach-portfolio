import { kits } from "../site/kits.js";
export const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export const rupees = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
export function context(slug, path, query, base = "/site/" + slug) {
  const href = (page = "", params = {}) =>
    base +
    (page ? "/" + page : "") +
    (Object.keys(params).length ? "?" + new URLSearchParams(params) : "");
  const link = (page, label, cls = "", params = {}) =>
    `<a class="${cls}" href="${esc(href(page, params))}">${label}</a>`;
  // Lazy by default: these links are opened on phones over mobile data. Pass eager for the first screen.
  const img = (id, alt = "", cls = "", eager = false) =>
    `<img class="${cls}" src="/assets/${id}.webp" alt="${esc(alt)}" decoding="async"${eager ? ' fetchpriority="high"' : ' loading="lazy"'}>`;
  const kit = kits[slug];
  const opts = (field, values = {}) => {
    const f = kit.steps.flatMap((s) => s.fields).find((f) => f.name === field);
    return typeof f.options === "function" ? f.options(values) : f.options;
  };
  const action = (label, params = {}) =>
    link("request", label, "action", params);
  const result = (title, html, image) => ({ title, html, image });
  return { slug, path, query, base, href, link, img, opts, action, result, kit };
}
export function mast(c, name, links) {
  return `<header class="business-mast">${c.link("", name, "business-name")}<nav aria-label="${esc(name)} navigation">${links.map(([path, label]) => c.link(path, label)).join("")}</nav></header>`;
}
export const details = (pairs) =>
  '<dl class="specs">' +
  pairs.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("") +
  "</dl>";
export const printButton =
  '<button type="button" class="action" data-print>Print this page</button>';

// ── Full-site building blocks, shared by every brand site. Layout and look stay per brand (CSS + section order).
// Icon paths from Lucide (ISC), 24px grid, drawn with currentColor strokes.
const icons = {
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  insta: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6"/>',
  chat: '<path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.4A8.5 8.5 0 1 1 21 11.5z"/>',
  wifi: '<path d="M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M2 9a15 15 0 0 1 20 0"/><circle cx="12" cy="19.5" r=".6"/>',
  pool: '<path d="M2 18c2 0 2-1.5 4-1.5S8 18 10 18s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5M8 15V5a2 2 0 0 1 4 0M16 15V5a2 2 0 0 0-4 0M8 9h8M8 12.5h8"/>',
  coffee: '<path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM17 10h1.5a2.5 2.5 0 0 1 0 5H17M8 2.5v3M12 2.5v3"/>',
  car: '<path d="M5 16V11l2-5h10l2 5v5M3 16h18v3H3zM7 19v2M17 19v2"/><circle cx="7.5" cy="13.5" r=".8"/><circle cx="16.5" cy="13.5" r=".8"/>',
  fan: '<circle cx="12" cy="12" r="1.5"/><path d="M12 10.5C12 6 13 3 16 3s3.5 4-4 7.5M13.5 12c4.5 0 7.5 1 7.5 4s-4 3.5-7.5-4M12 13.5c0 4.5-1 7.5-4 7.5s-3.5-4 4-7.5M10.5 12C6 12 3 11 3 8s4-3.5 7.5 4"/>',
  leaf: '<path d="M5 19c0-8 5-14 15-15-1 10-7 15-15 15zM5 19l7-7"/>',
  bed: '<path d="M3 18V6M3 13h18v5M21 13a3 3 0 0 0-3-3h-7v3M7 10.5h.01"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
  ruler: '<path d="m3 16 13-13 5 5L8 21zM7 12l2 2M10 9l2 2M13 6l2 2"/>',
  bike: '<circle cx="5.5" cy="16.5" r="3.5"/><circle cx="18.5" cy="16.5" r="3.5"/><path d="M5.5 16.5 9 9h6l3.5 7.5M9 9 7.5 5.5H6M12 16.5 15 9"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  left: '<path d="m15 6-6 6 6 6"/>',
  right: '<path d="m9 6 6 6-6 6"/>',
};
export const icon = (name, label = "") =>
  `<svg class="ic" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" ${label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true"'}>${icons[name]}</svg>`;
// Fictional numbers in the +91 99999 range; the message is prefilled so the owner sees where the lead came from.
export const whatsapp = (number, text) =>
  `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
export const stars = (n = 5) =>
  `<span class="stars" role="img" aria-label="${n} out of 5 stars">${icon("star").repeat(Math.round(n))}</span>`;
export const faq = (items) =>
  `<div class="faq">${items.map(([q, a]) => `<details><summary>${q}${icon("plus")}</summary><div><p>${a}</p></div></details>`).join("")}</div>`;
// One header for every page of a brand site: transparent over a cover image (over: true), solid elsewhere.
export function siteHeader(c, { name, links, cta, over = false }) {
  const nav = links
    .map(([p, label]) => c.link(p, label, c.path === p || (p && c.path.startsWith(p + "/")) ? "on" : ""))
    .join("");
  return `<header class="site-head${over ? " over" : ""}" data-site-head><div class="site-head-in">${c.link("", name, "site-name")}<nav class="site-nav" id="site-nav" aria-label="Main">${nav}${cta ? c.link(cta[0], cta[1], "head-cta", cta[2] || {}) : ""}</nav><button class="menu-btn" type="button" aria-expanded="false" aria-controls="site-nav" data-menu><span class="sr">Menu</span>${icon("menu")}${icon("close")}</button></div></header>`;
}
export const reviewNote = '<p class="disclose">Illustrative reviews and ratings.</p>';
// The only portfolio link on a standalone website, with the disclosure every page must keep.
export const credit = `<p class="credit">Website by <a href="/">Chetan Studio</a> · Business details, people, reviews and prices are illustrative.</p>`;
export function siteFooter(c, f) {
  return `<footer class="site-foot"><div class="foot-grid"><div class="foot-brand">${c.link("", f.name, "site-name")}<p>${f.blurb}</p></div><div><h2>Visit</h2><p>${icon("pin")}<span>${f.address}</span></p><p>${icon("clock")}<span>${f.hours}</span></p></div><div><h2>Contact</h2><p>${icon("phone")}<a href="tel:${f.phone.replace(/\s/g, "")}">${f.phone}</a></p><p>${icon("mail")}<a href="mailto:${f.email}">${f.email}</a></p><p>${icon("insta")}<a href="${c.href("")}#instagram">${f.insta}</a></p></div><div><h2>Explore</h2>${f.links.map(([p, l]) => c.link(p, l)).join("")}</div></div><div class="foot-base"><span>© ${new Date().getFullYear()} ${f.name}</span>${credit}</div></footer>`;
}
// Thumb-reach bar on phones: chat now, or go straight to booking.
export const dock = (c, wa, cta) =>  // hidden on the request page so it never covers the booking flow
  c.path === "request" ? "" :
  `<div class="dock"><a href="${wa}" class="dock-chat">${icon("chat")}WhatsApp</a>${c.link(cta[0], cta[1], "dock-cta", cta[2] || {})}</div>`;
