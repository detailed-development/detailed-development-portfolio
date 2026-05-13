const stats = [
  { value: '4+', label: 'Projects' },
  { value: '3+', label: 'Platforms' },
  { value: '100%', label: 'Custom' },
  { value: 'PHX', label: 'Based' },
]

const techStack = [
  'React', 'Node.js', 'Swift', 'WordPress', 'PHP',
  'Prisma', 'PostgreSQL', 'TypeScript', 'Next.js',
  'Tailwind CSS', 'MapKit', 'Google Maps', 'REST APIs',
  'Vite', 'SwiftUI', 'WooCommerce',
]

export default function About() {
  return (
    <section className="about" id="about">
      <div className="container about-grid">
        <div className="about-left">
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
            {stats.map((s) => (
              <div className="stat" key={s.label}>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="about-right">
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
