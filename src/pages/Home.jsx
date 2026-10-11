import { Link } from 'react-router-dom'
import LogoSvg from '../components/LogoSvg'
import ContactPopup from '../components/ContactPopup'
import './Home.css'

export default function Home() {
  return (
    <section className="holding-page" aria-labelledby="holding-title">
      <header className="holding-header">
        <Link to="/" className="holding-brand" aria-label="Detailed Development — home">
          <LogoSvg aria-hidden="true" />
          <span>Detailed Development</span>
        </Link>
        <ContactPopup />
      </header>

      <div className="holding-content">
        <h1 id="holding-title">
          We are busy<br />
          <span>building..</span>
        </h1>
      </div>

      <footer className="holding-footer">
        <span>&copy; {new Date().getFullYear()} Detailed Development LLC</span>
        <Link to="/privacy">Privacy</Link>
      </footer>
    </section>
  )
}
