export default function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="contact-box">
          <h2>Got Something in Mind?</h2>
          <p>
            We're always up for a good project. Drop us a line and tell us what
            you're working on — no pitch deck required.
          </p>
          <div className="contact-links">
            <a href="mailto:anthony@detailed-development.com" className="btn btn-primary">
              Email Us
            </a>
            <a
              href="https://github.com/detailed-development"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
