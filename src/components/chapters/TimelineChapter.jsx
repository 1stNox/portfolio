export default function TimelineChapter({ index, type, entered, bgYear, chapterNum, years, badge, role, org, desc }) {
  return (
    <div className={`chapter${entered ? ' entered' : ''}`} data-index={index} data-type={type}>
      <div className="step-bg-year">{bgYear}</div>
      <div className="step-layout">
        <div className="step-left">
          <p className="step-chapter-num animate">{chapterNum}</p>
          <p className="step-years animate">{years}</p>
          <span className="step-type-badge animate">{badge}</span>
        </div>
        <div className="step-divider"></div>
        <div className="step-right">
          <p className="step-role animate">{role}</p>
          <p className="step-org animate">{org}</p>
          <p className="step-desc animate">{desc}</p>
        </div>
      </div>
    </div>
  )
}
