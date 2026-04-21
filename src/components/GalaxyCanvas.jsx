import { useEffect, useRef } from 'react'

export default function GalaxyCanvas({ tweaks }) {
  const canvasRef = useRef(null)
  const starsRef = useRef([])
  const animFrameRef = useRef(null)
  const tweaksRef = useRef(tweaks)
  const initGalaxyRef = useRef(null)
  const wRef = useRef(0)
  const hRef = useRef(0)

  tweaksRef.current = tweaks

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = wRef.current = window.innerWidth
    canvas.height = hRef.current = window.innerHeight

    function oklchToRgb(l, c, h) {
      const rad = h * Math.PI / 180
      const a = c * Math.cos(rad), b = c * Math.sin(rad)
      const L = l + 0.3963377774*a + 0.2158037573*b
      const M = l - 0.1055613458*a - 0.0638541728*b
      const S = l - 0.0894841775*a - 1.2914855480*b
      const ll=L*L*L, mm=M*M*M, ss=S*S*S
      let r  =  4.0767416621*ll - 3.3077115913*mm + 0.2309699292*ss
      let g  = -1.2684380046*ll + 2.6097574011*mm - 0.3413193965*ss
      let bl = -0.0041960863*ll - 0.7034186147*mm + 1.7076147010*ss
      const lin = x => x > 0.0031308 ? 1.055*Math.pow(Math.max(0,x),1/2.4)-0.055 : 12.92*x
      return [
        Math.round(Math.min(255,Math.max(0,lin(r)*255))),
        Math.round(Math.min(255,Math.max(0,lin(g)*255))),
        Math.round(Math.min(255,Math.max(0,lin(bl)*255))),
      ]
    }

    function makeStar() {
      const { accentHue } = tweaksRef.current
      const [H1, H2] = accentHue.split(',').map(Number)
      const W = wRef.current, H = hRef.current
      const t = Math.random()
      const hue = H1 + (H2 - H1) * t
      const bright = Math.random() < 0.18
      const rgb = oklchToRgb(0.65, bright ? 0.18 : 0.05, hue)
      return {
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.7 + 0.2,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        alpha: Math.random() * 0.55 + 0.2,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.008 + Math.random() * 0.018,
        rgb,
      }
    }

    function initGalaxy() {
      const { starCount } = tweaksRef.current
      starsRef.current = Array.from({ length: starCount }, makeStar)
    }
    initGalaxyRef.current = initGalaxy

    function draw() {
      const W = wRef.current, H = hRef.current
      const { speed } = tweaksRef.current
      ctx.clearRect(0, 0, W, H)
      const sp = speed * 0.04
      const stars = starsRef.current
      for (const s of stars) {
        s.x = (s.x + s.vx * sp + W) % W
        s.y = (s.y + s.vy * sp + H) % H
        s.twinkle += s.twinkleSpeed
        const a = s.alpha * (0.65 + 0.35 * Math.sin(s.twinkle))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${s.rgb[0]},${s.rgb[1]},${s.rgb[2]},${a})`
        ctx.fill()
      }
      const maxD = 115
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x, dy = stars[i].y - stars[j].y
          const d = Math.sqrt(dx*dx + dy*dy)
          if (d < maxD) {
            ctx.beginPath()
            ctx.moveTo(stars[i].x, stars[i].y)
            ctx.lineTo(stars[j].x, stars[j].y)
            ctx.strokeStyle = `rgba(180,140,240,${(1 - d/maxD) * 0.14})`
            ctx.lineWidth = 0.4
            ctx.stroke()
          }
        }
      }
      animFrameRef.current = requestAnimationFrame(draw)
    }

    function handleResize() {
      canvas.width = wRef.current = window.innerWidth
      canvas.height = hRef.current = window.innerHeight
      initGalaxy()
    }

    window.addEventListener('resize', handleResize)
    initGalaxy()
    draw()

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    initGalaxyRef.current?.()
  }, [tweaks.starCount, tweaks.accentHue])

  return <canvas id="galaxy" ref={canvasRef} />
}
