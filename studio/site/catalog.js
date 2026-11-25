// Editorial records are shared by the statically generated routes and the browser.
import { studies, caseStudy } from './studies.js';
const sector = (slug, title, description, task, project, solution, accent, addon) =>
  ({ slug, title, description, task, project, solution, accent, addon });

export const industries = [
  sector('salons', 'Salons & barbers', 'Modern salon websites that help customers explore treatments, meet stylists and request appointments.', 'Explore the salon website', 'salon-booking', 'bookings', '#924858', 'Keep your service pages and add a booking link to each treatment, so every request arrives with the service, stylist and time.'),
  sector('cafes', 'Cafés & restaurants', 'Beautiful hospitality websites with interactive menus, food photography and table enquiry experiences.', 'Explore the café website', 'daybreak-cafe', 'menus', '#89552e', 'Give your existing menu a direct mobile link. Add a group dining enquiry alongside your current reservations.'),
  sector('therapy-practices', 'Clinics & therapists', 'Welcoming practice websites that explain services clearly and make the first appointment enquiry simple.', 'Explore the practice website', 'stillwater', 'bookings', '#3e6f67', 'Add a focused appointment request to your current service pages. A practice can choose which fields its team needs.'),
  sector('fitness-studios', 'Gyms & movement studios', 'Energetic fitness websites with class timetables, coach profiles, memberships and trial-session requests.', 'Explore the gym website', 'kinetic-yard', 'bookings', '#595e31', 'Embed a trial-class chooser next to your existing timetable and manage the capacity for each class.'),
  sector('education', 'Tutors & learning centres', 'Education websites that help families compare subjects, plan lessons and request a trial.', 'Explore the tutoring website', 'brightpath', 'bookings', '#465e84', 'Add trial-lesson requests to your course pages. Each request can carry the subject and level into your teaching schedule.'),
  sector('hospitality', 'Hotels & homestays', 'Hospitality websites that help guests discover rooms, plan stays and prepare booking requests.', 'Explore the homestay website', 'casa-neem', 'bookings', '#7c6631', 'Keep your room gallery and add a date enquiry for families, retreats or group stays.'),
  sector('creatives', 'Photographers & creatives', 'Immersive portfolio websites with project galleries, service information and structured creative enquiries.', 'Explore the photography website', 'frame-field', 'portfolios', '#5f5181', 'Add a brief builder beneath your gallery so each enquiry arrives with the format, setting and intended use.'),
  sector('events', 'Venues & event teams', 'Elegant venue websites with space galleries, capacity planning and interactive event estimates.', 'Explore the venue website', 'hall-eleven', 'quotes', '#844d52', 'Add a package estimator to your venue pages. Send the guest count and preferred setup to your team.'),
  sector('home-services', 'Home services & trades', 'Service websites that let customers describe the property, choose a package and see a clear estimate.', 'Explore the home-services website', 'brightnest', 'quotes', '#456856', 'Link a quote form to each service page, then carry accepted work into job tracking and invoices.'),
  sector('retail', 'Shops & boutiques', 'Editorial shop websites with filtered catalogues, product details and enquiries about an exact piece.', 'Explore the boutique website', 'loom-lane', 'catalogs', '#8b583f', 'Add filters and product enquiries to your existing catalogue. Use the same item references in stock and billing tools.'),
  sector('automotive', 'Automotive businesses', 'Automotive websites with service packages, vehicle-specific pricing and drop-off enquiries.', 'Explore the detailing website', 'gloss-lab', 'quotes', '#375c70', 'Add an estimate builder or test-drive enquiry alongside your current service and model pages.'),
  sector('pet-care', 'Pet care & boarding', 'Warm boarding websites that help owners choose a suite, share their pet’s needs and plan a stay.', 'Explore the boarding website', 'wagtail-lodge', 'bookings', '#885041', 'Attach a boarding enquiry to the accommodation page and let returning owners request their usual stay.'),
  sector('professionals', 'Consultants & advisers', 'Professional practice websites that present expertise and turn a question into a structured consultation brief.', 'Explore the advisory website', 'northline', 'portfolios', '#505f80', 'Add consultation briefs or a document checklist to the contact flow on your current site.'),
  sector('wholesale', 'Manufacturers & wholesalers', 'B2B websites with product specifications, material options, volume pricing and quotation requests.', 'Explore the packaging website', 'mill-crate', 'catalogs', '#566954', 'Connect a request-for-quotation form to each product specification and keep the chosen SKU with the enquiry.'),
  sector('other-businesses', 'Other businesses', 'Websites and business tools designed around the one task your customers or team need to complete.', 'Find the right solution', 'studio-billing', 'billing', '#715b83', 'Start with one task your current site leaves to phone calls or spreadsheets. We can build that single step first.')
];

