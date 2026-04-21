import { useState, useEffect, useRef, useCallback } from 'react'
import GalaxyCanvas from './components/GalaxyCanvas'
import Nav from './components/Nav'
import ProgressDots from './components/ProgressDots'
import TweaksPanel from './components/TweaksPanel'
import HeroChapter from './components/chapters/HeroChapter'
import IntroChapter from './components/chapters/IntroChapter'
import TimelineChapter from './components/chapters/TimelineChapter'
import SkillsChapter from './components/chapters/SkillsChapter'
import ContactChapter from './components/chapters/ContactChapter'

const CHAPTERS = [
  { index: 0, type: 'hero'     },
  { index: 1, type: 'intro'    },
  { index: 2, type: 'personal' },
  { index: 3, type: 'edu'      },
  { index: 4, type: 'work'     },
  { index: 5, type: 'work'     },
  { index: 6, type: 'skills'   },
  { index: 7, type: 'contact'  },
]

const AUTO_DELAY = 6800

const TWEAK_DEFAULTS = {
  starCount: 268,
  speed: 3,
  accentHue: '255,300',
}

export default function App() {
  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS)
  const [tweaksPanelVisible, setTweaksPanelVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [enteredIndices, setEnteredIndices] = useState(new Set())

  const scrollerRef = useRef(null)
  const autoTimerRef = useRef(null)
  const pauseTimeoutRef = useRef(null)
  const userPausedRef = useRef(false)
  const currentIndexRef = useRef(0)
  const autoBarRef = useRef(null)

  const startAutoBar = useCallback(() => {
    const bar = autoBarRef.current
    if (!bar) return
    bar.style.transition = 'none'
    bar.style.width = '0%'
    bar.getBoundingClientRect()
    bar.style.transition = `width ${AUTO_DELAY}ms linear`
    bar.style.width = '100%'
  }, [])

  const stopAutoBar = useCallback(() => {
    const bar = autoBarRef.current
    if (!bar) return
    bar.style.transition = 'none'
    bar.style.width = '0%'
  }, [])

  const scheduleNextRef = useRef(null)
  scheduleNextRef.current = () => {
    clearTimeout(autoTimerRef.current)
    if (userPausedRef.current) return
    if (currentIndexRef.current >= CHAPTERS.length - 1) return
    startAutoBar()
    autoTimerRef.current = setTimeout(() => {
      if (userPausedRef.current) return
      currentIndexRef.current = Math.min(currentIndexRef.current + 1, CHAPTERS.length - 1)
      scrollerRef.current?.scrollTo({ top: currentIndexRef.current * window.innerHeight, behavior: 'smooth' })
      scheduleNextRef.current?.()
    }, AUTO_DELAY)
  }

  const onUserInteract = useCallback(() => {
    userPausedRef.current = true
    clearTimeout(autoTimerRef.current)
    stopAutoBar()
    clearTimeout(pauseTimeoutRef.current)
    pauseTimeoutRef.current = setTimeout(() => {
      userPausedRef.current = false
      scheduleNextRef.current?.()
    }, 6000)
  }, [stopAutoBar])

  const handleDotClick = useCallback((index) => {
    onUserInteract()
    scrollerRef.current?.scrollTo({ top: index * window.innerHeight, behavior: 'smooth' })
  }, [onUserInteract])

  const handleLogoClick = useCallback((e) => {
    e.preventDefault()
    scrollerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = parseInt(entry.target.dataset.index)
          setEnteredIndices(prev => {
            if (prev.has(idx)) return prev
            const next = new Set(prev)
            next.add(idx)
            return next
          })
          setActiveIndex(idx)
          currentIndexRef.current = idx
        }
      })
    }, { root: scroller, threshold: 0.55 })

    const chapterEls = scroller.querySelectorAll('.chapter')
    chapterEls.forEach(ch => io.observe(ch))

    const heroTimeout = setTimeout(() => {
      setEnteredIndices(prev => {
        const next = new Set(prev)
        next.add(0)
        return next
      })
      setActiveIndex(0)
    }, 100)

    const autoTimeout = setTimeout(() => scheduleNextRef.current?.(), 1800)

    scroller.addEventListener('wheel', onUserInteract, { passive: true })
    scroller.addEventListener('touchstart', onUserInteract, { passive: true })
    scroller.addEventListener('keydown', onUserInteract)

    return () => {
      io.disconnect()
      clearTimeout(heroTimeout)
      clearTimeout(autoTimeout)
      clearTimeout(autoTimerRef.current)
      clearTimeout(pauseTimeoutRef.current)
      scroller.removeEventListener('wheel', onUserInteract)
      scroller.removeEventListener('touchstart', onUserInteract)
      scroller.removeEventListener('keydown', onUserInteract)
    }
  }, [onUserInteract])

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode')   setTweaksPanelVisible(true)
      if (e.data?.type === '__deactivate_edit_mode') setTweaksPanelVisible(false)
    }
    window.addEventListener('message', handler)
    window.parent.postMessage({ type: '__edit_mode_available' }, '*')
    return () => window.removeEventListener('message', handler)
  }, [])

  return (
    <>
      <GalaxyCanvas tweaks={tweaks} />
      <Nav onLogoClick={handleLogoClick} />
      <ProgressDots
        chapters={CHAPTERS}
        activeIndex={activeIndex}
        onDotClick={handleDotClick}
      />
      <div id="scroller" ref={scrollerRef}>
        <HeroChapter entered={enteredIndices.has(0)} />
        <IntroChapter entered={enteredIndices.has(1)} />
        <TimelineChapter
          index={2}
          type="personal"
          entered={enteredIndices.has(2)}
          bgYear="2015"
          chapterNum="Chapter 01"
          years="2015–2024"
          badge="Personal"
          role="Football Coach"
          org="TSV Elstorf · Juniors"
          desc="Nearly a decade on the sideline coaching junior football. More than a hobby — a masterclass in leadership, communication and bringing out the best in a team."
        />
        <TimelineChapter
          index={3}
          type="edu"
          entered={enteredIndices.has(3)}
          bgYear="2018"
          chapterNum="Chapter 02"
          years="2018–2022"
          badge="Education"
          role="B.Sc. Wirtschaftsinformatik"
          org="Leuphana Universität Lüneburg"
          desc="Studied Business Informatics with a focus on software engineering, systems architecture, and digital transformation — bridging technical depth with business strategy."
        />
        <TimelineChapter
          index={4}
          type="work"
          entered={enteredIndices.has(4)}
          bgYear="2022"
          chapterNum="Chapter 03"
          years="2022–2025"
          badge="Work"
          role="Software Engineer"
          org="Hermes Germany GmbH"
          desc={`Built and maintained backend services powering logistics operations at scale. Microservice architectures on GCP, Kotlin, Spring Boot and Kubernetes — learning what "production-grade" really means.`}
        />
        <TimelineChapter
          index={5}
          type="work"
          entered={enteredIndices.has(5)}
          bgYear="2025"
          chapterNum="Chapter 04"
          years="2025 — Now"
          badge="Work"
          role="Software Engineer"
          org="SupplyX (Member of the Otto Group)"
          desc="Building the next generation of supply-chain software. Full-stack, cloud-native, fast-moving. The story is still being written."
        />
        <SkillsChapter entered={enteredIndices.has(6)} />
        <ContactChapter entered={enteredIndices.has(7)} />
      </div>
      <TweaksPanel
        visible={tweaksPanelVisible}
        tweaks={tweaks}
        onTweaksChange={setTweaks}
      />
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '2px', zIndex: 200, pointerEvents: 'none' }}>
        <div ref={autoBarRef} style={{ height: '100%', width: '0%', background: 'var(--c-work)', opacity: 0.6, transition: 'none' }} />
      </div>
    </>
  )
}
