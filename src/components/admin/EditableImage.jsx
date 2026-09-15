import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useCMS } from '../../context/CMSContext';
import { getNestedValue } from '../../lib/content';
import { uploadMedia, getMedia, NEUTRAL_PLACEHOLDER_IMAGE } from '../../lib/media';
import { Camera, Upload, Check, X, Image as ImageIcon, RefreshCw } from 'lucide-react';

/**
 * EditableImage: Wraps any image across the site in an edit affordance,
 * allowing live replacement via file upload or library selection.
 * 
 * @param {string} path Dot-separated content path (e.g. "hero.backgroundImage")
 * @param {string} defaultSrc Initial image URL fallback
 * @param {string} alt Alt text
 * @param {string} className Image classes
 * @param {object} style Inline styles
 */
export default function EditableImage({
  path,
  defaultSrc = '',
  alt = 'School image',
  className = '',
  style = {},
  aspectRatio = 'auto',
  ...props
}) {
  const location = useLocation();
  const isInAdmin = location.pathname.startsWith('/admin');
  const { content, updateField, isAdmin, isEditing, showToast } = useCMS();
  const rawSrc = path ? getNestedValue(content, path, defaultSrc) : defaultSrc;
  const currentSrc = getMedia(rawSrc, defaultSrc || NEUTRAL_PLACEHOLDER_IMAGE);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(currentSrc);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const isHeroBg = className.includes('hero-background-image');
  const isPillarBg = className.includes('pillar-card-bg-img');
  const isSectionBg = className.includes('news-events-bg-img') || className.includes('section-background-image');

  const handleImageError = (e) => {
    if (e.target.src !== NEUTRAL_PLACEHOLDER_IMAGE) {
      e.target.src = defaultSrc || NEUTRAL_PLACEHOLDER_IMAGE;
    }
  };

  // Suggested popular authentic school photos already in public directory
  const stockPhotos = [
    { label: 'Campus Facade (Daylight & Lawns)', url: '/news-events-campus.jpg' },
    { label: 'Athletics Track & Podium', url: '/gallery/athletics-track-victory-podium.jpg' },
    { label: 'Campus Block (Sunset)', url: '/school-hero.jpg' },
    { label: 'Science & Maths Lab', url: '/science-maths-composite-lab.jpg' },
    { label: 'Chemistry Lab Practical', url: '/gallery/chemistry-lab-titration.jpg' },
    { label: 'Trophy Presentation', url: '/gallery/championship-trophy-presentation.jpg' },
    { label: 'Kabaddi Tournament', url: '/kabaddi-sports-tournament.jpg' },
    { label: 'Cultural Diya Lighting', url: '/gallery/cultural-celebrations-diya-lighting.jpg' },
  ];

  // Strict isolation: Public site NEVER shows edit affordances, even if logged in
  if (!isInAdmin || !isAdmin || !isEditing || !path) {
    return (
      <img
        src={currentSrc}
        alt={alt}
        className={className}
        style={style}
        onError={handleImageError}
        {...props}
      />
    );
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setSelectedFile(file);
      // Call media abstraction
      const uploadResult = await uploadMedia(file);
      setPreviewSrc(uploadResult.url);
      setIsUploading(false);
    } catch (err) {
      setIsUploading(false);
      showToast('Image upload failed: ' + err.message, 'error');
    }
  };

  const handleApply = () => {
    updateField(path, previewSrc);
    setIsModalOpen(false);
    showToast('Image updated! Click "Save & Publish" when ready.', 'info');
  };

  return (
    <>
      <div
        className={`cms-editable-image-container ${isHeroBg ? 'is-hero-bg' : ''} ${isPillarBg ? 'is-pillar-bg' : ''} ${isSectionBg ? 'is-section-bg' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          setPreviewSrc(currentSrc);
          setIsModalOpen(true);
        }}
        title="Click to change this image"
      >
        <img
          src={currentSrc}
          alt={alt}
          className={`cms-editable-img-element ${className}`}
          style={style}
          onError={handleImageError}
          {...props}
        />
        <button
          type="button"
          className="cms-image-corner-badge"
          onClick={(e) => {
            e.stopPropagation();
            setPreviewSrc(currentSrc);
            setIsModalOpen(true);
          }}
          title="Click to replace this photograph"
          aria-label="Replace photograph"
        >
          <Camera size={13} className="cms-camera-icon" />
          <span>Replace Photo</span>
        </button>
      </div>

      {/* Modal for Image Selection & Upload */}
      {isModalOpen && (
        <div
          className="cms-modal-backdrop"
          onClick={() => setIsModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="cms-image-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cms-modal-header">
              <div className="cms-modal-title-group">
                <ImageIcon size={18} className="cms-header-icon" />
                <h3>Replace Photograph</h3>
              </div>
              <button
                type="button"
                className="cms-close-icon-btn"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="cms-modal-body">
              {/* Image Preview Box */}
              <div className="cms-image-preview-stage">
                <img
                  src={previewSrc}
                  alt="Preview"
                  className="cms-stage-preview-img"
                />
                {isUploading && (
                  <div className="cms-uploading-scrim">
                    <RefreshCw size={24} className="cms-spinner" />
                    <span>Processing photograph...</span>
                  </div>
                )}
              </div>

              {/* Upload New File Button */}
              <div className="cms-upload-dropzone" onClick={() => fileInputRef.current?.click()}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <Upload size={22} className="cms-dropzone-icon" />
                <div>
                  <strong>Click to upload a new photograph from your computer</strong>
                  <p>Supports JPG, PNG, WebP (simulated Cloudinary upload)</p>
                </div>
              </div>

              {/* Quick Select from Campus Library */}
              <div className="cms-library-section">
                <span className="cms-library-label">Or choose from authentic school library:</span>
                <div className="cms-stock-grid">
                  {stockPhotos.map((photo) => (
                    <button
                      key={photo.url}
                      type="button"
                      className={`cms-stock-thumb-btn ${previewSrc === photo.url ? 'selected' : ''}`}
                      onClick={() => setPreviewSrc(photo.url)}
                    >
                      <img src={photo.url} alt={photo.label} />
                      <span>{photo.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="cms-modal-footer">
              <button
                type="button"
                className="cms-btn cms-btn-outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="cms-btn cms-btn-primary"
                onClick={handleApply}
                disabled={isUploading || previewSrc === currentSrc}
              >
                <Check size={16} />
                <span>Apply Photo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
