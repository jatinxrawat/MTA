import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Phone, MessageSquare } from 'lucide-react';
import '../styles/floating-actions.css';

/**
 * FloatingQuickActions: Right-docked quick-contact pills (WhatsApp, Contact Now, Fee, Location).
 * Renders on public pages, automatically hidden in admin area.
 */
export default function FloatingQuickActions({ onOpenInquiry }) {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const handleScrollToSection = (targetPath, targetHash) => {
    if (location.pathname === targetPath) {
      const el = document.getElementById(targetHash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <aside className="floating-quick-dock" aria-label="Quick Action Contacts">
      {/* 1. Single Unified Contact / WhatsApp Button (Vibrant Emerald Green) */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          if (onOpenInquiry) onOpenInquiry();
        }}
        className="quick-dock-btn dock-whatsapp"
        title="Contact Admissions Desk / WhatsApp (+91 95576 67999)"
        aria-label="Contact & WhatsApp Admissions"
      >
        <span className="dock-icon-box">
          <span className="dock-whatsapp-icon">💬</span>
        </span>
        <span className="dock-label-box">Contact / WhatsApp</span>
      </button>

      {/* 2. Fee Structure / Statutory Fees (Gold/Amber) -> Directly to #fee-structure */}
      <Link
        to="/cbse-disclosure#fee-structure"
        onClick={() => handleScrollToSection('/cbse-disclosure', 'fee-structure')}
        className="quick-dock-btn dock-fee"
        title="CBSE Approved Fee Structure (2025–26)"
        aria-label="View Fee Structure"
      >
        <span className="dock-icon-box">
          <span className="dock-icon-symbol">₹</span>
        </span>
        <span className="dock-label-box">Fee Schedule</span>
      </Link>

      {/* 3. Campus Location (Vibrant Orange) -> Directly to #campus-location */}
      <Link
        to="/contact#campus-location"
        onClick={() => handleScrollToSection('/contact', 'campus-location')}
        className="quick-dock-btn dock-location"
        title="Campus Coordinates & Directions (Baraut)"
        aria-label="Campus Location"
      >
        <span className="dock-icon-box">
          <MapPin size={20} strokeWidth={2.2} />
        </span>
        <span className="dock-label-box">Location / Map</span>
      </Link>
    </aside>
  );
}

