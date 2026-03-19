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
