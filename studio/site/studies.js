// Case studies for /work/<slug>. Daybreak has its own long-form page; every other project uses caseStudy() below.
// Everything here describes design and development work: no client quotes, no business results.

const shot = (file, alt, w, h, cls = '') =>
  `<figure class="cs-shot ${cls}"><img src="/assets/${file}.webp" alt="${alt}" width="${w}" height="${h}" loading="lazy" decoding="async"></figure>`;

const daybreak = ({ p, link, sample, similar, html }) => `
<section class="cs-intro">
  <p class="cs-note">Business details, people, prices and guest notes on this website are illustrative and its pictures are AI-generated. Table requests are kept in the visitor’s browser; nothing is sent and no booking is taken.</p>
  <div class="cs-two cs-lead"><h2>Project overview</h2><p>${html(p.role)}</p></div>
  <div class="cs-two">
    <div><p class="ct-eyebrow">Website objectives</p><h2>A neighbourhood café that is easy to choose from your phone.</h2></div>
    <div><p>Most café websites are a PDF menu and an Instagram link. Someone standing outside cannot tell what to order, whether it is vegetarian, or how to ask about a table for twelve without calling. The site answers those questions in the first three screens and still feels like a calm morning in Pune.</p></div>
  </div>
</section>

<section class="cs-band">
  ${shot('case-daybreak-home-desktop', 'Daybreak Café home page on a desktop screen: a sunlit café interior behind the heading Good mornings begin here.', 1440, 900, 'cs-desk')}
  ${shot('case-daybreak-home-mobile', 'The same home page on a phone, with the address and booking button in the first screen.', 390, 844, 'cs-phone')}
</section>

<section class="cs-two">
  <div><p class="ct-eyebrow">Design direction</p><h2>Morning light, forest green and cream plaster.</h2></div>
  <div><p>The images were generated with AI to one art direction: low sun through a side window, white marble, oak, cane chairs and the same speckled stoneware, so the menu reads as one kitchen. The interface stays quiet so the food does the selling: one serif for the café’s voice, one sans for reading, and a sunrise mark that introduces each section.</p></div>
</section>

<section class="cs-identity" aria-label="Identity">
  <div class="cs-swatches">${[['#15392d', 'Forest'], ['#a8bc9c', 'Sage'], ['#f8f3e5', 'Cream'], ['#382b23', 'Espresso'], ['#e6b94e', 'Morning gold']].map(([c, n]) => `<span style="--c:${c}"><b>${n}</b>${c}</span>`).join('')}</div>
  <div class="cs-type"><p class="cs-serif">Good mornings <em>begin here.</em></p><p class="cs-sans">Instrument Serif for the voice, DM Sans for reading. Both are open-source and served as small Latin subsets.</p></div>
</section>

<section class="cs-feature">
  <div class="cs-feature-shots">
    ${shot('case-daybreak-menu-mobile', 'The menu on a phone, filtered to vegetarian dishes, with search and section links.', 390, 844, 'cs-phone')}
    ${shot('case-daybreak-dish-mobile', 'A dish page on a phone: photo, price, ingredients, allergens and what to pair it with.', 390, 844, 'cs-phone')}
  </div>
  <div><p class="ct-eyebrow">Implemented functionality</p><h2>39 dishes, each with its own page.</h2>
    <ul><li>Instant search and diet filters that update the address, so a filtered menu can be shared.</li><li>Diet marks follow Indian practice: dishes with egg are not labelled vegetarian, and the Vegetarian filter shows only egg-free dishes.</li><li>Every dish page lists ingredients, allergens and pairings, and drink options re-price live.</li><li>Every dish has its own picture, made to match its ingredients and the rest of the menu.</li></ul></div>
</section>

<section class="cs-feature cs-flip">
  <div class="cs-feature-shots">${shot('case-daybreak-booking-mobile', 'The table request form on a phone, asking for date, time, guests and seating.', 390, 844, 'cs-phone')}</div>
  <div><p class="ct-eyebrow">Reservations</p><h2>A request flow guests can follow at a glance.</h2>
    <ul><li>One form for a table or a group, with a review step before anything is saved.</li><li>Times that don’t work are disabled instead of explained in errors: group tables are seated by 5 pm, and a private evening always starts at 8 pm.</li><li>The request is saved only in the visitor’s browser and clearly labelled as not sent and not confirmed. It can be copied, downloaded or deleted, and requests for past dates delete themselves.</li><li>Phone, email and WhatsApp links stay inactive until a business supplies its own contact details.</li></ul></div>
</section>

<section class="cs-feature">
  <div class="cs-feature-shots">${shot('case-daybreak-gallery-desktop', 'The gallery page on desktop: a grid of café, coffee and people photographs with filters.', 1440, 900, 'cs-desk')}</div>
  <div><p class="ct-eyebrow">Gallery</p><h2>The room, the plates and the people.</h2>
    <ul><li>Filters for the space, coffee, food and people.</li><li>A full-screen viewer that works with arrow keys, swipe and Escape, and returns focus to the photo you opened.</li></ul></div>
</section>

<section class="cs-two">
  <div><p class="ct-eyebrow">Customer experience</p><h2>From the pavement to a table.</h2></div>
  <div><ol class="cs-steps">${p.steps.map((s) => `<li>${html(s)}</li>`).join('')}</ol></div>
</section>

<section class="cs-two cs-tech">
  <div><p class="ct-eyebrow">Technical highlights</p><h2>Built to load fast on a mid-range phone.</h2></div>
  <div><ul>
    <li>Server-rendered pages with no framework. Every page, filter and dish option has a real address that survives a refresh.</li>
    <li>Fonts cut from 265 KB to 75 KB, with the heading font preloaded.</li>
    <li>Every picture has a smaller phone version, and pictures below the first screen load lazily.</li>
    <li>A skip link, visible focus, labelled form errors, reduced-motion support and a branded 404 for mistyped addresses.</li>
  </ul></div>
</section>

<section class="cs-cta">
  <h2>Want a site like this for your café?</h2>
  <p>We can build a version with your real menu, photos and booking details.</p>
  <div class="ct-actions">${link(p.url, p.action, 'primary')}${link(sample, similar)}</div>
</section>`;

