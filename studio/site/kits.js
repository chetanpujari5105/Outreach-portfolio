import { loomProduct, loomProducts, loomSizes } from "./loom-products.js";

// Industry demo kits for flow.js. Every business, price and time here is fictional.
const IN = { currency: "INR", locale: "en-IN", zone: "Asia/Kolkata" };
const weekday = (iso) => new Date(iso + "T12:00:00Z").getUTCDay();
// Stable pseudo-availability so the same date always shows the same spots.
const seed = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 9973, 7);
const pct = (n, p) => Math.round((n * p) / 100);
const contact = [
  { id: "whatsapp", label: "WhatsApp" },
  { id: "call", label: "Phone call" },
  { id: "email", label: "Email" },
];
const nameField = (label = "Your name") => ({ type: "text", name: "name", label, required: true, max: 80, autocomplete: "name" });
const replyField = { type: "select", name: "reply", label: "Reply by", options: contact };

export const kits = {
  // 1 ─ Hotels & homestays
  "casa-neem": {
    ...IN,
    key: "casa-neem",
    cls: "kt-neem",
    brand: "Casa Neem",
    wordmark: "Casa <i>Neem</i>",
    place: "Homestay · Assagao, Goa",
    hero: { layout: "postcard", img: "neem-hero", alt: "A whitewashed Goan homestay courtyard with a neem tree and indigo cushions", kicker: "Five rooms around a neem tree", title: "Stay slow<br><em>in Assagao.</em>", text: "Choose a room, tell us your dates and who is coming. Stays are subject to availability." },
    facts: [["5", "rooms"], ["12 min", "to Anjuna"], ["9:00", "breakfast"]],
    sideTitle: "Your stay",
    steps: [
      { label: "Room", title: "Choose a room", fields: [{ type: "cards", name: "room", label: "Room", cols: 3, options: [
        { id: "garden", label: "Garden Room", detail: "Queen bed, private verandah. Sleeps 2.", img: "neem-garden", price: 6500, unit: "/night", sleeps: 2 },
        { id: "loft", label: "Loft Suite", detail: "Upstairs, daybed and tree views. Sleeps 3.", img: "neem-loft", price: 8900, unit: "/night", sleeps: 3 },
        { id: "family", label: "Family Cottage", detail: "Two rooms and a kitchenette. Sleeps 5.", img: "neem-family", price: 12400, unit: "/night", sleeps: 5 },
      ] }] },
      { label: "Dates", title: "Dates and guests", fields: [
        { type: "date", name: "checkin", label: "Check-in", minDays: 2, maxDays: 180 },
        { type: "date", name: "checkout", label: "Check-out", after: "checkin", maxSpan: 21, offset: 2 },
        { type: "count", name: "adults", label: "Adults", min: 1, max: 6, start: 2 },
        { type: "count", name: "children", label: "Children", min: 0, max: 4, hint: "Under 12" },
      ] },
      { label: "Extras", title: "Make it yours", fields: [
        { type: "chips", name: "extras", label: "Extras", multi: true, options: [
          { id: "breakfast", label: "Goan breakfast", priceText: "₹450 per guest/night" },
          { id: "pickup", label: "Airport pickup", price: 1800 },
          { id: "late", label: "Late check-out", price: 1200 },
          { id: "scooter", label: "Scooter hire", priceText: "₹500/night" },
        ] },
        { type: "text", name: "note", label: "Anything we should know?", long: true, max: 300, placeholder: "Arrival time, dietary needs, a celebration…" },
      ] },
      { label: "Details", title: "Your contact details", fields: [nameField(), replyField] },
    ],
    check(v, i, h) {
      const room = h.opt("room", v);
      if (i >= 1 && room && v.adults + v.children > room.sleeps) return `The ${room.label} sleeps ${room.sleeps}. Choose a larger room or fewer guests.`;
      return "";
    },
    estimate(v, h) {
      const room = h.opt("room", v);
      const n = h.nights(v.checkin, v.checkout);
      const guests = v.adults + v.children;
      const lines = [[`${room.label} × ${n} night${n > 1 ? "s" : ""}`, room.price * n]];
      if (v.extras.includes("breakfast")) lines.push([`Breakfast × ${guests} × ${n}`, 450 * guests * n]);
      if (v.extras.includes("pickup")) lines.push(["Airport pickup", 1800]);
      if (v.extras.includes("late")) lines.push(["Late check-out", 1200]);
      if (v.extras.includes("scooter")) lines.push([`Scooter × ${n}`, 500 * n]);
      const sub = lines.reduce((a, l) => a + l[1], 0);
      lines.push(["Taxes (12%)", pct(sub, 12)]);
      return { lines, total: sub + pct(sub, 12), note: "Pay nothing now. We confirm availability first." };
    },
    summary: (v, h) => [["Room", h.opt("room", v).label], ["Dates", `${h.date(v.checkin)} → ${h.date(v.checkout)}`], ["Guests", `${v.adults} adult${v.adults > 1 ? "s" : ""}${v.children ? `, ${v.children} child${v.children > 1 ? "ren" : ""}` : ""}`], ...(v.name ? [["Name", h.esc(v.name)]] : [])],
    rowTitle: (v, h) => `${h.esc(v.name)} · ${h.opt("room", v).label}`,
    receipt: { kicker: "Saved on this device", title: "Your stay enquiry is ready.", text: "Review your dates and total below. Nothing has been sent, booked or charged; contact Casa Neem to confirm availability." },
    owner: "Stay enquiries",
    sendLabel: "Save stay enquiry",
  },

  // 2 ─ Venues & event teams
  "hall-eleven": {
    ...IN,
    key: "hall-eleven",
    cls: "kt-hall",
    brand: "Hall Eleven",
    wordmark: "HALL <b>XI</b>",
    place: "Event venue · Kalyani Nagar, Pune",
    hero: { layout: "full", img: "hall-hero", alt: "A candlelit banquet hall with long tables and warm chandeliers", kicker: "Weddings · Corporate · Celebrations", title: "An evening<br><em>worth gathering for.</em>", text: "Pick a setup, size your guest list and see a per-head estimate before you call us." },
    facts: [["320", "guests max"], ["6,400", "sq ft"], ["4", "setups"]],
    sideTitle: "Live estimate",
    steps: [
      { label: "Occasion", title: "What are you planning?", fields: [{ type: "chips", name: "occasion", label: "Occasion", options: [
        { id: "reception", label: "Wedding reception", price: 85000, priceText: "hire ₹85,000" },
        { id: "corporate", label: "Corporate evening", price: 60000, priceText: "hire ₹60,000" },
        { id: "birthday", label: "Milestone birthday", price: 40000, priceText: "hire ₹40,000" },
      ] }, { type: "date", name: "date", label: "Event date", minDays: 14, maxDays: 365 }] },
      { label: "Setup", title: "Choose a setup and guest count", fields: [
        { type: "cards", name: "setup", label: "Setup", cols: 3, options: [
          { id: "banquet", label: "Banquet", detail: "Round tables, served dinner. Up to 180.", img: "hall-banquet", cap: 180 },
          { id: "theatre", label: "Theatre", detail: "Rows facing a stage. Up to 260.", img: "hall-theatre", cap: 260 },
          { id: "cocktail", label: "Cocktail", detail: "Standing, high tables, live counters. Up to 320.", img: "hall-cocktail", cap: 320 },
        ] },
        { type: "count", name: "guests", label: "Guests", min: 20, step: 10, start: 120, max: (v) => ({ banquet: 180, theatre: 260, cocktail: 320 })[v.setup] || 320, hint: (v) => `This setup holds up to ${({ banquet: 180, theatre: 260, cocktail: 320 })[v.setup]} guests.` },
      ] },
      { label: "Menu", title: "Menu and add-ons", fields: [
        { type: "cards", name: "menu", label: "Menu", cols: 3, options: [
          { id: "classic", label: "Classic", detail: "Two starters, three mains, one dessert.", price: 950, unit: "/guest" },
          { id: "signature", label: "Signature", detail: "Live counters and a chef’s table.", price: 1450, unit: "/guest" },
          { id: "grand", label: "Grand", detail: "Seven courses, paired mocktails.", price: 2100, unit: "/guest" },
        ] },
        { type: "chips", name: "addons", label: "Add-ons", multi: true, options: [
          { id: "av", label: "Stage, sound & lights", price: 18000 },
          { id: "decor", label: "Floral décor", price: 35000 },
          { id: "valet", label: "Valet parking", price: 12000 },
        ] },
      ] },
      { label: "Contact", title: "Who is planning?", fields: [nameField("Your name"), { type: "text", name: "org", label: "Company or family name", max: 80 }, replyField] },
    ],
    estimate(v, h) {
      const occ = h.opt("occasion", v), menu = h.opt("menu", v);
      const lines = [[`Venue hire · ${occ.label}`, occ.price], [`${menu.label} menu × ${v.guests}`, menu.price * v.guests]];
      for (const a of h.opts("addons", v)) lines.push([a.label, a.price]);
      const total = lines.reduce((a, l) => a + l[1], 0);
      lines.push(["Per guest", Math.round(total / v.guests)]);
      return { lines, total, note: "Estimate before taxes. A 25% deposit holds the date." };
    },
    summary: (v, h) => [["Occasion", h.opt("occasion", v).label], ["Date", h.date(v.date)], ["Setup", `${h.opt("setup", v).label} · ${v.guests} guests`], ["Menu", h.opt("menu", v).label], ...(v.name ? [["Planner", h.esc(v.name)]] : [])],
    rowTitle: (v, h) => `${h.esc(v.org || v.name)} · ${h.opt("occasion", v).label}`,
    receipt: { kicker: "Saved on this device", title: "Your evening, on paper.", text: "Your event estimate is ready to review. Nothing has been sent and the date is not reserved; contact Hall Eleven for a firm quote." },
    owner: "Event enquiries",
    sendLabel: "Save event enquiry",
  },

  // 3 ─ Home services & trades
  brightnest: {
    ...IN,
    key: "brightnest",
    cls: "kt-nest",
    brand: "Brightnest",
    wordmark: "bright<b>nest</b>",
    place: "Home cleaning · Pune",
    hero: { layout: "bubble", img: "nest-hero", alt: "A bright, freshly cleaned living room with a mint cleaning caddy", kicker: "Vetted, insured, on time", title: "A spotless home,<br><em>priced in a minute.</em>", text: "Tell us about your place and pick a visit. You see the price before anyone rings the bell." },
    facts: [["4.9★", "1,200 visits"], ["₹0", "to reschedule"], ["2–3", "cleaners per visit"]],
    sideTitle: "Your quote",
    steps: [
      { label: "Home", title: "Tell us about your home", fields: [
        { type: "chips", name: "home", label: "Property", options: [{ id: "apartment", label: "Apartment" }, { id: "villa", label: "Villa / row house" }, { id: "office", label: "Small office" }] },
        { type: "count", name: "beds", label: "Bedrooms or cabins", min: 1, max: 6, start: 2 },
        { type: "count", name: "baths", label: "Bathrooms", min: 1, max: 6, start: 2 },
      ] },
      { label: "Clean", title: "Choose the clean", fields: [
        { type: "cards", name: "clean", label: "Clean type", cols: 3, options: [
          { id: "standard", label: "Standard", detail: "Dusting, floors, kitchen and bathrooms.", img: "nest-standard", price: 0, priceText: "base", rate: 1 },
          { id: "deep", label: "Deep clean", detail: "Inside cabinets, grout, fans and grilles.", img: "nest-deep", priceText: "× 1.8", rate: 1.8 },
          { id: "move", label: "Move-out", detail: "Empty home, every surface, ready to hand over.", img: "nest-move", priceText: "× 2.2", rate: 2.2 },
        ] },
        { type: "chips", name: "extras", label: "Extras", multi: true, options: [
          { id: "fridge", label: "Inside fridge", price: 400 },
          { id: "oven", label: "Inside oven", price: 500 },
          { id: "balcony", label: "Balcony", price: 350 },
          { id: "windows", label: "Windows", price: 600 },
        ] },
      ] },
      { label: "Visit", title: "Pick a visit", fields: [
        { type: "chips", name: "plan", label: "How often", options: [{ id: "once", label: "One-off" }, { id: "fortnight", label: "Every 2 weeks", priceText: "−10%" }, { id: "weekly", label: "Weekly", priceText: "−15%" }] },
        { type: "date", name: "date", label: "Visit date", minDays: 1, maxDays: 45, days: [1, 2, 3, 4, 5, 6], dayError: "We don’t clean on Sundays. Choose Monday to Saturday." },
        { type: "chips", name: "slot", label: "Arrival window", options: (v) => ["08:00", "11:00", "14:00", "17:00"].map((t, i) => ({ id: t, label: ["8–10 am", "11 am–1 pm", "2–4 pm", "5–7 pm"][i], disabled: (seed(v.date + t) % 4) === 0 })) },
      ] },
      { label: "Address", title: "Where are we cleaning?", fields: [nameField(), { type: "text", name: "area", label: "Area or society", required: true, max: 120, placeholder: "e.g. Aundh, Sai Paradise" }, { type: "text", name: "phone", label: "Mobile number", required: true, input: "tel", max: 15, pattern: "^[+]?[0-9 ]{10,14}$", patternError: "Enter a 10-digit mobile number.", autocomplete: "tel" }] },
    ],
    estimate(v, h) {
      const base = { apartment: 900, villa: 1400, office: 1200 }[v.home] + v.beds * 350 + v.baths * 300;
      const c = h.opt("clean", v);
      const lines = [[`${c.label} · ${v.beds} bed, ${v.baths} bath`, Math.round(base * c.rate)]];
      for (const x of h.opts("extras", v)) lines.push([x.label, x.price]);
      const sub = lines.reduce((a, l) => a + l[1], 0);
      const off = { once: 0, fortnight: 10, weekly: 15 }[v.plan];
      if (off) lines.push([`Regular plan (−${off}%)`, -pct(sub, off)]);
      return { lines, total: sub - pct(sub, off), totalLabel: "Per visit", note: `About ${Math.max(2, Math.round((v.beds + v.baths) * c.rate * 0.6))} hours with 2–3 cleaners.` };
    },
    summary: (v, h) => [["Home", `${h.opt("home", v).label}, ${v.beds} bed / ${v.baths} bath`], ["Clean", h.opt("clean", v).label], ["Visit", `${h.date(v.date)} · ${h.opt("slot", v)?.label || "—"}`], ["Plan", h.opt("plan", v).label], ...(v.area ? [["Area", h.esc(v.area)]] : [])],
    rowTitle: (v, h) => `${h.esc(v.name)} · ${h.esc(v.area)}`,
    receipt: { kicker: "Saved on this device", title: "Your visit request is ready.", text: "Review the visit and estimated price below. Nothing has been sent or charged; contact Brightnest to confirm the time." },
    owner: "Cleaning requests",
    sendLabel: "Save visit request",
  },

  // 4 ─ Gyms & movement studios
  "kinetic-yard": {
    ...IN,
    key: "kinetic-yard",
    cls: "kt-yard",
    brand: "Kinetic Yard",
    wordmark: "KINETIC/YARD",
    place: "Strength & movement · Baner, Pune",
    hero: { layout: "poster", img: "yard-hero", alt: "An athlete mid-lift in a dark industrial gym with orange light", kicker: "First class free", title: "Find your<br><em>first class.</em>", text: "Answer two questions, see which classes have space and claim a free trial." },
    facts: [["18", "classes a week"], ["12", "max per class"], ["6 am", "first session"]],
    sideTitle: "Your trial",
    steps: [
      { label: "Goal", title: "What do you want to train?", fields: [
        { type: "cards", name: "goal", label: "Goal", cols: 3, options: [
          { id: "strength", label: "Get stronger", detail: "Barbell basics, coached in small groups.", img: "yard-strength" },
          { id: "mobility", label: "Move better", detail: "Mobility, flow and breath.", img: "yard-flow" },
          { id: "conditioning", label: "Build stamina", detail: "Boxing rounds and intervals.", img: "yard-box" },
        ] },
        { type: "chips", name: "level", label: "Experience", options: [{ id: "new", label: "Brand new" }, { id: "some", label: "Train sometimes" }, { id: "regular", label: "Train 3×+ a week" }] },
      ] },
      { label: "Class", title: "Pick a day and a class", intro: "Spots left update for each day. Full classes can’t be chosen.", fields: [
        { type: "date", name: "date", label: "Day", minDays: 1, maxDays: 14 },
        { type: "cards", name: "klass", label: "Class", cols: 2, options: (v) => {
          const plan = { strength: [["06:00", "Barbell Foundations"], ["18:30", "Strength Club"], ["20:00", "Lift Lab"]], mobility: [["07:00", "Morning Flow"], ["12:30", "Desk Reset"], ["19:30", "Slow Burn Mobility"]], conditioning: [["06:30", "Box Fit"], ["17:30", "Engine Room"], ["19:00", "Fight Rounds"]] }[v.goal] || [];
          return plan.map(([t, n]) => {
            const spots = seed(v.date + n) % 9;
            const easy = v.level === "new" && /Lab|Fight/.test(n);
            return { id: t, label: `${t} · ${n}`, detail: easy ? "Better after a few sessions." : `${spots ? spots + " of 12 spots left" : "Full"}`, disabled: !spots, note: easy ? "Recommended later" : "" };
          });
        } },
      ] },
      { label: "You", title: "Request your free class", fields: [nameField(), { type: "text", name: "phone", label: "Mobile number", required: true, input: "tel", max: 15, pattern: "^[+]?[0-9 ]{10,14}$", patternError: "Enter a 10-digit mobile number.", autocomplete: "tel" }, { type: "check", name: "health", label: "I have no injury or condition the coach should know about, or I’ll mention it on arrival.", required: true, error: "Please confirm the health note so the coach can plan safely." }] },
    ],
    estimate: () => ({ lines: [["Trial class", 0], ["Membership after", "from ₹3,200/mo"]], total: 0, totalLabel: "Due today" }),
    summary: (v, h) => [["Goal", h.opt("goal", v).label], ["Level", h.opt("level", v).label], ["Class", `${h.date(v.date)} · ${h.opt("klass", v)?.label || "—"}`], ...(v.name ? [["Name", h.esc(v.name)]] : [])],
    rowTitle: (v, h) => `${h.esc(v.name)} · ${h.opt("klass", v)?.label.split(" · ")[1] || "Trial"}`,
    receipt: { kicker: "Saved on this device", title: "Your trial request is ready.", text: "Review your class below. Nothing has been sent and no spot is held; contact Kinetic Yard to confirm. On the day, arrive 10 minutes early and bring water." },
    owner: "Trial requests",
    sendLabel: "Save trial request",
  },

  // 5 ─ Tutors & learning centres
  brightpath: {
    ...IN,
    key: "brightpath",
    cls: "kt-path",
    brand: "Brightpath",
    wordmark: "Brightpath<sup>✎</sup>",
    place: "Tutoring · Kothrud & online",
    hero: { layout: "note", img: "path-hero", alt: "A tidy study desk with notebooks, a lamp and a mug of pencils", kicker: "Grades 6–12 · CBSE & ICSE", title: "One good teacher<br><em>changes the year.</em>", text: "Pick a subject and level, choose how you’d like to learn and book a free trial lesson." },
    facts: [["1:4", "max group size"], ["40 min", "trial lesson"], ["92%", "renew after month one"]],
    sideTitle: "Monthly plan",
    steps: [
      { label: "Subject", title: "Choose a subject and level", fields: [
        { type: "cards", name: "subject", label: "Subject", cols: 3, options: [
          { id: "maths", label: "Mathematics", detail: "Algebra to calculus, step by step.", img: "path-maths" },
          { id: "science", label: "Science", detail: "Physics, chemistry and biology labs.", img: "path-science" },
          { id: "english", label: "English", detail: "Reading, writing and exam essays.", img: "path-english" },
        ] },
        { type: "select", name: "grade", label: "Grade", options: [{ id: "6-8", label: "Grades 6–8" }, { id: "9-10", label: "Grades 9–10" }, { id: "11-12", label: "Grades 11–12" }] },
      ] },
      { label: "Format", title: "How would you like to learn?", fields: [
        { type: "chips", name: "format", label: "Format", options: [{ id: "centre", label: "At the Kothrud centre" }, { id: "online", label: "Live online" }] },
        { type: "count", name: "weekly", label: "Lessons per week", min: 1, max: 3, start: 2 },
      ] },
      { label: "Trial", title: "Choose a trial time", fields: [
        { type: "date", name: "date", label: "Trial day", minDays: 1, maxDays: 21, days: [1, 2, 3, 4, 5, 6], dayError: "Trial lessons run Monday to Saturday." },
        { type: "chips", name: "slot", label: "Time", options: (v) => (weekday(v.date) === 6 ? ["10:00", "11:30", "13:00"] : ["16:00", "17:15", "18:30"]).map((t) => ({ id: t, label: t, disabled: v.format === "centre" && seed(v.date + t + v.subject) % 3 === 0 })) },
      ] },
      { label: "Learner", title: "Who is learning?", fields: [nameField("Learner’s name"), { type: "text", name: "parent", label: "Parent or guardian", required: true, max: 80 }, replyField] },
    ],
    estimate(v, h) {
      const rate = { "6-8": 650, "9-10": 800, "11-12": 950 }[v.grade] - (v.format === "online" ? 100 : 0);
      return { lines: [["Trial lesson", 0], [`${v.weekly} × 4 lessons at ${h.money(rate)}`, rate * v.weekly * 4]], total: rate * v.weekly * 4, totalLabel: "Per month after trial", note: "Books and practice papers included." };
    },
    summary: (v, h) => [["Subject", `${h.opt("subject", v).label} · ${h.opt("grade", v)?.label || v.grade}`], ["Format", `${h.opt("format", v).label}, ${v.weekly}/week`], ["Trial", `${h.date(v.date)} · ${v.slot || "—"}`], ...(v.name ? [["Learner", h.esc(v.name)]] : [])],
    rowTitle: (v, h) => `${h.esc(v.name)} · ${h.opt("subject", v).label}`,
    receipt: { kicker: "Saved on this device", title: "Your trial request is ready.", text: "Review the lesson and monthly plan below. Nothing has been sent or booked; contact Brightpath to confirm the time." },
    owner: "Trial lessons",
    sendLabel: "Save trial request",
  },

  // 6 ─ Pet care & boarding
  "wagtail-lodge": {
    ...IN,
    key: "wagtail-lodge",
    cls: "kt-wag",
    brand: "Wagtail Lodge",
    wordmark: "wagtail lodge",
    place: "Pet boarding · Wakad",
    hero: { layout: "blob", img: "wag-hero", alt: "A happy golden dog lying on a plum cushion in a sunny lodge", kicker: "Boarding · Day care · Grooming", title: "A holiday<br><em>for them too.</em>", text: "Tell us about your pet, pick a suite and your dates. We check space and vaccination before confirming." },
    facts: [["24/7", "on-site carers"], ["1 acre", "play garden"], ["Vet", "on call"]],
    sideTitle: "Stay estimate",
    steps: [
      { label: "Pet", title: "Tell us about your pet", fields: [
        { type: "chips", name: "species", label: "Pet", options: [{ id: "dog", label: "Dog" }, { id: "cat", label: "Cat" }] },
        { type: "chips", name: "size", label: "Size", options: (v) => (v.species === "cat" ? [{ id: "cat", label: "Any cat" }] : [{ id: "small", label: "Small · under 10 kg" }, { id: "medium", label: "Medium · 10–25 kg" }, { id: "large", label: "Large · over 25 kg" }]) },
        { type: "count", name: "pets", label: "Pets from the same home", min: 1, max: 3 },
        { type: "text", name: "petname", label: "Pet’s name", required: true, max: 40 },
      ] },
      { label: "Suite", title: "Choose a suite", fields: [{ type: "cards", name: "suite", label: "Suite", cols: 3, options: (v) => [
        { id: "cosy", label: "Cosy Den", detail: "Indoor suite with a raised bed. 1 pet.", img: "wag-standard", price: 1200, unit: "/night", cap: 1 },
        { id: "garden", label: "Garden Suite", detail: "Opens onto a private run. Up to 2.", img: "wag-garden", price: 1800, unit: "/night", cap: 2 },
        { id: "deluxe", label: "Deluxe Lodge", detail: "Sofa, webcam and garden. Up to 3.", img: "wag-deluxe", price: 2600, unit: "/night", cap: 3 },
      ].map((o) => ({ ...o, disabled: v.pets > o.cap || (v.size === "large" && o.id === "cosy"), note: v.pets > o.cap ? `Holds ${o.cap}` : v.size === "large" && o.id === "cosy" ? "Too snug for large dogs" : "" })) }] },
      { label: "Dates", title: "Dates and extras", fields: [
        { type: "date", name: "checkin", label: "Drop-off", minDays: 1, maxDays: 150 },
        { type: "date", name: "checkout", label: "Pick-up", after: "checkin", maxSpan: 30, offset: 3 },
        { type: "chips", name: "extras", label: "Extras", multi: true, options: (v) => [
          ...(v.species === "dog" ? [{ id: "walk", label: "Extra beach walk", priceText: "₹300/night" }] : []),
          { id: "groom", label: "Bath & groom before pick-up", price: 900 },
          { id: "cam", label: "Daily photo report", priceText: "₹150/night" },
        ] },
        { type: "check", name: "vaccine", label: "My pet’s vaccinations (rabies and DHPP or FVRCP) are up to date and I can show the card at drop-off.", required: true, error: "We can only board pets with current vaccinations." },
      ] },
      { label: "Owner", title: "Your details", fields: [nameField("Owner’s name"), { type: "text", name: "phone", label: "Mobile number", required: true, input: "tel", max: 15, pattern: "^[+]?[0-9 ]{10,14}$", patternError: "Enter a 10-digit mobile number.", autocomplete: "tel" }] },
    ],
    estimate(v, h) {
      const s = h.opt("suite", v) || { label: "Suite", price: 0 };
      const n = h.nights(v.checkin, v.checkout);
      const extraPet = v.pets > 1 ? pct(s.price, 50) * (v.pets - 1) : 0;
      const lines = [[`${s.label} × ${n} night${n > 1 ? "s" : ""}`, s.price * n]];
      if (extraPet) lines.push([`Additional pet × ${v.pets - 1}`, extraPet * n]);
      if (v.extras.includes("walk")) lines.push([`Beach walks × ${n}`, 300 * n * v.pets]);
      if (v.extras.includes("groom")) lines.push(["Bath & groom", 900 * v.pets]);
      if (v.extras.includes("cam")) lines.push([`Photo report × ${n}`, 150 * n]);
      return { lines, total: lines.reduce((a, l) => a + l[1], 0), note: "Includes meals, two walks or play sessions daily." };
    },
    summary: (v, h) => [["Pet", `${v.petname ? h.esc(v.petname) + " · " : ""}${h.opt("species", v).label}, ${h.opt("size", v)?.label || ""}${v.pets > 1 ? ` (+${v.pets - 1})` : ""}`], ["Suite", h.opt("suite", v)?.label || "—"], ["Stay", `${h.date(v.checkin)} → ${h.date(v.checkout)}`], ...(v.name ? [["Owner", h.esc(v.name)]] : [])],
    rowTitle: (v, h) => `${h.esc(v.petname)} · ${h.opt("suite", v)?.label}`,
    receipt: { kicker: "Saved on this device", title: "Your stay enquiry is ready.", text: "Review the suite, dates and estimated total below. Nothing has been sent or booked; contact Wagtail Lodge to confirm, and keep the vaccination card handy." },
    owner: "Boarding requests",
    sendLabel: "Save stay enquiry",
  },

  // 7 ─ Clinics & therapists
  stillwater: {
    ...IN,
    key: "stillwater",
    cls: "kt-still",
    brand: "Stillwater",
    wordmark: "stillwater",
    place: "Counselling practice · Aundh & online",
    hero: { layout: "calm", img: "still-hero", alt: "A calm counselling room with a linen armchair, plants and soft morning light", kicker: "Individual · Couples · Teen counselling", title: "A quiet place<br><em>to begin.</em>", text: "Choose the kind of support you’re looking for and a first-session time. You only share what you’re comfortable with." },
    facts: [["RCI", "registered counsellors"], ["50 min", "sessions"], ["English", "Hindi · Marathi"]],
    sideTitle: "Your first session",
    sideNote: '<p class="kt-note">If you are in crisis or thinking of harming yourself, please call your local emergency number or Tele-MANAS on 14416.</p>',
    steps: [
      { label: "Support", title: "What kind of support?", fields: [{ type: "cards", name: "support", label: "Support", cols: 3, options: [
        { id: "individual", label: "Individual", detail: "Stress, anxiety, low mood, life changes.", img: "still-session", price: 2200, unit: "/50 min" },
        { id: "couples", label: "Couples", detail: "Communication, conflict, transitions.", img: "still-garden", price: 3200, unit: "/75 min" },
        { id: "teen", label: "Teen (13–18)", detail: "With a parent joining the first session.", img: "still-online", price: 2000, unit: "/50 min" },
      ] }] },
      { label: "Time", title: "How and when?", fields: [
        { type: "chips", name: "mode", label: "Session", options: [{ id: "room", label: "In person, Aundh" }, { id: "video", label: "Video call" }] },
        { type: "date", name: "date", label: "Preferred day", minDays: 2, maxDays: 30, days: [1, 2, 3, 4, 5, 6], dayError: "The practice is closed on Sundays." },
        { type: "chips", name: "slot", label: "Time", options: (v) => ["09:30", "11:00", "13:30", "16:00", "18:30"].map((t) => ({ id: t, label: t, disabled: (v.mode === "room" && t === "18:30") || seed(v.date + t) % 4 === 0 })) },
      ] },
      { label: "About you", title: "A little about you", intro: "Only your first name and a way to reach you are needed.", fields: [
        { type: "text", name: "name", label: "First name", required: true, max: 40, autocomplete: "given-name" },
        replyField,
        { type: "chips", name: "language", label: "Preferred language", options: [{ id: "en", label: "English" }, { id: "hi", label: "Hindi" }, { id: "mr", label: "Marathi" }] },
        { type: "text", name: "note", label: "Anything you’d like the counsellor to know", long: true, max: 400 },
        { type: "check", name: "consent", label: "I understand this request is saved only on this device, is not sent to a practice and is not an emergency service.", required: true, error: "Please confirm you’ve read this note." },
      ] },
    ],
    estimate: (v, h) => {
      const s = h.opt("support", v);
      return { lines: [[`${s.label} session`, s.price]], total: s.price, totalLabel: "Session fee", note: "Pay after the session. Sliding-scale fees on request." };
    },
    summary: (v, h) => [["Support", h.opt("support", v).label], ["Session", `${h.opt("mode", v).label} · ${h.date(v.date)}, ${v.slot || "—"}`], ...(v.name ? [["Name", h.esc(v.name)]] : [])],
    rowTitle: (v, h) => `${h.esc(v.name)} · ${h.opt("support", v).label}`,
    receipt: { kicker: "Saved on this device", title: "Your request is ready.", text: "Review your preferred session below. Nothing has been sent or booked. If you need help now, call Tele-MANAS on 14416 or your local emergency number." },
    owner: "Session requests",
    sendLabel: "Save request",
  },

  // 8 ─ Photographers & creatives
  "frame-field": {
    ...IN,
    key: "frame-field",
    cls: "kt-frame",
    brand: "Frame & Field",
    wordmark: "FRAME&amp;FIELD",
    place: "Photography studio · Pune & on location",
    hero: { layout: "gallery", img: "frame-hero", alt: "A photographer’s studio with a medium-format camera and a single orange backdrop", kicker: "Portraits · Products · Events", title: "Start with<br><em>the picture.</em>", text: "Pick the kind of shoot from our work, add what you need delivered, and leave with a brief we can quote on." },
    facts: [["2015", "shooting since"], ["48 h", "preview gallery"], ["Full", "usage rights"]],
    sideTitle: "Brief estimate",
    steps: [
      { label: "Shoot", title: "Which shoot is closest?", fields: [{ type: "cards", name: "shoot", label: "Shoot", cols: 3, filters: ["All", "People", "Product", "Events"], options: [
        { id: "portrait", label: "Portraits", detail: "Headshots, families, personal brand.", img: "frame-portrait", price: 6000, unit: "/hour", tags: ["People"] },
        { id: "product", label: "Product & food", detail: "Packshots, menus, lifestyle sets.", img: "frame-product", price: 8000, unit: "/hour", tags: ["Product"] },
        { id: "event", label: "Events", detail: "Launches, talks, celebrations.", img: "frame-event", price: 7000, unit: "/hour", tags: ["Events", "People"] },
      ] }] },
      { label: "Deliver", title: "What should we deliver?", fields: [
        { type: "count", name: "hours", label: "Hours on set", min: 1, max: 10, start: 3 },
        { type: "chips", name: "deliver", label: "Deliverables", multi: true, required: true, error: "Choose at least one deliverable.", options: [
          { id: "edits", label: "Retouched photos", price: 4000 },
          { id: "reel", label: "30-second reel", price: 9000 },
          { id: "prints", label: "Fine-art prints", price: 3500 },
          { id: "raw", label: "All selects", price: 2500 },
        ] },
        { type: "select", name: "usage", label: "Where will it be used?", options: [{ id: "personal", label: "Personal use" }, { id: "web", label: "Website & social" }, { id: "ads", label: "Paid ads & print" }] },
      ] },
      { label: "Brief", title: "The brief", fields: [
        { type: "date", name: "date", label: "Shoot date", minDays: 5, maxDays: 120 },
        { type: "text", name: "idea", label: "Describe the shoot", long: true, required: true, max: 500, placeholder: "Mood, location, people or products, references…" },
        nameField(),
        replyField,
      ] },
    ],
    estimate(v, h) {
      const s = h.opt("shoot", v);
      const lines = [[`${s.label} × ${v.hours} h`, s.price * v.hours]];
      for (const d of h.opts("deliver", v)) lines.push([d.label, d.price]);
      const sub = lines.reduce((a, l) => a + l[1], 0);
      const up = { personal: 0, web: 15, ads: 40 }[v.usage];
      if (up) lines.push([`Usage licence (+${up}%)`, pct(sub, up)]);
      return { lines, total: sub + pct(sub, up), note: "Travel inside Pune included." };
    },
    summary: (v, h) => [["Shoot", `${h.opt("shoot", v).label} · ${v.hours} h`], ["Deliver", h.opts("deliver", v).map((d) => d.label).join(", ") || "—"], ["Usage", h.opt("usage", v)?.label || v.usage], ["Date", h.date(v.date)], ...(v.idea ? [["Brief", h.esc(v.idea.slice(0, 120)) + (v.idea.length > 120 ? "…" : "")]] : [])],
    rowTitle: (v, h) => `${h.esc(v.name)} · ${h.opt("shoot", v).label}`,
    receipt: { kicker: "Saved on this device", title: "Your brief is ready.", text: "Review the shoot and estimate below. Nothing has been sent or reserved; contact the studio for a confirmed quote." },
    owner: "Shoot briefs",
    sendLabel: "Save the brief",
  },

  // 9 ─ Shops & boutiques
  "loom-lane": {
    ...IN,
    key: "loom-lane",
    cls: "kt-loom",
    brand: "Loom & Lane",
    wordmark: "Loom &amp; Lane",
    place: "Handloom boutique · Camp, Pune",
    hero: { layout: "shop", img: "loom-hero", alt: "Indigo handloom garments folded on oak shelves in a small boutique", kicker: "Small-batch indigo & handloom", title: "Made slowly,<br><span>worn often.</span>", text: "Browse the rail, pick a size and colour and ask us to hold a piece for you in store or ship it." },
    facts: [["38", "weaver families"], ["7 days", "hold in store"], ["Free", "alterations"]],
    sideTitle: "Your hold request",
    steps: [
      { label: "Piece", title: "Choose a piece", fields: [{ type: "cards", name: "item", label: "Piece", cols: 3, filters: ["All", "Clothing", "Bags", "Home"], options: loomProducts }] },
      { label: "Size", title: "Size, colour and quantity", fields: [
        { type: "chips", name: "size", label: "Size", options: (v) => loomProduct(v.item)?.measurement
          ? loomSizes.map((size) => ({ id: size, label: size, disabled: seed(v.item + size) % 5 === 0 }))
          : [{ id: "one", label: "One size" }] },
        { type: "chips", name: "colour", label: "Colour", options: (v) => (loomProduct(v.item)?.colours ?? []).map((colour) => ({ id: colour, label: colour })) },
        { type: "count", name: "qty", label: "Quantity", min: 1, max: (v) => (seed(v.item + v.size) % 3) + 2, hint: (v) => `${(seed(v.item + v.size) % 3) + 2} in stock for this size.` },
      ] },
      { label: "Collect", title: "How would you like it?", fields: [
        { type: "chips", name: "fulfil", label: "Delivery", options: [{ id: "store", label: "Hold in store for 7 days" }, { id: "ship", label: "Ship to me", priceText: "+₹150" }] },
        nameField(),
        { type: "text", name: "phone", label: "Mobile number", required: true, input: "tel", max: 15, pattern: "^[+]?[0-9 ]{10,14}$", patternError: "Enter a 10-digit mobile number.", autocomplete: "tel" },
      ] },
    ],
    estimate(v, h) {
      const it = h.opt("item", v);
      const lines = [[`${it.label} × ${v.qty}`, it.price * v.qty]];
      if (v.fulfil === "ship") lines.push(["Shipping", 150]);
      return { lines, total: lines.reduce((a, l) => a + l[1], 0), note: "Pay in store or by UPI link once we confirm." };
    },
    summary: (v, h) => [["Piece", h.opt("item", v).label], ["Size · colour", `${h.opt("size", v)?.label || "—"} · ${v.colour || "—"}`], ["Quantity", String(v.qty)], ["Delivery", h.opt("fulfil", v).label]],
    rowTitle: (v, h) => `${h.esc(v.name)} · ${h.opt("item", v).label}`,
    receipt: { kicker: "Saved on this device", title: "Your enquiry is ready.", text: "Review the piece and total below. Nothing has been sent, held or charged; contact the boutique to confirm availability." },
    owner: "Hold requests",
    sendLabel: "Save this enquiry",
  },

  // 10 ─ Automotive businesses
  "gloss-lab": {
    ...IN,
    key: "gloss-lab",
    cls: "kt-gloss",
    brand: "Gloss Lab",
    wordmark: "GLOSS<b>/</b>LAB",
    place: "Car detailing · Hinjewadi",
    hero: { layout: "dash", img: "gloss-hero", alt: "A black sports car under studio lights with water beading on the bonnet", kicker: "Detailing · Correction · Ceramic", title: "Showroom shine,<br><em>quoted to the rupee.</em>", text: "Pick your vehicle and package, add extras and choose a drop-off. The price and time update as you go." },
    facts: [["9H", "ceramic"], ["5 yr", "coating warranty"], ["Free", "pick-up under 10 km"]],
    sideTitle: "Build sheet",
    steps: [
      { label: "Vehicle", title: "What are we detailing?", fields: [
        { type: "chips", name: "size", label: "Vehicle", options: [{ id: "hatch", label: "Hatchback" }, { id: "sedan", label: "Sedan", priceText: "× 1.2" }, { id: "suv", label: "SUV / MUV", priceText: "× 1.45" }] },
        { type: "text", name: "model", label: "Make and model", required: true, max: 60, placeholder: "e.g. Hyundai Creta 2022" },
        { type: "select", name: "condition", label: "Paint condition", options: [{ id: "good", label: "Good · light swirls" }, { id: "fair", label: "Fair · visible scratches" }, { id: "rough", label: "Rough · oxidised or faded" }] },
      ] },
      { label: "Package", title: "Choose a package", fields: [
        { type: "cards", name: "pkg", label: "Package", cols: 3, options: (v) => {
          const m = { hatch: 1, sedan: 1.2, suv: 1.45 }[v.size] || 1;
          return [
            { id: "wash", label: "Signature Wash", detail: "Foam wash, clay, sealant. 3 hours.", img: "gloss-wash", base: 1499, hours: 3 },
            { id: "polish", label: "Paint Correction", detail: "Two-stage polish, glaze. 1 day.", img: "gloss-polish", base: 4999, hours: 8 },
            { id: "ceramic", label: "Ceramic Shield", detail: "Correction plus 9H coating. 2 days.", img: "gloss-ceramic", base: 14999, hours: 16 },
          ].map((o) => ({ ...o, price: Math.round((o.base * m) / 10) * 10, disabled: v.condition === "rough" && o.id === "wash", note: v.condition === "rough" && o.id === "wash" ? "Needs correction first" : "" }));
        } },
        { type: "chips", name: "addons", label: "Add-ons", multi: true, options: [
          { id: "steam", label: "Interior steam", price: 1200 },
          { id: "lights", label: "Headlight restore", price: 900 },
          { id: "engine", label: "Engine bay", price: 800 },
          { id: "glass", label: "Glass coating", price: 1500 },
        ] },
      ] },
      { label: "Drop-off", title: "Choose a drop-off", fields: [
        { type: "date", name: "date", label: "Drop-off day", minDays: 1, maxDays: 30 },
        { type: "chips", name: "slot", label: "Time", options: (v) => ["08:30", "10:00", "12:00"].map((t) => ({ id: t, label: t, disabled: seed(v.date + t) % 3 === 0 })) },
        { type: "chips", name: "pickup", label: "Pick-up", options: [{ id: "self", label: "I’ll drop it off" }, { id: "valet", label: "Collect from me", priceText: "free < 10 km" }] },
        nameField(),
        { type: "text", name: "phone", label: "Mobile number", required: true, input: "tel", max: 15, pattern: "^[+]?[0-9 ]{10,14}$", patternError: "Enter a 10-digit mobile number.", autocomplete: "tel" },
      ] },
    ],
    estimate(v, h) {
      const p = h.opt("pkg", v);
      if (!p) return { lines: [["Package", "Choose one"]], total: 0 };
      const lines = [[`${p.label} · ${h.opt("size", v).label}`, p.price]];
      if (v.condition === "fair" && p.id !== "wash") lines.push(["Extra correction stage", 1500]);
      for (const a of h.opts("addons", v)) lines.push([a.label, a.price]);
      const hrs = p.hours + h.opts("addons", v).length;
      lines.push(["Time in the bay", `${hrs} hours`]);
      return { lines, total: lines.reduce((a, l) => a + (typeof l[1] === "number" ? l[1] : 0), 0), note: "Price includes GST." };
    },
    summary: (v, h) => [["Vehicle", `${v.model ? h.esc(v.model) + " · " : ""}${h.opt("size", v).label}`], ["Package", h.opt("pkg", v)?.label || "—"], ["Drop-off", `${h.date(v.date)} · ${v.slot || "—"}`], ["Pick-up", h.opt("pickup", v).label]],
    rowTitle: (v, h) => `${h.esc(v.model)} · ${h.opt("pkg", v)?.label}`,
    receipt: { kicker: "Saved on this device", title: "Your request is ready.", text: "Review the package and estimated price below. Nothing has been sent or booked; contact the workshop to confirm the slot." },
    owner: "Workshop requests",
    sendLabel: "Save this request",
  },

  // 11 ─ Consultants & advisers
  northline: {
    ...IN,
    key: "northline",
    cls: "kt-north",
    brand: "Northline Advisory",
    wordmark: "Northline <i>Advisory</i>",
    place: "Business advisers · Senapati Bapat Road",
    hero: { layout: "memo", img: "north-hero", alt: "A walnut desk with a fountain pen, a leather folio and a brass lamp", kicker: "Tax · Funding · Contracts", title: "Bring the question.<br><em>Leave with a plan.</em>", text: "Describe what you need, attach nothing yet, and book a consultation that’s the right length for it." },
    facts: [["21 yrs", "advising founders"], ["CA · CS", "LLB on the team"], ["NDA", "on request"]],
    sideTitle: "Consultation",
    steps: [
      { label: "Topic", title: "What do you want to discuss?", fields: [
        { type: "cards", name: "topic", label: "Topic", cols: 3, options: [
          { id: "tax", label: "Tax & compliance", detail: "GST, TDS, notices, year-end.", img: "north-tax" },
          { id: "growth", label: "Growth & funding", detail: "Pricing, fundraising, unit economics.", img: "north-growth" },
          { id: "legal", label: "Contracts & legal", detail: "Founders’ agreements, vendors, IP.", img: "north-legal" },
        ] },
        { type: "chips", name: "stage", label: "Business stage", options: [{ id: "idea", label: "Pre-revenue" }, { id: "early", label: "Under ₹1 Cr" }, { id: "growth", label: "₹1–10 Cr" }, { id: "scale", label: "Over ₹10 Cr" }] },
      ] },
      { label: "Brief", title: "The question", fields: [
        { type: "text", name: "question", label: "What would make this consultation useful?", long: true, required: true, max: 600, placeholder: "e.g. We received a GST notice for FY24 and need to know our options before the reply date." },
        { type: "chips", name: "urgency", label: "Timing", options: [{ id: "flex", label: "Flexible" }, { id: "month", label: "This month" }, { id: "week", label: "This week", priceText: "+20%" }] },
        { type: "chips", name: "docs", label: "Documents you can share", multi: true, options: [{ id: "fin", label: "Financial statements" }, { id: "gst", label: "GST returns" }, { id: "deck", label: "Pitch deck" }, { id: "contract", label: "Draft contract" }] },
      ] },
      { label: "Book", title: "Choose a length and time", fields: [
        { type: "cards", name: "length", label: "Length", cols: 3, options: [
          { id: "30", label: "30 minutes", detail: "One focused question.", price: 2500 },
          { id: "60", label: "60 minutes", detail: "A problem and a plan.", price: 4500 },
          { id: "90", label: "90 minutes", detail: "Review with documents.", price: 6000 },
        ] },
        { type: "date", name: "date", label: "Preferred day", minDays: 1, maxDays: 30, days: [1, 2, 3, 4, 5], dayError: "Consultations run Monday to Friday." },
        { type: "text", name: "company", label: "Company", required: true, max: 80, autocomplete: "organization" },
        nameField(),
        { type: "text", name: "email", label: "Work email", required: true, input: "email", max: 120, pattern: "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$", patternError: "Enter a valid email address.", autocomplete: "email" },
      ] },
    ],
    check(v, i) {
      if (i >= 2 && v.length === "30" && v.docs.length > 1) return "Reviewing several documents needs at least 60 minutes. Choose a longer consultation.";
      return "";
    },
    estimate(v, h) {
      const l = h.opt("length", v);
      const lines = [[`${l.label} consultation`, l.price]];
      if (v.urgency === "week") lines.push(["Priority this week (+20%)", pct(l.price, 20)]);
      return { lines, total: lines.reduce((a, x) => a + x[1], 0), note: "Fee is credited if you engage us within 30 days." };
    },
    summary: (v, h) => [["Topic", `${h.opt("topic", v).label} · ${h.opt("stage", v).label}`], ["Length", `${h.opt("length", v).label} · ${h.date(v.date)}`], ["Documents", h.opts("docs", v).map((d) => d.label).join(", ") || "None yet"], ...(v.question ? [["Question", h.esc(v.question.slice(0, 120)) + (v.question.length > 120 ? "…" : "")]] : [])],
    rowTitle: (v, h) => `${h.esc(v.company)} · ${h.opt("topic", v).label}`,
    receipt: { kicker: "Saved on this device", title: "Your brief is ready.", text: "Review the question and consultation below. Nothing has been sent or booked; contact the practice to confirm a time." },
    owner: "Consultation briefs",
    sendLabel: "Save the brief",
  },

  // 12 ─ Manufacturers & wholesalers
  "mill-crate": {
    ...IN,
    key: "mill-crate",
    cls: "kt-mill",
    brand: "Mill & Crate",
    wordmark: "MILL&amp;CRATE <small>PKG</small>",
    place: "Corrugated packaging · Chakan MIDC",
    hero: { layout: "spec", img: "mill-hero", alt: "Stacks of kraft corrugated boxes on a factory pallet under bright light", kicker: "Boxes made to spec · MOQ 250", title: "Spec it.<br><em>Get a trade quote.</em>", text: "Choose a box, material, size and print. Tiered unit prices and lead time update with your quantity." },
    facts: [["250", "minimum order"], ["7–12 days", "lead time"], ["FSC", "certified board"]],
    sideTitle: "Quote sheet",
    steps: [
      { label: "Box", title: "Choose a box style", fields: [{ type: "cards", name: "box", label: "Box", cols: 3, options: [
        { id: "mailer", label: "Mailer box", detail: "Tuck-front, e-commerce ready.", img: "mill-mailer", price: 24, unit: "/unit from" },
        { id: "rigid", label: "Rigid gift box", detail: "Lid and base, wrapped board.", img: "mill-rigid", price: 68, unit: "/unit from" },
        { id: "shipper", label: "Shipping carton", detail: "3- or 5-ply RSC for transit.", img: "mill-shipper", price: 32, unit: "/unit from" },
      ] }] },
      { label: "Spec", title: "Material, size and print", fields: [
        { type: "chips", name: "material", label: "Board", options: (v) => [{ id: "kraft", label: "Natural kraft" }, { id: "white", label: "White top", priceText: "+8%" }, ...(v.box === "rigid" ? [] : [{ id: "five", label: "5-ply heavy", priceText: "+18%" }])] },
        { type: "chips", name: "size", label: "Size (L × W × H mm)", options: [{ id: "s", label: "S · 200×150×80" }, { id: "m", label: "M · 300×220×120", priceText: "× 1.35" }, { id: "l", label: "L · 400×300×200", priceText: "× 1.9" }] },
        { type: "chips", name: "print", label: "Print", options: [{ id: "none", label: "Unprinted" }, { id: "one", label: "1-colour logo", priceText: "+₹4/unit" }, { id: "full", label: "Full colour", priceText: "+₹11/unit" }] },
      ] },
      { label: "Quantity", title: "How many?", fields: [
        { type: "count", name: "qty", label: "Units", min: 250, max: 20000, step: 250, start: 1000, hint: "Breaks at 1,000 (−12%) and 5,000 (−22%)." },
        { type: "text", name: "company", label: "Company", required: true, max: 80, autocomplete: "organization" },
        { type: "text", name: "gstin", label: "GSTIN", max: 15, pattern: "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9A-Z]Z[0-9A-Z]$", patternError: "GSTIN looks like 27ABCDE1234F1Z5 (15 characters, capitals).", placeholder: "27ABCDE1234F1Z5" },
        { type: "text", name: "email", label: "Work email", required: true, input: "email", max: 120, pattern: "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$", patternError: "Enter a valid email address.", autocomplete: "email" },
      ] },
    ],
    estimate(v, h) {
      const box = h.opt("box", v);
      let unit = box.price * { s: 1, m: 1.35, l: 1.9 }[v.size] * { kraft: 1, white: 1.08, five: 1.18 }[v.material];
      unit += { none: 0, one: 4, full: 11 }[v.print];
      const tier = v.qty >= 5000 ? 22 : v.qty >= 1000 ? 12 : 0;
      unit = Math.round(unit * (1 - tier / 100) * 100) / 100;
      const plates = v.print === "none" ? 0 : v.print === "one" ? 3500 : 9000;
      const lines = [[`${box.label} × ${v.qty.toLocaleString("en-IN")}`, `${h.money(unit)}/unit`], ["Goods", Math.round(unit * v.qty)]];
      if (tier) lines.push(["Volume break", `−${tier}% applied`]);
      if (plates) lines.push(["Print plates (one-time)", plates]);
      lines.push(["Lead time", `${v.qty > 5000 ? 12 : v.print === "full" ? 10 : 7} working days`]);
      return { lines, total: Math.round(unit * v.qty) + plates, totalLabel: "Ex-works, before GST", note: "Freight quoted separately. Sample box free with orders over 1,000." };
    },
    summary: (v, h) => [["Box", `${h.opt("box", v).label} · ${h.opt("size", v).label}`], ["Board · print", `${h.opt("material", v)?.label || "—"} · ${h.opt("print", v).label}`], ["Quantity", v.qty.toLocaleString("en-IN") + " units"], ...(v.company ? [["Company", h.esc(v.company)]] : [])],
    rowTitle: (v, h) => `${h.esc(v.company)} · ${v.qty.toLocaleString("en-IN")} ${h.opt("box", v).label.toLowerCase()}`,
    receipt: { kicker: "Saved on this device", title: "Your quotation request is ready.", text: "Review the specification and estimated total below. Nothing has been sent; contact Mill & Crate for a formal quote." },
    owner: "Quotation requests",
    sendLabel: "Save quotation request",
  },
};
