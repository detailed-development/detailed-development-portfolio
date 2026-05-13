import { useId } from 'react'

export default function LogoSvg(props) {
  const id = useId()
  const gradientId = `${id}-gradient`
  const shadowId = `${id}-shadow`

  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#d4d4d4" />
        </radialGradient>
        <filter id={shadowId}>
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000000" floodOpacity="0.5" />
        </filter>
      </defs>
      <path
        d="M20 10h40c27.6 0 50 22.4 50 50s-22.4 50-50 50H20V10z"
        fill={`url(#${gradientId})`}
        filter={`url(#${shadowId})`}
      />
      <path
        d="M38 30h22c16.6 0 30 13.4 30 30s-13.4 30-30 30H38V30z"
        fill="var(--bg)"
      />
    </svg>
  )
}