function photographyStudy({p, link, sample, similar}) {
  const features = [
    ['archive', 'Choose a visual language', 'The archive pairs a subject filter with a title search. A product client can compare two still-life series and share the filtered URL with a colleague.', 'work?category=products', 'Browse product work'],
    ['gallery', 'Look closely at a photograph', 'The project story explains the brief, lighting and approach. Its contact sheet opens a full-screen viewer with captions, thumbnails, a zoom control and keyboard or swipe navigation.', 'work/portrait-studies', 'Open a project'],
    ['service', 'Understand the commission', 'Eight service guides explain who each session suits, what to bring, what is delivered and how the work is priced.', 'services/products', 'See product photography'],
    ['pricing', 'Compare a package and extras', 'Package inclusions, session length and optional production extras sit beside one indicative total in Indian rupees. Selected options carry into the shoot planner.', 'pricing', 'Compare packages'],
    ['book', 'Prepare a shoot enquiry', 'The client sets a preferred date, location and use for the pictures, reviews the estimate and edits individual steps before downloading a brief.', 'book', 'Try the planner'],
    ['quote', 'Brief a larger production', 'A separate quotation form collects shoot days, locations, usage rights, required images, budget and delivery deadline.', 'quote', 'Prepare a quotation brief']
  ];
  return `<section class="cs-intro"><p class="cs-note">Frame &amp; Field is a fictional Pune studio. The imagery and prices illustrate the proposed customer experience.</p><div class="cs-two"><h2>From photograph to commission.</h2><div><p>The original archive opened with three image links. A visitor could recognise the work but had little guidance on choosing a session, comparing prices or explaining the intended use.</p><p>The redesign gives each series a story and a route into commissioning similar work.</p></div></div></section>
<section class="cs-band">${shot('screen-frame-field','Vermilion cover and a fashion portrait on the desktop home page.',1440,900,'cs-desk')}${shot('frame-field-preview-mobile','The art-directed mobile cover, with its portrait beneath the headline.',390,844,'cs-phone')}</section>
<section class="cs-two"><h2>Art direction.</h2><div><p>A moving sari and a vermilion type panel share the opening spread. Warm paper and charcoal carry the archive, while Inter Tight, italic Newsreader and monospaced captions establish the hierarchy. Each concept series follows a consistent subject, setting and light. The presentation changes scale between full landscape prints and paired studies.</p></div></section>
${features.map(([asset,title,body,route,action])=>`<section class="cs-two"><div><h2>${title}</h2><p>${body}</p><a href="${p.url}/${route}">${action}</a></div>${shot('frame-field-preview-'+asset,title+' on the rendered photography website.',900,605,'cs-desk')}</section>`).join('')}
<section class="cs-two"><h2>Implementation.</h2><p>Each page is directly addressable. Responsive WebP photographs, a small gallery module and locally calculated estimates keep the site usable on a phone. Preparing a brief takes place in the browser. The visitor chooses whether to keep a copy with contact details.</p></section>
<section class="cs-cta"><h2>Bring this experience to your studio.</h2><div class="ct-actions">${link(p.url,'Visit Frame &amp; Field','primary')}${link(sample,similar)}</div></section>`;
}
function boutiqueStudy({p, link, sample, similar, html}) {
  const features = [
    ['screen-loom-lane', 'Find a piece worth a closer look.', 'Clothing, bags and home each have a filter. Search and price sorting work alongside the categories, and the result has a URL you can share.', 'collection', 'Browse the collection'],
    ['loom-lane-preview-piece', 'Check the cloth, fit and available sizes.', 'All 18 pieces have their own product photograph, material details and care notes. Variant choices carry into a direct enquiry. The fit guide lists chest or waist measurements for each sized garment.', 'pieces/drawstring-trouser', 'Open the drawstring trousers'],
    ['loom-lane-preview-enquiry', 'Prepare one enquiry for the whole bag.', 'The bag holds exact sizes, colours and quantities for the session. Choose a shop hold or shipping, review the estimated total, then copy or download the draft.', 'request', 'Try the enquiry'],
  ];
  return `<section class="cs-intro">
    <p class="cs-note">Loom &amp; Lane is a fictional boutique in Pune. Prices and availability are illustrative. The enquiry prepares a draft in the browser.</p>
    <div class="cs-two"><h2>From browsing to a shop hold.</h2><p>${html(p.role)} The site also gives customers a way to compare measurements and look up how to care for a piece after they take it home.</p></div>
  </section>
  <section class="cs-band">
    ${shot('case-loom-lane-desktop', 'Loom &amp; Lane storefront on desktop, with indigo lettering and a photograph of the boutique.', 1440, 900, 'cs-desk')}
    ${shot('case-loom-lane-mobile', 'Loom &amp; Lane storefront on a phone.', 390, 844, 'cs-phone')}
  </section>
  <section class="cs-two"><h2>Indigo on cream paper.</h2><p>Bitter’s sturdy slab serifs and fine rules give the catalogue the feel of a printed shop lookbook. Product photography shows the weave, shape and details shoppers compare, with twelve new images generated using ChatGPT. The collection becomes a two-column rail on phones.</p></section>
  ${features.map(([asset, title, description, route, action]) => `<section class="cs-two"><div><h2>${title}</h2><p>${description}</p>${link(p.url + "/" + route, action)}</div>${shot(asset, title, 1440, 900, 'cs-desk')}</section>`).join('')}
  <section class="cs-cta"><h2>Need a boutique website?</h2><div class="ct-actions">${link(p.url,'Visit Loom &amp; Lane','primary')}${link(sample,similar)}</div></section>`;
}
export const studies = { 'daybreak-cafe': daybreak, 'frame-field': photographyStudy, 'loom-lane': boutiqueStudy };

