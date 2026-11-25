import { credit, esc, faq, icon, rupees } from "./common.mjs";
import { loomSizes } from "../site/loom-products.js";

const categories = ["All", "Clothing", "Bags", "Home"];
const sorts = [["", "Featured"], ["low", "Price: low to high"], ["high", "Price: high to low"]];
const shipping = 150;
const journal = [
  {
    id: "indigo", title: "How indigo wears", image: "loom-jacket", item: "jacket",
    summary: "What to expect from the first wash, and from years of wear.",
    paragraphs: ["Indigo cloth changes where it meets your hands and where the fabric folds. The elbows and pocket edges of a chore jacket tend to lighten first, leaving deeper colour in the seams.", "Wash deep indigo separately at first, turn the garment inside out and use cold water. Let it dry in the shade. A jacket that needs freshening up can often be aired between wears."],
  },
  {
    id: "kala-cotton", title: "A closer look at Kala cotton", image: "loom-shirt", item: "shirt",
    summary: "The grain and character of a rain-fed cotton cloth.",
    paragraphs: ["Look closely at the natural Kala cotton shirt and you can see its slightly uneven yarn. In the folded collar and button placket, the cloth catches the light differently as the grain changes direction.", "A gentle cold wash and a shade dry are enough for everyday care. Iron it slightly damp for a crisp finish, or let the weave settle into its natural texture."],
  },
  {
    id: "block-print", title: "Reading a block print", image: "loom-scarf", item: "scarf",
    summary: "Start with the edges of a repeating pattern.",
    paragraphs: ["Follow a motif across the stole and look for the point where one repeat meets the next. Slight shifts in the register are part of the character of a hand-blocked design.", "The silk is light enough to fold narrow at the neck or wear loose over a shoulder. Avoid rubbing the printed surface when washing. Use cool water and a cleaner made for silk."],
  },
];

function picture(c, image, description, eager = false) {
  const wide = image === "loom-hero";
  return c.img(image, description, "", eager).replace("<img ", `<img width="${wide ? 1536 : 800}" height="${wide ? 1024 : 1000}" `);
}

function navLink(c, path, label, active) {
  return `<a href="${esc(c.href(path))}"${active ? ' aria-current="page"' : ""}>${label}</a>`;
}

function header(c) {
  const links = [["collection", "Collection"], ["about", "Our story"], ["size-guide", "Size guide"], ["bag", 'Bag <span class="ll-count" data-ll-count hidden></span>']];
  return `<a class="skip" href="#loom-content">Skip to content</a>
    <header class="ll-head"><div class="ll-shell ll-head-inner">
      ${c.link("", "Loom &amp; Lane", "ll-mark")}
      <nav aria-label="Shop navigation">${links.map(([path, label]) => navLink(c, path, label, c.path === path || (path === "collection" && c.path.startsWith("pieces/")))).join("")}</nav>
    </div></header>`;
}

function footer(c) {
  return `<footer class="site-foot ll-foot"><div class="ll-shell">
    <div class="ll-foot-grid">
      <div>${c.link("", "Loom &amp; Lane", "ll-mark")}<p>A handloom boutique in Camp, Pune.</p></div>
      <nav aria-label="Explore Loom &amp; Lane"><h2>Explore</h2>${c.link("collection", "Collection")}${c.link("about", "Our story")}${c.link("journal", "Journal")}</nav>
      <nav aria-label="Customer help"><h2>Customer help</h2>${c.link("size-guide", "Size guide")}${c.link("care", "Fabric care")}${c.link("delivery", "Holds &amp; shipping")}${c.link("contact", "Contact &amp; FAQs")}</nav>
    </div><div class="ll-foot-base">${credit}${c.link("privacy", "Privacy")}</div>
  </div></footer>`;
}

function grid(c, items, topLevel = false) {
  const heading = topLevel ? "h2" : "h3";
  return `<ul class="ll-grid">${items.map((item, index) => `<li><a class="ll-card" href="${c.href("pieces/" + item.id)}">${picture(c, item.img, item.alt, topLevel && index === 0)}
    <div><${heading}>${item.label}</${heading}><span>${rupees(item.price)}</span></div><p>${item.detail}</p></a></li>`).join("")}</ul>`;
}

