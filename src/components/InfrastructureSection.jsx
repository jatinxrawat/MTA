import React, { useState } from 'react';
import { schoolData } from '../data/schoolData';
import { Building2, Microscope, BookOpen, Wifi, ShieldCheck, HeartPulse } from 'lucide-react';

export default function InfrastructureSection() {
  const { campusOverview, metrics, sanitation, gallery } = schoolData.infrastructure;
  const [activePhoto, setActivePhoto] = useState(null);

  return (
    <section id="infrastructure" className="section-padding" aria-label="Campus Infrastructure & Facilities">
      <div className="container">
        {/* Section Header */}
        <header className="editorial-section-header text-center">
          <span className="prospectus-subhead">Estates, Laboratories & Technology</span>
          <h2 className="prospectus-title">Campus Infrastructure & Learning Environment</h2>
          <div className="prospectus-rule centered">
            <span className="prospectus-rule-gem" />
          </div>
        </header>

        {/* Narrative Overview */}
        <div style={{ maxWidth: '820px', margin: '0 auto 3.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
            {campusOverview}
          </p>
        </div>

        {/* Metric Specifications Grid */}
        <div className="infra-metrics-grid">
          {metrics.map((item, idx) => (
            <div key={idx} className="infra-metric-card" style={{ '--reveal-delay': idx % 4 }}>
              <div className="infra-metric-val">{item.value}</div>
              <div className="infra-metric-label">{item.label}</div>
              <div className="infra-metric-sub">{item.sub}</div>
            </div>
          ))}
        </div>

        {/* Sanitation, Hygiene & CWSN Facilities Table */}
        <div className="sanitation-table-box">
          <h3 className="results-title" style={{ marginBottom: '0.5rem' }}>
            Sanitation, Health & CWSN Accessibility Register
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--ink-muted)', marginBottom: '1.5rem' }}>
            Strict compliance with National Commission for Protection of Child Rights (NCPCR) and CBSE sanitation guidelines.
          </p>

          <div className="academic-table-container" style={{ margin: 0 }}>
            <table className="academic-table" aria-label="Sanitation and CWSN facilities">
              <thead>
                <tr>
                  <th scope="col">Facility Head</th>
                  <th scope="col">Provisioned Number</th>
                  <th scope="col">Statutory Compliance Norm</th>
                  <th scope="col">Inspection Status</th>
                </tr>
              </thead>
              <tbody>
                {sanitation.map((item, idx) => (
                  <tr key={idx}>
                    <td><strong>{item.facility}</strong></td>
                    <td><span className="table-badge-placeholder">{item.count}</span></td>
                    <td>{item.norm}</td>
                    <td style={{ color: '#2e7d32', fontWeight: '600' }}>✓ Inspected & Certified</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Campus Photo Gallery */}
        <div style={{ marginTop: '4.5rem' }}>
          <div className="results-table-header" style={{ marginBottom: '1.75rem' }}>
            <div>
              <h3 className="results-title">Prospectus Photographic Gallery</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--ink-muted)' }}>
                Visual glimpses of academic, scientific, and recreational spaces across the academy.
              </p>
            </div>
            <span className="results-subtitle">Baraut Campus Views</span>
          </div>

          <div className="gallery-grid">
            {gallery.map((photo, idx) => (
              <figure
                key={idx}
                className="gallery-item"
                onClick={() => setActivePhoto(photo)}
                style={{ cursor: 'pointer' }}
              >
                <div className="gallery-image-wrapper">
                  <img
                    src={photo.image}
                    alt={photo.title}
                    className="gallery-image"
                    loading="lazy"
                  />
                </div>
                <figcaption className="gallery-caption-box">
                  <h4 className="gallery-title">{photo.title}</h4>
                  <p className="gallery-desc">{photo.caption}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {/* Lightbox Modal for Gallery Photo View */}
        {activePhoto && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(7, 18, 36, 0.92)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
            }}
            onClick={() => setActivePhoto(null)}
          >
            <div
              style={{
                maxWidth: '900px',
                width: '100%',
                backgroundColor: '#ffffff',
                border: '2px solid var(--color-brass)',
                overflow: 'hidden',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activePhoto.image}
                alt={activePhoto.title}
                style={{ width: '100%', maxHeight: '65vh', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-parchment-white)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--color-navy)' }}>
                    {activePhoto.title}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActivePhoto(null)}
                    style={{
                      background: 'none',
                      border: '1px solid var(--bg-paper-rule)',
                      padding: '0.4rem 0.8rem',
                      cursor: 'pointer',
                      fontWeight: '600',
                    }}
                  >
                    Close [ESC]
                  </button>
                </div>
                <p style={{ marginTop: '0.5rem', fontSize: '0.92rem', color: 'var(--ink-secondary)' }}>
                  {activePhoto.caption}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
