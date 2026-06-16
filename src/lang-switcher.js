import { setLang } from './i18n.js'

export function initLangSwitcherDropdown({ onSelect } = {}) {
  const btn = document.getElementById('langBtn')
  const menu = document.getElementById('langMenu')
  if (!btn || !menu) return

  btn.addEventListener('click', e => {
    e.stopPropagation()
    const open = menu.classList.toggle('open')
    btn.setAttribute('aria-expanded', open)
  })

  menu.querySelectorAll('[data-lang]').forEach(el => {
    el.addEventListener('click', e => {
      const lang = el.getAttribute('data-lang')
      if (!lang) return

      if (el.tagName === 'BUTTON') {
        e.preventDefault()
        if (onSelect) onSelect(lang)
        else setLang(lang)
      } else {
        setLang(lang)
      }

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
