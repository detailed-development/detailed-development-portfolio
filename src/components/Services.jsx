const services = [
  {
    title: 'WordPress Rescue',
    featured: true,
    description:
      'Troubleshoot broken layouts, plugin conflicts, failed updates, and checkout issues. Get help building or updating WordPress sites, Elementor pages, and WooCommerce stores.',
  },
  {
    title: 'Email & DNS Rescue',
    featured: true,
    description:
      'Set up Google Workspace, fix DNS and mail routing issues, and improve deliverability with SPF, DKIM, and DMARC.',
  },
  {
    title: 'Plugins, Integrations & Performance',
    description:
      'Build custom WordPress plugins, connect your site to the tools you use, and speed up slow pages and stores.',
  },
  {
    title: 'Analytics & Conversion Tracking',
    description:
      'Set up analytics, conversion tracking, and marketing integrations to see which campaigns drive leads, sales, and donations.',
  },
  {
    title: 'AI Automation & Business Tools',
    description:
      'Use AI to automate repetitive tasks and get custom tools for workflows like intake, reporting, and document processing.',
  },
  {
    title: 'Maintenance & Agency Support',
    description:
      'Get ongoing help with site updates and fixes, or bring in white-label development and troubleshooting when your agency needs extra capacity.',
  },
]

export default function Services() {
  return (
    <section className="services" id="services" aria-labelledby="services-title">
      <div className="container">
        <h2 className="section-title" id="services-title">Services</h2>
        <div className="services-grid">
          {services.map(({ title, description, featured }) => (
            <article
              className={featured ? 'service-card service-card-featured' : 'service-card'}
              key={title}
            >
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
