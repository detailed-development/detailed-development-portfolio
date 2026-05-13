import LogoSvg from './LogoSvg'

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-content">
          <span className="section-eyebrow">Software Studio — Phoenix, AZ</span>
          <h1>Detailed Development LLC</h1>
          <p className="hero-tagline">
            We're a small team that builds software the right way — no bloat, no
            shortcuts, no handing you off to a junior dev halfway through. Web apps,
            plugins, mobile, whatever you need. If it involves code, we've probably
            done it.
          </p>
          <div className="hero-actions">
            <a href="#projects" className="btn btn-primary">See What We've Built</a>
            <a href="#contact" className="btn btn-ghost">Say Hello</a>
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
