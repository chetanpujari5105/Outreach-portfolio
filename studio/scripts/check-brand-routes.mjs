// Walk actual links to catch stale destinations when a brand changes its navigation.
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { brandPage } from '../brands/pages.mjs';
import { projects } from '../site/catalog.js';
import { siteResponse } from '../server/render.mjs';
const hosted = projects.filter(p => p.hosted);
const queue = hosted.map(p => p.url);
// Outreach links already sent use /demo/: they must land on the same website page, choices included.
const location = async path => { const r = await siteResponse(new Request('https://studio.example' + path)); return [r.status, r.headers.get('location')]; };
for (const p of hosted) {
  if (p.slug === 'frame-field') {
    for (const page of ['', '/request/?service=portraits']) {
      const preview = siteResponse(new Request('https://studio.example' + p.previewUrl + page));
      assert.equal(preview.status, 200);
      assert.match(await preview.text(), /aria-label="Portfolio preview"/);
    }
  } else {
    assert.deepEqual(await location(p.previewUrl), [308, p.url]);
    assert.deepEqual(await location(p.previewUrl + '/request/?service=cut&tag=a%20b&tag=c'), [308, p.url + '/request?service=cut&tag=a%20b&tag=c']);
  }
  const page = brandPage(p.slug, '', new URLSearchParams());
  assert.match(page.body, /illustrative|fictional/i, 'Missing disclosure: ' + p.url);
  assert.equal(page.noindex, true, p.url);
}
for (const path of ['/demo/nope', '/demo/manakar', '/demo//evil.example', '/demo/__proto__']) assert.equal((await location(path))[0], 404, path);
// Hand-typed query strings never appear as links, so seed the malformed ones that once threw.
for (const q of ['checkin=2026-13-01', 'checkin=2026-12-00&checkout=2026-02-31', 'adults=abc'])
  queue.push('/site/casa-neem/rooms?' + q, '/site/casa-neem/rooms/loft?' + q);
for (const q of ['length=9', 'length=-1', 'stylist=__proto__', 'stylist=toString'])
  queue.push('/site/salon-booking/services?' + q, '/site/salon-booking/looks?' + q);
for (const q of ['q=%3Cscript%3E', 'q=__proto__', 'diet=toString', 'q=zzzz&diet=vegan'])
  queue.push('/site/daybreak-cafe/menu?' + q);
for (const q of ['temp=__proto__', 'size=huge&milk=oat', 'milk=constructor'])
  queue.push('/site/daybreak-cafe/menu/classic-cappuccino?' + q, '/site/daybreak-cafe/menu/espresso?' + q);
for (const q of ['tag=__proto__', 'tag=coffee'])
  queue.push('/site/daybreak-cafe/gallery?' + q);
for (const q of ['type=group&guests=abc&occasion=__proto__', 'guests=-4&date=2026-13-40', 'date=%22%3E%3Cb%3E'])
  queue.push('/site/daybreak-cafe/request?' + q);
// Daybreak answers unknown addresses with its own branded page, but still as a 404.
for (const bad of ['menu/__proto__', 'menu/toString', 'menu/nope', 'nope', 'menu/espresso/extra'])
  assert.equal(brandPage('daybreak-cafe', bad, new URLSearchParams())?.status, 404, 'Should 404: ' + bad);
assert.equal(brandPage('daybreak-cafe', 'menu', new URLSearchParams()).status, undefined);
const seen = new Set();
while (queue.length) {
  const url = new URL(queue.shift(), 'https://studio.example');
  if (seen.has(url.href)) continue;
  seen.add(url.href);
  const [, kind, slug, ...rest] = url.pathname.split('/');
  const page = brandPage(slug, rest.join('/'), url.searchParams);
  assert.equal(kind, 'site', 'Website links to its old address: ' + url.pathname);
  assert.doesNotMatch(page?.body || '', /studio-return|studio (project|demo)|concept (site|website)/i, 'Portfolio wording on a website: ' + url.pathname);
  assert.ok(page, 'Missing route: ' + url.pathname);
  assert.notEqual(page.status, 404, 'Link leads to a 404: ' + url.pathname);
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
