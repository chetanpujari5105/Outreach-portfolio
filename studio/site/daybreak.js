// Daybreak Café interactions, loaded on /site/daybreak-cafe pages only.
// Menu search and filters, drink options that reprice, and the reservation flow (saved in this browser only).
const brand = document.querySelector(".brand");
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
const inr = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
const setQuery = (params) => {
  const u = new URL(location.href);
  for (const [k, v] of Object.entries(params)) v ? u.searchParams.set(k, v) : u.searchParams.delete(k);
  history.replaceState(null, "", u.pathname + u.search + u.hash);
};

// ── Menu: the server already rendered the ?q / ?diet state; this keeps it live as you type.
const tools = brand.querySelector("[data-menu-tools]");
if (tools) {
  const form = tools.querySelector("form");
  const input = form.querySelector("[name=q]");
  const dishes = [...brand.querySelectorAll("[data-dish]")];
  const cats = [...brand.querySelectorAll("[data-cat]")];
  const count = brand.querySelector("[data-menu-count]");
  const empty = brand.querySelector("[data-menu-empty]");
  const navLinks = [...tools.querySelectorAll(".cat-nav a")];
  const dietOk = (d, diet) => (diet === "veg" ? d === "veg" || d === "vegan" : diet === "vegan" ? d === "vegan" : true);
  const apply = () => {
    const q = input.value.trim().toLowerCase().slice(0, 40);
    const diet = form.querySelector("[name=diet]:checked")?.value || "";
    const terms = q.split(/\s+/).filter(Boolean);
    let shown = 0;
    for (const li of dishes) {
      const ok = dietOk(li.dataset.diet, diet) && terms.every((t) => li.dataset.text.includes(t));
      if (ok && li.hidden && !calm) li.classList.add("arrive");
      li.hidden = !ok;
      shown += ok;
    }
    cats.forEach((sec, i) => {
      const any = sec.querySelector("[data-dish]:not([hidden])");
      sec.hidden = !any;
      navLinks[i].parentElement.hidden = !any;
    });
    empty.hidden = shown > 0;
    count.textContent = q || diet ? `${shown} of ${dishes.length} items match` : "";
    setQuery({ q, diet });
  };
  form.addEventListener("input", apply);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    apply();
    input.blur();
  });
  brand.addEventListener("animationend", (e) => e.target.classList?.remove("arrive"));
  // "clear your search" in the empty state resets in place instead of reloading.
  empty.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    e.preventDefault();
    const u = new URL(a.href);
    input.value = u.searchParams.get("q") || "";
    form.querySelector("[name=diet][value='']").checked = true;
    apply();
    input.focus();
  });
  // Scrollspy for the category bar; the bar scrolls itself so the active section stays visible on phones.
  const nav = tools.querySelector(".cat-nav");
  const spy = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        navLinks.forEach((a) => a.classList.toggle("on", a.hash === "#" + en.target.id));
        const on = navLinks.find((a) => a.classList.contains("on"));
        if (on) nav.scrollTo({ left: on.offsetLeft - 24, behavior: calm ? "auto" : "smooth" });
      }),
    { rootMargin: "-35% 0px -60% 0px" },
  );
  cats.forEach((c) => spy.observe(c));
}

// ── Dish options: each choice carries its price change; the URL keeps non-default choices so the link is shareable.
const opts = brand.querySelector("[data-dish-opts]");
if (opts) {
  const out = brand.querySelector("[data-price]");
  const base = Number(out.dataset.base);
  const update = () => {
    let total = base;
    const params = {};
    for (const fs of opts.querySelectorAll("fieldset")) {
      const radios = [...fs.querySelectorAll("input")];
      const on = radios.find((r) => r.checked) || radios[0];
      total += Number(on.dataset.delta);
      params[on.name] = on === radios[0] ? "" : on.value;
    }
    out.textContent = inr(total);
    setQuery(params);
  };
  opts.addEventListener("change", update);
}