// What a project is. This drives browsing, filters and labels; who owns it or where it runs does not.
export const kinds = {
  website: { plural: 'Websites', label: 'Website' },
  product: { plural: 'Apps & products', label: 'Digital product' },
  tool: { plural: 'Business tools', label: 'Business tool' }
};
// How a project operates today, shown on its case page. Live external sites need no note.
export const statusNotes = {
  live: '',
  beta: 'The apps are in a small beta. The website is live.',
  local: 'This website runs in the visitor’s browser. Requests are prepared and kept on their own device and are not sent to a business. Business details, people, prices and availability are illustrative.',
  tool: 'This tool runs in the browser. Invoices are kept in the current tab, customers and prices are illustrative, and no payment is taken.',
  showcase: 'The vehicle and its figures are fictional. Nothing on the site is for sale.',
  template: 'A reusable template. It ships with sample content to replace with your own.'
};
// `site` is set only for projects hosted elsewhere. Everything else is hosted here at /site/<slug>;
// its earlier /demo/<slug> address (previewUrl) redirects to the same page.
const project = ({ slug, site, image, ownership = 'studio', badge, status, action, ...rest }) => {
  const hosted = !site;
  return {
    slug, ...rest, ownership, hosted,
    badge: badge || (ownership === 'client' ? 'Client work' : rest.kind === 'website' ? 'Website design' : ''),
    status: status || (hosted ? 'local' : 'live'),
    url: site || '/site/' + slug,
    previewUrl: hosted ? '/demo/' + slug : '',
    image: '/assets/' + (hosted ? 'screen-' + slug : image) + '.webp',
    action: action || 'View website'
  };
};
export const labelOf = p => p.badge || kinds[p.kind].label;

