import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Phone } from 'lucide-react';
import '../styles/floating-actions.css';

/**
 * FloatingQuickActions: Right-docked quick-contact pills inspired by reference school site.
 * Renders on public pages, automatically hidden in admin area.
 */
export default function FloatingQuickActions({ onOpenInquiry }) {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside className="floating-quick-dock" aria-label="Quick Action Contacts">
      {/* 1. Fee Structure / Statutory Fees (Gold/Amber) */}
      <Link
        to="/cbse-disclosure"
        onClick={handleNavClick}
        className="quick-dock-btn dock-fee"
        title="CBSE Fee Structure (2025–26)"
        aria-label="View Fee Structure"
      >
        <span className="dock-icon-box">
          <span className="dock-icon-symbol">₹</span>
        </span>
        <span className="dock-label-box">Fee Structure</span>
      </Link>

      {/* 2. Campus Location (Vibrant Orange) */}
      <Link
        to="/contact"
        onClick={handleNavClick}
        className="quick-dock-btn dock-location"
        title="Campus Coordinates & Directions (Baraut)"
        aria-label="Campus Location"
      >
        <span className="dock-icon-box">
          <MapPin size={20} strokeWidth={2.2} />
        </span>
        <span className="dock-label-box">Location</span>
      </Link>

      {/* 3. Admissions Helpline / Call (Royal Blue) */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          if (onOpenInquiry) onOpenInquiry();
        }}
        className="quick-dock-btn dock-phone"
        title="Admissions Helpline: +91 95576 67999"
        aria-label="Admissions Enquiry"
      >
        <span className="dock-icon-box">
          <Phone size={19} strokeWidth={2.2} />
        </span>
        <span className="dock-label-box">Enquire Now</span>
      </button>
    </aside>
  );
}
