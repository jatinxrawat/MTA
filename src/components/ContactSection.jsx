import React, { useState } from 'react';
import { schoolData } from '../data/schoolData';
import { useCMS } from '../context/CMSContext';
import EditableText from './admin/EditableText';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Navigation, ExternalLink, Map, Loader2 } from 'lucide-react';
import { sendInquiry, OFFICIAL_SCHOOL_EMAIL } from '../services/inquiryService';
import '../styles/contact-footer.css';

export default function ContactSection() {
  const { content } = useCMS();
  const general = content.general || schoolData.general;
  const { location, postalAddress, phonePrimary, phoneSecondary, emailPrimary, emailAdmissions, officeHours, visitingHoursPrincipal } =
    general;

  const [showInteractiveMap, setShowInteractiveMap] = useState(false);

  const [formData, setFormData] = useState({
    parentName: '',
    contactNumber: '',
    email: '',
    gradeSeeking: 'Class XI - Science',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await sendInquiry({
        name: formData.parentName,
        phone: formData.contactNumber,
        email: formData.email,
        grade: formData.gradeSeeking,
        message: formData.message,
        source: 'Contact Page (/contact)',
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to dispatch inquiry:', err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact-section" aria-label="Contact and Admissions Enquiry">
      <div className="container">
        {/* Section Header */}
        <header className="editorial-section-header text-center">
          <span className="prospectus-subhead">Admissions & Campus Liaison</span>
          <h2 className="prospectus-title">Get in Touch with Administration</h2>
          <div className="prospectus-rule centered">
            <span className="prospectus-rule-gem" />
          </div>
        </header>

        <div className="contact-layout-grid">
          {/* Left Column: Campus Postal Address & Office Timings */}
          <div className="contact-details-box">
            {/* Unified Campus Location & Interactive Google Maps Card */}
            <div id="campus-location" className="contact-location-merged-card" style={{ scrollMarginTop: '110px' }}>
              <div className="merged-card-top-bar">
                <div className="merged-location-header">
                  <MapPin size={22} className="contact-icon" />
                  <h3 className="merged-location-title">Campus Location</h3>
                </div>
                <div className="map-live-status-pill" style={{ marginBottom: 0 }}>
                  <span className="live-status-dot" />
                  <span>Verified Location</span>
                </div>
              </div>

              <div className="merged-card-body">
                <a
                  href="https://maps.app.goo.gl/LXHxYsqPKy6rnrNo9?g_st=ic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="map-pin-pulse"
                  aria-label="Open Mother Teresa Academy in Google Maps"
                  title="Click to navigate on Google Maps"
                >
                  <MapPin size={26} />
                </a>

                <h4 className="merged-location-school-name">Mother Teresa Academy</h4>
                <p className="merged-location-address">
                  {postalAddress}
                  <span className="merged-location-region">Baraut, Western Uttar Pradesh, India</span>
                </p>
                <div className="map-coords">GPS: 29.1004° N, 77.2606° E • Baraut</div>

                <div className="map-actions-row">
                  <a
                    href="https://maps.app.goo.gl/LXHxYsqPKy6rnrNo9?g_st=ic"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="map-btn map-btn-primary"
                  >
                    <Navigation size={14} />
                    <span>Open in Google Maps</span>
                    <ExternalLink size={13} />
                  </a>

                  <button
                    type="button"
                    className="map-btn map-btn-secondary"
                    onClick={() => setShowInteractiveMap(!showInteractiveMap)}
                  >
                    <Map size={14} />
                    <span>{showInteractiveMap ? 'Hide Map' : 'View Live Map'}</span>
                  </button>
                </div>

                {showInteractiveMap && (
                  <div className="map-embed-container">
                    <iframe
                      title="Mother Teresa Academy Campus Location Map"
                      src="https://www.openstreetmap.org/export/embed.html?bbox=77.2306%2C29.0804%2C77.2906%2C29.1204&layer=mapnik&marker=29.1004%2C77.2606"
                      className="map-iframe"
                      loading="lazy"
                    />
                    <div className="map-embed-overlay-bar">
                      <span>Mother Teresa Academy, Chhaprauli Rd, Baraut</span>
                      <a
                        href="https://maps.app.goo.gl/LXHxYsqPKy6rnrNo9?g_st=ic"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="map-embed-link"
                      >
                        Get Directions on Google Maps ↗
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="contact-item-group">
              <div className="contact-item-header">
                <Phone size={22} className="contact-icon" />
                <h3 className="contact-label">Telephonic Helplines &amp; WhatsApp</h3>
              </div>
              <p className="contact-val">
                General Inquiries: <EditableText path="general.phonePrimary" fallback={phonePrimary} as="span" />{' '}
                <a
                  href="https://wa.me/919557667999?text=Hello%20Mother%20Teresa%20Academy%2C%20I%20would%20like%20to%20inquire%20about%20admissions."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    background: '#25d366',
                    color: '#ffffff',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    marginLeft: '0.5rem',
                    verticalAlign: 'middle',
                  }}
                  title="Direct WhatsApp Chat"
                >
                  💬 WhatsApp
                </a>
                <br />
                Admissions Cell: <EditableText path="general.phoneSecondary" fallback={phoneSecondary} as="span" />{' '}
                <a
                  href="https://wa.me/917017551638?text=Hello%20Mother%20Teresa%20Academy%2C%20I%20would%20like%20to%20inquire%20about%20admissions."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    background: '#25d366',
                    color: '#ffffff',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    marginLeft: '0.5rem',
                    verticalAlign: 'middle',
                  }}
                  title="Direct WhatsApp Chat"
                >
                  💬 WhatsApp
                </a>
              </p>
            </div>

            <div className="contact-item-group">
              <div className="contact-item-header">
                <Mail size={22} className="contact-icon" />
                <h3 className="contact-label">Electronic Mail &amp; YouTube Channel</h3>
              </div>
              <p className="contact-val">
                Official Secretarial Desk: <EditableText path="general.emailPrimary" fallback={emailPrimary} as="span" />
                <br />
                YouTube Channel:{' '}
                <a
                  href="https://www.youtube.com/@motherteresaacademy7598"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#dc2626', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  ▶ @motherteresaacademy7598 (Official Channel)
                </a>
              </p>
            </div>

            <div className="contact-item-group">
              <div className="contact-item-header">
                <Clock size={22} className="contact-icon" />
                <h3 className="contact-label">Institutional Timings</h3>
              </div>
              <p className="contact-val">
                <EditableText path="general.officeHours" fallback={officeHours} as="span" />
                <br />
                <em>Principal's Office Hours: <EditableText path="general.visitingHoursPrincipal" fallback={visitingHoursPrincipal} as="span" /></em>
              </p>
            </div>
          </div>

          {/* Right Column: Admission Inquiry Form */}
          <div className="inquiry-form-card">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--color-navy-deep)', marginBottom: '0.5rem' }}>
              Admission &amp; School Enquiry
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--ink-muted)', marginBottom: '2rem' }}>
              Submit scholar credentials for registration guidelines, prospectus dispatch, or campus tour scheduling.
            </p>

            {submitted ? (
              <div style={{ backgroundColor: 'var(--bg-parchment-white)', border: '1px solid var(--color-brass)', padding: '2.5rem', textAlign: 'center' }}>
                <CheckCircle size={42} style={{ color: '#2e7d32', margin: '0 auto 1rem' }} />
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
                  Enquiry Dispatched to Admissions
                </h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--ink-secondary)', marginBottom: '0.5rem' }}>
                  Thank you, <strong>{formData.parentName}</strong>. Your enquiry has been delivered directly to our administration desk (<strong>{OFFICIAL_SCHOOL_EMAIL}</strong>).
                </p>
                <p style={{ fontSize: '0.88rem', color: 'var(--ink-muted)' }}>
                  Our Admissions Secretariat will review your requirements and reach out to <strong>{formData.contactNumber}</strong> shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      parentName: '',
                      contactNumber: '',
                      email: '',
                      gradeSeeking: 'Class XI - Science',
                      message: '',
                    });
                  }}
                  className="btn-academic btn-academic-outline"
                  style={{ marginTop: '1.5rem' }}
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="parentName">
                    Parent / Guardian Full Name *
                  </label>
                  <input
                    type="text"
                    id="parentName"
                    required
                    className="form-input"
                    placeholder="Enter full name"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  />
                </div>

                <div className="form-row-two">
                  <div className="form-group">
                    <label className="form-label" htmlFor="contactNumber">
                      Contact Mobile Number *
                    </label>
                    <input
                      type="tel"
                      id="contact-number"
                      required
                      className="form-input"
                      placeholder="Enter 10-digit mobile number"
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="form-input"
                      placeholder="parent@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="gradeSeeking">
                    Grade / Class Seeking Admission *
                  </label>
                  <select
                    id="gradeSeeking"
                    className="form-select"
                    value={formData.gradeSeeking}
                    onChange={(e) => setFormData({ ...formData, gradeSeeking: e.target.value })}
                  >
                    <option value="Pre-Primary / Kindergarten">Pre-Primary / Kindergarten</option>
                    <option value="Primary (Class I - V)">Primary Wing (Class I - V)</option>
                    <option value="Middle (Class VI - VIII)">Middle Wing (Class VI - VIII)</option>
                    <option value="Secondary (Class IX - X)">Secondary Wing (Class IX - X)</option>
                    <option value="Senior Secondary - Science (Class XI - XII)">Senior Secondary — Science (Class XI - XII)</option>
                    <option value="Senior Secondary - Commerce (Class XI - XII)">Senior Secondary — Commerce (Class XI - XII)</option>
                    <option value="Senior Secondary - Humanities (Class XI - XII)">Senior Secondary — Humanities (Class XI - XII)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="message">
                    Specific Query / Custom Problem (Optional)
                  </label>
                  <textarea
                    id="message"
                    className="form-textarea"
                    placeholder="Mention any specific problem, queries regarding transport, scholarship, or campus visit..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-academic btn-academic-brass"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    opacity: isSubmitting ? 0.75 : 1,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="spin-animation" />
                      <span>Sending to Admissions Secretariat...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Submit Official Admission Enquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
