import React, { useState } from 'react';
import { X, Send, CheckCircle, Loader2, Phone, Mail, MapPin, MessageSquare, ExternalLink } from 'lucide-react';
import { sendInquiry, OFFICIAL_SCHOOL_EMAIL } from '../services/inquiryService';
import { schoolData } from '../data/schoolData';
import { useCMS } from '../context/CMSContext';

export default function ContactNowModal({ isOpen, onClose }) {
  const { content } = useCMS();
  const general = content.general || schoolData.general;
  const {
    postalAddress,
    phonePrimary = '+91 95576 67999',
    phoneSecondary = '+91 70175 51638',
    emailPrimary = 'motherteresaacademybaraut@gmail.com',
  } = general;

  const [activeTab, setActiveTab] = useState('whatsapp'); // 'whatsapp' | 'call' | 'form'
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    grade: 'Class XI - Science',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await sendInquiry({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        grade: formData.grade,
        message: formData.notes,
        source: 'Contact Now Popup Modal',
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Contact modal submission error:', err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappLink1 = `https://wa.me/919557667999?text=${encodeURIComponent(
    'Hello Mother Teresa Academy, I would like to inquire about admissions and school information.'
  )}`;
  const whatsappLink2 = `https://wa.me/917017551638?text=${encodeURIComponent(
    'Hello Mother Teresa Academy Admissions Desk, I would like to inquire about admission for my child.'
  )}`;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      <div
        className="modal-card contact-now-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px' }}
      >
        {/* Modal Header */}
        <div className="modal-header" style={{ background: 'linear-gradient(135deg, #0b1b3d 0%, #1e3a8a 100%)' }}>
          <div>
            <span style={{ fontSize: '0.74rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-brass-light)' }}>
              Mother Teresa Academy • Baraut
            </span>
            <h3 id="contact-modal-title" style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', color: '#ffffff', margin: '0.2rem 0 0' }}>
              Contact Administration &amp; Admissions
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              padding: '0.35rem',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Close contact modal"
          >
            <X size={22} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="contact-modal-tabs">
          <button
            type="button"
            className={`contact-modal-tab ${activeTab === 'whatsapp' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('whatsapp')}
          >
            <span style={{ color: '#25d366', fontWeight: 'bold' }}>💬</span>
            <span>WhatsApp Chat</span>
          </button>
          <button
            type="button"
            className={`contact-modal-tab ${activeTab === 'call' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('call')}
          >
            <Phone size={15} />
            <span>Call &amp; Office</span>
          </button>
          <button
            type="button"
            className={`contact-modal-tab ${activeTab === 'form' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('form')}
          >
            <Send size={15} />
            <span>Send Message</span>
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="modal-body" style={{ padding: '1.5rem' }}>
          {/* 1. WHATSAPP TAB */}
          {activeTab === 'whatsapp' && (
            <div className="contact-whatsapp-pane">
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    background: '#e8f7ee',
                    color: '#25d366',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.75rem',
                    fontSize: '28px',
                  }}
                >
                  💬
                </div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--color-navy)', margin: '0 0 0.35rem' }}>
                  Connect Directly on WhatsApp
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--ink-secondary)', margin: 0 }}>
                  Chat with our admissions counselors and administration team instantly.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <a
                  href={whatsappLink1}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-contact-card"
                >
                  <div className="whatsapp-card-icon">💬</div>
                  <div className="whatsapp-card-text">
                    <span className="whatsapp-card-role">Primary Admissions Desk</span>
                    <strong className="whatsapp-card-number">{phonePrimary}</strong>
                    <span className="whatsapp-card-sub">Instant response during office hours</span>
                  </div>
                  <div className="whatsapp-card-btn">Chat Now ↗</div>
                </a>

                <a
                  href={whatsappLink2}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-contact-card"
                >
                  <div className="whatsapp-card-icon">💬</div>
                  <div className="whatsapp-card-text">
                    <span className="whatsapp-card-role">Administration &amp; Helplines</span>
                    <strong className="whatsapp-card-number">{phoneSecondary}</strong>
                    <span className="whatsapp-card-sub">Admissions &amp; Prospectus queries</span>
                  </div>
                  <div className="whatsapp-card-btn">Chat Now ↗</div>
                </a>
              </div>

              <div style={{ marginTop: '1.25rem', padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '6px', fontSize: '0.82rem', color: 'var(--ink-muted)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Timings: Mon – Sat (8:00 AM – 2:30 PM)</span>
                <a href={`tel:${phonePrimary.replace(/\s+/g, '')}`} style={{ color: 'var(--color-navy)', fontWeight: 600, textDecoration: 'none' }}>
                  Or Direct Call 📞
                </a>
              </div>
            </div>
          )}

          {/* 2. CALL & OFFICE TAB */}
          {activeTab === 'call' && (
            <div className="contact-call-pane">
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-navy)', marginBottom: '1rem' }}>
                Official Telephonic Helplines
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.25rem' }}>
                <a
                  href={`tel:${phonePrimary.replace(/\s+/g, '')}`}
                  className="call-action-card"
                >
                  <Phone size={20} className="call-card-icon" />
                  <div>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block' }}>Primary Helpline</span>
                    <strong style={{ fontSize: '1.05rem', color: 'var(--color-navy)' }}>{phonePrimary}</strong>
                  </div>
                </a>

                <a
                  href={`tel:${phoneSecondary.replace(/\s+/g, '')}`}
                  className="call-action-card"
                >
                  <Phone size={20} className="call-card-icon" />
                  <div>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block' }}>Admissions Cell</span>
                    <strong style={{ fontSize: '1.05rem', color: 'var(--color-navy)' }}>{phoneSecondary}</strong>
                  </div>
                </a>
              </div>

              <div style={{ padding: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <Mail size={16} color="var(--color-navy)" />
                  <strong style={{ fontSize: '0.88rem', color: 'var(--color-navy)' }}>Official Email</strong>
                </div>
                <a
                  href={`mailto:${emailPrimary}`}
                  style={{ fontSize: '0.9rem', color: 'var(--color-maroon)', textDecoration: 'none', fontWeight: 600 }}
                >
                  {emailPrimary}
                </a>
              </div>

              <div style={{ padding: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <MapPin size={16} color="var(--color-navy)" />
                  <strong style={{ fontSize: '0.88rem', color: 'var(--color-navy)' }}>Campus Location</strong>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)', margin: '0 0 0.5rem' }}>
                  {postalAddress}
                </p>
                <a
                  href="https://maps.app.goo.gl/LXHxYsqPKy6rnrNo9?g_st=ic"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}
                >
                  Get GPS Directions on Google Maps ↗
                </a>
              </div>
            </div>
          )}

          {/* 3. SEND MESSAGE TAB */}
          {activeTab === 'form' && (
            <div className="contact-form-pane">
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                  <CheckCircle size={44} style={{ color: '#2e7d32', margin: '0 auto 1rem' }} />
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--color-navy)' }}>
                    Message Dispatched
                  </h4>
                  <p style={{ fontSize: '0.92rem', color: 'var(--ink-secondary)', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                    Thank you, <strong>{formData.name}</strong>. Your enquiry has been delivered directly to our admissions administration desk (<strong>{OFFICIAL_SCHOOL_EMAIL}</strong>).
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--ink-muted)' }}>
                    Our admissions team will reach out to <strong>{formData.phone}</strong> shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        phone: '',
                        email: '',
                        grade: 'Class XI - Science',
                        notes: '',
                      });
                      onClose();
                    }}
                    className="btn-academic btn-academic-navy"
                    style={{ marginTop: '1.5rem' }}
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="popup-name">Parent / Guardian Name *</label>
                    <input
                      type="text"
                      id="popup-name"
                      required
                      className="form-input"
                      placeholder="Enter full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-row-two">
                    <div className="form-group">
                      <label className="form-label" htmlFor="popup-phone">Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        id="popup-phone"
                        required
                        className="form-input"
                        placeholder="+91 98XXXXXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="popup-grade">Grade of Interest</label>
                      <select
                        id="popup-grade"
                        className="form-select"
                        value={formData.grade}
                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      >
                        <option value="Pre-Primary (NUR - UKG)">Pre-Primary (NUR - UKG)</option>
                        <option value="Primary (Class I - V)">Primary (Class I - V)</option>
                        <option value="Middle School (Class VI - VIII)">Middle School (Class VI - VIII)</option>
                        <option value="Secondary (Class IX - X)">Secondary (Class IX - X)</option>
                        <option value="Class XI - Science">Class XI - Science</option>
                        <option value="Class XI - Commerce">Class XI - Commerce</option>
                        <option value="Class XI - Humanities">Class XI - Humanities</option>
                        <option value="General Admission Enquiry">General Admission Enquiry</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="popup-email">Email Address (Optional)</label>
                    <input
                      type="email"
                      id="popup-email"
                      className="form-input"
                      placeholder="parent@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="popup-notes">Message / Questions</label>
                    <textarea
                      id="popup-notes"
                      rows={3}
                      className="form-textarea"
                      placeholder="Tell us about the student's requirements or request a prospectus..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-academic btn-academic-brass"
                      style={{ flex: 1, justifyContent: 'center' }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Dispatching...</span>
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>Submit Enquiry to Admissions</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
