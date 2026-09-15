import { useEffect, useRef, useState } from 'react';

/**
 * Lightweight IntersectionObserver hook for subtle scroll-triggered reveals.
 * Automatically respects prefers-reduced-motion by becoming visible immediately.
 */
export function useScrollReveal(options = { threshold: 0.18, rootMargin: '0px' }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // On mobile or reduced motion — show immediately, skip observer
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(element);
      }
    }, options);

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  return [ref, isVisible];
}
