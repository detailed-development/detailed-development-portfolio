import { useParams, Link, Navigate } from 'react-router-dom'
import { clientWork, findClientWork } from '../data/work'

export default function WorkDetail() {
  const { slug } = useParams()
  const project = findClientWork(slug)

  if (!project) {
    return <Navigate to="/" replace />
  }

  const index = clientWork.indexOf(project)
  const prev = clientWork[(index + clientWork.length - 1) % clientWork.length]
  const next = clientWork[(index + 1) % clientWork.length]

  return (
    <section className="work-detail">
      <div className="container">
        <Link to="/#work" className="work-detail-back">&larr; All Work</Link>

        <div className="work-detail-hero">
          <span className="work-industry">{project.industry}</span>
          <h1 className="section-title">{project.name}</h1>
          <p className="section-sub">{project.summary}</p>
          <div className="project-tags">
            {project.stack.map((tag) => (
              <span className="project-tag" key={tag}>{tag}</span>
            ))}
          </div>
        </div>

        <div className="work-placeholder work-placeholder-lg" aria-hidden="true">
          <span>{project.name} — Screenshot</span>
        </div>

        <div className="work-detail-grid">
          <div>
            <h2>What we built</h2>
            <p className="work-detail-copy">{project.description}</p>
          </div>
          <div>
            <h2>Highlights</h2>
            <ul className="work-bullets">
              {project.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost work-detail-visit"
              >
                Visit Live Site &rarr;
              </a>
            )}
          </div>
        </div>

        <div className="work-detail-cta">
          <p>Need a website like this?</p>
          <Link to="/#contact" className="btn btn-primary">Let's Talk</Link>
        </div>

        <nav className="work-detail-nav" aria-label="More projects">
          <Link to={`/work/${prev.slug}`}>&larr; {prev.name}</Link>
          <Link to={`/work/${next.slug}`}>{next.name} &rarr;</Link>
        </nav>
      </div>
    </section>
  )
}
