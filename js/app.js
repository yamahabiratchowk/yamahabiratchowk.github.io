// Main JavaScript file for Yamaha Showroom website

document.addEventListener("DOMContentLoaded", () => {
  // Load navbar
  loadNavbar();
  
  // Initialize back to top button
  initBackToTop();
  
  // Add scroll effects
  initScrollEffects();
  
  // Add animation for service items
  animateServiceItems();
  
  // Set up smooth scrolling for anchor links
  setupSmoothScrolling();
});

// Function to load navbar from external HTML file
function loadNavbar() {
  fetch('navbar.html')
    .then(res => res.text())
    .then(data => {
      const navbarContainer = document.getElementById('navbar-container');
      if (navbarContainer) {
        navbarContainer.innerHTML = data;

        // Wait for the DOM to update, then attach event
        setTimeout(() => {
          const hamburger = document.getElementById("hamburger");
          const navLinks = document.getElementById("nav-links");

          if (hamburger && navLinks) {
            hamburger.addEventListener("click", () => {
              navLinks.classList.toggle("show");
            });
            
            // Close mobile menu when clicking outside
            document.addEventListener("click", (e) => {
              if (navLinks.classList.contains("show") && 
                  !e.target.closest("#nav-links") && 
                  e.target !== hamburger) {
                navLinks.classList.remove("show");
              }
            });
            
            // Close mobile menu when clicking a nav link
            const links = document.querySelectorAll(".nav-link");
            links.forEach(link => {
              link.addEventListener("click", () => {
                navLinks.classList.remove("show");
              });
            });
          }
          
          // Set up services link click handler
          const servicesLink = document.querySelector('a.nav-link[href="#services"]');
          if (servicesLink) {
            servicesLink.addEventListener('click', function(e) {
              e.preventDefault();
              const servicesSection = document.querySelector('.services');
              if (servicesSection) {
                scrollToElement(servicesSection);
              }
            });
          }
        }, 100);
      } else {
        console.error("Navbar container not found");
      }
    })
    .catch(error => {
      console.error("Error loading navbar:", error);
      // Fallback navbar if fetch fails
      createFallbackNavbar();
    });
}

// Create a fallback navbar if the external file can't be loaded
function createFallbackNavbar() {
  const navbarContainer = document.getElementById('navbar-container');
  if (navbarContainer) {
    navbarContainer.innerHTML = `
      <nav class="navbar">
        <div class="nav-container">
          <a href="index.html" class="logo-text">Yamaha Showroom</a>
          <button id="hamburger" class="hamburger">☰</button>
          <ul id="nav-links" class="nav-links">
            <li><a href="#" class="nav-link">Home</a></li>
            <li><a href="#" class="nav-link">About</a></li>
            <li><a href="#services" class="nav-link">Services</a></li>
            <li><a href="#" class="nav-link">Contact</a></li>
          </ul>
        </div>
      </nav>
    `;
    
    // Attach event to hamburger menu
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("nav-links");
    
    if (hamburger && navLinks) {
      hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("show");
      });
    }
    
    // Set up services link click handler
    const servicesLink = document.querySelector('a.nav-link[href="#services"]');
    if (servicesLink) {
      servicesLink.addEventListener('click', function(e) {
        e.preventDefault();
        const servicesSection = document.querySelector('.services');
        if (servicesSection) {
          scrollToElement(servicesSection);
        }
      });
    }
  }
}

// Function to smoothly scroll to an element
function scrollToElement(element) {
  // Calculate header height to offset scroll position
  const navbar = document.querySelector('.navbar');
  const navbarHeight = navbar ? navbar.offsetHeight : 0;
  
  // Get the element's position
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - navbarHeight - 20; // 20px extra padding
  
  // Scroll to the element
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

// Set up smooth scrolling for all anchor links
function setupSmoothScrolling() {
  // Add ID to services section if it doesn't have one
  const servicesSection = document.querySelector('.services');
  if (servicesSection && !servicesSection.id) {
    servicesSection.id = 'services';
  }
  
  // Set up click handler for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return; // Skip if it's just "#"
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        scrollToElement(targetElement);
      }
    });
  });
}

// Initialize back to top button functionality
function initBackToTop() {
  const backToTopButton = document.getElementById('backToTop');
  
  if (!backToTopButton) return;
  
  // Show/hide the button based on scroll position
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  });
  
  // Scroll to top when clicked
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Add scroll effects for various elements
function initScrollEffects() {
  // Navbar color change on scroll
  const navbar = document.querySelector('.navbar');
  
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }
  
  // Animate elements on scroll
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.paragraph, .services, .pics, .pct');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      // If element is in viewport
      if (elementPosition < windowHeight - 100) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });
  };
  
  // Initial check and add scroll listener
  animateOnScroll();
  window.addEventListener('scroll', animateOnScroll);
}

// Animate service items with staggered effect
function animateServiceItems() {
  const serviceItems = document.querySelectorAll('.serv li');
  
  serviceItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    item.style.transitionDelay = `${0.1 * index}s`;
    
    setTimeout(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateX(0)';
    }, 500);
  });
}

// Add image lazy loading
function setupLazyLoading() {
  const images = document.querySelectorAll('.piz, .pict');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src');
          
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
          }
          
          observer.unobserve(img);
        }
      });
    });
    
    images.forEach(img => {
      observer.observe(img);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    images.forEach(img => {
      const src = img.getAttribute('data-src');
      if (src) {
        img.src = src;
        img.removeAttribute('data-src');
      }
    });
  }
}