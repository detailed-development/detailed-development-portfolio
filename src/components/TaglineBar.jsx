const items = [
  'Client Websites',
  'WordPress Plugins',
  'Web Applications',
  'iOS Development',
  'Events & Calendars',
  'Maps & Location',
]

export default function TaglineBar() {
  return (
    <div className="tagline-bar" aria-hidden="true">
      <div className="tagline-track">
        {items.map((item, i) => (
          <span key={i}>{item}</span>
        ))}
        {items.map((item, i) => (
          <span key={`dup-${i}`}>{item}</span>
        ))}
      </div>
    </div>
  )
}
