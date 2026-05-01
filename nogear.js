/* ============================================
   CJB NOGEAR — Minimal JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Nav Toggle ---
    const toggle = document.getElementById('ng-mobile-toggle');
    const navLinks = document.getElementById('ng-nav-links');

    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            toggle.textContent = navLinks.classList.contains('open') ? '[CLOSE]' : '[MENU]';
        });
    }

    // --- NFC Info Modal ---
    const modalOverlay = document.getElementById('ng-nfc-modal');
    const modalOpen = document.getElementById('ng-nfc-open');
    const modalClose = document.getElementById('ng-nfc-close');

    if (modalOverlay && modalOpen && modalClose) {
        modalOpen.addEventListener('click', (e) => {
            e.preventDefault();
            modalOverlay.classList.add('open');
        });

        modalClose.addEventListener('click', () => {
            modalOverlay.classList.remove('open');
        });

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('open');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
                modalOverlay.classList.remove('open');
            }
        });
    }

    // --- Terminal Typewriter Effect ---
    const tagline = document.querySelector('.ng-hero-tagline');
    if (tagline) {
        // Wait a beat for the CSS System Boot flicker to finish
        setTimeout(() => {
            const text = tagline.innerHTML;
            tagline.innerHTML = '';
            tagline.style.opacity = '1'; // Ensure it's visible now

            let i = 0;
            // Use textContent for typing to avoid parsing HTML tags slowly, 
            // but here we know it's just raw text with maybe a <br>, but looking at HTML it's pure text.
            const originalText = text.trim();
            
            const typeWriter = setInterval(() => {
                tagline.textContent += originalText.charAt(i);
                i++;
                if (i >= originalText.length) {
                    clearInterval(typeWriter);
                    // Add a blinking cursor at the end
                    tagline.innerHTML += '<span class="ng-cursor">_</span>';
                }
            }, 10); // Super fast 10ms per char for machine-speed
        }, 300); // 300ms matches the CSS animation duration
    }

});


/* ============================================
   UI UPGRADES: Smooth Reveal, Cursor, Parallax
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Populate data-text for glitch effects ---
    const glitchBtns = document.querySelectorAll('.ng-hero-cta, .ng-product-btn');
    glitchBtns.forEach(btn => {
        // Strip out HTML (like the arrow in the CTA) for the glitch text
        const rawText = btn.textContent.replace('↓', '').trim();
        btn.setAttribute('data-text', rawText);
    });

    // --- 2. Custom Mechanical Cursor ---
    const cursor = document.getElementById('ng-cursor-follower');
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            // Smoothly move cursor
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Hover states for cursor
        const interactables = document.querySelectorAll('a, button, .ng-product-card, .ng-nav-link');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
        });
    }

    // --- 3. Smooth Scroll Reveals (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.ng-reveal-hidden');
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('ng-reveal-visible');
                // Optional: stop observing once revealed
                // observer.unobserve(entry.target);
            } else {
                // If we want them to hide again when scrolling up
                // entry.target.classList.remove('ng-reveal-visible');
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 4. Smooth Image Parallax ---
    const parallaxImages = document.querySelectorAll('.ng-hero-image img, .ng-product-image-wrap img');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                parallaxImages.forEach(img => {
                    // Get the image's vertical position relative to the viewport
                    const rect = img.getBoundingClientRect();
                    // Calculate a subtle offset based on scroll
                    const offset = (rect.top - window.innerHeight / 2) * 0.05;
                    // Apply a base scale (to avoid clipping) plus the translation
                    img.style.transform = `scale(1.05) translateY(${offset}px)`;
                });
                ticking = false;
            });
            ticking = true;
        }
    });

});

