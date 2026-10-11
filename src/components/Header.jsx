import { Link } from 'react-router-dom'
import LogoSvg from './LogoSvg'
import ContactPopup from './ContactPopup'

export default function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="header-logo" aria-label="Detailed Development — home">
          <LogoSvg aria-hidden="true" />
          <span className="header-wordmark">Detailed Development</span>
        </Link>

        <div className="header-right">
          <Link to="/" className="header-home">Home</Link>
          <ContactPopup />
        </div>
      </div>
    </header>
  )
}
