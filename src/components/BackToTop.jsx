import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const rafPending = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      // Throttle state updates to one per animation frame
      if (rafPending.current) return;
      rafPending.current = true;

      requestAnimationFrame(() => {
        rafPending.current = false;
        setVisible(window.scrollY > 420);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={`floating-back-to-top ${visible ? 'is-visible' : ''}`}
      aria-label="Back to top of page"
      title="Back to top"
    >
      <ArrowUp size={18} />
      <span className="back-to-top-text">Top</span>
    </button>
  );
}
