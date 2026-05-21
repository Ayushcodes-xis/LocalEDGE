/**
 * LocalEdge India - Interactions Module
 * File: 09. js/interactions.js
 * Description: Manages component-level interactions including the testimonial slider,
 * portfolio filtering, and service image hover swap logic. Includes accessibility
 * enhancements for screen readers and keyboard users.
 */

const interactions = (() => {

  /**
   * Initializes the Testimonial Slider
   * Requirements: opacity transitions, keyboard navigation, aria-live updates, dot indicators.
   */
  const initTestimonials = () => {
    const slider = document.querySelector('.testimonial-slider');
    if (!slider) return;

    const slides = Array.from(slider.querySelectorAll('.testimonial-slide'));
    const prevBtn = slider.querySelector('.slider-prev');
    const nextBtn = slider.querySelector('.slider-next');
    const dots = Array.from(slider.querySelectorAll('.slider-dot'));
    
    if (slides.length === 0) return;

    let currentIndex = 0;

    // Create an ARIA live region dynamically for screen reader announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    slider.appendChild(liveRegion);

    // Make slider focusable to capture keyboard events
    if (!slider.hasAttribute('tabindex')) {
      slider.setAttribute('tabindex', '0');
    }

    const updateSlider = (newIndex) => {
      // Remove active states from current
      slides[currentIndex].classList.remove('is-active');
      slides[currentIndex].setAttribute('aria-hidden', 'true');
      if (dots[currentIndex]) {
        dots[currentIndex].classList.remove('is-active');
        dots[currentIndex].setAttribute('aria-selected', 'false');
      }

      // Update index
      currentIndex = newIndex;

      // Add active states to new
      slides[currentIndex].classList.add('is-active');
      slides[currentIndex].setAttribute('aria-hidden', 'false');
      if (dots[currentIndex]) {
        dots[currentIndex].classList.add('is-active');
        dots[currentIndex].setAttribute('aria-selected', 'true');
      }

      // Update screen reader text
      const authorElement = slides[currentIndex].querySelector('.testimonial-author');
      const authorText = authorElement ? authorElement.textContent : `Testimonial ${currentIndex + 1}`;
      liveRegion.textContent = `Showing ${authorText}`;
    };

    // Initial accessibility setup
    slides.forEach((slide, index) => {
      slide.setAttribute('aria-hidden', index !== currentIndex ? 'true' : 'false');
    });

    // Event Listeners: Buttons
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const newIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
        updateSlider(newIndex);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const newIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
        updateSlider(newIndex);
      });
    }

    // Event Listeners: Dots
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => updateSlider(index));
      dot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          updateSlider(index);
        }
      });
    });

    // Event Listeners: Keyboard Navigation
    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const newIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
        updateSlider(newIndex);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const newIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
        updateSlider(newIndex);
      }
    });
  };

  /**
   * Initializes the Work/Portfolio Filtering system
   * Requirements: toggle display block/none, accessible active states.
   */
  const initFilter = () => {
    const filterNav = document.querySelector('#work-filter');
    if (!filterNav) return;

    const filterBtns = filterNav.querySelectorAll('[data-filter]');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (!filterBtns.length || !portfolioItems.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active state from all buttons
        filterBtns.forEach(b => {
          b.classList.remove('is-active');
          b.setAttribute('aria-pressed', 'false');
        });
        
        // Set active state on clicked button
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');

        // Filter the grid items
        const filterValue = btn.getAttribute('data-filter');
        
        portfolioItems.forEach(item => {
          const itemCategory = item.getAttribute('data-category');
          
          if (filterValue === 'all' || itemCategory === filterValue) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  };

  /**
   * Initializes the Service Hover Image Swap (Desktop primarily)
   * Requirements: fade transition between absolutely positioned images based on hovered list item.
   */
  const initServiceSwap = () => {
    const serviceItems = document.querySelectorAll('.service-item');
    const serviceImages = document.querySelectorAll('.services-image-stack img');

    if (!serviceItems.length || !serviceImages.length) return;

    // Use index mapping to guarantee alignment between list items and absolute image stack
    serviceItems.forEach((item, index) => {
      item.addEventListener('mouseenter', () => {
        
        // Remove active class from all images in the stack
        serviceImages.forEach(img => {
          img.classList.remove('service-image--active');
        });
        
        // Add active class to the corresponding image
        if (serviceImages[index]) {
          serviceImages[index].classList.add('service-image--active');
        }
      });
    });
  };

  return {
    initTestimonials,
    initFilter,
    initServiceSwap
  };
})();
          
