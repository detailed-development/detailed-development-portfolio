import { useRef } from 'react'
import { Link } from 'react-router-dom'
import LogoSvg from '../components/LogoSvg'
import GlowingLogo from '../components/GlowingLogo'
import ContactPopup from '../components/ContactPopup'
import Services from '../components/Services'
import SelectedWork from '../components/SelectedWork'
import './Home.css'

export default function Home() {
  const contactDialog = useRef(null)

  return (
    <div className="home-page">
      <header className="home-header">
        <Link to="/" className="home-brand" aria-label="Detailed Development — home">
          <LogoSvg aria-hidden="true" />
          <span>Detailed Development</span>
        </Link>
        <ContactPopup ref={contactDialog} />
      </header>

      <section className="home-hero" aria-labelledby="home-title">
        <GlowingLogo />
        <h1 id="home-title">
          Web development &amp; <span>technical support.</span>
        </h1>
        <p>
          Remote support for businesses, nonprofits, and agencies. Get help with a broken website,
          unreliable email, or a workflow you’re ready to automate.
        </p>
        <Link to="#services" className="btn btn-ghost">
          Explore services <span aria-hidden="true">↓</span>
        </Link>
      </section>

      <Services />

      <SelectedWork />

      <section className="home-inquiry container" aria-labelledby="inquiry-title">
        <div className="home-inquiry-panel">
          <div>
            <h2 id="inquiry-title">Tell us what you need.</h2>
            <p>
              Share your site or domain, what you need fixed or built, and any deadlines.
              We’ll follow up to confirm the scope and next steps.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            aria-haspopup="dialog"
            onClick={() => contactDialog.current.showModal()}
          >
            Request help <span aria-hidden="true">↗</span>
          </button>
        </div>
      </section>

      <footer className="home-footer">
        <span>&copy; {new Date().getFullYear()} Detailed Development LLC</span>
        <Link to="/privacy">Privacy</Link>
      </footer>
    </div>
  )
}