// Shared by every website hosted here.
const hosted = [
  'Server-rendered pages without a front-end framework, so every page has an address that survives a refresh.',
  'Choices travel in the address: a room, service or package picked while browsing is already selected in the enquiry.',
  'Responsive from small phones to wide screens, with keyboard access, visible focus and reduced-motion support.'
];
// goals: website objectives · direction: design direction · features: implemented functionality · tech: technical highlights
export const notes = {
  sidekick: {
    goals: ['Explain a two-app product in one screen.', 'Set honest expectations about supported devices before anyone asks for access.', 'Make the privacy approach easy to check.'],
    direction: 'A warm paper background, heavy display type and one electric lime accent. The product interface is the picture, so visitors see the Mac and Android apps working together before they read a feature list.',
    features: ['Screen mirroring, notification replies, file transfer and a shared clipboard between an Android phone and a Mac.', 'Pairing by QR code.', 'A product website with features, setup steps, roadmap, privacy and questions.'],
    tech: ['The two devices connect directly over local Wi-Fi, with no cloud relay and no account.', 'For Apple silicon Macs on macOS 11 or later and phones on Android 10 or later.']
  },
  'salon-booking': {
    goals: ['Let visitors choose by the look they want, not only by a service name.', 'Show the price for their hair length before they enquire.', 'Match each appointment to the right stylist and a time that fits.'],
    direction: 'A fashion-spread feel: tall portrait crops, condensed headlines, warm paper and a single oxblood accent.',
    features: ['A lookbook filtered by stylist, with a page for every look.', 'A menu that re-prices by hair length.', 'Stylist profiles that open the planner with that stylist selected.', 'Appointment times that respect service duration, stylist shifts and earlier requests in the same browser.'],
    tech: hosted
  },
  manakar: {
    goals: ['Introduce the psychologist and their approach with warmth and clarity.', 'Help visitors understand the services before they reach out.', 'Give the practice one clear appointment route.'],
    direction: 'Soft botanical imagery, muted greens and generous spacing. The name appears in both Devanagari and Latin script.',
    features: ['Practitioner introduction, services, approach and resources.', 'An appointment request with service, preferred date and preferred time.', 'A WhatsApp contact route on every screen.'],
    tech: ['A responsive single-page structure with section navigation.', 'Live on the practice’s own domain.']
  },
  'casa-neem': {
    goals: ['Help guests prefer a room before they look at the rate.', 'Keep dates and guests in place while they compare.', 'Show an honest total, night by night.'],
    direction: 'Warm paper, terracotta and courtyard light, with an unhurried serif. The house comes first; the date bar stays close.',
    features: ['Three room pages with galleries, facilities and rates.', 'Capacity checks that suggest a larger room when a party doesn’t fit.', 'An itemised stay total with extras and taxes.', 'A local guide and questions.'],
    tech: hosted
  },
  'hall-eleven': {
    goals: ['Let planners see the hall set for their kind of event.', 'Give a realistic per-guest figure early.', 'Keep every choice within the room’s capacity.'],
    direction: 'Midnight blue, champagne type and candlelit photography, paced like an evening.',
    features: ['Pages for banquet, theatre and cocktail setups, with capacities.', 'Wedding, corporate and celebration pages with galleries.', 'Three menus with full courses.', 'A live estimate that carries into the date enquiry.'],
    tech: ['The estimator is a plain form, so its choices carry straight into the date enquiry.', ...hosted]
  },
  brightnest: {
    goals: ['Answer “do you cover my area and what will it cost?” first.', 'Explain what each clean includes.', 'Give the team every detail that changes the price.'],
    direction: 'Fresh white and mint with rounded shapes and clear, friendly type.',
    features: ['Neighbourhood coverage check.', 'Standard, deep and move-out packages with their own pages.', 'A quote built from property type, bedrooms, bathrooms, extras and visit frequency.', 'Arrival windows that update with the chosen day.'],
    tech: hosted
  },
  'kinetic-yard': {
    goals: ['Put this week’s classes one tap from the home page.', 'Reassure first-timers about the coach and the level.', 'Make membership prices easy to compare.'],
    direction: 'Black, chalk and bright orange with oversized type: an energetic departure board for training.',
    features: ['A timetable with day tabs and training-goal filters.', 'Program and coach pages.', 'Membership pricing for one, three and twelve months.', 'A trial request that only offers classes with space.'],
    tech: ['Timetable tabs and filters update in place and still work as ordinary links.', ...hosted]
  },
  brightpath: {
    goals: ['Let families experience the teaching before they enquire.', 'Make lesson format and monthly cost clear.', 'Collect the subject, grade and time in one request.'],
    direction: 'A ruled-notebook layout with a chapter margin, warm paper and ink blue.',
    features: ['A subject library with a practice question and explanation for each.', 'Grade selection that carries into the trial request.', 'Centre or online lessons with a monthly plan estimate.', 'Trial times that follow the day and format.'],
    tech: hosted
  },
  'wagtail-lodge': {
    goals: ['Show where a pet will sleep and how the day runs.', 'Only offer suites that suit the pet.', 'Collect the care details a lodge needs.'],
    direction: 'Plum and sunny yellow, rounded signs and candid animal photography.',
    features: ['A lodge tour with suite pages, rates and capacity.', 'Suite options that respond to the pet’s size and number.', 'Dates, extras and a vaccination confirmation.', 'A printable packing checklist and a daily routine.'],
    tech: hosted
  },
  stillwater: {
    goals: ['Make the first step feel calm and private.', 'Explain services, fees and the first session in plain language.', 'Ask only for what is needed.'],
    direction: 'Quiet lavender, readable serif paragraphs and generous line spacing. The home page reads like a letter.',
    features: ['Services with fees and session length.', 'A first-session guide with in-person and online routes.', 'A short appointment request that needs only a first name.', 'A clear emergency note beside the form.'],
    tech: hosted
  },
  'frame-field': {
    goals: ['Lead with the photographs.', 'Connect each story to the service behind it.', 'Help clients prepare a brief a photographer can price.'],
    direction: 'Editorial white space, a fine serif and large photographs that carry the navigation. The pictures were generated for this website.',
    features: ['A filterable portfolio with project stories.', 'Service pages, package comparison and an estimate worksheet.', 'A studio journal.', 'Shoot, quotation and contact planners that can be copied, downloaded or saved on the device.'],
    tech: ['One stylesheet and one browser module per page.', ...hosted]
  },
  'gloss-lab': {
    goals: ['Show what each treatment changes.', 'Price by vehicle size and paint condition.', 'Set expectations on workshop time.'],
    direction: 'Graphite, cool metal tones and diagnostic labels, like an inspection bay.',
    features: ['Treatment pages with workshop time.', 'An interactive finish comparison.', 'A configurator for vehicle, condition, package and add-ons.', 'Drop-off times and an aftercare guide.'],
    tech: hosted
  },
  northline: {
    goals: ['Show how the practice thinks before a visitor enquires.', 'Arrive at the first meeting with the question written down.', 'Match the question to the right meeting length.'],
    direction: 'An advisory journal: navy headlines, generous margins and newspaper columns.',
    features: ['Decision memos for tax, growth and contracts.', 'Agenda items that carry into the consultation brief.', 'Urgency, documents and meeting length with a fee estimate.', 'Printable memos.'],
    tech: ['The brief asks for a longer meeting when several documents need review.', ...hosted]
  },
  'mill-crate': {
    goals: ['Let procurement compare specifications first.', 'Make quantity breaks visible.', 'Produce a request the estimating team can price.'],
    direction: 'Industrial blue, stock-paper neutrals and monospaced dimensions, like a technical sheet.',
    features: ['Searchable catalogue and comparison table.', 'Part pages with dimensions and minimum runs.', 'Configurator for board, size and print with tiered unit prices and lead time.', 'An RFQ basket that applies volume breaks and prints.'],
    tech: hosted
  },
  'nukkad-naai': {
    goals: ['Give a neighbourhood barbershop its own character online.', 'Make the visit feel like stepping into the shop.', 'Keep the music one tap away.'],
    direction: 'An illustrated evening street corner in warm reds, with hand-painted signage in Devanagari.',
    features: ['A full-screen illustrated shopfront.', 'A radio player with play, pause and skip.', 'Links to listen on Spotify and YouTube Music.'],
    tech: ['A responsive full-viewport scene with the player fixed within reach.']
  },
  'laptop-buy-guide': {
    goals: ['Turn a long list into a short, relevant one.', 'Start from how someone will use the laptop.', 'Make comparisons quick on a phone.'],
    direction: 'A clean, bright interface where the budget slider and use cases are the first thing you touch.',
    features: ['Budget, use-case and release-year selection.', 'Editor’s picks and browsing by use case.', 'Product details with a link to buy from the retailer.'],
    tech: ['Responsive layout with light and dark themes.']
  },
  'velluto-gt': {
    goals: ['Hold attention on a single subject.', 'Reveal the product through movement.', 'Keep specifications readable between scenes.'],
    direction: 'Dark, cinematic frames with wide display type and a gold accent. One car, four chapters.',
    features: ['A drag-to-reveal opening sequence.', 'Form, cabin and engine chapters.', 'Specification and private-viewing sections.'],
    tech: ['An image sequence driven by the visitor’s scroll and drag, with an option to skip it.']
  },
  'pocket-portfolio': {
    goals: ['Present a person’s work in a format people want to explore.', 'Feel native on a phone.', 'Be simple to personalize.'],
    direction: 'A 3D phone in a calm studio on desktop. On a phone, the website becomes the phone.',
    features: ['Lock screen, home screen and app-style sections.', 'Projects, services, reviews, journey and contact views.', 'Appearance, wallpaper and accessibility settings.'],
    tech: ['Built with Next.js, React, Tailwind CSS and React Three Fiber.', 'Falls back to a CSS phone without WebGL or with reduced motion.']
  },
  'studio-billing': {
    goals: ['Make a correct invoice in under a minute.', 'Keep issued invoices easy to find.', 'Produce a clean printed record.'],
    direction: 'A focused workspace with clear numbers, electric blue and lime highlights.',
    features: ['Customer selection and a customer directory.', 'Editable line items, quantities and discount.', 'Rupee, pound and dollar invoices with automatic totals.', 'An invoice register and a printable invoice.'],
    tech: ['Totals are calculated in whole minor units to avoid rounding drift.', 'Server-rendered pages without a front-end framework.']
  }
};