function home(c, items) {
  return `<section class="ll-shell ll-cover">
    <div class="ll-cover-copy"><h1>Made slowly,<br><span>worn often.</span></h1><p>Handloom clothing, bags and textiles for everyday use.</p>${c.link("collection", "Shop the collection", "ll-button ll-primary")}</div>
    <figure>${picture(c, "loom-hero", "Indigo textiles and garments in the Loom &amp; Lane boutique", true)}<figcaption>Loom &amp; Lane · Camp, Pune</figcaption></figure>
  </section>
  <section class="ll-shell ll-section">
    <div class="ll-rule ll-section-title"><h2>Off the loom.</h2>${c.link("collection", "View all pieces", "ll-text-link")}</div>
    ${grid(c, items.filter(item => ["camp-shirt", "crossbody", "drawstring-trouser"].includes(item.id)))}
  </section>
  <section class="ll-band"><div class="ll-shell ll-service-grid">
    <div><h2>Find your fit.</h2><p>Compare the garment measurements with a piece you already wear.</p>${c.link("size-guide", "Read the size guide", "ll-text-link")}</div>
    <div><h2>Hold a piece.</h2><p>Choose a size and colour and prepare a request for a shop hold or shipping.</p>${c.link("delivery", "See holds and shipping", "ll-text-link")}</div>
    <div><h2>Care for the cloth.</h2><p>Washing and drying notes for indigo, cotton, silk and wool.</p>${c.link("care", "Read the care guide", "ll-text-link")}</div>
  </div></section>`;
}

function collection(c, items) {
  const category = categories.includes(c.query.get("category")) ? c.query.get("category") : "All";
  const query = (c.query.get("q") || "").trim().slice(0, 100);
  const sort = sorts.some(([id]) => id === c.query.get("sort")) ? c.query.get("sort") : "";
  const results = items.filter(item => (category === "All" || item.tags.includes(category)) &&
    [item.label, item.detail, item.material, item.tags.join(" "), ...item.colours].join(" ").toLowerCase().includes(query.toLowerCase()));
  if (sort) results.sort((a, b) => sort === "low" ? a.price - b.price : b.price - a.price);
  const retained = { ...(query ? { q: query } : {}), ...(sort ? { sort } : {}) };
  return `<section class="ll-shell ll-page ll-collection">
    <div class="ll-rule ll-section-title"><h1>Off the loom.</h1>
      <nav class="ll-filters" aria-label="Collection categories">${categories.map(label =>
        `<a href="${esc(c.href("collection", { ...(label === "All" ? {} : { category: label }), ...retained }))}"${label === category ? ' aria-current="page"' : ""}>${label}</a>`).join("")}</nav>
    </div>
    <form class="ll-filter-form" action="${c.href("collection")}" method="get">
      ${category === "All" ? "" : `<input type="hidden" name="category" value="${category}">`}
      <label><span class="sr">Search pieces</span><input name="q" type="search" value="${esc(query)}" maxlength="100" placeholder="Search pieces"></label>
      <label><span class="sr">Sort collection</span><select name="sort">${sorts.map(([id, label]) => `<option value="${id}"${sort === id ? " selected" : ""}>${label}</option>`).join("")}</select></label>
      <button class="ll-button" type="submit">Apply</button>
      <p>${results.length} ${results.length === 1 ? "piece" : "pieces"}</p>
    </form>
    ${results.length ? grid(c, results, true) : `<div class="ll-empty"><h2>No pieces found.</h2><p>Try a different search or browse the whole collection.</p>${c.link("collection", "Clear filters", "ll-button")}</div>`}
  </section>`;
}

function options(c, field, item, selected) {
  return c.opts(field, { item }).map(option => `<option value="${esc(option.id)}"${option.disabled ? " disabled" : selected === option.id ? " selected" : ""}>${esc(option.label)}${option.disabled ? " · unavailable" : ""}</option>`).join("");
}

function variantFields(c, item, size, colour, qty = 1) {
  return `<div class="ll-variants"><label>Size<select name="size" required>${options(c, "size", item, size)}</select></label>
    <label>Colour<select name="colour" required>${options(c, "colour", item, colour)}</select></label>
    <label>Quantity<input name="qty" type="number" min="1" step="1" value="${qty}" required></label></div>`;
}

