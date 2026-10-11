import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './ContactPopup.css'

const CONTACT_EMAIL = 'anthony@detailed-development.com'

export default function ContactPopup() {
  const dialogRef = useRef(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const requestIdRef = useRef(null)
  const { pathname, hash } = useLocation()
  const navigate = useNavigate()

  // Existing /#contact links still open the contact popup.
  useEffect(() => {
    if (hash === '#contact' && !dialogRef.current.open) {
      dialogRef.current.showModal()
    }
  }, [hash])

  function closeContact() {
    if (hash === '#contact') navigate(pathname, { replace: true })
  }

  async function sendMessage(event) {
    event.preventDefault()
    if (status === 'sending') return
    const form = event.currentTarget
    const fields = new FormData(form)
    const name = fields.get('name').trim()
    const email = fields.get('email').trim()
    const message = fields.get('message').trim()
    const messageInput = form.elements.namedItem('message')

    if (!message) {
      messageInput.setCustomValidity('Please write a message.')
      messageInput.reportValidity()
      return
    }

    const cmsUrl = (import.meta.env.VITE_CMS_URL || '').replace(/\/+$/, '')
    if (!cmsUrl) {
      setError('The contact form is unavailable right now. Please email us below.')
      return
    }

    requestIdRef.current ??= crypto.randomUUID()
    setStatus('sending')
    setError('')
    try {
      const response = await fetch(`${cmsUrl}/wp-json/dd/v1/contact`, {
        method: 'POST',
        credentials: 'omit',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, message, website: fields.get('website'), request_id: requestIdRef.current }),
        signal: AbortSignal.timeout(20000),
      })
      const result = await response.json().catch(() => null)
      if (!response.ok || result?.saved !== true) {
        throw new Error(response.status === 429
          ? 'Too many requests. Please wait a few minutes or email us directly.'
          : 'We couldn’t save your message. Please try again or email us below.')
      }
      setStatus('sent')
      requestIdRef.current = null
      form.reset()
    } catch (err) {
      setStatus('idle')
      setError(err.name === 'TimeoutError'
        ? 'The request timed out. Try again, or email us below.'
        : err instanceof TypeError ? 'We couldn’t reach the contact form. Please try again or email us below.' : err.message)
    }
  }

  return (
    <>
      <button
        type="button"
        className="contact-trigger"
        aria-haspopup="dialog"
        onClick={() => dialogRef.current.showModal()}
      >
        Get in touch <span aria-hidden="true">↗</span>
      </button>

      <dialog
        ref={dialogRef}
        className="contact-dialog"
        aria-labelledby="contact-title"
        aria-describedby="contact-description"
        onClose={closeContact}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close()
        }}
      >
        <div className="contact-dialog-panel">
          <button
            type="button"
            className="contact-close"
            aria-label="Close contact form"
            onClick={() => dialogRef.current.close()}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <h2 id="contact-title">Say hello.</h2>
          <p id="contact-description">Tell us what you have in mind.</p>

          {status === 'sent' ? (
            <div className="contact-confirmation" role="status">
              <p>Message received.</p>
              <span>We’ll get back to you at the email you provided.</span>
              <button type="button" className="btn btn-ghost" onClick={() => setStatus('idle')}>Send another message</button>
            </div>
          ) : (
          <form className="contact-form" onSubmit={sendMessage} aria-busy={status === 'sending'} onChange={() => { setError(''); requestIdRef.current = null }}>
            <label htmlFor="contact-name">Name <span>(optional)</span></label>
            <input id="contact-name" name="name" autoComplete="name" maxLength={100} disabled={status === 'sending'} autoFocus />

            <label htmlFor="contact-email">Email</label>
            <input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} disabled={status === 'sending'} />

            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              name="message"
              rows={4}
              required
              maxLength={5000}
              disabled={status === 'sending'}
              onChange={(event) => event.target.setCustomValidity('')}
            />

            <div className="contact-honeypot" aria-hidden="true">
              <label htmlFor="contact-website">Website</label>
              <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>
            {error && <p className="contact-error" role="alert">{error}</p>}
            <button type="submit" className="btn btn-primary contact-submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send message'} <span aria-hidden="true">↗</span>
            </button>
            <p className="contact-delivery-note">
              We’ll only use your details to reply. <a href="/privacy">Privacy</a>
            </p>
          </form>
          )}

          <a className="contact-direct" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </div>
      </dialog>
    </>
  )
}
