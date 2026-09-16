import React from 'react';

/**
 * Official Institutional Seal for Mother Teresa Academy, Baraut.
 * Displays the verified school logo:
 * - Deep navy outer ring with "MOTHER TERESA ACADEMY • BARAUT"
 * - Inner motto arc: "YOUR CHILD IS OUR CONCERN"
 * - Central portrait of Mother Teresa holding a child with "MTA"
 * - Stylized welcoming hands in gold and royal purple
 * - Circular styling with crisp white/neutral rim and drop shadow
 */
export default function CrestLogo({ size = 120, animated = false, variant = "hero", className = "" }) {
  const animClass = animated ? "crest-official-reveal" : "";

  return (
    <div
      className={`crest-logo-wrapper ${animClass} ${className}`}
      style={{
        width: size,
        height: size,
        maxWidth: '100%',
        aspectRatio: '1 / 1',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        filter: 'drop-shadow(0 6px 18px rgba(0, 0, 0, 0.45))',
      }}
    >
      <img
        src="/school-logo.png"
        alt="Mother Teresa Academy Baraut Official Emblem"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
          background: 'transparent',
        }}
        loading={animated ? "eager" : "lazy"}
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
    </div>
  );
}
