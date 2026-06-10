import { Link } from 'react-router-dom'
import { clientWork, products } from '../data/work'

function ClientCard({ project, index }) {
  return (
    <Link
      to={`/work/${project.slug}`}
      className="work-card card-spot"
      data-reveal
      style={{ '--rd': `${(index % 3) * 90}ms` }}
      aria-label={`View ${project.name}`}
    >
      <div className="work-placeholder" aria-hidden="true">
        <span className="work-placeholder-letter">{project.name.charAt(0)}</span>
        <span>{project.name}</span>
      </div>
      <div className="work-card-body">
        <span className="work-industry">{project.industry}</span>
        <h3>{project.name}</h3>
        <p>{project.summary}</p>
        <ul className="work-bullets">
          {project.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <div className="project-tags">
          {project.stack.map((tag) => (
            <span className="project-tag" key={tag}>{tag}</span>
          ))}
        </div>
        <span className="project-link">View Project &rarr;</span>
      </div>
    </Link>
  )
}

function ProductCard({ project, index }) {
  const body = (
    <>
      <span className="work-industry">{project.industry}</span>
      <h3>{project.name}</h3>
      <p>{project.summary}</p>
      <div className="project-tags">
        {project.stack.map((tag) => (
          <span className="project-tag" key={tag}>{tag}</span>
        ))}
      </div>
      {project.link ? (
        <span className="project-link">View on GitHub &rarr;</span>
      ) : (
        <span className="project-private">Private Repository</span>
      )}
    </>
  )

  const revealProps = {
    'data-reveal': true,
    style: { '--rd': `${(index % 2) * 90}ms` },
  }

  if (project.link) {
    return (
      <a
        className="project-card card-spot"
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View ${project.name} on GitHub`}
        {...revealProps}
      >
        {body}
      </a>
    )
  }
  return <div className="project-card card-spot" {...revealProps}>{body}</div>
}

export default function Work() {
  return (
    <section className="work" id="work">
      <div className="container">
        <div className="work-header" data-reveal>
          <span className="section-eyebrow">Our Work</span>
          <h2 className="section-title">Work</h2>
          <p className="section-sub">
            Client sites, plugins, and apps we've shipped. Some are open source — poke around.
          </p>
        </div>

        <h3 className="work-group-label" data-reveal>Client Websites</h3>
        <div className="work-grid">
          {clientWork.map((p, i) => (
            <ClientCard project={p} index={i} key={p.slug} />
          ))}
        </div>

        <h3 className="work-group-label" data-reveal>Products &amp; Internal Tools</h3>
        <div className="projects-grid">
          {products.map((p, i) => (
            <ProductCard project={p} index={i} key={p.slug} />
          ))}
        </div>
      </div>
    </section>
  )
}
