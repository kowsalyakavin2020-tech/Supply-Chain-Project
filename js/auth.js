// ============================================================
// AUTH PAGES — auth.js (shared by login.html and signup.html)
// ============================================================

function showFieldError(field){
  field.closest('.field-wrap').classList.add('error');
}
function clearFieldError(field){
  field.closest('.field-wrap').classList.remove('error');
}

// ---- Entrance animation ----
if (typeof gsap !== 'undefined') {
  const tl = gsap.timeline({ delay: 0.2 });

  tl.from('.auth-image img', {
    opacity: 0,
    scale: 1.05,
    duration: 1,
    ease: 'power3.out'
  })
  .from('.auth-logo, .auth-panel-inner h1, .auth-subtext, .auth-form-title', {
    opacity: 0,
    y: 20,
    duration: 0.7,
    stagger: 0.1,
    ease: 'power2.out'
  }, '-=0.7')
  .from('.auth-form .field-wrap, .auth-form .auth-row, .auth-submit-btn, .auth-switch, .auth-divider, .auth-social-btn', {
    opacity: 0,
    y: 15,
    duration: 0.5,
    stagger: 0.06,
    ease: 'power2.out',
    clearProps: 'all'
  }, '-=0.3');
}

// ---- LOGIN FORM VALIDATION ----
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  const loginName = document.getElementById('loginName');
  const loginRole = document.getElementById('loginRole');
  const loginPassword = document.getElementById('loginPassword');

  [loginName, loginPassword].forEach(field => {
    field.addEventListener('input', () => {
      if (field.value.trim() !== '') clearFieldError(field);
    });
  });
  loginRole.addEventListener('change', () => {
    if (loginRole.value !== '') clearFieldError(loginRole);
  });

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    let firstInvalid = null;

    if (loginName.value.trim() === '') {
      showFieldError(loginName);
      valid = false;
      firstInvalid = firstInvalid || loginName;
    } else {
      clearFieldError(loginName);
    }

    if (loginRole.value === '') {
      showFieldError(loginRole);
      valid = false;
      firstInvalid = firstInvalid || loginRole;
    } else {
      clearFieldError(loginRole);
    }

    if (loginPassword.value.trim() === '') {
      showFieldError(loginPassword);
      valid = false;
      firstInvalid = firstInvalid || loginPassword;
    } else {
      clearFieldError(loginPassword);
    }

    if (!valid) {
      firstInvalid.focus();
      return;
    }

    // Save session + redirect based on selected role
    const selectedRole = loginRole.value;
    localStorage.setItem('scm_user', JSON.stringify({
      name: loginName.value.trim(),
      role: selectedRole
    }));

    if (selectedRole === 'admin') {
      window.location.href = 'dashboard-admin.html';
    } else {
      window.location.href = 'dashboard-operator.html';
    }
  });
}

// ---- SIGNUP FORM VALIDATION ----
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  const signupName = document.getElementById('signupName');
  const signupRole = document.getElementById('signupRole');
  const signupEmail = document.getElementById('signupEmail');
  const signupPassword = document.getElementById('signupPassword');
  const signupConfirmPassword = document.getElementById('signupConfirmPassword');
  const agreeTerms = document.getElementById('agreeTerms');

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function isStrongPassword(value) {
  return value.length >= 8 && /[0-9]/.test(value) && /[^A-Za-z0-9]/.test(value);
}
function updateStrengthBar(password) {
  const bars = document.querySelectorAll('.password-strength .strength-bar');
  let score = 0;
  if (password.length >= 8) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  bars.forEach((bar, i) => {
    bar.classList.remove('weak', 'medium', 'strong');
    if (i < score) bar.classList.add(score <= 1 ? 'weak' : score <= 2 ? 'medium' : 'strong');
  });
}

  function validateSignupField(field) {
    if (field === signupName) {
      if (field.value.trim() === '') { showFieldError(field); return false; }
    }
    if (field === signupRole) {
      if (field.value === '') { showFieldError(field); return false; }
    }
    if (field === signupEmail) {
      if (!emailPattern.test(field.value.trim())) { showFieldError(field); return false; }
    }
    if (field === signupPassword) {
  if (!isStrongPassword(field.value)) { showFieldError(field); return false; }
}
    if (field === signupConfirmPassword) {
      if (field.value.trim() === '' || field.value !== signupPassword.value) { showFieldError(field); return false; }
    }
    if (field === agreeTerms) {
      if (!field.checked) { showFieldError(field); return false; }
    }
    clearFieldError(field);
    return true;
  }

  [signupName, signupEmail, signupPassword, signupConfirmPassword].forEach(field => {
    field.addEventListener('input', () => validateSignupField(field));
    
  });
  signupPassword.addEventListener('input', () => updateStrengthBar(signupPassword.value));
  signupRole.addEventListener('change', () => validateSignupField(signupRole));
  agreeTerms.addEventListener('change', () => validateSignupField(agreeTerms));

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = [signupName, signupRole, signupEmail, signupPassword, signupConfirmPassword, agreeTerms];
    let allValid = true;
    let firstInvalid = null;

    fields.forEach(field => {
      const ok = validateSignupField(field);
      if (!ok) {
        allValid = false;
        if (!firstInvalid) firstInvalid = field;
      }
    });

    if (!allValid) {
      firstInvalid.focus();
      return;
    }

    const path404 = window.location.pathname.includes('/html/') ? 'login.html' : 'html/login.html';
    window.location.href = path404;
  });
}

// ---- Password show/hide toggle ----
document.querySelectorAll('.toggle-password').forEach(icon => {
  icon.addEventListener('click', () => {
    const input = document.getElementById(icon.dataset.target);
    if (!input) return;
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
  });
});