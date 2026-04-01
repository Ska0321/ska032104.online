import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { label: 'Projects', href: '#projects' },
  { label: 'Resume',   href: '#resume'   },
  { label: 'Contact',  href: '#contact'  },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#07090F]/80 backdrop-blur-xl border-b border-white/[0.04]'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="font-mono text-sm tracking-widest hover:text-accent transition-colors duration-200">
          <span className="text-accent">ska</span>032104
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#4A5568] hover:text-[#E2E8F0] transition-colors duration-200"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] uppercase tracking-[0.15em] border border-accent/40 text-accent px-4 py-2 hover:bg-accent/10 hover:border-accent/70 transition-all duration-200"
            >
              CV
            </a>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(v => !v)}
          aria-label="Toggle menu"
          className="md:hidden flex flex-col gap-[5px] p-1"
        >
          {[
            open ? { rotate: 45, y: 7 }  : { rotate: 0, y: 0 },
            open ? { opacity: 0 }        : { opacity: 1 },
            open ? { rotate: -45, y: -7 }: { rotate: 0, y: 0 },
          ].map((anim, i) => (
            <motion.span
              key={i}
              animate={anim}
              transition={{ duration: 0.2 }}
              className="block w-5 h-px bg-[#4A5568]"
            />
          ))}
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden bg-[#07090F]/95 backdrop-blur-xl border-t border-white/[0.04]"
          >
            <ul className="flex flex-col px-6 py-6 gap-5">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="font-mono text-sm uppercase tracking-widest text-[#4A5568] hover:text-[#E2E8F0] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
