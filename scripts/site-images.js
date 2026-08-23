/** Shared image paths, alt text, and social meta fragments */
export const SITE = 'https://pppoker.mn'

export const LOGO = {
  src: '/images/logo.webp',
  alt: 'Baatryn Öröö — PPPoker Mongolia',
  width: 40,
  height: 40,
}

export const FLAG_MN = {
  src: '/images/flags/mn.svg',
  alt: 'Mongolia flag',
  width: 22,
  height: 15,
}

export const OG_COVER = {
  src: '/images/og-cover.jpg',
  url: `${SITE}/images/og-cover.jpg`,
  width: 1600,
  height: 900,
  alt: 'Baatryn Öröö — online poker club in Mongolia',
}

export const SLIDES = [
  { src: '/images/slide-comfort.webp', altKey: 'slider.s1', width: 1600, height: 900 },
  { src: '/images/slide-players.webp', altKey: 'slider.s2', width: 1600, height: 900 },
  { src: '/images/slide-crypto.webp', altKey: 'slider.s3', width: 1600, height: 900 },
  { src: '/images/slide-support.webp', altKey: 'slider.s4', width: 1600, height: 900 },
  { src: '/images/slide-psychology.webp', altKey: 'slider.s5', width: 1600, height: 900 },
  { src: '/images/slide-security.webp', altKey: 'slider.s6', width: 1600, height: 900 },
]

export function logoImgTag({ fetchPriority, className = 'logo-img' } = {}) {
  const fp = fetchPriority ? ` fetchpriority="${fetchPriority}"` : ''
  return `<img src="${LOGO.src}" alt="${LOGO.alt}" class="${className}" width="${LOGO.width}" height="${LOGO.height}" decoding="async"${fp} />`
}

export function preloadHead() {
  return `  <link rel="preload" href="${LOGO.src}" as="image" type="image/webp" />
  <link rel="preload" href="${SLIDES[0].src}" as="image" type="image/webp" />`
}

export function articleCoverUrl(src) {
  if (!src) return OG_COVER.url
  if (src.startsWith('http')) return src
  return `${SITE}${src.startsWith('/') ? src : `/${src}`}`
}

export function resolveOgImage(alt, coverSrc) {
  if (!coverSrc) return { ...OG_COVER, alt: alt || OG_COVER.alt }
  return {
    src: coverSrc,
    url: articleCoverUrl(coverSrc),
    width: 1600,
    height: 900,
    alt: alt || OG_COVER.alt,
  }
}

export function ogImageMeta(alt = OG_COVER.alt, coverSrc) {
  const image = resolveOgImage(alt, coverSrc)
  const safeAlt = escAttr(image.alt)
  return `  <meta property="og:image" content="${image.url}" />
  <meta property="og:image:width" content="${image.width}" />
  <meta property="og:image:height" content="${image.height}" />
  <meta property="og:image:alt" content="${safeAlt}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="${image.url}" />
  <meta name="twitter:image:alt" content="${safeAlt}" />`
}

function escAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
}
