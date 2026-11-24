// Long-form case studies for /work/<slug>, shown in place of the short walkthrough when a project has one.
// Everything here describes studio concept work: no client quotes, no business results.

const shot = (file, alt, w, h, cls = '') =>
  `<figure class="cs-shot ${cls}"><img src="/assets/${file}.webp" alt="${alt}" width="${w}" height="${h}" loading="lazy" decoding="async"></figure>`;

const daybreak = ({ link, sample }) => `
<section class="cs-intro">
  <p class="cs-note">A fictional concept. Daybreak Café, its people, prices, reviews and contact details are invented for this portfolio, its pictures are AI-generated, and nothing on the site sends a message or takes a booking.</p>
  <div class="cs-two">
    <div><p class="ct-eyebrow">The brief</p><h2>A neighbourhood café that is easy to choose from your phone.</h2></div>
    <div><p>Most café websites are a PDF menu and an Instagram link. Someone standing outside cannot tell what to order, whether it is vegetarian, or how to ask about a table for twelve without calling. I wanted a site that answers those questions in the first three screens and still feels like a calm morning in Pune.</p></div>
  </div>
</section>

<section class="cs-band">
  ${shot('case-daybreak-home-desktop', 'Daybreak Café home page on a desktop screen: a sunlit café interior behind the heading Good mornings begin here.', 1440, 900, 'cs-desk')}
  ${shot('case-daybreak-home-mobile', 'The same home page on a phone, with the address and booking button in the first screen.', 390, 844, 'cs-phone')}
</section>

<section class="cs-two">
  <div><p class="ct-eyebrow">Direction</p><h2>Morning light, forest green and cream plaster.</h2></div>
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
  <div><p class="ct-eyebrow">The menu</p><h2>39 dishes, each with its own page.</h2>
    <ul><li>Instant search and diet filters that update the address, so a filtered menu can be shared.</li><li>Diet marks follow Indian practice: dishes with egg are not labelled vegetarian, and the Vegetarian filter shows only egg-free dishes.</li><li>Every dish page lists ingredients, allergens and pairings, and drink options re-price live.</li><li>Every dish has its own picture, made to match its ingredients and the rest of the menu.</li></ul></div>
</section>

<section class="cs-feature cs-flip">
  <div class="cs-feature-shots">${shot('case-daybreak-booking-mobile', 'The table request form on a phone, asking for date, time, guests and seating.', 390, 844, 'cs-phone')}</div>
  <div><p class="ct-eyebrow">Reservations</p><h2>A request flow that never pretends.</h2>
    <ul><li>One form for a table or a group, with a review step before anything is saved.</li><li>Times that don’t work are disabled instead of explained in errors: group tables are seated by 5 pm, and a private evening always starts at 8 pm.</li><li>The request is saved only in the visitor’s browser and clearly labelled as not sent and not confirmed. It can be copied, downloaded or deleted, and requests for past dates delete themselves.</li><li>Phone, email and WhatsApp links are switched off, because invented numbers can belong to real people.</li></ul></div>
</section>

<section class="cs-feature">
  <div class="cs-feature-shots">${shot('case-daybreak-gallery-desktop', 'The gallery page on desktop: a grid of café, coffee and people photographs with filters.', 1440, 900, 'cs-desk')}</div>
  <div><p class="ct-eyebrow">Gallery</p><h2>The room, the plates and the people.</h2>
    <ul><li>Filters for the space, coffee, food and people.</li><li>A full-screen viewer that works with arrow keys, swipe and Escape, and returns focus to the photo you opened.</li></ul></div>
</section>

<section class="cs-two cs-tech">
  <div><p class="ct-eyebrow">Under the hood</p><h2>Built to load fast on a mid-range phone.</h2></div>
  <div><ul>
    <li>Server-rendered pages with no framework. Every page, filter and dish option has a real address that survives a refresh.</li>
    <li>Fonts cut from 265 KB to 75 KB, with the heading font preloaded.</li>
    <li>Every picture has a smaller phone version, and pictures below the first screen load lazily.</li>
    <li>A skip link, visible focus, labelled form errors, reduced-motion support and a branded 404 for mistyped addresses.</li>
  </ul></div>
</section>

<section class="cs-cta">
  <h2>Want a site like this for your café?</h2>
  <p>I can build a version with your real menu, photos and booking details.</p>
  <div class="ct-actions">${link('/site/daybreak-cafe', 'Visit the full website', 'primary')}${link(sample, 'Request a similar website')}</div>
</section>`;

export const studies = { 'daybreak-cafe': daybreak };
