import { esc } from "../common.mjs";
import { services, packages, addons, studio, projects } from "./editorial.mjs";
import {
  heading,
  eyebrow,
  money,
  button,
  line,
  list,
  dataBlock,
} from "./components.mjs";
const options = (items, selected) =>
  items
    .map(
      ([key, title]) =>
        `<option value="${esc(key)}"${key === selected ? " selected" : ""}>${esc(title)}</option>`,
    )
    .join("");
const field = (name, label, type = "text", attrs = "") =>
  `<label>${label}<input type="${type}" name="${name}" ${attrs}></label>`;
const area = (name, label, required = false) =>
  `<label class="ff-wide">${label}<textarea rows="3" name="${name}" maxlength="3000" ${required ? "required" : ""}></textarea></label>`;
const select = (name, label, items, selected = "") =>
  `<label>${label}<select name="${name}">${options(
    items.map((v) => (Array.isArray(v) ? v : [v, v])),
    selected,
  )}</select></label>`;
const catalogue = () =>
  dataBlock("ff-rates", {
    services: services.map(({ key, title }) => ({ key, title })),
    packages,
    addons,
  });
const selectedService = (c) =>
  services.some((s) => s.key === c.query.get("service"))
    ? c.query.get("service")
    : services[0].key;
function choices(c) {
  const key = selectedService(c);
  return select(
    "service",
    "Photography service",
    services.map((s) => [s.key, s.title]),
    key,
  );
}
function extras(key) {
  return `<div class="ff-checks" data-extras>${addons.map((a) => `<label data-for="${esc(a.categories.join(" "))}" ${a.categories.includes(key) ? "" : "hidden"}><input type="checkbox" name="addon" value="${esc(a.key)}" ${a.categories.includes(key) ? "" : "disabled"}><span>${esc(a.title)}</span><b>+${money(a.price)}</b></label>`).join("")}</div>`;
}
function packagesFor(c) {
  const key = selectedService(c),
    rows = packages.filter((p) => p.category === key),
    wanted = c.query.get("package");
  return (
    select(
      "package",
      "Package",
      rows
        .map((p) => [p.key, p.title + " · " + money(p.price)])
        .concat([["custom", "Custom project"]]),
      wanted,
    ) + '<p data-inclusions class="ff-help"></p>'
  );
}
export function pricing(c) {
  const key = selectedService(c),
    rows = packages.filter((p) => p.category === key);
  return (
    heading(
      "Commission guide",
      "Packages & pricing.",
      "Compare what each session includes, then build an indicative estimate in Indian rupees.",
    ) +
    `<section class="ff-section ff-price" data-pricing>${catalogue()}<div class="ff-price-body">${choices(c)}<h2>Package comparison.</h2><div data-comparison>${rows.map((p) => `<details><summary>${esc(p.title)} <b>${money(p.price)}</b></summary><p>${esc(p.description)}</p>${list(p.inclusions)}</details>`).join("")}</div></div><section class="ff-estimate" aria-label="Estimate worksheet">${eyebrow("Estimate worksheet")}<h2>Your session.</h2>${packagesFor(c)}<h3>Optional extras</h3>${extras(key)}<div class="ff-total"><span>Estimated total</span><strong data-total aria-live="polite"></strong></div><a class="ff-button" data-book-link href="${c.href("book", { service: key })}">Book selected package</a>${line(c, "quote", "Request a custom quote")}<p class="ff-help">Illustrative prices. Travel, taxes, usage extensions and external production costs require agreement.</p></section></section>`
  );
}
const contactFields = () =>
  field(
    "name",
    "Full name",
    "text",
    'required autocomplete="name" maxlength="120"',
  ) +
  field(
    "email",
    "Email address",
    "email",
    'required autocomplete="email" maxlength="180"',
  ) +
  field(
    "phone",
    "Phone number (optional)",
    "tel",
    'autocomplete="tel" maxlength="40"',
  ) +
  field(
    "company",
    "Company or brand (optional)",
    "text",
    'autocomplete="organization" maxlength="150"',
  );
const locations = () =>
  select("setting", "Shoot setting", [
    "Studio",
    "On location",
    "Both",
    "To be decided",
  ]) +
  "<div data-location hidden>" +
  field("location", "Location or venue", "text", 'maxlength="200"') +
  "</div>";
