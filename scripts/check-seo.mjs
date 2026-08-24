#!/usr/bin/env node
/**
 * SEO validation for built HTML (dist/).
 * Run after: npm run build
 */
import { readFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dist = join(__dirname, '..', 'dist')
const FALLBACK_OG = 'https://pppoker.mn/images/og-cover.jpg'

const errors = []
const warnings = []

function walkHtml(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) walkHtml(path, files)
    else if (entry.name.endsWith('.html')) files.push(path)
  }
  return files
}

function metaContent(html, pattern) {
  const m = html.match(pattern)
  return m ? m[1].trim() : ''
}

function checkFile(file) {
  const rel = file.replace(dist, '').replace(/\\/g, '/') || '/'
  const html = readFileSync(file, 'utf8')
  const isArticle = /\/articles\/[^/]+\/index\.html$/.test(rel)
  const isHub = /\/articles\/index\.html$/.test(rel)

  const title = metaContent(html, /<title>([^<]*)<\/title>/)
  const description = metaContent(html, /<meta name="description" content="([^"]*)"/)
  const canonical = metaContent(html, /<link rel="canonical" href="([^"]*)"/)
  const ogImage = metaContent(html, /<meta property="og:image" content="([^"]*)"/)
  const ogImageAlt = metaContent(html, /<meta property="og:image:alt" content="([^"]*)"/)
  const ogDesc = metaContent(html, /<meta property="og:description" content="([^"]*)"/)
  const twitterCard = metaContent(html, /<meta name="twitter:card" content="([^"]*)"/)
  const twitterTitle = metaContent(html, /<meta name="twitter:title" content="([^"]*)"/)
  const twitterDesc = metaContent(html, /<meta name="twitter:description" content="([^"]*)"/)
  const twitterImageAlt = metaContent(html, /<meta name="twitter:image:alt" content="([^"]*)"/)
  const hreflangCount = (html.match(/rel="alternate" hreflang="/g) || []).length

  if (!title) errors.push(`${rel}: missing <title>`)
  if (!description) errors.push(`${rel}: missing meta description`)
  if (!canonical) errors.push(`${rel}: missing canonical`)
  if (!ogImage) errors.push(`${rel}: missing og:image`)
  if (!ogImageAlt) warnings.push(`${rel}: missing og:image:alt`)
  if (!twitterCard) errors.push(`${rel}: missing twitter:card`)

  if (isArticle || isHub || rel === '/about/' || rel === '/index.html') {
    if (!twitterTitle) errors.push(`${rel}: missing twitter:title`)
    if (!twitterDesc && !isHub) errors.push(`${rel}: missing twitter:description`)
    if (isHub && !ogDesc) errors.push(`${rel}: missing og:description`)
  }

  if (isArticle) {
    if (ogImage === FALLBACK_OG) {
      const hasMnCover = /\/images\/articles\//.test(html)
      if (hasMnCover) {
        warnings.push(`${rel}: og:image fallback but article has cover image in body`)
      }
    }
    if (!twitterImageAlt) warnings.push(`${rel}: missing twitter:image:alt`)
    if (hreflangCount < 2 && !html.includes('article-group-id')) {
      warnings.push(`${rel}: few hreflang links (${hreflangCount})`)
    }
    const emptyAlts = [...html.matchAll(/<img[^>]+alt=""/g)]
    const decorative = emptyAlts.filter(m => !m[0].includes('yandex'))
    if (decorative.length) warnings.push(`${rel}: ${decorative.length} img with empty alt`)
  }
}

const files = walkHtml(dist)
for (const file of files) checkFile(file)

console.log(`check-seo: ${files.length} HTML files scanned`)

if (warnings.length) {
  console.log(`check-seo: ${warnings.length} warning(s)`)
  for (const w of warnings.slice(0, 20)) console.log(`  warn: ${w}`)
  if (warnings.length > 20) console.log(`  ... and ${warnings.length - 20} more`)
}

if (errors.length) {
  console.error(`check-seo: ${errors.length} error(s)`)
  for (const e of errors) console.error(`  error: ${e}`)
  process.exit(1)
}

console.log('check-seo: OK')
