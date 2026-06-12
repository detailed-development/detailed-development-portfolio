import LogoSvg from './LogoSvg'

const terminalLines = [
  { cmd: 'whoami' },
  { out: 'small studio. big attention to detail.' },
  { cmd: 'ls services/' },
  { out: 'web-apps/  wordpress-plugins/  ios/  integrations/' },
  { cmd: 'git commit -m "ship it right the first time"' },
  { out: 'main-4e8d2c1', commit: true },
  { cmd: '', cursor: true },
]

function Terminal() {
  return (
    <div className="terminal" aria-hidden="true">
      <div className="terminal-bar">
        <span className="terminal-dot red" />
        <span className="terminal-dot yellow" />
        <span className="terminal-dot green" />
        <span className="terminal-title">detailed-dev — zsh</span>
      </div>
      <div className="terminal-body">
        {terminalLines.map((line, i) => (
          <p className="terminal-line" style={{ '--line': i }} key={i}>
            {'cmd' in line ? (
              <>
                <span className="t-prompt">$</span>
                {line.cmd}
                {line.cursor && <span className="t-cursor" />}
              </>
            ) : line.commit ? (
              <span className="t-out">
                <span className="t-green">[main 4e8d2c1]</span> ship it right the first time
              </span>
            ) : (
              <span className="t-out">{line.out}</span>
            )}
          </p>
        ))}
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-blob hero-blob-a" aria-hidden="true" />
      <div className="hero-blob hero-blob-b" aria-hidden="true" />
      <div className="container hero-grid">
        <div className="hero-content">
          <span className="hero-badge">
            <span className="badge-dot" aria-hidden="true" />
            Software Studio — Phoenix, AZ
          </span>
          <h1 aria-label="Detailed Development LLC">
            {/* The logo mark stands in for the leading D of each word; the
                aria-label above keeps the heading readable for screen readers. */}
            <span aria-hidden="true">
              <span className="h1-word">
                <LogoSvg className="h1-d" viewBox="24 15 78 92" />etailed
              </span>{' '}
              <span className="h1-word h1-accent">
                <LogoSvg className="h1-d" viewBox="24 15 78 92" accent />evelopment
              </span>{' '}
              <span className="h1-llc">LLC</span>
            </span>
          </h1>
          <p className="hero-tagline">
            We're a small team that builds software the right way — no bloat, no
            shortcuts, no handing you off to a junior dev halfway through. Web apps,
            plugins, mobile, whatever you need. If it involves code, we've probably
            done it.
          </p>
          <div className="hero-actions">
            <a href="#work" className="btn btn-primary">
              See What We've Built <span className="btn-arrow">&rarr;</span>
            </a>
            <a href="#contact" className="btn btn-ghost">Say Hello</a>
          </div>
        </div>
        <div className="hero-visual">
          <Terminal />
        </div>
      </div>
      <a className="hero-scroll" href="#work" aria-label="Scroll to our work">
        scroll
        <span aria-hidden="true" />
      </a>
    </section>
  )
}
