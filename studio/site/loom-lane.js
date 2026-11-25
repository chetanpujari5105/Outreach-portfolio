import { kits } from "./kits.js";

const site = document.querySelector(".b-loom-lane");
const base = site.querySelector(".ll-head .ll-mark").getAttribute("href");
const fields = kits["loom-lane"].steps.flatMap(step => step.fields);
const items = new Map(fields.find(field => field.name === "item").options.map(item => [item.id, item]));
const sizeOptions = fields.find(field => field.name === "size").options;
const colourOptions = fields.find(field => field.name === "colour").options;
const stockLimit = fields.find(field => field.name === "qty").max;
const bagKey = "studio-basket-loom-lane";
const price = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const money = value => price.format(value);
const esc = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const lineTotal = row => row.qty * items.get(row.id).price;
const subtotal = rows => rows.reduce((total, row) => total + lineTotal(row), 0);
const variant = row => `${sizeOptions({ item: row.id }).find(option => option.id === row.size).label} · ${row.colour}`;
const sameVariant = (a, b) => a.id === b.id && a.size === b.size && a.colour === b.colour;
const stock = row => stockLimit({ item: row.id, size: row.size });

function valid(row) {
  return row && items.has(row.id) &&
    Number.isInteger(row.qty) && row.qty > 0 && row.qty <= stock(row) &&
    sizeOptions({ item: row.id }).some(option => option.id === row.size && !option.disabled) &&
    colourOptions({ item: row.id }).some(option => option.id === row.colour);
}

function readBag() {
  try {
    const stored = JSON.parse(sessionStorage.getItem(bagKey) || "[]");
    return Array.isArray(stored) ? stored.filter(valid) : [];
  } catch {
    return [];
  }
}

function updateCount(rows) {
  const count = site.querySelector("[data-ll-count]");
  const quantity = rows.reduce((total, row) => total + row.qty, 0);
  count.hidden = quantity === 0;
  count.textContent = quantity;
}

function saveBag(rows, message) {
  try {
    sessionStorage.setItem(bagKey, JSON.stringify(rows));
    updateCount(rows);
    return true;
  } catch {
    message.textContent = "This tab cannot save the bag. You can prepare an enquiry directly from a product page.";
    return false;
  }
}

function selection(form, id) {
  const { size, colour, qty } = form.elements;
  return { id, size: size.value, colour: colour.value, qty: qty.valueAsNumber };
}

function updateStock(form, row) {
  const quantity = form.elements.qty;
  const limit = stock(row);
  quantity.max = limit;
  form.querySelector("[data-ll-stock]").textContent = `${limit} available for this option.`;
}

const product = site.querySelector("[data-ll-product]");
if (product) {
  const button = product.querySelector("[data-ll-add]");
  const ask = product.querySelector("[data-ll-ask]");
  const message = product.querySelector("[data-ll-message]");
  const current = () => selection(product, product.dataset.item);
  const update = () => {
    const row = current();
    updateStock(product, row);
    message.textContent = "";
    const query = new URLSearchParams({ item: row.id, size: row.size, colour: row.colour });
    if (valid(row)) query.set("qty", row.qty);
    ask.href = base + "/request?" + query;
  };
  const add = () => {
    if (!product.reportValidity()) return;
    const row = current();
    if (!valid(row)) return;
    const rows = readBag();
    const existing = rows.find(item => sameVariant(item, row));
    if (existing && row.qty + existing.qty > stock(row)) {
      message.textContent = `Your bag already has ${existing.qty} of this option. You can keep up to ${stock(row)}.`;
      return;
    }
    if (existing) existing.qty += row.qty;
    else rows.push(row);
    if (saveBag(rows, message)) {
      message.textContent = `Added ${row.qty} to your bag. `;
      const link = document.createElement("a");
      link.href = base + "/bag";
      link.className = "ll-text-link";
      link.textContent = "View your bag";
      message.append(link);
    }
  };
  button.disabled = false;
  button.addEventListener("click", add);
  product.addEventListener("submit", event => {
    event.preventDefault();
    add();
  });
  product.addEventListener("input", update);
  update();
}

