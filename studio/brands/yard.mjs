// Kinetic Yard: a full small-group strength gym website. Every person, review, number and price here is fictional.
import { rupees, icon, whatsapp, stars, faq, siteHeader, siteFooter, dock } from "./common.mjs";
import { todayAt, dayOffset, dateText } from "../site/demos.js";

const WA = whatsapp("+91 99999 07320", "Hi Kinetic Yard, I'd like to try a class.");
const coaches = {
  dev: { goal: "strength", name: "Dev Malhotra", img: "yard-dev", role: "Head coach · Strength", years: 9, cert: "NSCA-CSCS", quote: "Lift well first. Lift heavy later.", bio: "Dev spent five years coaching state-level lifters before opening the Yard in 2020. He runs every Barbell Foundations class himself, because the first five lifts decide whether people stay." },
  leena: { goal: "mobility", name: "Leena Iyer", img: "yard-leena", role: "Mobility & breath", years: 7, cert: "FRC mobility specialist", quote: "Stiff is a habit, not a sentence.", bio: "Leena came to coaching from physiotherapy. Her sessions are slow, precise and quietly hard: hips, shoulders and spines that move better by the end of the hour." },
  kabir: { goal: "conditioning", name: "Kabir Shaikh", img: "yard-kabir", role: "Boxing & conditioning", years: 6, cert: "Amateur boxing coach, BFI", quote: "Breathe, then hit.", bio: "Kabir boxed at national level for four years. His rounds are loud and sweaty, and every one has a lower-impact option, so no one sits out." },
};
const byGoal = Object.fromEntries(Object.entries(coaches).map(([id, k]) => [k.goal, id]));
const more = {
  strength: { who: "New lifters and anyone who wants to get properly strong", what: ["Squat, hinge, press and pull, coached rep by rep", "A written starting load so you never guess", "Max 8 per class at Foundations, 12 after"] },
  mobility: { who: "Desk backs, stiff hips, runners and recovering lifters", what: ["Joint-by-joint mobility you can repeat at home", "Breath work to finish every session", "Mats, blocks and bands provided"] },
  conditioning: { who: "People who get bored on a treadmill", what: ["Pad work and bag rounds in pairs", "Intervals that scale to any fitness level", "Gloves and wraps to borrow for your trial"] },
};
const discount = { 1: 1, 3: 0.9, 12: 0.8 };
const monthly = (p, b) => Math.round((p * discount[b]) / 50) * 50;
const plans = [
  ["Two a week", 2400, "8 classes a month, any type", false],
  ["Unlimited", 3200, "Every class, every day, plus open gym", true],
];
const steps = [
  ["Claim a free class", "Pick a class from the timetable. It takes a minute and you don't pay anything."],
  ["Arrive ten minutes early", "We'll show you the lockers and showers, and ask about old injuries in private."],
  ["Train with a coach beside you", "Your coach sets your weights and watches every set. No one is left to figure it out."],
  ["Talk, without the hard sell", "If you liked it, we'll suggest a plan. If not, you leave with a high-five."],
];
const reviews = [
  ["I'd never touched a barbell at 41. Eight months later I did my first pull-up, and Dev cheered louder than I did.", "Meera J.", "Member since 2024", "First pull-up at 41"],
  ["Leena fixed a back I'd been nursing for three years. I sit at a desk ten hours a day and it doesn't hurt any more.", "Arjun P.", "Member since 2023", "Back pain gone"],
  ["Fight Rounds at 7 pm is the best part of my week. Small groups, so Kabir actually knows how my left hook is coming along.", "Zoya K.", "Member since 2025", "Lost 9 kg"],
  ["No mirrors full of show-offs, no blaring music. Just good coaching and people who say hi.", "Rahul D.", "Member since 2022", "Squat 1.5× bodyweight"],
];
const amenities = [
  ["users", "Max 12 per class", "8 at Barbell Foundations"],
  ["clock", "6 am to 9 pm", "Open gym between classes"],
  ["check", "Hot showers & lockers", "Towels for members"],
  ["car", "Parking for 20 bikes", "Cars on Baner Road"],
];
const questions = [
  ["I've never been to a gym. Is this for me?", "Most of our members started at zero. Barbell Foundations and Morning Flow are built for your first month, and your coach sets every weight with you."],
  ["What does the free class include?", "One coached class of your choice, a locker and a shower. Bring shoes, water and something you can move in. No card details needed."],
  ["Can I freeze my membership?", "Yes, up to 30 days a year for travel or illness, at no cost. Just message us before it starts."],
  ["I have an old injury. Can I still train?", "Usually, yes. Tell your coach on arrival; every class has scaled options, and Leena can build you a mobility plan first."],
  ["Is there a joining fee?", "No. You pay for your first month after your trial, by UPI or card, and cancel with 30 days' notice."],
];
const foot = {
  name: "Kinetic Yard",
  blurb: "A small-group strength and conditioning gym in Baner, Pune. Three coaches, eighteen classes a week, no one left to figure it out alone.",
  address: "Unit 4, Sai Industrial Estate, Baner Road, Pune 411045",
  hours: "Mon–Sat 6 am – 9 pm · Sun 7 am – 12 pm",
  phone: "+91 99999 07320",
  email: "train@kineticyard.example",
  insta: "@kineticyard.pune",
  links: [["timetable", "Timetable"], ["coaches", "Coaches"], ["membership", "Membership"], ["request", "Free class"]],
};

