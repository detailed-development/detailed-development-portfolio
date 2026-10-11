import { Link } from 'react-router-dom'

export default function Privacy() {
  return (
    <section className="page-simple">
      <div className="container">
        <h1 className="section-title">Privacy Policy</h1>
        <p className="section-sub">
          This site doesn't set tracking cookies or run ads. When you use the contact
          form, we store your name (if provided), email address, and message in our
          private WordPress inbox so we can respond. We may also receive an email
          notification of your request. If you email us directly, we use your
          address and message to reply.
        </p>
        <Link to="/" className="btn btn-ghost">&larr; Back Home</Link>
      </div>
    </section>
  )
}
