export default function TweaksPanel({ visible, tweaks, onTweaksChange }) {
  if (!visible) return null

  return (
    <div id="tweaks-panel" style={{ display: 'block' }}>
      <h3>Tweaks</h3>
      <div className="tweak-row">
        <label>Star density</label>
        <input
          type="range"
          id="tweak-stars"
          min="60"
          max="300"
          value={tweaks.starCount}
          onChange={(e) => {
            const starCount = parseInt(e.target.value)
            onTweaksChange(prev => ({ ...prev, starCount }))
            window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { starCount } }, '*')
          }}
        />
      </div>
      <div className="tweak-row">
        <label>Particle speed</label>
        <input
          type="range"
          id="tweak-speed"
          min="1"
          max="10"
          step="0.5"
          value={tweaks.speed}
          onChange={(e) => {
            const speed = parseFloat(e.target.value)
            onTweaksChange(prev => ({ ...prev, speed }))
            window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { speed } }, '*')
          }}
        />
      </div>
      <div className="tweak-row">
        <label>Accent palette</label>
        <select
          id="tweak-hue"
          value={tweaks.accentHue}
          onChange={(e) => {
            const accentHue = e.target.value
            onTweaksChange(prev => ({ ...prev, accentHue }))
            window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { accentHue } }, '*')
          }}
        >
          <option value="255,300">Blue → Purple</option>
          <option value="200,255">Cyan → Blue</option>
          <option value="280,340">Purple → Pink</option>
          <option value="160,210">Teal → Cyan</option>
        </select>
      </div>
    </div>
  )
}
