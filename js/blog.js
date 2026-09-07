// ============================================================
// BLOG PAGE — blog.js
// ============================================================

if (typeof AOS !== 'undefined') {
  AOS.init({ duration: 800, once: true, offset: 60 });
}

if (typeof gsap !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  // ---- Hero: heading + search fade-slide in on load ----
  gsap.from('.blog-hero-text > *', {
    opacity: 0,
    y: 30,
    duration: 0.9,
    stagger: 0.15,
    ease: 'power3.out',
    delay: 0.3
  });
  gsap.from('.blog-hero-image', {
    opacity: 0,
    x: 60,
    duration: 1,
    ease: 'power3.out',
    delay: 0.5
  });

  // ---- Featured article: image zoom-reveal on scroll ----
  gsap.from('.blog-featured-image', {
    opacity: 0,
    scale: 0.9,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.blog-featured-image',
      start: 'top 85%'
    }
  });
  gsap.from('.blog-featured-meta .meta-item', {
    opacity: 0,
    y: 15,
    duration: 0.5,
    stagger: 0.12,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.blog-featured-meta',
      start: 'top 90%'
    }
  });

  // ---- Recent posts: masonry-style pop, card-by-card ----
  gsap.utils.toArray('.blog-post-card').forEach((card, i) => {
    gsap.from(card, {
      opacity: 0,
      y: 50,
      scale: 0.95,
      duration: 0.6,
      delay: (i % 2) * 0.1,
      ease: 'back.out(1.4)',
      scrollTrigger: {
        trigger: card,
        start: 'top 90%'
      }
    });
  });
  gsap.from('.blog-sidebar-box', {
    opacity: 0,
    x: 40,
    duration: 0.7,
    stagger: 0.15,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.blog-sidebar',
      start: 'top 85%'
    }
  });

  // ---- Team: circular reveal / clip-path wipe ----
  gsap.utils.toArray('.team-member').forEach((member, i) => {
    gsap.fromTo(member,
      { opacity: 0, clipPath: 'inset(15% round 18px)' },
      {
        opacity: 1,
        clipPath: 'inset(0% round 18px)',
        duration: 0.8,
        delay: (i % 3) * 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: member,
          start: 'top 88%'
        }
      }
    );
  });

  // ---- Categories: rotate-in stagger grid ----
  gsap.from('.cat-card', {
    opacity: 0,
    rotate: -4,
    y: 40,
    duration: 0.6,
    stagger: {
      each: 0.08,
      grid: [2, 4],
      from: 'start'
    },
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.blog-cat-grid',
      start: 'top 88%'
    }
  });
}

// ---- Filter pills interaction — actually filters posts ----
const filterPills = document.querySelectorAll('.pill');
const postCards = document.querySelectorAll('.blog-post-card');

filterPills.forEach(pill => {
  pill.addEventListener('click', () => {
    filterPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');

    const filter = pill.dataset.filter;

    postCards.forEach(card => {
      const category = card.dataset.category;
      const shouldShow = filter === 'all' || category === filter;

      if (shouldShow) {
        card.style.display = '';
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(card,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
          );
        }
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// ---- Search validation ----
const blogSearchForm = document.getElementById('blogSearchForm');
const blogSearchInput = document.getElementById('blogSearchInput');
const blogSearchError = document.getElementById('blogSearchError');

if (blogSearchForm) {
  blogSearchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = blogSearchInput.value.trim();

    if (value === '') {
      blogSearchError.classList.add('show');
      blogSearchForm.classList.add('error');
      blogSearchInput.focus();
    } else {
      window.location.href = '404.html';
    }
  });

  blogSearchInput.addEventListener('input', () => {
    if (blogSearchInput.value.trim() !== '') {
      blogSearchError.classList.remove('show');
      blogSearchForm.classList.remove('error');
    }
  });
}

// ---- Sidebar search validation ----
const sidebarSearchForm = document.getElementById('sidebarSearchForm');
const sidebarSearchInput = document.getElementById('sidebarSearchInput');
const sidebarSearchError = document.getElementById('sidebarSearchError');

if (sidebarSearchForm) {
  sidebarSearchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = sidebarSearchInput.value.trim();

    if (value === '') {
      sidebarSearchError.classList.add('show');
      sidebarSearchForm.classList.add('error');
      sidebarSearchInput.focus();
    } else {
      window.location.href = '404.html';
    }
  });

  sidebarSearchInput.addEventListener('input', () => {
    if (sidebarSearchInput.value.trim() !== '') {
      sidebarSearchError.classList.remove('show');
      sidebarSearchForm.classList.remove('error');
    }
  });
}