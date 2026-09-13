import { useState, useEffect, useRef } from 'react';

/**
 * useCountUp:
 * Animates numbers smoothly from 0 to target value when the referenced element enters the viewport.
 * Handles prefixes/suffixes (e.g. "100%", "25+", "15:1", "2015").
 */
export function useCountUp(targetNumber, duration = 1600, options = { threshold: 0.2 }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Respect reduced motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayValue(targetNumber);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        let startTimestamp = null;

        const step = (timestamp) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          // Ease-out cubic curve
          const easeOut = 1 - Math.pow(1 - progress, 3);
          setDisplayValue(Math.floor(easeOut * targetNumber));

          if (progress < 1) {
            window.requestAnimationFrame(step);
          } else {
            setDisplayValue(targetNumber);
          }
        };

        window.requestAnimationFrame(step);
        observer.unobserve(element);
      }
    }, options);

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [targetNumber, duration]);

  return [ref, displayValue];
}