const bag = site.querySelector("[data-ll-bag]");
if (bag) {
  const message = site.querySelector("[data-ll-status]");
  const renderBag = (rows) => {
    bag.innerHTML = rows.length ? rows.map((row, index) => {
      const item = items.get(row.id);
      return `<article class="ll-bag-line"><figure><img src="/assets/${item.img}.webp" width="80" height="100" alt="" decoding="async"></figure>
        <div><h2><a href="${base}/pieces/${item.id}">${item.label}</a></h2><p>${esc(variant(row))}</p></div>
        <label>Quantity<input data-ll-qty="${index}" aria-label="Quantity for ${item.label}, ${esc(variant(row))}" type="number" min="1" max="${stock(row)}" value="${row.qty}" required></label>
        <span data-ll-line>${money(lineTotal(row))}</span>
        <button type="button" class="ll-button" data-ll-remove="${index}" aria-label="Remove ${item.label}, ${esc(variant(row))}">Remove</button></article>`;
    }).join("") + `<div class="ll-bag-total"><p>Bag total <strong data-ll-total>${money(subtotal(rows))}</strong></p><a class="ll-button ll-primary" data-ll-bag-ask href="${base}/request?from=bag">Prepare a bag enquiry</a></div>`
      : `<div class="ll-empty"><h2>Your bag is empty.</h2><a class="ll-button ll-primary" href="${base}/collection">Shop the collection</a></div>`;
  };
  renderBag(readBag());
  window.addEventListener("pageshow", event => {
    if (event.persisted) renderBag(readBag());
  });
  bag.addEventListener("change", event => {
    const input = event.target;
    if (!input.matches("[data-ll-qty]")) return;
    const rows = readBag();
    const row = rows[Number(input.dataset.llQty)];
    if (!row) return;
    if (!input.checkValidity()) {
      input.value = row.qty;
      message.textContent = `Choose a quantity from 1 to ${stock(row)}. Your previous quantity was kept.`;
      return;
    }
    const previous = row.qty;
    row.qty = input.valueAsNumber;
    if (!saveBag(rows, message)) {
      input.value = previous;
      return;
    }
    input.closest(".ll-bag-line").querySelector("[data-ll-line]").textContent = money(lineTotal(row));
    bag.querySelector("[data-ll-total]").textContent = money(subtotal(rows));
    message.textContent = `Quantity updated. Bag total ${money(subtotal(rows))}.`;
  });
  bag.addEventListener("click", event => {
    const button = event.target.closest("[data-ll-remove]");
    if (!button) return;
    const rows = readBag();
    const index = Number(button.dataset.llRemove);
    const [removed] = rows.splice(index, 1);
    if (!removed || !saveBag(rows, message)) return;
    renderBag(rows);
    const next = bag.querySelector(`[data-ll-remove="${Math.min(index, rows.length - 1)}"]`) || bag.querySelector(".ll-button");
    next.focus();
    message.textContent = `${items.get(removed.id).label} removed from your bag.`;
  });
}

