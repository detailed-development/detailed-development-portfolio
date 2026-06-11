import { useParams, Link, Navigate } from 'react-router-dom'
import useProjects from '../hooks/useProjects'
import { WorkThumb } from '../components/Work'
import useReveal from '../hooks/useReveal'

export default function WorkDetail() {
  const { slug } = useParams()
  const { clientWork, loading } = useProjects()

  useReveal()

  const project = clientWork.find((p) => p.slug === slug)

  // Wait for data before deciding a slug is missing, so a direct link or
  // refresh doesn't bounce to home before the CMS responds.
  if (!project) {
    if (loading) {
      return (
        <section className="work-detail">
          <div className="container">
            <p className="section-sub" aria-live="polite">Loading…</p>
          </div>
        </section>
      )
    }
    return <Navigate to="/" replace />
  }

  const index = clientWork.indexOf(project)
  const prev = clientWork[(index + clientWork.length - 1) % clientWork.length]
  const next = clientWork[(index + 1) % clientWork.length]

  return (
    <section className="work-detail">
      <div className="container">
        <Link to="/#work" className="work-detail-back">&larr; All Work</Link>

        <div className="work-detail-hero" data-reveal>
          <span className="work-industry">{project.industry}</span>
          <h1 className="section-title">{project.name}</h1>
          <p className="section-sub">{project.summary}</p>
          <div className="project-tags">
            {project.stack.map((tag) => (
              <span className="project-tag" key={tag}>{tag}</span>
            ))}
          </div>
        </div>

        <div data-reveal>
          <WorkThumb project={project} large />
        </div>

        <div className="work-detail-grid">
          <div data-reveal>
            <h2>What we built</h2>
            <p className="work-detail-copy">{project.description}</p>
          </div>
          <div data-reveal style={{ '--rd': '120ms' }}>
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

        <div className="work-detail-cta card-spot" data-reveal>
          <p>Need a website like this?</p>
          <Link to="/#contact" className="btn btn-primary">Let's Talk</Link>
        </div>

        {prev && next && (
          <nav className="work-detail-nav" aria-label="More projects">
            <Link to={`/work/${prev.slug}`}>&larr; {prev.name}</Link>
            <Link to={`/work/${next.slug}`}>{next.name} &rarr;</Link>
          </nav>
        )}
      </div>
    </section>
  )
}
