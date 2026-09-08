window.addEventListener('load', function(){
    setTimeout(function(){
      const preloader = document.getElementById('preloader');
      if (preloader) {
        preloader.classList.add('hidden');
      }
    }, 500);
  });

  

const menuToggle = document.getElementById('menuToggle');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const menuClose = document.getElementById('menuClose');

let scrollPosition = 0;

function lockScroll(){
  scrollPosition = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollPosition}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.width = '100%';
}

function unlockScroll(){
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.width = '';
  window.scrollTo(0, scrollPosition);
}

if(menuToggle && mobileMenuOverlay){
  menuToggle.addEventListener('click', () => {
    mobileMenuOverlay.classList.add('open');
    lockScroll();
  });
}
if(menuClose && mobileMenuOverlay){
  menuClose.addEventListener('click', () => {
    mobileMenuOverlay.classList.remove('open');
    unlockScroll();
  });
}

document.querySelectorAll('.mobile-menu-links a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenuOverlay.classList.remove('open');
    unlockScroll();
  });
});

const featureCards = document.querySelectorAll('.feature-card-img');
if(featureCards.length){
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  featureCards.forEach(card => observer.observe(card));
}

if(typeof gsap !== 'undefined'){
  gsap.registerPlugin(ScrollTrigger);

  function splitLines(selector){
    const el = document.querySelector(selector);
    if(!el) return;
    el.innerHTML = el.textContent
      .split(' ')
      .map(word => `<span style="display:inline-block;overflow:hidden;vertical-align:top;"><span style="display:inline-block;">${word}&nbsp;</span></span>`)
      .join('');
  }

  splitLines('.ops-split-text h2');
  splitLines('.ops-split-text p');

  gsap.from('.ops-split-text h2 span span', {
    y:'100%',
    duration:0.7,
    stagger:0.04,
    ease:'power3.out',
    scrollTrigger:{
      trigger:'.ops-split-text',
      start:'top 80%'
    }
  });

  gsap.from('.ops-split-text p span span', {
    y:'100%',
    duration:0.6,
    stagger:0.02,
    delay:0.3,
    ease:'power3.out',
    scrollTrigger:{
      trigger:'.ops-split-text',
      start:'top 80%'
    }
  });

  gsap.from('#opsImage', {
    opacity:0,
    y:60,
    scale:0.96,
    duration:1,
    ease:'power3.out',
    scrollTrigger:{
      trigger:'#opsImage',
      start:'top 80%'
    }
  });

  gsap.from('#opsStats .ops-stat-item', {
    opacity:0,
    y:30,
    duration:0.7,
    stagger:0.15,
    ease:'power2.out',
    scrollTrigger:{
      trigger:'#opsStats',
      start:'top 85%'
    }
  });

  document.querySelectorAll('.ops-stat-item .stat-num').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const decimals = parseInt(el.dataset.decimal) || 0;
    const counter = { val: 0 };

    gsap.to(counter, {
      val: target,
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger:{
        trigger:'#opsStats',
        start:'top 85%'
      },
      onUpdate: () => {
        el.textContent = prefix + counter.val.toFixed(decimals) + suffix;
      }
    });
  });

  document.querySelectorAll('.ops-stat-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      gsap.to(item.querySelector('.stat-num'), {scale:1.1, duration:0.3, ease:'power1.out'});
    });
    item.addEventListener('mouseleave', () => {
      gsap.to(item.querySelector('.stat-num'), {scale:1, duration:0.3, ease:'power1.out'});
    });
  });
  
}

function splitStepText(el){
  el.innerHTML = el.textContent
    .split(' ')
    .map(word => `<span style="display:inline-block;overflow:hidden;vertical-align:top;"><span style="display:inline-block;">${word}&nbsp;</span></span>`)
    .join('');
}
document.querySelectorAll('.step-card h3, .step-card p').forEach(splitStepText);

const stepCards = document.querySelectorAll('.step-card');
if(stepCards.length){
  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        stepObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  stepCards.forEach(card => stepObserver.observe(card));
  
  stepCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const words = card.querySelectorAll('h3 span span, p span span');
      words.forEach((word, i) => {
        word.classList.remove('animate-in');
        void word.offsetWidth;
        word.style.animationDelay = (i * 0.03) + 's';
        word.classList.add('animate-in');
      });
    });
  });
}
const teamTrack = document.getElementById('teamTrack');
const teamSlides = document.querySelectorAll('.team-slide');
const teamPrev = document.getElementById('teamPrev');
const teamNext = document.getElementById('teamNext');

if(teamTrack && teamSlides.length){
  let teamIndex = 0;
  const visibleCount = window.innerWidth <= 600 ? 1 : window.innerWidth <= 900 ? 2 : 3;
  const maxIndex = teamSlides.length - visibleCount;

  function updateTeamCarousel(){
    const slideWidth = teamSlides[0].getBoundingClientRect().width + 24;
    teamTrack.style.transform = `translateX(-${teamIndex * slideWidth}px)`;
    teamSlides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === teamIndex + 1 || (visibleCount < 3 && i === teamIndex));
    });
  }

  teamNext.addEventListener('click', () => {
    teamIndex = Math.min(teamIndex + 1, maxIndex);
    updateTeamCarousel();
  });
  teamPrev.addEventListener('click', () => {
    teamIndex = Math.max(teamIndex - 1, 0);
    updateTeamCarousel();
  });

  updateTeamCarousel();
  window.addEventListener('resize', updateTeamCarousel);
}

