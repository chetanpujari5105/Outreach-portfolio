import { kits } from "./kits.js";
import { billingRecords, invoiceValue } from "./demos.js";

const brand = document.querySelector(".brand");
const slug = location.pathname.split("/")[2];
const base = location.pathname.split("/").slice(0, 3).join("/"); // /demo/<slug> or the clean /site/<slug>
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const price = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n);
const key = "studio-basket-" + slug;
const isBox = slug === "mill-crate";
const fields = kits[slug]?.steps.flatMap((s) => s.fields) || [];
const items =
  fields.find((f) => f.name === (isBox ? "box" : "item"))?.options || [];
const options = (name, v) => {
  const f = fields.find((f) => f.name === name);
  return typeof f.options === "function" ? f.options(v) : f.options;
};
function stock(row) {
  if (isBox) return 20000;
  return fields
    .find((f) => f.name === "qty")
    .max({ item: row.id, size: row.size });
}
function valid(row) {
  if (
    !row ||
    !items.some((o) => o.id === row.id) ||
    !Number.isInteger(row.qty) ||
    row.qty < (isBox ? 250 : 1)
  )
    return false;
  if (isBox) return row.qty <= 20000 && row.qty % 250 === 0;
  return (
    options("size", { item: row.id }).some(
      (v) => v.id === row.size && !v.disabled,
    ) &&
    options("colour", { item: row.id }).some((v) => v.id === row.colour) &&
    row.qty <= stock(row)
  );
}
function getBasket() {
  try {
    const rows = JSON.parse(sessionStorage.getItem(key) || "[]");
    return Array.isArray(rows) ? rows.filter(valid) : [];
  } catch {
    return [];
  }
}
function save(rows) {
  try {
    sessionStorage.setItem(key, JSON.stringify(rows));
    return true;
  } catch {
    alert(
      "Browser storage is unavailable. Open the demo in a normal browser tab to save your selection.",
    );
    return false;
  }
}
const add = brand.querySelector("[data-add]");
add?.addEventListener("submit", (e) => {
  e.preventDefault();
  const values = new FormData(add);
  const row = {
    id: add.dataset.id,
    qty: Number(values.get("qty") || 1),
    size: values.get("size"),
    colour: values.get("colour"),
  };
  if (!valid(row)) return;
  const rows = getBasket();
  const same = rows.find(
    (r) => r.id === row.id && r.size === row.size && r.colour === row.colour,
  );
  if (same) {
    if (same.qty + row.qty > stock(row)) {
      alert(
        "That quantity exceeds the sample availability. Change the quantity in your basket.",
      );
      return;
    }
    same.qty += row.qty;
  } else rows.push(row);
  if (save(rows)) location.assign(base + "/" + (isBox ? "rfq" : "bag"));
});
const basket = brand.querySelector("[data-basket]");
function renderBasket() {
  const rows = getBasket();
  let total = 0;
  basket.innerHTML =
    rows
      .map((r, i) => {
        const item = items.find((o) => o.id === r.id);
        const discount = isBox
          ? r.qty >= 5000
            ? 0.22
            : r.qty >= 1000
              ? 0.12
              : 0
          : 0;
        const unit = Math.round(item.price * (1 - discount) * 100) / 100;
        total += Math.round(unit * r.qty * 100) / 100;
        return `<div class="basket-line"><b>${esc(item.label)}<small>${isBox ? "Unprinted kraft" : esc(r.size) + " · " + esc(r.colour)}</small></b><label>Quantity<input data-qty="${i}" type="number" min="${isBox ? 250 : 1}" max="${stock(r)}" step="${isBox ? 250 : 1}" value="${r.qty}" required></label><span>${price(unit * r.qty)}<small>${discount ? Math.round(discount * 100) + "% volume break" : ""}</small></span><button type="button" data-remove="${i}">Remove</button></div>`;
      })
      .join("") +
    (rows.length
      ? `<p class="basket-total">${isBox ? "Estimated goods total" : "Bag total"} · ${price(total)}</p>` +
        (isBox
          ? ""
          : '<button type="button" data-receipt>Prepare sample order</button>')
      : "<p>Your " + (isBox ? "RFQ basket" : "bag") + " is empty.</p>");
}
if (basket) {
  renderBasket();
  basket.onchange = (e) => {
    if (!e.target.matches("[data-qty]")) return;
    const rows = getBasket();
    const i = Number(e.target.dataset.qty);
    if (!rows[i] || !e.target.reportValidity()) return;
    rows[i].qty = Number(e.target.value);
    if (save(rows)) renderBasket();
  };
  basket.onclick = (e) => {
    const rm = e.target.closest("[data-remove]");
    if (rm) {
      const rows = getBasket();
      rows.splice(Number(rm.dataset.remove), 1);
      if (save(rows)) renderBasket();
    }
    if (
      e.target.closest("[data-receipt]") &&
      [...basket.querySelectorAll("input")].every((i) => i.reportValidity())
    ) {
      basket.querySelector("[data-receipt]").remove();
      basket.insertAdjacentHTML(
        "beforeend",
        '<p role="status">Sample order prepared in this tab. No payment is due.</p>',
      );
    }
  };
}
const quiz = brand.querySelector("[data-quiz]");
if (quiz) {
  const status = quiz.querySelector("[role=status]");
  quiz.onsubmit = (e) => {
    e.preventDefault();
    status.textContent =
      new FormData(quiz).get("answer") === quiz.dataset.quiz
        ? "Correct. " + status.dataset.explanation
        : "Give it another try. " + status.dataset.explanation;
  };
  quiz.onreset = () => (status.textContent = "");
}
const zoom = brand.querySelector("[data-inspection] input");
if (zoom) {
  const overlay = brand.querySelector(".finish-overlay");
  const update = () =>
    (overlay.style.clipPath =
      "inset(0 " + (100 - Number(zoom.value)) + "% 0 0)");
  zoom.oninput = update;
  brand.querySelectorAll("[data-finish]").forEach(
    (b) =>
      (b.onclick = () => {
        zoom.value = b.dataset.finish;
        update();
      }),
  );
  update();
}
brand.querySelectorAll("[data-print]").forEach(
  (b) =>
    (b.onclick = () => {
      if ([...brand.querySelectorAll("input")].every((i) => i.reportValidity()))
        window.print();
    }),
);
if (brand.querySelector(".next-photo"))
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") brand.querySelector(".next-photo").click();
    if (e.key === "ArrowLeft") brand.querySelector(".prev-photo").click();
  });
