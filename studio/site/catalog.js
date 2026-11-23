// Editorial records are shared by the statically generated routes and the browser.
const sector = (slug, title, description, task, project, solution, accent, addon) =>
  ({ slug, title, description, task, project, solution, accent, addon });

export const industries = [
  sector('salons', 'Salons & barbers', 'Let someone choose a service, see how long it takes and request a time with their stylist.', 'Try the salon booking demo', 'salon-booking', 'bookings', '#924858', 'Keep your service pages and add a booking link to each treatment. A sample can include a staff view of incoming requests.'),
  sector('cafes', 'Cafés & restaurants', 'Put the menu in someone’s hand as they walk past, then give a larger party a simple way to ask about a table.', 'Explore the café menu', 'daybreak-cafe', 'menus', '#89552e', 'Give your existing menu a direct mobile link. Add a group dining enquiry alongside your current reservations.'),
  sector('therapy-practices', 'Clinics & therapists', 'Help visitors understand the services you offer and choose a convenient time to get in touch.', 'Try an appointment enquiry', 'stillwater', 'bookings', '#3e6f67', 'Add a focused appointment request to your current service pages. A practice can choose which fields its team needs.'),
  sector('fitness-studios', 'Gyms & movement studios', 'Show first-time visitors which class fits their level, their schedule and how they like to move.', 'Choose a trial class', 'kinetic-yard', 'bookings', '#595e31', 'Embed a trial-class chooser next to your existing timetable and manage the capacity for each class.'),
  sector('education', 'Tutors & learning centres', 'Help a learner choose a subject, a level and a trial lesson that fits their week.', 'Plan a trial lesson', 'brightpath', 'bookings', '#465e84', 'Add trial-lesson requests to your course pages. Each request can carry the subject and level into your teaching schedule.'),
  sector('hospitality', 'Hotels & homestays', 'Turn a room description into a stay enquiry with the right room size, dates and number of guests.', 'Build a stay enquiry', 'casa-neem', 'bookings', '#7c6631', 'Keep your room gallery and add a date enquiry for families, retreats or group stays.'),
  sector('creatives', 'Photographers & creatives', 'Help a visitor connect a portfolio piece with a shoot, a commission or a brief of their own.', 'Build a shoot brief', 'frame-field', 'portfolios', '#5f5181', 'Add a brief builder beneath your gallery so each enquiry arrives with the format, setting and intended use.'),
  sector('events', 'Venues & event teams', 'Let a planner compare setups and see which package suits their guest list before they enquire.', 'Estimate an event setup', 'hall-eleven', 'quotes', '#844d52', 'Add a package estimator to your venue pages. Send the guest count and preferred setup to your team.'),
  sector('home-services', 'Home services & trades', 'Give a customer a simple way to describe the property and get a first estimate for the job.', 'Estimate a cleaning visit', 'brightnest', 'quotes', '#456856', 'Link a quote form to each service page, then carry accepted work into job tracking and invoices.'),
  sector('retail', 'Shops & boutiques', 'Help customers find the right product and ask about an exact item, finish or quantity.', 'Pick a product to enquire about', 'loom-lane', 'catalogs', '#8b583f', 'Add filters and product enquiries to your existing catalog. Use the same item references in stock and billing tools.'),
  sector('automotive', 'Automotive businesses', 'Let a driver choose a vehicle size and build a detailing estimate before contacting the workshop.', 'Price a detailing package', 'gloss-lab', 'quotes', '#375c70', 'Add an estimate builder or test-drive enquiry alongside your current service and model pages.'),
  sector('pet-care', 'Pet care & boarding', 'Collect the stay dates, room preference and pet details that a boarding team needs to check availability.', 'Plan a boarding stay', 'wagtail-lodge', 'bookings', '#885041', 'Attach a boarding enquiry to the accommodation page and let returning owners request their usual stay.'),
  sector('professionals', 'Consultants & advisers', 'Help a visitor describe the business question they want to discuss and choose a suitable consultation.', 'Prepare a consultation brief', 'northline', 'portfolios', '#505f80', 'Add consultation briefs or a document checklist to the contact flow on your current site.'),
  sector('wholesale', 'Manufacturers & wholesalers', 'Collect the exact material, pack size and quantity so a trade enquiry can go straight to estimating.', 'Build a trade quotation request', 'mill-crate', 'catalogs', '#566954', 'Connect a request-for-quotation form to each product specification and keep the chosen SKU with the enquiry.'),
  sector('other-businesses', 'Other businesses', 'Choose what you want a customer or team member to do. Find a working example you can use as the starting point.', 'Find an example for my business', 'studio-billing', 'billing', '#715b83', 'Start with one task your current site leaves to phone calls or spreadsheets. A sample can show how that single step could work.')
];

