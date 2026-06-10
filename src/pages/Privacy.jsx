import { Link } from 'react-router-dom'

export default function Privacy() {
  return (
    <section className="page-simple">
      <div className="container">
        <h1 className="section-title">Privacy Policy</h1>
        <p className="section-sub">
          This site doesn't collect personal data, set tracking cookies, or run ads.
          If you email us, we'll use your address to reply — that's it.
        </p>
        <Link to="/" className="btn btn-ghost">&larr; Back Home</Link>
      </div>
    </section>
  )
}
