const steps = ['Discover', 'Design', 'Build', 'Optimize', 'Launch', 'Maintain']

export default function Process() {
  return (
    <div className="process-strip" aria-label="Our process">
      <div className="container process-inner">
        {steps.map((step, i) => (
          <div className="process-step" key={step}>
            <span className="process-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="process-name">{step}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
