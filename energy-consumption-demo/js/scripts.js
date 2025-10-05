/**
 * Enhanced PowerHub Data Story Navigation
 * Academic-focused with accessibility and mobile support
 */

// Page navigation setup
document.getElementById('logo').onclick = () => showPage('home');
document.getElementById('nav-home').onclick = () => showPage('home');
document.getElementById('nav-televisions').onclick = () => showPage('televisions');
document.getElementById('nav-about').onclick = () => showPage('about');

// Enhanced page loading with academic focus
function showPage(page) {
  const contentDiv = document.getElementById('content');
  
  // Add loading animation
  contentDiv.classList.add('loading');
  contentDiv.style.opacity = '0.5';
  
  // Map page names to file names
  const pageMap = {
    home: 'home.html',
    televisions: 'televisions.html',
    about: 'aboutus.html'
  };
  
  // Academic page titles
  const titles = {
    home: 'TV Energy Consumption Data Story - PowerHub',
    televisions: 'TV Energy Guide - PowerHub',
    about: 'About This Study - PowerHub'
  };
  
  // Fetch page content with enhanced error handling
  fetch(pageMap[page])
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then(html => {
      // Smooth transition effect
      setTimeout(() => {
        contentDiv.innerHTML = html;
        contentDiv.style.opacity = '1';
        contentDiv.classList.remove('loading');
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active');
        });
        const activeNavLink = document.getElementById('nav-' + page);
        if (activeNavLink) {
          activeNavLink.classList.add('active');
        }
        
        // Update page title
        document.title = titles[page] || 'PowerHub Data Story';
        
        // Update history state if not already set
        if (!history.state || history.state.page !== page) {
          history.pushState({ page: page }, titles[page], window.location.pathname);
        }
        
        // Scroll to top smoothly
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        
        // Initialize page-specific features
        initializePageFeatures();
        
      }, 150);
    })
    .catch(error => {
      console.error('Error loading page:', error);
      contentDiv.innerHTML = `
        <div style="text-align: center; padding: 40px;">
          <h2>Content Loading Error</h2>
          <p>We're having trouble loading this page. Please try refreshing or contact support.</p>
          <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; border-radius: 8px; border: none; background: var(--primary-teal); color: white; cursor: pointer;">Refresh Page</button>
        </div>
      `;
      contentDiv.style.opacity = '1';
      contentDiv.classList.remove('loading');
    });
}

// Mobile navigation functionality
class MobileNavigation {
  constructor() {
    this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    this.navMenu = document.querySelector('nav ul');
    this.init();
  }
  
  init() {
    if (this.mobileMenuToggle && this.navMenu) {
      this.mobileMenuToggle.addEventListener('click', () => {
        this.toggleMobileMenu();
      });
      
      // Close mobile menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!this.mobileMenuToggle.contains(e.target) && !this.navMenu.contains(e.target)) {
          this.closeMobileMenu();
        }
      });
      
      // Close mobile menu on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeMobileMenu();
        }
      });
      
      // Close mobile menu when nav link is clicked
      document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          this.closeMobileMenu();
        });
      });
    }
  }
  
  toggleMobileMenu() {
    const isOpen = this.navMenu.classList.contains('mobile-open');
    
    if (isOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }
  
  openMobileMenu() {
    this.navMenu.classList.add('mobile-open');
    this.mobileMenuToggle.classList.add('active');
    this.mobileMenuToggle.setAttribute('aria-expanded', 'true');
    
    // Focus first menu item for accessibility
    const firstLink = this.navMenu.querySelector('a');
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 100);
    }
  }
  
  closeMobileMenu() {
    this.navMenu.classList.remove('mobile-open');
    this.mobileMenuToggle.classList.remove('active');
    this.mobileMenuToggle.setAttribute('aria-expanded', 'false');
  }
}