// ── Reservations & group enquiries
const book = brand.querySelector("[data-book]");
if (book) {
  const KEY = "daybreak-enquiries";
  const $ = (s, root = brand) => root.querySelector(s);
  const review = $("[data-review]"), done = $("[data-done]"), savedBox = $("[data-saved]");
  const f = (n) => book.elements[n];
  const istToday = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
  const addDays = (iso, n) => { const d = new Date(iso + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
  const nowMinutes = () => { const [h, m] = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date()).split(":").map(Number); return h * 60 + m; };
  const niceDate = (iso) => new Date(iso + "T12:00:00Z").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  const niceTime = (t) => { const [h, m] = t.split(":").map(Number); return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`; };
  const optText = (sel) => sel.options[sel.selectedIndex]?.text.replace(/\s*\(.*\)$/, "") || "";
  const today = istToday();
  f("date").min = today;
  f("date").max = addDays(today, 60);

  const limits = () => (f("type").value === "group" ? [6, 40] : [1, 8]);
  // Keep choices consistent instead of explaining rules in errors: the whole café is group-only and
  // always starts at 8 pm; other group tables are seated by 5 pm. Impossible times are simply disabled.
  const syncType = () => {
    const [min, max] = limits();
    f("guests").min = min;
    f("guests").max = max;
    const group = f("type").value === "group";
    const whole = f("seating").querySelector("[value=whole]");
    whole.disabled = !group;
    if (whole.disabled && whole.selected) f("seating").value = "any";
    const priv = f("seating").value === "whole";
    for (const o of f("time").options) {
      if (!o.value) continue;
      const [h, m] = o.value.split(":").map(Number);
      o.disabled = priv ? !o.hasAttribute("data-private") : o.hasAttribute("data-private") || (group && h * 60 + m > 17 * 60);
    }
    if (priv) f("time").value = "20:00";
    else if (f("time").selectedOptions[0]?.disabled) f("time").value = "";
  };
  syncType();

  const rules = {
    date: (v) => {
      if (!v) return "Choose a date.";
      if (!/^\d{4}-\d{2}-\d{2}$/.test(v) || Number.isNaN(Date.parse(v + "T12:00:00Z")) || new Date(v + "T12:00:00Z").toISOString().slice(0, 10) !== v) return "That date doesn't exist. Choose one from the calendar.";
      if (v < today) return "That date has passed. Choose today or a later date.";
      if (v > f("date").max) return "We take requests up to 60 days ahead.";
    },
    time: (v) => {
      if (!v) return "Choose a preferred time.";
      const [h, m] = v.split(":").map(Number);
      if (f("date").value === today && h * 60 + m < nowMinutes() + 60) return "For today, choose a time at least an hour from now, or call us for a walk-in table.";
      if (f("type").value === "group" && f("seating").value !== "whole" && h * 60 + m > 17 * 60) return "Group tables are seated by 5 pm. For an evening, choose “Whole café, private evening” under seating.";
      if (f("seating").value === "whole" && v !== "20:00") return "Private evenings start at 8 pm.";
      if (f("seating").value !== "whole" && v === "20:00") return "8 pm is for private evenings only. Choose an earlier time.";
    },
    guests: (v) => {
      const n = Number(v), [min, max] = limits();
      if (!v || !Number.isInteger(n)) return "Enter the number of guests as a whole number.";
      if (n < 1) return "At least one guest, please.";
      if (f("type").value === "table" && n > 8) return "For 9 or more guests, choose “A group or event” above.";
      if (n < min || n > max) return f("type").value === "group" ? "Group enquiries are for 6 to 40 guests. For fewer, choose “A table”." : `Tables are for ${min} to ${max} guests.`;
      const opt = f("seating").selectedOptions[0];
      if (n < Number(opt.dataset.min) || n > Number(opt.dataset.max)) return `${optText(f("seating"))} suits ${opt.dataset.min}–${opt.dataset.max} guests. Change the seating or the number of guests.`;
    },
    name: (v) => (v.trim().length < 2 ? "Enter your name." : /[<>{}]/.test(v) ? "Use letters, spaces and simple punctuation only." : undefined),
    phone: (v) => (/^(?:\+?91[\s-]?|0)?[6-9]\d{4}[\s-]?\d{5}$/.test(v.trim()) ? undefined : "Enter a 10-digit Indian mobile number, like 98200 12345."),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? undefined : "Enter an email address, like name@example.com."),
    notes: (v) => (v.length > 400 ? "Keep special requests under 400 characters." : undefined),
  };
  let tried = false;
  const check = (name) => {
    const msg = rules[name](f(name).value) || "";
    const wrap = $(`[data-field=${name}]`, book);
    wrap.classList.toggle("bad", !!msg);
    f(name).setAttribute("aria-invalid", String(!!msg));
    $(`#e-${name}`, book).textContent = msg;
    return !msg;
  };
  const checkAll = () => Object.keys(rules).map(check).every(Boolean);
  book.addEventListener("change", (e) => {
    if (e.target.name === "type" || e.target.name === "seating") syncType();
    if (tried) checkAll();
  });
  book.addEventListener("input", (e) => {
    if (e.target.name === "notes") $("[data-count-for=notes]", book).textContent = e.target.value.length;
    if (tried && rules[e.target.name]) check(e.target.name);
  });
  book.addEventListener("focusout", (e) => { if (rules[e.target.name] && e.target.value) check(e.target.name); });

  const values = () => ({
    type: f("type").value, date: f("date").value, time: f("time").value, guests: Number(f("guests").value),
    seating: f("seating").value, seatingLabel: optText(f("seating")), occasion: f("occasion").value, occasionLabel: optText(f("occasion")),
    name: f("name").value.trim(), phone: f("phone").value.trim(), email: f("email").value.trim(), notes: f("notes").value.trim(),
  });
  const rows = (v) => [
    ["Request", v.type === "group" ? "Group or event enquiry" : "Table reservation"],
    ["Date", niceDate(v.date)], ["Time", niceTime(v.time)], ["Guests", String(v.guests)],
    ["Seating", v.seatingLabel], ["Occasion", v.occasion ? v.occasionLabel : "None"],
    ["Name", v.name], ["Mobile", v.phone], ["Email", v.email], ["Requests", v.notes || "None"],
  ];
  const fill = (dl, v) => dl.replaceChildren(...rows(v).map(([k, val]) => { const d = document.createElement("div"), dt = document.createElement("dt"), dd = document.createElement("dd"); dt.textContent = k; dd.textContent = val; d.append(dt, dd); return d; }));
  const text = (v, ref) => `Daybreak Café: ${v.type === "group" ? "group enquiry" : "table request"} ${ref}\n` + rows(v).map(([k, val]) => `${k}: ${val}`).join("\n") + "\n\nSaved on this device from the Daybreak website. Not yet sent to the café and not a confirmed booking.";
  const store = {
    all() { try { const a = JSON.parse(localStorage.getItem(KEY) || "[]"); return Array.isArray(a) ? a.filter((x) => x && typeof x.ref === "string" && x.v && typeof x.v.date === "string" && typeof x.v.time === "string" && x.v.date >= today) : []; } catch { return []; } },
    save(list) { try { localStorage.setItem(KEY, JSON.stringify(list.slice(0, 10))); return true; } catch { return false; } },
  };
  const dots = (step) => brand.querySelectorAll("[data-step-dot]").forEach((li) => li.classList.toggle("on", li.dataset.stepDot === step));
  const show = (step) => {
    book.hidden = step !== "form";
    review.hidden = step !== "review";
    done.hidden = step !== "done";
    dots(step);
    const target = step === "form" ? book : step === "review" ? review : done;
    target.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" });
    if (step !== "form") target.focus({ preventScroll: true });
  };
  let current = null, editing = null;
  // After a delete the clicked button is gone; keep keyboard focus on the page instead of dropping it to <body>.
  const refocus = () => (!savedBox.hidden ? savedBox.querySelector("button") : !done.hidden ? done : !review.hidden ? review : f("date")).focus();

  book.addEventListener("submit", (e) => {
    e.preventDefault();
    tried = true;
    const err = $("[data-form-err]", book);
    if (!checkAll()) {
      const bad = book.querySelectorAll(".fld.bad").length;
      err.textContent = `Please fix ${bad === 1 ? "the highlighted field" : `the ${bad} highlighted fields`} before reviewing.`;
      book.querySelector(".fld.bad :is(input, select, textarea)")?.focus();
      return;
    }
    err.textContent = "";
    current = values();
    fill($("[data-summary]", review), current);
    show("review");
  });
  const finish = (rec) => {
    const t = text(rec.v, rec.ref);
    $("[data-ref]", done).textContent = "Reference " + rec.ref;
    fill($("[data-summary]", done), rec.v);
    $("[data-wa]", done).href = `https://wa.me/${$("[data-wa]", done).href.match(/wa\.me\/(\d+)/)[1]}?text=${encodeURIComponent(t)}`;
    $("[data-mail]", done).href = `mailto:${$("[data-mail]", done).href.slice(7).split("?")[0]}?subject=${encodeURIComponent("Table request " + rec.ref)}&body=${encodeURIComponent(t)}`;
    done.dataset.text = t;
    done.dataset.ref = rec.ref;
    $("[data-share-status]", done).textContent = "";
    show("done");
    renderSaved();
  };
  brand.addEventListener("click", async (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    const status = $("[data-share-status]", done);
    if (b.matches("[data-confirm]")) {
      const list = store.all();
      const ref = editing || "DB-" + Math.random().toString(36).slice(2, 7).toUpperCase();
      const rec = { ref, savedAt: new Date().toISOString(), v: current };
      const next = [rec, ...list.filter((x) => x.ref !== ref)];
      if (!store.save(next)) { $("[data-form-err]", book).textContent = "This browser blocked saving. Copy your details instead, or call us."; show("form"); return; }
      editing = ref;
      finish(rec);
    } else if (b.matches("[data-edit]")) {
      show("form");
      f("date").focus();
    } else if (b.matches("[data-new]")) {
      book.reset();
      editing = null;
      tried = false;
      book.querySelectorAll(".fld.bad").forEach((x) => x.classList.remove("bad"));
      book.querySelectorAll(".err").forEach((x) => (x.textContent = ""));
      syncType();
      show("form");
      f("date").focus();
    } else if (b.matches("[data-copy]")) {
      try { await navigator.clipboard.writeText(done.dataset.text); status.textContent = "Copied. Paste it into a message to the café."; }
      catch { status.textContent = "Copying isn't allowed here. Use Download instead."; }
    } else if (b.matches("[data-download]")) {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([done.dataset.text], { type: "text/plain" }));
      a.download = `daybreak-${done.dataset.ref}.txt`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      status.textContent = "Downloaded a text copy of your request.";
    } else if (b.dataset.open) {
      const rec = store.all().find((x) => x.ref === b.dataset.open);
      if (!rec) return;
      load(rec.v);
      current = rec.v;
      editing = rec.ref;
      finish(rec);
    } else if (b.matches("[data-clear]")) {
      try { localStorage.removeItem(KEY); } catch {}
      editing = null;
      renderSaved();
      if (!done.hidden) show("form");
      refocus();
    } else if (b.dataset.remove) {
      store.save(store.all().filter((x) => x.ref !== b.dataset.remove));
      if (editing === b.dataset.remove) editing = null;
      renderSaved();
      refocus();
    }
  });
  const load = (v) => {
    for (const k of ["date", "time", "guests", "seating", "occasion", "name", "phone", "email", "notes"]) f(k).value = v[k] ?? "";
    book.querySelector(`[name=type][value=${v.type === "group" ? "group" : "table"}]`).checked = true;
    syncType();
  };
  const renderSaved = () => {
    const list = store.all();
    savedBox.hidden = !list.length;
    $("[data-saved-list]", savedBox).replaceChildren(
      ...list.map((r) => {
        const li = document.createElement("li"), span = document.createElement("span"), actions = document.createElement("span");
        span.textContent = `${r.ref} · ${niceDate(r.v.date)}, ${niceTime(r.v.time)} · ${r.v.guests} ${r.v.guests === 1 ? "guest" : "guests"}`;
        const view = Object.assign(document.createElement("button"), { type: "button", textContent: "View" });
        const del = Object.assign(document.createElement("button"), { type: "button", textContent: "Delete" });
        view.dataset.open = r.ref;
        del.dataset.remove = r.ref;
        del.setAttribute("aria-label", "Delete saved request " + r.ref);
        actions.append(view, " · ", del);
        li.append(span, actions);
        return li;
      }),
    );
  };
  store.save(store.all());
  if (!store.all().length) try { localStorage.removeItem(KEY); } catch {}
  renderSaved();
}
