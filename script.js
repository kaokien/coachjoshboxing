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
});
