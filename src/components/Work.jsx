import { Link } from 'react-router-dom'
import { clientWork, products } from '../data/work'

function ClientCard({ project }) {
  return (
    <Link to={`/work/${project.slug}`} className="work-card" aria-label={`View ${project.name}`}>
      <div className="work-placeholder" aria-hidden="true">
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

function ProductCard({ project }) {
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

  if (project.link) {
    return (
      <a
        className="project-card"
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View ${project.name} on GitHub`}
      >
        {body}
      </a>
    )
  }
  return <div className="project-card">{body}</div>
}

export default function Work() {
  return (
    <section className="work" id="work">
      <div className="container">
        <div className="work-header">
          <span className="section-eyebrow">Our Work</span>
          <h2 className="section-title">Work</h2>
          <p className="section-sub">
            Client sites, plugins, and apps we've shipped. Some are open source — poke around.
          </p>
        </div>

        <h3 className="work-group-label">Client Websites</h3>
        <div className="work-grid">
          {clientWork.map((p) => (
            <ClientCard project={p} key={p.slug} />
          ))}
        </div>

        <h3 className="work-group-label">Products &amp; Internal Tools</h3>
        <div className="projects-grid">
          {products.map((p) => (
            <ProductCard project={p} key={p.slug} />
          ))}
        </div>
      </div>
    </section>
  )
}
