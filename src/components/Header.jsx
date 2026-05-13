import LogoSvg from './LogoSvg'

export default function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <a href="/" className="header-logo" aria-label="Home">
          <LogoSvg />
          <span className="header-wordmark">Detailed Development</span>
        </a>
        <nav className="header-nav" aria-label="Main navigation">
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#contact" className="btn btn-primary header-cta">Get in Touch</a>
        </nav>
      </div>
    </header>
  )
}
