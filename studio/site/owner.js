export function ownerPage() {
  return `<section class="owner-inbox" data-owner-inbox aria-labelledby="owner-heading">
    <header><p class="owner-label">Studio operations</p><h1 id="owner-heading">Sample requests</h1></header>
    <form data-owner-login autocomplete="off">
      <h2>Open your inbox</h2>
      <label>Owner access token<input data-token type="password" required minlength="32" maxlength="2048" autocomplete="off" autocapitalize="none" spellcheck="false"></label>
      <button class="owner-primary" type="submit">Open inbox</button>
    </form>
    <div class="owner-toolbar" data-owner-tools hidden><button type="button" data-refresh>Refresh latest</button><button type="button" data-lock>Lock inbox</button></div>
    <p class="owner-status" data-owner-status role="status" aria-live="polite"></p>
    <div class="owner-records" data-owner-list></div>
    <nav aria-label="Request pages" data-owner-nav hidden><button type="button" data-newer>Newer requests</button><button type="button" data-older>Older requests</button></nav>
  </section>`
}

function node(tag, text, className) {
  const el = document.createElement(tag)
  if (text !== undefined) el.textContent = text
  if (className) el.className = className
  return el
}

function externalLink(label, href) {
  const link = node('a', label)
  link.href = href
  link.rel = 'noopener noreferrer'
  link.referrerPolicy = 'no-referrer'
  if (href.startsWith('https:') || href.startsWith('http:')) link.target = '_blank'
  return link
}

function replyLink(row) {
  const contact = String(row.contact || '')
  if (row.reply_method === 'email' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(contact)) {
    const recipient = contact.split('@').map(encodeURIComponent).join('@')
    return externalLink('Draft email reply', 'mailto:' + recipient + '?subject=' + encodeURIComponent('Your sample for ' + row.business))
  }
  const username = contact.replace(/^@/u, '')
  if (row.reply_method === 'instagram' && /^[\w.]{1,30}$/u.test(username)) {
    return externalLink('Open Instagram profile ↗', 'https://www.instagram.com/' + username + '/')
  }
  if (row.reply_method === 'phone' && /^\+[1-9]\d{6,14}$/u.test(contact)) return externalLink('Call business', 'tel:' + contact)
  return null
}

function record(row) {
  const card = node('article', undefined, 'owner-record')
  const date = new Date(Number(row.created_at) * 1000)
  const time = node('time', Number.isFinite(date.valueOf()) ? date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '')
  if (Number.isFinite(date.valueOf())) time.dateTime = date.toISOString()
  card.append(time, node('h2', row.business), node('p', row.brief, 'owner-brief'))
  const dl = node('dl')
  const addPair = (key, value) => { dl.append(node('dt', key), node('dd', value)) }
  addPair('Reply by ' + ({ email: 'email', phone: 'phone', instagram: 'Instagram' }[row.reply_method] || 'contact'), row.contact)
  const source = [row.industry, row.project, row.solution].filter(Boolean).join(' / ')
  if (source) addPair('Viewed', source)
  if (row.website) {
    try {
      const url = new URL(row.website)
      if (['https:', 'http:'].includes(url.protocol) && !url.username && !url.password) {
        const value = node('dd')
        value.append(externalLink(url.href, url.href))
        dl.append(node('dt', 'Website'), value)
      }
    } catch { /* A historic record may contain a plain-text value. */ }
  }
  card.append(dl)
  const action = replyLink(row)
  if (action) card.append(action)
  return card
}

export function mountOwner(root = document) {
  const screen = root.matches?.('[data-owner-inbox]') ? root : root.querySelector('[data-owner-inbox]')
  if (!screen || screen.dataset.ready) return
  screen.dataset.ready = 'true'
  const get = key => screen.querySelector('[' + key + ']')
  const form = get('data-owner-login')
  const tokenInput = get('data-token')
  const tools = get('data-owner-tools')
  const list = get('data-owner-list')
  const status = get('data-owner-status')
  const nav = get('data-owner-nav')
  const older = get('data-older')
  const newer = get('data-newer')
  const refresh = get('data-refresh')
  const submit = form.querySelector('button')
  let token = ''
  let controller
  let next = null
  let trail = [null]

  function lock(message = '') {
    controller?.abort()
    controller = undefined
    token = ''
    tokenInput.value = ''
    next = null
    trail = [null]
    list.replaceChildren()
    tools.hidden = true
    nav.hidden = true
    form.hidden = false
    submit.disabled = false
    status.textContent = message
  }
  async function load(destination) {
    controller?.abort()
    const thisLoad = new AbortController()
    controller = thisLoad
    const timer = setTimeout(() => thisLoad.abort(), 12_000)
    const before = destination[destination.length - 1]
    status.textContent = 'Loading requests…'
    older.disabled = newer.disabled = refresh.disabled = submit.disabled = true
    try {
      const response = await fetch('/api/requests' + (before ? '?before=' + before : ''), {
        headers: { Authorization: 'Bearer ' + token },
        cache: 'no-store',
        credentials: 'same-origin',
        redirect: 'error',
        signal: thisLoad.signal
      })
      if (controller !== thisLoad) return
      if (response.status === 401 || response.status === 403) {
        lock('Access denied. Check the owner token and try again.')
        tokenInput.focus()
        return
      }
      if (!response.ok) throw new Error('The inbox is unavailable. Try again.')
      const result = await response.json()
      if (controller !== thisLoad) return
      if (!Array.isArray(result.requests) || result.requests.length > 50 ||
          (result.nextBefore !== null && (!Number.isSafeInteger(result.nextBefore) || result.nextBefore < 1))) {
        throw new Error('The inbox returned an unreadable response.')
      }
      // Render all records before replacing the previous page, so a failed refresh is recoverable.
      const cards = result.requests.map(record)
      list.replaceChildren(...cards)
      trail = destination
      next = result.nextBefore
      form.hidden = true
      tools.hidden = false
      nav.hidden = next === null && trail.length === 1
      status.textContent = cards.length === 0 ? 'No sample requests yet.' :
        'Page ' + trail.length + ' · ' + cards.length + (cards.length === 1 ? ' request' : ' requests')
      if (document.activeElement === submit) refresh.focus()
    } catch (error) {
      if (controller === thisLoad) {
        status.textContent = error.name === 'AbortError' ? 'The request timed out. Try again.' : 'Couldn’t load these requests. Retry when the connection is ready.'
        if (!form.hidden) token = ''
      }
    } finally {
      clearTimeout(timer)
      if (controller === thisLoad) {
        controller = undefined
        refresh.disabled = submit.disabled = false
        older.disabled = next === null
        newer.disabled = trail.length < 2
      }
    }
  }

  form.addEventListener('submit', event => {
    event.preventDefault()
    token = tokenInput.value.trim()
    tokenInput.value = ''
    if (token.length < 32 || /[\r\n]/u.test(token)) {
      lock('Enter the full owner access token.')
      tokenInput.focus()
      return
    }
    load([null])
  })
  refresh.addEventListener('click', () => load([null]))
  older.addEventListener('click', () => { if (next !== null) load([...trail, next]) })
  newer.addEventListener('click', () => { if (trail.length > 1) load(trail.slice(0, -1)) })
  get('data-lock').addEventListener('click', () => { lock('Inbox locked.'); tokenInput.focus() })
  window.addEventListener('pagehide', () => lock())
}
