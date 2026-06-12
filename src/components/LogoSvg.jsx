import { useId } from 'react'

export default function LogoSvg({ accent = false, ...props }) {
  const id = useId()
  const gradientId = `${id}-gradient`
  const shadowId = `${id}-shadow`

  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="40%" r="60%">
          {/* accent matches the .h1-accent text gradient (accent-light → accent-2) */}
          <stop offset="0%" stopColor={accent ? '#4ade80' : '#ffffff'} />
          <stop offset="100%" stopColor={accent ? '#2dd4bf' : '#d4d4d4'} />
        </radialGradient>
    
        <filter id={shadowId}>
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="4"
            floodColor="#000000"
            floodOpacity="0.5"
          />
        </filter>
      </defs>
    
      <g transform="scale(0.46875)">
        <path
          fill={`url(#${gradientId})`}
          filter={`url(#${shadowId})`}
          fillRule="evenodd"
          d="M53 35h73c50 0 88 40 88 93s-38 92-88 92H53V35Zm25 20v145h45c39 0 66-30 66-72s-27-73-66-73H78Zm13 20h41c22 0 37 22 37 53s-15 53-37 53H91v-60h20v41h13c15 0 25-14 25-34s-10-34-25-34h-13v6H91V75Z"
        />
      </g>
    </svg>
  )
}
