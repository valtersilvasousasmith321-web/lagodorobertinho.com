// Confirma que o JS carregou antes de ativar qualquer animação (evita texto invisível)
document.documentElement.classList.add('has-js');

// Slideshow do banner principal (crossfade entre as fotos do hero)
const heroBgs = document.querySelectorAll('.hero-bg');
if (heroBgs.length > 1) {
  let heroIndex = 0;
  setInterval(() => {
    heroBgs[heroIndex].classList.remove('active');
    heroIndex = (heroIndex + 1) % heroBgs.length;
    heroBgs[heroIndex].classList.add('active');
  }, 6000);
}

// Menu mobile
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
menuToggle && menuToggle.addEventListener('click', () => {
  const open = navMenu.classList.toggle('active');
  menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});
navMenu && navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navMenu.classList.remove('active');
  menuToggle && menuToggle.setAttribute('aria-expanded', 'false');
}));

// Fecha o menu ao clicar fora
document.addEventListener('click', (e) => {
  if (navMenu && navMenu.classList.contains('active') && !navMenu.contains(e.target) && e.target !== menuToggle) {
    navMenu.classList.remove('active');
    menuToggle && menuToggle.setAttribute('aria-expanded', 'false');
  }
});

// Ano no rodapé
const anoEl = document.getElementById('ano');
if (anoEl) anoEl.textContent = new Date().getFullYear();

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

// Rede de segurança extra: se por algum motivo o observer não marcar
// um elemento (ex: navegador antigo dentro de algum app), garante que
// tudo fique visível depois de alguns segundos.
setTimeout(() => revealEls.forEach(el => el.classList.add('in')), 2500);

// Lightbox da galeria
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
document.querySelectorAll('.carousel-slide').forEach(item => {
  item.addEventListener('click', () => {
    lightboxImg.src = item.dataset.full;
    lightbox.classList.add('active');
  });
});
lightboxClose && lightboxClose.addEventListener('click', () => lightbox.classList.remove('active'));
lightboxClose && lightboxClose.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); lightbox.classList.remove('active'); }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) lightbox.classList.remove('active');
});
lightbox && lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('active'); });

// Carrossel da galeria (com avanço automático)
const galTrack = document.getElementById('galTrack');
const galPrev = document.getElementById('galPrev');
const galNext = document.getElementById('galNext');
const galDots = document.getElementById('galDots');
if (galTrack) {
  const viewport = galTrack.parentElement;
  const slides = Array.from(galTrack.children);
  let current = 0;

  // Cria os indicadores (bolinhas)
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Ir para foto ' + (i + 1));
    dot.addEventListener('click', () => { goTo(i); restartAutoplay(); });
    galDots && galDots.appendChild(dot);
  });
  const dots = galDots ? Array.from(galDots.children) : [];

  function goTo(i) {
    current = (i + slides.length) % slides.length;
    viewport.scrollTo({ left: slides[current].offsetLeft - viewport.offsetLeft, behavior: 'smooth' });
  }
  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  galPrev && galPrev.addEventListener('click', () => { prev(); restartAutoplay(); });
  galNext && galNext.addEventListener('click', () => { next(); restartAutoplay(); });

  // Marca a bolinha ativa conforme o scroll (inclusive quando arrastado manualmente)
  let scrollTimeout;
  viewport.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      let closest = 0, minDist = Infinity;
      slides.forEach((s, i) => {
        const dist = Math.abs(s.offsetLeft - viewport.offsetLeft - viewport.scrollLeft);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      current = closest;
      dots.forEach((d, i) => d.classList.toggle('active', i === closest));
    }, 100);
  });

  // Avanço automático: passa sozinho de tempos em tempos e volta ao início ao terminar
  let autoplayTimer;
  function startAutoplay() {
    autoplayTimer = setInterval(next, 4000);
  }
  function restartAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }
  startAutoplay();

  // Pausa enquanto o visitante está com o mouse em cima ou mexendo no carrossel
  viewport.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
  viewport.addEventListener('mouseleave', startAutoplay);
  viewport.addEventListener('touchstart', () => clearInterval(autoplayTimer), { passive: true });
  viewport.addEventListener('touchend', restartAutoplay, { passive: true });
}

// Sanfona (clique para abrir/fechar)
document.querySelectorAll('.accordion-head').forEach(head => {
  head.addEventListener('click', () => {
    head.closest('.accordion').classList.toggle('open');
  });
});

// Tabs do cardápio
const tabs = document.querySelectorAll('.menu-tab');
const panels = document.querySelectorAll('.menu-panel');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});
