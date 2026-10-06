import { motion } from 'framer-motion'
import { FiMaximize2 } from 'react-icons/fi'
import MediaTile from './MediaTile'
import { Tags } from './ProjectCard'

const MOSAIC_SIZE = 3
const MAX_DETAILS = 3

// Wide lead card: a 3-tile media mosaic (first tile tall) beside the write-up.
export default function FeaturedProject({ project, onOpen }) {
  const tiles = project.media.slice(0, MOSAIC_SIZE)
  const hidden = project.media.length - tiles.length

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="glass overflow-hidden grid grid-cols-1 lg:grid-cols-[1.25fr_1fr]"
    >
      <div className="grid grid-cols-2 grid-rows-2 gap-1 h-[380px] sm:h-[440px] lg:h-[500px] bg-[#070C14]">
        {tiles.map((item, i) => (
          <button
            key={item.src}
            type="button"
            onClick={() => onOpen(project, i)}
            aria-label={`Open ${project.title} media ${i + 1}`}
            className={`relative overflow-hidden group ${i === 0 ? 'row-span-2' : ''}`}
          >
            <MediaTile
              item={item}
              alt={`${project.title} ${i + 1}`}
              className="group-hover:scale-[1.03] transition-transform duration-500"
            />
            {i === tiles.length - 1 && hidden > 0 && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/60 font-mono text-2xl text-[#E2E8F0] tracking-widest">
                +{hidden}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="p-6 sm:p-8 lg:p-10 flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-accent tracking-[0.25em] uppercase border border-accent/30 px-2 py-0.5">
            Featured
          </span>
          <span className="font-mono text-[10px] text-[#64748B] tracking-widest uppercase">
            {project.category} · {project.period || project.year}
          </span>
        </div>
        <h3 className="mt-4 font-display text-3xl font-bold text-[#E2E8F0]">{project.title}</h3>
        <p className="mt-3 text-[#94A3B8] text-sm leading-relaxed">{project.description}</p>

        {project.details && (
          <ul className="mt-5 space-y-2">
            {project.details.slice(0, MAX_DETAILS).map(line => (
              <li key={line} className="flex gap-2 text-[#64748B] text-xs leading-relaxed">
                <span className="text-accent/60 font-mono">›</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        )}

        <Tags tags={project.tags} className="mt-6" />

        <button
          type="button"
          onClick={() => onOpen(project, 0)}
          className="mt-auto pt-6 self-start flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-accent hover:text-[#E2E8F0] transition-colors"
        >
          <FiMaximize2 size={12} /> View all {project.media.length} photos &amp; videos
        </button>
      </div>
    </motion.article>
  )
}