function product(c, item, items) {
  const { description, material, fit, care } = item;
  const related = items.filter(other => other !== item).sort((a, b) => Number(b.tags[0] === item.tags[0]) - Number(a.tags[0] === item.tags[0])).slice(0, 3);
  return `<div class="ll-shell ll-page">
    <nav class="ll-crumb" aria-label="Breadcrumb">${c.link("collection", "Collection")}<span aria-hidden="true">/</span>${c.link("collection", item.tags[0], "", { category: item.tags[0] })}</nav>
    <section class="ll-product">
      <figure>${picture(c, item.img, item.alt, true)}</figure>
      <div class="ll-product-copy"><h1>${item.label}</h1><p class="ll-price">${rupees(item.price)}</p><p>${description}</p>
        <form data-ll-product data-item="${item.id}">
          ${variantFields(c, item.id)}
          <p class="ll-note" data-ll-stock aria-live="polite"></p>
          <div class="ll-actions"><button class="ll-button ll-primary" type="button" data-ll-add disabled>Add to bag</button><a class="ll-button" data-ll-ask href="${c.href("request", { item: item.id })}">Ask about this piece</a></div>
          <p data-ll-message role="status" class="ll-message"></p>
        </form>
        <dl class="ll-specs"><div><dt>Material</dt><dd>${material}</dd></div><div><dt>Fit &amp; dimensions</dt><dd>${fit}${item.measurement ? " " + c.link("size-guide", "Size guide", "ll-text-link", { item: item.id }) : ""}</dd></div><div><dt>Care</dt><dd>${care}</dd></div></dl>
      </div>
    </section>
    <section class="ll-section"><div class="ll-rule ll-section-title"><h2>More from the collection.</h2></div>${grid(c, related)}</section>
  </div>`;
}

function editorial(c, title, body, image, description) {
  return `<article class="ll-shell ll-page ll-editorial">
    <div class="ll-editorial-copy"><h1>${title}</h1>${body}</div>
    <figure>${picture(c, image, description, true)}</figure>
  </article>`;
}

function guide(c, title, body, image, description) {
  return `<article class="ll-shell ll-page ll-guide"><div class="ll-rule ll-section-title"><h1>${title}</h1></div>
    <div class="ll-guide-grid"><div class="ll-prose">${body}</div>${image ? `<figure>${picture(c, image, description)}</figure>` : ""}</div></article>`;
}

function sizeGuide(c, items) {
  const garments = items.filter(item => item.measurement);
  const garment = garments.find(item => item.id === c.query.get("item")) || garments[0];
  const { label, values } = garment.measurement;
  const width = label === "Garment waist" ? "across the waistband" : "across the chest from underarm to underarm";
  return guide(c, "Find your fit.", `<p>Lay a similar garment flat and measure ${width}. Double that number to compare it with the garment circumference below.</p>
    <form class="ll-filter-form ll-fit-form" action="${c.href("size-guide")}" method="get">
      <label><span class="sr">Choose a garment</span><select name="item">${garments.map(item => `<option value="${item.id}"${garment === item ? " selected" : ""}>${item.label}</option>`).join("")}</select></label>
      <button class="ll-button" type="submit">Show measurements</button>
    </form>
    <table><caption>${garment.label} measurements</caption><thead><tr><th scope="col">Size</th><th scope="col">${label}</th><th scope="col">Flat width</th></tr></thead><tbody>${loomSizes.map((size, index) =>
      `<tr><th scope="row">${size}</th><td>${values[index]} cm</td><td>${values[index] / 2} cm</td></tr>`).join("")}</tbody></table>
    <p>${garment.fit}</p>${c.link("pieces/" + garment.id, "View this piece", "ll-button")}`, garment.img, garment.alt);
}

