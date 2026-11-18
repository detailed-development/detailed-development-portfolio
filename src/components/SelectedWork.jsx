import { useRef, useState } from 'react'
import Modal from './Modal'

const projects = [
  {
    title: 'Circuit AZ',
    type: 'WordPress & Elementor',
    description:
      'Built a website for an Arizona electronic music brand. Fans can browse upcoming and past events, find ticket links, and explore music and media in one place.',
    href: 'https://circuitaz.com/',
    action: 'Visit the Circuit AZ website',
    preview: {
      src: '/projects/circuit-events.webp',
      alt: 'Past events on the Circuit AZ site, with three event flyers in a grid',
      caption: 'Circuit AZ event archive',
    },
  },
  {
    title: 'WordPress Inquiry Inbox',
    type: 'Custom WordPress plugin',
    description:
      'The plugin behind this site’s contact form saves inquiries in a private WordPress inbox before confirming receipt. Messages stay available for follow-up if an email notification fails.',
    href: 'https://github.com/detailed-development/detailed-development-portfolio/tree/main/wordpress',
    action: 'See the plugin on GitHub',
    preview: {
      src: '/projects/inquiry-form.webp',
      alt: 'Detailed Development’s public inquiry form with name, email, and message fields',
      caption: 'The public form that feeds the inbox',
    },
  },
  {
    title: '3D Spin Studio',
    type: 'Creative production tool',
    description:
      'Turns flat logo artwork into animated 3D renders with selectable finishes and transparent video exports. A render from the studio inspired the interactive DD logo on this site.',
    preview: {
      src: '/projects/dd-spin.mp4',
      poster: '/projects/dd-spin.webp',
      caption: 'Watch the 5-second DD logo render',
    },
  },
  {
    title: 'Video Flyer Generator',
    type: 'Marketing automation',
    description:
      'A prototype that combines event details and a music track to produce animated flyers timed to the beat. One template exports vertical, feed, and square videos.',
    preview: {
      src: '/projects/video-flyer.mp4',
      poster: '/projects/video-flyer.webp',
      caption: 'Watch an 8-second sample flyer with sound',
    },
  },
  {
    title: 'LaunchAgent Viewer',
    type: 'macOS operations dashboard',
    description:
      'Brings scheduled jobs, resource usage, and recent logs into one dashboard so it’s easier to spot a failed job and see what happened.',
    preview: {
      src: '/projects/launchagent-viewer.webp',
      alt: 'LaunchAgent Viewer showing system gauges and the status of three background services',
      caption: 'Dashboard shown with sample data',
    },
  },
]

function ProjectPreview({ title, preview }) {
  return (
    <figure className="project-preview">
      {preview.poster ? (
        <div className="project-preview-media">
          <video
            controls
            playsInline
            preload="none"
            poster={preview.poster}
            aria-label={preview.caption}
          >
            <source src={preview.src} type="video/mp4" />
            <a href={preview.src}>Open video preview</a>
          </video>
        </div>
      ) : (
        <a
          className="project-preview-media"
          href={preview.src}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open full-size ${title} screenshot in a new tab`}
        >
          <img src={preview.src} alt={preview.alt} loading="lazy" decoding="async" />
          <span className="project-preview-expand" aria-hidden="true">↗</span>
        </a>
      )}
      <figcaption>{preview.caption}</figcaption>
    </figure>
  )
}

export default function SelectedWork() {
  const dialogRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)

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
          onClick={() => {
            dialogRef.current.showModal()
            setIsOpen(true)
          }}
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
        onClose={() => {
          if (!dialogRef.current?.open) setIsOpen(false)
        }}
      >
        <h2 id="selected-work-dialog-title">Selected work</h2>
        {isOpen && (
          <div className="selected-work-grid" role="region" aria-label="Project examples" tabIndex={0}>
            {projects.map(({ title, type, description, href, action, preview }, index) => (
              <article className={index === 0 ? 'project-card project-card-featured' : 'project-card'} key={title}>
                <ProjectPreview title={title} preview={preview} />
                <div className="project-card-content">
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
                </div>
              </article>
            ))}
          </div>
        )}
      </Modal>
    </section>
  )
}
