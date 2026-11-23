const email = 'chetanpujari92@gmail.com'
const instagram = 'https://www.instagram.com/_chetan_pujari/'
const initialMail = 'mailto:' + email + '?subject=' + encodeURIComponent('A website sample for my business')
const channels = {
  email: { label: 'Your email address', placeholder: 'you@business.com', type: 'email', autocomplete: 'email' },
  instagram: { label: 'Your Instagram username', placeholder: '@yourbusiness', type: 'text', autocomplete: 'off' },
  phone: { label: 'Your phone number with country code', placeholder: '+91 98765 43210', type: 'tel', autocomplete: 'tel' }
}

function selectedContext(params, names) {
  for (const name of names) {
    const value = params.get(name) || ''
    if (/^[a-z0-9][a-z0-9-]{0,79}$/u.test(value)) return value
  }
  return ''
}

export function samplePage(params = new URLSearchParams()) {
  const industry = selectedContext(params, ['industry'])
  const project = selectedContext(params, ['project', 'example', 'work', 'from'])
  const solution = selectedContext(params, ['solution', 'task'])
  return `<section class="sample-intake" aria-labelledby="sample-title">
    <div class="sample-intro">
      <p class="sample-eyebrow">Free sample</p>
      <h1 id="sample-title">A sample for<br><em>your business.</em></h1>
      <p class="sample-lead">Tell me one thing you’d like customers or staff to do more easily. I’ll use that as the starting point for your sample.</p>
      <div class="sample-contact">
        <h2>Already in touch?</h2>
        <p>Reply in our original Instagram conversation, or send me your brief by email.</p>
        <a href="${instagram}" target="_blank" rel="noopener noreferrer">Instagram @_chetan_pujari <span aria-hidden="true">↗</span></a>
        <a href="${initialMail}" data-mail>Email Chetan <span aria-hidden="true">↗</span></a>
        <span class="sample-address">${email}</span>
      </div>
    </div>
    <div class="sample-panel">
      <form class="sample-form" data-intake-form>
        <h2>Your brief</h2>
        <input type="hidden" name="industry" value="${industry}"><input type="hidden" name="project" value="${project}"><input type="hidden" name="solution" value="${solution}">
        <div class="sample-honey" aria-hidden="true"><label>Company fax<input name="companyFax" tabindex="-1" autocomplete="off"></label></div>
        <label class="sample-field">Business name<input name="business" required maxlength="120" autocomplete="organization" placeholder="Your business or studio"></label>
        <label class="sample-field">What should the sample do?<textarea name="brief" rows="3" required maxlength="1400" placeholder="For example, let guests choose a service and request an appointment."></textarea></label>
        <label class="sample-field"><span>Current website <small>(optional)</small></span><input name="website" maxlength="400" type="text" inputmode="url" autocomplete="url" placeholder="yourbusiness.com"></label>
        <div class="sample-contact-row">
          <label class="sample-field">Reply by<select name="replyMethod"><option value="email">Email</option><option value="instagram">Instagram</option><option value="phone">Phone</option></select></label>
          <label class="sample-field"><span data-contact-label>Your email address</span><input required name="contact" maxlength="254" type="email" autocomplete="email" placeholder="you@business.com"></label>
        </div>
        <p class="sample-note">I’ll use these details to discuss your sample. You can decide on the full build after you see it.</p>
        <button class="sample-submit" type="submit">Request my free sample <span aria-hidden="true">↗</span></button>
        <p class="sample-feedback" role="status" aria-live="polite" data-intake-status></p>
        <div hidden data-intake-fallback><a href="${initialMail}" data-mail>Open an email draft with this brief ↗</a></div>
      </form>
      <section class="sample-receipt" data-intake-success hidden aria-labelledby="sample-success"><span class="sample-check" aria-hidden="true">✓</span><h2 id="sample-success" tabindex="-1">Your request is in.</h2><p>Your brief is saved. I’ll review it and follow up using the reply method you chose.</p><p class="sample-reference"></p><a href="/work">Explore more work <span aria-hidden="true">→</span></a></section>
    </div>
  </section>`
}

