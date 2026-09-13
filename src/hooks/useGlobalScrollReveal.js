import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * useGlobalScrollReveal:
 * Automatically finds and reveals editorial headers, feature cards, gallery items,
 * metric boxes, and prospectus elements across the current page as they scroll into view.
 * Re-runs cleanly on every React Router location change.
 */
export function useGlobalScrollReveal() {
  const location = useLocation();

  useEffect(() => {
    // If user prefers reduced motion, make all reveal targets visible immediately
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const allTargets = document.querySelectorAll(
        '.scroll-reveal-item, .scroll-reveal-auto, .editorial-section-header, .pillar-feature-card, .house-item-box, .gallery-preview-card, .event-editorial-card, .stream-card, .infra-metric-card, .leadership-card, .disclosure-card, .academic-table-container'
      );
      allTargets.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    // Target selector for elements across the entire website
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

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.18,
        rootMargin: '0px',
      }
    );

    // Observe immediately
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
