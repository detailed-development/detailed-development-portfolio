const projects = [
  {
    title: 'Event Calendar',
    description:
      'A dynamic event calendar application with filtering, search, and responsive views for managing and displaying events.',
    tags: ['React', 'Node.js', 'Full Stack'],
    link: 'https://github.com/detailed-development/event-calendar',
  },
  {
    title: 'Client Store Locator',
    description:
      'An interactive store locator with map integration, proximity search, and customizable location markers for client-facing applications.',
    tags: ['Maps', 'WordPress', 'PHP'],
    link: 'https://github.com/detailed-development/client-store-locator',
  },
  {
    title: 'Internal Social Dashboard',
    description:
      'A centralized dashboard for monitoring social media metrics, engagement, and content performance across multiple platforms.',
    tags: ['Dashboard', 'APIs', 'React'],
    link: 'https://github.com/detailed-development/internal-social-dashboard',
  },
  {
    title: 'Party Favor',
    description:
      'A private project currently in development. Details coming soon.',
    tags: ['iOS', 'Swift', 'Private'],
    link: null,
  },
]

export default function Projects() {
  return (
    <section className="projects" id="projects">
      <div className="container">
        <div className="projects-header">
          <span className="section-eyebrow">Our Work</span>
          <h2 className="section-title">Projects</h2>
          <p className="section-sub">
            A selection of recent work across web, mobile, and internal tooling.
          </p>
        </div>
        <div className="projects-grid">
          {projects.map((p) => (
            <div className="project-card" key={p.title}>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <div className="project-tags">
                {p.tags.map((tag) => (
                  <span className="project-tag" key={tag}>{tag}</span>
                ))}
              </div>
              {p.link ? (
                <a
                  className="project-link"
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on GitHub &rarr;
                </a>
              ) : (
                <span className="project-private">Private Repository</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
