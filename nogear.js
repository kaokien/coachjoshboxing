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

    // --- 2. Smooth Scroll Reveals (Intersection Observer) ---
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

    // --- CART SYSTEM LOGIC ---
    let cart = [];
    const cartToggleBtn = document.getElementById('ng-cart-toggle');
    const cartDrawer = document.getElementById('ng-cart-drawer');
    const cartOverlay = document.getElementById('ng-cart-overlay');
    const cartCloseBtn = document.getElementById('ng-cart-close');
    const cartItemsContainer = document.getElementById('ng-cart-items');
    const cartTotalDisplay = document.getElementById('ng-cart-total');
    const checkoutBtn = document.getElementById('ng-cart-checkout');
    
    // Success Modal
    const successModal = document.getElementById('ng-success-modal');
    const successClose = document.getElementById('ng-success-close');

    function toggleCart() {
        cartDrawer.classList.toggle('open');
        cartOverlay.classList.toggle('open');
    }

    if (cartToggleBtn) cartToggleBtn.addEventListener('click', toggleCart);
    if (cartCloseBtn) cartCloseBtn.addEventListener('click', toggleCart);
    if (cartOverlay) {
        cartOverlay.addEventListener('click', (e) => {
            if (e.target === cartOverlay) toggleCart();
        });
    }

    function updateCartUI() {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="ng-cart-empty">CART IS EMPTY</div>';
            cartTotalDisplay.textContent = '$0';
            cartToggleBtn.textContent = '[ 0 ]';
            return;
        }

        let total = 0;
        cartItemsContainer.innerHTML = '';
        
        cart.forEach((item, index) => {
            total += item.price;
            
            const itemEl = document.createElement('div');
            itemEl.className = 'ng-cart-item';
            itemEl.innerHTML = `
                <div>
                    <div class="ng-cart-item-name">${item.name}</div>
                    <button class="ng-cart-item-remove" data-index="${index}">REMOVE</button>
                </div>
                <div class="ng-cart-item-price">$${item.price}</div>
            `;
            cartItemsContainer.appendChild(itemEl);
        });

        cartTotalDisplay.textContent = `$${total}`;
        cartToggleBtn.textContent = `[ ${cart.length} ]`;

        // Bind remove buttons
        document.querySelectorAll('.ng-cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'));
                cart.splice(idx, 1);
                updateCartUI();
            });
        });
    }

    // Add to Cart
    const acquireBtns = document.querySelectorAll('.ng-product-btn');
    acquireBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const name = btn.getAttribute('data-name');
            const price = parseInt(btn.getAttribute('data-price'));
            if (name && price) {
                cart.push({ name, price });
                updateCartUI();
                if (!cartDrawer.classList.contains('open')) {
                    toggleCart();
                }
            }
        });
    });

    // Checkout 
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) return;
            // Dummy checkout success
            toggleCart(); // close cart
            cart = []; // clear cart
            updateCartUI();
            successModal.classList.add('open');
        });
    }

    if (successClose) {
        successClose.addEventListener('click', () => {
            successModal.classList.remove('open');
        });
    }

    // --- Hero Image Slideshow ---
    const slides = document.querySelectorAll('.ng-hero-slide');
    let currentSlide = 0;
    if (slides.length > 1) {
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 3500);
    }

});

