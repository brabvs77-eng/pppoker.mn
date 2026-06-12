#!/usr/bin/env node
/**
 * Renders content/articles/*.md → articles/index.html + articles/{slug}/index.html
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const contentDir = join(root, 'content', 'articles')
const outDir = join(root, 'articles')

const TELEGRAM_PLAY = 'https://t.me/BatrynOrooSupport'
const ARTICLES = []

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) return { meta: {}, body: raw }
  const meta = {}
  for (const line of match[1].split('\n')) {
    const i = line.indexOf(':')
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim()
  }
  return { meta, body: match[2].trim() }
}

function inline(text) {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, u) => {
      const ext = u.startsWith('http') && !u.includes('pppoker.mn')
      return `<a href="${u}"${ext ? ' rel="noopener" target="_blank"' : ''}>${t}</a>`
    })
}

function mdToHtml(md) {
  const lines = md.split('\n')
  const out = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('<!--') || line === '---') {
      i++
      continue
    }

    if (line.startsWith('|')) {
      const rows = []
      while (i < lines.length && lines[i].startsWith('|')) {
        rows.push(lines[i])
        i++
      }
      if (rows.length >= 2) {
        const parseRow = r =>
          r
            .split('|')
            .slice(1, -1)
            .map(c => c.trim())
        const header = parseRow(rows[0])
        const bodyRows = rows.slice(2).map(parseRow)
        out.push('<div class="article-table-wrap"><table class="article-table"><thead><tr>')
        header.forEach(h => out.push(`<th>${inline(h)}</th>`))
        out.push('</tr></thead><tbody>')
        bodyRows.forEach(row => {
          out.push('<tr>')
          row.forEach(c => out.push(`<td>${inline(c)}</td>`))
          out.push('</tr>')
        })
        out.push('</tbody></table></div>')
      }
      continue
    }

    if (/^#{1,3} /.test(line)) {
      const level = line.match(/^#+/)[0].length
      const text = line.replace(/^#+\s*/, '')
      const tag = level === 1 ? 'h1' : level === 2 ? 'h2' : 'h3'
      const cls = level === 1 ? 'article-title' : level === 2 ? 'article-h2' : 'article-h3'
      out.push(`<${tag} class="${cls}">${inline(text)}</${tag}>`)
      i++
      continue
    }

    if (/^\d+\.\s/.test(line)) {
      out.push('<ol class="article-ol">')
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        out.push(`<li>${inline(lines[i].replace(/^\d+\.\s*/, ''))}</li>`)
        i++
      }
      out.push('</ol>')
      continue
    }

    if (line.startsWith('- ')) {
      out.push('<ul class="article-ul">')
      while (i < lines.length && lines[i].startsWith('- ')) {
        out.push(`<li>${inline(lines[i].slice(2))}</li>`)
        i++
      }
      out.push('</ul>')
      continue
    }

    if (line.trim() === '') {
      i++
      continue
    }

    out.push(`<p>${inline(line)}</p>`)
    i++
  }

  return out.join('\n')
}

function faviconHead() {
  return `  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />`
}

function metrikaHead() {
  return `  <script type="text/javascript">
    (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=109810225', 'ym');
    ym(109810225, 'init', {ssr:true, webvisor:true, clickmap:true, accurateTrackBounce:true, trackLinks:true});
  </script>`
}

function metrikaBody() {
  return `  <noscript><div><img src="https://mc.yandex.ru/watch/109810225" style="position:absolute; left:-9999px;" alt="" /></div></noscript>`
}

function nav() {
  return `  <header>
    <nav class="navbar" id="navbar" role="navigation" aria-label="Main navigation">
      <div class="container nav-container">
        <a href="/" class="nav-logo" aria-label="Baatryn Öröö Home">
          <span class="logo-icon">♠</span>
          <span class="logo-text">BAATRYN ÖRÖÖ</span>
        </a>
        <ul class="nav-links" id="navLinks">
          <li><a href="/#games">Тоглоомууд</a></li>
          <li><a href="/#features">Боломжууд</a></li>
          <li><a href="/articles/" class="active">Нийтлэл</a></li>
          <li><a href="/#academy">Академи</a></li>
          <li><a href="/#faq">FAQ</a></li>
        </ul>
        <div class="nav-right">
          <a href="${TELEGRAM_PLAY}" class="nav-btn" rel="noopener" target="_blank">Тоглох</a>
        </div>
        <button class="nav-toggle" id="navToggle" aria-label="Toggle menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  </header>`
}

