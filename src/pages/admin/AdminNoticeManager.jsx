import React, { useState, useRef } from 'react';
import { useCMS } from '../../context/CMSContext';
import { uploadMedia } from '../../lib/media';
import { 
  Bell, Plus, Edit2, Trash2, Eye, EyeOff, FileText, 
  Upload, AlertTriangle, Sparkles, Check, X, ArrowUp, ArrowDown 
} from 'lucide-react';

export default function AdminNoticeManager() {
  const { content, addNotice, updateNotice, deleteNotice, toggleNoticePublish, reorderNotices, showToast } = useCMS();
  const notices = content.notices || [];

  // Filter state
  const [activeCategory, setActiveCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'published', 'draft', 'urgent'

  // Modal State (Create / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const pdfInputRef = useRef(null);

  // Form State
  const [formState, setFormState] = useState({
    title: '',
    category: 'Admissions',
    customCategory: '',
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    urgent: false,
    isNew: true,
    isPublished: true,
    contentType: 'text', // 'text' | 'pdf'
    bodyContent: '',
    pdfUrl: '',
    pdfName: '',
  });

  const categories = ['Admissions', 'CBSE Exam', 'Academics', 'Events', 'Administration', 'Transport', 'Sports'];

  const openNewNoticeModal = () => {
    setEditingId(null);
    setFormState({
      title: '',
      category: 'Admissions',
      customCategory: '',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      urgent: false,
      isNew: true,
      isPublished: true,
      contentType: 'text',
      bodyContent: '',
      pdfUrl: '',
      pdfName: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (notice) => {
    setEditingId(notice.id);
    setFormState({
      title: notice.title || '',
      category: categories.includes(notice.category) ? notice.category : 'Custom',
      customCategory: categories.includes(notice.category) ? '' : notice.category,
      date: notice.date || '',
      urgent: !!notice.urgent,
      isNew: !!notice.isNew,
      isPublished: notice.isPublished !== false,
      contentType: notice.pdfUrl ? 'pdf' : 'text',
      bodyContent: notice.bodyContent || '',
      pdfUrl: notice.pdfUrl || '',
      pdfName: notice.pdfName || (notice.pdfUrl ? 'Attached_Circular.pdf' : ''),
    });
    setIsModalOpen(true);
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingPdf(true);
      const result = await uploadMedia(file);
      setFormState((prev) => ({
        ...prev,
        pdfUrl: result.url,
        pdfName: result.name,
      }));
      setIsUploadingPdf(false);
      showToast(`PDF document "${result.name}" attached!`, 'success');
    } catch (err) {
      setIsUploadingPdf(false);
      showToast('PDF attachment failed: ' + err.message, 'error');
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formState.title.trim()) {
      showToast('Please enter a notice title.', 'error');
      return;
    }

    const finalCategory = formState.category === 'Custom' ? (formState.customCategory || 'General') : formState.category;
    const finalNoticeData = {
      title: formState.title.trim(),
      category: finalCategory,
      date: formState.date,
      urgent: formState.urgent,
      isNew: formState.isNew,
      isPublished: formState.isPublished,
      bodyContent: formState.contentType === 'text' ? formState.bodyContent : '',
      pdfUrl: formState.contentType === 'pdf' ? formState.pdfUrl : '',
      pdfName: formState.contentType === 'pdf' ? formState.pdfName : '',
      linkText: formState.contentType === 'pdf' && formState.pdfUrl ? 'Download Circular (PDF)' : 'Read Notice',
      ref: formState.contentType === 'pdf' && formState.pdfUrl ? formState.pdfUrl : '#',
    };

    if (editingId) {
      updateNotice(editingId, finalNoticeData);
      showToast('Notice details updated in draft!', 'success');
    } else {
      addNotice(finalNoticeData);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteNotice(id);
    }
  };

  // Move notice up or down in the list
  const moveNotice = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= notices.length) return;
    const reordered = [...notices];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;
    reorderNotices(reordered);
    showToast('Notice order updated in draft.', 'info');
  };

  // Filter notices
  const filteredNotices = notices.filter((n) => {
    const matchesCat = activeCategory === 'All' || n.category.toLowerCase() === activeCategory.toLowerCase();
    if (!matchesCat) return false;
    if (filterStatus === 'published') return n.isPublished !== false;
    if (filterStatus === 'draft') return n.isPublished === false;
    if (filterStatus === 'urgent') return !!n.urgent;
    return true;
  });

  return (
    <div className="cms-management-screen">
      {/* Screen Header */}
      <div className="cms-screen-header">
        <div>
          <h1>Notice Board & Circulars Manager</h1>
          <p>Create, update, attach official PDF documents, and publish school notices in real time.</p>
        </div>
        <button
          type="button"
          onClick={openNewNoticeModal}
          className="cms-btn cms-btn-primary"
          style={{ padding: '9px 16px', fontSize: '0.9rem' }}
        >
          <Plus size={16} />
          <span>Draft New Notice</span>
        </button>
      </div>

      {/* Toolbar & Filters */}
      <div className="cms-notices-toolbar">
        {/* Category Pills */}
        <div className="cms-category-filter-bar">
          {['All', ...categories].map((cat) => (
            <button
              key={cat}
              type="button"
              className={`cms-cat-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="cms-input-field"
            style={{ padding: '6px 10px', fontSize: '0.82rem', width: 'auto' }}
          >
            <option value="all">All Statuses ({notices.length})</option>
            <option value="published">Published / Live Only</option>
            <option value="draft">Drafts Only</option>
            <option value="urgent">Urgent Only</option>
          </select>
        </div>
      </div>

      {/* Notices Table */}
      <div className="cms-notices-table-container">
        <table className="cms-notices-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>Order</th>
              <th>Notice Title & Flags</th>
              <th style={{ width: '130px' }}>Category</th>
              <th style={{ width: '120px' }}>Date</th>
              <th style={{ width: '110px' }}>Attachment</th>
              <th style={{ width: '100px' }}>Status</th>
              <th style={{ width: '120px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredNotices.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
                  No notices match the selected filter.
                </td>
              </tr>
            ) : (
              filteredNotices.map((notice, idx) => (
                <tr key={notice.id}>
                  {/* Reorder Arrows */}
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveNotice(idx, -1)}
                        className="cms-icon-action-btn"
                        style={{ padding: '2px', opacity: idx === 0 ? 0.3 : 1 }}
                        title="Move Up"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === notices.length - 1}
                        onClick={() => moveNotice(idx, 1)}
                        className="cms-icon-action-btn"
                        style={{ padding: '2px', opacity: idx === notices.length - 1 ? 0.3 : 1 }}
                        title="Move Down"
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>
                  </td>

                  {/* Title and badges */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <strong style={{ color: '#0f172a' }}>{notice.title}</strong>
                      {notice.urgent && <span className="cms-badge cms-badge-urgent">URGENT</span>}
                      {notice.isNew && <span className="cms-badge cms-badge-new">NEW</span>}
                    </div>
                    {notice.bodyContent && (
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                        {notice.bodyContent.substring(0, 80)}...
                      </p>
                    )}
                  </td>

                  {/* Category */}
                  <td>
                    <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#334155' }}>
                      {notice.category}
                    </span>
                  </td>

                  {/* Date */}
                  <td>
                    <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                      {notice.date}
                    </span>
                  </td>

                  {/* Attachment */}
                  <td>
                    {notice.pdfUrl ? (
                      <a
                        href={notice.pdfUrl}
                        download={notice.pdfName || "circular.pdf"}
                        target="_blank"
                        rel="noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#dc2626', fontSize: '0.8rem', fontWeight: '600', textDecoration: 'none' }}
                        title="Download attached PDF"
                      >
                        <FileText size={14} />
                        <span>PDF Doc</span>
                      </a>
                    ) : (
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Text Only</span>
                    )}
                  </td>

                  {/* Status Toggle */}
                  <td>
                    <button
                      type="button"
                      onClick={() => toggleNoticePublish(notice.id)}
                      className={`cms-badge ${notice.isPublished !== false ? 'cms-badge-live' : 'cms-badge-draft'}`}
                      style={{ cursor: 'pointer', border: 'none' }}
                      title="Click to toggle Live/Draft"
                    >
                      {notice.isPublished !== false ? (
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

                  {/* Action Buttons */}
                  <td style={{ textAlign: 'right' }}>
                    <div className="cms-action-icons-group" style={{ justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => openEditModal(notice)}
                        className="cms-icon-action-btn"
                        title="Edit Notice"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(notice.id, notice.title)}
                        className="cms-icon-action-btn delete"
                        title="Delete Notice"
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

      {/* Notice Create/Edit Modal */}
      {isModalOpen && (
        <div className="cms-modal-backdrop" onClick={() => setIsModalOpen(false)} role="dialog" aria-modal="true">
          <div className="cms-form-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="cms-modal-header">
              <div className="cms-modal-title-group">
                <Bell size={18} className="cms-header-icon" />
                <h3>{editingId ? 'Edit Circular / Notice' : 'Draft New Circular'}</h3>
              </div>
              <button type="button" className="cms-close-icon-btn" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="cms-modal-body">
                {/* Title */}
                <div className="cms-form-group">
                  <label htmlFor="notice-title">Notice Title *</label>
                  <input
                    id="notice-title"
                    type="text"
                    required
                    value={formState.title}
                    onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                    placeholder="e.g. Schedule for CBSE Board Examination Verification 2026"
                    className="cms-input-field"
                  />
                </div>

                {/* Category & Date */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="cms-form-group">
                    <label htmlFor="notice-category">Category</label>
                    <select
                      id="notice-category"
                      value={formState.category}
                      onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                      className="cms-input-field"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                      <option value="Custom">+ Add Custom Category...</option>
                    </select>
                    {formState.category === 'Custom' && (
                      <input
                        type="text"
                        placeholder="Enter custom category name"
                        value={formState.customCategory}
                        onChange={(e) => setFormState({ ...formState, customCategory: e.target.value })}
                        className="cms-input-field"
                        style={{ marginTop: '6px' }}
                      />
                    )}
                  </div>

                  <div className="cms-form-group">
                    <label htmlFor="notice-date">Publish Date</label>
                    <input
                      id="notice-date"
                      type="text"
                      value={formState.date}
                      onChange={(e) => setFormState({ ...formState, date: e.target.value })}
                      className="cms-input-field"
                    />
                  </div>
                </div>

                {/* Flags: Urgent & New */}
                <div style={{ display: 'flex', gap: '1.5rem', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.86rem', fontWeight: '600' }}>
                    <input
                      type="checkbox"
                      checked={formState.urgent}
                      onChange={(e) => setFormState({ ...formState, urgent: e.target.checked })}
                    />
                    <span style={{ color: '#dc2626' }}>Mark as URGENT (Ticker Highlight)</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.86rem', fontWeight: '600' }}>
                    <input
                      type="checkbox"
                      checked={formState.isNew}
                      onChange={(e) => setFormState({ ...formState, isNew: e.target.checked })}
                    />
                    <span style={{ color: '#0369a1' }}>Display 'NEW' Badge</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.86rem', fontWeight: '600' }}>
                    <input
                      type="checkbox"
                      checked={formState.isPublished}
                      onChange={(e) => setFormState({ ...formState, isPublished: e.target.checked })}
                    />
                    <span style={{ color: '#15803d' }}>Live / Published</span>
                  </label>
                </div>

                {/* Content Type: Free-Text vs PDF Upload */}
                <div className="cms-form-group">
                  <label>Notice Content Format</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      className={`cms-btn ${formState.contentType === 'text' ? 'cms-btn-primary' : 'cms-btn-outline-dark'}`}
                      style={{ flex: 1, padding: '8px' }}
                      onClick={() => setFormState({ ...formState, contentType: 'text' })}
                    >
                      <span>Free-Text Announcement</span>
                    </button>
                    <button
                      type="button"
                      className={`cms-btn ${formState.contentType === 'pdf' ? 'cms-btn-primary' : 'cms-btn-outline-dark'}`}
                      style={{ flex: 1, padding: '8px' }}
                      onClick={() => setFormState({ ...formState, contentType: 'pdf' })}
                    >
                      <span>PDF Document Attachment</span>
                    </button>
                  </div>
                </div>

                {/* Text Body */}
                {formState.contentType === 'text' ? (
                  <div className="cms-form-group">
                    <label htmlFor="notice-body">Announcement Body</label>
                    <textarea
                      id="notice-body"
                      rows={4}
                      value={formState.bodyContent}
                      onChange={(e) => setFormState({ ...formState, bodyContent: e.target.value })}
                      placeholder="Enter detailed notice text for parents, students, and staff..."
                      className="cms-input-field"
                    />
                  </div>
                ) : (
                  /* PDF Document Upload */
                  <div className="cms-form-group">
                    <label>Official Circular PDF Document</label>
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
                      <Upload size={22} className="cms-dropzone-icon" />
                      <div>
                        <strong>{formState.pdfName || 'Click to select and attach a PDF document'}</strong>
                        <p>{isUploadingPdf ? 'Uploading PDF file...' : 'Supports official CBSE circulars, date sheets, forms'}</p>
                      </div>
                    </div>
                    {formState.pdfUrl && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 12px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px', fontSize: '0.82rem' }}>
                        <span style={{ color: '#166534' }}>✓ Attached: {formState.pdfName || 'document.pdf'}</span>
                        <button
                          type="button"
                          onClick={() => setFormState({ ...formState, pdfUrl: '', pdfName: '' })}
                          style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: '600' }}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                )}
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
                  disabled={isUploadingPdf}
                  className="cms-btn cms-btn-primary"
                >
                  <Check size={16} />
                  <span>{editingId ? 'Save Changes' : 'Add to Drafts'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
