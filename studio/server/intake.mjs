// Reference schema for local adapters. The deployed database is initialized by migrations.
export const intakeSchema = [
  `CREATE TABLE sample_requests (
    id TEXT PRIMARY KEY NOT NULL, created_at INTEGER NOT NULL, business TEXT NOT NULL,
    reply_method TEXT NOT NULL, contact TEXT NOT NULL, brief TEXT NOT NULL,
    website TEXT NOT NULL, industry TEXT NOT NULL, project TEXT NOT NULL,
    solution TEXT NOT NULL, network_hash TEXT NOT NULL
  )`,
  'CREATE INDEX sample_requests_created ON sample_requests (created_at)',
  'CREATE INDEX sample_requests_network_created ON sample_requests (network_hash, created_at)',
  'CREATE INDEX sample_requests_contact_created ON sample_requests (contact, created_at)'
]

function json(body, status = 200, extra = {}) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...extra }
  })
}

function issue(message, status, extra) {
  return json({ error: message }, status, extra)
}

const MAX_BYTES = 12_288
async function readPayload(request) {
  if (!request.body || Number(request.headers.get('content-length')) > MAX_BYTES) return null
  const reader = request.body.getReader()
  const decoder = new TextDecoder()
  let used = 0
  let text = ''
  try {
    while (true) {
      const chunk = await reader.read()
      if (chunk.done) break
      used += chunk.value.length
      if (used > MAX_BYTES) {
        await reader.cancel()
        return null
      }
      text += decoder.decode(chunk.value, { stream: true })
    }
    return JSON.parse(text + decoder.decode())
  } catch {
    return null
  } finally {
    reader.releaseLock()
  }
}

function validate(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return 'Send your request using the sample form.'
  const limits = { business: 120, replyMethod: 12, contact: 254, brief: 1400, website: 400, industry: 80, project: 80, solution: 80 }
  if (payload.companyFax) return 'Please contact Chetan by email to request your sample.'
  const clean = {}
  for (const [field, limit] of Object.entries(limits)) {
    const value = payload[field] ?? ''
    if (typeof value !== 'string' || value.length > limit || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(value)) return 'Check the details and try again.'
    clean[field] = value.trim()
  }
  if (!clean.business || !clean.brief) return 'Add your business name and what you would like to see.'
  switch (clean.replyMethod) {
    case 'email':
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(clean.contact)) return 'Enter an email address where Chetan can reply.'
      clean.contact = clean.contact.toLowerCase()
      break
    case 'instagram':
      if (!/^@?[\w.]{1,30}$/u.test(clean.contact)) return 'Enter an Instagram username, such as @yourstudio.'
      clean.contact = '@' + clean.contact.replace(/^@/u, '').toLowerCase()
      break
    case 'phone':
      clean.contact = clean.contact.replace(/[\s().-]/gu, '')
      if (!/^\+[1-9]\d{6,14}$/u.test(clean.contact)) return 'Include the country code in your phone number, such as +91.'
      break
    default:
      return 'Choose how Chetan should reply.'
  }
  if (clean.website) {
    try {
      const url = new URL(/^[\w+.-]+:/u.test(clean.website) ? clean.website : 'https://' + clean.website)
      if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || !url.hostname.includes('.')) return 'Enter a public website address.'
      clean.website = url.href
    } catch {
      return 'Enter a public website address.'
    }
  }
  for (const field of ['industry', 'project', 'solution']) {
    if (clean[field] && !/^[a-z\d][a-z\d-]{0,79}$/u.test(clean[field])) return 'Reload the sample page and try again.'
  }
  return clean
}

async function digest(value) {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))
}

