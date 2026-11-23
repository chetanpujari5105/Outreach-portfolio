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
export function context(slug, path, query) {
  const base = "/demo/" + slug;
  const href = (page = "", params = {}) =>
    base +
    (page ? "/" + page : "") +
    (Object.keys(params).length ? "?" + new URLSearchParams(params) : "");
  const link = (page, label, cls = "", params = {}) =>
    `<a class="${cls}" href="${esc(href(page, params))}">${label}</a>`;
  const img = (id, alt = "", cls = "") =>
    `<img class="${cls}" src="/assets/${id}.webp" alt="${esc(alt)}" decoding="async">`;
  const kit = kits[slug];
  const opts = (field, values = {}) => {
    const f = kit.steps.flatMap((s) => s.fields).find((f) => f.name === field);
    return typeof f.options === "function" ? f.options(values) : f.options;
  };
  const action = (label, params = {}) =>
    link("request", label, "action", params);
  const result = (title, html, image) => ({ title, html, image });
  return { slug, path, query, href, link, img, opts, action, result, kit };
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
