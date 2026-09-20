/* =====================================================
   ANBU PHYSIOTHERAPY CLINIC — SCRIPT
   Organised in small independent modules so a backend
   can be wired in later without touching the rest.
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNav();
  initScrollReveal();
  initActiveNav();
  initAppointmentForm();
  initLoginModal();
  initFooterYear();
});

/* ---------------------------------------------------
   THEME TOGGLE (persisted in localStorage)
--------------------------------------------------- */
function initTheme() {
  const root = document.body;
  const toggle = document.getElementById('themeToggle');
  const stored = localStorage.getItem('anbu-theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const initial = stored || (prefersLight ? 'light' : 'dark');

  applyTheme(initial);

  toggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('anbu-theme', next);
  });

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    toggle.setAttribute('aria-pressed', theme === 'light');
    toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
}

/* ---------------------------------------------------
   NAVIGATION: scroll shadow + mobile menu
--------------------------------------------------- */
function initNav() {
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------------------------------------------------
   SCROLL REVEAL ANIMATIONS
--------------------------------------------------- */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in-view'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => observer.observe(el));
}

/* ---------------------------------------------------
   ACTIVE NAV LINK ON SCROLL
--------------------------------------------------- */
function initActiveNav() {
  const sections = document.querySelectorAll('main section[id]');
  const links = document.querySelectorAll('.nav-link');
  if (!('IntersectionObserver' in window) || !sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        links.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach(section => observer.observe(section));
}

/* ---------------------------------------------------
   APPOINTMENT FORM (frontend demo only)
   Backend note: replace the submit handler's body with
   a fetch() call to your booking API once it exists.
--------------------------------------------------- */
function initAppointmentForm() {
  const form = document.getElementById('appointmentForm');
  const dateInput = document.getElementById('date');
  if (!form || !dateInput) return;

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  dateInput.setAttribute('min', `${yyyy}-${mm}-${dd}`);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Demo-mode payload — shaped ready for a future API call.
    const payload = Object.fromEntries(new FormData(form).entries());
    console.log('Appointment request (demo mode, not sent anywhere):', payload);

    showToast('Your appointment request has been received in demo mode.');
    form.reset();
  });
}

/* ---------------------------------------------------
   CLINIC LOGIN MODAL (frontend demo only)
   Backend note: replace the submit handler's body with
   a real authentication request once one exists.
--------------------------------------------------- */
function initLoginModal() {
  const overlay = document.getElementById('loginOverlay');
  const openBtn = document.getElementById('loginBtn');
  const closeBtn = document.getElementById('loginClose');
  const cancelBtn = document.getElementById('loginCancel');
  const form = document.getElementById('loginForm');
  let lastFocused = null;

  const open = () => {
    lastFocused = document.activeElement;
    overlay.hidden = false;
    document.getElementById('clinicEmail').focus();
    document.addEventListener('keydown', onKeydown);
  };
  const close = () => {
    overlay.hidden = true;
    document.removeEventListener('keydown', onKeydown);
    if (lastFocused) lastFocused.focus();
  };
  const onKeydown = (e) => { if (e.key === 'Escape') close(); };

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  cancelBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Authentication is not connected yet. This is a frontend demonstration.');
  });
}

/* ---------------------------------------------------
   TOAST NOTIFICATIONS
--------------------------------------------------- */
let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3600);
}

/* ---------------------------------------------------
   FOOTER YEAR
--------------------------------------------------- */
function initFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}
