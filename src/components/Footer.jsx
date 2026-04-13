import { FiGithub, FiLinkedin } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="border-t border-[#1A2236] px-6 py-10">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-mono text-[10px] text-[#475569] tracking-widest">
          © {new Date().getFullYear()} ska032104
        </p>
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/Ska0321"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-[#475569] hover:text-accent transition-colors duration-200"
          >
            <FiGithub size={14} />
          </a>
          <a
            href="https://linkedin.com/in/alexclc"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-[#475569] hover:text-accent transition-colors duration-200"
          >
            <FiLinkedin size={14} />
          </a>
        </div>
      </div>
    </footer>
  )
}
