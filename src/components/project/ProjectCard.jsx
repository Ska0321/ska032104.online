import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { FiImage, FiPlay } from 'react-icons/fi'
import MediaTile from './MediaTile'

const cardMotion = {
  layout: true,
  initial: { opacity: 0, scale: 0.96, y: 12 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
}

export function Tags({ tags, className = '' }) {
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {tags.map(tag => (
        <span
          key={tag}
          className="font-mono text-[10px] px-2 py-1 bg-surface border border-border text-[#64748B]"
        >
          {tag}
        </span>
      ))}
    </div>
  )
}

/* ─── Media card: cover image/video, opens the lightbox ─────────────── */
// forwardRef: AnimatePresence mode="popLayout" measures cards through a ref
export const ProjectCard = forwardRef(function ProjectCard({ project, onOpen }, ref) {
  const cover = project.media[0]
  const videoCount = project.media.filter(m => m.type === 'video').length
  const photoCount = project.media.length - videoCount

  return (
    <motion.article ref={ref} {...cardMotion} className="group glass overflow-hidden flex flex-col">
      <button
        type="button"
        onClick={() => onOpen(project, 0)}
        aria-label={`Open ${project.title} gallery`}
        className="text-left flex flex-col flex-1 focus-visible:outline focus-visible:outline-1 focus-visible:outline-accent"
      >
        <div className="relative aspect-[4/5] bg-[#070C14] overflow-hidden">
          <MediaTile
            item={cover}
            alt={`${project.title} cover`}
            className="opacity-90 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-500"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg/80 to-transparent pointer-events-none" />
          <div className="absolute top-3 right-3 flex gap-1.5">
            {videoCount > 0 && <CountBadge icon={FiPlay} count={videoCount} />}
            {photoCount > 1 && <CountBadge icon={FiImage} count={photoCount} />}
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-accent/50" />
            <span className="font-mono text-[10px] text-[#64748B] tracking-widest uppercase">
              {project.category} · {project.period || project.year}
            </span>
          </div>
          <h3 className="font-display text-[#CBD5E1] font-semibold text-lg group-hover:text-accent transition-colors duration-200">
            {project.title}
          </h3>
          <p className="mt-2 text-[#64748B] text-xs leading-relaxed line-clamp-3">
            {project.description}
          </p>
          <Tags tags={project.tags.slice(0, 5)} className="mt-4" />
        </div>
      </button>
    </motion.article>
  )
})

function CountBadge({ icon: Icon, count }) {
  return (
    <span className="flex items-center gap-1 font-mono text-[10px] px-2 py-1 bg-bg/75 backdrop-blur border border-white/10 text-[#CBD5E1]">
      <Icon size={10} /> {count}
    </span>
  )
}

/* ─── Placeholder for unreleased projects ───────────────────────────── */
export const ComingSoonCard = forwardRef(function ComingSoonCard({ project }, ref) {
  return (
    <motion.article ref={ref} {...cardMotion} className="glass p-6 flex flex-col opacity-60 hover:opacity-80 transition-opacity">
      <div className="flex items-center justify-between mb-5">
        <span className="font-mono text-[10px] text-[#475569] tracking-widest">{project.year}</span>
        <span className="font-mono text-[9px] px-2 py-0.5 border border-border text-[#475569] tracking-widest uppercase">
          Coming Soon
        </span>
      </div>
      <h3 className="font-display text-[#64748B] font-semibold text-lg">{project.title}</h3>
      <p className="mt-2 text-[#475569] text-xs leading-relaxed">{project.description}</p>
    </motion.article>
  )
})
