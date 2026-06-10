import { Link } from 'react-router-dom'
import LogoSvg from './LogoSvg'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-left">
          <LogoSvg />
          <span>Detailed Development LLC</span>
        </div>
        <div className="footer-right">
          <Link to="/privacy" className="footer-link">Privacy</Link>
          <span>&copy; {new Date().getFullYear()} Detailed Development LLC. Phoenix, AZ.</span>
        </div>
      </div>
    </footer>
  )
}