const ul = (items, html, tag = 'ul', cls = '') => `<${tag}${cls && ` class="${cls}"`}>${items.map((i) => `<li>${html(i)}</li>`).join('')}</${tag}>`;
const part = (title, body, cls = '') => `<section class="cs-two ${cls}"><h2>${title}</h2><div>${body}</div></section>`;
export const caseStudy = ({ p, link, sample, similar, html, note }) => {
  const n = notes[p.slug];
  return `<section class="cs-intro">${note ? `<p class="cs-note">${html(note)}</p>` : ''}<div class="cs-two"><h2>Project overview</h2><p>${html(p.role)}</p></div></section>
${part(p.kind === 'website' ? 'Website objectives' : 'Objectives', ul(n.goals, html), 'cs-tech')}
<section class="cs-band">${shot(`case-${p.slug}-desktop`, `${html(p.title)} on a desktop screen.`, 1440, 900, 'cs-desk')}${shot(`case-${p.slug}-mobile`, `${html(p.title)} on a phone.`, 390, 844, 'cs-phone')}</section>
${part('Design direction', `<p>${html(n.direction)}</p>`)}
${part('Implemented functionality', ul(n.features, html), 'cs-tech')}
${part('Customer experience', ul(p.steps, html, 'ol', 'cs-steps'))}
${part('Technical highlights', ul(n.tech, html), 'cs-tech')}
<section class="cs-cta"><h2>Let’s build something for your business.</h2><p>Tell us what you need and we’ll show you how it could work.</p><div class="ct-actions">${link(p.url, p.action, 'primary')}${link(sample, similar)}</div></section>`;
};
