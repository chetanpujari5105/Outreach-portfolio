const navToggle = document.querySelector('.nav-toggle');
const navigation = document.querySelector('.primary-nav');
function setNav(open) {
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  navigation.classList.toggle('is-open', open);
}
navToggle?.addEventListener('click', () => setNav(navToggle.getAttribute('aria-expanded') === 'false'));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navToggle?.getAttribute('aria-expanded') === 'true') {
    setNav(false);
    navToggle.focus();
  }
});
const stage = document.querySelector('.feature-stage');
const controls = [...document.querySelectorAll('[data-feature-select]')];
const featured = ['Daybreak Café', 'Studio Forma', 'Ledger Desk'];
function showFeature(index) {
  stage.dataset.feature = String(index);
  document.querySelector('#feature-name').textContent = featured[index];
  controls.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
  stage.querySelectorAll('.poster').forEach((card, i) => {
    card.tabIndex = i === index ? 0 : -1;
    card.setAttribute('aria-hidden', String(i !== index));
  });
}
controls.forEach((button, index) => button.addEventListener('click', () => showFeature(index)));
const work = document.querySelector('.work-section');
if (work) {
  const filters = [...work.querySelectorAll('[data-filter]')];
  const search = work.querySelector('[data-search]');
  let type = '';
  function filterWork() {
    let count = 0;
    const query = search?.value.trim().toLowerCase() || '';
    for (const card of work.querySelectorAll('.work-card')) {
      card.hidden = Boolean(type && card.dataset.type !== type || !card.dataset.keywords.includes(query));
      if (!card.hidden) count++;
    }
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === type)));
    work.querySelector('[data-count]').textContent = count + ' matching projects';
    work.querySelector('[data-empty]').hidden = count > 0;
  }
  filters.forEach(button => button.addEventListener('click', () => { type = button.dataset.filter; filterWork(); }));
  search?.addEventListener('input', filterWork);
  work.querySelector('[data-clear]')?.addEventListener('click', () => { type = ''; if(search)search.value=''; filterWork(); filters[0].focus(); });
}
const demo = document.querySelector('#demo-root');
const intake = document.querySelector('#intake-root');
const detail = document.querySelector('#detail-root');
const owner = document.querySelector('#owner-root');
if (demo) import('./demos.js').then(({ mountDemo }) => mountDemo(demo, demo.dataset.slug));
if (intake) import('./intake.js').then(({ mountIntake }) => mountIntake(intake));
if (detail) import('./catalog.js').then(({ mountDetail }) => mountDetail(detail));
if (owner) import('./owner.js').then(({ mountOwner }) => mountOwner(owner));
