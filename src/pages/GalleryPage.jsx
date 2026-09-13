import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { schoolData } from '../data/schoolData';
import { Image as ImageIcon, ZoomIn, X, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

export default function GalleryPage() {
  const { gallery } = schoolData.infrastructure;
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const categories = ['All', 'Campus', 'Laboratories', 'Academics', 'Sports'];

  const filteredPhotos =
    activeCategory === 'All'
      ? gallery
      : gallery.filter((p) => p.category === activeCategory);

  const openLightbox = (idx) => {
    setLightboxIndex(idx);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextPhoto = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length);
    }
  };

  const prevPhoto = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
    }
  };

  return (
    <div className="subpage-view">
      <PageHeader
        title="Our Campus Gallery"
        subtitle="Visual photographic archives of our authentic campus architecture, senior physics & composite laboratories, faculty CBP training workshops, and inter-house sports competitions."
        breadcrumb="Our Gallery"
        badge="Visual Archives"
      />

      <section className="section-padding" aria-label="Campus Gallery Photos">
        <div className="container">
          {/* Category Filter Pills & Count */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem',
              marginBottom: '3rem',
              paddingBottom: '1.5rem',
              borderBottom: '1px solid var(--bg-paper-rule)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <Filter size={18} style={{ color: 'var(--color-maroon)', marginRight: '0.25rem' }} />
              <span style={{ fontSize: '0.88rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-navy)' }}>
                Filter By Category:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    backgroundColor: activeCategory === cat ? 'var(--color-navy)' : '#ffffff',
                    color: activeCategory === cat ? '#ffffff' : 'var(--ink-secondary)',
                    border: activeCategory === cat ? '1px solid var(--color-navy)' : '1px solid var(--bg-paper-rule)',
                    padding: '0.5rem 1.15rem',
                    fontSize: '0.84rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    borderRadius: '2px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div style={{ fontSize: '0.88rem', color: 'var(--ink-muted)' }}>
              Showing <strong>{filteredPhotos.length}</strong> photo{filteredPhotos.length === 1 ? '' : 's'} in archives
            </div>
          </div>

          {/* Photo Gallery Grid */}
          <div className="gallery-grid">
            {filteredPhotos.map((photo, idx) => (
              <figure
                key={idx}
                className="gallery-item gallery-preview-card scroll-reveal-item"
                onClick={() => openLightbox(idx)}
                style={{ cursor: 'pointer', position: 'relative', '--reveal-delay': idx % 6 }}
              >
                <div className="gallery-image-wrapper">
                  <img
                    src={photo.image}
                    alt={photo.title}
                    className="gallery-image"
                    loading="lazy"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: 'rgba(7, 18, 36, 0.75)',
                      color: '#ffffff',
                      padding: '0.35rem 0.65rem',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      borderRadius: '2px',
                    }}
                  >
                    {photo.category || 'Campus'}
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      right: '12px',
                      backgroundColor: 'var(--color-brass)',
                      color: 'var(--color-navy-deep)',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                    }}
                  >
                    <ZoomIn size={16} />
                  </div>
                </div>
                <figcaption className="gallery-caption-box">
                  <h4 className="gallery-title">{photo.title}</h4>
                  <p className="gallery-desc">{photo.caption}</p>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* Note for Administrators on Adding More Photos */}
          <div
            style={{
              marginTop: '4.5rem',
              backgroundColor: 'var(--bg-parchment-white)',
              border: '1px dashed var(--color-brass)',
              padding: '2rem',
              textAlign: 'center',
            }}
          >
            <ImageIcon size={28} style={{ color: 'var(--color-brass-deep)', margin: '0 auto 0.75rem' }} />
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--color-navy)' }}>
              Campus Photographic Archive Extension
            </h4>
            <p style={{ fontSize: '0.92rem', color: 'var(--ink-secondary)', maxWidth: '640px', margin: '0.5rem auto 0' }}>
              More high-resolution photographs of academic convocations, sports tournaments, laboratory experiments, and campus cultural events can be added directly into the gallery registry.
            </p>
          </div>
        </div>
      </section>

      {/* Lightbox Modal with Next / Prev */}
      {lightboxIndex !== null && filteredPhotos[lightboxIndex] && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(7, 18, 36, 0.92)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={closeLightbox}
        >
          <div
            className="modal-card"
            style={{
              maxWidth: '960px',
              width: '100%',
              backgroundColor: '#ffffff',
              border: '2px solid var(--color-brass)',
              overflow: 'hidden',
              position: 'relative',
              borderRadius: '2px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={closeLightbox}
              className="modal-close-btn"
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                backgroundColor: 'rgba(7, 18, 36, 0.85)',
                color: '#ffffff',
                border: '1px solid var(--color-brass)',
                padding: '0.4rem',
                cursor: 'pointer',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '2px',
              }}
              aria-label="Close photo preview"
            >
              <X size={20} />
            </button>

            {/* Photo */}
            <div style={{ position: 'relative', width: '100%', maxHeight: '70vh', overflow: 'hidden', backgroundColor: '#071224' }}>
              <img
                src={filteredPhotos[lightboxIndex].image}
                alt={filteredPhotos[lightboxIndex].title}
                style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', display: 'block', margin: '0 auto' }}
              />

              {/* Prev Button */}
              {filteredPhotos.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevPhoto();
                  }}
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(7, 18, 36, 0.8)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    padding: '0.6rem',
                    cursor: 'pointer',
                    borderRadius: '50%',
                  }}
                  aria-label="Previous photo"
                >
                  <ChevronLeft size={22} />
                </button>
              )}

              {/* Next Button */}
              {filteredPhotos.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextPhoto();
                  }}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(7, 18, 36, 0.8)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    padding: '0.6rem',
                    cursor: 'pointer',
                    borderRadius: '50%',
                  }}
                  aria-label="Next photo"
                >
                  <ChevronRight size={22} />
                </button>
              )}
            </div>

            {/* Caption bar */}
            <div style={{ padding: '1.25rem 1.75rem', backgroundColor: 'var(--bg-parchment-white)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--color-navy)' }}>
                  {filteredPhotos[lightboxIndex].title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--ink-secondary)', marginTop: '0.25rem' }}>
                  {filteredPhotos[lightboxIndex].caption}
                </p>
              </div>
              <span style={{ fontSize: '0.82rem', color: 'var(--ink-muted)', fontWeight: '600' }}>
                Photo {lightboxIndex + 1} of {filteredPhotos.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
