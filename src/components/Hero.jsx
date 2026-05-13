import LogoSvg from './LogoSvg'

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-content">
          <span className="section-eyebrow">Software Studio</span>
          <h1>Detailed Development LLC</h1>
          <p className="hero-tagline">
            We focus on the details so you don't have to. Custom web applications,
            WordPress plugins, iOS apps, and everything in between — built with
            precision from Phoenix, AZ.
          </p>
          <div className="hero-actions">
            <a href="#projects" className="btn btn-primary">View Our Work</a>
            <a href="#contact" className="btn btn-ghost">Contact Us</a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-glow" />
          <LogoSvg />
        </div>
      </div>
    </section>
  )
}
