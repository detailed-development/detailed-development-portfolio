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
          &copy; {new Date().getFullYear()} Detailed Development LLC. Phoenix, AZ.
        </div>
      </div>
    </footer>
  )
}