const request = site.querySelector("[data-ll-request]");
if (request) {
  const { size, colour, qty, fulfil, postcode } = request.elements;
  const item = request.elements.namedItem("item");
  const chooser = request.querySelector("[data-ll-chooser]");
  const estimate = site.querySelector("[data-ll-estimate]");
  const mobileEstimate = request.querySelector("[data-ll-mobile-estimate]");
  const message = site.querySelector("[data-ll-status]");
  const review = site.querySelector("[data-ll-review]");
  const reviewStatus = review.querySelector("[data-ll-review-status]");
  const draft = review.querySelector("[data-ll-draft]");
  const download = review.querySelector("[data-ll-download]");
  const shipping = Number(request.dataset.shipping);
  const fromBag = request.dataset.fromBag === "true";
  let downloadUrl;

  function updateOptions(select, options) {
    select.replaceChildren(...options.map(option => {
      const node = new Option(option.label + (option.disabled ? " · unavailable" : ""), option.id);
      node.disabled = Boolean(option.disabled);
      return node;
    }));
    select.value = options.find(option => !option.disabled).id;
  }

  function getRows() {
    if (fromBag) return readBag();
    const row = selection(request, item.value);
    return valid(row) ? [row] : [];
  }

  function updateRequest() {
    const ship = fulfil.value === "ship";
    postcode.closest("label").hidden = !ship;
    postcode.required = ship;
    postcode.disabled = !ship;
    if (!fromBag) updateStock(request, selection(request, item.value));
    const rows = getRows();
    if (!rows.length) {
      mobileEstimate.textContent = "";
      estimate.textContent = fromBag ? "Your bag is empty." : "Choose an available quantity to see your estimate.";
      return;
    }
    const estimatedTotal = money(subtotal(rows) + (ship ? shipping : 0));
    mobileEstimate.textContent = `Estimate ${estimatedTotal}`;
    estimate.innerHTML = `<dl>${rows.map(row => `<div><dt>${items.get(row.id).label} × ${row.qty}<small>${esc(variant(row))}</small></dt><dd>${money(lineTotal(row))}</dd></div>`).join("")}
      ${ship ? `<div><dt>Shipping</dt><dd>${money(shipping)}</dd></div>` : ""}
      <div><dt>Estimated total</dt><dd>${estimatedTotal}</dd></div></dl>`;
  }

  request.addEventListener("change", event => {
    if (event.target === item) {
      updateOptions(size, sizeOptions({ item: item.value }));
      updateOptions(colour, colourOptions({ item: item.value }));
      qty.value = 1;
    }
    updateRequest();
  });
  qty.addEventListener("input", updateRequest);

  request.addEventListener("submit", event => {
    event.preventDefault();
    const rows = getRows();
    if (!rows.length) {
      message.textContent = "Add a piece from the collection to prepare an enquiry.";
      return;
    }
    const values = new FormData(request);
    const name = values.get("name").trim();
    const contact = values.get("contact").trim();
    if (!name || !contact) {
      message.textContent = "Enter your name and a contact detail.";
      request.elements[name ? "contact" : "name"].focus();
      return;
    }
    const phone = contact.replace(/[\s()-]/g, "");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) && !/^\+?[0-9]{10,15}$/.test(phone)) {
      message.textContent = "Enter an email address or a mobile number with 10 to 15 digits.";
      request.elements.contact.focus();
      return;
    }
    const ship = fulfil.value === "ship";
    const lines = rows.map(row => `• ${items.get(row.id).label} — ${variant(row)} × ${row.qty} — ${money(lineTotal(row))}`);
    const notes = values.get("notes").trim();
    draft.textContent = [
      "Loom & Lane shopping enquiry", "",
      ...lines,
      ship ? `Shipping estimate: ${money(shipping)} · PIN ${postcode.value}` : "Collection: In-store hold in Camp, Pune",
      `Estimated total: ${money(subtotal(rows) + (ship ? shipping : 0))}`, "",
      `Name: ${name}`, `Contact: ${contact}`,
      ...(notes ? [`Notes: ${notes}`] : []),
    ].join("\n");
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    downloadUrl = URL.createObjectURL(new Blob([draft.textContent], { type: "text/plain;charset=utf-8" }));
    download.href = downloadUrl;
    message.textContent = "";
    reviewStatus.textContent = "";
    request.hidden = true;
    review.hidden = false;
    review.querySelector("h2").focus();
  });
  review.querySelector("[data-ll-edit]").addEventListener("click", () => {
    review.hidden = true;
    request.hidden = false;
    (fromBag ? fulfil[0] : item).focus();
  });
  review.querySelector("[data-ll-copy]").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(draft.textContent);
      reviewStatus.textContent = "Enquiry copied.";
    } catch {
      reviewStatus.textContent = "Clipboard access is unavailable. Use Download enquiry to keep the draft.";
    }
  });

  if (fromBag && !readBag().length) {
    message.textContent = "Your bag is empty. ";
    const link = document.createElement("a");
    link.href = base + "/collection";
    link.className = "ll-text-link";
    link.textContent = "Shop the collection";
    message.append(link);
  } else {
    chooser.disabled = fromBag;
    request.hidden = false;
  }
  updateRequest();
}

updateCount(readBag());
window.addEventListener("pageshow", () => updateCount(readBag()));
