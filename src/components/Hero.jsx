import React from 'react';
import CrestLogo from './CrestLogo';
import { useCMS } from '../context/CMSContext';
import EditableText from './admin/EditableText';
import EditableImage from './admin/EditableImage';
import '../styles/hero.css';

/**
 * Full-Screen Opening Photo (100vh):
 * Pure photograph opening with live-editable content affordances.
 */
export default function Hero({ onScrollClick }) {
  const { content } = useCMS();
  const hero = content.hero || {};

  const handleScrollDown = () => {
    if (onScrollClick) {
      onScrollClick();
    } else {
      const target = document.getElementById('about') || document.getElementById('notice-board');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="hero-viewport" aria-label="School Entrance Hero">
      {/* Edge-to-Edge School Exterior Photo - Editable */}
      <EditableImage
        path="hero.backgroundImage"
        defaultSrc={hero.backgroundImage || "/gallery/main-campus-facade-daylight.jpg"}
        alt="Mother Teresa Academy Campus Architecture, Baraut"
        className="hero-background-image"
        loading="eager"
        fetchPriority="high"
      />

      {/* Atmospheric Vignette & Scrim */}
      <div className="hero-overlay-scrim" />

      {/* Hero Center Overlay Content */}
      <div className="hero-content">
        {/* Animated Hand-Drawn Crest on Page Load */}
        <div className="hero-crest-container">
          <CrestLogo size={200} animated={true} variant="brass" />
        </div>

        {/* Affiliation Bar - Editable */}
        <div className="hero-affiliation-badge hero-tagline-reveal">
          <EditableText
            path="hero.badge"
            fallback="CBSE Senior Secondary Co-Educational Institution"
            as="span"
          />
        </div>

        {/* School Name - Editable */}
        <h1 className="hero-school-name hero-stately-reveal">
          <EditableText
            path="hero.headline"
            fallback="Mother Teresa Academy"
            as="span"
          />
        </h1>

        {/* School Tagline / Motto - Editable */}
        <p className="hero-tagline hero-tagline-reveal">
          "
          <EditableText
            path="hero.motto"
            fallback="Your Child Is Our Concern"
            as="span"
          />
          "
        </p>

        {/* Location Subtext - Editable */}
        <div className="hero-location-sub hero-scroll-reveal">
          <EditableText
            path="hero.location"
            fallback="Baraut, District Baghpat, Uttar Pradesh"
            as="span"
          />
        </div>
      </div>

      {/* Subtle Bottom Scroll Cue (No heavy button, just refined scroll indicator) */}
      <button
        type="button"
        onClick={handleScrollDown}
        className="hero-scroll-cue hero-scroll-reveal"
        aria-label="Scroll down to read prospectus"
      >
        <span className="hero-scroll-label">Scroll to Prospectus</span>
        <div className="hero-scroll-line scroll-indicator-pulse" />
      </button>
    </section>
  );
}
