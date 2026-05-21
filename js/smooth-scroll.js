/**
 * LocalEdge India - Smooth Scroll Module
 * File: 07. js/smooth-scroll.js
 * Description: Initializes Lenis for smooth scrolling, respects motion accessibility 
 * preferences, and syncs the requestAnimationFrame with GSAP.
 */

const smoothScroll = (() => {
  let lenisInstance = null;

  const init = () => {
    // 1. Check for user's motion preferences (Motion Accessibility rule)
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 2. Initialize Lenis
    lenisInstance = new Lenis({
      smooth: !prefersReduced,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Matches --ease-out-expo behavior
      direction: 'vertical',
      gestureDirection: 'vertical',
      smoothTouch: false, // Don't hijack native touch scrolling
      touchMultiplier: 2
    });

    // 3. Integrate with GSAP Ticker (Mandatory Order Step 3)
    if (typeof gsap !== 'undefined') {
      gsap.ticker.add((time) => {
        lenisInstance.raf(time * 1000);
      });
      
      gsap.ticker.lagSmoothing(0);
    } else {
      // Fallback RAF loop if GSAP isn't loaded (failsafe)
      const raf = (time) => {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }

    // 4. Handle smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    anchorLinks.forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          e.preventDefault();
          
          // Offset accounts for the fixed navigation bar
          lenisInstance.scrollTo(targetElement, {
            offset: -100, 
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          });

          // Focus management for accessibility after scrolling
          targetElement.setAttribute('tabindex', '-1');
          targetElement.addEventListener('blur', () => targetElement.removeAttribute('tabindex'), { once: true });
          targetElement.focus({ preventScroll: true });
        }
      });
    });
  };

  return { 
    init,
    get lenis() { return lenisInstance; }
  };
})();
                                                        
