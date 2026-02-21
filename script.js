document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // 1. Active navigation link highlighting
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function setActiveLink() {
    const scrollY = window.scrollY + 150; // offset for fixed header
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(l => l.classList.remove('active'));
        if (link) link.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', setActiveLink);
  setActiveLink();

  // 2. Smooth scroll for anchor links
  document.querySelectorAll('.nav-link, .footer a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // 3. Fade-in sections on scroll (Intersection Observer)
  const fadeSections = document.querySelectorAll('.fade-section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // stop observing once visible
      }
    });
  }, { threshold: 0.2 });

  fadeSections.forEach(section => observer.observe(section));

  // 4. Contact form handling via Formspree (AJAX)
  const contactForm = document.querySelector('#contact form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault(); // stop default browser submission

      const formData = new FormData(contactForm);
      const action = contactForm.getAttribute('action');

      fetch(action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(response => {
        if (response.ok) {
          alert('Thank you! Your message has been sent.');
          contactForm.reset();
        } else {
          response.json().then(data => {
            if (data.errors) alert('Oops! There was a problem: ' + data.errors.map(e => e.message).join(', '));
            else alert('Oops! Something went wrong.');
          });
        }
      })
      .catch(error => alert('Oops! Something went wrong.'));
    });
  }

  // 5. Set current year in footer
  document.getElementById('currentYear').textContent = new Date().getFullYear();
});