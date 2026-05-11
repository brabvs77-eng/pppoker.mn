const navbar = document.getElementById('navbar')
const navToggle = document.getElementById('navToggle')
const navLinks = document.getElementById('navLinks')

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50)
})

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active')
})

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active')
  })
})

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'))
    if (!target) return
    e.preventDefault()
    const offset = 80
    const y = target.getBoundingClientRect().top + window.pageYOffset - offset
    window.scrollTo({ top: y, behavior: 'smooth' })
  })
})

const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible')
    }
  })
}, observerOptions)

document.querySelectorAll(
  '.game-card, .feature-card, .academy-card, .movie-card, .step, .faq-item, .table-item'
).forEach(el => {
  el.classList.add('fade-up')
  observer.observe(el)
})

const style = document.createElement('style')
style.textContent = `
  .fade-up {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  .fade-up.visible {
    opacity: 1;
    transform: translateY(0);
  }
`
document.head.appendChild(style)
