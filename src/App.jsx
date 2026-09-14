import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import ScrollProgressBar from './components/ScrollProgressBar';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import { useGlobalScrollReveal } from './hooks/useGlobalScrollReveal';

// Specific Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import AcademicsPage from './pages/AcademicsPage';
import StaffPage from './pages/StaffPage';
import InfrastructurePage from './pages/InfrastructurePage';
import GalleryPage from './pages/GalleryPage';
import CbseDisclosurePage from './pages/CbseDisclosurePage';
import ContactPage from './pages/ContactPage';

// Stylesheets
import './styles/variables.css';
import './styles/global.css';
import './styles/sections.css';
import './styles/cbse-disclosure.css';
import './styles/contact-footer.css';
import './styles/home.css';
import './styles/animations.css';

import { X, Send, CheckCircle } from 'lucide-react';

function AppContent() {
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [modalSubmitted, setModalSubmitted] = useState(false);
  const [modalForm, setModalForm] = useState({
    name: '',
    phone: '',
    email: '',
    grade: 'Class XI',
    notes: '',
  });

  // Automatically reveals elements on scroll across all routes
  useGlobalScrollReveal();
  const location = useLocation();

  const handleModalSubmit = (e) => {
    e.preventDefault();
    setModalSubmitted(true);
  };

  return (
    <div className="school-prospectus-app">
      {/* Global Reading Progress Indicator */}
      <ScrollProgressBar />

      {/* Automatic Scroll Reset on Page Navigation */}
      <ScrollToTop />

      {/* Global Sidebar Navigation (Available on every page) */}
      <Navigation onOpenInquiry={() => setInquiryModalOpen(true)} />

      {/* Multi-Page Routes with Smooth Transition */}
      <main
        id="prospectus-main-content"
        key={location.pathname}
        className="page-transition-wrapper"
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/academics" element={<AcademicsPage />} />
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/infrastructure" element={<InfrastructurePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/cbse-disclosure" element={<CbseDisclosurePage />} />
          <Route path="/contact" element={<ContactPage />} />
          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Institutional Footer across all pages */}
      <Footer />

        {/* Floating Back to Top Control */}
        <BackToTop />

        {/* Quick Admission Inquiry Modal */}
        {inquiryModalOpen && (
          <div
            className="modal-overlay"
            onClick={() => {
              setInquiryModalOpen(false);
              setModalSubmitted(false);
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div
              className="modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  <span style={{ fontSize: '0.74rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-brass-light)' }}>
                    Official Admissions Desk
                  </span>
                  <h3 id="modal-title" style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', color: '#ffffff', margin: 0 }}>
                    Admissions Consultation Desk
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setInquiryModalOpen(false);
                    setModalSubmitted(false);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ffffff',
                    cursor: 'pointer',
                    padding: '0.25rem',
                  }}
                  aria-label="Close modal"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="modal-body">
                {modalSubmitted ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                    <CheckCircle size={44} style={{ color: '#2e7d32', margin: '0 auto 1rem' }} />
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--color-navy)' }}>
                      Registration Recorded
                    </h4>
                    <p style={{ fontSize: '0.92rem', color: 'var(--ink-secondary)', marginTop: '0.5rem' }}>
                      Thank you, <strong>{modalForm.name}</strong>. The Admissions Officer will contact <strong>{modalForm.phone}</strong> with the entrance examination schedule and prospectus.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setInquiryModalOpen(false);
                        setModalSubmitted(false);
                      }}
                      className="btn-academic btn-academic-navy"
                      style={{ marginTop: '1.5rem' }}
                    >
                      Close Window
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleModalSubmit}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="modal-name">Parent / Guardian Name *</label>
                      <input
                        type="text"
                        id="modal-name"
                        required
                        className="form-input"
                        placeholder="Enter full name"
                        value={modalForm.name}
                        onChange={(e) => setModalForm({ ...modalForm, name: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="modal-phone">Phone / WhatsApp Number *</label>
                      <input
                        type="tel"
                        id="modal-phone"
                        required
                        className="form-input"
                        placeholder="+91 98XXXXXXXX"
                        value={modalForm.phone}
                        onChange={(e) => setModalForm({ ...modalForm, phone: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="modal-email">Email Address</label>
                      <input
                        type="email"
                        id="modal-email"
                        className="form-input"
                        placeholder="parent@example.com"
                        value={modalForm.email}
                        onChange={(e) => setModalForm({ ...modalForm, email: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="modal-grade">Grade / Stream of Interest</label>
                      <select
                        id="modal-grade"
                        className="form-select"
                        value={modalForm.grade}
                        onChange={(e) => setModalForm({ ...modalForm, grade: e.target.value })}
                      >
                        <option value="Pre-Primary / UKG / LKG">Pre-Primary (Kindergarten)</option>
                        <option value="Primary (Classes I to V)">Primary School (Classes I - V)</option>
                        <option value="Middle School (Classes VI to VIII)">Middle School (Classes VI - VIII)</option>
                        <option value="Secondary (Class IX - X)">Secondary School (Classes IX - X)</option>
                        <option value="Class XI - Science">Class XI — Science Faculty (PCM / PCB)</option>
                        <option value="Class XI - Commerce">Class XI — Commerce Faculty</option>
                        <option value="Class XI - Humanities">Class XI — Humanities Faculty</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="modal-notes">Specific Query / Custom Problem (Optional)</label>
                      <textarea
                        id="modal-notes"
                        className="form-textarea"
                        placeholder="State any specific inquiry regarding bus routes, hostel, or subject combinations..."
                        value={modalForm.notes}
                        onChange={(e) => setModalForm({ ...modalForm, notes: e.target.value })}
                        style={{ minHeight: '80px' }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn-academic btn-academic-brass"
                      style={{ width: '100%', padding: '0.9rem' }}
                    >
                      <Send size={15} style={{ marginRight: '0.5rem' }} />
                      Submit Request for Prospectus
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
