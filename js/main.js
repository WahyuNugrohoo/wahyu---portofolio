/**
 * WAHYU PORTFOLIO — MAIN JAVASCRIPT
 * Interactivity, animations, and dynamic features
 */

/* ─── PRELOADER ─── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.classList.add('hidden');
      setTimeout(() => preloader.remove(), 600);
    }
  }, 1800);
});

/* ─── CURSOR GLOW ─── */
const cursorGlow = document.querySelector('.cursor-glow');
document.addEventListener('mousemove', (e) => {
  if (cursorGlow) {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top  = e.clientY + 'px';
  }
});

/* ─── NAVBAR SCROLL ─── */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a, .nav-mobile a');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Scrolled class
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active nav link
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

/* ─── HAMBURGER MENU ─── */
const hamburger = document.getElementById('nav-hamburger');
const mobileMenu = document.getElementById('nav-mobile');

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

mobileMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* ─── TYPING ANIMATION ─── */
const typingEl = document.querySelector('.hero-typing');
const roles = [
  'IT Support Specialist',
  'Web Developer',
  'UI/UX Designer',
  'QA Engineer',
];
let roleIdx  = 0;
let charIdx  = 0;
let isDeleting = false;
let typingDelay = 100;

function typeWriter() {
  const currentRole = roles[roleIdx];
  if (isDeleting) {
    typingEl.textContent = currentRole.slice(0, charIdx - 1);
    charIdx--;
    typingDelay = 55;
  } else {
    typingEl.textContent = currentRole.slice(0, charIdx + 1);
    charIdx++;
    typingDelay = 100;
  }

  if (!isDeleting && charIdx === currentRole.length) {
    isDeleting = true;
    typingDelay = 1800;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    roleIdx = (roleIdx + 1) % roles.length;
    typingDelay = 500;
  }

  setTimeout(typeWriter, typingDelay);
}

if (typingEl) setTimeout(typeWriter, 1200);

/* ─── PARTICLE CANVAS ─── */
const canvas = document.getElementById('particles-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = document.getElementById('hero').offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x    = Math.random() * canvas.width;
      this.y    = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.35;
      this.speedY = (Math.random() - 0.5) * 0.35;
      this.opacity = Math.random() * 0.4 + 0.05;
      this.color = Math.random() > 0.5
        ? `rgba(128,0,32,${this.opacity})`
        : `rgba(255,255,255,${this.opacity * 0.5})`;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  // Draw lines between close particles
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(128,0,32,${0.12 * (1 - dist/100)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

/* ─── COUNTER ANIMATION ─── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current) + (el.dataset.suffix || '');
  }, 16);
}

/* ─── INTERSECTION OBSERVER ─── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      // Skill bar animation
      if (entry.target.classList.contains('skill-fill')) {
        entry.target.style.width = entry.target.dataset.width;
      }

      // Counter animation
      if (entry.target.dataset.target) {
        animateCounter(entry.target);
      }

      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.fade-up, .fade-left, .fade-right').forEach(el => observer.observe(el));
document.querySelectorAll('.skill-fill').forEach(el => observer.observe(el));
document.querySelectorAll('[data-target]').forEach(el => observer.observe(el));

/* ─── PROJECT FILTER ─── */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = '';
        card.style.opacity = '0';
        setTimeout(() => { card.style.opacity = '1'; card.style.transition = 'opacity 0.4s ease'; }, 10);
      } else {
        card.style.display = 'none';
      }
    });
  });
});

/* ─── CONTACT FORM (EmailJS) ─── */
emailjs.init('Kx28KSgS6CYGsyhQe');

const contactForm = document.getElementById('contact-form');
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  const btn      = contactForm.querySelector('.form-submit');
  const name     = document.getElementById('contact-name').value.trim();
  const email    = document.getElementById('contact-email').value.trim();
  const subject  = document.getElementById('contact-subject').value.trim();
  const message  = document.getElementById('contact-message').value.trim();

  if (!name || !email || !message) {
    btn.innerHTML = '⚠ Nama, Email & Pesan wajib diisi!';
    btn.style.background = 'linear-gradient(135deg, #a05000, #c87000)';
    setTimeout(() => {
      btn.innerHTML = '<i class="ri-send-plane-fill"></i> Kirim Pesan';
      btn.style.background = '';
    }, 2500);
    return;
  }

  // Loading state
  const originalHTML = btn.innerHTML;
  btn.innerHTML  = '<i class="ri-loader-4-line"></i> Mengirim...';
  btn.disabled   = true;
  btn.style.background = 'linear-gradient(135deg, #444, #666)';

  emailjs.send('service_y443ocf', 'template_tw0mtsl', {
    name:    name,
    email:   email,
    subject: subject || '(Tanpa Subjek)',
    message: message,
  })
  .then(() => {
    btn.innerHTML = '✓ Pesan Terkirim!';
    btn.style.background = 'linear-gradient(135deg, #1a7a1a, #2ea82e)';
    contactForm.reset();
    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
      btn.disabled = false;
    }, 3500);
  })
  .catch((err) => {
    console.error('EmailJS error:', err);
    btn.innerHTML = '✗ Gagal Mengirim. Coba lagi.';
    btn.style.background = 'linear-gradient(135deg, #8b0000, #c00)';
    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
      btn.disabled = false;
    }, 3500);
  });
});


/* ─── SMOOTH SCROLL for nav links ─── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    }
  });
});

/* ─── BACK TO TOP ─── */
document.getElementById('back-top')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
