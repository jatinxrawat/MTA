import React, { useState, useRef } from 'react';
import { useCMS } from '../../context/CMSContext';
import { uploadMedia, uploadMultipleMedia, NEUTRAL_PLACEHOLDER_IMAGE } from '../../lib/media';
import { 
  Image as ImageIcon, Plus, Trash2, Eye, EyeOff, 
  Upload, Check, X, Layers, ArrowUp, ArrowDown, Edit3 
} from 'lucide-react';

export default function AdminGalleryManager() {
  const { content, addPhoto, updatePhoto, deletePhoto, togglePhotoVisibility, reorderGallery, showToast } = useCMS();
  const gallery = content.gallery || [];

  const [activeCategory, setActiveCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isBulkUploading, setIsBulkUploading] = useState(false);

  const fileInputRef = useRef(null);
  const bulkFileInputRef = useRef(null);

  // Form state for single photo add/edit
  const [formState, setFormState] = useState({
    title: '',
    caption: '',
    category: 'Campus',
    image: '',
    isVisible: true,
  });

  const categories = ['Campus', 'Laboratories', 'Sports', 'Academics', 'Classrooms', 'Events'];

  const openAddModal = () => {
    setEditingPhoto(null);
    setFormState({
      title: '',
      caption: '',
      category: 'Campus',
      image: '/campus-facade.jpg',
      isVisible: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (photo) => {
    setEditingPhoto(photo);
    setFormState({
      title: photo.title || '',
      caption: photo.caption || '',
      category: photo.category || 'Campus',
      image: photo.image || '',
      isVisible: photo.isVisible !== false,
    });
    setIsModalOpen(true);
  };

  const handleSingleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const result = await uploadMedia(file);
      setFormState((prev) => ({
        ...prev,
        image: result.url,
        title: prev.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      }));
      setIsUploading(false);
      showToast('Image uploaded and ready!', 'success');
    } catch (err) {
      setIsUploading(false);
      showToast('Upload error: ' + err.message, 'error');
    }
  };

  const handleBulkUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsBulkUploading(true);
      showToast(`Uploading ${files.length} photographs...`, 'info');
      const results = await uploadMultipleMedia(files);

      // Add each uploaded photo to the gallery
      results.forEach((res) => {
        addPhoto({
          title: res.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          caption: 'Campus photography of Mother Teresa Academy, Baraut.',
          category: 'Campus',
          image: res.url,
          isVisible: true,
        });
      });

      setIsBulkUploading(false);
      showToast(`Successfully added ${results.length} photos to draft gallery!`, 'success');
    } catch (err) {
      setIsBulkUploading(false);
      showToast('Bulk upload failed: ' + err.message, 'error');
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formState.image) {
      showToast('Please upload or provide an image.', 'error');
      return;
    }

    if (editingPhoto) {
      updatePhoto(editingPhoto.id, formState);
      showToast('Photo details updated in draft!', 'success');
    } else {
      addPhoto(formState);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Delete photograph "${title}"?`)) {
      deletePhoto(id);
    }
  };

  // Move photo in gallery order
  const movePhoto = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= gallery.length) return;
    const reordered = [...gallery];
    const temp = reordered[index];
    reordered[index] = reordered[target];
    reordered[target] = temp;
    reorderGallery(reordered);
  };

  const filteredGallery = gallery.filter((item) => {
    if (activeCategory === 'All') return true;
    return item.category && item.category.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <div className="cms-management-screen">
      {/* Header */}
      <div className="cms-screen-header">
        <div>
          <h1>Campus Photo Gallery Manager</h1>
          <p>Upload new school images, edit captions, organize categories, and manage public visibility.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {/* Bulk Upload Hidden Input */}
          <input
            ref={bulkFileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            style={{ display: 'none' }}
            onChange={handleBulkUpload}
          />
          <button
            type="button"
            disabled={isBulkUploading}
            onClick={() => bulkFileInputRef.current?.click()}
            className="cms-btn cms-btn-outline-dark"
          >
            <Layers size={16} />
            <span>{isBulkUploading ? 'Uploading Batch...' : 'Bulk Upload Photos'}</span>
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="cms-btn cms-btn-primary"
          >
            <Plus size={16} />
            <span>Add Single Photo</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Count */}
      <div className="cms-notices-toolbar">
        <div className="cms-category-filter-bar">
          {['All', ...categories].map((cat) => (
            <button
              key={cat}
              type="button"
              className={`cms-cat-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat} {cat === 'All' ? `(${gallery.length})` : ''}
            </button>
          ))}
        </div>
        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
          Showing <strong>{filteredGallery.length}</strong> of {gallery.length} photographs
        </span>
      </div>

      {/* Gallery Cards Grid */}
      <div className="cms-gallery-admin-grid">
        {filteredGallery.map((photo, idx) => (
          <div key={photo.id} className="cms-gallery-admin-card">
            {/* Thumbnail */}
            <div className="cms-gallery-card-thumb">
              <img
                src={photo.image || NEUTRAL_PLACEHOLDER_IMAGE}
                alt={photo.title || 'Photograph'}
                loading="lazy"
                onError={(e) => {
                  if (e.target.src !== NEUTRAL_PLACEHOLDER_IMAGE) {
                    e.target.src = NEUTRAL_PLACEHOLDER_IMAGE;
                  }
                }}
              />
              <div style={{ position: 'absolute', top: '8px', left: '8px' }}>
                <span className="cms-badge" style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: '#ffffff' }}>
                  {photo.category}
                </span>
              </div>
              <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
                <button
                  type="button"
                  onClick={() => togglePhotoVisibility(photo.id)}
                  className={`cms-badge ${photo.isVisible !== false ? 'cms-badge-live' : 'cms-badge-draft'}`}
                  style={{ border: 'none', cursor: 'pointer' }}
                  title="Toggle Public Visibility"
                >
                  {photo.isVisible !== false ? <Eye size={12} /> : <EyeOff size={12} />}
                  <span>{photo.isVisible !== false ? 'Visible' : 'Hidden'}</span>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="cms-gallery-card-body">
              <h4 className="cms-gallery-card-title">{photo.title}</h4>
              <p className="cms-gallery-card-caption">
                {photo.caption || <span style={{ fontStyle: 'italic', color: '#94a3b8' }}>No caption provided</span>}
              </p>

              {/* Footer Actions */}
              <div className="cms-gallery-card-footer">
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => movePhoto(idx, -1)}
                    className="cms-icon-action-btn"
                    title="Move Left/Earlier"
                  >
                    <ArrowUp size={13} style={{ transform: 'rotate(-90deg)' }} />
                  </button>
                  <button
                    type="button"
                    disabled={idx === gallery.length - 1}
                    onClick={() => movePhoto(idx, 1)}
                    className="cms-icon-action-btn"
                    title="Move Right/Later"
                  >
                    <ArrowDown size={13} style={{ transform: 'rotate(-90deg)' }} />
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => openEditModal(photo)}
                    className="cms-icon-action-btn"
                    title="Edit Metadata"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(photo.id, photo.title)}
                    className="cms-icon-action-btn delete"
                    title="Delete Photo"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="cms-modal-backdrop" onClick={() => setIsModalOpen(false)} role="dialog" aria-modal="true">
          <div className="cms-form-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="cms-modal-header">
              <div className="cms-modal-title-group">
                <ImageIcon size={18} className="cms-header-icon" />
                <h3>{editingPhoto ? 'Edit Photo Information' : 'Add Campus Photograph'}</h3>
              </div>
              <button type="button" className="cms-close-icon-btn" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="cms-modal-body">
                {/* Image Preview & Upload Dropzone */}
                <div className="cms-image-preview-stage" style={{ height: '180px' }}>
                  <img
                    src={formState.image || NEUTRAL_PLACEHOLDER_IMAGE}
                    alt="Preview"
                    className="cms-stage-preview-img"
                    onError={(e) => {
                      if (e.target.src !== NEUTRAL_PLACEHOLDER_IMAGE) {
                        e.target.src = NEUTRAL_PLACEHOLDER_IMAGE;
                      }
                    }}
                  />
                  {isUploading && (
                    <div className="cms-uploading-scrim">
                      <span>Uploading image...</span>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: 'none' }}
                  onChange={handleSingleImageUpload}
                />
                <div
                  className="cms-upload-dropzone"
                  style={{ padding: '10px' }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={18} className="cms-dropzone-icon" />
                  <div>
                    <strong>Click to upload photograph file from device</strong>
                    <p style={{ margin: 0, fontSize: '0.78rem' }}>Supports JPG, PNG, WebP (Cloudinary ready)</p>
                  </div>
                </div>

                {/* Title */}
                <div className="cms-form-group">
                  <label htmlFor="photo-title">Title / Name *</label>
                  <input
                    id="photo-title"
                    type="text"
                    required
                    value={formState.title}
                    onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                    placeholder="e.g. Senior Science Laboratory Demonstration"
                    className="cms-input-field"
                  />
                </div>

                {/* Category */}
                <div className="cms-form-group">
                  <label htmlFor="photo-cat">Category</label>
                  <select
                    id="photo-cat"
                    value={formState.category}
                    onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                    className="cms-input-field"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Caption */}
                <div className="cms-form-group">
                  <label htmlFor="photo-caption">Descriptive Caption</label>
                  <textarea
                    id="photo-caption"
                    rows={3}
                    value={formState.caption}
                    onChange={(e) => setFormState({ ...formState, caption: e.target.value })}
                    placeholder="Provide context about what students, teachers, or facilities are shown in this photograph..."
                    className="cms-input-field"
                  />
                </div>

                {/* Visibility */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.86rem', fontWeight: '600' }}>
                  <input
                    type="checkbox"
                    checked={formState.isVisible}
                    onChange={(e) => setFormState({ ...formState, isVisible: e.target.checked })}
                  />
                  <span>Show in Public Campus Gallery</span>
                </label>
              </div>

              <div className="cms-modal-footer">
                <button
                  type="button"
                  className="cms-btn cms-btn-outline-dark"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="cms-btn cms-btn-primary"
                >
                  <Check size={16} />
                  <span>{editingPhoto ? 'Save Details' : 'Add to Gallery'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
