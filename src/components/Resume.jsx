import { motion } from 'framer-motion'
import { FiDownload } from 'react-icons/fi'
import { experience, education, skills } from '../data/resume'

export default function Resume() {
  return (
    <section id="resume" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Section label */}
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono text-[10px] text-accent/50 tracking-[0.25em] uppercase">02</span>
          <span className="w-8 h-px bg-accent/20" />
          <span className="font-mono text-[10px] text-[#475569] tracking-[0.25em] uppercase">resume</span>
        </div>
        <div className="flex items-end justify-between flex-wrap gap-4">
          <h2 className="font-display text-4xl font-bold tracking-tight text-[#E2E8F0]">
            Experience &amp; Skills
          </h2>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest border border-[#1A2236] text-[#64748B] px-4 py-2 hover:border-accent/40 hover:text-accent transition-all duration-200"
          >
            <FiDownload size={12} />
            Download CV
          </a>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-16">

          {/* Left: Timeline */}
          <div>
            <ColHeader label="Experience" />
            {experience.map((item, i) => (
              <TimelineItem key={i} item={item} />
            ))}

            <ColHeader label="Education" className="mt-14" />
            {education.map((item, i) => (
              <TimelineItem key={i} item={item} isEducation />
            ))}
          </div>

          {/* Right: Skills */}
          <div>
            <ColHeader label="Skills" />
            <div className="space-y-8">
              {skills.map(cat => (
                <div key={cat.category}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#64748B] mb-3">
                    {cat.category}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cat.items.map(item => (
                      <span
                        key={item}
                        className="font-mono text-[11px] px-3 py-1.5 bg-[#0C1018] border border-[#1A2236] text-[#94A3B8] hover:border-accent/20 hover:text-[#B0BEC5] transition-all duration-200 cursor-default"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ColHeader({ label, className = '' }) {
  return (
    <p className={`font-mono text-[10px] uppercase tracking-[0.25em] text-[#64748B] mb-6 ${className}`}>
      {label}
    </p>
  )
}

function TimelineItem({ item, isEducation }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative pl-5 pb-8 border-l border-[#1A2236] last:pb-0"
    >
      {/* Timeline dot */}
      <div
        className={`absolute left-[-4.5px] top-1.5 w-[9px] h-[9px] rounded-full ${
          isEducation
            ? 'border border-accent bg-bg'
            : 'bg-accent'
        }`}
      />

      <div className="flex items-start justify-between gap-4 mb-1">
        <div>
          <h4 className="font-display text-[#CBD5E1] font-semibold text-sm">
            {item.role || item.degree}
          </h4>
          <p className="font-mono text-[11px] text-[#64748B] mt-0.5">
            {item.company || item.school}
          </p>
        </div>
        <span className="font-mono text-[10px] text-[#475569] whitespace-nowrap pt-0.5">
          {item.period}
        </span>
      </div>

      <p className="text-[#94A3B8] text-sm leading-relaxed mt-2 font-light">
        {item.description}
      </p>

      {item.tags && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.tags.map(tag => (
            <span
              key={tag}
              className="font-mono text-[10px] px-2 py-0.5 bg-[#0C1018] border border-[#1A2236] text-[#475569]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )
}
