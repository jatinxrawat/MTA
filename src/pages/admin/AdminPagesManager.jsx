import React, { useState, useRef } from 'react';
import { useCMS } from '../../context/CMSContext';
import { uploadMedia } from '../../lib/media';
import { 
  Edit2, Trash2, Eye, EyeOff, 
  Upload, Check, X, ArrowUp, ArrowDown, ExternalLink, 
  Menu as MenuIcon, Plus, Layers, Image as ImageIcon,
  FileText, Quote, Bookmark, Sparkles, Send
} from 'lucide-react';

export default function AdminPagesManager() {
  const { 
    content, addCustomPage, updateCustomPage, deleteCustomPage, 
    toggleCustomPagePublish, reorderCustomPages, showToast 
  } = useCMS();
  
  const customPages = content.customPages || [];

  // Modal State (Create / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Media upload states
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const photoInputRef = useRef(null);
  const pdfInputRef = useRef(null);
  const modalBodyRef = useRef(null);

  // Form State
  const [formState, setFormState] = useState({
    title: '',
    slug: '',
    subtitle: '',
    badge: '',
    category: 'Student Life',
    heroImage: '',
    heroImageCaption: '',
    bodyText: '',
    pullquote: '',
    pullquoteAuthor: '',
    highlightCards: [], // [{ title: '', desc: '' }]
    attachedPdfUrl: '',
    attachedPdfName: '',
    actionButtonText: '',
    actionButtonUrl: '',
    showInMenu: true,
    menuLabel: '',
    menuBadge: '',
    isPublished: true,
  });

  const categories = ['Academics', 'Student Life', 'Sports', 'Co-Curricular', 'Admissions', 'Administration', 'Statutory', 'General'];

  const openNewPageModal = () => {
    setEditingId(null);
    setFormState({
      title: '',
      slug: '',
      subtitle: '',
      badge: 'Special Initiative',
      category: 'Student Life',
      heroImage: '',
      heroImageCaption: '',
      bodyText: '',
      pullquote: '',
      pullquoteAuthor: '',
      highlightCards: [
        { title: 'Program Schedule', desc: 'Monday to Friday, 8:30 AM – 1:30 PM' },
        { title: 'Eligibility & Grades', desc: 'Open for all students from Classes VI to XII' },
      ],
      attachedPdfUrl: '',
      attachedPdfName: '',
      actionButtonText: 'Register / Enquire Online',
      actionButtonUrl: '/contact',
      showInMenu: true,
      menuLabel: '',
      menuBadge: 'NEW',
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (page) => {
    setEditingId(page.id);
    setFormState({
      title: page.title || '',
      slug: page.slug || '',
      subtitle: page.subtitle || '',
      badge: page.badge || '',
      category: page.category || 'Student Life',
      heroImage: page.heroImage || '',
      heroImageCaption: page.heroImageCaption || '',
      bodyText: page.bodyText || '',
      pullquote: page.pullquote || '',
      pullquoteAuthor: page.pullquoteAuthor || '',
      highlightCards: page.highlightCards ? [...page.highlightCards] : [],
      attachedPdfUrl: page.attachedPdfUrl || '',
      attachedPdfName: page.attachedPdfName || '',
      actionButtonText: page.actionButtonText || '',
      actionButtonUrl: page.actionButtonUrl || '',
      showInMenu: page.showInMenu !== false,
      menuLabel: page.menuLabel || page.title || '',
      menuBadge: page.menuBadge || '',
      isPublished: page.isPublished !== false,
    });
    setIsModalOpen(true);
  };

  // Smooth scroll to a section inside modal
  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Auto-generate slug when title changes (if user hasn't manually customized slug)
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    const generatedSlug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormState((prev) => ({
      ...prev,
      title: newTitle,
      slug: prev.slug === '' || prev.slug === prev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        ? generatedSlug
        : prev.slug,
      menuLabel: prev.menuLabel === '' || prev.menuLabel === prev.title ? newTitle : prev.menuLabel,
    }));
  };

  // Upload hero banner photo to Cloudinary
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingPhoto(true);
      const result = await uploadMedia(file, { folder: 'mta_school/pages' });
      setFormState((prev) => ({
        ...prev,
        heroImage: result.url,
      }));
      setIsUploadingPhoto(false);
      showToast('Showcase photo uploaded to Cloudinary!', 'success');
    } catch (err) {
      setIsUploadingPhoto(false);
      showToast('Photo upload failed: ' + err.message, 'error');
    }
  };

  // Upload attached PDF circular to Cloudinary
  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingPdf(true);
      const result = await uploadMedia(file, { folder: 'mta_school/documents' });
      setFormState((prev) => ({
        ...prev,
        attachedPdfUrl: result.url,
        attachedPdfName: result.name,
      }));
      setIsUploadingPdf(false);
      showToast(`Document "${result.name}" attached!`, 'success');
    } catch (err) {
      setIsUploadingPdf(false);
      showToast('Document upload failed: ' + err.message, 'error');
    }
  };

  // Highlight card management
  const addHighlightCard = () => {
    setFormState((prev) => ({
      ...prev,
      highlightCards: [...prev.highlightCards, { title: 'New Highlight', desc: 'Add key information or details here' }],
    }));
  };

  const updateHighlightCard = (index, field, value) => {
    setFormState((prev) => {
      const cards = [...prev.highlightCards];
      cards[index] = { ...cards[index], [field]: value };
      return { ...prev, highlightCards: cards };
    });
  };

  const removeHighlightCard = (index) => {
    setFormState((prev) => ({
      ...prev,
      highlightCards: prev.highlightCards.filter((_, i) => i !== index),
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formState.title.trim()) {
      showToast('Please enter a page title.', 'error');
      return;
    }

    const cleanSlug = (formState.slug.trim() || formState.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) || `page-${Date.now()}`;

    const pageData = {
      title: formState.title.trim(),
      slug: cleanSlug,
      subtitle: formState.subtitle.trim(),
      badge: formState.badge.trim(),
      category: formState.category,
      heroImage: formState.heroImage.trim(),
      heroImageCaption: formState.heroImageCaption.trim(),
      bodyText: formState.bodyText.trim(),
      pullquote: formState.pullquote.trim(),
      pullquoteAuthor: formState.pullquoteAuthor.trim(),
      highlightCards: formState.highlightCards,
      attachedPdfUrl: formState.attachedPdfUrl.trim(),
      attachedPdfName: formState.attachedPdfName.trim(),
      actionButtonText: formState.actionButtonText.trim(),
      actionButtonUrl: formState.actionButtonUrl.trim(),
      showInMenu: formState.showInMenu,
      menuLabel: formState.menuLabel.trim() || formState.title.trim(),
      menuBadge: formState.menuBadge.trim(),
      isPublished: formState.isPublished,
    };

    if (editingId) {
      updateCustomPage(editingId, pageData);
      showToast('Page details updated in draft!', 'success');
    } else {
      addCustomPage(pageData);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete the page "${title}"?`)) {
      deleteCustomPage(id);
    }
  };

  const movePage = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= customPages.length) return;
    const reordered = [...customPages];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;
    reorderCustomPages(reordered);
    showToast('Page order updated in draft.', 'info');
  };

  return (
    <div className="cms-management-screen">
      {/* 1. Top Header & Action */}
      <div className="cms-screen-header">
        <div>
          <h1>Custom Pages & Menu Builder</h1>
          <p>
            Create and edit standalone prospectus pages matching Mother Teresa Academy's design system.
            Add content, photos, documents, and feature them in the public website's sidebar navigation menu.
          </p>
        </div>

        <button
          type="button"
          onClick={openNewPageModal}
          className="cms-btn cms-btn-primary"
        >
          <Plus size={16} />
          <span>Create New Page</span>
        </button>
      </div>

      {/* 2. Pages Management Table */}
      <div className="cms-table-card">
        <div className="cms-table-header-info">
          <strong>Created Pages ({customPages.length})</strong>
          <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
            Pages with "In Menu" badge automatically appear in the visitor navigation drawer
          </span>
        </div>

        <div className="cms-table-responsive">
          <table className="cms-data-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>Order</th>
                <th>Page Title & URL Slug</th>
                <th>Category</th>
                <th>Menu Status</th>
                <th>Publish Status</th>
                <th style={{ textAlign: 'right', width: '130px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customPages.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748b' }}>
                    <Layers size={40} style={{ margin: '0 auto 12px', color: '#94a3b8', display: 'block' }} />
                    <p style={{ margin: '0 0 8px 0', fontSize: '1.05rem', fontWeight: '700', color: '#0f172a' }}>
                      No Custom Pages Created Yet
                    </p>
                    <p style={{ margin: '0 0 16px 0', fontSize: '0.86rem', maxWidth: '420px', marginInline: 'auto' }}>
                      Click below to design your first custom curriculum, robotics lab, sports camp, or event page.
                    </p>
                    <button
                      type="button"
                      onClick={openNewPageModal}
                      className="cms-btn cms-btn-primary"
                      style={{ margin: '0 auto' }}
                    >
                      <Plus size={15} />
                      <span>Create First Page</span>
                    </button>
                  </td>
                </tr>
              ) : (
                customPages.map((page, index) => (
                  <tr key={page.id || index}>
                    {/* Reorder controls */}
                    <td>
                      <div className="cms-order-btn-group">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => movePage(index, -1)}
                          className="cms-order-btn"
                          title="Move Up"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          type="button"
                          disabled={index === customPages.length - 1}
                          onClick={() => movePage(index, 1)}
                          className="cms-order-btn"
                          title="Move Down"
                        >
                          <ArrowDown size={12} />
                        </button>
                      </div>
                    </td>

                    {/* Title & Slug */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>{page.title}</strong>
                        {page.badge && (
                          <span style={{ fontSize: '0.72rem', backgroundColor: '#fef3c7', color: '#92400e', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                            {page.badge}
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                        <code style={{ fontSize: '0.78rem', color: '#2563eb', backgroundColor: '#eff6ff', padding: '2px 6px', borderRadius: '4px' }}>
                          /pages/{page.slug}
                        </code>
                        <a
                          href={`/pages/${page.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: '#64748b', display: 'inline-flex', alignItems: 'center' }}
                          title="Open live page in new tab"
                        >
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </td>

                    {/* Category */}
                    <td>
                      <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#334155' }}>
                        {page.category || 'General'}
                      </span>
                    </td>

                    {/* Menu status */}
                    <td>
                      {page.showInMenu !== false ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '3px 8px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: '600' }}>
                          <MenuIcon size={12} />
                          <span>In Menu: "{page.menuLabel || page.title}"</span>
                          {page.menuBadge && (
                            <span style={{ backgroundColor: '#166534', color: '#fff', fontSize: '0.68rem', padding: '0 4px', borderRadius: '3px', marginLeft: '2px' }}>
                              {page.menuBadge}
                            </span>
                          )}
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Hidden from Menu</span>
                      )}
                    </td>

                    {/* Publish toggle */}
                    <td>
                      <button
                        type="button"
                        onClick={() => toggleCustomPagePublish(page.id)}
                        className={`cms-badge ${page.isPublished !== false ? 'cms-badge-live' : 'cms-badge-draft'}`}
                        style={{ cursor: 'pointer', border: 'none' }}
                        title="Click to toggle Live/Draft"
                      >
                        {page.isPublished !== false ? (
                          <>
                            <Eye size={12} />
                            <span>Live</span>
                          </>
                        ) : (
                          <>
                            <EyeOff size={12} />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: 'right' }}>
                      <div className="cms-action-icons-group" style={{ justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={() => openEditModal(page)}
                          className="cms-icon-action-btn"
                          title="Edit Page"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(page.id, page.title)}
                          className="cms-icon-action-btn delete"
                          title="Delete Page"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Modal Dialog for Creating / Editing a Page */}
      {isModalOpen && (
        <div className="cms-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="cms-modal-card cms-page-builder-card"
            style={{ width: '92vw', maxWidth: '900px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="cms-modal-header">
              <div className="cms-modal-title-group">
                <Layers size={22} style={{ color: '#0f172a' }} />
                <div>
                  <h3 style={{ margin: 0 }}>{editingId ? `Edit: ${formState.title || 'Custom Page'}` : 'Create New Custom Page'}</h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Pre-styled with Mother Teresa Academy theme • All content blocks visible below
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="cms-close-btn"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick Section Jump Pill Bar */}
            <div className="cms-quick-nav-bar">
              <button type="button" className="cms-quick-nav-pill" onClick={() => scrollToSection('sec-identity')}>
                <span>🏷️ Title & URL</span>
              </button>
              <button type="button" className="cms-quick-nav-pill" onClick={() => scrollToSection('sec-menu')}>
                <span>🧭 Sidebar Menu</span>
              </button>
              <button type="button" className="cms-quick-nav-pill" onClick={() => scrollToSection('sec-photo')}>
                <span>🖼️ Feature Photo</span>
              </button>
              <button type="button" className="cms-quick-nav-pill" onClick={() => scrollToSection('sec-story')}>
                <span>✍️ Story & Content</span>
              </button>
              <button type="button" className="cms-quick-nav-pill" onClick={() => scrollToSection('sec-cards')}>
                <span>📋 Highlights Cards</span>
              </button>
              <button type="button" className="cms-quick-nav-pill" onClick={() => scrollToSection('sec-docs')}>
                <span>📎 Documents & Circular (PDF)</span>
              </button>
              <button type="button" className="cms-quick-nav-pill" onClick={() => scrollToSection('sec-cta')}>
                <span>🔘 CTA Button</span>
              </button>
            </div>

            {/* Form Body: Everything is clearly organized and visible! */}
            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
              <div 
                ref={modalBodyRef}
                className="cms-modal-body" 
                style={{ maxHeight: '68vh', overflowY: 'auto', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: '#f8fafc' }}
              >

                {/* SECTION 1: PAGE IDENTITY & URL */}
                <div id="sec-identity" className="cms-builder-section">
                  <div className="cms-builder-section-title">
                    <div className="cms-builder-section-icon" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
                      <Bookmark size={18} />
                    </div>
                    <div>
                      <h4>1. Page Identity & URL Path</h4>
                      <span>Set the primary headline, web URL address, and header pill badge</span>
                    </div>
                  </div>

                  <div className="cms-form-group" style={{ marginBottom: '0.25rem' }}>
                    <label htmlFor="page-title" style={{ fontSize: '0.9rem', fontWeight: '700' }}>Page Title *</label>
                    <input
                      id="page-title"
                      type="text"
                      required
                      value={formState.title}
                      onChange={handleTitleChange}
                      placeholder="e.g. Summer Robotics & AI Tinkering Camp 2026"
                      className="cms-input-field"
                      style={{ fontSize: '1.05rem', fontWeight: '600' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
                    <div className="cms-form-group">
                      <label htmlFor="page-slug" style={{ fontSize: '0.85rem' }}>
                        URL Slug *
                        <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 'normal', marginLeft: '6px' }}>
                          (Live path: /pages/...)
                        </span>
                      </label>
                      <input
                        id="page-slug"
                        type="text"
                        required
                        value={formState.slug}
                        onChange={(e) => setFormState({ ...formState, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-') })}
                        placeholder="summer-robotics-camp"
                        className="cms-input-field"
                      />
                    </div>

                    <div className="cms-form-group">
                      <label htmlFor="page-category" style={{ fontSize: '0.85rem' }}>Institutional Category</label>
                      <select
                        id="page-category"
                        value={formState.category}
                        onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                        className="cms-input-field"
                      >
                        {categories.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                    <div className="cms-form-group">
                      <label htmlFor="page-badge" style={{ fontSize: '0.85rem' }}>Header Pill Badge</label>
                      <input
                        id="page-badge"
                        type="text"
                        value={formState.badge}
                        onChange={(e) => setFormState({ ...formState, badge: e.target.value })}
                        placeholder="e.g. Special Initiative"
                        className="cms-input-field"
                      />
                    </div>

                    <div className="cms-form-group">
                      <label htmlFor="page-subtitle" style={{ fontSize: '0.85rem' }}>Subtitle / Lead Excerpt</label>
                      <input
                        id="page-subtitle"
                        type="text"
                        value={formState.subtitle}
                        onChange={(e) => setFormState({ ...formState, subtitle: e.target.value })}
                        placeholder="e.g. Fostering hands-on STEM inquiry, electronics, and algorithms."
                        className="cms-input-field"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 2: SIDEBAR MENU INTEGRATION */}
                <div id="sec-menu" className="cms-builder-section" style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
                  <div className="cms-builder-section-title">
                    <div className="cms-builder-section-icon" style={{ backgroundColor: '#dcfce7', color: '#166534' }}>
                      <MenuIcon size={18} />
                    </div>
                    <div>
                      <h4 style={{ color: '#166534' }}>2. Website Sidebar Navigation Menu Integration</h4>
                      <span style={{ color: '#15803d' }}>Control whether this page is featured in the main prospectus slide-out menu</span>
                    </div>
                  </div>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.92rem', fontWeight: '700', color: '#0f172a' }}>
                    <input
                      type="checkbox"
                      checked={formState.showInMenu}
                      onChange={(e) => setFormState({ ...formState, showInMenu: e.target.checked })}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span>Show this page in the main website slide-out Menu (Sidebar)</span>
                  </label>

                  {formState.showInMenu && (
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', paddingTop: '0.75rem', borderTop: '1px dashed #bbf7d0' }}>
                      <div className="cms-form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.84rem' }}>Menu Display Label</label>
                        <input
                          type="text"
                          value={formState.menuLabel}
                          onChange={(e) => setFormState({ ...formState, menuLabel: e.target.value })}
                          placeholder="e.g. Robotics Camp"
                          className="cms-input-field"
                        />
                      </div>

                      <div className="cms-form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.84rem' }}>Menu Badge (Optional)</label>
                        <input
                          type="text"
                          value={formState.menuBadge}
                          onChange={(e) => setFormState({ ...formState, menuBadge: e.target.value })}
                          placeholder="e.g. NEW or 2026"
                          className="cms-input-field"
                        />
                      </div>
                    </div>
                  )}

                  {/* Publish Mode Toggle */}
                  <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.86rem', fontWeight: '600' }}>
                      <input
                        type="checkbox"
                        checked={formState.isPublished}
                        onChange={(e) => setFormState({ ...formState, isPublished: e.target.checked })}
                        style={{ width: '16px', height: '16px' }}
                      />
                      <span style={{ color: formState.isPublished ? '#15803d' : '#64748b' }}>
                        {formState.isPublished ? '✓ Published (Live for all visitors)' : 'Draft Mode (Only visible to admin)'}
                      </span>
                    </label>
                  </div>
                </div>

                {/* SECTION 3: FEATURE SHOWCASE PHOTO */}
                <div id="sec-photo" className="cms-builder-section">
                  <div className="cms-builder-section-title">
                    <div className="cms-builder-section-icon" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
                      <ImageIcon size={18} />
                    </div>
                    <div>
                      <h4>3. Feature Showcase Photo & Media</h4>
                      <span>Upload high-resolution campus or event photography stored via Cloudinary</span>
                    </div>
                  </div>

                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handlePhotoUpload}
                  />
                  <div
                    className="cms-upload-dropzone"
                    onClick={() => photoInputRef.current?.click()}
                    style={{ padding: '1.5rem' }}
                  >
                    <Upload size={26} className="cms-dropzone-icon" />
                    <div>
                      <strong style={{ fontSize: '0.95rem' }}>Click to select and upload a showcase photo</strong>
                      <p>{isUploadingPhoto ? 'Uploading to Cloudinary...' : 'Images are securely stored on Cloudinary with fast worldwide delivery'}</p>
                    </div>
                  </div>

                  {/* Photo Preview & Remove */}
                  {formState.heroImage && (
                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f8fafc' }}>
                      <img
                        src={formState.heroImage}
                        alt="Showcase preview"
                        style={{ width: '100%', maxHeight: '280px', objectFit: 'cover', display: 'block' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px' }}>
                        <span style={{ fontSize: '0.84rem', color: '#166534', fontWeight: '600' }}>✓ Image uploaded to Cloudinary</span>
                        <button
                          type="button"
                          onClick={() => setFormState({ ...formState, heroImage: '', heroImageCaption: '' })}
                          style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: '600', fontSize: '0.84rem' }}
                        >
                          Remove Photo
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Or direct URL */}
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                      Or paste direct image URL (Unsplash, web link, etc.):
                    </span>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/... or https://..."
                      value={formState.heroImage}
                      onChange={(e) => setFormState({ ...formState, heroImage: e.target.value })}
                      className="cms-input-field"
                    />
                  </div>

                  <div className="cms-form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="page-caption" style={{ fontSize: '0.85rem' }}>Photo Caption & Credits</label>
                    <input
                      id="page-caption"
                      type="text"
                      value={formState.heroImageCaption}
                      onChange={(e) => setFormState({ ...formState, heroImageCaption: e.target.value })}
                      placeholder="e.g. Senior Secondary scholars conducting electronics and robotic microcontroller experiments."
                      className="cms-input-field"
                    />
                  </div>
                </div>

                {/* SECTION 4: STORY & NARRATIVE CONTENT */}
                <div id="sec-story" className="cms-builder-section">
                  <div className="cms-builder-section-title">
                    <div className="cms-builder-section-icon" style={{ backgroundColor: '#f3e8ff', color: '#7e22ce' }}>
                      <FileText size={18} />
                    </div>
                    <div>
                      <h4>4. Story & Narrative Content</h4>
                      <span>Write the full article, curriculum, or notice text (receives editorial dropcaps & typography)</span>
                    </div>
                  </div>

                  <div className="cms-form-group">
                    <label htmlFor="page-body" style={{ fontSize: '0.88rem', fontWeight: '700' }}>
                      Article Story / Narrative Text
                      <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 'normal', marginLeft: '8px' }}>
                        (Separate paragraphs with blank lines)
                      </span>
                    </label>
                    <textarea
                      id="page-body"
                      rows={8}
                      value={formState.bodyText}
                      onChange={(e) => setFormState({ ...formState, bodyText: e.target.value })}
                      placeholder="Write comprehensive article, curriculum overview, instructions, or institutional announcement here..."
                      className="cms-input-field"
                      style={{ fontSize: '0.95rem', lineHeight: 1.6, minHeight: '160px' }}
                    />
                  </div>

                  {/* Pullquote Box */}
                  <div style={{ padding: '1.25rem', backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                      <Quote size={18} style={{ color: '#92400e' }} />
                      <strong style={{ color: '#92400e', fontSize: '0.92rem' }}>
                        Featured Editorial Pullquote (Optional)
                      </strong>
                    </div>

                    <div className="cms-form-group">
                      <label style={{ fontSize: '0.82rem' }}>Quotation Text</label>
                      <input
                        type="text"
                        value={formState.pullquote}
                        onChange={(e) => setFormState({ ...formState, pullquote: e.target.value })}
                        placeholder="e.g. Hands-on scientific inquiry transforms curiosity into scholarly mastery."
                        className="cms-input-field"
                      />
                    </div>

                    <div className="cms-form-group" style={{ marginBottom: 0 }}>
                      <label style={{ fontSize: '0.82rem' }}>Quote Author / Attributed Source</label>
                      <input
                        type="text"
                        value={formState.pullquoteAuthor}
                        onChange={(e) => setFormState({ ...formState, pullquoteAuthor: e.target.value })}
                        placeholder="e.g. Saint Mother Teresa, Institutional Patron"
                        className="cms-input-field"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 5: HIGHLIGHT CARDS GRID */}
                <div id="sec-cards" className="cms-builder-section">
                  <div className="cms-builder-section-title" style={{ justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="cms-builder-section-icon" style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}>
                        <Sparkles size={18} />
                      </div>
                      <div>
                        <h4>5. Key Highlights Information Cards Grid</h4>
                        <span>Displays as responsive institutional fact boxes (e.g. Schedule, Venue, Eligibility, Fees)</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={addHighlightCard}
                      className="cms-btn cms-btn-outline-dark cms-btn-compact"
                    >
                      <Plus size={14} />
                      <span>Add Card</span>
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {formState.highlightCards.length === 0 ? (
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic' }}>
                        No highlight cards added yet. Click "+ Add Card" above to add boxes like Program Dates, Eligibility, Timings, etc.
                      </p>
                    ) : (
                      formState.highlightCards.map((card, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1.2fr 2fr 36px',
                            gap: '10px',
                            alignItems: 'center',
                            padding: '10px 14px',
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                          }}
                        >
                          <input
                            type="text"
                            value={card.title}
                            onChange={(e) => updateHighlightCard(idx, 'title', e.target.value)}
                            placeholder="Title (e.g. Venue)"
                            className="cms-input-field"
                            style={{ margin: 0 }}
                          />
                          <input
                            type="text"
                            value={card.desc}
                            onChange={(e) => updateHighlightCard(idx, 'desc', e.target.value)}
                            placeholder="Description (e.g. Central Science Lawn)"
                            className="cms-input-field"
                            style={{ margin: 0 }}
                          />
                          <button
                            type="button"
                            onClick={() => removeHighlightCard(idx)}
                            style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            title="Remove card"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* SECTION 6: DOCUMENTS & ATTACHMENTS */}
                <div id="sec-docs" className="cms-builder-section">
                  <div className="cms-builder-section-title">
                    <div className="cms-builder-section-icon" style={{ backgroundColor: '#fee2e2', color: '#b91c1c' }}>
                      <FileText size={18} />
                    </div>
                    <div>
                      <h4>6. Attached Circular Document (PDF)</h4>
                      <span>Allows students, parents, and visitors to download official circulars, timetables, or forms</span>
                    </div>
                  </div>

                  <input
                    ref={pdfInputRef}
                    type="file"
                    accept="application/pdf"
                    style={{ display: 'none' }}
                    onChange={handlePdfUpload}
                  />
                  <div
                    className="cms-upload-dropzone"
                    onClick={() => pdfInputRef.current?.click()}
                  >
                    <Upload size={24} className="cms-dropzone-icon" />
                    <div>
                      <strong>{formState.attachedPdfName || 'Click to select and attach a PDF document'}</strong>
                      <p>{isUploadingPdf ? 'Uploading document to Cloudinary...' : 'Supports official CBSE circulars, syllabus, registration forms'}</p>
                    </div>
                  </div>

                  {formState.attachedPdfUrl && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', fontSize: '0.86rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#166534', fontWeight: '700' }}>✓ Attached:</span>
                        <a
                          href={formState.attachedPdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#2563eb', textDecoration: 'underline', fontWeight: '600' }}
                        >
                          {formState.attachedPdfName || 'View Document'}
                        </a>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormState({ ...formState, attachedPdfUrl: '', attachedPdfName: '' })}
                        style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: '600' }}
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                      Or paste a Google Drive / external document URL:
                    </span>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/..."
                      value={formState.attachedPdfUrl}
                      onChange={(e) => setFormState({ ...formState, attachedPdfUrl: e.target.value, attachedPdfName: formState.attachedPdfName || 'Attached_Document.pdf' })}
                      className="cms-input-field"
                    />
                  </div>
                </div>

                {/* SECTION 7: CTA ACTION BUTTON */}
                <div id="sec-cta" className="cms-builder-section">
                  <div className="cms-builder-section-title">
                    <div className="cms-builder-section-icon" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>
                      <Send size={18} />
                    </div>
                    <div>
                      <h4>7. Call-to-Action / Action Button (Optional)</h4>
                      <span>Displays a prominent button in the sidebar (e.g. Register Online, Contact Desk)</span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                    <div className="cms-form-group">
                      <label style={{ fontSize: '0.84rem' }}>Button Label</label>
                      <input
                        type="text"
                        value={formState.actionButtonText}
                        onChange={(e) => setFormState({ ...formState, actionButtonText: e.target.value })}
                        placeholder="e.g. Register Online"
                        className="cms-input-field"
                      />
                    </div>

                    <div className="cms-form-group">
                      <label style={{ fontSize: '0.84rem' }}>Destination URL</label>
                      <input
                        type="text"
                        value={formState.actionButtonUrl}
                        onChange={(e) => setFormState({ ...formState, actionButtonUrl: e.target.value })}
                        placeholder="e.g. /contact or https://forms.google.com/..."
                        className="cms-input-field"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Modal Sticky Footer */}
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
                  disabled={isUploadingPhoto || isUploadingPdf}
                  className="cms-btn cms-btn-primary"
                  style={{ padding: '10px 20px', fontSize: '0.95rem' }}
                >
                  <Check size={16} />
                  <span>{editingId ? 'Save & Update Page' : 'Create & Save Page'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
