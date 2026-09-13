import React from 'react';
import { Link } from 'react-router-dom';
import CrestLogo from './CrestLogo';
import { schoolData } from '../data/schoolData';
import { ArrowUp } from 'lucide-react';
import '../styles/contact-footer.css';

export default function Footer() {
  const { name, mottoTranslation, affiliationNo, schoolCode, postalAddress, phonePrimary, emailPrimary } =
    schoolData.general;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="prospectus-footer" aria-label="Institutional Footer">
      <div className="container">
        <div className="footer-top-grid">
          {/* Col 1: School Identity & Crest */}
          <div className="footer-school-brand">
            <Link to="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
              <CrestLogo size={70} animated={false} variant="light" />
            </Link>
            <h3 className="footer-school-name">{name}</h3>
            <p className="footer-school-motto">"{mottoTranslation}"</p>
            <p style={{ fontSize: '0.86rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: '1.6' }}>
              A distinguished CBSE-affiliated Senior Secondary Institution dedicated to intellectual rigour and ethical leadership in Baraut, Western Uttar Pradesh.
            </p>
          </div>

          {/* Col 2: Prospectus Quick Links */}
          <div>
            <h4 className="footer-column-title">Prospectus Pages</h4>
            <ul className="footer-nav-list">
              <li className="footer-nav-item"><Link to="/">Home Overview</Link></li>
              <li className="footer-nav-item"><Link to="/about">About the Academy</Link></li>
              <li className="footer-nav-item"><Link to="/academics">Curriculum & 3-Yr Results</Link></li>
              <li className="footer-nav-item"><Link to="/staff">Faculty & Leadership</Link></li>
              <li className="footer-nav-item"><Link to="/infrastructure">Campus Infrastructure</Link></li>
              <li className="footer-nav-item"><Link to="/gallery" style={{ color: 'var(--color-brass-light)' }}>★ Our Photo Gallery</Link></li>
              <li className="footer-nav-item"><Link to="/contact">Contact & Admissions</Link></li>
            </ul>
          </div>

          {/* Col 3: Statutory & CBSE Disclosures */}
          <div>
            <h4 className="footer-column-title">Statutory Compliance</h4>
            <ul className="footer-nav-list">
              <li className="footer-nav-item">
                <Link to="/cbse-disclosure" style={{ color: 'var(--color-brass-light)', fontWeight: '600' }}>
                  ★ CBSE Mandatory Disclosure
                </Link>
              </li>
              <li className="footer-nav-item"><Link to="/cbse-disclosure">Appendix-IX Format</Link></li>
              <li className="footer-nav-item"><Link to="/cbse-disclosure">Statutory Certificates</Link></li>
              <li className="footer-nav-item"><Link to="/cbse-disclosure">Fee Structure (2025–26)</Link></li>
              <li className="footer-nav-item"><Link to="/cbse-disclosure">School Management Committee (SMC)</Link></li>
              <li className="footer-nav-item"><Link to="/cbse-disclosure">Parents Teachers Association (PTA)</Link></li>
            </ul>
          </div>

          {/* Col 4: Administrative Office & Affiliation */}
          <div>
            <h4 className="footer-column-title">CBSE Credentials</h4>
            <div style={{ fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.7' }}>
              <div><strong>Affiliation No:</strong> {affiliationNo}</div>
              <div><strong>School Code:</strong> {schoolCode}</div>
              <div style={{ marginTop: '0.75rem' }}>
                <strong>Campus:</strong> {postalAddress}
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <strong>Helpline:</strong> {phonePrimary}
              </div>
              <div>
                <strong>Email:</strong> {emailPrimary}
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Footer Bar */}
        <div className="footer-sub-bar">
          <div>
            © {new Date().getFullYear()} Mother Teresa Academy, Baraut (Baghpat, U.P.). All statutory rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span>CBSE Affiliated Senior Secondary Institution</span>
            <button
              type="button"
              onClick={scrollToTop}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'none',
                border: '1px solid rgba(223, 183, 92, 0.4)',
                color: 'var(--color-brass-light)',
                padding: '0.35rem 0.75rem',
                cursor: 'pointer',
                fontSize: '0.8rem',
              }}
              title="Return to top of page"
            >
              <ArrowUp size={14} /> Back to Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
