export default function TimelineChapter({
  index,
  type,
  entered,
  expanded,
  onExpand,
  onCollapse,
  bgYear,
  chapterNum,
  years,
  badge,
  role,
  org,
  desc,
  projects,
}) {
  const classes = ['chapter']
  if (entered) classes.push('entered')
  if (expanded) classes.push('expanded')

  const handleLayoutClick = () => {
    if (expanded) {
      onCollapse?.()
    } else {
      onExpand?.()
    }
  }

  const handleCloseClick = (e) => {
    e.stopPropagation()
    onCollapse?.()
  }

  const stopEvent = (e) => e.stopPropagation()

  return (
    <div className={classes.join(' ')} data-index={index} data-type={type}>
      <div className="step-bg-year">{bgYear}</div>
      <div className="step-layout" onClick={handleLayoutClick}>
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
      {projects && projects.length > 0 && (
        <div
          className="step-detail"
          onClick={stopEvent}
          onWheel={stopEvent}
          onTouchMove={stopEvent}
        >
          <button className="detail-close" aria-label="Close" onClick={handleCloseClick}>✕</button>
          {projects.map((p, i) => (
            <div key={i} className="detail-project">
              <p className="detail-project-year">{p.year}</p>
              <p className="detail-project-title">
                {p.title}
                {p.grade && (
                  <span style={{ fontWeight: 400, color: 'var(--text-dim)' }}> · {p.grade}</span>
                )}
              </p>
              <p className="detail-project-desc">{p.desc}</p>
              {p.tags && p.tags.length > 0 && (
                <div className="detail-tags">
                  {p.tags.map((t) => (
                    <span key={t} className="detail-tag">{t}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <p className="detail-click-hint">
        <span className="hint-dot"></span>Click to explore
      </p>
    </div>
  )
}
