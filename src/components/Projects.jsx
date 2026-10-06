import { useCallback, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { projects } from '../data/projects'
import FeaturedProject from './project/FeaturedProject'
import { ProjectCard, ComingSoonCard } from './project/ProjectCard'
import ProjectLightbox from './project/ProjectLightbox'

const FILTERS = ['All', 'Hardware', 'Software']

export default function Projects() {
  const [active, setActive] = useState('All')
  const [lightbox, setLightbox] = useState(null) // { project, index }

  const openLightbox = useCallback((project, index) => setLightbox({ project, index }), [])
  const closeLightbox = useCallback(() => setLightbox(null), [])

  const matches = p => active === 'All' || p.category === active.toLowerCase()
  const featured = projects.find(p => p.featured)
  const grid = projects.filter(p => p !== featured && matches(p))

  return (
    <section id="projects" className="px-6 pb-28 scroll-mt-20">
      <div className="max-w-6xl mx-auto">

        <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-accent/50 tracking-[0.25em] uppercase">01</span>
            <span className="w-8 h-px bg-accent/20" />
            <span className="font-mono text-[10px] text-[#64748B] tracking-[0.25em] uppercase">selected work</span>
          </div>
          <div className="flex gap-2" role="group" aria-label="Filter projects">
            {FILTERS.map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setActive(f)}
                aria-pressed={active === f}
                className={`font-mono text-[10px] px-3 py-1.5 border transition-all duration-200 tracking-widest uppercase ${
                  active === f
                    ? 'border-accent/50 text-accent bg-accent/5'
                    : 'border-border text-[#64748B] hover:border-[#475569] hover:text-[#94A3B8]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {featured && matches(featured) && <FeaturedProject project={featured} onOpen={openLightbox} />}

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {grid.map(project =>
              project.comingSoon
                ? <ComingSoonCard key={project.id} project={project} />
                : <ProjectCard key={project.id} project={project} onOpen={openLightbox} />
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <ProjectLightbox
            key={lightbox.project.id}
            project={lightbox.project}
            startIndex={lightbox.index}
            onClose={closeLightbox}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
