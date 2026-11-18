import './Modal.css'

export default function Modal({ ref, className, closeLabel, children, ...props }) {
  return (
    <dialog
      {...props}
      ref={ref}
      className={`modal ${className}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close()
      }}
    >
      <div className="modal-panel">
        <button
          type="button"
          className="modal-close"
          aria-label={closeLabel}
          onClick={() => ref.current.close()}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        {children}
      </div>
    </dialog>
  )
}
