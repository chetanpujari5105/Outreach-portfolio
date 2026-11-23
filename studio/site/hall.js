// Hall Eleven live estimate: the same sums as the booking flow (venue hire + menu × guests + add-ons).
const form = document.querySelector("[data-est]");
if (form) {
  const inr = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
  const range = form.querySelector('input[name="guests"]');
  const out = form.querySelector("[data-guests-out]");
  const note = form.querySelector("[data-cap-note]");
  const picked = (name) => form.querySelector(`input[name="${name}"]:checked`);
  const label = (input) => input.nextElementSibling.textContent.split(" · ")[0];
  function update() {
    const setup = picked("setup");
    const cap = Number(setup.dataset.cap);
    range.max = cap;
    if (Number(range.value) > cap) range.value = cap;
    const guests = Number(range.value);
    const occasion = picked("occasion"), menu = picked("menu");
    const lines = [["Venue hire · " + label(occasion), Number(occasion.dataset.price)], [`${label(menu)} menu × ${guests}`, Number(menu.dataset.price) * guests]];
    form.querySelectorAll('input[name="addons"]:checked').forEach((a) => lines.push([label(a), Number(a.dataset.price)]));
    const total = lines.reduce((sum, l) => sum + l[1], 0);
    out.value = guests;
    note.textContent = `${label(setup)} holds up to ${cap}`;
    form.querySelector("[data-total]").textContent = inr(total);
    form.querySelector("[data-per]").textContent = inr(Math.round(total / guests));
    form.querySelector("[data-lines]").innerHTML = lines.map(([k, v]) => `<div><dt>${k}</dt><dd>${inr(v)}</dd></div>`).join("");
    range.style.setProperty("--fill", ((guests - Number(range.min)) / (cap - Number(range.min))) * 100 + "%");
  }
  form.addEventListener("input", update);
  update();
}
