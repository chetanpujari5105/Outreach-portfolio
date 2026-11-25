const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const price = (n) =>
  n == null ? "Custom quotation" : "₹" + Number(n).toLocaleString("en-IN");
const url = new URL(location.href);
const menu = $(".ff-menu");
function setMenu(open) {
  menu.setAttribute("aria-expanded", String(open));
  menu.textContent = open ? "Close" : "Menu";
  $("#ff-nav").classList.toggle("open", open);
}
menu.addEventListener("click", () =>
  setMenu(menu.getAttribute("aria-expanded") !== "true"),
);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menu.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    menu.focus();
  }
});
const filters = $("[data-filter]");
if (filters) {
  function display(sync) {
    const query = filters.elements.q.value.trim().toLowerCase(),
      category = filters.elements.category.value;
    let count = 0;
    $$("[data-item]").forEach((item) => {
      item.hidden = !!(
        (category && item.dataset.category !== category) ||
        !item.dataset.search.includes(query)
      );
      if (!item.hidden) count++;
    });
    $("[data-count]").textContent =
      count +
      " " +
      (url.pathname.endsWith("journal")
        ? count === 1
          ? "article"
          : "articles"
        : count === 1
          ? "project"
          : "projects");
    $("[data-empty]").hidden = count > 0;
    if (sync) {
      const next = new URL(location.href);
      for (const [k, v] of [
        ["q", filters.elements.q.value.trim()],
        ["category", category],
      ]) {
        if (v) next.searchParams.set(k, v);
        else next.searchParams.delete(k);
      }
      if (next.href !== location.href) history[sync + "State"]({}, "", next);
    }
  }
  function read() {
    const u = new URL(location.href);
    filters.elements.q.value = u.searchParams.get("q") || "";
    filters.elements.category.value = u.searchParams.get("category") || "";
    if (filters.elements.category.selectedIndex < 0)
      filters.elements.category.selectedIndex = 0;
    display();
  }
  filters.addEventListener("submit", (e) => {
    e.preventDefault();
    display("push");
  });
  filters.elements.q.addEventListener("input", () => display("replace"));
  filters.elements.category.addEventListener("change", () => display("push"));
  window.addEventListener("popstate", read);
  $("[data-reset]").addEventListener("click", (e) => {
    e.preventDefault();
    filters.elements.q.value = "";
    filters.elements.category.value = "";
    display("push");
  });
  read();
}
const gallery = $("[data-gallery]");
if (gallery) {
  const dialog = $(".ff-lightbox"),
    prints = $$("[data-print-index]", gallery),
    stage = $(".ff-stage", dialog),
    img = $("img", stage),
    zoom = $("[data-zoom]", dialog);
  let index = 0,
    opener,
    startX,
    startY;
  function setZoom(on) {
    stage.classList.toggle("zoom", on);
    zoom.setAttribute("aria-pressed", String(on));
    zoom.textContent = on ? "Fit image" : "Zoom";
  }
  function show(i) {
    index = (i + prints.length) % prints.length;
    const current = prints[index],
      alt = $("img", current).alt;
    setZoom(false);
    $("[data-loading]").textContent = "Loading photograph…";
    img.onload = () => ($("[data-loading]").textContent = "");
    img.onerror = () =>
      ($("[data-loading]").textContent = "This photograph could not load.");
    img.alt = alt;
    img.src = current.href;
    if (img.complete && img.naturalWidth) $("[data-loading]").textContent = "";
    $("[data-index]").textContent = index + 1 + " / " + prints.length;
    $("[data-caption]").textContent = alt;
    $$("[data-thumb]").forEach((b, j) =>
      b.setAttribute("aria-pressed", String(j === index)),
    );
    new Image().src = prints[(index + 1) % prints.length].href;
  }
  function open(i) {
    opener = prints[i];
    dialog.showModal();
    document.body.classList.add("ff-locked");
    show(i);
    $("[data-close]").focus();
  }
  prints.forEach((p, i) =>
    p.addEventListener("click", (e) => {
      e.preventDefault();
      open(i);
    }),
  );
  $("[data-close]").onclick = () => dialog.close();
  dialog.addEventListener("close", () => {
    document.body.classList.remove("ff-locked");
    opener?.focus({ preventScroll: true });
  });
  $("[data-prev]").onclick = () => show(index - 1);
  $("[data-next]").onclick = () => show(index + 1);
  zoom.onclick = () => setZoom(zoom.getAttribute("aria-pressed") !== "true");
  dialog.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      show(index + (e.key === "ArrowLeft" ? -1 : 1));
    }
  });
  $$("[data-thumb]").forEach((b, i) => (b.onclick = () => show(i)));
  stage.addEventListener(
    "touchstart",
    (e) => {
      startX = e.changedTouches[0].clientX;
      startY = e.changedTouches[0].clientY;
    },
    { passive: true },
  );
  stage.addEventListener(
    "touchend",
    (e) => {
      const dx = e.changedTouches[0].clientX - startX,
        dy = e.changedTouches[0].clientY - startY;
      if (
        !stage.classList.contains("zoom") &&
        Math.abs(dx) > 45 &&
        Math.abs(dx) > Math.abs(dy)
      )
        show(index + (dx < 0 ? 1 : -1));
    },
    { passive: true },
  );
  if (Number(gallery.dataset.start) >= 0) open(Number(gallery.dataset.start));
}
async function copy(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      /* Use the selection fallback below. */
    }
  }
  const input = document.createElement("textarea");
  input.value = text;
  document.body.append(input);
  input.select();
  const ok = document.execCommand("copy");
  input.remove();
  if (!ok) throw Error("Copy unavailable");
}
for (const b of $$("[data-share],[data-copy-link]"))
  b.onclick = async () => {
    const status = $("[data-share-status]");
    try {
      if (b.hasAttribute("data-share") && navigator.share) {
        await navigator.share({ title: document.title, url: location.href });
        status.textContent = "Share sheet closed.";
      } else {
        await copy(location.href);
        status.textContent = "Link copied.";
      }
    } catch (e) {
      if (e.name !== "AbortError")
        status.textContent =
          "Copy the address from your browser to share this article.";
    }
  };
