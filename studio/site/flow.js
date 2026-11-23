// Shared step-by-step engine for the industry demos. Each kit in kits.js is data plus a few
// pure functions; this file owns rendering, validation, storage and the owner view.
import { money, button, next, todayAt, dayOffset, dateText, readRows, saveRows, setView, wire } from "./demos.js";
import { kits } from "./kits.js";

const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const fieldsOf = (kit) => kit.steps.flatMap((s) => s.fields);
const optionsOf = (f, v) => (typeof f.options === "function" ? f.options(v) : f.options) || [];
const maxOf = (f, v) => (typeof f.max === "function" ? f.max(v) : f.max);

export function mountKit(root, slug) {
  const kit = kits[slug];
  if (!kit) return;
  const fmt = (n) => money(n, kit.currency, kit.locale);
  const today = () => todayAt(kit.zone);
  const h = {
    money: fmt,
    esc,
    date: (iso) => dateText(iso, kit.locale, { weekday: "short", day: "numeric", month: "short" }),
    opt: (name, v) => optionsOf(fieldsOf(kit).find((f) => f.name === name), v).find((o) => o.id === v[name]),
    opts: (name, v) => optionsOf(fieldsOf(kit).find((f) => f.name === name), v).filter((o) => (v[name] || []).includes(o.id)),
    nights: (a, b) => Math.round((new Date(b + "T12:00:00Z") - new Date(a + "T12:00:00Z")) / 864e5),
  };
  const dateMin = (f, v) => (f.after && v[f.after] ? dayOffset(v[f.after], 1) : dayOffset(today(), f.minDays ?? 1));
  const dateMax = (f, v) => (f.after && v[f.after] ? dayOffset(v[f.after], f.maxSpan ?? 30) : dayOffset(today(), f.maxDays ?? 120));

  function defaults() {
    const v = {};
    for (const f of fieldsOf(kit)) {
      if (f.type === "cards" || f.type === "chips") v[f.name] = f.multi ? [] : f.empty ? "" : optionsOf(f, v).find((o) => !o.disabled)?.id ?? "";
      if (f.type === "count") v[f.name] = f.start ?? f.min;
      if (f.type === "date") {
        let d = dayOffset(dateMin(f, v), f.offset ?? 0);
        // never default to a closed day (Sundays, weekends)
        for (let i = 0; f.days && i < 7 && !f.days.includes(new Date(d + "T12:00:00Z").getUTCDay()); i++) d = dayOffset(d, 1);
        v[f.name] = d;
      }
      if (f.type === "text" || f.type === "select") v[f.name] = f.type === "select" ? f.options[0].id : "";
      if (f.type === "check") v[f.name] = false;
    }
    return v;
  }

  // One validator serves live input, the Continue button and rows read back from storage.
  function problem(f, v, stored = false) {
    const x = v[f.name];
    if (f.type === "cards" || f.type === "chips") {
      const ids = optionsOf(f, v).filter((o) => stored || !o.disabled).map((o) => o.id);
      if (f.multi) return Array.isArray(x) && x.every((i) => ids.includes(i)) && (!f.required || x.length) ? "" : f.error || `Choose at least one ${f.label.toLowerCase()}.`;
      if (!f.required && x === "") return "";
      return ids.includes(x) ? "" : f.error || `Choose a ${f.label.toLowerCase()}.`;
    }
    if (f.type === "count") {
      const max = maxOf(f, v);
      return Number.isInteger(x) && x >= f.min && x <= max ? "" : `${f.label} must be between ${f.min} and ${max}.`;
    }
    if (f.type === "date") {
      if (typeof x !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(x)) return `Choose a ${f.label.toLowerCase()}.`;
      if (f.after && x <= v[f.after]) return `${f.label} must be after ${fieldsOf(kit).find((g) => g.name === f.after).label.toLowerCase()}.`;
      if (!stored && (x < dateMin(f, v) || x > dateMax(f, v))) return `Choose a ${f.label.toLowerCase()} between ${h.date(dateMin(f, v))} and ${h.date(dateMax(f, v))}.`;
      if (f.days && !f.days.includes(new Date(x + "T12:00:00Z").getUTCDay())) return f.dayError;
      return "";
    }
    if (f.type === "select") return f.options.some((o) => o.id === x) ? "" : `Choose a ${f.label.toLowerCase()}.`;
    if (f.type === "text") {
      if (typeof x !== "string" || x.length > (f.max ?? 300)) return `${f.label} is too long.`;
      if (f.required && !x.trim()) return `${f.label} is required.`;
      if (f.pattern && x.trim() && !new RegExp(f.pattern).test(x.trim())) return f.patternError;
      return "";
    }
    if (f.type === "check") return typeof x === "boolean" && (!f.required || x) ? "" : f.error;
    return "";
  }
  const stepProblem = (i, v) => {
    for (const f of kit.steps[i].fields) {
      const p = problem(f, v);
      if (p) return { field: f.name, message: p };
    }
    const p = kit.check?.(v, i, h);
    return p ? { field: "", message: p } : null;
  };
  // Stored rows come from sessionStorage, so anything that throws while checking one drops it.
  const validRow = (r) => {
    try {
      return Boolean(r && Number.isInteger(r.id) && r.values && typeof r.values === "object" && fieldsOf(kit).every((f) => !problem(f, r.values, true)) && !kit.check?.(r.values, kit.steps.length, h) && kit.summary(r.values, h) && kit.rowTitle(r.values, h) && (!kit.estimate || kit.estimate(r.values, h)));
    } catch {
      return false;
    }
  };

  let rows = readRows(kit.key).filter(validRow);
  let values = defaults(),
    step = 0,
    view = "flow",
    receipt = null,
    error = null;
  const incoming = new URLSearchParams(location.search);
  for (const f of fieldsOf(kit)) {
    const raw = incoming.get(f.name);
    if (raw === null) continue;
    const value = f.type === "count" ? Number(raw) : raw;
    const candidate = { ...values, [f.name]: value };
    if (!problem(f, candidate)) values[f.name] = value;
  }
  if (slug === "northline" && incoming.has("agenda"))
    values.question = incoming.getAll("agenda").join("; ").slice(0, 250);
  const filters = {};

  function card(f, o) {
    const on = f.multi ? values[f.name].includes(o.id) : values[f.name] === o.id;
    const tag = filters[f.name];
    if (tag && tag !== "All" && !(o.tags || []).includes(tag)) return "";
    return `<button type="button" class="kt-card${o.img ? "" : " kt-card-plain"}" data-action="pick" data-name="${f.name}" data-id="${o.id}" aria-pressed="${on}" ${o.disabled ? "disabled" : ""}>${o.img ? `<img src="/assets/${o.img}.webp" alt="" width="640" height="${f.tall ? 800 : 427}" loading="lazy">` : ""}<span class="kt-card-body"><span class="kt-card-top"><strong>${o.label}</strong>${o.price != null ? `<span class="kt-price">${o.priceText ?? fmt(o.price)}${o.unit ? `<small>${o.unit}</small>` : ""}</span>` : ""}</span>${o.detail ? `<small>${o.detail}</small>` : ""}${o.note ? `<em class="kt-card-note">${o.note}</em>` : ""}</span></button>`;
  }
  function field(f) {
    const id = "kt-" + f.name;
    const hint = f.hint ? `<small class="kt-hint" id="${id}-hint">${typeof f.hint === "function" ? f.hint(values, h) : f.hint}</small>` : "";
    const bad = error?.field === f.name ? ' aria-invalid="true"' : "";
    if (f.type === "cards") {
      const opts = optionsOf(f, values);
      const chips = f.filters ? `<div class="kt-filters" role="group" aria-label="Filter ${f.label.toLowerCase()}">${f.filters.map((t) => button("filter", t, "kt-filter", `data-name="${f.name}" data-tag="${t}" aria-pressed="${(filters[f.name] || "All") === t}"`)).join("")}</div>` : "";
      return `<fieldset class="kt-group"${bad}><legend>${f.label}</legend>${hint}${chips}<div class="kt-cards kt-cols-${f.cols || 3}">${opts.map((o) => card(f, o)).join("") || "<p>No options match.</p>"}</div></fieldset>`;
    }
    if (f.type === "chips") return `<fieldset class="kt-group"${bad}><legend>${f.label}</legend>${hint}<div class="kt-chips">${optionsOf(f, values).map((o) => button("pick", `${o.label}${o.price != null ? ` <small>${o.priceText ?? "+" + fmt(o.price)}</small>` : ""}`, "kt-chip", `data-name="${f.name}" data-id="${o.id}" aria-pressed="${f.multi ? values[f.name].includes(o.id) : values[f.name] === o.id}" ${o.disabled ? "disabled" : ""}`)).join("")}</div></fieldset>`;
    if (f.type === "count") return `<div class="kt-field kt-count"><span class="kt-label" id="${id}-l">${f.label}</span>${hint}<div class="kt-stepper">${button("dec", "−", "kt-step", `data-name="${f.name}" aria-label="Fewer ${f.label.toLowerCase()}"`)}<input id="${id}" type="number" inputmode="numeric" min="${f.min}" max="${maxOf(f, values)}" step="1" value="${values[f.name]}" data-name="${f.name}" aria-labelledby="${id}-l"${bad}>${button("inc", "+", "kt-step", `data-name="${f.name}" aria-label="More ${f.label.toLowerCase()}"`)}</div></div>`;
    if (f.type === "date") return `<label class="kt-field" for="${id}"><span class="kt-label">${f.label}</span>${hint}<input id="${id}" type="date" min="${dateMin(f, values)}" max="${dateMax(f, values)}" value="${values[f.name]}" data-name="${f.name}" required${bad}></label>`;
    if (f.type === "select") return `<label class="kt-field" for="${id}"><span class="kt-label">${f.label}</span>${hint}<select id="${id}" data-name="${f.name}">${f.options.map((o) => `<option value="${o.id}" ${values[f.name] === o.id ? "selected" : ""}>${o.label}</option>`).join("")}</select></label>`;
    if (f.type === "text") {
      const tag = f.long ? "textarea" : "input";
      return `<label class="kt-field${f.long ? " kt-wide" : ""}" for="${id}"><span class="kt-label">${f.label}${f.required ? "" : " <small>(optional)</small>"}</span>${hint}<${tag} id="${id}" ${f.long ? 'rows="3"' : `type="${f.input || "text"}" value="${esc(values[f.name])}"`} maxlength="${f.max ?? 300}" data-name="${f.name}" ${f.placeholder ? `placeholder="${f.placeholder}"` : ""} ${f.autocomplete ? `autocomplete="${f.autocomplete}"` : ""}${bad}>${f.long ? esc(values[f.name]) + "</textarea>" : ""}</label>`;
    }
    if (f.type === "check") return `<label class="kt-check kt-wide"><input type="checkbox" data-name="${f.name}" ${values[f.name] ? "checked" : ""}${bad}><span>${f.label}</span></label>`;
    return "";
  }
  function estimateHTML(v) {
    const e = kit.estimate?.(v, h);
    if (!e) return "";
    return `<dl class="dm-facts kt-lines">${e.lines.map(([k, n]) => `<div><dt>${k}</dt><dd>${typeof n === "number" ? (n < 0 ? "−" + fmt(-n) : fmt(n)) : n}</dd></div>`).join("")}</dl><div class="dm-total kt-total"><span>${e.totalLabel || "Estimated total"}</span><strong>${fmt(e.total)}</strong></div>${e.note ? `<p class="kt-note">${e.note}</p>` : ""}`;
  }
  const factsHTML = (v) => `<dl class="dm-facts kt-summary">${kit.summary(v, h).map(([k, x]) => `<div><dt>${k}</dt><dd>${x}</dd></div>`).join("")}</dl>`;

  function panel() {
    if (view === "owner") {
      return `<p class="dm-kicker">Owner view</p><h2 data-focus tabindex="-1">${kit.owner}</h2>${rows.length ? [...rows].reverse().map((r) => `<section class="dm-record kt-record"><strong>${kit.rowTitle(r.values, h)} <small>#${String(r.id).padStart(3, "0")}</small></strong>${factsHTML(r.values)}${kit.estimate ? `<p class="kt-record-total">${fmt(kit.estimate(r.values, h).total)}</p>` : ""}</section>`).join("") : `<p class="kt-empty">${kit.ownerEmpty || "Requests sent in this demo appear here."}</p>`}${button("back-flow", "Back to the demo", "dm-primary")}`;
    }
    if (view === "receipt") {
      return `<p class="dm-kicker">${kit.receipt.kicker}</p><h2 data-focus tabindex="-1">${kit.receipt.title}</h2><p>${kit.receipt.text}</p>${factsHTML(receipt.values)}${estimateHTML(receipt.values)}<div class="dm-controls">${button("new", kit.receipt.again || "Start again", "dm-link")}${button("owner", "See the owner view " + next, "dm-primary")}</div>`;
    }
    const total = kit.steps.length + 1;
    const labels = [...kit.steps.map((s) => s.label), "Review"];
    const progress = `<ol class="kt-steps" aria-label="Progress">${labels.map((l, i) => `<li ${i === step ? 'aria-current="step"' : ""} class="${i < step ? "kt-done" : ""}"><span>${String(i + 1).padStart(2, "0")}</span>${l}</li>`).join("")}</ol>`;
    const err = `<p class="kt-error" role="alert" data-error>${error ? error.message : ""}</p>`;
    if (step === kit.steps.length) {
      return `${progress}<h2 data-focus tabindex="-1">${kit.reviewTitle || "Review your request"}</h2>${factsHTML(values)}${estimateHTML(values)}${err}<div class="dm-controls">${button("back", "← Back", "dm-link")}${button("send", (kit.sendLabel || "Send sample request") + " " + next, "dm-primary")}</div>`;
    }
    const s = kit.steps[step];
    return `${progress}<h2 data-focus tabindex="-1">${s.title}</h2>${s.intro ? `<p class="kt-intro">${s.intro}</p>` : ""}<div class="kt-fields">${s.fields.map(field).join("")}</div>${err}<div class="dm-controls">${step ? button("back", "← Back", "dm-link") : ""}${button("continue", `Continue ${next}`, "dm-primary")}<small class="kt-count-label">Step ${step + 1} of ${total}</small></div>`;
  }
  const side = () => (view === "flow" && step < kit.steps.length ? `<p class="dm-kicker">${kit.sideTitle || "Your estimate"}</p>${estimateHTML(values) || factsHTML(values)}` : kit.sideNote || "");

  function render(focus = true) {
    const hero = kit.hero;
    setView(
      root,
      `<div class="dm kt ${kit.cls}"><div class="dm-brandbar"><span class="dm-wordmark">${kit.wordmark || kit.brand}</span><span>${kit.place}</span></div><header class="kt-hero kt-hero-${hero.layout}"><img class="kt-hero-img" src="/assets/${hero.img}.webp" alt="${hero.alt}" width="1536" height="1024" fetchpriority="high"><div class="kt-hero-copy"><p class="dm-kicker">${hero.kicker}</p><h1>${hero.title}</h1><p>${hero.text}</p></div>${kit.facts ? `<ul class="kt-facts">${kit.facts.map(([a, b]) => `<li><b>${a}</b>${b}</li>`).join("")}</ul>` : ""}</header><div class="kt-body"><section class="kt-panel" aria-live="off">${panel()}</section><aside class="kt-side" data-side>${side()}</aside></div><footer class="dm-foot"><span>Studio demo · Fictional business, prices and times</span><div>${button("owner", `Owner view (${rows.length})`, "dm-link")}${button("reset", "Reset demo", "dm-link")}</div></footer></div>`,
      focus,
    );
  }
  function refresh() {
    const s = root.querySelector("[data-side]");
    if (s) s.innerHTML = side();
  }
  function rerenderPanel(name) {
    // Dependent fields (dates, capacity-limited counts, timetables) re-render; focus returns to the edited control.
    const active = document.activeElement?.dataset;
    const key = active ? [active.action, active.name, active.id, active.tag].join("|") : "";
    root.querySelector(".kt-panel").innerHTML = panel();
    refresh();
    const again = [...root.querySelectorAll(".kt-panel [data-name]")].find((el) => [el.dataset.action, el.dataset.name, el.dataset.id, el.dataset.tag].join("|") === key) || root.querySelector(`.kt-panel [data-name="${name}"]`);
    again?.focus({ preventScroll: true });
  }
  function setValue(name, value) {
    values[name] = value;
    // Clear selections that the change has made impossible (a full class, an over-capacity room).
    for (const f of fieldsOf(kit)) {
      if (f.name === name) continue;
      if ((f.type === "cards" || f.type === "chips") && typeof f.options === "function") {
        const ok = optionsOf(f, values).filter((o) => !o.disabled).map((o) => o.id);
        if (f.multi) values[f.name] = values[f.name].filter((i) => ok.includes(i));
        else if (values[f.name] && !ok.includes(values[f.name])) values[f.name] = f.empty ? "" : ok[0] ?? "";
      }
      if (f.type === "count") values[f.name] = Math.min(values[f.name], maxOf(f, values));
      if (f.type === "date" && f.after === name && values[f.name] <= value) values[f.name] = dayOffset(value, 1);
    }
    if (error) error = null;
  }

  wire(root, (action, el) => {
    const name = el.dataset.name;
    if (action === "pick") {
      const f = fieldsOf(kit).find((g) => g.name === name);
      const id = el.dataset.id;
      if (f.multi) setValue(name, values[name].includes(id) ? values[name].filter((i) => i !== id) : [...values[name], id]);
      else setValue(name, f.empty && values[name] === id ? "" : id);
      return rerenderPanel(name);
    }
    if (action === "filter") {
      filters[name] = el.dataset.tag;
      return rerenderPanel(name);
    }
    if (action === "inc" || action === "dec") {
      const f = fieldsOf(kit).find((g) => g.name === name);
      setValue(name, Math.max(f.min, Math.min(maxOf(f, values), values[name] + (action === "inc" ? 1 : -1) * (f.step || 1))));
      return rerenderPanel(name);
    }
    if (action === "continue") {
      // A typed value the browser rejects (0 guests, a blank date) never reached state, so check the controls too.
      const raw = [...root.querySelectorAll(".kt-panel input[data-name]")].find((i) => i.type !== "checkbox" && !i.validity.valid);
      const rf = raw && fieldsOf(kit).find((g) => g.name === raw.dataset.name);
      error = raw ? { field: rf.name, message: rf.type === "count" ? `${rf.label} must be between ${rf.min} and ${maxOf(rf, values)}.` : problem(rf, { ...values, [rf.name]: raw.value }) || `Check ${rf.label.toLowerCase()}.` } : stepProblem(step, values);
      if (error) {
        rerenderPanel(error.field);
        root.querySelector(`.kt-panel [data-name="${error.field}"]`)?.focus({ preventScroll: true });
        return;
      }
      step++;
    }
    if (action === "back") {
      error = null;
      step = Math.max(0, step - 1);
    }
    if (action === "send") {
      const bad = kit.steps.findIndex((_, i) => stepProblem(i, values));
      if (bad >= 0) {
        step = bad;
        error = stepProblem(bad, values);
      } else {
        receipt = { id: Math.max(0, ...rows.map((r) => r.id)) + 1, at: today(), values: structuredClone(values) };
        rows.push(receipt);
        saveRows(kit.key, rows);
        view = "receipt";
      }
    }
    if (action === "owner") view = "owner";
    if (action === "back-flow") view = receipt ? "receipt" : "flow";
    if (action === "new" || action === "reset") {
      values = defaults();
      step = 0;
      receipt = null;
      error = null;
      view = "flow";
      for (const k in filters) delete filters[k];
      if (action === "reset") {
        rows = [];
        saveRows(kit.key, rows);
      }
    }
    render();
    root.querySelector(".kt-body")?.scrollIntoView({ block: "nearest", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  });
  root.oninput = (e) => {
    const el = e.target;
    const name = el.dataset.name;
    if (!name) return;
    const f = fieldsOf(kit).find((g) => g.name === name);
    if (f.type === "count") {
      if (el.validity.valid && el.value !== "") setValue(name, el.valueAsNumber);
      return refresh();
    }
    if (f.type === "text") {
      values[name] = el.value;
      return refresh();
    }
  };
  root.onchange = (e) => {
    const el = e.target;
    const name = el.dataset.name;
    if (!name) return;
    const f = fieldsOf(kit).find((g) => g.name === name);
    if (f.type === "date" || f.type === "select") {
      if (f.type === "date" && !el.value) return;
      setValue(name, el.value);
      rerenderPanel(name);
    }
    if (f.type === "check") {
      setValue(name, el.checked);
      refresh();
    }
    if (f.type === "count" && !el.validity.valid) {
      error = { field: name, message: problem(f, { ...values, [name]: el.valueAsNumber }) || `Enter a whole number for ${f.label.toLowerCase()}.` };
      root.querySelector("[data-error]").textContent = error.message;
    }
  };
  render(false);
}
