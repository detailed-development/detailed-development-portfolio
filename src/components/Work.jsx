import { Link } from 'react-router-dom'
import useProjects from '../hooks/useProjects'

// Project photo from the CMS, with a graceful letter-tile fallback when there's none.
function WorkThumb({ project, large = false }) {
  const cls = large ? 'work-placeholder work-placeholder-lg' : 'work-placeholder'
  if (project.image?.url) {
    return (
      <div className={cls}>
        <img
          className="work-photo"
          src={project.image.url}
          alt={project.image.alt || `${project.name} screenshot`}
          loading="lazy"
        />
      </div>
    )
  }
  return (
    <div className={cls} aria-hidden="true">
      <span className="work-placeholder-letter">{project.name.charAt(0)}</span>
      <span>{large ? `${project.name} — Screenshot` : project.name}</span>
    </div>
  )
}

export { WorkThumb }

function ClientCard({ project, index }) {
  return (
    <Link
      to={`/work/${project.slug}`}
      className="work-card card-spot"
      data-reveal
      style={{ '--rd': `${(index % 3) * 90}ms` }}
      aria-label={`View ${project.name}`}
    >
      <WorkThumb project={project} />
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
      {project.url ? (
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

  if (project.url) {
    return (
      <a
        className="project-card card-spot"
        href={project.url}
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
  const { clientWork, products } = useProjects()

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

        {clientWork.length > 0 && (
          <>
            <h3 className="work-group-label" data-reveal>Client Websites</h3>
            <div className="work-grid">
              {clientWork.map((p, i) => (
                <ClientCard project={p} index={i} key={p.slug} />
              ))}
            </div>
          </>
        )}

        {products.length > 0 && (
          <>
            <h3 className="work-group-label" data-reveal>Products &amp; Internal Tools</h3>
            <div className="projects-grid">
              {products.map((p, i) => (
                <ProductCard project={p} index={i} key={p.slug} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