function request(c, item, items) {
  const fromBag = c.query.get("from") === "bag";
  const selected = item || items[0];
  const size = c.query.get("size");
  const colour = c.query.get("colour");
  const qty = Number(c.query.get("qty"));
  const initialQty = Number.isSafeInteger(qty) && qty >= 1 && qty <= 4 ? qty : 1;
  return `<section class="ll-shell ll-page">
    <div class="ll-rule ll-section-title"><h1>Shopping enquiry.</h1></div>
    <div class="ll-request-grid">
      <div>
        <p class="ll-intro">Prepare a request for a shop hold or delivery, with your pieces and options attached.</p>
        <p data-ll-status role="status" class="ll-message"></p>
        <form class="ll-form" data-ll-request data-from-bag="${fromBag}" data-shipping="${shipping}" hidden>
          <fieldset data-ll-chooser${fromBag ? " hidden disabled" : ""}>
            <legend>Your piece</legend>
            <label>Piece<select name="item">${items.map(option => `<option value="${option.id}"${selected === option ? " selected" : ""}>${option.label}</option>`).join("")}</select></label>
            ${variantFields(c, selected.id, size, colour, initialQty)}
            <p class="ll-note" data-ll-stock aria-live="polite"></p>
          </fieldset>
          <fieldset>
            <legend>Collection or delivery</legend>
            <label class="ll-radio"><input type="radio" name="fulfil" value="store"${c.query.get("fulfil") === "ship" ? "" : " checked"}>Hold in store for up to 7 days</label>
            <label class="ll-radio"><input type="radio" name="fulfil" value="ship"${c.query.get("fulfil") === "ship" ? " checked" : ""}>Ship to me · ${rupees(shipping)}</label>
            <label data-ll-postcode hidden>Delivery PIN code<input name="postcode" inputmode="numeric" autocomplete="postal-code" pattern="[1-9][0-9]{5}" maxlength="6" disabled></label>
          </fieldset>
          <fieldset>
            <legend>Your details</legend>
            <label>Name<input name="name" autocomplete="name" maxlength="80" required></label>
            <label>Email address or mobile number<input name="contact" autocomplete="off" maxlength="100" required></label>
            <label>Notes <span class="ll-note">(optional)</span><textarea name="notes" rows="3" maxlength="500"></textarea></label>
          </fieldset>
          <div class="ll-actions"><button class="ll-button ll-primary" type="submit">Review enquiry</button><p class="ll-mobile-estimate" data-ll-mobile-estimate aria-live="polite"></p></div>
        </form>
        <section data-ll-review class="ll-review" hidden>
          <h2 tabindex="-1">Your enquiry is ready.</h2><p>Copy or download the draft. Availability, holds and delivery are confirmed by the boutique.</p><pre data-ll-draft></pre>
          <div class="ll-actions"><button class="ll-button ll-primary" type="button" data-ll-copy>Copy enquiry</button><a class="ll-button" data-ll-download download="loom-and-lane-enquiry.txt">Download enquiry</a><button class="ll-button" type="button" data-ll-edit>Edit details</button></div>
          <p data-ll-review-status role="status" class="ll-message"></p>
        </section>
        <noscript><p>Enable JavaScript to prepare a shopping enquiry. ${c.link("collection", "Return to the collection", "ll-text-link")}.</p></noscript>
      </div>
      <aside class="ll-summary"><h2>Your estimate.</h2><div data-ll-estimate></div><p class="ll-note">Illustrative prices. Payment is arranged after confirmation.</p></aside>
    </div>
  </section>`;
}

