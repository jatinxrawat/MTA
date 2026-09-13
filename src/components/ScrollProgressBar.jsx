import React, { useState, useEffect } from 'react';

/**
 * ScrollProgressBar:
 * An understated, elegant gold reading progress indicator fixed at the very top of the viewport.
 * Dynamically tracks scroll progress through the current page with a subtle gold glow.
 */
export default function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      const currentProgress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="global-scroll-progress-container"
      role="progressbar"
      aria-valuenow={Math.round(scrollProgress)}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label="Page scroll progress"
    >
      <div
        className="global-scroll-progress-bar"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}