function updateMail(root, values) {
  const body = [
    'Hi Chetan, I’d like a free sample for ' + (values.business?.trim() || 'my business') + '.',
    values.brief && 'What I’d like to see: ' + values.brief,
    values.website && 'Current website: ' + values.website,
    values.contact && 'Reply by ' + values.replyMethod + ': ' + values.contact,
    values.project && 'Example I viewed: ' + values.project,
    values.industry && 'Business type: ' + values.industry,
    values.solution && 'Workflow: ' + values.solution
  ].filter(Boolean).join('\n\n')
  const uri = initialMail + '&body=' + encodeURIComponent(body)
  for (const link of root.querySelectorAll('[data-mail]')) link.href = uri
}

export function mountIntake(root = document) {
  const form = root.querySelector('[data-intake-form]')
  if (!form || form.dataset.ready) return
  form.dataset.ready = 'true'
  const container = form.closest('.sample-intake')
  const channel = form.elements.replyMethod
  const contact = form.elements.contact
  const submit = form.querySelector('[type=submit]')
  const status = form.querySelector('[data-intake-status]')
  const fallback = form.querySelector('[data-intake-fallback]')
  const receipt = container.querySelector('[data-intake-success]')
  const initialButton = submit.innerHTML
  let busy = false
  let lastPayload = ''
  let requestId = ''
  const contacts = {}
  let lastChannel = channel.value
  const values = () => Object.fromEntries(new FormData(form))
  function setChannel() {
    const selected = channels[channel.value]
    contacts[lastChannel] = contact.value
    lastChannel = channel.value
    contact.type = selected.type
    contact.value = contacts[channel.value] || ''
    contact.placeholder = selected.placeholder
    contact.autocomplete = selected.autocomplete
    form.querySelector('[data-contact-label]').textContent = selected.label
    contact.setCustomValidity('')
    updateMail(container, values())
  }
  channel.addEventListener('change', setChannel)
  form.addEventListener('input', () => {
    contact.setCustomValidity('')
    updateMail(container, values())
  })
  setChannel()
  form.addEventListener('submit', async event => {
    event.preventDefault()
    if (busy) return
    const data = values()
    if (data.replyMethod === 'phone' && !/^\+[1-9]\d{6,14}$/u.test(data.contact.replace(/[\s().-]/gu, ''))) {
      contact.setCustomValidity('Include your country code, such as +91.')
    }
    if (data.replyMethod === 'instagram' && !/^@?[\w.]{1,30}$/u.test(data.contact.trim())) {
      contact.setCustomValidity('Enter your Instagram username, such as @yourstudio.')
    }
    if (!form.reportValidity()) return
    busy = true
    submit.disabled = true
    submit.textContent = 'Sending your request…'
    form.setAttribute('aria-busy', 'true')
    status.textContent = ''
    fallback.hidden = true
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 12_000)
    try {
      const serialized = JSON.stringify(data)
      if (lastPayload !== serialized || !requestId) {
        requestId = crypto.randomUUID()
        lastPayload = serialized
      }
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': requestId },
        body: serialized,
        signal: controller.signal
      })
      const result = await response.json().catch(() => null)
      if (!response.ok || result?.saved !== true || result.reference !== requestId) {
        throw new Error(result?.error || 'We couldn’t confirm your request. Try again or email your brief.')
      }
      form.hidden = true
      receipt.hidden = false
      receipt.querySelector('.sample-reference').textContent = 'Reference ' + requestId.slice(0, 8).toUpperCase()
      receipt.querySelector('h2').focus()
    } catch (error) {
      status.textContent = error instanceof TypeError || error.name === 'AbortError'
        ? 'We couldn’t reach the studio. Your brief is still here. Retry or send it by email.'
        : error.message || 'We couldn’t confirm your request. Try again or send it by email.'
      fallback.hidden = false
    } finally {
      clearTimeout(timeout)
      busy = false
      submit.disabled = false
      submit.innerHTML = initialButton
      form.removeAttribute('aria-busy')
    }
  })
}