export function kinetic(c) {
  const { path, opts, link, result, img, action, query } = c;
  const goals = opts("goal");
  const goal = goals.find((g) => g.id === query.get("goal"))?.id || "";
  const today = todayAt("Asia/Kolkata");
  const days = Array.from({ length: 7 }, (_, i) => dayOffset(today, i + 1));
  const day = days.includes(query.get("date")) ? query.get("date") : days[0];
  const billing = ["1", "3", "12"].includes(query.get("billing")) ? query.get("billing") : "1";
  const first = (k) => k.name.split(" ")[0];

  const header = (over = false) =>
    siteHeader(c, { name: "Kinetic<i>/</i>Yard", over, links: [["timetable", "Timetable"], ["coaches", "Coaches"], ["membership", "Membership"]], cta: ["request", "Free class"] });
  const page = (title, html, image, over = false) =>
    result(title, header(over) + html + siteFooter(c, foot) + dock(c, WA, ["request", "Claim a free class"]), image);
  const sessions = (date) =>
    goals
      .flatMap((g) => opts("klass", { goal: g.id, date, level: "some" }).map((s) => ({ ...s, g, name: s.label.split(" · ")[1], spots: Number(s.detail.match(/^\d+/)?.[0] || 0) })))
      .sort((a, b) => a.id.localeCompare(b.id));
  const row = (s, date) =>
    `<li class="tt-row" data-goal="${s.g.id}"><time>${s.id}</time><div class="tt-class">${link("classes/" + s.g.id, s.name)}<small>${first(coaches[byGoal[s.g.id]])} · ${s.g.label}</small></div><div class="tt-spots"><span style="--left:${(s.spots / 12).toFixed(2)}"></span><small>${s.spots ? s.spots + " of 12 left" : "Full"}</small></div>${s.disabled ? `<a class="tt-book wait" href="${WA}">Waitlist</a>` : link("request", "Book", "tt-book", { goal: s.g.id, date, klass: s.id })}</li>`;
  // Every day is rendered; the links work without JS, and business.js switches days and filters in place.
  const timetable = (only = goal) =>
    `<div class="tt" data-tt data-filter="${only}"><div class="tt-bar"><nav class="tt-days" aria-label="Day">${days
      .map((d) => link(c.path, `<b>${dateText(d, "en-IN", { weekday: "short" })}</b>${dateText(d, "en-IN", { day: "numeric" })}`, d === day ? "on" : "", { date: d, ...(only ? { goal: only } : {}) }).replace("<a ", `<a data-day="${d}" `))
      .join("")}</nav><nav class="tt-goals" aria-label="Type of class">${[["", "All"], ...goals.map((g) => [g.id, g.label])]
      .map(([id, l]) => link(c.path, l, id === only ? "on" : "", { date: day, ...(id ? { goal: id } : {}) }).replace("<a ", `<a data-goal="${id}" `))
      .join("")}</nav></div>${days.map((d) => `<ol class="tt-list" data-day-panel="${d}"${d === day ? "" : " hidden"}>${sessions(d).map((s) => row(s, d)).join("")}</ol>`).join("")}<p class="tt-note">Spots update as people book. Class full? Join the waitlist on WhatsApp; someone usually drops out.</p></div>`;
  const coachCard = (id) => {
    const k = coaches[id];
    return `<article class="coach" data-reveal>${link("coaches/" + id, img(k.img, k.name + ", coach at Kinetic Yard"), "coach-pic")}<p class="coach-role">${k.role}</p><h3>${link("coaches/" + id, k.name)}</h3><p>“${k.quote}”</p></article>`;
  };
  // Billing radios switch prices with CSS :has, so the plans work before (and without) JavaScript.
  const pricing = () =>
    `<div class="plans"><fieldset class="bill"><legend class="sr">Billing</legend>${[["1", "Monthly"], ["3", "Quarterly · save 10%"], ["12", "Yearly · save 20%"]]
      .map(([v, l]) => `<label><input type="radio" name="billing" value="${v}"${v === billing ? " checked" : ""}><span>${l}</span></label>`)
      .join("")}</fieldset><div class="plan-grid"><article class="plan"><h3>Free trial</h3><p class="plan-price"><b>₹0</b></p><p>One coached class of your choice. No card, no catch.</p>${link("request", "Claim it", "pill")}</article>${plans
      .map(
        ([n, p, d, hot]) =>
          `<article class="plan${hot ? " hot" : ""}">${hot ? '<p class="plan-tag">Most members</p>' : ""}<h3>${n}</h3><p class="plan-price">${["1", "3", "12"].map((b) => `<b class="b${b}">${rupees(monthly(p, b))}</b>`).join("")}<span>/ month</span></p><p>${d}</p><p class="plan-small">${["1", "3", "12"].map((b) => `<span class="b${b}">${b === "1" ? "Billed monthly, cancel with 30 days' notice" : `Billed ${rupees(monthly(p, b) * Number(b))} every ${b === "3" ? "3 months" : "year"}`}</span>`).join("")}</p>${link("request", "Start with a free class", hot ? "pill solid" : "pill")}</article>`,
      )
      .join("")}<article class="plan"><h3>10-class pack</h3><p class="plan-price"><b>${rupees(4500)}</b></p><p>Ten classes to use within three months. Good for travellers and shift workers.</p>${link("request", "Start with a free class", "pill")}</article></div></div>`;

  if (!path)
    return page(
      "Small-group strength gym in Baner, Pune",
      `<section class="y-cover"><div class="y-cover-img">${img("yard-hero", "A lifter chalked up over a loaded barbell in warm orange light", "", true)}</div><div class="y-cover-copy"><p class="y-kicker">Strength · Mobility · Boxing — Baner, Pune</p><h1>Strong is a <em>team sport.</em></h1><p>Small coached classes, three coaches who learn your name, and your first class on us.</p><div class="y-act">${link("request", "Claim a free class " + icon("arrow"), "pill solid")}${link("timetable", "See the timetable", "pill")}</div></div><ul class="y-stats"><li><b>18</b>classes a week</li><li><b>12</b>max per class</li><li><b>6 am</b>first session</li><li><b>4.9</b>${stars(5)} 412 reviews</li></ul></section>
<section class="y-ways"><div class="sec-head"><h2>Three ways <em>to train</em></h2>${link("timetable", "Full timetable " + icon("arrow"), "text-link")}</div><div class="way-grid">${goals.map((g, i) => link("classes/" + g.id, `${img(g.img, g.label)}<span class="way-n">0${i + 1}</span><span class="way-t"><b>${g.label}</b><small>${g.detail} With ${first(coaches[byGoal[g.id]])}.</small></span><span class="way-go">${icon("arrow")}</span>`, "way")).join("")}</div></section>
<section class="y-tt" id="timetable"><div class="sec-head"><div><h2>This week <em>on the floor</em></h2><p>Pick a day and book straight into any class with space.</p></div></div>${timetable()}</section>
<section class="y-first"><div class="y-first-copy"><h2>Your first class, <em>step by step</em></h2><ol>${steps.map(([t, d], i) => `<li data-reveal><span>0${i + 1}</span><div><h3>${t}</h3><p>${d}</p></div></li>`).join("")}</ol>${link("request", "Claim a free class " + icon("arrow"), "pill solid")}</div><figure>${img("yard-coaching", "A coach guiding a new member through a goblet squat")}</figure></section>
<section class="y-coaches"><div class="sec-head"><h2>Your <em>coaches</em></h2>${link("coaches", "Meet the team " + icon("arrow"), "text-link")}</div><div class="coach-grid">${Object.keys(coaches).map(coachCard).join("")}</div></section>
<section class="y-plans" id="membership"><div class="sec-head"><div><h2>Simple <em>membership</em></h2><p>No joining fee, no lock-in. Every plan starts with a free class.</p></div></div>${pricing()}</section>
<section class="y-voices" aria-label="Member stories"><div class="sec-head"><h2>Members, <em>in their words</em></h2><div class="rail-ctl"><button type="button" data-rail-prev aria-label="Previous story">${icon("left")}</button><button type="button" data-rail-next aria-label="Next story">${icon("right")}</button></div></div><div class="rail" data-rail tabindex="0">${reviews.map(([q, n, since, win]) => `<blockquote><p class="win">${win}</p><p>“${q}”</p><footer>${stars(5)}<b>${n}</b>${since}</footer></blockquote>`).join("")}</div></section>
<section class="y-space" id="instagram"><div class="sec-head"><h2>The <em>space</em></h2><a class="text-link" href="#instagram">${icon("insta")} ${foot.insta}</a></div><div class="space-grid" data-gallery>${["yard-floor", "yard-class", "yard-strength", "yard-box", "yard-flow"].map((g, i) => `<a href="/assets/${g}.webp" class="s${i}">${img(g, "Kinetic Yard photograph " + (i + 1))}</a>`).join("")}</div><ul class="y-amen">${amenities.map(([i, t, d]) => `<li>${icon(i)}<div><b>${t}</b><span>${d}</span></div></li>`).join("")}</ul></section>
<section class="questions" data-reveal><h2>Questions, <em>answered</em></h2>${faq(questions)}</section>
<section class="y-cta" data-reveal><h2>Your first class is <em>on us.</em></h2><div class="y-act">${link("request", "Claim a free class " + icon("arrow"), "pill solid")}<a class="pill" href="${WA}">${icon("chat")} Ask on WhatsApp</a></div><p>${foot.address} · ${foot.hours}</p></section>`,
      "yard-hero",
      true,
    );

  if (path === "timetable")
    return page(
      "Class timetable",
      `<section class="y-top"><p class="y-kicker">Timetable</p><h1>This week <em>on the floor</em></h1><p>Eighteen coached classes a week. Tap Book to claim a free class in any session with space.</p></section><section class="y-tt solo">${timetable()}</section>`,
      "yard-floor",
    );

  if (path === "membership")
    return page(
      "Membership",
      `<section class="y-top"><p class="y-kicker">Membership</p><h1>Simple <em>membership</em></h1><p>No joining fee and no lock-in. Freeze for up to 30 days a year. Every plan starts with a free class.</p></section><section class="y-plans solo">${pricing()}</section><section class="questions" data-reveal><h2>Good to <em>know</em></h2>${faq(questions.slice(1))}</section>`,
      "yard-class",
    );

  if (path === "coaches")
    return page(
      "Coaches",
      `<section class="y-top"><p class="y-kicker">Coaches</p><h1>Your <em>coaches</em></h1><p>Three full-time coaches, no rotating freelancers. Whoever you meet at your trial is who coaches you next week.</p></section><section class="y-coaches solo"><div class="coach-grid">${Object.keys(coaches).map(coachCard).join("")}</div></section>`,
      "yard-dev",
    );

  const id = path.startsWith("coaches/") ? path.slice(8) : "";
  if (Object.hasOwn(coaches, id)) {
    const k = coaches[id];
    const g = goals.find((x) => x.id === k.goal);
    return page(
      k.name,
      `<section class="y-profile"><figure>${img(k.img, k.name, "", true)}</figure><article><nav class="crumbs">${link("coaches", "Coaches")} / ${k.name}</nav><p class="y-kicker">${k.role}</p><h1>${k.name}</h1><blockquote>“${k.quote}”</blockquote><p>${k.bio}</p><dl class="facts"><div><dt>Coaching</dt><dd>${k.years} years</dd></div><div><dt>Certified</dt><dd>${k.cert}</dd></div><div><dt>Teaches</dt><dd>${link("classes/" + g.id, g.label)}</dd></div></dl>${action("Train with " + first(k) + " " + icon("arrow"), { goal: g.id })}</article></section><section class="y-tt solo"><div class="sec-head"><h2>${first(k)}'s <em>classes</em></h2></div>${timetable(g.id)}</section>`,
      k.img,
    );
  }

  if (path === "request")
    return page(
      "Claim a free class",
      `<section class="y-top slim"><p class="y-kicker">Free class</p><h1>Claim a <em>free class</em></h1><p>Two quick questions, pick a class with space, and you're on the coach's list. No card needed.</p></section><div class="workflow"><div id="demo-root" data-slug="${c.slug}"></div></div>`,
      "yard-hero",
    );

  const g = goals.find((x) => path === "classes/" + x.id);
  if (!g) return;
  const k = coaches[byGoal[g.id]];
  const m = more[g.id];
  return page(
    g.label,
    `<section class="y-class"><div class="y-class-img">${img(g.img, g.label, "", true)}</div><div class="y-class-copy"><nav class="crumbs">${link("timetable", "Timetable")} / ${g.label}</nav><h1>${g.label}</h1><p class="lede">${g.detail}</p><dl class="facts"><div><dt>For</dt><dd>${m.who}</dd></div><div><dt>Coach</dt><dd>${link("coaches/" + byGoal[g.id], k.name)}</dd></div><div><dt>Length</dt><dd>60 minutes</dd></div></dl><ul class="ticks">${m.what.map((t) => `<li>${icon("check")}${t}</li>`).join("")}</ul>${action("Try it free " + icon("arrow"), { goal: g.id })}</div></section><section class="y-tt solo"><div class="sec-head"><h2>${g.label} <em>this week</em></h2></div>${timetable(g.id)}</section>`,
    g.img,
  );
}
