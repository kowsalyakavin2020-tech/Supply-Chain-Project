// ============================================================
// SERVICES PAGE — services.js
// (Preloader + navbar/menu logic comes from script.js)
// ============================================================

// ---- GSAP animations ----
if (typeof gsap !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

// ---- Hero text drop-in animation ----
function splitToChars(el) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_ALL);
  const nodes = [];
  let node;
  while ((node = walker.nextNode())) nodes.push(node);

  const chars = [];
  nodes.forEach(n => {
    if (n.nodeType === Node.TEXT_NODE) {
      const frag = document.createDocumentFragment();
      const words = n.textContent.split(' ');

      words.forEach((word, wIdx) => {
        const wordSpan = document.createElement('span');
        wordSpan.style.display = 'inline-block';
        wordSpan.style.whiteSpace = 'nowrap';

        word.split('').forEach(ch => {
          const charSpan = document.createElement('span');
          charSpan.textContent = ch;
          charSpan.style.display = 'inline-block';
          wordSpan.appendChild(charSpan);
          chars.push(charSpan);
        });

        frag.appendChild(wordSpan);

        if (wIdx < words.length - 1) {
          frag.appendChild(document.createTextNode(' '));
        }
      });

      n.parentNode.replaceChild(frag, n);
    }
  });
  return chars;
}

if (typeof gsap !== 'undefined') {
  const heroHeading = document.querySelector('.svc-hero-text h1');
  const heroPara = document.querySelector('.svc-hero-text p');

  if (heroHeading && heroPara) {
    const headingChars = splitToChars(heroHeading);
    const paraChars = splitToChars(heroPara);

    gsap.set(headingChars, { opacity: 0, y: -60 });
    gsap.set(paraChars, { opacity: 0, y: -30 });
    gsap.set('.svc-hero-actions .btn', { opacity: 0, y: -40 });

    const heroTl = gsap.timeline({ delay: 0.3 });

    heroTl.to(headingChars, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.02,
      ease: 'bounce.out'
    })
    .to(paraChars, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.008,
      ease: 'power2.out'
    }, '-=0.3')
    .to('.svc-hero-actions .btn', {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.15,
      ease: 'back.out(1.7)'
    }, '-=0.2');
  }
}
// ---- Hero image flip-in from right ----
if (typeof gsap !== 'undefined') {
  const heroImgWrap = document.querySelector('.svc-hero-image');
  if (heroImgWrap) {
    gsap.set(heroImgWrap, {
      opacity: 0,
      x: 150,
      rotateY: -90,
      transformPerspective: 1000,
      transformOrigin: 'left center'
    });

    gsap.to(heroImgWrap, {
      opacity: 1,
      x: 0,
      rotateY: 0,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.6
    });
  }
}

  // Six ways cards — one by one jump into place
  gsap.from('.svc-card', {
    opacity: 0,
    y: 80,
    scale: 0.85,
    duration: 0.7,
    stagger: 0.2,
    ease: 'back.out(1.6)',
    clearProps: 'transform',
    scrollTrigger: {
      trigger: '.svc-cards-grid',
      start: 'top 88%',
      toggleActions: 'play none none reverse'
    }
  });

  // Tower text
  gsap.from('.svc-tower-text > *', {
    opacity: 0,
    x: -40,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.svc-tower-text',
      start: 'top 80%'
    }
  });

  // Circle cluster staggered pop-in
  gsap.from('.svc-tower-cluster .svc-circle', {
    opacity: 0,
    scale: 0.5,
    duration: 0.7,
    stagger: 0.15,
    ease: 'back.out(1.6)',
    scrollTrigger: {
      trigger: '.svc-tower-cluster',
      start: 'top 80%'
    }
  });

  // Ops image
  gsap.from('#svcOpsImage', {
    opacity: 0,
    y: 50,
    scale: 0.96,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#svcOpsImage',
      start: 'top 82%'
    }
  });

  // Ops stats
  gsap.from('#svcOpsStats .svc-ops-stat-item', {
    opacity: 0,
    y: 30,
    duration: 0.7,
    stagger: 0.15,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#svcOpsStats',
      start: 'top 85%'
    }
  });

  // Ops stat counters
  document.querySelectorAll('#svcOpsStats .stat-num').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const decimals = parseInt(el.dataset.decimal) || 0;
    const counter = { val: 0 };

    gsap.to(counter, {
      val: target,
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#svcOpsStats',
        start: 'top 85%'
      },
      onUpdate: () => {
        el.textContent = prefix + counter.val.toFixed(decimals) + suffix;
      }
    });
  });

  // Tier cards — one by one jump into place
  gsap.from('.svc-tier-card', {
    opacity: 0,
    y: 80,
    scale: 0.85,
    duration: 0.7,
    stagger: 0.2,
    ease: 'back.out(1.6)',
    clearProps: 'transform',
    scrollTrigger: {
      trigger: '.svc-tiers-grid',
      start: 'top 88%',
      toggleActions: 'play none none reverse'
    }
  });
}

// ---- Stats table rows: fade + slide in on scroll ----
const svcStatRows = document.querySelectorAll('.svc-stat-row');
if (svcStatRows.length) {
  const svcStatObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('in-view');
        }, i * 120);
      } else {
        entry.target.classList.remove('in-view');
      }
    });
  }, { threshold: 0.3 });

  svcStatRows.forEach(row => svcStatObserver.observe(row));
}