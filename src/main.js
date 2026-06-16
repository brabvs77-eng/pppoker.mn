import { translations, getLang, setLang, t } from './i18n.js'
import { applyFaqSchema } from './faq-schema.js'
import { articlePath, articlesHubPath } from './article-routes.js'
import { syncLangInUrl, updateOgLocale } from './lang-url.js'

function getNestedValue(obj, path) {
  return path.split('.').reduce((o, k) => o && o[k], obj)
}

function updateArticleLinks(lang) {
  document.querySelectorAll('[data-article-group]').forEach(el => {
    const groupId = el.getAttribute('data-article-group')
    const path = articlePath(groupId, lang)
    if (path) el.setAttribute('href', path)
  })
  document.querySelectorAll('[data-articles-hub]').forEach(el => {
    el.setAttribute('href', articlesHubPath(lang))
  })
}

function applyTranslations(lang) {
  const tr = t(lang)
  document.documentElement.lang = lang
  document.title = tr.meta.title

  const metaDesc = document.querySelector('meta[name="description"]')
  if (metaDesc) metaDesc.content = tr.meta.description
  const metaKw = document.querySelector('meta[name="keywords"]')
  if (metaKw) metaKw.content = tr.meta.keywords

  const ogTitle = document.querySelector('meta[property="og:title"]')
  if (ogTitle) ogTitle.content = tr.meta.ogTitle
  const ogDesc = document.querySelector('meta[property="og:description"]')
  if (ogDesc) ogDesc.content = tr.meta.ogDesc
  const twTitle = document.querySelector('meta[name="twitter:title"]')
  if (twTitle) twTitle.content = tr.meta.ogTitle
  const twDesc = document.querySelector('meta[name="twitter:description"]')
  if (twDesc) twDesc.content = tr.meta.ogDesc

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n')
    const val = getNestedValue(tr, key)
    if (val) el.textContent = val
  })

  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html')
    const val = getNestedValue(tr, key)
    if (val) el.innerHTML = val
  })

  const langLabel = document.getElementById('langLabel')
  if (langLabel) langLabel.textContent = tr.langName

  updateArticleLinks(lang)
  updateOgLocale(lang)
  applyFaqSchema(lang)
}

function switchLang(lang) {
  if (!translations[lang]) return
  setLang(lang)
  applyTranslations(lang)
  syncLangInUrl(lang)
}

function initLangSwitcher() {
  const btn = document.getElementById('langBtn')
  const menu = document.getElementById('langMenu')
  if (!btn || !menu) return

  btn.addEventListener('click', e => {
    e.stopPropagation()
    const open = menu.classList.toggle('open')
    btn.setAttribute('aria-expanded', open)
  })

  menu.querySelectorAll('button[data-lang]').forEach(b => {
    b.addEventListener('click', () => {
      switchLang(b.getAttribute('data-lang'))
      menu.classList.remove('open')
      btn.setAttribute('aria-expanded', 'false')
    })
  })

  document.addEventListener('click', e => {
    if (!e.target.closest('.lang-switcher')) {
      menu.classList.remove('open')
      btn.setAttribute('aria-expanded', 'false')
    }
  })
}

function initNavbar() {
  const navbar = document.getElementById('navbar')
  const navToggle = document.getElementById('navToggle')
  const navLinks = document.getElementById('navLinks')
  if (!navbar || !navToggle || !navLinks) return

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50)
  })

  navToggle.addEventListener('click', () => {
    const active = navLinks.classList.toggle('active')
    navToggle.setAttribute('aria-expanded', active)
  })

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active')
      navToggle.setAttribute('aria-expanded', 'false')
    })
  })
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'))
      if (!target) return
      e.preventDefault()
      const y = target.getBoundingClientRect().top + window.pageYOffset - 80
      window.scrollTo({ top: y, behavior: 'smooth' })
    })
  })
}

function initSlider() {
  const track = document.getElementById('sliderTrack')
  const dotsContainer = document.getElementById('sliderDots')
  const prevBtn = document.getElementById('sliderPrev')
  const nextBtn = document.getElementById('sliderNext')
  if (!track) return

  const slides = track.querySelectorAll('.slide')
  const total = slides.length
  let current = 0
  let autoTimer

  for (let i = 0; i < total; i++) {
    const dot = document.createElement('button')
    dot.classList.add('slider-dot')
    dot.setAttribute('role', 'tab')
    dot.setAttribute('aria-label', `Slide ${i + 1}`)
    if (i === 0) dot.classList.add('active')
    dot.addEventListener('click', () => goTo(i))
    dotsContainer.appendChild(dot)
  }

  function goTo(index) {
    current = ((index % total) + total) % total
    track.style.transform = `translateX(-${current * 100}%)`
    dotsContainer.querySelectorAll('.slider-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current)
    })
  }

  prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto() })
  nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto() })

  function resetAuto() {
    clearInterval(autoTimer)
    autoTimer = setInterval(() => goTo(current + 1), 5000)
  }

  resetAuto()

  let startX = 0
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX }, { passive: true })
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      diff > 0 ? goTo(current + 1) : goTo(current - 1)
      resetAuto()
    }
  }, { passive: true })
}

function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible')
    })
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })

  document.querySelectorAll(
    '.game-card, .feature-card, .academy-card, .movie-card, .step, .faq-item, .table-item, .slide'
  ).forEach(el => {
    el.classList.add('fade-up')
    observer.observe(el)
  })
}

function initFromURL() {
  const params = new URLSearchParams(window.location.search)
  const urlLang = params.get('lang')
  if (urlLang && translations[urlLang]) {
    setLang(urlLang)
    return urlLang
  }
  const stored = getLang()
  if (stored !== 'mn') {
    syncLangInUrl(stored)
  }
  return stored
}

document.addEventListener('DOMContentLoaded', () => {
  const lang = initFromURL()
  applyTranslations(lang)
  initLangSwitcher()
  initNavbar()
  initSmoothScroll()
  initSlider()
  initAnimations()
})
