/* =============================================================
   main.js — Coutinho Caldas
   Módulos: Header, Mobile Menu, Carrossel, Reveal, Scroll, Galeria
   ============================================================= */

(function () {
  'use strict';

  /* =============================================================
     HEADER — efeito de scroll
     ============================================================= */

  const header = document.getElementById('header');

  function handleHeaderScroll() {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });


  /* =============================================================
     MENU MOBILE
     ============================================================= */

  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  function openMobileMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
  }

  function closeMobileMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }

  // Expor para uso inline nos links do menu mobile
  window.closeMobileMenu = closeMobileMenu;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    isOpen ? closeMobileMenu() : openMobileMenu();
  });

  // Fechar ao clicar fora
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      closeMobileMenu();
    }
  });


  /* =============================================================
     CARROSSEL DE DEPOIMENTOS
     ============================================================= */

  const track   = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  let currentIndex   = 0;
  let autoPlayTimer  = null;

  /** Quantidade de cards visíveis conforme largura da tela */
  function getVisibleCount() {
    const w = window.innerWidth;
    if (w < 640)  return 1;
    if (w < 1024) return 2;
    return 3;
  }

  /** Largura de um card + gap */
  function getCardWidth() {
    const firstCard = track.firstElementChild;
    if (!firstCard) return 0;
    return firstCard.offsetWidth + 24; // 24px = gap
  }

  /** Máximo índice permitido */
  function getMaxIndex() {
    return Math.max(0, track.children.length - getVisibleCount());
  }

  /** Aplica a translação no track */
  function updateCarousel() {
    const max = getMaxIndex();
    currentIndex = Math.min(Math.max(currentIndex, 0), max);
    track.style.transform = `translateX(-${currentIndex * getCardWidth()}px)`;
  }

  function goNext() {
    currentIndex = currentIndex >= getMaxIndex() ? 0 : currentIndex + 1;
    updateCarousel();
  }

  function goPrev() {
    currentIndex = currentIndex <= 0 ? getMaxIndex() : currentIndex - 1;
    updateCarousel();
  }

  function startAutoPlay() {
    autoPlayTimer = setInterval(goNext, 4500);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  }

  nextBtn.addEventListener('click', () => { goNext(); resetAutoPlay(); });
  prevBtn.addEventListener('click', () => { goPrev(); resetAutoPlay(); });

  window.addEventListener('resize', updateCarousel, { passive: true });

  startAutoPlay();


  /* =============================================================
     SCROLL REVEAL
     ============================================================= */

  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((el) => revealObserver.observe(el));


  /* =============================================================
     SMOOTH SCROLL — links âncora
     ============================================================= */

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      const target   = document.querySelector(targetId);

      if (target) {
        e.preventDefault();
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });


/* =============================================================
   LIGHTBOX
   ============================================================= */

const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

// Mapa direto: classe do item → caminho da imagem
const galleryImages = {
  'gallery-item--1':  'assets/images/image17.jpeg',
  'gallery-item--2':  'assets/images/image13.jpeg',
  'gallery-item--3':  'assets/images/image18.jpeg',
  'gallery-item--4':  'assets/images/image15.jpeg',
  'gallery-item--5':  'assets/images/image16.jpeg',
  'gallery-item--6':  'assets/images/image14.jpeg',
  'gallery-item--7':  'assets/images/image4.jpg',
  'gallery-item--8':  'assets/images/image22.jpeg',
  'gallery-item--9':  'assets/images/image20.jpeg',
  'gallery-item--10': 'assets/images/image25.jpeg',
  'gallery-item--11': 'assets/images/image19.jpeg',
  'gallery-item--12': 'assets/images/image11.png',
  'gallery-item--13': 'assets/images/image23.jpeg',
  'gallery-item--14': 'assets/images/image8.jpg',
  'gallery-item--15': 'assets/images/image26.png',
  'gallery-item--16': 'assets/images/image28.jpeg',
  'gallery-item--17': 'assets/images/image9.jpg',
  'gallery-item--18': 'assets/images/image21.jpeg',
  'gallery-item--19': 'assets/images/image3.jpg',
  'gallery-item--20': 'assets/images/image5.jpg',
};

function openLightbox(imageUrl) {
  lightboxImg.src = imageUrl;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { lightboxImg.src = ''; }, 300);
}

document.querySelectorAll('.gallery-item').forEach((item) => {
  item.addEventListener('click', () => {
    // Encontra qual classe --N o item tem e busca no mapa
    const key = [...item.classList].find(cls => cls.startsWith('gallery-item--'));
    const imageUrl = galleryImages[key];
    if (imageUrl) openLightbox(imageUrl);
  });
});

lightboxClose.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

})();