import { useRef, useState } from 'react'
import Modal from './Modal'

const projects = [
  {
    title: 'Video Flyer Generator',
    type: 'Marketing automation',
    description:
      'Built and refined a generator that turns event details and a music track into beat-synced motion flyers. Circuit used it for the Juheun and SHADED parties at The Drop PHX.',
    flyers: [
      {
        name: 'Juheun',
        src: '/projects/circuit-juheun.mp4',
        poster: '/projects/circuit-juheun.webp',
        caption: 'Circuit presents Juheun · 8-second preview',
        href: 'https://circuitaz.com/event/260829_circuit-presents-juheun/',
      },
      {
        name: 'SHADED',
        src: '/projects/circuit-shaded.mp4',
        poster: '/projects/circuit-shaded.webp',
        caption: 'Circuit presents SHADED · 8-second preview',
        href: 'https://circuitaz.com/event/260926_circuit-presents-shaded/',
      },
    ],
  },
  {
    title: 'CIRCUIT Set Mastering',
    type: 'Audio production automation',
    description:
      'Turns raw live recordings into 24-bit WAVs ready to send to artists. The tool queues incoming files, checks loudness and peak levels, and produces a quality report for each master.',
    preview: {
      src: '/projects/circuit-set-mastering.webp',
      alt: 'CIRCUIT Set Mastering showing the recording drop zone and a completed master with loudness and peak measurements',
      caption: 'Completed master from a sample recording',
    },
  },
  {
    title: 'Circuit AZ',
    type: 'WordPress & Elementor',
    featured: true,
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

function pauseOnDetach(video) {
  return () => video.pause()
}

function ProjectPreview({ title, preview }) {
  return (
    <figure className="project-preview">
      {preview.poster ? (
        <div className="project-preview-media">
          <video
            ref={pauseOnDetach}
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

function FlyerPreviews({ title, flyers }) {
  const [selectedFlyer, setSelectedFlyer] = useState(0)
  const flyer = flyers[selectedFlyer]

  return (
    <div className="flyer-previews">
      <ProjectPreview key={flyer.src} title={title} preview={flyer} />
      <div className="flyer-preview-actions">
        <div className="flyer-preview-options" role="group" aria-label="Choose a Circuit flyer">
          {flyers.map(({ name }, index) => (
            <button
              key={name}
              type="button"
              className="btn btn-ghost"
              aria-pressed={selectedFlyer === index}
              onClick={() => setSelectedFlyer(index)}
            >
              {name}
            </button>
          ))}
        </div>
        <a href={flyer.href} className="project-link">
          View {flyer.name} event <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
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
            {projects.map(({ title, type, description, href, action, preview, flyers, featured }) => (
              <article className={featured ? 'project-card project-card-featured' : 'project-card'} key={title}>
                {flyers ? (
                  <FlyerPreviews title={title} flyers={flyers} />
                ) : (
                  <ProjectPreview title={title} preview={preview} />
                )}
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
