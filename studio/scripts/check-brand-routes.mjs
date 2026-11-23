// Walk actual links to catch stale destinations when a brand changes its navigation.
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { brandPage } from '../brands/pages.mjs';
import { projects } from '../site/catalog.js';
const demos = projects.filter(p => p.url.startsWith('/demo/') && p.slug !== 'daybreak-cafe').map(p => p.url);
// Walk the studio /demo/ copies and the clean /site/ share links a prospect receives.
const queue = [...demos, ...demos.map(u => u.replace('/demo/', '/site/'))];
// Hand-typed query strings never appear as links, so seed the malformed ones that once threw.
for (const q of ['checkin=2026-13-01', 'checkin=2026-12-00&checkout=2026-02-31', 'adults=abc'])
  queue.push('/site/casa-neem/rooms?' + q, '/site/casa-neem/rooms/loft?' + q);
for (const q of ['length=9', 'length=-1', 'stylist=__proto__', 'stylist=toString'])
  queue.push('/site/salon-booking/services?' + q, '/site/salon-booking/looks?' + q);
const seen = new Set();
while (queue.length) {
  const url = new URL(queue.shift(), 'https://studio.example');
  if (seen.has(url.href)) continue;
  seen.add(url.href);
  const [, kind, slug, ...rest] = url.pathname.split('/');
  const page = brandPage(slug, rest.join('/'), url.searchParams, kind === 'site');
  if (kind === 'site') assert.doesNotMatch(page?.body || '', /studio-return|Studio demo|studio demo/, 'Studio wording on clean link: ' + url.pathname);
  assert.ok(page, 'Missing route: ' + url.pathname);
  const primaryContent = rest.includes('image') ? /<figcaption>/ : /<h1[ >]/;
  assert.match(page.body, primaryContent, url.pathname);
  for (const image of page.body.matchAll(/src="(\/assets\/[^"]+)"/g)) {
    assert.ok(existsSync(new URL('../public' + image[1], import.meta.url)), image[1]);
  }
  for (const match of page.body.matchAll(/href="(\/(?:demo|site)\/[^"]+)"/g)) {
    queue.push(match[1].replaceAll('&amp;', '&'));
  }
}
console.log('Verified', seen.size, 'linked routes and query combinations.');