const project = (slug, title, type, description, category, image, industry, action, url, role, steps) =>
  ({ slug, title, type, description, category, image: '/assets/' + image + '.webp', industry, action, url, role, steps });

export const projects = [
  project('salon-booking', 'Salon booking', 'Studio demo', 'A service-to-stylist booking flow with a sample request for the front desk.', 'Booking systems', 'salon-hero', 'salons', 'Try the booking demo', '/demo/salon-booking',
    'I designed this salon example to show both sides of a booking request, from the visitor’s first choice to the front desk’s incoming list.',
    ['Pick a service and compare the price and duration.', 'Choose a stylist, a day and a sample slot.', 'Review the details, send the sample and inspect the owner view.']),
  project('daybreak-cafe', 'Daybreak Café', 'Studio demo', 'A mobile café menu with dish details and an enquiry for group tables.', 'Menus & enquiries', 'daybreak-cafe-hero', 'cafes', 'Visit the café demo', '/demo/daybreak-cafe',
    'I built a fictional café experience around two everyday questions: what is on the menu today, and how to ask about a group table.',
    ['Open the menu and explore the food and drinks.', 'Choose an item to see its description and price.', 'Send a sample group dining enquiry and see its acknowledgement.']),
  project('studio-billing', 'Studio billing', 'Studio demo', 'An editable invoice that carries a sample customer, items and totals into an owner’s invoice list.', 'Billing tools', 'ledger-hero', 'home-services', 'Try the invoice demo', '/demo/studio-billing',
    'I built this example for owners who prepare an estimate or invoice across multiple line items and need a printable record.',
    ['Choose a sample customer and add line items.', 'Adjust quantities and review the calculated invoice.', 'Issue the sample invoice, open it in the list and print it.']),
  project('casa-neem', 'Casa Neem', 'Studio demo', 'A homestay booking enquiry that checks room size against guests and prices the stay night by night.', 'Booking systems', 'neem-hero', 'hospitality', 'Plan a stay', '/demo/casa-neem',
    'I built this homestay example so a guest can choose a room, see whether it fits everyone and know the nightly total before they write to the host.',
    ['Choose a room and compare sleeping capacity and price.', 'Pick dates and guests, then add breakfast or an airport pickup.', 'Send the sample enquiry and open the host’s list.']),
  project('hall-eleven', 'Hall Eleven', 'Studio demo', 'An event venue estimator that sizes the guest list to each setup and shows a per-guest cost.', 'Quotes & estimates', 'hall-hero', 'events', 'Estimate an event', '/demo/hall-eleven',
    'I built this venue example for planners who want a realistic number before they book a walkthrough.',
    ['Choose the occasion and a date at least two weeks out.', 'Pick a banquet, theatre or cocktail setup within its capacity.', 'Add a menu and extras, then send the estimate to the events team.']),
  project('brightnest', 'Brightnest', 'Studio demo', 'A cleaning quote that prices the home, the type of clean and a regular-visit discount, then books a slot.', 'Quotes & estimates', 'nest-hero', 'home-services', 'Price a cleaning visit', '/demo/brightnest',
    'I built this home-services example so a customer sees the price before anyone visits, and the team receives every detail that changes it.',
    ['Describe the property with bedroom and bathroom counts.', 'Choose a standard, deep or move-out clean and any extras.', 'Pick a regular plan and an open arrival window, then request the visit.']),
  project('kinetic-yard', 'Kinetic Yard', 'Studio demo', 'A trial-class finder that matches goal and experience to a timetable with live spots left.', 'Booking systems', 'yard-hero', 'fitness-studios', 'Find a trial class', '/demo/kinetic-yard',
    'I built this studio example so a newcomer can find a class at the right level on a day with space, without messaging the front desk.',
    ['Choose a training goal and an experience level.', 'Pick a day and see which classes still have spots.', 'Claim the free trial and see it on the coach’s list.']),
  project('brightpath', 'Brightpath Tutors', 'Studio demo', 'A tutoring enquiry that turns subject, grade and format into a trial lesson and a monthly plan.', 'Booking systems', 'path-hero', 'education', 'Plan a trial lesson', '/demo/brightpath',
    'I built this learning-centre example for parents who want to know the time, the format and the monthly fee before the first lesson.',
    ['Choose a subject and grade.', 'Pick centre or online and lessons per week.', 'Book a trial slot and see the monthly plan.']),
  project('wagtail-lodge', 'Wagtail Lodge', 'Studio demo', 'A pet boarding request that matches pet size and count to a suite and checks vaccinations.', 'Booking systems', 'wag-hero', 'pet-care', 'Plan a boarding stay', '/demo/wagtail-lodge',
    'I built this boarding example to collect the details a lodge needs before it can say yes: the pet, the suite, the dates and the vaccination card.',
    ['Tell the lodge about your pet and how many are coming.', 'Choose a suite that fits their size.', 'Pick dates and extras, confirm vaccinations and send the request.']),
  project('stillwater', 'Stillwater Practice', 'Studio demo', 'A calm first-session request for a counselling practice that asks only for what is needed.', 'Booking systems', 'still-hero', 'therapy-practices', 'Request a first session', '/demo/stillwater',
    'I built this practice example to make the first step feel quiet and safe: a few choices, a first name and a clear note about what happens next.',
    ['Choose individual, couples or teen support.', 'Pick in-person or video and a preferred time.', 'Share a first name and send the request.']),
  project('frame-field', 'Frame & Field', 'Studio demo', 'A photography brief builder that filters the portfolio, sizes the shoot and prices usage rights.', 'Portfolio websites', 'frame-hero', 'creatives', 'Build a shoot brief', '/demo/frame-field',
    'I built this studio example so a client can move from a picture they like to a brief the photographer can quote on.',
    ['Filter the work and choose the closest kind of shoot.', 'Set hours, deliverables and where the photos will be used.', 'Describe the idea and send the brief.']),
  project('loom-lane', 'Loom & Lane', 'Studio demo', 'A boutique catalogue with filters, size and stock checks and a hold-in-store request.', 'Catalogs', 'loom-hero', 'retail', 'Pick a product', '/demo/loom-lane',
    'I built this boutique example for shops that sell in person: a customer finds the piece online and asks the shop to set it aside.',
    ['Filter the rail and choose a piece.', 'Pick a size and colour with live stock.', 'Ask the shop to hold it or ship it.']),
  project('gloss-lab', 'Gloss Lab', 'Studio demo', 'A detailing configurator that prices package, vehicle size and paint condition with time in the bay.', 'Quotes & estimates', 'gloss-hero', 'automotive', 'Price a detailing package', '/demo/gloss-lab',
    'I built this workshop example so a driver can build a detail to the rupee and the workshop knows the car before it arrives.',
    ['Choose a vehicle size and describe the paint.', 'Pick a package and add-ons.', 'Choose a drop-off slot and book the bay.']),
  project('northline', 'Northline Advisory', 'Studio demo', 'A consultation brief for an advisory firm that matches the question to the right meeting length.', 'Professional portfolios', 'north-hero', 'professionals', 'Prepare a consultation brief', '/demo/northline',
    'I built this advisory example so the first meeting starts with the question already written down and the right amount of time booked.',
    ['Choose a topic and business stage.', 'Write the question, set urgency and list documents.', 'Pick a consultation length and send the brief.']),
  project('mill-crate', 'Mill & Crate', 'Studio demo', 'A trade quotation builder with material, size and print options and tiered unit pricing.', 'Catalogs', 'mill-hero', 'wholesale', 'Build a trade quotation', '/demo/mill-crate',
    'I built this packaging example so a buyer can spec a box, see volume breaks and send estimating a request they can quote straight away.',
    ['Choose a box style.', 'Set board, size and print.', 'Enter a quantity and see unit price, plates and lead time.']),
  project('manakar', 'Manakar', 'Client work', 'A Hadapsar psychology practice website with service information and appointment requests.', 'Practice websites', 'therapy', 'therapy-practices', 'Visit Manakar', 'https://www.manakar.in/',
    'I built the practice website for a clinical psychologist in Hadapsar, Pune. The live site credits me in its footer.',
    ['Read the practitioner introduction and explore the services.', 'Open the appointment section to see how the practice takes enquiries.', 'The request form includes service, preferred date and preferred time.']),
  project('nukkad-naai', 'Nukkad Naai', 'Client work', 'A barbershop radio page built around an illustrated setting and a jukebox.', 'Brand experiences', 'nukkad', 'salons', 'Open the barbershop radio', 'https://nukad-nai.vercel.app/',
    'I built a barbershop radio website for Nukkad Naai. It is an example of giving a business its own character online.',
    ['Enter the corner barbershop setting.', 'Explore the radio interface.', 'Choose music from the jukebox.']),
  project('laptop-buy-guide', 'LaptopBuyGuide', 'Independent project', 'A product guide that helps visitors narrow the range by use case, budget and specifications.', 'Catalogs', 'catalog', 'retail', 'Open LaptopBuyGuide', 'https://laptop-buy-guide-v1.vercel.app/',
    'I built a comparison site that organizes laptops around the buyer’s needs. A shop can use that same approach when a catalog has many similar products.',
    ['Start with a use case such as study, gaming or business.', 'Narrow the list by budget or specifications.', 'Compare products with a shorter, more relevant list.']),
  project('velluto-gt', 'Velluto GT', 'Studio concept', 'A cinematic automotive concept that reveals a coachbuilt grand tourer through scrolling.', 'Product storytelling', 'auto', 'automotive', 'Explore Velluto GT', 'https://velluto-gt.vercel.app/',
    'I designed this automotive concept to explore a product reveal through motion and detail. The fictional vehicle gives the presentation a single subject.',
    ['Open the coachbuilt grand tourer presentation.', 'Scroll to reveal the vehicle.', 'Follow the visual sequence through the design details.']),
  project('pocket-portfolio', 'Pocket Portfolio', 'Independent project', 'A reusable personal portfolio that presents work, services and contact details inside an interactive phone.', 'Professional portfolios', 'pocket', 'creatives', 'View the portfolio template', 'https://github.com/chetanpujari5105/pocket-portfolio-template',
    'I built this reusable portfolio template for people who want an interactive way to present projects. The template ships with fictional content and a guide to personalizing it.',
    ['Explore the template screenshots and setup guide.', 'Browse the project, service and contact views.', 'See how the editable content can be adapted for another practice.'])
];

