const services = [
  {
    number: '01',
    title: 'Web App Development',
    description:
      'Full-stack web applications built with React, Node.js, and modern frameworks. From SaaS platforms to internal tools, we deliver production-ready software.',
  },
  {
    number: '02',
    title: 'WordPress Plugin Development',
    description:
      'Custom WordPress plugins that extend functionality without bloat. Clean code, proper hooks, and seamless integration with existing themes and plugins.',
  },
  {
    number: '03',
    title: 'iOS App Development',
    description:
      'Native iOS applications built with Swift and SwiftUI. Polished user experiences with performance and reliability at the core.',
  },
  {
    number: '04',
    title: 'Maps & Location Services',
    description:
      'Interactive mapping solutions, store locators, geofencing, and location-aware features powered by modern mapping APIs.',
  },
  {
    number: '05',
    title: 'Dashboards & Internal Tools',
    description:
      'Custom dashboards and internal tools that streamline operations. Real-time data, intuitive interfaces, and secure access controls.',
  },
  {
    number: '06',
    title: 'Prototyping & MVPs',
    description:
      'Rapid prototyping to validate ideas fast. We turn concepts into working software so you can test, iterate, and launch with confidence.',
  },
]

export default function Services() {
  return (
    <section className="services" id="services">
      <div className="container">
        <div className="services-header">
          <span className="section-eyebrow">What We Do</span>
          <h2 className="section-title">Services</h2>
          <p className="section-sub">
            End-to-end development for teams that need it done right.
          </p>
        </div>
        <div className="services-grid">
          {services.map((s) => (
            <div className="service-card" key={s.number}>
              <div className="service-number">{s.number}</div>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
