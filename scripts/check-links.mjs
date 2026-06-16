#!/usr/bin/env node
/**
 * Validates internal links in the production build (dist/).
 * Run after: npm run build
 */
import { readFileSync, existsSync, statSync, readdirSync } from 'fs'
import { join, dirname, resolve, relative } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const dist = join(root, 'dist')
const SITE_HOSTS = new Set(['pppoker.mn', 'www.pppoker.mn'])

const SKIP_PREFIXES = ['mailto:', 'tel:', 'javascript:', 'data:']
const SKIP_HOSTS = ['mc.yandex.ru', 'baatrynorpoker.ink', 't.me']

function walkHtmlFiles(dir, files = []) {
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, name.name)
    if (name.isDirectory()) walkHtmlFiles(path, files)
    else if (name.name.endsWith('.html')) files.push(path)
  }
  return files
}

function normalizeSitePath(raw, fromFile) {
  if (!raw || SKIP_PREFIXES.some(p => raw.startsWith(p))) return null
  if (raw.startsWith('#')) return null

  let url = raw.trim()
  let pathname = url

  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      const parsed = new URL(url)
      if (!SITE_HOSTS.has(parsed.hostname)) return null
      pathname = parsed.pathname || '/'
      if (parsed.search) pathname += parsed.search
    } catch {
      return null
    }
  } else if (url.startsWith('//')) {
    return null
  } else if (!url.startsWith('/')) {
    const base = dirname(relative(dist, fromFile))
    pathname = join('/', base, url).replace(/\\/g, '/')
  }

  pathname = pathname.split('#')[0]
  return pathname || '/'
}

function resolveDistFile(pathname) {
  const [pathPart, query] = pathname.split('?')
  let clean = pathPart
  if (clean.endsWith('/')) clean = clean.slice(0, -1) || '/'

  const candidates = []
  if (clean === '/' || clean === '') {
    candidates.push(join(dist, 'index.html'))
  } else {
    candidates.push(join(dist, clean, 'index.html'))
    candidates.push(join(dist, clean))
  }

  for (const file of candidates) {
    if (existsSync(file) && statSync(file).isFile()) {
      return { file, query: query || null }
    }
  }
  return null
}

function extractUrls(html) {
  const urls = []
  const hrefSrc = /\b(?:href|src)\s*=\s*["']([^"']+)["']/gi
  let match
  while ((match = hrefSrc.exec(html))) urls.push(match[1])

  const metaContent = /<meta[^>]+content\s*=\s*["']([^"']+)["']/gi
  while ((match = metaContent.exec(html))) {
    const val = match[1]
    if (val.startsWith('http') || val.startsWith('/')) urls.push(val)
  }
  return urls
}

function parseSitemapLocs(xml) {
  const locs = []
  const re = /<loc>([^<]+)<\/loc>/g
  let match
  while ((match = re.exec(xml))) locs.push(match[1].trim())
  return locs
}

function main() {
  if (!existsSync(dist)) {
    console.error('check-links: dist/ not found — run npm run build first')
    process.exit(1)
  }

  const htmlFiles = walkHtmlFiles(dist)
  const broken = []
  const checked = new Set()
  let total = 0
  let skippedExternal = 0

  for (const file of htmlFiles) {
    const html = readFileSync(file, 'utf8')
    const relFile = relative(root, file)

    for (const raw of extractUrls(html)) {
      if (raw.startsWith('http') && SKIP_HOSTS.some(h => raw.includes(h))) {
        skippedExternal++
        continue
      }

      const pathname = normalizeSitePath(raw, file)
      if (!pathname) {
        if (raw.startsWith('http')) skippedExternal++
        continue
      }

      const key = `${relFile} -> ${pathname}`
      if (checked.has(key)) continue
      checked.add(key)
      total++

      const resolved = resolveDistFile(pathname)
      if (!resolved) {
        broken.push({ from: relFile, href: raw, pathname })
      }
    }
  }

  const sitemapPath = join(dist, 'sitemap.xml')
  if (existsSync(sitemapPath)) {
    const locs = parseSitemapLocs(readFileSync(sitemapPath, 'utf8'))
    for (const loc of locs) {
      const pathname = normalizeSitePath(loc, sitemapPath)
      if (!pathname) continue
      const key = `sitemap -> ${pathname}`
      if (checked.has(key)) continue
      checked.add(key)
      total++
      if (!resolveDistFile(pathname)) {
        broken.push({ from: 'sitemap.xml', href: loc, pathname })
      }
    }
  }

  console.log(`check-links: ${total} internal URLs checked (${htmlFiles.length} HTML files)`)
  console.log(`check-links: ${skippedExternal} external URLs skipped`)

  if (broken.length) {
    console.error(`\ncheck-links: ${broken.length} broken link(s):\n`)
    for (const b of broken.slice(0, 30)) {
      console.error(`  ${b.from}\n    ${b.href}  →  ${b.pathname}`)
    }
    if (broken.length > 30) console.error(`  … and ${broken.length - 30} more`)
    process.exit(1)
  }

  console.log('check-links: OK')
}

main()
