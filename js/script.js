/**
 * LocalEdge India - Main Orchestrator
 * File: 11. js/script.js
 * Description: Initializes all modules in strict dependency order, manages page-specific 
 * initializations, and handles standalone UI logic like the FAQ accordion.
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // Page detection for conditional module initialization
  const pageName = document.documentElement.dataset.page || 'index';

  /* ==========================================================================
     1. INITIALIZE SMOOTH SCROLL (Lenis)
     ========================================================================== */
  if (typeof smoothScroll !== 'undefined') {
    smoothScroll.init();
  }

  /* ==========================================================================
     2. INITIALIZE NAVIGATION SYSTEM
     ========================================================================== */
  if (typeof navigation !== 'undefined') {
    navigation.init();
  }

  /* ==========================================================================
     3. INITIALIZE ANIMATIONS (GSAP + ScrollTrigger)
     Must run strictly AFTER Lenis initialization to ensure accurate coordinates.
     ========================================================================== */
  if (typeof animations !== 'undefined') {
    animations.init();
  }

  /* ==========================================================================
     4. INITIALIZE INTERACTIONS
     Modules are resilient and exit early if elements are missing, but we 
     explicitly fire based on component presence.
     ========================================================================== */
  if (typeof interactions !== 'undefined') {
    interactions.initTestimonials();
    interactions.initServiceSwap();
    
    if (pageName === 'work') {
      interactions.initFilter();
    }
  }

  /* ==========================================================================
     5. INITIALIZE FORM LOGIC
     ========================================================================== */
  if (typeof form !== 'undefined') {
    if (pageName === 'contact') {
      form.init();
    }
  }

  /* ==========================================================================
     FAQ ACCORDION LOGIC
     Implemented natively here as requested, tracking data-open states and 
     managing JS-calculated heights for smooth CSS transitions.
     ========================================================================== */
  const initFAQ = () => {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    // Establish baseline accessibility and layout states
    faqItems.forEach(item => {
      item.setAttribute('data-open', 'false');
      
      const trigger = item.querySelector('.faq-trigger');
      const answer = item.querySelector('.faq-answer');
      
      if (trigger && answer) {
        trigger.setAttribute('aria-expanded', 'false');
        answer.setAttribute('aria-hidden', 'true');
        answer.style.height = '0';
      }
    });

    const faqTriggers = document.querySelectorAll('.faq-trigger');

    faqTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const currentItem = trigger.closest('.faq-item');
        const isOpen = currentItem.getAttribute('data-open') === 'true';
        const controlsId = trigger.getAttribute('aria-controls');
        const answer = document.getElementById(controlsId);
        
        if (!answer) return;

        // Enforce "One open at a time" rule by closing all others
        if (!isOpen) {
          faqItems.forEach(otherItem => {
            if (otherItem !== currentItem && otherItem.getAttribute('data-open') === 'true') {
              otherItem.setAttribute('data-open', 'false');
              
              const otherTrigger = otherItem.querySelector('.faq-trigger');
              const otherAnswer = otherItem.querySelector('.faq-answer');
              
              if (otherTrigger) {
                otherTrigger.setAttribute('aria-expanded', 'false');
              }
              if (otherAnswer) {
                otherAnswer.style.height = '0';
                otherAnswer.setAttribute('aria-hidden', 'true');
              }
            }
          });
        }

        // Toggle the clicked accordion
        if (isOpen) {
          // Close it
          currentItem.setAttribute('data-open', 'false');
          trigger.setAttribute('aria-expanded', 'false');
          answer.style.height = '0';
          answer.setAttribute('aria-hidden', 'true');
        } else {
          // Open it (calculating scrollHeight for fluid CSS transition)
          currentItem.setAttribute('data-open', 'true');
          trigger.setAttribute('aria-expanded', 'true');
          answer.style.height = answer.scrollHeight + 'px';
          answer.setAttribute('aria-hidden', 'false');
        }
      });
    });
  };

  initFAQ();
});
                                         