function shoot(c) {
  const reference = projects.find(
    (p) => p.slug === c.query.get("project"),
  )?.title;
  return [
    [
      "Service",
      choices(c) +
        (reference
          ? field(
              "reference",
              "Reference project",
              "text",
              'readonly value="' + esc(reference) + '"',
            )
          : ""),
    ],
    ["Package", packagesFor(c)],
    [
      "Shoot details",
      field("date", "Preferred date", "date", "required data-future") +
        field("time", "Preferred time", "time", "required") +
        select("duration", "Shoot duration", [
          "1 hour",
          "2 hours",
          "Half day",
          "Full day",
          "Multiple days",
          "To be discussed",
        ]) +
        field(
          "people",
          "Number of people",
          "number",
          'required min="1" max="10000" value="1"',
        ) +
        locations() +
        area("purpose", "How will you use the photographs?", true) +
        area("creative", "Creative requirements (optional)"),
    ],
    [
      "Add-ons",
      extras(selectedService(c)) +
        '<p class="ff-help">Extras are optional. Travel and external hire are scoped separately.</p>',
    ],
    [
      "Contact",
      contactFields() + area("notes", "Additional requirements (optional)"),
    ],
  ];
}
function quotation(c) {
  return [
    [
      "Production brief",
      choices(c) +
        field(
          "company",
          "Company or brand",
          "text",
          'required maxlength="150"',
        ) +
        area("objectives", "Project objectives", true) +
        field(
          "subjects",
          "Products or subjects",
          "number",
          'required min="1" max="100000"',
        ) +
        field(
          "images",
          "Required photographs",
          "number",
          'required min="1" max="100000"',
        ) +
        field(
          "days",
          "Number of shoot days",
          "number",
          'required min="1" max="365"',
        ) +
        field(
          "locations",
          "Preferred locations",
          "text",
          'required maxlength="250"',
        ),
    ],
    [
      "Usage & delivery",
      area("direction", "Creative direction requirements", true) +
        area("styling", "Styling and production needs") +
        area("usage", "Image usage, channels and territories", true) +
        field("deadline", "Delivery deadline", "date", "required data-future") +
        select("budget", "Estimated budget", [
          "Not decided yet",
          "Under ₹10,000",
          "₹10,000–₹25,000",
          "₹25,000–₹50,000",
          "₹50,000–₹1,00,000",
          "₹1,00,000+",
        ]) +
        area("notes", "Additional notes (optional)"),
    ],
    [
      "Contact",
      field(
        "name",
        "Full name",
        "text",
        'required autocomplete="name" maxlength="120"',
      ) +
        field(
          "email",
          "Email address",
          "email",
          'required autocomplete="email" maxlength="180"',
        ) +
        field(
          "phone",
          "Phone number (optional)",
          "tel",
          'autocomplete="tel" maxlength="40"',
        ),
    ],
  ];
}
const contact = (c) => [
  [
    "Message",
    choices(c) +
      contactFields() +
      area("message", "What would you like to discuss?", true),
  ],
];
export function formPage(c, kind) {
  const booking = kind === "book",
    quote = kind === "quote",
    key = selectedService(c);
  const steps = booking ? shoot(c) : quote ? quotation(c) : contact(c);
  const title = booking
    ? "Book a shoot."
    : quote
      ? "Request a custom quote."
      : "Get in touch.";
  const labels = steps.map((x) => x[0]).concat(["Review", "Prepared"]);
  const links = [
    ["email", "Email", "mailto:"],
    ["phone", "Call", "tel:"],
    ["whatsapp", "WhatsApp", ""],
    ["map", "Studio map", ""],
  ]
    .filter(([k]) => studio[k])
    .map(
      ([k, t, prefix]) =>
        '<a href="' + esc(prefix + studio[k]) + '">' + t + "</a>",
    );
  return (
    heading(
      booking
        ? "Shoot planner"
        : quote
          ? "Commercial production"
          : "Studio correspondence",
      title,
      booking
        ? "Plan your session, see an estimate and prepare a brief to keep."
        : quote
          ? "Set out the production, usage and delivery requirements for a tailored brief."
          : "Prepare a message about a session, collaboration or studio visit.",
    ) +
    `<section class="ff-section ff-workflow" data-flow="${kind}" data-base="${esc(c.base)}">${catalogue()}<section aria-label="Enquiry progress"><h2>${booking ? "Session planner" : quote ? "Project brief" : "Enquiry"}</h2><ol class="ff-progress">${labels.map((l) => "<li>" + l + "</li>").join("")}</ol>${booking ? '<div class="ff-total"><span>Estimated total</span><strong data-total aria-live="polite"></strong></div>' : ""}<p class="ff-help">This fictional studio prepares enquiries in your browser. Saving your contact details on this device is optional.</p>${kind === "contact" ? "<p>" + esc(studio.location) + "<br>" + esc(studio.hours) + "</p>" + links.join(" ") + line(c, "faq", "Studio FAQs") + line(c, "book", "Plan a shoot") : ""}</section>
 <div class="ff-sheet"><noscript>Enable JavaScript to prepare and export a brief.</noscript><div data-saved hidden><p>A copy of your last ${quote ? "quote brief" : "enquiry"} is saved on this device.</p><button type="button" data-restore>Open saved copy</button> <button type="button" data-delete>Delete saved copy</button></div><form novalidate>
 ${steps.map(([title, fields], i) => `<section data-step ${i ? "hidden" : ""}><div class="ff-step-head">${eyebrow("Step " + (i + 1) + " of " + labels.length)}<h2 tabindex="-1">${esc(title)}</h2></div><div class="ff-fields">${fields}</div></section>`).join("")}
 <section data-step hidden><div class="ff-step-head">${eyebrow("Review before preparing")}<h2 tabindex="-1">Review your brief.</h2></div><div data-review></div></section>
 <section data-step hidden><div class="ff-step-head">${eyebrow("Ready to keep")}<h2 tabindex="-1">Your brief is prepared.</h2></div><p>You can copy or download this brief. No enquiry has been sent and no date has been reserved.</p><div class="ff-form-actions"><button type="button" data-copy>Copy details</button><button type="button" data-download>Download brief</button><button type="button" data-save>Save on this device</button><button type="button" data-delete hidden>Delete saved copy</button><button type="button" data-new>Start a new enquiry</button></div></section>
 <p data-error role="alert"></p><p data-feedback role="status"></p><div class="ff-form-actions"><button type="button" data-back hidden>Back</button><button type="submit" class="ff-button" data-continue>Continue</button></div></form></div></section>`
  );
}
