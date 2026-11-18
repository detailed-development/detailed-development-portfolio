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
      'Built the plugin behind this site’s contact form. It saves each inquiry in a private WordPress inbox before showing a confirmation, so the message is there to follow up on even if an email notification fails.',
    href: 'https://github.com/detailed-development/detailed-development-portfolio/tree/main/wordpress',
    action: 'See the plugin on GitHub',
  },
]

export default function SelectedWork() {
  const dialogRef = useRef(null)

  return (
    <section className="selected-work container" id="work" aria-labelledby="selected-work-title">
      <div className="selected-work-summary">
        <h2 id="selected-work-title">Selected work</h2>
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
        <div className="selected-work-grid">
          {projects.map(({ title, type, description, href, action }) => (
            <article className="project-card" key={title}>
              <div>
                <span className="work-industry">{type}</span>
                <h3>{title}</h3>
              </div>
              <p>{description}</p>
              <a className="project-link" href={href}>
                {action} <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
      </Modal>
    </section>
  )
}
