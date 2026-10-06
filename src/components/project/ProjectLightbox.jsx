import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FiChevronLeft, FiChevronRight, FiExternalLink, FiGithub, FiPlay, FiX } from 'react-icons/fi'
import MediaTile from './MediaTile'
import { Tags } from './ProjectCard'

// Full-screen gallery + write-up. Esc closes, arrow keys step through media.
export default function ProjectLightbox({ project, startIndex = 0, onClose }) {
  const [idx, setIdx] = useState(startIndex)
  const closeRef = useRef(null)
  const { media } = project
  const count = media.length

  const step = useCallback(delta => setIdx(i => (i + delta + count) % count), [count])

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') step(-1)
      else if (e.key === 'ArrowRight') step(1)
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose, step])

  const current = media[idx]
  const titleId = `lightbox-title-${project.id}`

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-md overflow-y-auto"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="relative max-w-6xl mx-auto min-h-full lg:min-h-0 lg:my-8 grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] bg-bg border border-border"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center bg-bg/80 border border-border text-[#94A3B8] hover:text-accent hover:border-accent/40 transition-colors"
        >
          <FiX size={16} />
        </button>

        {/* Stage + thumbnails */}
        <div className="flex flex-col bg-[#05070C]">
          <div className="relative h-[55vh] lg:h-[74vh]">
            <MediaTile
              key={current.src}
              item={current}
              alt={`${project.title} ${idx + 1} of ${count}`}
              fit="contain"
              controls
            />
            {count > 1 && (
              <>
                <NavButton side="left" onClick={() => step(-1)} />
                <NavButton side="right" onClick={() => step(1)} />
                <span className="absolute bottom-3 left-3 font-mono text-[10px] text-[#94A3B8] bg-bg/70 px-2 py-1">
                  {idx + 1} / {count}
                </span>
              </>
            )}
          </div>

          {count > 1 && (
            <div className="flex gap-1.5 p-2 overflow-x-auto">
              {media.map((item, i) => (
                <button
                  key={item.src}
                  type="button"
                  onClick={() => setIdx(i)}
                  aria-label={`Show media ${i + 1}`}
                  aria-current={i === idx}
                  className={`relative shrink-0 w-16 h-16 overflow-hidden border transition-all ${
                    i === idx ? 'border-accent opacity-100' : 'border-transparent opacity-50 hover:opacity-80'
                  }`}
                >
                  <img
                    src={item.type === 'video' ? item.poster : item.src}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  {item.type === 'video' && (
                    <FiPlay size={14} className="absolute inset-0 m-auto text-white drop-shadow" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Write-up */}
        <div className="p-6 sm:p-8 lg:max-h-[calc(74vh+5rem)] lg:overflow-y-auto">
          <div className="flex items-center gap-3">
            {project.logo && <img src={project.logo} alt="" className="w-10 h-10 object-contain" />}
            <span className="font-mono text-[10px] text-[#64748B] tracking-widest uppercase">
              {project.category} · {project.period || project.year}
            </span>
          </div>
          <h3 id={titleId} className="mt-3 pr-10 font-display text-2xl sm:text-3xl font-bold text-[#E2E8F0]">
            {project.title}
          </h3>
          <p className="mt-3 text-[#94A3B8] text-sm leading-relaxed">{project.description}</p>
          {project.longDescription && (
            <p className="mt-3 text-[#64748B] text-sm leading-relaxed">{project.longDescription}</p>
          )}

          {project.details && (
            <ul className="mt-5 space-y-2.5">
              {project.details.map(line => (
                <li key={line} className="flex gap-2 text-[#94A3B8] text-[13px] leading-relaxed">
                  <span className="text-accent/70 font-mono">›</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          )}

          <Tags tags={project.tags} className="mt-6" />
          <ProjectLinks project={project} />
        </div>
      </div>
    </motion.div>
  )
}

function NavButton({ side, onClick }) {
  const Icon = side === 'left' ? FiChevronLeft : FiChevronRight
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === 'left' ? 'Previous' : 'Next'}
      className={`absolute top-1/2 -translate-y-1/2 ${side === 'left' ? 'left-3' : 'right-3'} w-9 h-9 flex items-center justify-center bg-bg/80 border border-border text-[#94A3B8] hover:text-accent hover:border-accent/40 transition-colors`}
    >
      <Icon size={16} />
    </button>
  )
}

function ProjectLinks({ project }) {
  if (!project.github && !project.live) return null
  const linkClass =
    'flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest border border-border text-[#94A3B8] px-4 py-2 hover:border-accent/40 hover:text-accent transition-colors'
  return (
    <div className="mt-6 flex gap-3">
      {project.github && (
        <a href={project.github} target="_blank" rel="noopener noreferrer" className={linkClass}>
          <FiGithub size={12} /> GitHub
        </a>
      )}
      {project.live && (
        <a href={project.live} target="_blank" rel="noopener noreferrer" className={linkClass}>
          <FiExternalLink size={12} /> Live
        </a>
      )}
    </div>
  )
}