// In collection order: the flagship first, Ledger Desk last.
export const projects = [
  project({ slug: 'sidekick', title: 'Sidekick', kind: 'product', category: 'Apps for Mac & Android', badge: 'Flagship product', status: 'beta', site: 'https://sidekickapp.in/', image: 'sidekick', industry: 'other-businesses', action: 'Visit Sidekick',
    description: 'Our flagship product: an Android and Mac app pair that mirrors your phone, answers notifications and moves files over your own Wi-Fi.',
    role: 'We designed and built Sidekick: the Mac app, the Android app and the website that presents them. The two devices connect directly over your own network, with no cloud and no account.',
    steps: ['Install both apps and pair once by scanning a QR code.', 'Mirror the phone, reply to notifications, and share files and the clipboard from the Mac.', 'Read the limits, roadmap and setup guide on the website, then request the beta.'] }),
  project({ slug: 'daybreak-cafe', title: 'Daybreak Café', kind: 'website', category: 'Menu & reservations', industry: 'cafes',
    description: 'A complete café website featuring an interactive 39-item menu, dietary filters, individual dish pages, photography galleries and reservation enquiries.',
    role: 'We designed and built the full website around three everyday questions: what to order, whether it suits my diet, and how to ask for a table.',
    steps: ['Open the menu, search it or filter it by diet.', 'Choose a dish to see its photo, ingredients, allergens and pairings.', 'Fill in a table or group request and review it before saving it on your device.'] }),
  project({ slug: 'salon-booking', title: 'Studio Forma', kind: 'website', category: 'Booking system', industry: 'salons',
    description: 'A premium salon website featuring service discovery, stylist selection, treatment pricing and an intuitive appointment enquiry experience.',
    role: 'We designed and built a hair-studio website that starts from the look: visitors browse cuts and colour, meet the stylist behind each one and carry that choice into an appointment request.',
    steps: ['Browse the lookbook or the menu and set a hair length to see the price.', 'Choose a stylist, a day and a time that fits the service.', 'Review the appointment request and save it on your device.'] }),
  project({ slug: 'manakar', title: 'Manakar', kind: 'website', category: 'Practice website', ownership: 'client', site: 'https://www.manakar.in/', image: 'therapy', industry: 'therapy-practices',
    description: 'A clinical psychology practice website in Pune with service information, the practitioner’s approach and appointment requests.',
    role: 'We built the practice website for a clinical psychologist in Pune. The live site credits Chetan in its footer.',
    steps: ['Read the practitioner introduction and explore the services.', 'Open the appointment section to see how the practice takes enquiries.', 'The request form includes service, preferred date and preferred time.'] }),
  project({ slug: 'casa-neem', title: 'Casa Neem', kind: 'website', category: 'Booking system', industry: 'hospitality',
    description: 'A boutique hospitality website featuring accommodation discovery, room galleries, stay planning, guest capacity checks and booking enquiries.',
    role: 'We designed and built a homestay website where a guest can choose a room, see whether it fits everyone and know the nightly total before they write to the host.',
    steps: ['Set dates and guests once, then compare rooms, rates and sleeping capacity.', 'Open a room to see its gallery, facilities and nightly price.', 'Add breakfast or a pickup, review the itemised total and save the stay enquiry.'] }),
  project({ slug: 'hall-eleven', title: 'Hall Eleven', kind: 'website', category: 'Event estimates', industry: 'events',
    description: 'An elegant event venue website with venue galleries, event configuration, guest capacity planning and interactive package estimates.',
    role: 'We designed and built a venue website for planners who want a realistic number before they book a walkthrough.',
    steps: ['Compare banquet, theatre and cocktail setups with their capacities.', 'Choose a menu and change the guest count to see the estimate update.', 'Carry the estimate into a date enquiry, add extras and save it.'] }),
  project({ slug: 'brightnest', title: 'Brightnest', kind: 'website', category: 'Service quotes', industry: 'home-services',
    description: 'A home-services website with customizable cleaning packages, property-based pricing and service enquiries.',
    role: 'We designed and built a home-services website so a customer sees the price before anyone visits, and the enquiry holds every detail that changes it.',
    steps: ['Check the neighbourhood and compare the cleaning packages.', 'Describe the property, choose a clean and add extras.', 'Pick a regular plan and arrival window, then save the visit request.'] }),
  project({ slug: 'kinetic-yard', title: 'Kinetic Yard', kind: 'website', category: 'Classes & memberships', industry: 'fitness-studios',
    description: 'A modern fitness studio website featuring training programs, class discovery, membership information and trial-session requests.',
    role: 'We designed and built a gym website so a newcomer can find a class at the right level, meet the coach and request a free trial without messaging the front desk.',
    steps: ['Browse the weekly timetable by day and training goal.', 'Meet the coaches and compare memberships by billing period.', 'Choose a class with space and save a trial request.'] }),
  project({ slug: 'brightpath', title: 'Brightpath Tutors', kind: 'website', category: 'Lesson planning', industry: 'education',
    description: 'An education website for students and parents with a subject library, practice lessons, learning plans and trial lesson requests.',
    role: 'We designed and built a tutoring website for parents who want to know the time, the format and the monthly fee before the first lesson.',
    steps: ['Choose a subject and grade, then try a practice question.', 'Pick centre or online lessons and how many each week.', 'Choose a trial time, see the monthly plan and save the request.'] }),
  project({ slug: 'wagtail-lodge', title: 'Wagtail Lodge', kind: 'website', category: 'Booking system', industry: 'pet-care',
    description: 'A premium pet boarding website with accommodation discovery, pet-specific requirements and personalized stay enquiries.',
    role: 'We designed and built a boarding website that collects what a lodge needs before it can say yes: the pet, the suite, the dates and the vaccination card.',
    steps: ['Tour the lodge and compare suites and capacity.', 'Share the pet’s size and dates, and see which suites fit.', 'Add extras, confirm vaccinations and save the stay enquiry.'] }),
  project({ slug: 'stillwater', title: 'Stillwater Practice', kind: 'website', category: 'Appointment enquiries', industry: 'therapy-practices',
    description: 'A welcoming counselling practice website designed around service discovery, accessible information and a streamlined appointment enquiry experience.',
    role: 'We designed and built a practice website that makes the first step feel quiet and safe: a few choices, a first name and a clear note about what happens next.',
    steps: ['Read what a first session is like and compare services and fees.', 'Pick in-person or video and a preferred time.', 'Share a first name, read the safety note and save the request.'] }),
  project({ slug: 'frame-field', title: 'Frame & Field', kind: 'website', category: 'Portfolio website', industry: 'creatives',
    description: 'An editorial photography studio website combining project stories, creative services, package pricing, a studio journal and a photography project enquiry experience.',
    role: 'We designed and built a photography studio website where a client can move from a picture they like to a brief the photographer can quote on.',
    steps: ['Filter the portfolio and open a project story.', 'Compare packages and extras to build an indicative estimate.', 'Prepare a shoot brief to copy, download or keep on your device.'] }),
  project({ slug: 'loom-lane', title: 'Loom & Lane', kind: 'website', category: 'Product catalogue', industry: 'retail',
    description: 'An editorial boutique website with product discovery, catalogue filters, product details and shopping enquiries.',
    role: 'We designed and built a boutique website for shops that sell in person: a customer finds the piece online and prepares a request to hold or ship it.',
    steps: ['Filter the collection and open a piece.', 'Pick an available size and colour, or check the size guide.', 'Add it to the bag or prepare an enquiry about that exact piece.'] }),
  project({ slug: 'gloss-lab', title: 'Gloss Lab', kind: 'website', category: 'Service quotes', industry: 'automotive',
    description: 'A premium automotive detailing website with service packages, vehicle customization and interactive pricing estimates.',
    role: 'We designed and built a detailing website so a driver can price a detail to the rupee and the workshop knows the car before it arrives.',
    steps: ['Compare treatments and reveal the finish with the interactive slider.', 'Choose a vehicle size, paint condition, package and add-ons.', 'Pick a drop-off time, review the price and save the request.'] }),
  project({ slug: 'northline', title: 'Northline Advisory', kind: 'website', category: 'Consultation briefs', industry: 'professionals',
    description: 'A professional advisory website featuring decision memos, consultation information and structured consultation briefs.',
    role: 'We designed and built an advisory website so the first meeting starts with the question already written down and the right amount of time requested.',
    steps: ['Read a decision memo and mark the agenda items that apply.', 'Write the question, set the urgency and list the documents.', 'Choose a consultation length and save the brief.'] }),
  project({ slug: 'mill-crate', title: 'Mill & Crate', kind: 'website', category: 'Product catalogue', industry: 'wholesale',
    description: 'A B2B packaging website featuring product specifications, material configuration, quantity-based pricing and quotation requests.',
    role: 'We designed and built a packaging website so a buyer can specify a box, see volume breaks and prepare a request the estimating team can quote straight away.',
    steps: ['Search the catalogue and compare specifications.', 'Set board, size, print and quantity to see the unit price and lead time.', 'Collect items in the RFQ basket or save a quotation request.'] }),
  project({ slug: 'nukkad-naai', title: 'Nukkad Naai', kind: 'website', category: 'Brand experience', ownership: 'client', site: 'https://nukad-nai.vercel.app/', image: 'nukkad', industry: 'salons',
    description: 'A barbershop radio website built around an illustrated street corner and a working music player.',
    role: 'We built a barbershop radio website for Nukkad Naai that gives the business its own character online.',
    steps: ['Enter the corner barbershop setting.', 'Play, pause and skip tracks in the radio.', 'Continue listening on Spotify or YouTube Music.'] }),
  project({ slug: 'laptop-buy-guide', title: 'LaptopBuyGuide', kind: 'product', category: 'Product discovery', site: 'https://laptop-buy-guide-v1.vercel.app/', image: 'catalog', industry: 'retail', action: 'Open LaptopBuyGuide',
    description: 'An interactive laptop discovery platform that helps buyers compare products based on budget, specifications and intended use.',
    role: 'We built a comparison product that organizes laptops around the buyer’s needs. The same approach suits any catalogue with many similar products.',
    steps: ['Set a budget and choose a use such as study, gaming or business.', 'Narrow the list by release year and specifications.', 'Compare a shorter, more relevant list and follow a product to its shop.'] }),
  project({ slug: 'velluto-gt', title: 'Velluto GT', kind: 'website', category: 'Product storytelling', status: 'showcase', site: 'https://velluto-gt.vercel.app/', image: 'auto', industry: 'automotive',
    description: 'A cinematic automotive website showcasing product storytelling through immersive imagery, motion and interactive visual presentation.',
    role: 'We designed and built a product reveal told through motion and detail, with a fictional coachbuilt grand tourer as its single subject.',
    steps: ['Drag or scroll to reveal the car beneath its sheet.', 'Move through the form, cabin and engine chapters.', 'Finish on the specification and private-viewing sections.'] }),
  project({ slug: 'pocket-portfolio', title: 'Pocket Portfolio', kind: 'product', category: 'Portfolio template', status: 'template', site: 'https://github.com/chetanpujari5105/pocket-portfolio-template', image: 'pocket', industry: 'creatives', action: 'View the template',
    description: 'An interactive portfolio template that presents professional work, services and contact information through a mobile-inspired interface.',
    role: 'We built a reusable portfolio for people who want an interactive way to present their work. Its content lives in a small set of files, with a setup guide for personalizing it.',
    steps: ['Unlock the phone and open the home screen.', 'Browse projects, services, reviews and contact as apps.', 'Replace the content files to make it your own.'] }),
  project({ slug: 'studio-billing', title: 'Ledger Desk', kind: 'tool', category: 'Business software', status: 'tool', industry: 'home-services', action: 'Open the invoicing tool',
    description: 'An interactive invoicing tool featuring customer selection, editable line items, automatic calculations, invoice management and printable billing records.',
    role: 'We designed and built an invoicing tool for owners who prepare an estimate or invoice across multiple line items and need a printable record.',
    steps: ['Choose a customer and add line items.', 'Adjust quantities, discount and currency and review the total.', 'Issue the invoice, open it in the register and print it.'] })
];

