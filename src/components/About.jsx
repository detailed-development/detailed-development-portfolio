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
            Detailed Development LLC is a Phoenix-based software studio focused on
            building high-quality, custom software. We work with startups, agencies,
            and established businesses to ship products that are reliable, performant,
            and built to last. Every line of code is intentional — no templates, no
            shortcuts.
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
          <h3>Tech Stack</h3>
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
