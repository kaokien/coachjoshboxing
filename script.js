document.addEventListener("DOMContentLoaded", () => {
  // Handle mobile menu toggle (currently simple alert placeholder, but could drop down a menu)
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      // For simplicity in this demo, just alert or toggle a class onnav
      const navLinks = document.querySelector(".nav-links");
      if (navLinks.style.display === "flex") {
        navLinks.style.display = "none";
      } else {
        navLinks.style.display = "flex";
        navLinks.style.flexDirection = "column";
        navLinks.style.position = "absolute";
        navLinks.style.top = "5rem";
        navLinks.style.left = "0";
        navLinks.style.right = "0";
        navLinks.style.backgroundColor = "var(--color-bg)";
        navLinks.style.padding = "2rem";
        navLinks.style.borderBottom = "var(--border-thick)";
        navLinks.style.boxShadow = "var(--shadow-hard)";
      }
    });
  }

  // Handle form submission (Mock)
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const btn = signupForm.querySelector("button[type='submit']");
      const originalText = btn.textContent;

      btn.textContent = "REGISTERING...";
      btn.classList.remove("btn-primary");
      btn.classList.add("btn-dark");

      // Simulate API call
      setTimeout(() => {
        btn.textContent = "SUCCESS!";
        btn.style.backgroundColor = "#10b981"; // success green

        setTimeout(() => {
          btn.textContent = originalText;
          btn.classList.add("btn-primary");
          btn.classList.remove("btn-dark");
          btn.style.backgroundColor = "";
          signupForm.reset();
        }, 3000);
      }, 1500);
    });
  }

  // FAQ Accordion Interactivity
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(button => {
    button.addEventListener('click', () => {
      const answer = button.nextElementSibling;
      const icon = button.querySelector('span:last-child');

      // Toggle current answer
      if (answer.style.display === 'block') {
        answer.style.display = 'none';
        icon.textContent = '+';
      } else {
        // Close all other answers
        document.querySelectorAll('.faq-answer').forEach(ans => ans.style.display = 'none');
        document.querySelectorAll('.faq-question span:last-child').forEach(icn => icn.textContent = '+');

        // Open clicked answer
        answer.style.display = 'block';
        icon.textContent = '−';
      }
    });
  });

  // Mobile Sticky CTA Scroll Reveal
  const stickyCta = document.querySelector('.mobile-sticky-cta');
  const heroSection = document.querySelector('.hero');

  if (stickyCta && heroSection) {
    window.addEventListener('scroll', () => {
      const heroBottom = heroSection.getBoundingClientRect().bottom;
      // Show CTA only after scrolling past the hero section
      if (heroBottom < 0) {
        stickyCta.classList.add('visible');
      } else {
        stickyCta.classList.remove('visible');
      }
    });
  }

  // --- Analytics Tracking for Links Page ---
  const classTrialBtn = document.getElementById('link-class-trial');
  if (classTrialBtn) {
    classTrialBtn.addEventListener('click', () => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'click_class_trial',
        'event_category': 'Links Page'
      });
    });
  }

  const privateCoachingBtn = document.getElementById('link-private-coaching');
  if (privateCoachingBtn) {
    privateCoachingBtn.addEventListener('click', () => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'click_private_coaching',
        'event_category': 'Links Page'
      });
    });
  }

  const discordBtn = document.getElementById('link-discord');
  if (discordBtn) {
    discordBtn.addEventListener('click', () => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'click_discord',
        'event_category': 'Links Page'
      });
    });
  }

  const youtubeBtn = document.getElementById('link-youtube');
  if (youtubeBtn) {
    youtubeBtn.addEventListener('click', () => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'click_youtube',
        'event_category': 'Links Page'
      });
    });
  }

  const partnershipBtn = document.getElementById('link-partnership');
  if (partnershipBtn) {
    partnershipBtn.addEventListener('click', () => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'click_partnership',
        'event_category': 'Links Page'
      });
    });
  }

  // --- Google Ads "Get Directions" Conversion Tracking ---
  const addressLink = document.getElementById('location-address-link');
  const mapWrapper = document.getElementById('location-map-wrapper');

  function triggerDirectionsConversion() {
    // Only fire if Google tag is loaded and consent is accepted
    if (window.dataLayer && localStorage.getItem('cookieConsent') === 'accepted') {
      // Fire standard Ads conversion event
      function gtag() { window.dataLayer.push(arguments); }
      gtag('event', 'conversion', { 'send_to': 'AW-17990510454' });
      console.log('Fired Get Directions conversion event');
    }
    
    // If they clicked the map wrapper specifically, we need to handle the redirect manually
    // because we disabled pointer-events on the iframe to track the click
    if (this === mapWrapper) {
      window.open("https://maps.app.goo.gl/tkJkRVJnFdmE6RPu6", "_blank");
    }
  }

  if (addressLink) addressLink.addEventListener('click', triggerDirectionsConversion);
  if (mapWrapper) mapWrapper.addEventListener('click', triggerDirectionsConversion);

});

// --- STRICT GDPR COOKIE CONSENT START ---
const cookieBanner = document.getElementById('cookie-consent-banner');
const btnAccept = document.getElementById('btn-accept-cookies');
const btnDecline = document.getElementById('btn-decline-cookies');

if (cookieBanner && btnAccept && btnDecline) {
  // Check if consent has already been given or declined
  const consent = localStorage.getItem('cookieConsent');

  if (!consent) {
    // Show banner if no consent choice is found
    // small timeout to ensure smooth animation
    setTimeout(() => cookieBanner.classList.add('visible'), 500);
  } else if (consent === 'accepted') {
    // Load Google Analytics ONLY if accepted
    loadGoogleAnalytics();
  }

  // Accept Cookies
  btnAccept.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'accepted');
    cookieBanner.classList.remove('visible');
    loadGoogleAnalytics();
  });

  // Decline Cookies
  btnDecline.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'declined');
    cookieBanner.classList.remove('visible');
    // strict GDPR -> do not load GA
  });
}

// Inject Google Analytics dynamically
function loadGoogleAnalytics() {
  // Prevent loading multiple times if clicked repeatedly
  if (document.getElementById('google-analytics-script')) return;

  const measurementId = 'G-PVYFVNXBCD';
  const adsId = 'AW-17990510454';

  // 1. Inject gtag.js
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.id = 'google-analytics-script';
  document.head.appendChild(script);

  // 2. Initialize layer & config
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', measurementId);
  gtag('config', adsId);

  console.log('Google Analytics loaded successfully.');
}
// --- STRICT GDPR COOKIE CONSENT END ---