async function readForOwner(request, env) {
  const token = env.INTAKE_ADMIN_TOKEN
  const auth = request.headers.get('Authorization') || ''
  if (typeof token !== 'string' || token.length < 32 || !auth.startsWith('Bearer ')) return issue('Access denied.', 401)
  const [actual, expected] = await Promise.all([digest(auth.slice(7)), digest(token)])
  let mismatch = 0
  for (let index = 0; index < actual.length; index++) mismatch |= actual[index] ^ expected[index]
  if (mismatch) return issue('Access denied.', 401)
  const cursor = new URL(request.url).searchParams.get('before') || String(Number.MAX_SAFE_INTEGER)
  if (!/^\d{1,16}$/u.test(cursor) || !Number.isSafeInteger(Number(cursor))) return issue('Invalid cursor.', 400)
  const { results } = await env.SITE_DB.prepare(`SELECT rowid AS cursor, id, created_at, business, reply_method,
    contact, brief, website, industry, project, solution FROM sample_requests
    WHERE rowid < ? ORDER BY rowid DESC LIMIT 51`).bind(Number(cursor)).all()
  const rows = results.slice(0, 50)
  return json({ requests: rows, nextBefore: results.length > 50 ? rows[rows.length - 1].cursor : null })
}

async function submit(request, env) {
  const origin = request.headers.get('Origin')
  if (origin && origin !== new URL(request.url).origin) return issue('Submit from the studio website.', 403)
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') return issue('Send a JSON request.', 415)
  const payload = await readPayload(request)
  const values = validate(payload)
  if (typeof values === 'string') return issue(values, 422)
  const id = request.headers.get('Idempotency-Key') || payload.requestId || ''
  if (typeof id !== 'string' || !/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/iu.test(id)) return issue('Reload the form to start a new request.', 400)
  const now = Math.floor(Date.now() / 1000)
  const address = request.headers.get('CF-Connecting-IP')
  // Cloudflare supplies this header in production. A local/forwarding adapter can omit it.
  let network = ''
  if (address) {
    const salt = env.INTAKE_RATE_SALT || env.INTAKE_ADMIN_TOKEN || ''
    const hash = await digest([salt, Math.floor(now / 86400), address].join('|'))
    network = Array.from(hash, byte => byte.toString(16).padStart(2, '0')).join('')
  }
  const fields = [values.business, values.replyMethod, values.contact, values.brief, values.website, values.industry, values.project, values.solution]
  // Check limits and insert in one SQLite write so concurrent submissions share the quota.
  const since = now - 3600
  const result = await env.SITE_DB.prepare(`INSERT INTO sample_requests
    (id, created_at, business, reply_method, contact, brief, website, industry, project, solution, network_hash)
    SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    WHERE (SELECT COUNT(*) FROM sample_requests WHERE contact = ? AND created_at >= ?) < 3
      AND (? = '' OR (SELECT COUNT(*) FROM sample_requests WHERE network_hash = ? AND created_at >= ?) < 8)
      AND (SELECT COUNT(*) FROM sample_requests WHERE created_at >= ?) < 240
    ON CONFLICT(id) DO NOTHING`).bind(id, now, ...fields, network, values.contact, since, network, network, since, since).run()
  if (result.meta.changes === 1) return json({ saved: true, reference: id }, 201)
  // A request with a lost response can safely retry after the hourly limit was reached.
  const prior = await env.SITE_DB.prepare(`SELECT business, reply_method, contact, brief, website, industry, project, solution
    FROM sample_requests WHERE id = ?`).bind(id).first()
  if (!prior) return issue('Several requests have already been received. Try again later or email Chetan.', 429, { 'Retry-After': '3600' })
  const keys = ['business', 'reply_method', 'contact', 'brief', 'website', 'industry', 'project', 'solution']
  if (keys.some((key, index) => prior[key] !== fields[index])) return issue('This request has already been saved with different details. Start a new request to send an update.', 409)
  return json({ saved: true, reference: id })
}

export async function handleIntake(request, env = {}) {
  try {
    if (request.method === 'GET') return await readForOwner(request, env)
    if (request.method !== 'POST') return issue('Method unavailable.', 405, { Allow: 'GET, POST' })
    return await submit(request, env)
  } catch {
    return issue('We could not confirm a saved request. Retry here or email Chetan.', 503)
  }
}