// Chart image enhancement for academic presentation
function enhanceChartImages() {
  const chartImages = document.querySelectorAll('.chart-image');
  
  chartImages.forEach((img, index) => {
    // Add loading states
    img.addEventListener('loadstart', () => {
      img.classList.add('loading');
    });
    
    // Handle successful load
    img.addEventListener('load', () => {
      img.classList.remove('loading');
      img.classList.add('loaded');
    });
    
    // Handle load errors with academic-appropriate fallback
    img.addEventListener('error', () => {
      img.classList.remove('loading');
      img.classList.add('error');
      
      const fallback = document.createElement('div');
      fallback.className = 'chart-fallback';
      fallback.style.cssText = `
        background: var(--light-gray);
        padding: 2rem;
        border-radius: var(--border-radius);
        border: 2px dashed var(--border-color);
        text-align: center;
        color: var(--medium-text);
      `;
      fallback.innerHTML = `
        <h4>Chart Image Unavailable</h4>
        <p>Expected visualization: ${img.alt}</p>
        <small>File: ${img.src.split('/').pop()}</small>
      `;
      
      if (img.parentNode) {
        img.parentNode.insertBefore(fallback, img.nextSibling);
        img.style.display = 'none';
      }
    });
    
    // Add ARIA attributes for screen readers
    img.setAttribute('role', 'img');
    if (!img.hasAttribute('aria-describedby')) {
      const caption = img.parentNode.parentNode.querySelector('.chart-caption');
      if (caption && !caption.id) {
        caption.id = `chart-caption-${index + 1}`;
        img.setAttribute('aria-describedby', caption.id);
      }
    }
  });
}

// Accessibility enhancements
function enhanceAccessibility() {
  // Add landmark roles
  const main = document.querySelector('main');
  if (main) {
    main.setAttribute('role', 'main');
  }
  
  // Enhance navigation
  const nav = document.querySelector('nav');
  if (nav && !nav.hasAttribute('aria-label')) {
    nav.setAttribute('aria-label', 'Main navigation');
  }
  
  // Add skip navigation functionality
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(skipLink.getAttribute('href'));
      if (target) {
        target.focus();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
  
  // Enhance focus indicators
  const focusableElements = document.querySelectorAll(
    'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
  );
  
  focusableElements.forEach(element => {
    element.addEventListener('focus', () => {
      element.classList.add('focused');
    });
    
    element.addEventListener('blur', () => {
      element.classList.remove('focused');
    });
  });
}

// Initialize page-specific features
function initializePageFeatures() {
  // Re-enhance chart images for dynamically loaded content
  enhanceChartImages();
  
  // Add smooth scroll for any anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
  
  // Initialize lazy loading for images
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          img.classList.add('fade-in');
          imageObserver.unobserve(img);
        }
      });
    });
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
  }
}

// Enhanced keyboard navigation
function setupKeyboardNavigation() {
  document.addEventListener('keydown', function(e) {
    if (e.altKey && !e.ctrlKey && !e.shiftKey) {
      switch(e.key) {
        case '1':
          e.preventDefault();
          showPage('home');
          break;
        case '2':
          e.preventDefault();
          showPage('televisions');
          break;
        case '3':
          e.preventDefault();
          showPage('about');
          break;
      }
    }
  });
}

// Focus management for better accessibility
function setupFocusManagement() {
  // Ensure logo navigation works
  const logo = document.querySelector('#logo');
  if (logo) {
    logo.addEventListener('click', () => {
      // Navigate to home page instead of changing URL to '/'
      showPage('home');
      
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      // Update history state properly
      history.pushState({ page: 'home' }, 'TV Energy Consumption Data Story - PowerHub', window.location.pathname);
    });
    
    // Make logo keyboard accessible
    logo.setAttribute('tabindex', '0');
    logo.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        logo.click();
      }
    });
  }
}

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
  // Initialize mobile navigation
  new MobileNavigation();
  
  // Setup keyboard navigation
  setupKeyboardNavigation();
  
  // Enhance accessibility
  enhanceAccessibility();
  
  // Setup focus management
  setupFocusManagement();
  
  // Initialize with home page (data story)
  showPage('home');
  
  // Handle browser back/forward buttons
  window.addEventListener('popstate', function(e) {
    if (e.state && e.state.page) {
      showPage(e.state.page);
    } else {
      // Fallback to home if no state
      showPage('home');
    }
  });
  
  // Add history state for initial load
  history.replaceState({ page: 'home' }, 'TV Energy Consumption Data Story - PowerHub', window.location.pathname);
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    // Pause any animations when page is not visible
    document.body.classList.add('page-hidden');
  } else {
    // Resume animations when page becomes visible
    document.body.classList.remove('page-hidden');
  }
});

// Export for potential use in other modules
window.PowerHubDataStory = {
  showPage,
  MobileNavigation,
  enhanceChartImages,
  enhanceAccessibility
};