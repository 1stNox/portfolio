const skillData = [
  { name: 'Kotlin',                featured: true  },
  { name: 'TypeScript',            featured: true  },
  { name: 'Python',                featured: true  },
  { name: 'React',                 featured: true  },
  { name: 'Spring Boot',           featured: false },
  { name: 'GCP',                   featured: false },
  { name: 'Kubernetes',            featured: false },
  { name: 'PostgreSQL',            featured: false },
  { name: 'MongoDB',               featured: false },
  { name: 'Software Architecture', featured: false },
  { name: 'Communication',         featured: false },
]

export default function SkillsChapter({ entered }) {
  return (
    <div className={`chapter${entered ? ' entered' : ''}`} data-index="6" data-type="skills">
      <div className="skills-content">
        <p className="skills-label animate">// tech stack</p>
        <h2 className="skills-title animate">Skills</h2>
        <div className="skills-grid animate">
          {skillData.map((s) => (
            <div key={s.name} className={`skill-chip${s.featured ? ' featured' : ''}`}>
              {s.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
