import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function PageHeader({ title, subtitle, breadcrumb, badge }) {
  return (
    <header className="subpage-hero-header" role="banner">
      <div className="container">
        {/* Breadcrumb Path */}
        <nav aria-label="Breadcrumb" className="subpage-breadcrumb">
          <Link to="/" className="breadcrumb-link">
            <Home size={14} style={{ marginRight: '4px' }} />
            Home
          </Link>
          <ChevronRight size={13} className="breadcrumb-arrow" />
          <span className="breadcrumb-current">{breadcrumb || title}</span>
        </nav>

        {/* Optional Badge */}
        {badge && (
          <div className="subpage-badge-pill">
            {badge}
          </div>
        )}

        {/* Page Title */}
        <h1 className="subpage-main-title">{title}</h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="subpage-sub-lead">{subtitle}</p>
        )}

        {/* Brass Prospectus Gem Rule */}
        <div className="prospectus-rule" style={{ margin: '1.75rem 0 0' }}>
          <span className="prospectus-rule-gem" />
        </div>
      </div>
    </header>
  );
}