// Testimonial HTML slide switcher
const slides = document.querySelectorAll('.testi-slide');
const dots = document.querySelectorAll('.testi-dots button');

if(slides.length){
  let currentTesti = 0;

  function showSlide(index){
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    slides[index].classList.add('active');
    dots[index].classList.add('active');
  }

  dots.forEach(function(dot, i){
    dot.addEventListener('click', function(){
      currentTesti = i;
      showSlide(i);
      clearInterval(testiTimer);
      testiTimer = setInterval(autoSlide, 3000);
    });
  });

  function autoSlide(){
    currentTesti = (currentTesti + 1) % slides.length;
    showSlide(currentTesti);
  }

  var testiTimer = setInterval(autoSlide, 3000);
}

const heroSlides = document.querySelectorAll('.hero-slide');
const heroDots = document.querySelectorAll('#heroDots button');

if(heroSlides.length > 1){
  let heroIndex = 0;

  function showHeroSlide(index){
    heroSlides.forEach(s => s.classList.remove('active'));
    heroDots.forEach(d => d.classList.remove('active'));
    heroSlides[index].classList.add('active');
    heroDots[index].classList.add('active');
  }

  let heroInterval = setInterval(() => {
    heroIndex = (heroIndex + 1) % heroSlides.length;
    showHeroSlide(heroIndex);
  }, 2000);

  heroDots.forEach(dot => {
    dot.addEventListener('click', () => {
      heroIndex = parseInt(dot.getAttribute('data-index'));
      showHeroSlide(heroIndex);
      clearInterval(heroInterval);
      heroInterval = setInterval(() => {
        heroIndex = (heroIndex + 1) % heroSlides.length;
        showHeroSlide(heroIndex);
      }, 2000);
    });
  });
}

const heroStatNums = document.querySelectorAll('.hero-stat-cards .stat-num');
heroStatNums.forEach((el, i) => {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const decimals = parseInt(el.dataset.decimal) || 0;
  const duration = 1600;
  const startDelay = 2600 + (i * 300);

  setTimeout(() => {
    let startTime = null;
    function animateCount(timestamp){
      if(!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;
      el.textContent = current.toFixed(decimals) + suffix;
      if(progress < 1){
        requestAnimationFrame(animateCount);
      } else {
        el.textContent = target.toFixed(decimals) + suffix;
      }
    }
    requestAnimationFrame(animateCount);
  }, startDelay);
});

// Sticky navbar background on scroll
window.addEventListener('scroll', function() {
  const header = document.querySelector('header');
  if (header) {
    if (window.scrollY > 100) {
      header.style.background = 'rgba(9,34,25,0.85)';
    } else {
      header.style.background = 'transparent';
    }
  }
});

// ---- Footer newsletter validation ----
const newsletterForm = document.getElementById('newsletterForm');
const newsletterEmail = document.getElementById('newsletterEmail');
const newsletterError = document.getElementById('newsletterError');

if (newsletterForm) {
  // Detect correct path to 404 page depending on current location
  const is404FromRoot = window.location.pathname.endsWith('/index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/index.html');
  const path404 = window.location.pathname.includes('/html/') ? '404.html' : 'html/404.html';

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = newsletterEmail.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (value === '') {
      newsletterError.textContent = 'Please enter your email.';
      newsletterError.classList.add('show');
      newsletterForm.classList.add('error');
      newsletterEmail.focus();
      return;
    }

    if (!emailPattern.test(value)) {
      newsletterError.textContent = 'Please enter a valid email address.';
      newsletterError.classList.add('show');
      newsletterForm.classList.add('error');
      newsletterEmail.focus();
      return;
    }

    newsletterError.classList.remove('show');
    newsletterForm.classList.remove('error');
    window.location.href = path404;
  });

  newsletterEmail.addEventListener('input', () => {
    if (newsletterEmail.value.trim() !== '') {
      newsletterError.classList.remove('show');
      newsletterForm.classList.remove('error');
    }
  });
}

// ---- Integrations + Switch section scroll animation ----
if (typeof gsap !== 'undefined') {
  gsap.to('.integrations-head', {
    opacity:1,
    y:0,
    duration:0.8,
    ease:'power3.out',
    scrollTrigger:{
      trigger:'.integrations-section',
      start:'top 80%'
    }
  });

  gsap.to('.switch-before', {
    opacity:1,
    y:0,
    duration:0.7,
    ease:'power3.out',
    scrollTrigger:{
      trigger:'.switch-grid',
      start:'top 80%'
    }
  });
  gsap.to('.switch-after', {
    opacity:1,
    y:0,
    duration:0.7,
    delay:0.15,
    ease:'power3.out',
    scrollTrigger:{
      trigger:'.switch-grid',
      start:'top 80%'
    }
  });
}