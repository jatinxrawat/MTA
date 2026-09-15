import React, { useRef, useEffect } from 'react';

/**
 * ScrollProgressBar:
 * Reads scroll position and writes directly to a DOM ref — zero React state,
 * zero re-renders on scroll. The scroll handler runs entirely off the React
 * commit cycle, eliminating 60 re-renders/sec during scrolling.
 */
export default function ScrollProgressBar() {
  const barRef = useRef(null);

  useEffect(() => {
    let rafPending = false;

    const handleScroll = () => {
      if (rafPending) return;
      rafPending = true;

      requestAnimationFrame(() => {
        rafPending = false;
        const bar = barRef.current;
        if (!bar) return;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight <= 0) {
          bar.style.transform = 'scaleX(0)';
          return;
        }
        const progress = Math.min(1, Math.max(0, window.scrollY / totalHeight));
        // Use transform: scaleX() — GPU composited, zero layout/paint
        bar.style.transform = `scaleX(${progress})`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="global-scroll-progress-container"
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label="Page scroll progress"
    >
      <div
        ref={barRef}
        className="global-scroll-progress-bar"
      />
    </div>
  );
}