const data = $("#ff-rates");
if (data) setupRates(JSON.parse(data.textContent));
function setupRates({ services, packages, addons }) {
  const root = $("[data-pricing],[data-flow]"),
    svc = $("[name=service]", root),
    pkg = $("[name=package]", root);
  const current = () =>
    packages.find((p) => p.key === pkg?.value && p.category === svc.value);
  const extras = () =>
    $$("[name=addon]:checked:not(:disabled)", root)
      .map((el) => addons.find((a) => a.key === el.value))
      .filter(Boolean);
  const estimate = () =>
    current()?.price == null
      ? null
      : current().price + extras().reduce((sum, a) => sum + a.price, 0);
  function update() {
    const total = $("[data-total]", root);
    if (total) total.textContent = price(estimate());
    const incl = $("[data-inclusions]", root);
    if (incl)
      incl.textContent =
        current()?.inclusions.join(" · ") ||
        "Scope and pricing agreed to your brief.";
    const book = $("[data-book-link]", root);
    if (book) {
      const u = new URL(book.href);
      u.search = "";
      u.searchParams.set("service", svc.value);
      u.searchParams.set("package", pkg.value);
      extras().forEach((a) => u.searchParams.append("addon", a.key));
      book.href = u;
    }
  }
  function populate(preferred) {
    if (!pkg) return;
    const choices = packages.filter((p) => p.category === svc.value);
    pkg.replaceChildren(
      ...choices.map(
        (p) => new Option(p.title + " · " + price(p.price), p.key),
      ),
      new Option("Custom project", "custom"),
    );
    if (preferred === "custom" || choices.some((p) => p.key === preferred))
      pkg.value = preferred;
    $$("[data-for]", root).forEach((label) => {
      const active = label.dataset.for.split(" ").includes(svc.value),
        box = $("input", label);
      label.hidden = !active;
      box.disabled = !active;
      if (!active) box.checked = false;
    });
    const table = $("[data-comparison]", root);
    if (table) {
      table.replaceChildren(
        ...choices.map((p) => {
          const details = document.createElement("details"),
            summary = document.createElement("summary"),
            amount = document.createElement("b"),
            desc = document.createElement("p"),
            list = document.createElement("ul");
          summary.textContent = p.title + " ";
          amount.textContent = price(p.price);
          summary.append(amount);
          desc.textContent = p.description;
          p.inclusions.forEach((text) => {
            const li = document.createElement("li");
            li.textContent = text;
            list.append(li);
          });
          details.append(summary, desc, list);
          return details;
        }),
      );
    }
    update();
  }
  const legacy = {
    portrait: "portraits",
    event: "events",
    product: "products",
  }[url.searchParams.get("shoot")];
  if (legacy && services.some((s) => s.key === legacy)) svc.value = legacy;
  populate(url.searchParams.get("package"));
  $$("[name=addon]:not(:disabled)", root).forEach(
    (el) => (el.checked = url.searchParams.getAll("addon").includes(el.value)),
  );
  update();
  svc.onchange = () => {
    populate();
    if (root.hasAttribute("data-pricing")) {
      const next = new URL(location.href);
      next.searchParams.set("service", svc.value);
      next.searchParams.delete("package");
      history.replaceState({}, "", next);
    }
  };
  root.addEventListener("input", update);
  if (root.hasAttribute("data-flow"))
    setupFlow(root, { populate, update, estimate, extras, current, services });
}
function setupFlow(root, rates) {
  const form = $("form", root),
    steps = $$("[data-step]", form),
    progress = $$(".ff-progress li", root);
  const mode = root.dataset.flow,
    storageKey = "frame-field-brief-v1-" + mode;
  const review = steps.length - 2,
    done = steps.length - 1;
  const back = $("[data-back]", form),
    next = $("[data-continue]", form),
    feedback = $("[data-feedback]", form),
    error = $("[data-error]", form);
  let at = 0;
  const fields = () => $$("input[name],select[name],textarea[name]", form);
  function localDay() {
    const today = new Date();
    return [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");
  }
  function dependencies() {
    $$("[data-future]", form).forEach((el) => (el.min = localDay()));
    const loc = $("[data-location]", form);
    if (loc) {
      const visible = ["On location", "Both"].includes(
        form.elements.setting.value,
      );
      loc.hidden = !visible;
      const input = $("input", loc);
      input.disabled = !visible;
      input.required = visible;
    }
    rates.update();
  }
  function label(el) {
    return el.closest("label")?.firstChild.textContent.trim() || el.name;
  }
  function rows(step) {
    const rows = [];
    for (const el of $$(
      "input[name],select[name],textarea[name]",
      steps[step],
    )) {
      if (el.disabled || (el.type === "checkbox" && !el.checked)) continue;
      if (el.type === "checkbox") {
        rows.push([
          "Add-on",
          el.closest("label").querySelector("span").textContent,
        ]);
        continue;
      }
      if (!el.value.trim()) continue;
      rows.push([
        label(el),
        el.tagName === "SELECT"
          ? el.selectedOptions[0]?.textContent || el.value
          : el.value.trim(),
      ]);
    }
    return rows;
  }
  function writeReview() {
    const out = $("[data-review]", form);
    out.replaceChildren();
    for (let i = 0; i < review; i++) {
      const box = document.createElement("section"),
        title = document.createElement("h3"),
        edit = document.createElement("button"),
        dl = document.createElement("dl");
      title.textContent = progress[i].textContent;
      edit.type = "button";
      edit.textContent = "Edit " + title.textContent;
      edit.onclick = () => go(i);
      for (const [k, v] of rows(i)) {
        const dt = document.createElement("dt"),
          dd = document.createElement("dd");
        dt.textContent = k;
        dd.textContent = v;
        dl.append(dt, dd);
      }
      box.append(title, dl, edit);
      out.append(box);
    }
    if (mode === "book") {
      const cost = document.createElement("p");
      cost.textContent = "Illustrative estimate · " + price(rates.estimate());
      out.append(cost);
    }
  }
  function summary() {
    const lines = [
      "Frame & Field",
      mode === "quote"
        ? "Custom quotation brief"
        : mode === "book"
          ? "Shoot enquiry"
          : "Studio message",
      "Prepared locally. No message sent or date reserved.",
      "",
    ];
    for (let i = 0; i < review; i++) {
      lines.push(
        progress[i].textContent,
        ...rows(i).map(([k, v]) => k + " — " + v),
        "",
      );
    }
    if (mode === "book")
      lines.push(
        "Estimated total — " + price(rates.estimate()),
        "Illustrative INR estimate, subject to the final scope.",
      );
    return lines.join("\n");
  }
  function saved() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      const obj = JSON.parse(raw);
      if (
        obj?.version === 1 &&
        typeof obj.values === "object" &&
        obj.values &&
        Array.isArray(obj.addons)
      )
        return obj;
    } catch {
      /* Storage may be disabled by the visitor. */
    }
    return null;
  }
  function refreshSaved() {
    const exists = !!saved();
    $("[data-saved]", root).hidden = !exists || at !== 0;
    $$("[data-delete]", form).forEach((b) => (b.hidden = !exists));
  }
  function go(i, focus = true) {
    at = i;
    steps.forEach((step, j) => (step.hidden = j !== i));
    progress.forEach((li, j) => {
      if (j === i) li.setAttribute("aria-current", "step");
      else li.removeAttribute("aria-current");
    });
    back.hidden = i === 0;
    next.hidden = i === done;
    next.textContent =
      i === review
        ? "Prepare enquiry"
        : i === review - 1
          ? "Review enquiry"
          : "Continue";
    feedback.textContent = "";
    error.textContent = "";
    if (i === review) writeReview();
    refreshSaved();
    if (focus) $("h2", steps[at]).focus();
  }
  function valid(i) {
    dependencies();
    for (const el of $$("input,select,textarea", steps[i])) {
      if (el.disabled) continue;
      if (el.required && ["text", "textarea"].includes(el.type))
        el.setCustomValidity(
          el.value.trim() ? "" : "Please complete this field.",
        );
      if (!el.checkValidity()) {
        go(i, false);
        error.textContent = label(el) + " — " + el.validationMessage;
        el.setAttribute("aria-invalid", "true");
        el.focus();
        return false;
      }
    }
    return true;
  }
  form.addEventListener("input", (e) => {
    e.target.removeAttribute("aria-invalid");
    e.target.setCustomValidity?.("");
    error.textContent = "";
    dependencies();
  });
  form.addEventListener("change", dependencies);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (at === done) return;
    if (at < review && !valid(at)) return;
    if (at === review) {
      for (let i = 0; i < review; i++) if (!valid(i)) return;
    }
    go(at + 1);
  });
  back.onclick = () => go(Math.max(0, at - 1));
  $("[data-copy]", form).onclick = async () => {
    try {
      await copy(summary());
      feedback.textContent = "Brief copied.";
    } catch {
      feedback.textContent =
        "Clipboard unavailable. Download the brief instead.";
    }
  };
  $("[data-download]", form).onclick = () => {
    const link = document.createElement("a"),
      objectUrl = URL.createObjectURL(
        new Blob([summary()], { type: "text/plain;charset=utf-8" }),
      );
    link.href = objectUrl;
    link.download = "frame-field-" + mode + "-brief.txt";
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    feedback.textContent = "Download prepared.";
  };
  $("[data-save]", form).onclick = () => {
    const values = Object.fromEntries(
      fields()
        .filter((el) => !el.disabled && el.name !== "addon")
        .map((el) => [el.name, el.value]),
    );
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          version: 1,
          values,
          addons: rates.extras().map((a) => a.key),
        }),
      );
      feedback.textContent =
        "A copy including contact details is saved on this device.";
    } catch {
      feedback.textContent =
        "This browser could not save the brief. You can still download it.";
    }
    refreshSaved();
  };
  $$("[data-delete]", root).forEach(
    (b) =>
      (b.onclick = () => {
        try {
          localStorage.removeItem(storageKey);
          feedback.textContent = "Saved copy deleted from this device.";
        } catch {
          feedback.textContent = "This browser could not remove the copy.";
        }
        refreshSaved();
      }),
  );
  $("[data-restore]", root).onclick = () => {
    const copy = saved();
    if (!copy) return;
    if (rates.services.some((s) => s.key === copy.values.service))
      form.elements.service.value = copy.values.service;
    rates.populate(copy.values.package);
    fields().forEach((el) => {
      if (el.name === "addon") {
        el.checked = !el.disabled && copy.addons.includes(el.value);
      } else if (
        typeof copy.values[el.name] === "string" &&
        !["service", "package"].includes(el.name)
      )
        el.value = copy.values[el.name];
    });
    dependencies();
    go(review);
  };
  $("[data-new]", form).onclick = () => {
    form.reset();
    rates.populate();
    fields().forEach((el) => el.removeAttribute("aria-invalid"));
    dependencies();
    go(0);
  };
  dependencies();
  go(0, false);
}
