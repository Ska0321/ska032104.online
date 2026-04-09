import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiGithub, FiExternalLink, FiChevronLeft, FiChevronRight, FiLock } from 'react-icons/fi'
import { projects } from '../data/projects'

const FILTERS = ['All', 'Software', 'Hardware']

export default function Projects() {
  const [active, setActive] = useState('All')

  const featured = projects.find(p => p.featured)
  const rest = projects.filter(p => !p.featured)

  const filtered =
    active === 'All'
      ? rest
      : rest.filter(p => p.category.toLowerCase() === active.toLowerCase())

  return (
    <section id="projects" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Section label */}
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono text-[10px] text-accent/50 tracking-[0.25em] uppercase">01</span>
          <span className="w-8 h-px bg-accent/20" />
          <span className="font-mono text-[10px] text-[#475569] tracking-[0.25em] uppercase">projects</span>
        </div>
        <h2 className="font-display text-4xl font-bold tracking-tight text-[#E2E8F0]">
          Selected Work
        </h2>

        {/* ── Featured: Altarego ── */}
        {featured && <FeaturedCard project={featured} />}

        {/* Filters */}
        <div className="mt-20 flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`font-mono text-[11px] px-4 py-2 border transition-all duration-200 tracking-widest uppercase ${
                active === f
                  ? 'border-accent/50 text-accent bg-accent/5'
                  : 'border-[#1A2236] text-[#64748B] hover:border-[#475569] hover:text-[#94A3B8]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map(project =>
              project.comingSoon
                ? <ComingSoonCard key={project.id} project={project} />
                : <ProjectCard key={project.id} project={project} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

/* ─── Featured card ─────────────────────────────────────────── */
function FeaturedCard({ project }) {
  const [idx, setIdx] = useState(0)
  const images = project.images || []

  const prev = () => setIdx(i => (i - 1 + images.length) % images.length)
  const next = () => setIdx(i => (i + 1) % images.length)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mt-12 glass rounded-none overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2">

        {/* Image carousel */}
        <div className="relative bg-[#070C14] flex items-center justify-center overflow-hidden min-h-[320px] lg:min-h-[440px]">
          <AnimatePresence mode="wait">
            <motion.img
              key={idx}
              src={images[idx]}
              alt={`${project.title} screenshot ${idx + 1}`}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35 }}
              className="h-full w-auto max-h-[440px] object-contain"
            />
          </AnimatePresence>

          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-bg/80 border border-[#1A2236] text-[#64748B] hover:text-accent hover:border-accent/40 transition-all duration-200"
              >
                <FiChevronLeft size={14} />
              </button>
              <button
                onClick={next}
                aria-label="Next"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-bg/80 border border-[#1A2236] text-[#64748B] hover:text-accent hover:border-accent/40 transition-all duration-200"
              >
                <FiChevronRight size={14} />
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIdx(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                      i === idx ? 'bg-accent' : 'bg-[#1A2236]'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="p-8 lg:p-10 flex flex-col">

          {/* Logo + badge row */}
          <div className="flex items-center gap-3 mb-5">
            {project.logo && (
              <img src={project.logo} alt="Altarego logo" className="w-8 h-8 object-contain" />
            )}
            <span className="font-mono text-[10px] text-accent tracking-[0.25em] uppercase border border-accent/30 px-2 py-0.5">
              Featured
            </span>
            <span className="font-mono text-[10px] text-[#64748B] tracking-widest">{project.year}</span>
          </div>

          <h3 className="font-display text-2xl font-bold text-[#E2E8F0]">{project.title}</h3>

          <p className="mt-3 text-[#94A3B8] text-sm leading-relaxed font-light">
            {project.description}
          </p>

          {/* Onboarding taglines — mirrors the app's welcome screens */}
          <div className="mt-5 space-y-2">
            {[
              { face: '[ ^ _ ^ ]', label: 'A personal AI conscience companion' },
              { face: '[ # _ # ]', label: 'Private by design — no cloud, no servers' },
              { face: '[ * _ * ]', label: 'Train your self — your digital conscience grows' },
              { face: '[ ★ _ ★ ]', label: 'Your hope is your north star' },
            ].map(({ face, label }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-accent/70 whitespace-nowrap">{face}</span>
                <span className="font-mono text-[10px] text-[#475569] tracking-wide">{label}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {project.tags.map(tag => (
              <span
                key={tag}
                className="font-mono text-[10px] px-2 py-1 bg-[#0C1018] border border-[#1A2236] text-[#64748B]"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest border border-[#1A2236] text-[#64748B] px-4 py-2 hover:border-accent/40 hover:text-accent transition-all duration-200"
              >
                <FiGithub size={12} /> GitHub
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest bg-accent text-bg px-4 py-2 hover:bg-[#00C49C] transition-colors duration-200"
              >
                <FiExternalLink size={12} /> Live
              </a>
            )}
            {!project.github && !project.live && (
              <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest border border-[#1A2236] text-[#475569] px-4 py-2">
                <FiLock size={11} /> Private Repo
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Standard card ─────────────────────────────────────────── */
function ProjectCard({ project }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="group flex flex-col glass rounded-none overflow-hidden transition-all duration-300 cursor-default"
    >
      {/* Image */}
      {project.image && (
        <div className="h-44 bg-[#070C14] overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity duration-300 group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        {/* Header row */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent/40" />
            <span className="font-mono text-[10px] text-[#64748B] tracking-widest">{project.year}</span>
          </div>
          <div className="flex gap-3">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                onClick={e => e.stopPropagation()}
                className="text-[#475569] hover:text-accent transition-colors duration-200"
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
                className="text-[#475569] hover:text-accent transition-colors duration-200"
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
        <p className="mt-2 text-[#94A3B8] text-sm leading-relaxed flex-1 font-light">
          {project.description}
        </p>

        {/* Tags */}
        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.tags.map(tag => (
            <span
              key={tag}
              className="font-mono text-[10px] px-2 py-1 bg-[#0C1018] border border-[#1A2236] text-[#64748B] group-hover:border-[#243050] transition-colors duration-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  )
}

/* ─── Coming soon card ──────────────────────────────────────── */
function ComingSoonCard({ project }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col glass rounded-none p-6 transition-all duration-300 cursor-default opacity-60 hover:opacity-80 transition-opacity"
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1A2236]" />
          <span className="font-mono text-[10px] text-[#475569] tracking-widest">{project.year}</span>
        </div>
        <span className="font-mono text-[9px] px-2 py-0.5 border border-[#1A2236] text-[#475569] tracking-widest uppercase">
          Coming Soon
        </span>
      </div>

      <h3 className="font-display text-[#475569] font-semibold text-base">
        {project.title}
      </h3>

      <p className="mt-2 text-[#64748B] text-sm leading-relaxed flex-1 font-light">
        {project.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-1.5">
        <span className="font-mono text-[10px] px-2 py-1 bg-[#0C1018] border border-[#131B27] text-[#334155]">
          {project.category === 'software' ? 'Software' : 'Hardware'}
        </span>
      </div>
    </motion.article>
  )
}