export const solutions = [
  {slug:'bookings', title:'Appointments & bookings', description:'Guide a visitor from a service or class to a specific request your team can act on.', industries:['salons','therapy-practices','fitness-studios','education','hospitality','pet-care'], projects:['stillwater','wagtail-lodge','brightpath','kinetic-yard','casa-neem','salon-booking','manakar']},
  {slug:'menus', title:'Menus & dining enquiries', description:'Make the menu easy to browse on a phone, with a short route from a dish to a group enquiry.', industries:['cafes','hospitality','events'], projects:['daybreak-cafe']},
  {slug:'portfolios', title:'Portfolio websites', description:'Present selected work and give interested visitors a way to start a relevant brief.', industries:['creatives','professionals','automotive'], projects:['northline','frame-field','pocket-portfolio','velluto-gt','nukkad-naai']},
  {slug:'catalogs', title:'Catalogs & product discovery', description:'Help buyers narrow a range, compare specifications and ask about a particular item.', industries:['retail','wholesale','automotive'], projects:['mill-crate','loom-lane','laptop-buy-guide']},
  {slug:'quotes', title:'Quotes & estimates', description:'Collect the details that change the price, then turn those choices into a clear estimate or brief.', industries:['events','home-services','automotive','wholesale'], projects:['gloss-lab','brightnest','hall-eleven','studio-billing']},
  {slug:'billing', title:'Invoicing & billing', description:'Give an owner one place to choose items, check totals and issue a printable invoice.', industries:['home-services','retail','professionals','other-businesses'], projects:['studio-billing']}
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
    brand:'Willow Practice', title:'Request an introductory appointment', intro:'Choose a format and preferred time using the fictional practice below.', submit:'Preview appointment request',
    fields:[choice('service','Appointment type',['Introductory consultation','Follow-up consultation']),choice('format','Visit format',['In person','Video call']),day('date','Preferred date'),choice('time','Preferred time',['09:30','11:00','15:30'])],
    summary:v=>result('Sample appointment request',[v.service + ' · ' + v.format,formatDay(v.date) + ' at ' + v.time,'The practice would check availability before confirming.'])
  },
  'fitness-studios': {
    brand:'Form Club', title:'Find a trial class', intro:'Compare three classes and reserve a sample trial place in the next session.', submit:'Preview trial pass',
    fields:[choice('class','Class & level',['Mat Pilates · beginner','Strength Basics · beginner','Vinyasa Flow · intermediate']),choice('session','Session',['Weekday morning','Weekend morning']),quantity('places','Trial places',1,3,1)],
    summary:v=>{const times={'Mat Pilates · beginner':['Tuesday 08:00','Saturday 09:00'],'Strength Basics · beginner':['Thursday 07:30','Saturday 10:00'],'Vinyasa Flow · intermediate':['Wednesday 08:30','Sunday 09:30']}; return result('Your sample trial pass',[v.class,times[v.class][v.session==='Weekday morning'?0:1]+' · '+v.places+' trial '+(v.places==='1'?'place':'places'),'Arrive ten minutes before the class for an introduction.'])}
  },
  education:{
    brand:'Fieldnote Music School',title:'Choose a trial lesson',intro:'Pick an instrument and level to put together a first-lesson outline.',submit:'Build lesson outline',
    fields:[choice('instrument','Instrument',['Piano','Guitar','Voice']),choice('level','Current level',['First lesson','Some experience']),choice('mode','Teaching format',['One to one','Small group'])],
    summary:v=>{const exercises={Piano:['Five-note patterns','Chords and melody'],Guitar:['Open strings and rhythm','Chord transitions'],Voice:['Breathing and pitch','Phrasing and dynamics']};return result('Your trial lesson outline',[v.instrument+' · '+v.mode, v.level==='First lesson'?'25-minute introduction':'40-minute assessment','First exercise: '+exercises[v.instrument][v.level==='First lesson'?0:1]])}
  },
  hospitality:{
    brand:'Fern House',title:'Plan a stay',intro:'Check a room’s capacity and prepare a stay enquiry using sample rates.',submit:'Preview stay enquiry',
    fields:[choice('room','Room',['Courtyard double','Garden suite','Family loft']),quantity('guests','Guests',1,5,2),...stayFields],
    validate:v=>dateValidation(v) || (Number(v.guests)>({'Courtyard double':2,'Garden suite':3,'Family loft':5}[v.room])?'This room is too small for your party. Choose a larger room or fewer guests.':''),
    summary:v=>{const n=nights(v.start,v.end);return result('Your stay enquiry',[v.room+' · '+v.guests+' guest(s)',formatDay(v.start)+' to '+formatDay(v.end)+' · '+n+' night(s)',money(n*({'Courtyard double':3500,'Garden suite':4900,'Family loft':6400}[v.room]))+' estimated room total. Availability is subject to confirmation.'])}
  },
  creatives:{
    brand:'Matter & Light',title:'Write a shoot brief',intro:'Combine a subject, location and delivery format into a brief a photographer can quote.',submit:'Build shoot brief',
    fields:[choice('type','Shoot type',['Editorial portrait','Product still life','Architecture']),choice('setting','Setting',['Studio','Client location','Outdoor location']),choice('deliver','Final use',['Website gallery','Print feature','Social campaign'])],
    summary:v=>result('Your photography brief',[v.type+' at '+v.setting.toLowerCase(),'Deliver for: '+v.deliver,{ 'Website gallery':'Request a web-ready set with horizontal and vertical crops.','Print feature':'Request high-resolution files and a print usage quote.','Social campaign':'Request portrait and square crops for the campaign.' }[v.deliver]])
  },
  events:{
    brand:'Orchard Hall',title:'Estimate an event setup',intro:'Choose a layout and menu to see a planning estimate at this fictional venue.',submit:'Estimate setup',
    fields:[choice('layout','Room layout',['Seated dinner','Standing reception','Workshop tables']),quantity('count','Guest count',10,150,40),choice('menu','Food service',['Coffee & light bites','Buffet meal','Plated meal'])],
    validate:v=>Number(v.count)>({'Seated dinner':80,'Standing reception':150,'Workshop tables':50}[v.layout])?'That setup exceeds the room capacity. Reduce guests or change the layout.':'',
    summary:v=>{const food=({'Coffee & light bites':320,'Buffet meal':750,'Plated meal':950}[v.menu])*v.count;return result('Sample event estimate',[v.layout+' for '+v.count+' guests',v.menu+': '+money(food),'Room hire: '+money(18000)+' · Estimated total: '+money(18000+food)])}
  },
  'home-services':{
    brand:'Tidy House',title:'Estimate a cleaning visit',intro:'Build a sample job estimate using property size, visit type and add-ons.',submit:'Calculate estimate',
    fields:[choice('size','Property',['Studio','2-bedroom home','3-bedroom home']),choice('visit','Visit type',['Maintenance clean','Deep clean']),choice('extra','Extra service',['No extra service','Oven cleaning','Interior windows'])],
    summary:v=>{const hours=({Studio:2,'2-bedroom home':3,'3-bedroom home':4}[v.size])*(v.visit==='Deep clean'?2:1);const extra=({'No extra service':0,'Oven cleaning':450,'Interior windows':600}[v.extra]);return result('Sample cleaning estimate',[v.visit+' · '+v.size,hours+' estimated labour hours at '+money(450)+'/hour',v.extra+' · Estimated total: '+money(hours*450+extra)])}
  },
  retail:{
    brand:'Common Goods',title:'Build a product enquiry',intro:'Choose a handmade item, its finish and a quantity to see a shop enquiry.',submit:'Preview item enquiry',
    fields:[choice('item','Product',['Turned mug','Breakfast bowl','Serving platter']),choice('finish','Glaze',['Chalk','Moss','Russet']),quantity('qty','Quantity',1,20,2)],
    summary:v=>{const unit=({'Turned mug':680,'Breakfast bowl':850,'Serving platter':1690}[v.item]);return result('Your item enquiry',[v.qty+' × '+v.item+' · '+v.finish,'Sample unit price: '+money(unit),'Merchandise estimate: '+money(unit*v.qty)+'. The shop would confirm stock.'])}
  },
  automotive:{
    brand:'Westside Detail',title:'Build a detailing estimate',intro:'Choose your vehicle and finish to see an estimated appointment length and price.',submit:'Estimate service',
    fields:[choice('vehicle','Vehicle size',['Hatchback','Sedan','SUV']),choice('package','Detailing package',['Exterior wash','Interior detail','Full detail'])],
    summary:v=>{const factor=({Hatchback:1,Sedan:1.15,SUV:1.4}[v.vehicle]);const base=({'Exterior wash':[600,40],'Interior detail':[1900,100],'Full detail':[2900,160]}[v.package]);return result('Sample detailing estimate',[v.vehicle+' · '+v.package,'Allow approximately '+Math.round(base[1]*factor/5)*5+' minutes.','Sample service cost: '+money(Math.round(base[0]*factor))])}
  },
  'pet-care':{
    brand:'Cedar Paws',title:'Plan a boarding stay',intro:'Prepare a boarding enquiry with your pet’s stay dates and accommodation.',submit:'Preview boarding enquiry',
    fields:[choice('pet','Pet',['Dog','Cat']),choice('room','Room type',['Standard room','Quiet suite']),...stayFields],
    validate:dateValidation,
    summary:v=>{const n=nights(v.start,v.end);const rate=(v.pet==='Dog'?850:650)+(v.room==='Quiet suite'?250:0);return result('Your boarding enquiry',[v.pet+' · '+v.room,formatDay(v.start)+' to '+formatDay(v.end)+' · '+n+' night(s)',money(n*rate)+' sample stay estimate. The team would confirm space and care requirements.'])}
  },
  professionals:{
    brand:'Northline Advisory',title:'Prepare a consultation brief',intro:'Choose a subject and meeting length to build an agenda you could share with an adviser.',submit:'Build consultation agenda',
    fields:[choice('topic','Area to discuss',['Business planning','Bookkeeping setup','Process review']),choice('stage','Business stage',['Getting started','Established business']),choice('length','Meeting length',['20 minutes','45 minutes'])],
    summary:v=>result('Your consultation agenda',[v.topic+' · '+v.stage,v.length+' introductory meeting',{'Business planning':'Bring a short description of the business and your main priorities.','Bookkeeping setup':'Bring a list of your current bookkeeping tools and reporting needs.','Process review':'Bring an example of a recurring workflow you want to improve.'}[v.topic]])
  },
  wholesale:{
    brand:'Atlas Components',title:'Build a trade enquiry',intro:'Select a component and case quantity to prepare an RFQ with a traceable item reference.',submit:'Build quotation request',
    fields:[choice('part','Component',['M6 hex fastener','M8 hex fastener','M10 hex fastener']),choice('grade','Material',['Zinc-plated steel','Stainless steel']),quantity('cases','Cases of 100 units',1,250,5)],
    summary:v=>result('Your quotation request',['SKU '+v.part.split(' ')[0]+'-'+(v.grade==='Stainless steel'?'SS':'ZP')+' · '+v.grade, v.cases+' cases × 100 = '+(v.cases*100).toLocaleString('en-GB')+' units','Request a unit price, lead time and freight estimate for this quantity.'])
  },
  'other-businesses':{
    brand:'Project finder',title:'Find a working example',intro:'Choose the action that would make the biggest difference to your business.',submit:'Find my example',
    fields:[choice('job','What should someone be able to do?',['Request a time','Browse a menu','Compare products','See selected work','Issue an invoice','Estimate a service']),choice('existing','Current setup',['Starting a new site','Adding to an existing site'])],
    summary:v=>{const target={'Request a time':'salon-booking','Browse a menu':'daybreak-cafe','Compare products':'laptop-buy-guide','See selected work':'pocket-portfolio','Issue an invoice':'studio-billing','Estimate a service':'studio-billing'}[v.job];const p=projects.find(x=>x.slug===target);return result('A starting point for your project',[v.job,p.description,v.existing==='Starting a new site'?'Use this task as the starting point for a new website.':'Give this task its own link alongside your existing pages.'],v.job==='Estimate a service'?['See a service estimate','/for/home-services#example']:['See '+p.title,'/work/'+p.slug])}
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
const card = p => `<a class="ct-card" href="/work/${p.slug}"><div><p class="ct-eyebrow">${html(p.type)} · ${html(p.category)}</p><h3>${html(p.title)}</h3><p>${html(p.description)}</p></div><span aria-hidden="true">↗</span></a>`;
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
  return `<section id="example" class="ct-mini" aria-labelledby="ct-mini-title"><header><span>${html(m.brand)}</span><span>Studio demo</span></header><div class="ct-mini-body"><h2 id="ct-mini-title">${html(m.title)}</h2><p>${html(m.intro)}</p><form data-mini="${i.slug}"><div class="ct-fields">${m.fields.map(fieldControl).join('')}</div><p class="ct-error" role="alert" hidden></p><button class="ct-button" type="submit">${html(m.submit)} <span aria-hidden="true">→</span></button></form><div class="ct-result" tabindex="-1" hidden></div><div class="ct-local-note">Fictional example · Runs in this browser</div></div></section>`;
}

