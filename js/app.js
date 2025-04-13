// app.js

document.addEventListener("DOMContentLoaded", () => {
    fetch('navbar.html') // Adjust the path if needed
      .then(res => res.text())
      .then(data => {
        const navbarContainer = document.getElementById('navbar-container');
        if (navbarContainer) {
          navbarContainer.innerHTML = data;
  
          // Wait for the DOM to update, then attach event
          const hamburger = document.getElementById("hamburger");
          const navLinks = document.getElementById("nav-links");
  
          if (hamburger && navLinks) {
            hamburger.addEventListener("click", () => {
              navLinks.classList.toggle("show");
            });
          }
        }
      });
  });
  