import { Link } from 'react-router-dom'
import LogoSvg from './LogoSvg'

export default function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="header-logo" aria-label="Home">
          <LogoSvg />
          <span className="header-wordmark">Detailed Development</span>
        </Link>
        <nav className="header-nav" aria-label="Main navigation">
          <Link to="/#work"><span className="nav-num" aria-hidden="true">01.</span>Work</Link>
          <Link to="/#services"><span className="nav-num" aria-hidden="true">02.</span>Services</Link>
          <Link to="/#about"><span className="nav-num" aria-hidden="true">03.</span>About</Link>
          <Link to="/#contact" className="btn btn-primary header-cta">Start a Project</Link>
        </nav>
      </div>
    </header>
  )
}