function footer(articles) {
  const articleLinks = articles
    .map(a => `            <li><a href="/articles/${a.slug}/">${a.listTitle}</a></li>`)
    .join('\n')
  return `  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="nav-logo"><span class="logo-icon">♠</span><span class="logo-text">BAATRYN ÖRÖÖ</span></div>
          <p>Монголын покерын клуб. Онлайн покер — жинхэнэ тоглогчдын талбар.</p>
        </div>
        <div class="footer-links">
          <h4>Нийтлэл</h4>
          <ul>
${articleLinks}
          </ul>
        </div>
        <div class="footer-links">
          <h4>Холбоо</h4>
          <ul>
            <li><a href="https://t.me/BatrynOrooSupport" rel="noopener" target="_blank">@BatrynOrooSupport</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>♠ BAATRYN ÖRÖÖ — Ухаалгаар тогло, удаан ял.</p>
      </div>
    </div>
  </footer>`
}

function articlePage(article, allArticles) {
  const { slug, metaTitle, metaDesc, title, html } = article
  const url = `https://pppoker.mn/articles/${slug}/`
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: metaDesc,
    author: { '@type': 'Organization', name: 'Baatryn Öröö' },
    publisher: { '@type': 'Organization', name: 'Baatryn Öröö', url: 'https://pppoker.mn' },
    mainEntityOfPage: url,
    inLanguage: 'mn',
  })

  return `<!DOCTYPE html>
<html lang="mn">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${metaTitle}</title>
  <meta name="description" content="${metaDesc}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${url}" />
${faviconHead()}
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Baatryn Öröö" />
  <meta property="og:title" content="${metaTitle}" />
  <meta property="og:description" content="${metaDesc}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:locale" content="mn_MN" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/src/style.css" />
  <script type="application/ld+json">${jsonLd}</script>
${metrikaHead()}
</head>
<body>
${metrikaBody()}
  <a href="#main-content" class="skip-link">Skip to content</a>
${nav()}
  <main id="main-content" class="article-page">
    <div class="container">
      <nav class="article-breadcrumb" aria-label="Breadcrumb">
        <a href="/">Нүүр</a> <span>/</span> <a href="/articles/">Нийтлэл</a> <span>/</span> <span>${title}</span>
      </nav>
      <article class="article-body">
${html}
      </article>
      <div class="article-cta">
        <a href="${TELEGRAM_PLAY}" class="btn btn-primary" rel="noopener" target="_blank">Одоо тоглох →</a>
        <a href="/articles/" class="btn btn-outline">Бусад нийтлэл</a>
      </div>
    </div>
  </main>
${footer(allArticles)}
  <script type="module" src="/src/article-page.js"></script>
</body>
</html>`
}

function indexPage(articles) {
  const cards = articles
    .map(
      a => `        <a href="/articles/${a.slug}/" class="article-card">
          <span class="article-card-tag">Покер</span>
          <h2>${a.title}</h2>
          <p>${a.metaDesc}</p>
          <span class="article-card-link">Унших →</span>
        </a>`
    )
    .join('\n')

  return `<!DOCTYPE html>
<html lang="mn">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Покер нийтлэл | Baatryn Öröö — онлайн покер Монгол</title>
  <meta name="description" content="Онлайн покер Монгол: монгол покер систем, татах заавар, хаана тоглох. Baatryn Öröö покерын нийтлэлүүд." />
  <link rel="canonical" href="https://pppoker.mn/articles/" />
${faviconHead()}
  <meta property="og:title" content="Покер нийтлэл — Baatryn Öröö" />
  <meta property="og:url" content="https://pppoker.mn/articles/" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/src/style.css" />
${metrikaHead()}
</head>
<body>
${metrikaBody()}
  <a href="#main-content" class="skip-link">Skip to content</a>
${nav()}
  <main id="main-content" class="article-page">
    <div class="container">
      <header class="article-index-header">
        <h1 class="article-title">Покер <span class="gold">нийтлэл</span></h1>
        <p class="article-index-desc">Онлайн покер Монгол — заавар, систем, хаана тоглох. Baatryn Öröö клубын мэдээлэл.</p>
      </header>
      <div class="article-grid">
${cards}
      </div>
    </div>
  </main>
${footer(articles)}
  <script type="module" src="/src/article-page.js"></script>
</body>
</html>`
}

// Load markdown files
const files = readdirSync(contentDir).filter(f => f.endsWith('.md') && f !== 'README.md')

for (const file of files) {
  const raw = readFileSync(join(contentDir, file), 'utf8')
  const { meta, body } = parseFrontmatter(raw)
  const slug = meta.Slug || file.replace('.md', '')
  const h1 = body.match(/^# (.+)$/m)?.[1] || slug
  ARTICLES.push({
    slug,
    metaTitle: meta['Meta Title'] || h1,
    metaDesc: meta['Meta Description'] || '',
    title: h1,
    listTitle: meta['List Title'] || h1.replace(/\|.*/, '').trim().slice(0, 40),
    html: mdToHtml(body),
  })
}

mkdirSync(outDir, { recursive: true })

for (const article of ARTICLES) {
  const dir = join(outDir, article.slug)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), articlePage(article, ARTICLES))
}

writeFileSync(join(outDir, 'index.html'), indexPage(ARTICLES))

console.log(`Built ${ARTICLES.length} articles → articles/`)