export function loom(c) {
  const items = c.opts("item");
  const productItem = items.find(item => c.path === "pieces/" + item.id);
  const article = journal.find(entry => c.path === "journal/" + entry.id);
  const result = (title, content, image = "loom-hero", status) => ({
    ...c.result(title, header(c) + `<div id="loom-content" tabindex="-1">${content}</div>` + footer(c), image),
    category: "loom",
    status,
  });

  if (!c.path && !["category", "q", "sort"].some(key => c.query.has(key))) return result("Handloom boutique in Pune", home(c, items));
  if (!c.path || c.path === "collection") return result("The handloom collection", collection(c, items), "loom-jacket");
  if (productItem) return result(productItem.label, product(c, productItem, items), productItem.img);
  if (c.path === "bag") return result("Your bag", `<section class="ll-shell ll-page">
    <div class="ll-rule ll-section-title"><h1>Your bag.</h1>${c.link("collection", "Continue browsing", "ll-text-link")}</div>
    <p class="ll-intro">Keep your options together while you browse. You can prepare one enquiry for the whole bag.</p>
    <div data-ll-bag></div><p data-ll-status role="status" class="ll-message"></p>
    <noscript><p>Enable JavaScript to see the pieces in your bag.</p></noscript>
  </section>`);
  if (c.path === "request") {
    const item = items.find(option => option.id === c.query.get("item"));
    return result("Shopping enquiry", request(c, item, items), item?.img);
  }
  if (c.path === "about") return result("Our story", editorial(c, "Cloth for everyday use.", `<p>Loom &amp; Lane is a small handloom boutique in Camp, Pune. The collection brings clothing, bags and home textiles together around useful shapes and cloth with a visible weave.</p>
    <p>Start with the pieces you’ll reach for most often: a work jacket that softens with wear, a cotton shirt for warm days, or a canvas carryall for the market.</p>
    <div class="ll-actions">${c.link("collection", "Shop the collection", "ll-button ll-primary")}${c.link("journal", "Read the journal", "ll-text-link")}</div>`, "loom-hero", "Handloom garments and textiles inside the boutique"));
  if (c.path === "journal") return result("The journal", `<section class="ll-shell ll-page"><div class="ll-rule ll-section-title"><h1>The cloth journal.</h1></div>
    <ul class="ll-grid ll-journal">${journal.map(entry => `<li><a class="ll-card" href="${c.href("journal/" + entry.id)}">${picture(c, entry.image, items.find(item => item.id === entry.item).alt)}<div><h2>${entry.title}</h2></div><p>${entry.summary}</p></a></li>`).join("")}</ul></section>`);
  if (article) return result(article.title, editorial(c, article.title, article.paragraphs.map(text => `<p>${text}</p>`).join("") + `<div class="ll-actions">${c.link("pieces/" + article.item, "Explore the piece", "ll-button ll-primary")}${c.link("journal", "Back to the journal", "ll-text-link")}</div>`, article.image, items.find(item => item.id === article.item).alt), article.image);
  if (c.path === "size-guide") return result("Size guide", sizeGuide(c, items), items.find(item => item.id === c.query.get("item"))?.img || "loom-jacket");
  if (c.path === "care") return result("Fabric care", guide(c, "Care for the cloth.", `<p>Use the care instructions on your piece as your first reference.</p>
    <dl class="ll-specs">${[["Indigo", "jacket"], ["Kala cotton", "shirt"], ["Canvas and leather", "tote"], ["Silk", "scarf"], ["Wool-cotton", "throw"]].map(([material, id]) => `<div><dt>${material}</dt><dd>${items.find(item => item.id === id).care}</dd></div>`).join("")}</dl>
    ${c.link("journal", "Read the journal", "ll-button")}`, "loom-throw", items.find(item => item.id === "throw").alt), "loom-throw");
  if (c.path === "delivery") return result("Holds and shipping", guide(c, "Holds &amp; shipping.", `<h2>Pick up in Camp</h2><p>Choose an in-store hold in the enquiry. Once the boutique confirms availability, a piece can be set aside for up to seven days.</p>
    <h2>Ask for delivery</h2><p>Choose shipping and include your PIN code. The enquiry includes a ${rupees(shipping)} shipping estimate. Confirm the actual delivery time and cost with the boutique.</p>
    <h2>Fit and alterations</h2><p>Share your measurements or alteration question in the notes so the boutique can confirm what’s possible for that garment.</p>
    ${c.link("request", "Prepare an enquiry", "ll-button ll-primary")}`, "loom-tote", items.find(item => item.id === "tote").alt), "loom-tote");
  if (c.path === "contact") return result("Contact and FAQs", guide(c, "Contact &amp; FAQs.", `<p>Loom &amp; Lane is an illustrative boutique in Camp, Pune. Use the enquiry form to prepare a draft about a piece, fit, collection or shipping.</p>
    ${c.link("request", "Prepare an enquiry", "ll-button ll-primary")}
    <div class="ll-faq">${faq([
      ["How do I find my size?", `Compare the measurements of a garment you own with the ${c.link("size-guide", "size guide", "ll-text-link")}.`],
      ["How long can a piece be held?", "Allow up to seven days for an in-store hold once availability has been confirmed."],
      ["Can I request more than one piece?", "Add each size and colour to your bag, then prepare a single enquiry from the bag."],
      ["Will the form contact the boutique?", "The form generates a draft you can copy or download. This portfolio example has no live boutique inbox."],
    ])}</div>`, "loom-pouch", items.find(item => item.id === "pouch").alt), "loom-pouch");
  if (c.path === "privacy") return result("Privacy", guide(c, "Privacy.", `<p>The bag stores product choices in this browser tab. It does not contain contact information. Remove individual pieces from the bag or close the tab to clear the session.</p>
    <p>Enquiry details stay on the page while you prepare the draft. Copying writes the draft to your clipboard and downloading saves a text file on your device.</p>${c.link("bag", "View your bag", "ll-button")}`));
  return result("Page not found", guide(c, "This page is missing.", `<p>Find your way back to the collection or look up a piece by name.</p>${c.link("collection", "Browse the collection", "ll-button ll-primary")}`), "loom-hero", 404);
}