function caseVisual(p) {
  return `<div class="ct-image"><img src="${html(p.image)}" alt=""><span>${html(p.category)}</span></div>`;
}

function industryPage(i) {
  const p=bySlug(projects,i.project);
  const sol=bySlug(solutions,i.solution);
  // an industry with its own flow-engine demo shows that instead of the inline preview
  const mini=Boolean(minis[i.slug]) && !(p.url.startsWith('/demo/') && !['salon-booking','daybreak-cafe','studio-billing'].includes(p.slug));
  const target=mini?'#example':p.url;
  const related=[p];
  if(i.slug==='salons')related.push(bySlug(projects,'nukkad-naai'));
  const realWork={'therapy-practices':'manakar',creatives:'pocket-portfolio',professionals:'pocket-portfolio',retail:'laptop-buy-guide',wholesale:'laptop-buy-guide',automotive:'velluto-gt'};
  if(realWork[i.slug])related.push(bySlug(projects,realWork[i.slug]));
  return `<article class="ct" style="--ct-accent:${i.accent}">
    <div class="ct-crumb"><a href="/for">Business types</a><span>/</span>${html(i.title)}</div>
    <div class="ct-top"><div class="ct-heading"><p class="ct-eyebrow">Websites & business tools</p><h1>${html(i.title)}</h1><p class="ct-lead">${html(i.description)}</p><div class="ct-actions">${link(target,i.task,'primary')}${link(sampleLink(i.slug,mini?null:p.slug,i.solution),'Request a free sample')}</div></div>
    ${mini?miniPanel(i):`<div class="ct-feature">${caseVisual(p)}<div><p class="ct-eyebrow">${html(p.type)}</p><h2>${html(p.title)}</h2><p>${html(p.description)}</p></div></div>`}</div>
    <section class="ct-addon"><div>${caption('For an existing website','Add to the site you already have.',i.addon)}</div>${link('/solutions/'+sol.slug,sol.title)}</section>
    ${more(i.slug==='salons'?'Booking and brand work':mini?'Related projects':'Project details',related)}
  </article>`;
}

