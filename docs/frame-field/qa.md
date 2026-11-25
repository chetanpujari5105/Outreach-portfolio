# Frame & Field — browser and visual QA

25 November 2026. Functional verification used the local production-equivalent portfolio handler at port 8796. Browser sessions used fictional inputs. Booking, quotation and contact tests checked the contents of a local brief and each browser’s storage.

## Browser results

Google Chrome 158.0.8127.38, Firefox 157.0 and Playwright WebKit 26.5 each completed the following seven groups at a 390 × 844 touch viewport with reduced motion enabled.

| Group | Observed result |
| --- | --- |
| Keyboard and mobile navigation | Skip link reachable, menu opened and Escape restored focus to its trigger. WebKit on this Mac uses Option+Tab to include ordinary links in keyboard traversal. |
| Portfolio archive | All 16 projects appeared. Product filtering returned two matching projects. Back, forward, refresh, search, empty state and reset restored the expected list and URL. |
| Gallery | Previous/next keyboard navigation, thumbnails, zoom, Escape and focus return worked. A native touch sequence dispatched through Chrome’s input protocol advanced the gallery on a horizontal swipe. |
| Journal | Category selection narrowed the seven articles. Empty search and reset worked. Articles linked to related reading. Chrome’s clipboard contained the actual article URL after Copy Link. |
| Packages and booking | The ₹18,000 product collection plus ₹1,800 for additional retouching produced ₹19,800. The same estimate and choices survived the transition into booking. A past date and a missing on-location address blocked progress. Editing the contact at review updated the completed brief. The downloaded text contained the estimate. Browser storage stayed empty until Save. A saved brief reopened after refresh and could be deleted. Starting fresh cleared the completed fields. |
| Custom quotation | Filled production, location, usage, budget and contact fields, edited usage at review and downloaded the revised brief. The browser did not store personal details automatically. |
| General contact | A local message progressed through review to the copy, download or save options. The contact flow left browser storage empty by default. |

Chrome additionally exercised a direct URL into a gallery’s second image, refresh at that URL, a custom-price package handoff and an older portrait-booking URL at 320, 390, 768 and 1440 px. Daybreak Café, Casa Neem, Studio Forma, Hall Eleven, Ledger Desk and Kinetic Yard each returned their own homepage and heading.

The native Safari application could not start a WebDriver session because “Allow remote automation” was disabled in Safari’s Developer settings. The WebKit results above come from its own automation build. The review used emulated phone viewports and touch input.

## Routes and photographs

All 45 studio pages loaded under the standalone prefix and again under the portfolio demo prefix, for 90 successful direct page loads. Each document contained one page heading and the intended noindex directive. The browser decoded the photographs on every page. Both prefixes returned the branded 404 with the correct HTTP status. A separate pass followed 148 unique URLs advertised by the standalone HTML, including image and metadata URLs, without a broken destination. The final image manifest resolved to 72 full photographs and their 72 small WebP variants.

The portfolio-context demo and clean studio are both directly accessible. The Chetan Studio case study displayed all nine screenshot placements at 1440 px and 390 px. The six feature panels show the archive, project viewer, service, pricing, booking and commercial quote experiences.

## Layout and accessibility

Chrome loaded 18 page types at 320, 375, 390, 430, 768, 1024, 1440 and 1920 px. All 144 combinations stayed within the viewport, including the project photo viewer at every size. Both 1440 × 900 and 390 × 844 captures were checked visually.

The local axe-core 4.11.4 scan across 17 page types included WCAG 2 and 2.1 A/AA rules and best-practice checks. The final scan returned zero automated violations. Four in-page complementary landmarks from the first scan were corrected. Keyboard testing separately checked menu state, visible skip navigation, gallery focus entry and restoration, and validation focus on the first invalid field. Screen-reader narration and physical mobile devices were outside this verification.

## Independent design review

The original archive’s portrait and two secondary images demonstrated range, but gave a new visitor limited context or route into commissioning. The new cover identifies a Pune studio, links directly to an editorial story and gives work and bookings named destinations. The desktop pairing of vermilion fabric and the printed headline carries through to a distinct, stacked mobile composition. During review, a malformed font declaration and a cramped mobile headline were corrected. The final capture shows the intended italic and room for the image subject. A final phone review also caught two adjacent contact links running together. Their corrected spacing is visible on the contact page.

In the full portfolio, the quieter captions and consistent category names let the photographs carry the sequence. The project viewer uses a dark surround and keeps the whole image visible. The package comparison lists deliverables separately from the live estimate, which made the ₹19,800 example easy to reproduce. The narrow phone layout deliberately stacks forms and the progress list. The complete, browsing-focused archive becomes a long scroll on a phone, with search and subject filters at its entrance.

## Screenshot evidence

Each index entry includes a complete desktop and phone page. The gallery pair records the open viewer at viewport size.

| Subject | Desktop | Phone |
| --- | --- | --- |
| Homepage | [Open](after/home-desktop.jpg) | [Open](after/home-mobile.jpg) |
| Selected projects | [Open](after/selected-desktop.jpg) | [Open](after/selected-mobile.jpg) |
| Complete archive | [Open](after/archive-desktop.jpg) | [Open](after/archive-mobile.jpg) |
| Stairwell Edition project | [Open](after/story-desktop.jpg) | [Open](after/story-mobile.jpg) |
| Fullscreen viewer | [Open](after/gallery-desktop.jpg) | [Open](after/gallery-mobile.jpg) |
| Service index | [Open](after/services-desktop.jpg) | [Open](after/services-mobile.jpg) |
| Product photography | [Open](after/service-desktop.jpg) | [Open](after/service-mobile.jpg) |
| Packages and pricing | [Open](after/pricing-desktop.jpg) | [Open](after/pricing-mobile.jpg) |
| Book a shoot | [Open](after/book-desktop.jpg) | [Open](after/book-mobile.jpg) |
| Custom quotation | [Open](after/quote-desktop.jpg) | [Open](after/quote-mobile.jpg) |
| About the studio | [Open](after/about-desktop.jpg) | [Open](after/about-mobile.jpg) |
| Studio spaces | [Open](after/studio-desktop.jpg) | [Open](after/studio-mobile.jpg) |
| Journal index | [Open](after/journal-desktop.jpg) | [Open](after/journal-mobile.jpg) |
| Portrait preparation article | [Open](after/article-desktop.jpg) | [Open](after/article-mobile.jpg) |
| FAQ | [Open](after/faq-desktop.jpg) | [Open](after/faq-mobile.jpg) |
| Contact | [Open](after/contact-desktop.jpg) | [Open](after/contact-mobile.jpg) |
| Privacy | [Open](after/privacy-desktop.jpg) | [Open](after/privacy-mobile.jpg) |
| Booking terms | [Open](after/terms-desktop.jpg) | [Open](after/terms-mobile.jpg) |
| Chetan Studio case study | [Open](after/portfolio-case-desktop.jpg) | [Open](after/portfolio-case-mobile.jpg) |
| Portfolio-context demo | [Open](after/portfolio-demo-desktop.jpg) | [Open](after/portfolio-demo-mobile.jpg) |
| Studio 404 | [Open](after/missing-desktop.jpg) | [Open](after/missing-mobile.jpg) |

The [baseline and research](research.md) include the original public and local screenshots. Additional case-study previews show the filtered product archive, Portrait Studies in its viewer, product photography services, an estimate with an add-on selected, shoot details and commercial usage requirements.
