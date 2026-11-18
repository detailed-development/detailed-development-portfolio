import { useRef } from 'react'
import Modal from './Modal'

const projects = [
  {
    title: 'Circuit AZ',
    type: 'WordPress & Elementor',
    description:
      'Built a website for an Arizona electronic music brand. Fans can browse upcoming and past events, find ticket links, and explore music and media in one place.',
    href: 'https://circuitaz.com/',
    action: 'Visit the Circuit AZ website',
  },
  {
    title: 'WordPress Inquiry Inbox',
    type: 'Custom WordPress plugin',
    description:
      'The plugin behind this site’s contact form saves inquiries in a private WordPress inbox before confirming receipt. Messages stay available for follow-up if an email notification fails.',
    href: 'https://github.com/detailed-development/detailed-development-portfolio/tree/main/wordpress',
    action: 'See the plugin on GitHub',
  },
  {
    title: '3D Spin Studio',
    type: 'Creative production tool',
    description:
      'Turns flat logo artwork into animated 3D renders with selectable finishes and transparent video exports. A render from the studio inspired the interactive DD logo on this site.',
  },
  {
    title: 'Video Flyer Generator',
    type: 'Marketing automation',
    description:
      'A prototype that combines event details and a music track to produce animated flyers timed to the beat. One template exports vertical, feed, and square videos.',
  },
  {
    title: 'LaunchAgent Viewer',
    type: 'macOS operations dashboard',
    description:
      'Brings scheduled jobs, resource usage, and recent logs into one dashboard so it’s easier to spot a failed job and see what happened.',
  },
]

export default function SelectedWork() {
  const dialogRef = useRef(null)

  return (
    <section className="selected-work container" id="work" aria-labelledby="selected-work-title">
      <div className="selected-work-summary">
        <div>
          <h2 id="selected-work-title">Selected work</h2>
          <p>WordPress builds, beat-synced video, and tools for running automations.</p>
        </div>
        <button
          type="button"
          className="btn btn-ghost"
          aria-haspopup="dialog"
          aria-controls="selected-work-dialog"
          onClick={() => dialogRef.current.showModal()}
        >
          View projects <span aria-hidden="true">↗</span>
        </button>
      </div>
      <Modal
        ref={dialogRef}
        id="selected-work-dialog"
        className="selected-work-dialog"
        aria-labelledby="selected-work-dialog-title"
        closeLabel="Close selected work"
      >
        <h2 id="selected-work-dialog-title">Selected work</h2>
        <div className="selected-work-grid" role="region" aria-label="Project examples" tabIndex={0}>
          {projects.map(({ title, type, description, href, action }, index) => (
            <article className={index === 0 ? 'project-card project-card-featured' : 'project-card'} key={title}>
              <div>
                <span className="work-industry">{type}</span>
                <h3>{title}</h3>
              </div>
              <p>{description}</p>
              {href && (
                <a className="project-link" href={href}>
                  {action} <span aria-hidden="true">↗</span>
                </a>
              )}
            </article>
          ))}
        </div>
      </Modal>
    </section>
  )
}
