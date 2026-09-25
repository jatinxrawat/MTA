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

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappUrl = `https://wa.me/919557667999?text=${encodeURIComponent(
    'Hello Mother Teresa Academy, I would like to inquire about admissions.'
  )}`;

  return (
    <aside className="floating-quick-dock" aria-label="Quick Action Contacts">
      {/* 1. WhatsApp Quick Chat (Vibrant Emerald Green) */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="quick-dock-btn dock-whatsapp"
        title="Chat on WhatsApp (+91 95576 67999)"
        aria-label="Chat on WhatsApp"
      >
        <span className="dock-icon-box">
          <span className="dock-whatsapp-icon">💬</span>
        </span>
        <span className="dock-label-box">WhatsApp</span>
      </a>

      {/* 2. Admissions Helpline / Contact Now (Royal Blue) */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          if (onOpenInquiry) onOpenInquiry();
        }}
        className="quick-dock-btn dock-phone"
        title="Contact Admissions Desk / Enquire Now"
        aria-label="Contact Admissions"
      >
        <span className="dock-icon-box">
          <Phone size={19} strokeWidth={2.2} />
        </span>
        <span className="dock-label-box">Contact Now</span>
      </button>

      {/* 3. Fee Structure / Statutory Fees (Gold/Amber) */}
      <Link
        to="/cbse-disclosure"
        onClick={handleNavClick}
        className="quick-dock-btn dock-fee"
        title="CBSE Approved Fee Structure (2025–26)"
        aria-label="View Fee Structure"
      >
        <span className="dock-icon-box">
          <span className="dock-icon-symbol">₹</span>
        </span>
        <span className="dock-label-box">Fee Schedule</span>
      </Link>

      {/* 4. Campus Location (Vibrant Orange) */}
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
    </aside>
  );
}

