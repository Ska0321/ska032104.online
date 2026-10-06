import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

const VISIBLE_THRESHOLD = 0.5

// Muted, looping video that plays only while at least half of it is on screen.
// With reduced motion enabled it never autoplays and shows native controls instead.
export default function AutoplayVideo({ src, poster, className = '', controls = false, label }) {
  const ref = useRef(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const video = ref.current
    if (!video || reduceMotion) return undefined

    // iOS only allows autoplay when the element is muted at play() time
    video.muted = true

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Rejected when the browser blocks autoplay (e.g. iOS Low Power Mode) — the poster stays up
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: VISIBLE_THRESHOLD },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [reduceMotion, src])

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      controls={controls || reduceMotion}
      aria-label={label}
      className={className}
    />
  )
}