export const solutions = [
  {slug:'bookings', title:'Appointments & bookings', description:'Turn interest into a specific request. Visitors choose the service, person, date and time, so your team starts with the details it needs.', industries:['salons','therapy-practices','fitness-studios','education','hospitality','pet-care'], projects:['stillwater','wagtail-lodge','brightpath','kinetic-yard','casa-neem','salon-booking','manakar']},
  {slug:'menus', title:'Menus & dining enquiries', description:'Make every dish easy to find on a phone and give guests a short route from the menu to a table or group enquiry.', industries:['cafes','hospitality','events'], projects:['daybreak-cafe']},
  {slug:'portfolios', title:'Portfolio websites', description:'Present your best work with the care it deserves and give interested clients a clear way to start a project.', industries:['creatives','professionals','automotive'], projects:['northline','frame-field','pocket-portfolio','velluto-gt','nukkad-naai']},
  {slug:'catalogs', title:'Catalogues & product discovery', description:'Help buyers narrow a range, compare specifications and enquire about the exact product they want.', industries:['retail','wholesale','automotive'], projects:['mill-crate','loom-lane','laptop-buy-guide']},
  {slug:'quotes', title:'Quotes & estimates', description:'Show a clear price early. Customers make the choices that change the cost and your team receives a brief it can act on.', industries:['events','home-services','automotive','wholesale'], projects:['gloss-lab','brightnest','hall-eleven','studio-billing']},
  {slug:'billing', title:'Invoicing & billing', description:'Give your team one place to choose items, check totals and issue a printable invoice.', industries:['home-services','retail','professionals','other-businesses'], projects:['studio-billing']}
];

