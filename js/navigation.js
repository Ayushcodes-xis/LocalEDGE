/**
 * LocalEdge India - Navigation Module
 * File: 06. js/navigation.js
 * Description: Manages scroll states, mobile menu toggle, iOS-safe scroll locking, 
 * focus trapping, and active route highlighting.
 */

const navigation = (() => {
  let scrollY = 0;
  let isMenuOpen = false;

  const DOM = {
    nav: null,
    hamburger: null,
    menuOverlay: null,
    links: null,
    body: document.body
  };

  /**
   * Evaluates the scroll position and adds/removes the scrolled class.
   */
  const handleScroll = () => {
    if (window.scrollY > 80) {
      DOM.nav.classList.add('nav--scrolled');
    } else {
      DOM.nav.classList.remove('nav--scrolled');
    }
  };

  /**
   * Toggles the mobile menu open/closed and manages the iOS-safe scroll lock.
   */
  const toggleMenu = () => {
    isMenuOpen = !isMenuOpen;
    DOM.hamburger.setAttribute('aria-expanded', isMenuOpen);
    
    if (isMenuOpen) {
      // Store current scroll position
      scrollY = window.scrollY;
      
      // Apply iOS-safe scroll lock
      DOM.body.style.position = 'fixed';
      DOM.body.style.top = `-${scrollY}px`;
      DOM.body.style.width = '100%';
      
      DOM.body.classList.add('menu-open');
      
      // Move focus to first element in menu for accessibility
      setTimeout(() => {
        const firstFocusable = DOM.menuOverlay.querySelector('a, button');
        if (firstFocusable) firstFocusable.focus();
      }, 400); // Wait for transition
      
    } else {
      // Remove scroll lock
      DOM.body.style.position = '';
      DOM.body.style.top = '';
      DOM.body.style.width = '';
      DOM.body.classList.remove('menu-open');
      
      // Restore scroll position
      window.scrollTo(0, scrollY);
      
      // Return focus to hamburger
      DOM.hamburger.focus();
    }
  };

  /**
   * Traps focus within the mobile menu when it is open.
   */
  const handleKeydown = (e) => {
    if (!isMenuOpen) return;

    if (e.key === 'Escape') {
      toggleMenu();
      return;
    }

    if (e.key === 'Tab') {
      const focusableElements = DOM.menuOverlay.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select'
      );
      
      if (!focusableElements.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  };

  /**
   * Highlights the current page in the navigation links.
   */
  const setActiveLink = () => {
    const currentPath = window.location.pathname;
    // Extract just the filename for comparison (e.g., 'about.html')
    const currentFile = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

    DOM.links.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentFile) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('is-active');
        link.removeAttribute('aria-current');
      }
    });
  };

  const init = () => {
    DOM.nav = document.querySelector('.nav');
    DOM.hamburger = document.querySelector('.hamburger');
    DOM.menuOverlay = document.querySelector('.menu-overlay');
    DOM.links = document.querySelectorAll('.nav__link');

    if (!DOM.nav) return;

    // Initial checks
    handleScroll();
    setActiveLink();

    // Event Listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    if (DOM.hamburger) {
      DOM.hamburger.addEventListener('click', toggleMenu);
    }

    document.addEventListener('keydown', handleKeydown);
  };

  return { init };
})();
        
