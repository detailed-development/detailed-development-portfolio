import { useEffect, useId, useRef, useState } from 'react'
import { logoPath } from './LogoSvg'

const REST_ANGLE = -0.3
const TURN_MS = 1150
const CENTER_X = 133.5
const depthLayers = Array.from({ length: 13 }, (_, index) => (index - 6) * 2.5)

export default function GlowingLogo() {
  const id = useId()
  const [angle, setAngle] = useState(REST_ANGLE)
  const frame = useRef(null)

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  function spinLogo() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reducedMotion.matches || frame.current !== null) return
    const start = performance.now()

    function rotate(now) {
      const progress = Math.min(1, (now - start) / TURN_MS)
      if (progress === 1 || reducedMotion.matches) {
        setAngle(REST_ANGLE)
        frame.current = null
        return
      }

      const eased = (1 - Math.cos(progress * Math.PI)) / 2
      setAngle(REST_ANGLE + eased * 2 * Math.PI)
      frame.current = requestAnimationFrame(rotate)
    }

    frame.current = requestAnimationFrame(rotate)
  }

  // Project the stacked outlines from back to front as the mark turns.
  const cosine = Math.cos(angle)
  const sine = Math.sin(angle)
  const facingFront = cosine >= 0
  const scale = (facingFront ? 1 : -1) * Math.max(0.025, Math.abs(cosine))

  return (
    <button
      type="button"
      className="glowing-logo"
      onClick={spinLogo}
      aria-label="Spin the Detailed Development logo"
      title="Spin the DD logo"
    >
      <svg viewBox="12 6 243 243" aria-hidden="true" focusable="false">
        <defs>
          <path id={`${id}-outline`} d={logoPath} fillRule="evenodd" />
          <linearGradient id={`${id}-face`} x1="15%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="48%" stopColor="#f3f5f7" />
            <stop offset="68%" stopColor="#dce1e7" />
            <stop offset="100%" stopColor="#fff" />
          </linearGradient>
          <linearGradient id={`${id}-edge`} x2="20%" y2="100%">
            <stop offset="0%" stopColor="#eef2f6" />
            <stop offset="55%" stopColor="#a3adb9" />
            <stop offset="100%" stopColor="#77828f" />
          </linearGradient>
        </defs>
        {depthLayers.map((layer, index) => {
          const offset = (facingFront ? layer : -layer) * sine
          const isFace = index === depthLayers.length - 1
          return (
            <use
              key={layer}
              href={`#${id}-outline`}
              transform={`translate(${CENTER_X + offset} 0) scale(${scale} 1) translate(${-CENTER_X} 0)`}
              fill={`url(#${id}-${isFace ? 'face' : 'edge'})`}
              stroke={isFace ? '#fff' : 'none'}
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          )
        })}
      </svg>
    </button>
  )
}
