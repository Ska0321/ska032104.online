import AutoplayVideo from './AutoplayVideo'

// One image or video filling its container. `fit` is 'cover' for cards, 'contain' for the lightbox.
export default function MediaTile({ item, alt, fit = 'cover', controls = false, className = '' }) {
  const fitClass = fit === 'contain' ? 'object-contain' : 'object-cover'
  const classes = `w-full h-full ${fitClass} ${className}`

  if (item.type === 'video') {
    return (
      <AutoplayVideo
        src={item.src}
        poster={item.poster}
        controls={controls}
        label={alt}
        className={classes}
      />
    )
  }

  return <img src={item.src} alt={alt} loading="lazy" decoding="async" className={classes} />
}
