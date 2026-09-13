import React from 'react';
import CrestLogo from './CrestLogo';
import { schoolData } from '../data/schoolData';
import '../styles/hero.css';

/**
 * Full-Screen Opening Photo (100vh):
 * Pure photograph opening with no navbar clutter and no cards.
 * Features:
 * - Edge-to-edge photograph of the school exterior
 * - Official crest with animated SVG draw on load
 * - School name & tagline
 * - Subtle scroll cue
 */
export default function Hero({ onScrollClick }) {
  const { name, mottoTranslation, affiliationStatus, location } = schoolData.general;

  const handleScrollDown = () => {
    if (onScrollClick) {
      onScrollClick();
    } else {
      const target = document.getElementById('about');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="hero-viewport" aria-label="School Entrance Hero">
      {/* Edge-to-Edge School Exterior Photo */}
      <img
        src="/school-hero.jpg"
        alt="Mother Teresa Academy Campus Architecture, Baraut"
        className="hero-background-image"
        loading="eager"
        fetchpriority="high"
      />

      {/* Atmospheric Vignette & Scrim */}
      <div className="hero-overlay-scrim" />

      {/* Hero Center Overlay Content */}
      <div className="hero-content">
        {/* Animated Hand-Drawn Crest on Page Load */}
        <div className="hero-crest-container">
          <CrestLogo size={200} animated={true} variant="brass" />
        </div>

        {/* Affiliation Bar */}
        <div className="hero-affiliation-badge hero-tagline-reveal">
          CBSE Senior Secondary Co-Educational Institution
        </div>

        {/* School Name */}
        <h1 className="hero-school-name hero-stately-reveal">
          {name}
        </h1>

        {/* School Tagline / Motto */}
        <p className="hero-tagline hero-tagline-reveal">
          "{mottoTranslation}"
        </p>

        {/* Location Subtext */}
        <div className="hero-location-sub hero-scroll-reveal">
          Baraut, District Baghpat, Uttar Pradesh
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
