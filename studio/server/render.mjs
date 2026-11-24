import { brandPage } from '../brands/pages.mjs';
import { industries, projects, solutions, detailPage } from '../site/catalog.js';
import { samplePage } from '../site/intake.js';
import { ownerPage } from '../site/owner.js';

const siteName = 'Chetan Studio';
// featured: the three homepage posters; every other /demo/ project is a flow-engine kit with its own stylesheet
const featured = ['daybreak-cafe', 'salon-booking', 'studio-billing'];
const featureNames = ['Daybreak Café', 'Studio Forma', 'Ledger Desk'];
const demoSlugs = projects.filter(p => p.url.startsWith('/demo/')).map(p => p.slug);
const summary = 'Websites, booking pages and business tools by Chetan Pujari. Explore client work and working demos, then request a free sample for your business.';
const e = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const logo = '<span class="studio-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span>';
const gridIcon = '<span class="grid-icon" aria-hidden="true"><i></i><i></i><i></i><i></i></span>';
const globe = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/></svg>';
const contact = 'mailto:chetanpujari92@gmail.com';
function brand(){return '<a class="studio-brand" href="/" aria-label="Chetan Studio home">'+logo+'<span>Chetan Studio<span class="brand-period">.</span></span></a>'}
function header(path){
  const nav=[['/work','Work'],['/industries','Industries'],['/solutions','Solutions']];
  return `<a class="skip" href="#content">Skip to content</a><header class="topbar"><div class="wrap nav-inner">${brand()}<nav class="primary-nav" aria-label="Main navigation" id="primary-nav">${nav.map(([url,name])=>`<a href="${url}"${path.startsWith(url)||url==='/industries'&&path.startsWith('/for/')?' aria-current="page"':''}>${name}</a>`).join('')}</nav><div class="nav-actions"><a class="nav-cta" href="/sample">Get a free sample</a><button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" aria-label="Open navigation"><i></i><i></i></button></div></div></header>`;
}
function footer(){return `<footer class="studio-footer"><div class="wrap foot-inner">${brand()}<div class="foot-contact"><a href="${contact}">Email Chetan</a><a href="https://www.instagram.com/_chetan_pujari/">Instagram</a><a href="https://nfcportfolio-two.vercel.app/">Personal portfolio</a></div><span>© Chetan Pujari</span></div></footer>`}
function visual(id){
  if(id==='salon-booking')return `<div class="art art-salon"><img src="/assets/salon-hero.webp" alt="" decoding="async"><div class="salon-mast"><small>H A I R &nbsp; S T U D I O</small><strong>Forma<span>.</span></strong></div><div class="poster-bottom"><span>Services & appointments</span></div></div>`;
  if(id==='studio-billing')return `<div class="art art-ledger"><div class="ledger-mast"><span class="ledger-symbol">▥</span> Ledger Desk</div><div class="receipt"><span>Sample invoice</span><b>Invoice #001</b><i></i><p>Creative services <strong>£240</strong></p><p>Print design <strong>£80</strong></p><i></i><p>Total <strong>£320</strong></p><div class="receipt-code"></div></div></div>`;
  const proj=projects.find(p=>p.slug===id);
  const image=id==='nukkad-naai'?'/assets/nukkad.webp':id==='pocket-portfolio'?'/assets/pocket.webp':proj?.image;
  return `<div class="art art-proof"><img src="${e(image)}" alt="" loading="lazy" decoding="async"></div>`;
}
function posterWall(){
  // An original interactive stack inspired by the tactile card motion in Rare UI's Folder.
  return `<div class="feature-frame" aria-label="Featured studio demos"><div class="feature-stage" data-feature="0">${featured.map((id,i)=>`<a class="poster poster-${i}" href="/demo/${id}" aria-label="Try the ${featureNames[i]} demo" ${i?'tabindex="-1" aria-hidden="true"':''}>${visual(id)}</a>`).join('')}</div><div class="feature-caption"><span class="caption-rule"></span><span id="feature-name" aria-live="polite">Daybreak Café</span><small>Studio demo</small><div class="feature-controls" role="group" aria-label="Choose a featured demo">${featureNames.map((name,i)=>`<button type="button" aria-label="Show ${name}" aria-pressed="${!i}" data-feature-select="${i}"><i></i></button>`).join('')}</div></div></div>`;
}
function projectCard(p){
  const ind=industries.find(x=>x.slug===p.industry);
  const name=featureNames[featured.indexOf(p.slug)] || p.title;
  return `<article class="work-card" data-type="${e(p.type)}" data-industry="${e(p.industry)}" data-keywords="${e([name,p.title,p.type,p.category,p.description,ind?.title].join(' ').toLowerCase())}"><a href="/work/${p.slug}" class="card-link"><div class="card-media card-${p.slug}"><div class="card-art">${visual(p.slug)}</div><span class="proof-label"><i></i>${e(p.type)}</span></div><div class="card-meta"><h3>${e(name)}</h3><span>${e(p.category)}</span></div><p>${e(p.description)}</p></a></article>`;
}
const projectOrder=['daybreak-cafe','salon-booking','manakar','studio-billing','casa-neem','hall-eleven','brightnest','kinetic-yard','brightpath','wagtail-lodge','stillwater','frame-field','loom-lane','gloss-lab','northline','mill-crate','nukkad-naai','laptop-buy-guide','velluto-gt','pocket-portfolio'];
function workList(home=false){
  let sorted=[...projects].sort((a,b)=>{const rank=s=>projectOrder.includes(s)?projectOrder.indexOf(s):999;return rank(a.slug)-rank(b.slug)});
  if(home)sorted=sorted.filter(p=>['daybreak-cafe','salon-booking','manakar','studio-billing','nukkad-naai','laptop-buy-guide'].includes(p.slug));
  return `<section class="work-section wrap" id="work"><div class="section-heading"><div><p class="eyebrow"><span class="eyeline"></span>Project collection</p>${home?'<h2>Selected work<span>.</span></h2>':'<h1>Explore the work<span>.</span></h1>'}</div>${home?'<a class="text-link" href="/work">View all projects</a>':''}</div><div class="work-tools"><div class="filter-row" role="group" aria-label="Filter projects">${[['','All work'],['Client work','Client work'],['Studio demo','Studio demos'],['Independent project','Independent']].map(([type,label],i)=>`<button type="button" class="filter" data-filter="${type}" aria-pressed="${!i}">${label}</button>`).join('')}</div>${home?'':`<label class="work-search"><span class="sr">Search projects</span><input type="search" data-search placeholder="Search projects"></label>`}</div><p class="sr" data-count role="status"></p><div class="project-grid">${sorted.map(projectCard).join('')}</div><p data-empty hidden>No projects match. <button class="inline-action" type="button" data-clear>Clear filters</button></p></section>`;
}
function industryList(){
  return `<section class="wrap listing"><p class="eyebrow"><span class="eyeline"></span>Business types</p><h1>Find your <em>industry.</em></h1><p class="intro">Open a working example for the way your customers book, shop or get in touch.</p><div class="directory">${industries.map((ind)=>`<a href="/for/${ind.slug}"><span class="dir-accent" style="--accent:${ind.accent}"></span><div><h2>${e(ind.title)}</h2><p>${e(ind.task)}</p></div></a>`).join('')}</div></section>`;
}
function solutionList(){
  return `<section class="wrap listing"><p class="eyebrow"><span class="eyeline"></span>Business tools</p><h1>What do you need <em>to build?</em></h1><p class="intro">Start with the job you want your website to do. Each collection includes a working example.</p><div class="directory">${solutions.map(s=>`<a href="/solutions/${s.slug}"><span class="dir-accent"></span><div><h2>${e(s.title)}</h2><p>${e(s.description)}</p></div></a>`).join('')}</div></section>`;
}
function home(){
  return `<section class="hero"><div class="wrap hero-inner"><div class="hero-copy"><p class="hero-kicker"><span class="pulse-mark"></span>Independent web studio</p><h1>Websites for<br><em>real businesses.</em></h1><p class="hero-note">Explore websites, booking pages and tools I build for businesses like yours. Find an example you like and I’ll make you a free sample.</p><div class="hero-actions"><a class="btn-studio primary" href="#work">${gridIcon} Browse projects</a><a class="quiet-link" href="/industries">Find my industry</a></div><p class="location">${globe} Based in Pune <span></span> Working worldwide</p></div>${posterWall()}</div></section>${workList(true)}<section class="sample-band"><div class="wrap sample-band-inner"><div><p class="eyebrow">Start with your business</p><h2>See it with <em>your name on it.</em></h2><p>Tell me what a customer should be able to do. I’ll use that brief to make a free sample you can try on your phone.</p></div><a class="btn-studio primary" href="/sample">Get a free sample</a></div></section>`;
}
function pageFor(url){
  const path=url.pathname.replace(/\/+$/,'')||'/';
  if(path==='/')return {body:home(),title:'Websites for real businesses',category:'home'};
  if(path==='/work')return {body:workList(),title:'Project collection',category:'work'};
  if(path==='/industries')return {body:industryList(),title:'Browse by industry'};
  if(path==='/solutions')return {body:solutionList(),title:'Business tools and solutions'};
  if(path==='/sample')return {body:'<div id="intake-root">'+samplePage(url.searchParams)+'</div>',title:'Request a free sample',category:'intake'};
  if(path==='/owner')return {body:'<div id="owner-root" class="wrap">'+ownerPage()+'</div>',title:'Sample requests',category:'owner',noindex:true};
  const [,kind,slug,extra]=path.split('/');
  if(!extra && slug && ['for','work','solutions'].includes(kind)){
    const rec=(kind==='for'?industries:kind==='work'?projects:solutions).find(p=>p.slug===slug);
    if(rec)return {title:rec.title,description:rec.description,body:'<div id="detail-root">'+detailPage(kind,slug)+'</div>',image:rec.image||projects.find(p=>p.slug===rec.project)?.image,category:'catalog'};
  }
  if((kind==='demo'||kind==='site') && demoSlugs.includes(slug)){
    const branded=brandPage(slug,path.split('/').slice(3).join('/'),url.searchParams,kind==='site');
    if(branded)return branded;
  }
  return {status:404,title:'Page not found',body:'<section class="wrap listing"><h1>Page not found.</h1><p class="intro">Explore the project collection to find the example you need.</p><a class="btn-studio primary" href="/work">Browse work</a></section>'};
}
export function siteResponse(request){
  const url=new URL(request.url);
  if(url.pathname==='/outreach-routes.json') {
    const mapping={salon:'salons',restaurant:'cafes',clinic:'therapy-practices',gym:'fitness-studios',coaching:'education',hotel:'hospitality',pet:'pet-care',auto:'automotive',home_services:'home-services',professional:'professionals',events:'events',retail:'retail',other:'other-businesses'};
    return Response.json(Object.entries(mapping).map(([niche,slug])=>({niche,url:new URL('/for/'+slug,url).href})));
  }
  const p=pageFor(url);
  const title=p.clean?e(p.title):e(p.title)+' | '+siteName;
  const desc=e(p.description||summary);
  // Brand pages load brands.css before the kit, so a brand's own site styles win over the shared .brand defaults.
  const css=(p.category&&['catalog','demos','intake','owner'].includes(p.category)?`<link rel="stylesheet" href="/ui/${p.category}.css">`:'')+(p.brand?'<link rel="stylesheet" href="/ui/brands.css">':'')+(p.kit?`<link rel="stylesheet" href="/ui/kit-${p.kit}.css">`:'');
  const canonical=e(url.origin+url.pathname);
  const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="${p.theme||'#faf9f6'}"><title>${title}</title><meta name="description" content="${desc}">${p.noindex?'<meta name="robots" content="noindex, nofollow">':''}<link rel="canonical" href="${canonical}"><meta property="og:type" content="website"><meta property="og:title" content="${title}"><meta property="og:description" content="${desc}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${e(url.origin+(p.image||'/assets/salon.webp'))}"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="${p.favicon?e(p.favicon):'/favicon.svg'}"><link rel="stylesheet" href="/ui/style.css">${css}${p.brand?'<script type="module" src="/ui/business.js"></script>':''}<script type="module" src="/ui/main.js"></script></head><body>${p.brand?'':header(url.pathname)}<main id="content">${p.body}</main>${p.brand?'':footer()}</body></html>`;
  return new Response(html,{status:p.status||200,headers:{'Content-Type':'text/html; charset=utf-8','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin'}});
}
