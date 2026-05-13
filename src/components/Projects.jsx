const projects = [
  {
    title: 'Event Calendar',
    description:
      'A calendar app that doesn\'t make you want to close the tab. Filtering, search, responsive — the whole deal.',
    tags: ['React', 'Node.js', 'Full Stack'],
    link: 'https://github.com/detailed-development/event-calendar',
  },
  {
    title: 'Client Store Locator',
    description:
      'Interactive map with proximity search and custom markers. Turns out people really do want to find the nearest location.',
    tags: ['Maps', 'WordPress', 'PHP'],
    link: 'https://github.com/detailed-development/client-store-locator',
  },
  {
    title: 'Internal Social Dashboard',
    description:
      'One screen to see how content is performing across platforms. Replaced a very sad collection of bookmarked analytics pages.',
    tags: ['Dashboard', 'APIs', 'React'],
    link: 'https://github.com/detailed-development/internal-social-dashboard',
  },
  {
    title: 'Party Favor',
    description:
      'An iOS app we\'re working on. Can\'t say too much yet, but we\'re pretty excited about this one.',
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
            A few things we've shipped recently. Some are open source — poke around.
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
