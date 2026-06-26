/* Main Logic - Shreyan Portfolio */

import './style.css';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initCustomCursor();
  initNavbarScroll();
  initMobileMenu();
  initHeroCanvas();
  initFormValidation();
  initBackToTop();
  updateFooterYear();
  initScrollReveal();
});

// 1. Preloader simulation
function initPreloader() {
  const bar = document.getElementById('preloaderBar');
  const percentText = document.getElementById('preloaderPercent');
  const preloader = document.getElementById('preloader');
  
  let percentage = 0;
  
  // Fast simulated load
  const interval = setInterval(() => {
    percentage += Math.floor(Math.random() * 8) + 2;
    if (percentage >= 100) {
      percentage = 100;
      clearInterval(interval);
      
      // Complete preloader
      setTimeout(() => {
        preloader.classList.add('loaded');
      }, 300);
    }
    
    if (bar && percentText) {
      bar.style.width = `${percentage}%`;
      percentText.textContent = `${percentage}%`;
    }
  }, 40);
}

// 2. Custom Cursor
function initCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  const dot = document.querySelector('.custom-cursor-dot');
  
  if (!cursor || !dot) return;

  // Track position
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Quick movement for dot
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  // Smooth follow interpolation for outer circle
  const tick = () => {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;
    
    cursorX += dx * 0.15;
    cursorY += dy * 0.15;
    
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    
    requestAnimationFrame(tick);
  };
  tick();

  // Hover animations
  const hoverables = document.querySelectorAll('.magic-hover, a, button, select, input, textarea, .project-img-wrap, .pack-row');
  
  hoverables.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovered');
    });
  });
}

// 3. Navbar scroll reaction
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar-wrapper');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// 4. Mobile Menu overlay
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('mobileMenu');
  const links = document.querySelectorAll('.mobile-nav-link');

  if (!toggle || !menu) return;

  const toggleMenu = () => {
    toggle.classList.toggle('active');
    menu.classList.toggle('active');
    
    // Toggle body scroll
    if (menu.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  toggle.addEventListener('click', toggleMenu);

  links.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      menu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// 5. Hero Background Animated Canvas (Particle network)
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  
  // Resize canvas
  const resizeCanvas = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Particles config
  const particles = [];
  const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
  
  // Particle class
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 3 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce on borders
      if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
      if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.15)'; // Accents
      ctx.fill();
    }
  }

  // Create particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Animation Loop
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(17, 17, 18, ${0.03 * (1 - dist / 120)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    
    requestAnimationFrame(animate);
  };
  
  animate();
}

// 6. Contact Form Validation
function initFormValidation() {
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('successMsg');
  const errorMsg = document.getElementById('errorMsg');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Clear status
    successMsg.style.display = 'none';
    errorMsg.style.display = 'none';

    const name = document.getElementById('formName').value.trim();
    const email = document.getElementById('formEmail').value.trim();
    const service = document.getElementById('formService').value;
    const message = document.getElementById('formMessage').value.trim();
    const privacy = document.getElementById('privacyAgree').checked;

    if (!name || !email || !service || !message || !privacy) {
      errorMsg.style.display = 'block';
      return;
    }

    // Success response simulation
    successMsg.style.display = 'block';
    form.reset();
    
    // Hide notification after 4s
    setTimeout(() => {
      successMsg.style.display = 'none';
    }, 4000);
  });
}

// 7. Back to Top Button
function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// 8. Update Footer Copyright Year
function updateFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// 9. Scroll Reveal Animation
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  if (revealElements.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    observer.observe(el);
  });
}
