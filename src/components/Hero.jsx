import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiMail, FiDownload } from 'react-icons/fi'

const SOCIALS = [
  { icon: FiGithub,   href: 'https://github.com/Ska0321',             label: 'GitHub'   },
  { icon: FiLinkedin, href: 'https://linkedin.com/in/alexclc',        label: 'LinkedIn' },
  { icon: FiMail,     href: 'mailto:alexchen032104@gmail.com',        label: 'Email'    },
]

const up = (delay = 0) => ({
  initial:    { opacity: 0, y: 14 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
})

// Compact intro so the project showcase sits right below it on load.
export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-24 sm:pt-28 pb-8">
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <div className="absolute inset-0 bg-vignette pointer-events-none" />
      <div className="absolute -top-40 right-0 w-[520px] h-[420px] bg-accent/[0.05] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-5">
        <div>
          <motion.h1
            {...up(0.1)}
            className="font-display font-bold tracking-tight text-[#E2E8F0] text-3xl sm:text-4xl"
          >
            Alex Chen
          </motion.h1>
          <motion.p {...up(0.2)} className="mt-2 text-[#94A3B8] text-sm sm:text-base max-w-2xl leading-relaxed">
            Computer Engineering @ USC — IC design, hardware validation, embedded systems.
          </motion.p>
        </div>

        <motion.div {...up(0.3)} className="flex items-center gap-5 flex-wrap">
          {SOCIALS.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-[#64748B] hover:text-accent transition-colors duration-200"
            >
              <Icon size={18} />
            </a>
          ))}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] border border-accent/40 text-accent px-4 py-2 hover:bg-accent/10 hover:border-accent/70 transition-all duration-200"
          >
            <FiDownload size={12} /> CV
          </a>
          <span className="hidden lg:inline font-mono text-[10px] text-[#475569] tracking-[0.2em] uppercase">
            Open to IC design &amp; DV roles · 2027
          </span>
        </motion.div>
      </div>
    </section>
  )
}
