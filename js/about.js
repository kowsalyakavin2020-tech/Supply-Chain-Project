// ============================================================
// ABOUT PAGE — animations for about.html only
// (Header/menu/preloader logic already comes from script.js)
// ============================================================

// ---- Animated stat counters (services section) ----
const aboutStatNums = document.querySelectorAll('.about-stat-item .stat-num');

if(aboutStatNums.length){
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        animateAboutStat(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  aboutStatNums.forEach(el => statObserver.observe(el));
}

function animateAboutStat(el){
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const decimals = parseInt(el.dataset.decimal) || 0;
  const duration = 1400;
  let startTime = null;

  function step(timestamp){
    if(!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * target;
    el.textContent = current.toFixed(decimals) + suffix;
    if(progress < 1){
      requestAnimationFrame(step);
    } else {
      el.textContent = target.toFixed(decimals) + suffix;
    }
  }
  requestAnimationFrame(step);
}

// ---- Timeline: scroll-fill progress line + row fade-in ----
const aboutTimeline = document.getElementById('aboutTimeline');
const timelineLineFill = document.getElementById('timelineLineFill');
const timelineRows = document.querySelectorAll('.timeline-row');

if(aboutTimeline && timelineLineFill){
  function updateTimelineProgress(){
    const rect = aboutTimeline.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const start = viewportH * 0.85;
    const total = rect.height + viewportH * 0.7;
    const scrolled = start - rect.top;
    const progress = Math.min(Math.max(scrolled / total, 0), 1);
    timelineLineFill.style.height = (progress * 100) + '%';
  }
  window.addEventListener('scroll', updateTimelineProgress, { passive: true });
  window.addEventListener('resize', updateTimelineProgress);
  updateTimelineProgress();
}

if(timelineRows.length){
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
      } else {
        entry.target.classList.remove('in-view');
      }
    });
  }, { threshold: 0.3 });

  timelineRows.forEach(row => timelineObserver.observe(row));
}

// ---- Collage + culture image reveal on scroll (GSAP) ----
if(typeof gsap !== 'undefined'){
  gsap.registerPlugin(ScrollTrigger);

  gsap.from('.services-collage .collage-col', {
    opacity:0,
    y:60,
    scale:0.94,
    duration:0.9,
    stagger:0.18,
    ease:'power3.out',
    scrollTrigger:{
      trigger:'.services-collage',
      start:'top 82%'
    }
  });

  gsap.from('.culture-image', {
    opacity:0,
    scale:0.94,
    y:40,
    duration:1,
    ease:'power3.out',
    scrollTrigger:{
      trigger:'.culture-image',
      start:'top 85%'
    }
  });
}

// ---- Culture card paragraph: word-by-word rise animation on hover ----
function splitCultureText(el){
  el.innerHTML = el.textContent
    .split(' ')
    .map(word => `<span style="display:inline-block;overflow:hidden;vertical-align:top;"><span style="display:inline-block;">${word}&nbsp;</span></span>`)
    .join('');
}
document.querySelectorAll('.culture-card-body p').forEach(splitCultureText);

document.querySelectorAll('.culture-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    const words = card.querySelectorAll('.culture-card-body p span span');
    words.forEach((word, i) => {
      word.classList.remove('animate-in');
      void word.offsetWidth;
      word.style.animationDelay = (i * 0.03) + 's';
      word.classList.add('animate-in');
    });
  });
});

// ---- Culture cards: staggered GSAP entrance on scroll ----
if(typeof gsap !== 'undefined'){
  gsap.from('.culture-grid .culture-card', {
    opacity:0,
    y:70,
    rotateX:-15,
    scale:0.92,
    duration:0.8,
    stagger:0.4,
    ease:'power3.out',
    transformOrigin:'top center',
    scrollTrigger:{
      trigger:'.culture-grid',
      start:'top 85%'
    }
  });
}
