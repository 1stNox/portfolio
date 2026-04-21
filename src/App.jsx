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

const TSV_PROJECTS = [
  {
    year: '2012 — 2024',
    title: 'Junior Football Coach',
    desc: 'Coached junior teams for nearly a decade — developing training plans, implementing game systems and organising training camps. A particular focus: integrating less gifted players into the team, fostering belonging and growth over pure talent.',
  },
  {
    year: 'Award',
    title: 'DFB Honorary Award — "Young Football Heroes" 🏆',
    desc: 'Recognised by the German Football Association (DFB) for outstanding voluntary commitment. One of the youngest recipients, honoured for years of dedication to youth development at TSV Elstorf.',
  },
]

const LEUPHANA_PROJECTS = [
  {
    year: '2022',
    title: 'Automated Sudoku Solver',
    grade: 'Grade 1.3',
    desc: 'Four-week exam project. Reading a Sudoku image, evaluating handwritten digits, solving the puzzle and outputting the solved Sudoku as an image. (Advanced Software Development with Python – Focus: Machine Learning)',
    tags: ['Python', 'TensorFlow', 'OpenCV'],
  },
  {
    year: '2021',
    title: 'Ticket Machine',
    grade: 'Grade 1.7',
    desc: 'Three-month exam project. Implementation of the business logic for ordering a public transport ticket. (Component-Oriented Software Architecture)',
    tags: ['Java', 'Apache Felix'],
  },
  {
    year: '2020',
    title: 'Data Analysis',
    grade: 'Grade 1.0',
    desc: 'Semester-long continuous exam with weekly deliverables. Reading, manipulating and evaluating datasets. (Introduction to Programming with Python for Data Analysis)',
    tags: ['Python', 'Pandas', 'NumPy'],
  },
  {
    year: '2020',
    title: 'Car Rental System',
    grade: 'Grade 1.0',
    desc: 'Three-month exam project. Implementation of the business logic for a car rental application. (Software Architecture)',
    tags: ['Java'],
  },
]

const HERMES_PROJECTS = [
  {
    year: '2025',
    title: 'Remote Tour Release',
    desc: 'Analysis, documentation and cross-team coordination of changes. Full implementation of the new feature from backend to frontend.',
    tags: ['Kotlin', 'TypeScript', 'Spring Boot', 'React', 'MongoDB', 'Apache Kafka'],
  },
  {
    year: '2024',
    title: 'Dissolving a Monolithic, State-Oriented Application',
    desc: 'Analysis and documentation of the existing application and its business domain. Design and development of Event-Driven Microservices to calculate the relationship between shipment and sorting destination, based on rules defined in dispatch.',
    tags: ['Kotlin', 'Spring Boot', 'WebFlux', 'Coroutines', 'Spring Kafka', 'Apache Kafka', 'MongoDB', 'Kubernetes'],
  },
  {
    year: '2023',
    title: 'Restoring Maintainability of Cloud Infrastructure',
    desc: 'Acquisition of Cloud Engineering knowledge in the AWS context. Analysis of the existing infrastructure landscape, documentation, and subsequent maintenance and modernisation.',
    tags: ['AWS', 'Terraform', 'Kubernetes', 'HELM'],
  },
  {
    year: '2023',
    title: 'Multiple Use of Delivery Areas in Dispatch',
    desc: 'Feature development enabling reuse of geographical delivery areas based on cell coding and street rules. References reduce dispatch maintenance overhead. Use case: bicycle delivery.',
    tags: ['Kotlin', 'TypeScript', 'React', 'Spring Boot', 'MongoDB', 'Kubernetes'],
  },
  {
    year: '2023',
    title: 'Real-Time Processing of Shipment Status Data',
    desc: 'Prepared the business domain "Dispatch to Delivery Bases". Implemented filtering of all statuses and calculation of an abstracted shipment position within the logistics network based on status.',
    tags: ['Kotlin', 'Spring Kafka', 'Project Reactor', 'Apache Kafka', 'MongoDB'],
  },
]

const SUPPLYX_PROJECTS = [
  {
    year: '2025 — Present · Otto Group',
    title: 'Chapter in progress',
    desc: 'Building scalable supply-chain software from the ground up. Working across the full stack in a fast-moving environment with a focus on clean architecture and developer experience. More to come.',
  },
]

export default function App() {
  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS)
  const [tweaksPanelVisible, setTweaksPanelVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [enteredIndices, setEnteredIndices] = useState(new Set())
  const [expandedIndex, setExpandedIndex] = useState(null)

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

  const handleExpand = useCallback((index) => {
    setExpandedIndex(index)
    onUserInteract()
  }, [onUserInteract])

  const handleCollapse = useCallback(() => {
    setExpandedIndex(null)
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
          setExpandedIndex(prev => (prev !== null && prev !== idx ? null : prev))
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
          expanded={expandedIndex === 2}
          onExpand={() => handleExpand(2)}
          onCollapse={handleCollapse}
          bgYear="2012"
          chapterNum="Chapter 01"
          years="2012–2024"
          badge="Personal"
          role="Football Coach"
          org="TSV Elstorf · Juniors"
          desc="Nearly a decade on the sideline coaching junior football. More than a hobby — a masterclass in leadership, communication and bringing out the best in a team."
          projects={TSV_PROJECTS}
        />
        <TimelineChapter
          index={3}
          type="edu"
          entered={enteredIndices.has(3)}
          expanded={expandedIndex === 3}
          onExpand={() => handleExpand(3)}
          onCollapse={handleCollapse}
          bgYear="2018"
          chapterNum="Chapter 02"
          years="2018–2022"
          badge="Education"
          role="B.Sc. Wirtschaftsinformatik"
          org="Leuphana Universität Lüneburg"
          desc="Studied Business Informatics with a focus on software engineering, systems architecture, and digital transformation — bridging technical depth with business strategy."
          projects={LEUPHANA_PROJECTS}
        />
        <TimelineChapter
          index={4}
          type="work"
          entered={enteredIndices.has(4)}
          expanded={expandedIndex === 4}
          onExpand={() => handleExpand(4)}
          onCollapse={handleCollapse}
          bgYear="2022"
          chapterNum="Chapter 03"
          years="2022–2025"
          badge="Work"
          role="Software Engineer"
          org="Hermes Germany GmbH"
          desc={`Built and maintained backend services powering logistics operations at scale. Microservice architectures on GCP, Kotlin, Spring Boot and Kubernetes — learning what "production-grade" really means.`}
          projects={HERMES_PROJECTS}
        />
        <TimelineChapter
          index={5}
          type="work"
          entered={enteredIndices.has(5)}
          expanded={expandedIndex === 5}
          onExpand={() => handleExpand(5)}
          onCollapse={handleCollapse}
          bgYear="2025"
          chapterNum="Chapter 04"
          years="2025 — Now"
          badge="Work"
          role="Software Engineer"
          org="SupplyX · Member of the Otto Group"
          desc="Building the next generation of supply-chain software. Full-stack, cloud-native, fast-moving. The story is still being written."
          projects={SUPPLYX_PROJECTS}
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
