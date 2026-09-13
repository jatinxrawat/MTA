import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Fade in only after scrolling past the hero section
      if (window.scrollY > 420) {
        setVisible(true);
      } else {
        setVisible(false);
      }
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
