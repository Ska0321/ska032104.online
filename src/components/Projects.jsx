import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiGithub, FiExternalLink } from 'react-icons/fi'
import { projects } from '../data/projects'

const FILTERS = ['All', 'Software', 'Hardware']

export default function Projects() {
  const [active, setActive] = useState('All')

  const filtered =
    active === 'All'
      ? projects
      : projects.filter(p => p.category.toLowerCase() === active.toLowerCase())

  return (
    <section id="projects" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Section label */}
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono text-[10px] text-accent/50 tracking-[0.25em] uppercase">01</span>
          <span className="w-8 h-px bg-accent/20" />
          <span className="font-mono text-[10px] text-[#2D3748] tracking-[0.25em] uppercase">projects</span>
        </div>
        <h2 className="font-display text-4xl font-bold tracking-tight text-[#E2E8F0]">
          Selected Work
        </h2>

        {/* Filters */}
        <div className="mt-10 flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`font-mono text-[11px] px-4 py-2 border transition-all duration-200 tracking-widest uppercase ${
                active === f
                  ? 'border-accent/50 text-accent bg-accent/5'
                  : 'border-[#1A2236] text-[#2D3748] hover:border-[#2D3748] hover:text-[#64748B]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="group flex flex-col glass rounded-none p-6 transition-all duration-300 cursor-default"
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent/40" />
          <span className="font-mono text-[10px] text-[#2D3748] tracking-widest">{project.year}</span>
        </div>
        <div className="flex gap-3">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              onClick={e => e.stopPropagation()}
              className="text-[#1E293B] hover:text-accent transition-colors duration-200"
            >
              <FiGithub size={15} />
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Live"
              onClick={e => e.stopPropagation()}
              className="text-[#1E293B] hover:text-accent transition-colors duration-200"
            >
              <FiExternalLink size={15} />
            </a>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="font-display text-[#CBD5E1] font-semibold text-base group-hover:text-accent transition-colors duration-200">
        {project.title}
      </h3>

      {/* Description */}
      <p className="mt-2 text-[#334155] text-sm leading-relaxed flex-1 font-light">
        {project.description}
      </p>

      {/* Tags */}
      <div className="mt-5 flex flex-wrap gap-1.5">
        {project.tags.map(tag => (
          <span
            key={tag}
            className="font-mono text-[10px] px-2 py-1 bg-[#0C1018] border border-[#1A2236] text-[#2D3748] group-hover:border-[#243050] transition-colors duration-200"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.article>
  )
}
