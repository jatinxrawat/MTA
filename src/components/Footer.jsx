import React from 'react';
import { Link } from 'react-router-dom';
import CrestLogo from './CrestLogo';
import { schoolData } from '../data/schoolData';
import { useCMS } from '../context/CMSContext';
import { ArrowUp } from 'lucide-react';
import '../styles/contact-footer.css';

export default function Footer() {
  const { content } = useCMS();
  const general = content.general || schoolData.general;
  const { name, mottoTranslation, affiliationNo, schoolCode, postalAddress, phonePrimary, emailPrimary } = general;

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
              <li className="footer-nav-item"><Link to="/">Home & Opening Overview</Link></li>
              <li className="footer-nav-item"><Link to="/about">About & Institutional Heritage</Link></li>
              <li className="footer-nav-item"><Link to="/academics">CBSE Academic Curriculum</Link></li>
              <li className="footer-nav-item"><Link to="/staff">Pedagogical Leadership & Faculty</Link></li>
              <li className="footer-nav-item"><Link to="/infrastructure">Campus Estates & Laboratories</Link></li>
              <li className="footer-nav-item"><Link to="/gallery">Campus Photo Gallery</Link></li>
              <li className="footer-nav-item"><Link to="/contact">Admissions Enquiry & Contact</Link></li>
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
              <div><strong>Affiliation No:</strong> {affiliationNo || '2134272'}</div>
              <div><strong>School Code:</strong> {schoolCode || '61658'}</div>
              <div style={{ marginTop: '0.65rem' }}>
                <strong>Campus:</strong> {postalAddress || 'Chhaprauli Road, Near Tarar Bhatta, Baraut, District Baghpat, Uttar Pradesh 250611'}
              </div>
              <div style={{ marginTop: '0.65rem' }}>
                <strong>Helplines:</strong> {phonePrimary || '+91 95576 67999'} / {general.phoneSecondary || '+91 70175 51638'}
              </div>
              <div>
                <strong>Email:</strong> {emailPrimary || 'motherteresaacademybaraut@gmail.com'}
              </div>
              <div style={{ marginTop: '0.85rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <a
                  href="https://www.youtube.com/@motherteresaacademy7598"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: '#ff4b4b',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    background: 'rgba(255,255,255,0.1)',
                    padding: '0.3rem 0.65rem',
                    borderRadius: '4px',
                    border: '1px solid rgba(255,75,75,0.3)',
                  }}
                  title="Official YouTube Channel"
                >
                  ▶ YouTube Channel
                </a>
                <a
                  href="https://wa.me/919557667999?text=Hello%20Mother%20Teresa%20Academy%2C%20I%20would%20like%20to%20inquire%20about%20admissions."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: '#25d366',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    background: 'rgba(255,255,255,0.1)',
                    padding: '0.3rem 0.65rem',
                    borderRadius: '4px',
                    border: '1px solid rgba(37,211,102,0.3)',
                  }}
                  title="Chat on WhatsApp"
                >
                  💬 WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Footer Bar */}
        <div className="footer-sub-bar">
          <div>
            © {new Date().getFullYear()} Mother Teresa Academy, Baraut (Baghpat, U.P.). All statutory rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
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