const arrive = brand.querySelector("[name=checkin]"),
  depart = brand.querySelector("[name=checkout]");
if (arrive && depart)
  arrive.onchange = () => {
    if (!arrive.value) return;
    const d = new Date(arrive.value + "T12:00:00Z");
    d.setUTCDate(d.getUTCDate() + 1);
    depart.min = d.toISOString().slice(0, 10);
    if (depart.value < depart.min) depart.value = depart.min;
  };
const register = brand.querySelector("[data-register]");
if (register) {
  const invoices = billingRecords().filter(
    (r) =>
      r &&
      Number.isInteger(r.id) &&
      Number.isInteger(r.customer) &&
      r.customer >= 0 &&
      r.customer <= 2 &&
      ["INR", "USD", "GBP"].includes(r.currency) &&
      Number.isInteger(r.discount) &&
      Array.isArray(r.items) &&
      r.items.every(
        (i) =>
          Number.isInteger(i.product) &&
          i.product >= 0 &&
          i.product < 4 &&
          Number.isInteger(i.qty) &&
          i.qty > 0,
      ),
  );
  const totals = {};
  for (const r of invoices)
    totals[r.currency] = (totals[r.currency] || 0) + invoiceValue(r);
  register.innerHTML = invoices.length
    ? '<div class="invoice-summary">' +
      Object.entries(totals)
        .map(
          ([currency, n]) =>
            "<span>Issued total · " +
            currency +
            "<strong>" +
            new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency,
            }).format(n) +
            "</strong></span>",
        )
        .join("") +
      "</div>" +
      invoices
        .slice()
        .reverse()
        .map(
          (r) =>
            `<a href="${base}/request?invoice=${r.id}" class="menu-line"><b>LD-${String(r.id).padStart(4, "0")}</b><span>${["Fern House Studio", "Sunday Goods", "Mira & Co."][r.customer]}</span><small>${new Intl.NumberFormat("en-IN", { style: "currency", currency: r.currency }).format(invoiceValue(r))}</small></a>`,
        )
        .join("")
    : "<p>No invoices issued yet. Create an invoice to begin your register.</p>";
}

