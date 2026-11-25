import { esc } from "./common.mjs";
import { articles, projects, services } from "./frame-field/editorial.mjs";
import { photos } from "./frame-field/photos.mjs";
import {
  button,
  footer,
  heading,
  menu,
  project,
} from "./frame-field/components.mjs";
import { home } from "./frame-field/home.mjs";
import {
  collection,
  projectPage,
  servicePage,
  serviceIndex,
  articlePage,
  information,
} from "./frame-field/stories.mjs";
import { pricing, formPage } from "./frame-field/enquiry.mjs";

const legacySeries = new Map([
  ["portrait", "portraits-a"],
  ["product", "products-a"],
  ["event", "events-a"],
]);
const titles = {
  selected: "Selected work",
  work: "Photography portfolio",
  services: "Photography services",
  pricing: "Packages & pricing",
  about: "About the studio",
  studio: "Inside the studio",
  journal: "Studio journal",
  book: "Book a shoot",
  quote: "Request a custom quote",
  contact: "Contact",
  faq: "Frequently asked questions",
  privacy: "Privacy",
  terms: "Booking information",
};
export function archive(c) {
  const legacy =
    /^series\/(portrait|product|event)(?:\/image\/([1-9]\d*))?$/.exec(c.path);
  const path =
    c.path === "request" ? "book" : c.path === "commission" ? "quote" : c.path;
  let title = titles[path] || "",
    content = "",
    photo = "fashion-a",
    description = "",
    status;
  const [section, slug, extra] = path.split("/");
  const p = legacy
    ? project(legacySeries.get(legacy[1]))
    : section === "work" && !extra
      ? projects.find((p) => p.slug === slug)
      : null;
  const s =
    section === "services" && !extra
      ? services.find((s) => s.key === slug)
      : null;
  const a =
    section === "journal" && !extra
      ? articles.find((a) => a.slug === slug)
      : null;
  if (!path) {
    title = "Independent photography studio in Pune";
    description =
      "Frame & Field photographs people, products and places in Pune and on location across India. Explore sixteen concept series and plan a commission.";
    content = home(c);
  } else if (p && (!legacy?.[2] || Number(legacy[2]) <= photos[p.key].length)) {
    title = p.title;
    description = p.dek;
    photo = p.key;
    content = projectPage(c, p, legacy?.[2] ? Number(legacy[2]) - 1 : -1);
  } else if (s) {
    title = s.title;
    description = s.overview;
    photo = s.key + "-a";
    content = servicePage(c, s);
  } else if (a) {
    title = a.title;
    description = a.dek;
    photo = a.photoKey;
    content = articlePage(c, a);
  } else if (["work", "selected", "journal"].includes(path))
    content = collection(c, path === "journal", path === "selected");
  else if (path === "services") content = serviceIndex(c);
  else if (path === "pricing") content = pricing(c);
  else if (["about", "studio", "faq", "terms", "privacy"].includes(path))
    content = information(c, path);
  else if (["book", "quote", "contact"].includes(path))
    content = formPage(c, path);
  else {
    status = 404;
    title = "Page not found";
    content =
      heading(
        "404 / Frame & Field",
        "Outside the frame.",
        "This address does not lead to a studio page.",
      ) +
      '<div class="ff-section">' +
      button(c, "work", "Return to the archive") +
      "</div>";
  }
  return {
    title,
    status,
    description:
      description ||
      title +
        " at Frame & Field, an independent photography studio concept in Pune.",
    image: photos[photo][0].src
      .replace(/^\/assets\//, "")
      .replace(/\.webp$/, ""),
    html:
      menu(c) +
      '<div id="ff-content" tabindex="-1">' +
      content +
      "</div>" +
      footer(c),
  };
}
// Each photography page loads one stylesheet and one browser module. Large shared site kits are unnecessary here.
export function frameDocument(url, p) {
  const title = esc(
      p.clean ? p.title : p.title + " · Frame & Field | Chetan Studio",
    ),
    description = esc(p.description),
    canonical = esc(url.origin + url.pathname);
  const preview = url.pathname.startsWith("/demo/");
  const clean = esc(url.pathname.replace(/^\/demo\//, "/site/") + url.search);
  const bar = preview
    ? '<nav class="studio-return" aria-label="Portfolio preview"><a href="/work/frame-field">Chetan Studio · Case study</a><a href="' +
      clean +
      '">Standalone website</a><a href="/sample?project=frame-field">Request a similar site</a></nav>'
    : "";
  const head = `<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f6f3eb"><meta name="robots" content="noindex,nofollow"><title>${title}</title><meta name="description" content="${description}"><link rel="canonical" href="${canonical}"><meta property="og:type" content="website"><meta property="og:url" content="${canonical}"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:image" content="${esc(url.origin + p.image)}"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="${esc(p.favicon)}"><link rel="stylesheet" href="/ui/kit-frame-field.css"><script type="module" src="/ui/frame-field-studio.js"></script>`;
  return new Response(
    '<!doctype html><html lang="en"><head>' +
      head +
      "</head><body>" +
      bar +
      "<main>" +
      p.body +
      "</main></body></html>",
    {
      status: p.status || 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
    },
  );
}
