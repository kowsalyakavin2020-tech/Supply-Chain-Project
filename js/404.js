// ============================================================
// 404 PAGE — 404.js
// ============================================================

if (typeof gsap !== 'undefined') {
  const tl = gsap.timeline({ delay: 0.3 });

  tl.from('.error-code .digit', {
    opacity: 0,
    y: -40,
    duration: 0.7,
    stagger: 0.15,
    ease: 'bounce.out'
  })
  .from('.digit-icon', {
    opacity: 0,
    scale: 0,
    rotate: -180,
    duration: 0.7,
    ease: 'back.out(1.8)'
  }, '-=0.3')
  .from('.error-content h1, .error-content p', {
    opacity: 0,
    y: 20,
    duration: 0.7,
    stagger: 0.15,
    ease: 'power2.out'
  }, '-=0.2')
  .from('.error-actions .btn', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    stagger: 0.12,
    ease: 'power2.out',
    clearProps: 'all'
  }, '-=0.2')
  .from('.error-links', {
    opacity: 0,
    y: 15,
    duration: 0.6,
    ease: 'power2.out'
  }, '-=0.2');
}

// ---- Go back button ----
const goBackBtn = document.getElementById('goBackBtn');
if (goBackBtn) {
  goBackBtn.addEventListener('click', () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '../index.html';
    }
  });
}