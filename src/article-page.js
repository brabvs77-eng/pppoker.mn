function initNavbar() {
  const navbar = document.getElementById('navbar')
  const navToggle = document.getElementById('navToggle')
  const navLinks = document.getElementById('navLinks')
  if (!navbar) return

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50)
  })

  if (navToggle && navLinks) {
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
}

document.addEventListener('DOMContentLoaded', initNavbar)
