const stats = [
  { value: '7+', label: 'Projects Shipped' },
  { value: '3', label: 'Industries Served' },
  { value: '100%', label: 'Custom Builds' },
  { value: 'PHX', label: 'Arizona Based' },
]

const techStack = [
  'WordPress', 'Elementor', 'Astra', 'PHP', 'JavaScript',
  'React', 'Node.js', 'Swift', 'SwiftUI', 'Google Maps',
  'MySQL', 'PostgreSQL', 'REST APIs', 'Vite', 'Git', 'SEO / GA4',
]

export default function About() {
  return (
    <section className="about" id="about">
      <div className="container about-grid">
        <div className="about-left" data-reveal>
          <span className="section-eyebrow">Who We Are</span>
          <h2 className="section-title">About</h2>
          <p className="about-copy">
            We're a Phoenix-based studio that actually likes writing code. No project
            managers playing telephone, no offshore handoffs at 5pm — just developers
            who care about getting the details right. We work with startups, agencies,
            and businesses who've been burned by "it's almost done" one too many times.
            Every project gets our full attention, start to finish.
          </p>
          <div className="about-stats">
            {stats.map((s, i) => (
              <div
                className="stat card-spot"
                data-reveal
                style={{ '--rd': `${(i % 2) * 90}ms` }}
                key={s.label}
              >
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="about-right" data-reveal style={{ '--rd': '120ms' }}>
          <h3>Our Toolkit</h3>
          <div className="tech-tags">
            {techStack.map((tech) => (
              <span className="tech-tag" key={tech}>{tech}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
