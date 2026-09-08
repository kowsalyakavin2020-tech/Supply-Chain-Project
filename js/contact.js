// ============================================================
// CONTACT PAGE — contact.js
// ============================================================

if (typeof gsap !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  // ---- Hero: text stagger + image slide from right ----
  gsap.from('.contact-hero-text > *', {
    opacity: 0,
    y: 30,
    duration: 0.9,
    stagger: 0.15,
    ease: 'power3.out',
    delay: 0.3
  });
  gsap.from('.contact-hero-image', {
    opacity: 0,
    x: 60,
    rotate: 3,
    duration: 1,
    ease: 'power3.out',
    delay: 0.5
  });

  // ---- Form section: image + form box slide in from opposite sides ----
  gsap.from('.contact-form-image', {
    opacity: 0,
    x: -60,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.contact-form-grid',
      start: 'top 82%'
    }
  });
  gsap.from('.contact-form-box', {
    opacity: 0,
    x: 60,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.contact-form-grid',
      start: 'top 82%'
    }
  });
  // Form fields cascade in
  gsap.from('.contact-form-box .form-row, .contact-form-box textarea, .contact-form-box .form-checkbox, .contact-form-box .btn-submit', {
    opacity: 0,
    y: 15,
    duration: 0.5,
    stagger: 0.08,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.contact-form-box',
      start: 'top 78%'
    }
  });

  

  // ---- Map: reveal wipe from left ----
  gsap.from('.map-heading', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.contact-map-section',
      start: 'top 85%'
    }
  });
  gsap.fromTo('.contact-map-frame',
    { clipPath: 'inset(0 100% 0 0)' },
    {
      clipPath: 'inset(0 0% 0 0)',
      duration: 1.2,
      ease: 'power3.inOut',
      scrollTrigger: {
        trigger: '.contact-map-frame',
        start: 'top 85%'
      }
    }
  );
}

// ---- Form validation + submit handler ----
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  const fieldName = document.getElementById('fieldName');
  const fieldEmail = document.getElementById('fieldEmail');
  const fieldPhone = document.getElementById('fieldPhone');
  const fieldBusiness = document.getElementById('fieldBusiness');
  const fieldCompany = document.getElementById('fieldCompany');
  const fieldLocation = document.getElementById('fieldLocation');
  const fieldMessage = document.getElementById('fieldMessage');
  const fieldAgree = document.getElementById('fieldAgree');

  function showError(field) {
    field.closest('.field-wrap').classList.add('error');
  }
  function clearError(field) {
    field.closest('.field-wrap').classList.remove('error');
  }

  function validateField(field) {
    if (field.type === 'checkbox') {
      if (!field.checked) { showError(field); return false; }
      clearError(field);
      return true;
    }
    if (field.value.trim() === '') {
      showError(field);
      return false;
    }
    if (field === fieldEmail) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(field.value.trim())) {
        showError(field);
        return false;
      }
    }
    if (field === fieldPhone) {
      const phonePattern = /^[0-9]{10}$/;
      if (!phonePattern.test(field.value.trim().replace(/[\s\-()]/g, ''))) {
        showError(field);
        return false;
      }
    }
    clearError(field);
    return true;
  }

  // Live validation as user types/checks
  [fieldName, fieldEmail, fieldPhone, fieldBusiness, fieldCompany, fieldLocation, fieldMessage].forEach(field => {
    field.addEventListener('input', () => validateField(field));
  });
  fieldAgree.addEventListener('change', () => validateField(fieldAgree));

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const fields = [fieldName, fieldEmail, fieldPhone, fieldBusiness, fieldCompany, fieldLocation, fieldMessage, fieldAgree];
    let allValid = true;
    let firstInvalid = null;

    fields.forEach(field => {
      const valid = validateField(field);
      if (!valid) {
        allValid = false;
        if (!firstInvalid) firstInvalid = field;
      }
    });

    if (!allValid) {
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    window.location.href = '../html/404.html';
  });
}

// ---- FAQ accordion ----
document.querySelectorAll('.faq-item').forEach(item => {
  const question = item.querySelector('.faq-question');
  question.addEventListener('click', () => {
    const isActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
    if (!isActive) item.classList.add('active');
  });
});

// ---- FAQ scroll animation ----
if (typeof gsap !== 'undefined') {
  gsap.from('.faq-heading > *', {
    opacity: 0,
    y: 24,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.contact-faq-section',
      start: 'top 80%'
    }
  });
  gsap.from('.faq-item', {
    opacity: 0,
    y: 30,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.faq-list',
      start: 'top 82%'
    }
  });
}