const choice = (key, label, options) => ({key,label,kind:'select',options});
const quantity = (key, label, min, max, value) => ({key,label,kind:'number',min,max,value});
const day = (key, label, offset = 1) => ({key,label,kind:'date',offset});
const money = n => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);
const formatDay = value => new Date(value + 'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
const nights = (from,to) => Math.round((Date.parse(to + 'T12:00:00Z') - Date.parse(from + 'T12:00:00Z'))/86400000);
const result = (title,lines,link) => ({title,lines,link});
const dateValidation = v => nights(v.start,v.end) > 0 ? '' : 'Choose an end date after the arrival date.';
const stayFields = [day('start','Arrival date'),day('end','Departure date',3)];

const minis = {
  'therapy-practices': {
    brand:'Willow Practice', title:'Appointment planner', intro:'Choose a format and a preferred time for an introductory appointment.', submit:'Review appointment',
    fields:[choice('service','Appointment type',['Introductory consultation','Follow-up consultation']),choice('format','Visit format',['In person','Video call']),day('date','Preferred date'),choice('time','Preferred time',['09:30','11:00','15:30'])],
    summary:v=>result('Your appointment request',[v.service + ' · ' + v.format,formatDay(v.date) + ' at ' + v.time,'The practice would check availability before confirming.'])
  },
  'fitness-studios': {
    brand:'Form Club', title:'Trial class planner', intro:'Compare three classes and choose a session that suits your level.', submit:'Review trial class',
    fields:[choice('class','Class & level',['Mat Pilates · beginner','Strength Basics · beginner','Vinyasa Flow · intermediate']),choice('session','Session',['Weekday morning','Weekend morning']),quantity('places','Trial places',1,3,1)],
    summary:v=>{const times={'Mat Pilates · beginner':['Tuesday 08:00','Saturday 09:00'],'Strength Basics · beginner':['Thursday 07:30','Saturday 10:00'],'Vinyasa Flow · intermediate':['Wednesday 08:30','Sunday 09:30']}; return result('Your trial class',[v.class,times[v.class][v.session==='Weekday morning'?0:1]+' · '+v.places+' trial '+(v.places==='1'?'place':'places'),'Arrive ten minutes before the class for an introduction.'])}
  },
  education:{
    brand:'Fieldnote Music School',title:'Trial lesson planner',intro:'Pick an instrument and level to put together a first-lesson outline.',submit:'Build lesson outline',
    fields:[choice('instrument','Instrument',['Piano','Guitar','Voice']),choice('level','Current level',['First lesson','Some experience']),choice('mode','Teaching format',['One to one','Small group'])],
    summary:v=>{const exercises={Piano:['Five-note patterns','Chords and melody'],Guitar:['Open strings and rhythm','Chord transitions'],Voice:['Breathing and pitch','Phrasing and dynamics']};return result('Your trial lesson outline',[v.instrument+' · '+v.mode, v.level==='First lesson'?'25-minute introduction':'40-minute assessment','First exercise: '+exercises[v.instrument][v.level==='First lesson'?0:1]])}
  },
  hospitality:{
    brand:'Fern House',title:'Stay planner',intro:'Check a room’s capacity and see an estimated total for your dates.',submit:'Review stay',
    fields:[choice('room','Room',['Courtyard double','Garden suite','Family loft']),quantity('guests','Guests',1,5,2),...stayFields],
    validate:v=>dateValidation(v) || (Number(v.guests)>({'Courtyard double':2,'Garden suite':3,'Family loft':5}[v.room])?'This room is too small for your party. Choose a larger room or fewer guests.':''),
    summary:v=>{const n=nights(v.start,v.end);return result('Your stay enquiry',[v.room+' · '+v.guests+' guest(s)',formatDay(v.start)+' to '+formatDay(v.end)+' · '+n+' night(s)',money(n*({'Courtyard double':3500,'Garden suite':4900,'Family loft':6400}[v.room]))+' estimated room total. Availability is subject to confirmation.'])}
  },
  creatives:{
    brand:'Matter & Light',title:'Shoot brief builder',intro:'Combine a subject, location and delivery format into a brief a photographer can quote.',submit:'Build shoot brief',
    fields:[choice('type','Shoot type',['Editorial portrait','Product still life','Architecture']),choice('setting','Setting',['Studio','Client location','Outdoor location']),choice('deliver','Final use',['Website gallery','Print feature','Social campaign'])],
    summary:v=>result('Your photography brief',[v.type+' at '+v.setting.toLowerCase(),'Deliver for: '+v.deliver,{ 'Website gallery':'Request a web-ready set with horizontal and vertical crops.','Print feature':'Request high-resolution files and a print usage quote.','Social campaign':'Request portrait and square crops for the campaign.' }[v.deliver]])
  },
  events:{
    brand:'Orchard Hall',title:'Event estimate builder',intro:'Choose a layout, guest count and menu to see a planning estimate.',submit:'See estimate',
    fields:[choice('layout','Room layout',['Seated dinner','Standing reception','Workshop tables']),quantity('count','Guest count',10,150,40),choice('menu','Food service',['Coffee & light bites','Buffet meal','Plated meal'])],
    validate:v=>Number(v.count)>({'Seated dinner':80,'Standing reception':150,'Workshop tables':50}[v.layout])?'That setup exceeds the room capacity. Reduce guests or change the layout.':'',
    summary:v=>{const food=({'Coffee & light bites':320,'Buffet meal':750,'Plated meal':950}[v.menu])*v.count;return result('Your event estimate',[v.layout+' for '+v.count+' guests',v.menu+': '+money(food),'Room hire: '+money(18000)+' · Estimated total: '+money(18000+food)])}
  },
  'home-services':{
    brand:'Tidy House',title:'Service quote calculator',intro:'Build an estimate from the property size, visit type and add-ons.',submit:'Calculate estimate',
    fields:[choice('size','Property',['Studio','2-bedroom home','3-bedroom home']),choice('visit','Visit type',['Maintenance clean','Deep clean']),choice('extra','Extra service',['No extra service','Oven cleaning','Interior windows'])],
    summary:v=>{const hours=({Studio:2,'2-bedroom home':3,'3-bedroom home':4}[v.size])*(v.visit==='Deep clean'?2:1);const extra=({'No extra service':0,'Oven cleaning':450,'Interior windows':600}[v.extra]);return result('Your cleaning estimate',[v.visit+' · '+v.size,hours+' estimated labour hours at '+money(450)+'/hour',v.extra+' · Estimated total: '+money(hours*450+extra)])}
  },
  retail:{
    brand:'Common Goods',title:'Product enquiry builder',intro:'Choose a handmade item, its finish and a quantity.',submit:'Review enquiry',
    fields:[choice('item','Product',['Turned mug','Breakfast bowl','Serving platter']),choice('finish','Glaze',['Chalk','Moss','Russet']),quantity('qty','Quantity',1,20,2)],
    summary:v=>{const unit=({'Turned mug':680,'Breakfast bowl':850,'Serving platter':1690}[v.item]);return result('Your item enquiry',[v.qty+' × '+v.item+' · '+v.finish,'Unit price: '+money(unit),'Merchandise estimate: '+money(unit*v.qty)+'. The shop would confirm stock.'])}
  },
  automotive:{
    brand:'Westside Detail',title:'Detailing estimate builder',intro:'Choose your vehicle and finish to see an estimated appointment length and price.',submit:'Estimate service',
    fields:[choice('vehicle','Vehicle size',['Hatchback','Sedan','SUV']),choice('package','Detailing package',['Exterior wash','Interior detail','Full detail'])],
    summary:v=>{const factor=({Hatchback:1,Sedan:1.15,SUV:1.4}[v.vehicle]);const base=({'Exterior wash':[600,40],'Interior detail':[1900,100],'Full detail':[2900,160]}[v.package]);return result('Your detailing estimate',[v.vehicle+' · '+v.package,'Allow approximately '+Math.round(base[1]*factor/5)*5+' minutes.','Estimated service cost: '+money(Math.round(base[0]*factor))])}
  },
  'pet-care':{
    brand:'Cedar Paws',title:'Boarding stay planner',intro:'Plan a boarding stay with your pet’s dates and accommodation.',submit:'Review stay',
    fields:[choice('pet','Pet',['Dog','Cat']),choice('room','Room type',['Standard room','Quiet suite']),...stayFields],
    validate:dateValidation,
    summary:v=>{const n=nights(v.start,v.end);const rate=(v.pet==='Dog'?850:650)+(v.room==='Quiet suite'?250:0);return result('Your boarding enquiry',[v.pet+' · '+v.room,formatDay(v.start)+' to '+formatDay(v.end)+' · '+n+' night(s)',money(n*rate)+' estimated stay total. The team would confirm space and care requirements.'])}
  },
  professionals:{
    brand:'Northline Advisory',title:'Consultation planner',intro:'Choose a subject and meeting length to build an agenda you could share with an adviser.',submit:'Build consultation agenda',
    fields:[choice('topic','Area to discuss',['Business planning','Bookkeeping setup','Process review']),choice('stage','Business stage',['Getting started','Established business']),choice('length','Meeting length',['20 minutes','45 minutes'])],
    summary:v=>result('Your consultation agenda',[v.topic+' · '+v.stage,v.length+' introductory meeting',{'Business planning':'Bring a short description of the business and your main priorities.','Bookkeeping setup':'Bring a list of your current bookkeeping tools and reporting needs.','Process review':'Bring an example of a recurring workflow you want to improve.'}[v.topic]])
  },
  wholesale:{
    brand:'Atlas Components',title:'Quotation request builder',intro:'Select a component and case quantity to prepare an RFQ with a traceable item reference.',submit:'Build quotation request',
    fields:[choice('part','Component',['M6 hex fastener','M8 hex fastener','M10 hex fastener']),choice('grade','Material',['Zinc-plated steel','Stainless steel']),quantity('cases','Cases of 100 units',1,250,5)],
    summary:v=>result('Your quotation request',['SKU '+v.part.split(' ')[0]+'-'+(v.grade==='Stainless steel'?'SS':'ZP')+' · '+v.grade, v.cases+' cases × 100 = '+(v.cases*100).toLocaleString('en-GB')+' units','Request a unit price, lead time and freight estimate for this quantity.'])
  },
  'other-businesses':{
    brand:'Project finder',title:'Solution finder',intro:'Choose the action that would make the biggest difference to your business.',submit:'Find my solution',
    fields:[choice('job','What should someone be able to do?',['Request a time','Browse a menu','Compare products','See selected work','Issue an invoice','Estimate a service']),choice('existing','Current setup',['Starting a new site','Adding to an existing site'])],
    summary:v=>{const target={'Request a time':'salon-booking','Browse a menu':'daybreak-cafe','Compare products':'laptop-buy-guide','See selected work':'frame-field','Issue an invoice':'studio-billing','Estimate a service':'brightnest'}[v.job];const p=projects.find(x=>x.slug===target);return result('A starting point for your project',[v.job,p.description,v.existing==='Starting a new site'?'Use this task as the starting point for a new website.':'Give this task its own link alongside your existing pages.'],v.job==='Estimate a service'?['See a service estimate',p.url+'/services']:['See '+p.title,p.hosted?p.url:'/work/'+p.slug])}
  }
};

const html = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const bySlug = (items,slug) => items.find(item=>item.slug===slug);
const link = (href,label,kind='text') => `<a class="ct-link ct-link--${kind}" href="${html(href)}">${html(label)} <span aria-hidden="true">↗</span></a>`;
function sampleLink(industry,example,solution) {
  const query=new URLSearchParams({industry});
  if(example)query.set('project',example);
  if(solution)query.set('solution',solution);
  return '/sample?'+query;
}
const caption = (top,title,body) => `<p class="ct-eyebrow">${html(top)}</p><h2>${html(title)}</h2><p>${html(body)}</p>`;
const card = p => `<a class="ct-card" href="/work/${p.slug}"><div><p class="ct-eyebrow">${html(labelOf(p))} · ${html(p.category)}</p><h3>${html(p.title)}</h3><p>${html(p.description)}</p></div><span aria-hidden="true">↗</span></a>`;
const more = (title,items) => `<section class="ct-related"><h2>${html(title)}</h2><div class="ct-grid">${items.map(card).join('')}</div></section>`;
const subjectLink = i => `<a class="ct-sector-link" href="/for/${i.slug}"><span>${html(i.title)}</span><span aria-hidden="true">↗</span></a>`;

function dateValue(offset) {
  const today=new Date();
  today.setDate(today.getDate()+offset);
  return String(today.getFullYear())+'-'+String(today.getMonth()+1).padStart(2,'0')+'-'+String(today.getDate()).padStart(2,'0');
}

function fieldControl(f) {
  let control;
  if(f.kind==='select') control=`<select name="${f.key}">${f.options.map(o=>`<option>${html(o)}</option>`).join('')}</select>`;
  else if(f.kind==='number') control=`<input type="number" name="${f.key}" value="${f.value}" min="${f.min}" max="${f.max}" step="1" required>`;
  else control=`<input type="date" name="${f.key}" data-offset="${f.offset}" required>`;
  return `<label><span>${html(f.label)}</span>${control}</label>`;
}

function miniPanel(i) {
  const m=minis[i.slug];
  return `<section id="example" class="ct-mini" aria-labelledby="ct-mini-title"><header><span>${html(m.brand)}</span><span>Planning tool</span></header><div class="ct-mini-body"><h2 id="ct-mini-title">${html(m.title)}</h2><p>${html(m.intro)}</p><form data-mini="${i.slug}"><div class="ct-fields">${m.fields.map(fieldControl).join('')}</div><p class="ct-error" role="alert" hidden></p><button class="ct-button" type="submit">${html(m.submit)} <span aria-hidden="true">→</span></button></form><div class="ct-result" tabindex="-1" hidden></div><div class="ct-local-note">Runs in this browser. Nothing is sent, and any prices are illustrative.</div></div></section>`;
}

function caseVisual(p) {
  return `<div class="ct-image"><img src="${html(p.image)}" alt=""></div>`;
}

function industryPage(i) {
  const p=bySlug(projects,i.project);
  const sol=bySlug(solutions,i.solution);
  // An industry led by its own website shows that website instead of an inline planner.
  const mini=p.kind!=='website' && Object.hasOwn(minis,i.slug);
  const target=mini?'#example':p.url;
  const related=[p];
  if(i.slug==='salons')related.push(bySlug(projects,'nukkad-naai'));
  const realWork={'therapy-practices':'manakar',creatives:'pocket-portfolio',professionals:'pocket-portfolio',retail:'laptop-buy-guide',wholesale:'laptop-buy-guide',automotive:'velluto-gt'};
  if(realWork[i.slug])related.push(bySlug(projects,realWork[i.slug]));
  return `<article class="ct" style="--ct-accent:${i.accent}">
    <div class="ct-crumb"><a href="/industries">Business types</a><span>/</span>${html(i.title)}</div>
    <div class="ct-top"><div class="ct-heading"><p class="ct-eyebrow">Websites & business tools</p><h1>${html(i.title)}</h1><p class="ct-lead">${html(i.description)}</p><div class="ct-actions">${link(target,i.task,'primary')}${link(sampleLink(i.slug,mini?null:p.slug,i.solution),'Request a free sample')}</div></div>
    ${mini?miniPanel(i):`<div class="ct-feature">${caseVisual(p)}<div><p class="ct-eyebrow">${html(labelOf(p))} · ${html(p.category)}</p><h2>${html(p.title)}</h2><p>${html(p.description)}</p></div></div>`}</div>
    <section class="ct-addon"><div>${caption('For an existing website','Add to the site you already have.',i.addon)}</div>${link('/solutions/'+sol.slug,sol.title)}</section>
    ${more('Related projects',related)}
  </article>`;
}

function casePage(p) {
  const i=bySlug(industries,p.industry), sample=sampleLink(i.slug,p.slug);
  const study=Object.hasOwn(studies,p.slug)?studies[p.slug]:caseStudy, similar='Request a similar '+kinds[p.kind].label.toLowerCase();
  return `<article class="ct${p.slug==='daybreak-cafe'?' ct-study':''}" style="--ct-accent:${i.accent}"><div class="ct-crumb"><a href="/work">Work</a><span>/</span>${html(p.title)}</div>
    <div class="ct-top"><div class="ct-heading"><p class="ct-eyebrow">${html(labelOf(p))} · ${html(p.category)}</p><h1>${html(p.title)}</h1><p class="ct-lead">${html(p.description)}</p><div class="ct-actions">${link(p.url,p.action,'primary')}${link(sample,similar)}</div></div>${caseVisual(p)}</div>
    ${study({p,link,sample,similar,html,note:statusNotes[p.status]})}
    <section class="ct-related"><h2>Explore this business type</h2>${subjectLink(i)}</section></article>`;
}

function solutionPage(s) {
  const lead=bySlug(projects,s.projects[0]);
  return `<article class="ct"><div class="ct-crumb"><a href="/solutions">Solutions</a><span>/</span>${html(s.title)}</div>
    <div class="ct-top"><div class="ct-heading"><p class="ct-eyebrow">Solutions</p><h1>${html(s.title)}</h1><p class="ct-lead">${html(s.description)}</p><div class="ct-actions">${link(lead.url,'Explore '+lead.title,'primary')}${link(sampleLink(lead.industry,lead.slug,s.slug),'Request a free sample')}</div></div>${caseVisual(lead)}</div>
    ${more('Related projects',s.projects.map(slug=>bySlug(projects,slug)))}
    <section class="ct-related"><h2>Solutions by business type</h2><div class="ct-grid">${s.industries.map(slug=>subjectLink(bySlug(industries,slug))).join('')}</div></section></article>`;
}

export function detailPage(kind,slug) {
  const types={for:[industries,industryPage],work:[projects,casePage],solutions:[solutions,solutionPage]};
  if(!Object.hasOwn(types,kind))return '';
  const [items,render]=types[kind], data=bySlug(items,slug);
  return data?render(data):'';
}

export function mountDetail(root) {
  const form=root.querySelector('form[data-mini]');
  if(!form || form.dataset.mounted)return;
  form.dataset.mounted='true';
  const m=minis[form.dataset.mini],panel=form.closest('.ct-mini');
  if(!m || !panel)return;
  const box=panel.querySelector('.ct-result'), error=form.querySelector('.ct-error');
  for(const input of form.querySelectorAll('input[type=date]')) {
    input.min=dateValue(0);
    input.value=dateValue(Number(input.dataset.offset));
  }
  form.addEventListener('input',()=>{error.hidden=true});
  form.addEventListener('submit',event=>{
    event.preventDefault();
    if(!form.reportValidity())return;
    const values=Object.fromEntries(new FormData(form));
    const errorText=m.validate?.(values);
    if(errorText){error.textContent=errorText;error.hidden=false;return;}
    const s=m.summary(values);
    error.hidden=true;
    box.innerHTML=`<p class="ct-eyebrow">Ready to review</p><h3>${html(s.title)}</h3><ul>${s.lines.map(l=>`<li>${html(l)}</li>`).join('')}</ul>${s.link?link(s.link[1],s.link[0]):''}<button type="button" class="ct-back">← Edit choices</button>`;
    form.hidden=true;box.hidden=false;box.focus();
    box.querySelector('.ct-back').addEventListener('click',()=>{
      box.hidden=true;form.hidden=false;form.querySelector('input, select')?.focus();
    });
  });
}
