const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');

toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  });
});

const sections = [...document.querySelectorAll('main section[id]')];
const navItems = [...document.querySelectorAll('.nav-links a')];

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navItems.forEach(item => item.classList.toggle(
      'active', item.getAttribute('href') === `#${entry.target.id}`
    ));
  });
}, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

sections.forEach(section => observer.observe(section));
