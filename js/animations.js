/**
 * LocalEdge India - Animations Module
 * File: 08. js/animations.js
 * Description: GSAP ScrollTrigger configurations for text reveals, image wipes, 
 * and desktop parallax effects.
 */

const animations = (() => {
  const init = () => {
    // Ensure GSAP and ScrollTrigger are loaded via CDN
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP or ScrollTrigger not loaded.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Respect user motion preferences (CSS handles the static fallback)
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    /* ==========================================================================
       1. SCROLL REVEAL (.js-reveal)
       ========================================================================== */
    // Using batch for optimized performance and coordinated staggering
    ScrollTrigger.batch(".js-reveal", {
      start: "top 85%",
      onEnter: (elements) => {
        gsap.to(elements, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "expo.out",
          overwrite: true
        });
      }
    });

    /* ==========================================================================
       2. IMAGE WIPE REVEAL (.js-image-reveal)
       ========================================================================== */
    const imageReveals = document.querySelectorAll(".js-image-reveal");
    
    imageReveals.forEach((wrapper) => {
      const inner = wrapper.querySelector(".js-image-reveal__inner");
      if (!inner) return;

      gsap.fromTo(inner, 
        { 
          clipPath: "inset(100% 0% 0% 0%)", 
          scale: 1.08 
        },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          scale: 1,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: {
            trigger: wrapper,
            start: "top 85%"
          }
        }
      );
    });

    /* ==========================================================================
       3. HERO PARALLAX (Desktop Only)
       ========================================================================== */
    // GSAP matchMedia ensures parallax logic is entirely removed on mobile
    const mm = gsap.matchMedia();
    
    mm.add("(min-width: 768px)", () => {
      const heroParallaxImages = document.querySelectorAll(".js-parallax-hero");
      
      heroParallaxImages.forEach((image) => {
        // Trigger based on the parent wrapper to maintain accurate scroll bounds
        const wrapper = image.closest('figure') || image.parentElement;
        
        gsap.to(image, {
          yPercent: -15,
          ease: "none",
          scrollTrigger: {
            trigger: wrapper,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        });
      });
    });
  };

  return { init };
})();

