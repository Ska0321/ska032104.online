import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiMail, FiArrowDown } from 'react-icons/fi'

const SOCIALS = [
  { icon: FiGithub,   href: 'https://github.com/Ska0321',           label: 'GitHub'   },
  { icon: FiLinkedin, href: 'https://linkedin.com/in/yourusername', label: 'LinkedIn' },
  { icon: FiMail,     href: 'mailto:your@email.com',                label: 'Email'    },
]

const up = (delay = 0) => ({
  initial:    { opacity: 0, y: 28 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-start justify-center overflow-hidden px-6 pt-24">

      {/* --- Background layers --- */}
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <div className="absolute inset-0 bg-vignette pointer-events-none" />

      {/* Teal glow — top-right */}
      <div className="absolute -top-32 right-0 w-[640px] h-[640px] bg-accent/[0.05] rounded-full blur-[140px] pointer-events-none animate-pulse-slow" />
      {/* Secondary glow — bottom-left */}
      <div className="absolute bottom-0 -left-32 w-[400px] h-[400px] bg-accent/[0.03] rounded-full blur-[100px] pointer-events-none" />

      {/* Decorative large background text */}
      <span
        aria-hidden="true"
        className="absolute right-6 top-1/2 -translate-y-1/2 font-display font-bold text-[20vw] leading-none text-white/[0.015] select-none pointer-events-none hidden lg:block"
      >
        &lt;/&gt;
      </span>

      {/* --- Content --- */}
      <div className="relative z-10 max-w-6xl w-full mx-auto">

        {/* Terminal tag */}
        <motion.p {...up(0.15)} className="font-mono text-accent text-sm tracking-[0.25em]">
          &lt; hello world /&gt;
        </motion.p>

        {/* Name */}
        <motion.h1
          {...up(0.3)}
          className="mt-5 font-display font-bold leading-[0.9] tracking-tight text-[#E2E8F0]"
          style={{ fontSize: 'clamp(3.5rem, 9vw, 7rem)' }}
        >
          Your Name {/* ← replace */}
        </motion.h1>

        {/* Title ghost */}
        <motion.h2
          {...up(0.45)}
          className="mt-3 font-display font-bold leading-[0.95] tracking-tight text-[#1A2236]"
          style={{ fontSize: 'clamp(2rem, 5.5vw, 4.5rem)' }}
        >
          Software &amp; Hardware
          <br />Engineer.
        </motion.h2>

        {/* Bio */}
        <motion.p
          {...up(0.6)}
          className="mt-8 text-[#64748B] text-lg max-w-[480px] leading-relaxed font-light"
        >
          Building at the intersection of software and silicon — from embedded
          firmware to full-stack applications.
        </motion.p>

        {/* CTAs */}
        <motion.div {...up(0.75)} className="mt-10 flex flex-wrap gap-3">
          <a
            href="#projects"
            className="relative px-7 py-3 bg-accent text-bg font-semibold text-sm tracking-wide hover:bg-[#00C49C] transition-colors duration-200 glow-accent"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="px-7 py-3 border border-[#1A2236] text-[#64748B] text-sm tracking-wide hover:border-[#2D3748] hover:text-[#E2E8F0] transition-all duration-200"
          >
            Contact Me
          </a>
        </motion.div>

        {/* Social links */}
        <motion.div {...up(0.9)} className="mt-12 flex items-center gap-6">
          {SOCIALS.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-[#1E293B] hover:text-accent transition-colors duration-200"
            >
              <Icon size={19} />
            </a>
          ))}
          <span className="w-px h-4 bg-[#1A2236]" />
          <span className="font-mono text-[10px] text-[#1E293B] tracking-[0.2em] uppercase">
            Available for work
          </span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#1A2236]"
      >
        <span className="font-mono text-[9px] tracking-[0.4em] uppercase">scroll</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <FiArrowDown size={12} />
        </motion.div>
      </motion.div>
    </section>
  )
}
