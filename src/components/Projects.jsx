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
        <h2 className="font-display text-5xl font-bold tracking-tight text-[#E2E8F0]">
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

  const STEP = 3
  const prev = () => setIdx(i => (i - STEP + images.length) % images.length)
  const next = () => setIdx(i => (i + STEP) % images.length)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mt-12 glass rounded-none overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2">

        {/* Image carousel — three photos side by side */}
        <div className="relative bg-[#070C14] flex items-center justify-center overflow-hidden min-h-[320px] lg:min-h-[440px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              className="flex items-center justify-center gap-2 w-full h-full px-8 py-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {[0, 1, 2].map(offset => (
                <img
                  key={offset}
                  src={images[(idx + offset) % images.length]}
                  alt={`${project.title} screenshot ${idx + offset + 1}`}
                  className={`h-auto w-auto max-h-[380px] max-w-[30%] object-contain transition-opacity duration-200 ${
                    offset === 1 ? 'opacity-100' : 'opacity-60'
                  }`}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {images.length > 3 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-bg/80 border border-[#1A2236] text-[#64748B] hover:text-accent hover:border-accent/40 transition-all duration-200"
              >
                <FiChevronLeft size={13} />
              </button>
              <button
                onClick={next}
                aria-label="Next"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-bg/80 border border-[#1A2236] text-[#64748B] hover:text-accent hover:border-accent/40 transition-all duration-200"
              >
                <FiChevronRight size={13} />
              </button>

              {/* Dots — one per group of 3 */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {Array.from({ length: Math.ceil(images.length / STEP) }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIdx(i * STEP)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                      Math.floor(idx / STEP) === i ? 'bg-accent' : 'bg-[#1A2236]'
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
          <div className="flex items-center gap-4 mb-6">
            {project.logo && (
              <img src={project.logo} alt="Altarego logo" className="w-14 h-14 object-contain" />
            )}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-accent tracking-[0.25em] uppercase border border-accent/30 px-2 py-0.5">
                  Featured
                </span>
                <span className="font-mono text-[10px] text-[#64748B] tracking-widest">{project.year}</span>
              </div>
              <h3 className="font-display text-3xl font-bold text-[#E2E8F0]">{project.title}</h3>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
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
  const images = project.images || (project.image ? [project.image] : [])
  const [idx, setIdx] = useState(0)

  const prev = (e) => { e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length) }
  const next = (e) => { e.stopPropagation(); setIdx(i => (i + 1) % images.length) }

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
      {/* Image / Carousel */}
      {images.length > 0 && (
        <div className="relative h-60 bg-[#070C14] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={idx}
              src={images[idx]}
              alt={`${project.title} ${idx + 1}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity duration-300 group-hover:scale-105 transition-transform duration-500"
            />
          </AnimatePresence>

          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center bg-bg/80 border border-[#1A2236] text-[#64748B] hover:text-accent hover:border-accent/40 transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <FiChevronLeft size={11} />
              </button>
              <button
                onClick={next}
                aria-label="Next"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center bg-bg/80 border border-[#1A2236] text-[#64748B] hover:text-accent hover:border-accent/40 transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <FiChevronRight size={11} />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={e => { e.stopPropagation(); setIdx(i) }}
                    className={`w-1 h-1 rounded-full transition-all duration-200 ${i === idx ? 'bg-accent' : 'bg-[#1A2236]'}`}
                  />
                ))}
              </div>
            </>
          )}
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
        <h3 className="font-display text-[#CBD5E1] font-semibold text-lg group-hover:text-accent transition-colors duration-200">
          {project.title}
        </h3>

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

      <h3 className="font-display text-[#475569] font-semibold text-lg">
        {project.title}
      </h3>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <span className="font-mono text-[10px] px-2 py-1 bg-[#0C1018] border border-[#131B27] text-[#334155]">
          {project.category === 'software' ? 'Software' : 'Hardware'}
        </span>
      </div>
    </motion.article>
  )
}
