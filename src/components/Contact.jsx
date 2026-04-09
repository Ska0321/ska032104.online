import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiMail, FiSend } from 'react-icons/fi'

const SOCIALS = [
  {
    icon: FiGithub,
    label: 'GitHub',
    href: 'https://github.com/Ska0321',
    handle: '@Ska0321',
  },
  {
    icon: FiLinkedin,
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/alexclc',
    handle: 'linkedin.com/in/alexclc',
  },
  {
    icon: FiMail,
    label: 'Email',
    href: 'mailto:alexchen032104@gmail.com',
    handle: 'alexchen032104@gmail.com',
  },
]

export default function Contact() {
  const [form,   setForm]   = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('sent')
        setForm({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const inputCls = [
    'w-full bg-[#0C1018] border border-[#1A2236] text-[#E2E8F0]',
    'placeholder-[#1E293B] px-4 py-3 text-sm font-mono',
    'focus:outline-none focus:border-accent/40 focus:bg-[#0D1320]',
    'transition-all duration-200',
  ].join(' ')

  return (
    <section id="contact" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Section label */}
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono text-[10px] text-accent/50 tracking-[0.25em] uppercase">03</span>
          <span className="w-8 h-px bg-accent/20" />
          <span className="font-mono text-[10px] text-[#475569] tracking-[0.25em] uppercase">contact</span>
        </div>
        <h2 className="font-display text-4xl font-bold tracking-tight text-[#E2E8F0]">
          Get In Touch
        </h2>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Left */}
          <div>
            <h3 className="font-display text-2xl font-bold text-[#E2E8F0]">
              Let's build{' '}
              <span className="text-accent">something</span>.
            </h3>
            <p className="mt-4 text-[#475569] leading-relaxed max-w-sm font-light">
              Whether it's a hardware system, an embedded device, an AI application, or
              anything in between — I'm always open to interesting problems.
            </p>

            <div className="mt-10 space-y-4">
              {SOCIALS.map(({ icon: Icon, label, href, handle }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 border border-[#1A2236] flex items-center justify-center text-[#475569] group-hover:border-accent/40 group-hover:text-accent transition-all duration-200">
                    <Icon size={15} />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#64748B]">
                      {label}
                    </p>
                    <p className="font-mono text-sm text-[#475569] group-hover:text-[#64748B] transition-colors duration-200">
                      {handle}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Name"
              required
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className={inputCls}
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className={inputCls}
            />
            <textarea
              placeholder="Message"
              required
              rows={6}
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              className={`${inputCls} resize-none`}
            />

            <button
              type="submit"
              disabled={status === 'sending' || status === 'sent'}
              className="flex items-center gap-2 px-6 py-3 bg-accent text-bg font-semibold text-sm hover:bg-[#00C49C] disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 glow-accent"
            >
              <FiSend size={13} />
              {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Sent!' : 'Send Message'}
            </button>

            {status === 'error' && (
              <p className="font-mono text-xs text-red-500/80">
                Something went wrong. Try emailing directly at alexchen032104@gmail.com
              </p>
            )}
            {status === 'sent' && (
              <p className="font-mono text-xs text-accent/80">
                Message sent — I'll get back to you soon.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
