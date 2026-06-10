const services = [
  {
    number: '01',
    title: 'Client Websites',
    description:
      'WordPress, Astra, and Elementor builds for nonprofits, churches, and brands. Organized around what visitors actually come to do — not your org chart.',
  },
  {
    number: '02',
    title: 'WordPress Plugin Development',
    description:
      'Need WordPress to do something it doesn\'t? We write clean plugins that play nice with your existing setup. No page-builder spaghetti.',
  },
  {
    number: '03',
    title: 'Web App Development',
    description:
      'The bread and butter. React, Node, full-stack — we build tools people actually want to use. Not templates with your logo slapped on.',
  },
  {
    number: '04',
    title: 'iOS App Development',
    description:
      'Native Swift and SwiftUI. We care about the little interactions — the scroll feel, the transitions, the stuff users notice but can\'t explain.',
  },
  {
    number: '05',
    title: 'Maps, Events & Integrations',
    description:
      'Store locators, event calendars, donation flows, media embeds — the connective tissue that makes a site actually do things.',
  },
  {
    number: '06',
    title: 'Performance, SEO & Maintenance',
    description:
      'Fast pages, clean markup, analytics that tell you something. And when you need a change six months later, we\'re still here.',
  },
]

export default function Services() {
  return (
    <section className="services" id="services">
      <div className="container">
        <div className="services-header" data-reveal>
          <span className="section-eyebrow">What We Do</span>
          <h2 className="section-title">Services</h2>
          <p className="section-sub">
            We keep the scope tight and the quality high. Here's where we tend to do our best work.
          </p>
        </div>
        <div className="services-grid">
          {services.map((s, i) => (
            <div
              className="service-card card-spot"
              data-reveal
              style={{ '--rd': `${(i % 3) * 90}ms` }}
              key={s.number}
            >
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
