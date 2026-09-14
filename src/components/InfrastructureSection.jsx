import React, { useState } from 'react';
import { useCMS } from '../context/CMSContext';
import { schoolData } from '../data/schoolData';
import EditableText from './admin/EditableText';
import { Building2, Microscope, BookOpen, Wifi, ShieldCheck, HeartPulse } from 'lucide-react';
import { NEUTRAL_PLACEHOLDER_IMAGE } from '../lib/media';

export default function InfrastructureSection() {
  const { content } = useCMS();
  const infraData = content.infrastructure || schoolData.infrastructure;
  const campusOverview = infraData.campusOverview || schoolData.infrastructure.campusOverview;
  const metrics = infraData.metrics || schoolData.infrastructure.metrics;
  const sanitation = infraData.sanitation || schoolData.infrastructure.sanitation;
  const gallery = (content.gallery || schoolData.infrastructure.gallery).filter((g) => g.isVisible !== false);
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
            <EditableText
              path="infrastructure.campusOverview"
              multiline={true}
              fallback={campusOverview}
              as="span"
            />
          </p>
        </div>

        {/* Metric Specifications Grid */}
        <div className="infra-metrics-grid">
          {metrics.map((item, idx) => (
            <div key={idx} className="infra-metric-card" style={{ '--reveal-delay': idx % 4 }}>
              <div className="infra-metric-val">
                <EditableText path={`infrastructure.metrics.${idx}.value`} fallback={item.value} as="span" />
              </div>
              <div className="infra-metric-label">{item.label}</div>
              <div className="infra-metric-sub">
                <EditableText path={`infrastructure.metrics.${idx}.sub`} fallback={item.sub} as="span" />
              </div>
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
                    <td>
                      <span className="table-badge-placeholder">
                        <EditableText path={`infrastructure.sanitation.${idx}.count`} fallback={item.count} as="span" />
                      </span>
                    </td>
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

          {gallery.length === 0 ? (
            <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center', background: '#ffffff', border: '1px dashed var(--bg-paper-rule)', borderRadius: '4px', margin: '2rem 0' }}>
              <p style={{ margin: 0, color: 'var(--ink-secondary)', fontSize: '1.05rem' }}>Campus estate photographs will appear here once published.</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {gallery.map((photo, idx) => (
                <figure
                  key={photo.id || idx}
                  className="gallery-item"
                  onClick={() => setActivePhoto(photo)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="gallery-image-wrapper">
                    <img
                      src={photo.image || NEUTRAL_PLACEHOLDER_IMAGE}
                      alt={photo.title || 'Mother Teresa Academy Campus'}
                      className="gallery-image"
                      loading="lazy"
                      onError={(e) => {
                        if (e.target.src !== NEUTRAL_PLACEHOLDER_IMAGE) {
                          e.target.src = NEUTRAL_PLACEHOLDER_IMAGE;
                        }
                      }}
                    />
                  </div>
                  <figcaption className="gallery-caption-box">
                    <h4 className="gallery-title">{photo.title}</h4>
                    <p className="gallery-desc">{photo.caption}</p>
                    <span className="gallery-category-pill">{photo.category || 'Campus'}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          className="lightbox-overlay"
          onClick={() => setActivePhoto(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="lightbox-close-btn"
              onClick={() => setActivePhoto(null)}
              aria-label="Close Preview"
            >
              ×
            </button>
            <img
              src={activePhoto.image || NEUTRAL_PLACEHOLDER_IMAGE}
              alt={activePhoto.title || 'Mother Teresa Academy'}
              className="lightbox-img"
              onError={(e) => {
                if (e.target.src !== NEUTRAL_PLACEHOLDER_IMAGE) {
                  e.target.src = NEUTRAL_PLACEHOLDER_IMAGE;
                }
              }}
            />
            <div className="lightbox-caption">
              <h3>{activePhoto.title}</h3>
              <p>{activePhoto.caption}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
