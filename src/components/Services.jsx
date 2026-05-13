const services = [
  {
    number: '01',
    title: 'Web App Development',
    description:
      'The bread and butter. React, Node, full-stack — we build tools people actually want to use. Not templates with your logo slapped on.',
  },
  {
    number: '02',
    title: 'WordPress Plugin Development',
    description:
      'Need WordPress to do something it doesn\'t? We write clean plugins that play nice with your existing setup. No page-builder spaghetti.',
  },
  {
    number: '03',
    title: 'iOS App Development',
    description:
      'Native Swift and SwiftUI. We care about the little interactions — the scroll feel, the transitions, the stuff users notice but can\'t explain.',
  },
  {
    number: '04',
    title: 'Maps & Location',
    description:
      'Store locators, geofencing, interactive maps — we\'ve spent a lot of time making pins land in the right spot. It\'s weirdly satisfying work.',
  },
  {
    number: '05',
    title: 'Dashboards & Internal Tools',
    description:
      'Your team deserves better than a shared spreadsheet. We build internal tools that actually get used instead of worked around.',
  },
  {
    number: '06',
    title: 'Prototyping & MVPs',
    description:
      'Got an idea? Let\'s build the smallest version that proves whether it works. Fast enough to learn from, solid enough to ship if it hits.',
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
            We keep the scope tight and the quality high. Here's where we tend to do our best work.
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
