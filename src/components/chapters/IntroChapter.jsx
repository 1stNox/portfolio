export default function IntroChapter({ entered }) {
  return (
    <div className={`chapter${entered ? ' entered' : ''}`} data-index="1" data-type="intro">
      <div className="chapter-intro-content">
        <p className="chapter-intro-label animate">// my story</p>
        <h2 className="chapter-intro-title animate">My Journey</h2>
        <p className="chapter-intro-sub animate" style={{ margin: '1rem auto 0' }}>
          From the football pitch to cloud-native architecture — here's how it unfolded.
        </p>
      </div>
      <p className="chapter-footer-hint">scroll to continue ↓</p>
    </div>
  )
}
