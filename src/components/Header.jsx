import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import LogoSvg from './LogoSvg'

export default function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  // Close the mobile menu on any route change (state adjustment during
  // render — see react.dev "adjusting state when a prop changes").
  const [lastPathname, setLastPathname] = useState(pathname)
  if (pathname !== lastPathname) {
    setLastPathname(pathname)
    if (open) setOpen(false)
  }

  // Close on Escape.
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Logo: smooth-scroll to the top when already on the homepage,
  // otherwise navigate home (ScrollManager lands at the top).
  const onLogoClick = (e) => {
    setOpen(false)
    if (pathname === '/') {
      e.preventDefault()
      window.history.replaceState(null, '', '/')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const closeMenu = () => setOpen(false)

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="header-logo" aria-label="Detailed Development — home" onClick={onLogoClick}>
          <LogoSvg />
          <span className="header-wordmark">Detailed Development</span>
        </Link>

        <div className="header-right">
          <nav
            id="site-nav"
            className={`header-nav${open ? ' is-open' : ''}`}
            aria-label="Main navigation"
          >
            <Link to="/#work" onClick={closeMenu}><span className="nav-num" aria-hidden="true">01.</span>Work</Link>
            <Link to="/#services" onClick={closeMenu}><span className="nav-num" aria-hidden="true">02.</span>Services</Link>
            <Link to="/#about" onClick={closeMenu}><span className="nav-num" aria-hidden="true">03.</span>About</Link>
          </nav>

          <Link to="/#contact" className="btn btn-primary header-cta" onClick={closeMenu}>
            Start a Project
          </Link>

          <button
            type="button"
            className={`header-menu-btn${open ? ' is-open' : ''}`}
            aria-expanded={open}
            aria-controls="site-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  )
}
