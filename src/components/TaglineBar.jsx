const items = [
  'Web Applications',
  'WordPress Plugins',
  'iOS Development',
  'Maps & Location',
  'Internal Dashboards',
  'Rapid Prototyping',
]

export default function TaglineBar() {
  return (
    <div className="tagline-bar">
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
