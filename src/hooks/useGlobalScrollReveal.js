import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * useGlobalScrollReveal:
 * Automatically finds and reveals editorial headers, feature cards, gallery items,
 * metric boxes, and prospectus elements across the current page as they scroll into view.
 * Re-runs cleanly on every React Router location change.
 *
 * Performance strategy:
 * - On mobile (≤768px) or reduced-motion: reveals all elements immediately, no observer needed.
 * - On desktop: adds will-change to each element just before observing it (not globally in CSS),
 *   and removes it via transitionend to free the GPU layer after animation completes.
 */
export function useGlobalScrollReveal() {
  const location = useLocation();

  useEffect(() => {
    const targetSelector = [
      '.scroll-reveal-item',
      '.scroll-reveal-auto',
      '.editorial-section-header',
      '.subpage-hero-header',
      '.about-academy-column',
      '.notice-board-compact-card',
      '.pillar-feature-card',
      '.house-item-box',
      '.gallery-preview-card',
      '.gallery-item',
      '.gallery-card-item',
      '.event-card',
      '.event-editorial-card',
      '.stream-card',
      '.infra-metric-card',
      '.leadership-card',
      '.disclosure-card',
      '.contact-card',
      '.about-sidebar-column',
      '.academic-table-container',
      '[data-reveal]',
    ].join(', ');

    // On mobile OR if user prefers reduced motion — reveal everything immediately, skip observer
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isMobile || prefersReducedMotion) {
      const allTargets = document.querySelectorAll(targetSelector);
      allTargets.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    // Cleanup function: removes will-change after the entrance transition ends
    // so the element's GPU layer is freed once it's statically positioned.
    const handleTransitionEnd = (e) => {
      if (e.propertyName === 'opacity' || e.propertyName === 'transform') {
        e.currentTarget.style.willChange = 'auto';
        e.currentTarget.removeEventListener('transitionend', handleTransitionEnd);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            // Promote GPU layer just before animation starts
            el.style.willChange = 'opacity, transform';
            // Small timeout to allow the browser to create the GPU layer
            // before the class change triggers the transition
            requestAnimationFrame(() => {
              el.classList.add('is-revealed');
              // Schedule will-change removal after transition completes
              el.addEventListener('transitionend', handleTransitionEnd);
            });
            observer.unobserve(el);
          }
        });
      },
      {
        threshold: 0.12, // slightly lower threshold — reveals elements sooner, reducing simultaneous animations
        rootMargin: '0px 0px -20px 0px',
      }
    );

    const timeoutId = setTimeout(() => {
      const elements = document.querySelectorAll(targetSelector);
      elements.forEach((el, idx) => {
        if (!el.style.getPropertyValue('--reveal-delay') && !el.style.getPropertyValue('--stagger-idx')) {
          el.style.setProperty('--stagger-idx', (idx % 6).toString());
        }
        observer.observe(el);
      });
    }, 10);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [location.pathname]);
}
