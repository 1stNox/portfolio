export default function HeroChapter({ entered }) {
  return (
    <div className={`chapter${entered ? ' entered' : ''}`} data-index="0" data-type="hero">
      <div className="hero-content">
        <p className="hero-eyebrow">Software Engineer · Germany</p>
        <h1 className="hero-name">
          <span className="grad">Finn-Lasse<br />Reichling</span>
        </h1>
        <p className="hero-tagline">Solving issues is my passion</p>
        <div className="hero-scroll-cue">
          <span>Begin the journey</span>
          <div className="scroll-line"></div>
        </div>
      </div>
    </div>
  )
}
