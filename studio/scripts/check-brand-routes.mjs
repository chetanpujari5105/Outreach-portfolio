// Walk actual links to catch stale destinations when a brand changes its navigation.
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { brandPage } from '../brands/pages.mjs';
import { projects } from '../site/catalog.js';
const queue = projects.filter(p => p.url.startsWith('/demo/') && p.slug !== 'daybreak-cafe').map(p => p.url);
const seen = new Set();
while (queue.length) {
  const url = new URL(queue.shift(), 'https://studio.example');
  if (seen.has(url.href)) continue;
  seen.add(url.href);
  const [, , slug, ...rest] = url.pathname.split('/');
  const page = brandPage(slug, rest.join('/'), url.searchParams);
  assert.ok(page, 'Missing route: ' + url.pathname);
  const primaryContent = rest.includes('image') ? /<figcaption>/ : /<h1[ >]/;
  assert.match(page.body, primaryContent, url.pathname);
  for (const image of page.body.matchAll(/src="(\/assets\/[^"]+)"/g)) {
    assert.ok(existsSync(new URL('../public' + image[1], import.meta.url)), image[1]);
  }
  for (const match of page.body.matchAll(/href="(\/demo\/[^"]+)"/g)) {
    queue.push(match[1].replaceAll('&amp;', '&'));
  }
}
console.log('Verified', seen.size, 'linked routes and query combinations.');
