import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CrestLogo from './CrestLogo';
import { useCMS } from '../context/CMSContext';
import {
  Menu,
  X,
  Home,
  BookOpen,
  GraduationCap,
  Users,
  Building2,
  FileCheck,
  MapPin,
  Send,
  Image as ImageIcon,
  Bookmark,
} from 'lucide-react';
import '../styles/navigation.css';

export default function Navigation({ onOpenInquiry }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { content } = useCMS();

  // Retrieve published custom pages configured to appear in menu
  const customPages = (content.customPages || []).filter(
    (p) => p.isPublished !== false && p.showInMenu !== false
  );

  const baseNavLinks = [
    { label: 'Home Page', path: '/', icon: Home },
    { label: 'About MTA', path: '/about', icon: BookOpen },
    { label: 'Academics & Results', path: '/academics', icon: GraduationCap },
    { label: 'Faculty & Staff', path: '/staff', icon: Users },
    { label: 'Campus Infrastructure', path: '/infrastructure', icon: Building2 },
    { label: 'Our Gallery', path: '/gallery', icon: ImageIcon },
    {
      label: 'CBSE Mandatory Disclosure',
      path: '/cbse-disclosure',
      icon: FileCheck,
      badge: 'CBSE IX',
    },
  ];

  const dynamicCustomLinks = customPages.map((page) => ({
    label: page.menuLabel || page.title,
    path: `/pages/${page.slug}`,
    icon: Bookmark,
    badge: page.menuBadge || null,
  }));

  const navLinks = [
    ...baseNavLinks,
    ...dynamicCustomLinks,
    { label: 'Contact & Location', path: '/contact', icon: MapPin },
  ];

  return (
    <>
      {/* Floating Sidebar Toggle Button (Always visible on all pages) */}
      <button
        type="button"
        className="sidebar-toggle-pill"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open prospectus navigation sidebar"
        aria-expanded={sidebarOpen}
      >
        <Menu size={18} style={{ color: 'var(--color-brass-light)' }} />
        <span>Menu</span>
        <span className="sidebar-toggle-badge">Prospectus</span>
      </button>

      {/* Backdrop for closing sidebar */}
      <div
        className={`sidebar-backdrop ${sidebarOpen ? 'is-open' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden={!sidebarOpen}
      />

      {/* Vertical Sidebar Navigation Drawer */}
      <aside
        className={`prospectus-sidebar ${sidebarOpen ? 'is-open' : ''}`}
        aria-label="Prospectus Sidebar Navigation"
      >
        {/* Sidebar Header Brand Area */}
        <div className="sidebar-header">
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>

          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            className="sidebar-brand-link"
          >
            <div className="sidebar-logo-container">
              <CrestLogo size={62} animated={false} variant="light" />
            </div>
            <span className="sidebar-brand-name">Mother Teresa Academy</span>
            <span className="sidebar-brand-sub">CBSE SENIOR SECONDARY • BARAUT</span>
          </Link>
        </div>

        {/* Navigation Items List (Multi-Page Router Links) */}
        <nav style={{ flex: 1 }}>
          <ul className="sidebar-nav-list">
            {navLinks.map((link, idx) => {
              const IconComp = link.icon;
              const isActive = location.pathname === link.path;

              return (
                <li key={link.path} style={{ '--nav-idx': idx }}>
                  <Link
                    to={link.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`sidebar-nav-link ${isActive ? 'active' : ''}`}
                  >
                    <IconComp size={18} className="sidebar-nav-icon" />
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="sidebar-disclosure-badge">{link.badge}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Bottom Action Area */}
        <div className="sidebar-footer">
          <button
            type="button"
            className="btn-academic btn-academic-brass btn-sidebar-admissions"
            onClick={() => {
              setSidebarOpen(false);
              if (onOpenInquiry) onOpenInquiry();
            }}
          >
            <Send size={15} style={{ marginRight: '0.45rem' }} />
            Admissions Enquiry
          </button>

          <div className="sidebar-contact-info">
            <div>
              <strong>Campus:</strong> Chhaprauli Road, Baraut (Baghpat, U.P.)
            </div>
            <div>
              <strong>Affiliation:</strong> CBSE Senior Sec. (No: 2134272 | Code: 61658)
            </div>
            <div>
              <strong>Helpline:</strong> +91 95576 67999 / +91 70175 51638
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
