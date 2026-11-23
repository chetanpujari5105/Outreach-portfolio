import { mast, details, rupees, esc, printButton } from "./common.mjs";
export function brightpath(c) {
  const { path, opts, img, link, action, result, query } = c;
  const subjects = opts("subject");
  const top = mast(c, "Brightpath", [
    ["", "Subject library"],
    ["tutor", "Meet your tutor"],
  ]);
  const lessons = {
    maths: [
      "Ratios at the kitchen table",
      "A recipe uses two cups of flour for every three cups of oats. How many cups of oats go with four cups of flour?",
      ["5 cups", "6 cups", "8 cups"],
      1,
      "Doubling the flour doubles the oats. Three times two is six.",
    ],
    science: [
      "A window into evaporation",
      "Which glass of water will usually evaporate fastest?",
      ["Covered and cold", "Open, warm and shallow", "Sealed and warm"],
      1,
      "A broad exposed surface and warmth help more water molecules escape.",
    ],
    english: [
      "Find the active verb",
      "Which opening gives the reader a clear action?",
      [
        "The door was in a state of motion.",
        "There was a change.",
        "Maya pushed the door open.",
      ],
      2,
      "“Pushed” connects the person to a precise action.",
    ],
  };
  if (!path)
    return result(
      "Subject library",
      top +
        `<section class="notebook"><aside><p>Kothrud & online</p><h1>The study<br>notebook.</h1>${img("path-hero", "Open notebook and study desk")}</aside><div><h2>Choose a subject</h2>${subjects.map((o, i) => link("subjects/" + o.id, "<small>Chapter " + (i + 1) + "</small><h3>" + o.label + "</h3><p>" + lessons[o.id][0] + "</p>", "chapter")).join("")}</div></section>`,
      "path-hero",
    );
  if (path === "tutor")
    return result(
      "Tutorial approach",
      top +
        '<article class="essay"><h1>At the teaching table</h1><p>Each trial begins with a question the learner already knows how to approach. The tutor then changes one part of the problem and listens to how the learner explains the difference.</p>' +
        action("Plan a trial lesson") +
        "</article>",
    );
  const o = subjects.find((s) =>
    ["subjects/" + s.id, "lessons/" + s.id].includes(path),
  );
  if (o) {
    const [title, q, answers, correct, note] = lessons[o.id];
    const grade =
      opts("grade").find((v) => v.id === query.get("grade")) ||
      opts("grade")[0];
    if (path.startsWith("lessons/"))
      return result(
        title,
        top +
          `<article class="worksheet"><p>${o.label} / Sample lesson</p><h1>${title}</h1><p>${q}</p><form data-quiz="${correct}">${answers.map((s, i) => `<label class="check"><input type="radio" name="answer" value="${i}" required> ${s}</label>`).join("")}<button>Check answer</button><button type="reset">Try again</button><p role="status" data-explanation="${esc(note)}"></p></form>${action("Book a " + grade.label + " trial", { subject: o.id, grade: grade.id })}</article>`,
        o.img,
      );
    return result(
      o.label,
      top +
        `<section class="notebook"><aside>${img(o.img, o.label)}</aside><article><h1>${o.label}</h1><h2>Choose a learning stage</h2>${opts(
          "grade",
        )
          .map((g) =>
            link("lessons/" + o.id, g.label + " · " + title, "chapter", {
              grade: g.id,
            }),
          )
          .join("")}</article></section>`,
      o.img,
    );
  }
}
export function stillwater(c) {
  const { path, opts, link, img, action, result } = c;
  const top = mast(c, "stillwater", [
    ["", "The practice"],
    ["services", "Services & fees"],
    ["first-session", "Your first session"],
  ]);
  const services = opts("support");
  if (!path)
    return result(
      "A letter from the practice",
      top +
        `<section class="practice-letter"><aside>${img("still-garden", "Quiet garden at the practice")}<p>Aundh, Pune<br>In person & online</p></aside><article><p>From the practice</p><h1>Room to<br><i>talk.</i></h1><p>Dear visitor,</p><p>You can take your time here. Some people come with a particular question. Others want a space to think out loud and find where to begin.</p><p>Your first conversation is a chance to meet, ask questions and decide what feels right for you.</p><p class="signature">The Stillwater practice</p>${link("first-session", "Read about a first session", "text-act")}</article></section>`,
      "still-garden",
    );
  if (path === "services")
    return result(
      "Services and fees",
      top +
        '<article class="essay"><h1>Ways to meet</h1>' +
        services
          .map((o) =>
            link(
              "services/" + o.id,
              "<b>" +
                o.label +
                "</b><span>" +
                rupees(o.price) +
                " " +
                o.unit +
                "</span>",
              "menu-line",
            ),
          )
          .join("") +
        "</article>",
    );
  if (path === "first-session")
    return result(
      "Your first session",
      top +
        '<article class="essay"><h1>Your first conversation</h1><p>Begin with introductions. You can ask about the approach, the length of a session and how follow-up appointments would work. Share only what feels comfortable.</p><h2>Choose your setting</h2>' +
        action("Meet in Aundh", { mode: "room" }) +
        " " +
        action("Meet online", { mode: "video" }) +
        "</article>",
    );
  const o = services.find((o) => path === "services/" + o.id);
  if (o)
    return result(
      o.label,
      top +
        `<article class="essay"><p>Services & fees</p><h1>${o.label}</h1><p>${o.detail}</p>${details(
          [
            ["Session fee", rupees(o.price)],
            ["Duration", o.unit],
          ],
        )}${action("See sample appointment times", { support: o.id })}</article>`,
      o.img,
    );
}
export function loom(c) {
  const { path, opts, link, img, result, action } = c;
  const top = mast(c, "Loom & Lane", [
    ["", "Collection"],
    ["size-guide", "Size guide"],
    ["bag", "Bag"],
  ]);
  const items = opts("item");
  if (!path || path === "collection") {
    const tag = c.query.get("category");
    return result(
      "The handloom collection",
      top +
        `<section class="shop"><div class="shop-title"><h1>Off the loom.</h1><nav>${["All", "Clothing", "Bags", "Home"].map((t) => link("collection", t, (tag || "All") === t ? "active" : "", { category: t })).join("")}</nav></div><div class="shop-wall">${items
          .filter(
            (o) =>
              !["Clothing", "Bags", "Home"].includes(tag) ||
              o.tags.includes(tag),
          )
          .map((o) =>
            link(
              "pieces/" + o.id,
              img(o.img, o.label) +
                `<div><strong>${o.label}</strong><span>${rupees(o.price)}</span></div>`,
            ),
          )
          .join("")}</div></section>`,
      "loom-jacket",
    );
  }
  if (path === "size-guide")
    return result(
      "Size guide",
      top +
        '<article class="essay"><h1>Find your fit</h1><p>Lay a similar garment flat and measure across the chest. Double that measurement and compare with the garment circumference below.</p>' +
        details([
          ["XS", "90 cm"],
          ["S", "96 cm"],
          ["M", "102 cm"],
          ["L", "108 cm"],
          ["XL", "114 cm"],
        ]) +
        link("", "Back to collection", "action") +
        "</article>",
    );
  if (path === "bag")
    return result(
      "Saved bag",
      top +
        '<section class="inner"><h1>Your bag</h1><div data-basket="loom-lane"></div>' +
        link("", "Continue browsing", "text-act") +
        "</section>",
    );
  const o = items.find((o) => path === "pieces/" + o.id);
  if (o)
    return result(
      o.label,
      top +
        `<section class="product-detail">${img(o.img, o.label)}<article><p>${o.tags[0]} / Handloom collection</p><h1>${o.label}</h1><p>${o.detail}</p><h2>${rupees(o.price)}</h2><form data-add="loom-lane" data-id="${o.id}">${[
          "size",
          "colour",
        ]
          .map(
            (f) =>
              `<label>${f}<select name="${f}">${opts(f, { item: o.id })
                .map(
                  (v) =>
                    `<option value="${v.id}" ${v.disabled ? "disabled" : ""}>${v.label}${v.disabled ? " · unavailable" : ""}</option>`,
                )
                .join("")}</select></label>`,
          )
          .join(
            "",
          )}<button>Add to bag</button></form>${link("size-guide", "Size guide", "text-act")}${action("Ask about this piece", { item: o.id })}</article></section>`,
      o.img,
    );
}
export function gloss(c) {
  const { path, opts, img, link, result, action } = c;
  const top = mast(c, "GLOSS / LAB", [
    ["", "Inspection bay"],
    ["treatments", "Treatment specs"],
    ["aftercare", "Aftercare"],
  ]);
  const pkgs = opts("pkg", { size: "sedan", condition: "good" });
  if (!path)
    return result(
      "Inspection bay",
      top +
        `<section class="bay">${img("gloss-hero", "Vehicle in the detailing bay")}<div><p>Detailing / Hinjewadi</p><h1>Surface<br>inspection.</h1><nav>${pkgs.map((o, i) => link("treatments/" + o.id, "<small>Bay 0" + (i + 1) + "</small>" + o.label)).join("")}</nav></div></section>`,
      "gloss-hero",
    );
  if (path === "aftercare")
    return result(
      "Aftercare",
      top +
        '<article class="essay"><h1>Between visits</h1><p>Park in shade before washing. Rinse loose debris first, use clean wash media and dry with a fresh microfibre towel. Ask the technician for the curing instructions for your chosen finish.</p>' +
        link("treatments", "Compare treatments", "action") +
        "</article>",
    );
  if (path === "treatments")
    return result(
      "Treatment specifications",
      top +
        '<section class="inner"><h1>Treatment specs</h1>' +
        pkgs
          .map((o) =>
            link(
              "treatments/" + o.id,
              "<b>" + o.label + "</b><span>" + o.hours + " hours</span>",
              "menu-line",
            ),
          )
          .join("") +
        "</section>",
    );
  const o = pkgs.find((o) => path === "treatments/" + o.id);
  if (o)
    return result(
      o.label,
      top +
        `<section class="bay-detail"><div data-inspection><div class="finish-comparison">${img(o.img, o.label + " treatment detail")}<div class="finish-overlay" aria-hidden="true">${img(o.img, "")}</div></div><label>Illustrative finish comparison<input type="range" min="0" max="100" value="50" aria-label="Reveal the polished finish"></label><div class="inspection-actions"><button type="button" data-finish="100">Hazed finish</button><button type="button" data-finish="0">Polished finish</button></div><small>Lighting simulation on one sample photograph.</small></div><article><h1>${o.label}</h1><p>${o.detail}</p>${details(
          [
            ["Example sedan", rupees(o.price)],
            ["Workshop time", o.hours + " hours"],
          ],
        )}${action("Configure a drop-off", { pkg: o.id, size: "sedan" })}${link("aftercare", "Read aftercare", "text-act")}</article></section>`,
      o.img,
    );
}
export function north(c) {
  const { path, link, img, result, action, opts } = c;
  const top = mast(c, "Northline Advisory", [
    ["", "Decision memos"],
    ["people", "Our practice"],
    ["consult", "Consultation"],
  ]);
  const topics = opts("topic");
  const stories = {
    tax: [
      "Before your next filing",
      "A small studio is reconciling its first year of sales. Start with the ledger, identify missing invoices and prepare a short list of questions for the accountant.",
      ["Reconcile the sales ledger", "Identify missing invoices"],
    ],
    growth: [
      "The cost of a second location",
      "A founder is weighing a second lease. Separate the opening expense from ongoing cost. Compare the slower opening scenario with the cash available today.",
      ["Map opening costs", "Compare cash runway"],
    ],
    legal: [
      "Reading the next agreement",
      "A consultancy is reviewing a proposed engagement. Mark the delivery milestones, identify who accepts each deliverable and collect open questions for a qualified adviser.",
      ["Clarify acceptance criteria", "Review milestones"],
    ],
  };
  if (!path)
    return result(
      "Decision memos",
      top +
        `<section class="newspaper"><p>Practice journal · Pune</p><h1>The Decision Ledger</h1><div class="news-grid"><figure>${img("north-growth", "Workspace for planning a business expansion")}<figcaption>Growth & funding</figcaption></figure><div>${topics.map((o) => link("memos/" + o.id, "<small>" + o.label + "</small><h2>" + stories[o.id][0] + "</h2>")).join("")}</div></div></section>`,
      "north-growth",
    );
  if (path === "people" || path === "consult")
    return result(
      "The advisory practice",
      top +
        '<article class="essay"><h1>A focused consultation</h1><p>Prepare a business question, mark the records you already have and choose a time to discuss it with the practice. The sample scenarios use fictional businesses.</p>' +
        action("Prepare your consultation") +
        "</article>",
    );
  const o = topics.find((o) => path === "memos/" + o.id);
  if (o) {
    const [title, body, items] = stories[o.id];
    return result(
      title,
      top +
        `<article class="memo"><p>Sample memo / ${o.label}</p><h1>${title}</h1><p>${body}</p><h2>Your meeting agenda</h2><form action="${c.href("request")}"><input type="hidden" name="topic" value="${o.id}">${items.map((i) => `<label class="check"><input type="checkbox" name="agenda" value="${i}"> ${i}</label>`).join("")}<button>Prepare consultation brief</button></form>${printButton}</article>`,
      o.img,
    );
  }
}