// ── Full brand sites: header, menu, reveals, day scroller, review rail, photo viewer, phone dock.
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
document.documentElement.classList.add("js");
if (!calm && "IntersectionObserver" in window) document.documentElement.classList.add("motion");
const svg = (d) => `<svg class="ic" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
const head = brand.querySelector("[data-site-head]");
if (head) {
  const dockBar = brand.querySelector(".dock");
  const onScroll = () => {
    head.classList.toggle("scrolled", scrollY > 40);
    dockBar?.classList.toggle("show", scrollY > innerHeight * 0.5 || !head.classList.contains("over"));
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  const btn = head.querySelector("[data-menu]");
  const setOpen = (open) => {
    head.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  };
  btn.addEventListener("click", () => setOpen(!head.classList.contains("open")));
  head.querySelectorAll(".site-nav a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  addEventListener("keydown", (e) => {
    if (e.key === "Escape" && head.classList.contains("open")) {
      setOpen(false);
      btn.focus();
    }
  });
  matchMedia("(min-width: 821px)").addEventListener("change", (m) => m.matches && setOpen(false));
}
if (document.documentElement.classList.contains("motion")) {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        io.unobserve(e.target);
      }),
    { rootMargin: "0px 0px -6% 0px" },
  );
  brand.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
}
const dayBlock = brand.querySelector("[data-day]");
if (dayBlock && "IntersectionObserver" in window) {
  const figs = [...dayBlock.querySelectorAll("[data-day-img]")];
  const steps = [...dayBlock.querySelectorAll("[data-day-step]")];
  // Earlier photos stay "on" underneath, so the next one wipes up over them and scrolling back wipes it away.
  const show = (n) => {
    figs.forEach((f, i) => f.classList.toggle("on", i <= n));
    steps.forEach((s, i) => s.classList.toggle("on", i === n));
  };
  show(0);
  const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && show(steps.indexOf(e.target))), {
    // On phones the photo sticks over the top half, so the active line sits in the visible lower part.
    rootMargin: matchMedia("(max-width: 900px)").matches ? "-66% 0px -24% 0px" : "-45% 0px -45% 0px",
  });
  steps.forEach((s) => io.observe(s));
}
brand.querySelectorAll("[data-rail]").forEach((rail) => {
  const box = rail.parentElement;
  const prev = box.querySelector("[data-rail-prev]"),
    next = box.querySelector("[data-rail-next]");
  const by = (dir) => rail.scrollBy({ left: dir * (rail.firstElementChild.getBoundingClientRect().width + 18), behavior: calm ? "auto" : "smooth" });
  prev?.addEventListener("click", () => by(-1));
  next?.addEventListener("click", () => by(1));
  const sync = () => {
    if (prev) prev.disabled = rail.scrollLeft < 8;
    if (next) next.disabled = rail.scrollLeft + rail.clientWidth > rail.scrollWidth - 8;
  };
  rail.addEventListener("scroll", sync, { passive: true });
  addEventListener("resize", sync);
  sync();
});
const galleries = brand.querySelectorAll("[data-gallery]");
if (galleries.length && window.HTMLDialogElement) {
  const lb = document.createElement("dialog");
  lb.className = "lightbox";
  lb.setAttribute("aria-label", "Photo viewer");
  lb.innerHTML = `<img alt=""><p aria-live="polite"></p><button type="button" data-lb-close aria-label="Close">${svg("M6 6l12 12M18 6 6 18")}</button><button type="button" data-lb-prev aria-label="Previous photo">${svg("m15 6-6 6 6 6")}</button><button type="button" data-lb-next aria-label="Next photo">${svg("m9 6 6 6-6 6")}</button>`;
  brand.append(lb);
  const big = lb.querySelector("img"),
    cap = lb.querySelector("p");
  let items = [],
    at = 0;
  const go = (n) => {
    at = (n + items.length) % items.length;
    const a = items[at];
    big.src = a.href;
    big.alt = a.querySelector("img")?.alt || "";
    cap.textContent = `${at + 1} / ${items.length}`;
  };
  galleries.forEach((g) =>
    g.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      e.preventDefault();
      items = [...g.querySelectorAll("a")];
      go(items.indexOf(a));
      lb.showModal();
    }),
  );
  lb.addEventListener("click", (e) => {
    if (e.target === lb) lb.close();
    if (e.target.closest("[data-lb-close]")) lb.close();
    if (e.target.closest("[data-lb-prev]")) go(at - 1);
    if (e.target.closest("[data-lb-next]")) go(at + 1);
  });
  lb.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") go(at + 1);
    if (e.key === "ArrowLeft") go(at - 1);
  });
}
// shortcut: brand sites use made-up contact details, which may belong to real people. Until a business supplies
// its own number, taps on WhatsApp, phone and email links show a note instead of reaching a stranger.
if (head) {
  const note = document.createElement("p");
  note.className = "toast";
  note.setAttribute("role", "status");
  brand.append(note);
  let timer;
  brand.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="https://wa.me/"], a[href^="tel:"], a[href^="mailto:"]');
    if (!a) return;
    e.preventDefault();
    const kind = a.href.startsWith("tel:") ? "Calling" : a.href.startsWith("mailto:") ? "Email" : "WhatsApp";
    note.textContent = `${kind} connects to the business's own number on the live site.`;
    note.classList.add("show");
    clearTimeout(timer);
    timer = setTimeout(() => note.classList.remove("show"), 3200);
  });
}