function casePage(p) {
  const i=bySlug(industries,p.industry);
  return `<article class="ct" style="--ct-accent:${i.accent}"><div class="ct-crumb"><a href="/work">Work</a><span>/</span>${html(p.title)}</div>
    <div class="ct-top"><div class="ct-heading"><p class="ct-eyebrow">${html(p.type)} · ${html(p.category)}</p><h1>${html(p.title)}</h1><p class="ct-lead">${html(p.description)}</p><div class="ct-actions">${link(p.url,p.action,'primary')}${link(sampleLink(i.slug,p.slug),'Request a similar sample')}</div></div>${caseVisual(p)}</div>
    <section class="ct-case-body"><div>${caption('By Chetan Pujari','What I built',p.role)}</div><div><p class="ct-eyebrow">Project walkthrough</p><ol>${p.steps.map(t=>`<li>${html(t)}</li>`).join('')}</ol></div></section>
    <section class="ct-related"><h2>Explore this business type</h2>${subjectLink(i)}</section></article>`;
}

function solutionPage(s) {
  const lead=bySlug(projects,s.projects[0]);
  return `<article class="ct"><div class="ct-crumb"><a href="/work">Work</a><span>/</span>${html(s.title)}</div>
    <div class="ct-top"><div class="ct-heading"><p class="ct-eyebrow">Business tools</p><h1>${html(s.title)}</h1><p class="ct-lead">${html(s.description)}</p><div class="ct-actions">${link('/work/'+lead.slug,'Explore '+lead.title,'primary')}${link(sampleLink(lead.industry,lead.slug,s.slug),'Request a free sample')}</div></div>${caseVisual(lead)}</div>
    ${more('Projects to explore',s.projects.map(slug=>bySlug(projects,slug)))}
    <section class="ct-related"><h2>Examples by business type</h2><div class="ct-grid">${s.industries.map(slug=>subjectLink(bySlug(industries,slug))).join('')}</div></section></article>`;
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
    box.innerHTML=`<p class="ct-eyebrow">Sample preview</p><h3>${html(s.title)}</h3><ul>${s.lines.map(l=>`<li>${html(l)}</li>`).join('')}</ul>${s.link?link(s.link[1],s.link[0]):''}<button type="button" class="ct-back">← Edit choices</button>`;
    form.hidden=true;box.hidden=false;box.focus();
    box.querySelector('.ct-back').addEventListener('click',()=>{
      box.hidden=true;form.hidden=false;form.querySelector('input, select')?.focus();
    });
  });
}
