const DOT_COLORS = {
  hero:     'rgba(255,255,255,0.3)',
  intro:    'rgba(255,255,255,0.3)',
  personal: 'oklch(0.82 0.12 290)',
  edu:      'oklch(0.70 0.15 290)',
  work:     'oklch(0.76 0.18 290)',
  skills:   'oklch(0.76 0.18 290)',
  contact:  'oklch(0.76 0.18 290)',
}

export default function ProgressDots({ chapters, activeIndex, onDotClick }) {
  return (
    <div id="progress">
      {chapters.map((ch) => (
        <div
          key={ch.index}
          className={`prog-dot${activeIndex === ch.index ? ' active' : ''}`}
          data-index={ch.index}
          style={{ '--dot-color': DOT_COLORS[ch.type] || 'white' }}
          onClick={() => onDotClick(ch.index)}
        />
      ))}
    </div>
  )
}
