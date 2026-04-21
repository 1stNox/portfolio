export default function ContactChapter({ entered }) {
  return (
    <div className={`chapter${entered ? ' entered' : ''}`} data-index="7" data-type="contact">
      <div className="contact-content">
        <p className="contact-label animate">// find me online</p>
        <h2 className="contact-title animate">Connect</h2>
        <p className="contact-sub animate">Always open to interesting problems and people. Let's talk.</p>
        <div className="contact-links animate">
          <a href="https://github.com/1stNox" target="_blank" rel="noreferrer" className="contact-link github">
            <svg className="contact-link-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.4 7.9 10.9.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.07 0 0 .97-.3 3.16 1.18a11 11 0 0 1 2.88-.39c.98 0 1.96.13 2.88.39 2.2-1.49 3.16-1.18 3.16-1.18.62 1.6.23 2.78.11 3.07.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.41-5.27 5.69.41.36.78 1.07.78 2.15v3.19c0 .31.21.67.8.56C20.2 21.4 23.5 17.1 23.5 12 23.5 5.65 18.35.5 12 .5z" />
            </svg>
            <div className="contact-link-meta">
              <strong>GitHub</strong>
              <span>1stNox</span>
            </div>
          </a>
          <a href="https://www.linkedin.com/in/finn-lasse-reichling-693742211/" target="_blank" rel="noreferrer" className="contact-link linkedin">
            <svg className="contact-link-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.26 2.36 4.26 5.43v6.31zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM3.56 20.45h3.56V9H3.56v11.45zM22.22 0H1.78C.8 0 0 .78 0 1.73v20.54C0 23.2.8 24 1.78 24h20.44C23.2 24 24 23.2 24 22.27V1.73C24 .78 23.2 0 22.22 0z" />
            </svg>
            <div className="contact-link-meta">
              <strong>LinkedIn</strong>
              <span>finn-lasse-reichling</span>
            </div>
          </a>
        </div>
      </div>
      <p style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--mono)', fontSize: '0.62rem', letterSpacing: '0.1em', color: 'var(--text-dim)', opacity: 0.35 }}>
        © 2026 Finn-Lasse Reichling
      </p>
    </div>
  )
}
