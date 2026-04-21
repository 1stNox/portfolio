import { useEffect, useRef } from 'react'

const ARIES_STARS = [
  { nx: 0.00, ny: 0.00, mag: 0.7, name: '41 Ari'     },
  { nx: 0.42, ny: 0.55, mag: 1.0, name: 'Hamal α'    },
  { nx: 0.72, ny: 0.72, mag: 0.8, name: 'Sheratan β' },
  { nx: 1.00, ny: 0.80, mag: 0.6, name: 'Mesarthim γ'},
]
const ARIES_LINES = [[0, 1], [1, 2], [2, 3]]

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

    let ariesPulse = 0

    function drawAries() {
      const W = wRef.current, H = hRef.current
      if (!W || !H) return
      ariesPulse += 0.012
      const cx = W * 0.70
      const cy = H * 0.28
      const scale = Math.min(W, H) * 0.18

      const glow = 0.55 + 0.2 * Math.sin(ariesPulse)

      const pts = ARIES_STARS.map(s => ({
        x: cx + (s.nx - 0.5) * scale,
        y: cy + (s.ny - 0.5) * scale,
        mag: s.mag,
      }))

      ctx.save()
      ARIES_LINES.forEach(([a, b]) => {
        const grad = ctx.createLinearGradient(pts[a].x, pts[a].y, pts[b].x, pts[b].y)
        grad.addColorStop(0, `rgba(210,185,255,${0.28 * glow})`)
        grad.addColorStop(1, `rgba(180,155,240,${0.18 * glow})`)
        ctx.beginPath()
        ctx.moveTo(pts[a].x, pts[a].y)
        ctx.lineTo(pts[b].x, pts[b].y)
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.2
        ctx.stroke()
      })

      pts.forEach((p, i) => {
        const r = 2.5 + ARIES_STARS[i].mag * 2.5
        const alpha = (0.75 + 0.2 * Math.sin(ariesPulse + i)) * glow

        const glowR = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4)
        glowR.addColorStop(0, `rgba(220,200,255,${alpha * 0.4})`)
        glowR.addColorStop(1, `rgba(180,140,255,0)`)
        ctx.beginPath()
        ctx.arc(p.x, p.y, r * 4, 0, Math.PI * 2)
        ctx.fillStyle = glowR
        ctx.fill()

        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(240,225,255,${alpha})`
        ctx.fill()
      })

      ctx.restore()
    }

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
      drawAries()
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
