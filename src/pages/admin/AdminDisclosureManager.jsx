import React, { useState, useRef } from 'react';
import { useCMS } from '../../context/CMSContext';
import { uploadMedia } from '../../lib/media';
import { 
  FileCheck, Plus, Trash2, Edit3, Eye, EyeOff, 
  Upload, Download, ExternalLink, X, Check, 
  FileText, Image as ImageIcon, ShieldCheck, Award,
  ArrowUp, ArrowDown, Search, Filter, AlertCircle,
  HelpCircle, RefreshCw, Layers
} from 'lucide-react';

export default function AdminDisclosureManager() {
  const { 
    content, 
    addDisclosureDoc, 
    updateDisclosureDoc, 
    deleteDisclosureDoc, 
    toggleDisclosureDocVisibility, 
    reorderDisclosureDocs,
    updateField,
    showToast 
  } = useCMS();

  const disclosureDocs = content.disclosureDocuments || [];
  const cbseDisclosure = content.cbseDisclosure || {};

  // Tab: 'documents' | 'appendix_editor'
  const [activeTab, setActiveTab] = useState('documents');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Preview Modal state
  const [previewDoc, setPreviewDoc] = useState(null);

  // Form State
  const [formState, setFormState] = useState({
    title: '',
    category: 'Affiliation & Recognition',
    fileType: 'pdf',
    fileUrl: '',
    documentNumber: '',
    issuingAuthority: '',
    issueDate: '',
    validUntil: '',
    description: '',
    isPublished: true,
  });

  const categories = [
    'All',
    'Affiliation & Recognition',
    'Safety & Compliance',
    'Academics & Fees',
    'Society & Governance',
    'Staff & Administration',
  ];

  const openAddModal = () => {
    setEditingDoc(null);
    setFormState({
      title: '',
      category: 'Affiliation & Recognition',
      fileType: 'pdf',
      fileUrl: '',
      documentNumber: '',
      issuingAuthority: '',
      issueDate: new Date().toLocaleDateString('en-GB'),
      validUntil: 'Statutory Compliance',
      description: '',
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (doc) => {
    setEditingDoc(doc);
    setFormState({
      title: doc.title || '',
      category: doc.category || 'Affiliation & Recognition',
      fileType: doc.fileType || (doc.fileUrl?.endsWith('.pdf') ? 'pdf' : 'photo'),
      fileUrl: doc.fileUrl || '',
      documentNumber: doc.documentNumber || '',
      issuingAuthority: doc.issuingAuthority || '',
      issueDate: doc.issueDate || '',
      validUntil: doc.validUntil || '',
      description: doc.description || '',
      isPublished: doc.isPublished !== false,
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      const result = await uploadMedia(file);
      
      setFormState((prev) => ({
        ...prev,
        fileUrl: result.url,
        fileType: isPdf ? 'pdf' : 'photo',
        title: prev.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      }));
      setIsUploading(false);
      showToast(`${isPdf ? 'PDF document' : 'Photo'} uploaded successfully!`, 'success');
    } catch (err) {
      setIsUploading(false);
      showToast('Upload failed: ' + err.message, 'error');
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formState.title.trim()) {
      showToast('Please enter a document title.', 'error');
      return;
    }
    if (!formState.fileUrl.trim()) {
      showToast('Please upload a file or enter a document URL.', 'error');
      return;
    }

    if (editingDoc) {
      updateDisclosureDoc(editingDoc.id, formState);
      showToast('Disclosure document updated in draft!', 'success');
    } else {
      addDisclosureDoc(formState);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}" from Mandatory Disclosure?`)) {
      deleteDisclosureDoc(id);
    }
  };

  const moveDoc = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= disclosureDocs.length) return;
    const reordered = [...disclosureDocs];
    const temp = reordered[index];
    reordered[index] = reordered[target];
    reordered[target] = temp;
    reorderDisclosureDocs(reordered);
  };

  // Filtered documents
  const filteredDocs = disclosureDocs.filter((doc) => {
    const matchesCat = activeCategory === 'All' || (doc.category && doc.category.toLowerCase() === activeCategory.toLowerCase());
    const matchesSearch = !searchQuery.trim() || 
      (doc.title && doc.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.documentNumber && doc.documentNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.issuingAuthority && doc.issuingAuthority.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="cms-management-screen">
      {/* 1. Header Area */}
      <div className="cms-screen-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <span className="cms-screen-badge" style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' }}>
              Appendix-IX Compliance
            </span>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Affiliation No: <strong>2134272</strong> | School Code: <strong>61658</strong>
            </span>
          </div>
          <h1>Mandatory Public Disclosure & Certificates Manager</h1>
          <p>Upload, update, and manage official CBSE Affiliation letters, fire safety, building safety, RTE certificates, and fee schedule PDFs & photos.</p>
        </div>

        <div className="cms-header-actions">
          <button
            type="button"
            className="cms-btn cms-btn-primary"
            onClick={openAddModal}
          >
            <Plus size={16} />
            <span>Upload New Document / Photo</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Glance Bar */}
      <div className="cms-disclosure-metric-bar">
        <div className="cms-disc-metric-card">
          <span className="cms-disc-metric-num">{disclosureDocs.length}</span>
          <span className="cms-disc-metric-title">Total Certificates & Docs</span>
        </div>
        <div className="cms-disc-metric-card">
          <span className="cms-disc-metric-num" style={{ color: '#15803d' }}>
            {disclosureDocs.filter((d) => d.isPublished !== false).length}
          </span>
          <span className="cms-disc-metric-title">Live on Disclosure Page</span>
        </div>
        <div className="cms-disc-metric-card">
          <span className="cms-disc-metric-num" style={{ color: '#dc2626' }}>
            {disclosureDocs.filter((d) => d.fileType === 'pdf' || d.fileUrl?.endsWith('.pdf')).length}
          </span>
          <span className="cms-disc-metric-title">PDF Documents</span>
        </div>
        <div className="cms-disc-metric-card">
          <span className="cms-disc-metric-num" style={{ color: '#0284c7' }}>
            {disclosureDocs.filter((d) => d.fileType === 'photo' || !d.fileUrl?.endsWith('.pdf')).length}
          </span>
          <span className="cms-disc-metric-title">Certificate Photos</span>
        </div>
      </div>

      {/* 3. Sub-Tab Switcher: 'Documents & Certificates' vs 'Appendix-IX Fast Editor' */}
      <div className="cms-tab-bar" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
        <button
          type="button"
          className={`cms-btn ${activeTab === 'documents' ? 'cms-btn-primary' : 'cms-btn-outline'}`}
          onClick={() => setActiveTab('documents')}
        >
          <FileCheck size={15} />
          <span>Certificates & Document Vault ({disclosureDocs.length})</span>
        </button>

        <button
          type="button"
          className={`cms-btn ${activeTab === 'appendix_editor' ? 'cms-btn-primary' : 'cms-btn-outline'}`}
          onClick={() => setActiveTab('appendix_editor')}
        >
          <Award size={15} />
          <span>Appendix-IX Statutory Data Form</span>
        </button>
      </div>

      {/* TAB 1: CERTIFICATES & DOCUMENT MANAGEMENT */}
      {activeTab === 'documents' && (
        <>
          {/* Controls Bar (Filter + Search) */}
          <div className="cms-filter-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div className="cms-category-tabs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`cms-filter-tab ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="cms-search-box" style={{ minWidth: '260px', position: 'relative' }}>
              <input
                type="text"
                placeholder="Search by title, authority or doc no..."
                className="cms-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.2rem' }}
              />
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            </div>
          </div>

          {/* Documents Grid / Table */}
          {filteredDocs.length === 0 ? (
            <div className="cms-empty-state">
              <FileCheck size={48} style={{ color: '#94a3b8', margin: '0 auto 1rem' }} />
              <h3>No Disclosure Documents Found</h3>
              <p>No documents match the active filter or search query. Click below to add a new document or photo.</p>
              <button
                type="button"
                className="cms-btn cms-btn-primary"
                onClick={openAddModal}
                style={{ marginTop: '1rem' }}
              >
                <Plus size={16} />
                <span>Upload First Document</span>
              </button>
            </div>
          ) : (
            <div className="cms-disclosure-grid">
              {filteredDocs.map((doc, idx) => {
                const isPdf = doc.fileType === 'pdf' || doc.fileUrl?.toLowerCase().endsWith('.pdf');
                const isPub = doc.isPublished !== false;

                return (
                  <div key={doc.id} className={`cms-disc-card ${!isPub ? 'is-hidden' : ''}`}>
                    {/* Top Preview */}
                    <div 
                      className="cms-disc-preview"
                      onClick={() => setPreviewDoc(doc)}
                      title="Click to preview file"
                    >
                      {isPdf ? (
                        <div className="cms-disc-pdf-box">
                          <FileText size={36} color="#dc2626" />
                          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginTop: '0.35rem' }}>
                            PDF Document
                          </span>
                        </div>
                      ) : (
                        <img
                          src={doc.fileUrl}
                          alt={doc.title}
                          className="cms-disc-img"
                        />
                      )}

                      <div className="cms-disc-hover-pill">
                        <Eye size={14} />
                        <span>Preview</span>
                      </div>

                      {/* Type Badge */}
                      <span className={`cms-disc-badge-pill ${isPdf ? 'pdf' : 'photo'}`}>
                        {isPdf ? 'PDF' : 'PHOTO'}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="cms-disc-content">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        <span className="cms-disc-cat-tag">{doc.category || 'Compliance'}</span>
                        <span className={`cms-disc-status-tag ${isPub ? 'published' : 'hidden'}`}>
                          {isPub ? '● Live on Site' : '○ Hidden'}
                        </span>
                      </div>

                      <h4 className="cms-disc-title">{doc.title}</h4>

                      <div className="cms-disc-meta-list">
                        {doc.documentNumber && (
                          <div className="cms-disc-meta-item">
                            <strong>Ref No:</strong> <span>{doc.documentNumber}</span>
                          </div>
                        )}
                        {doc.issuingAuthority && (
                          <div className="cms-disc-meta-item">
                            <strong>Authority:</strong> <span>{doc.issuingAuthority}</span>
                          </div>
                        )}
                        {doc.validUntil && (
                          <div className="cms-disc-meta-item">
                            <strong>Validity:</strong> <span>{doc.validUntil}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Bar */}
                      <div className="cms-disc-actions">
                        <div className="cms-disc-order-btns">
                          <button
                            type="button"
                            className="cms-icon-action-btn"
                            disabled={idx === 0}
                            onClick={() => moveDoc(idx, -1)}
                            title="Move Up"
                          >
                            <ArrowUp size={13} />
                          </button>
                          <button
                            type="button"
                            className="cms-icon-action-btn"
                            disabled={idx === disclosureDocs.length - 1}
                            onClick={() => moveDoc(idx, 1)}
                            title="Move Down"
                          >
                            <ArrowDown size={13} />
                          </button>
                        </div>

                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            type="button"
                            className="cms-icon-action-btn"
                            onClick={() => toggleDisclosureDocVisibility(doc.id)}
                            title={isPub ? 'Hide from public site' : 'Show on public site'}
                          >
                            {isPub ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>

                          <button
                            type="button"
                            className="cms-icon-action-btn"
                            onClick={() => openEditModal(doc)}
                            title="Edit details"
                          >
                            <Edit3 size={14} />
                          </button>

                          <button
                            type="button"
                            className="cms-icon-action-btn danger"
                            onClick={() => handleDelete(doc.id, doc.title)}
                            title="Delete document"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* TAB 2: APPENDIX-IX STATUTORY DATA QUICK EDITOR */}
      {activeTab === 'appendix_editor' && (
        <div className="cms-appendix-editor-panel" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '2rem', borderRadius: '6px' }}>
          <div style={{ marginBottom: '1.75rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.3rem' }}>Appendix-IX Statutory Parameters</h3>
            <p style={{ margin: '0.35rem 0 0', color: '#64748b', fontSize: '0.88rem' }}>
              Directly edit official school values published in the Mandatory Disclosure tables on the live website.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {/* General Info */}
            <div className="cms-form-group">
              <label className="cms-label">CBSE Affiliation Number</label>
              <input
                type="text"
                className="cms-input"
                defaultValue={cbseDisclosure.sectionA?.fields?.[1]?.details || '2134272'}
                onChange={(e) => updateField('cbseDisclosure.sectionA.fields.1.details', e.target.value)}
              />
            </div>

            <div className="cms-form-group">
              <label className="cms-label">CBSE School Code / Center No.</label>
              <input
                type="text"
                className="cms-input"
                defaultValue={cbseDisclosure.sectionA?.fields?.[2]?.details || '61658'}
                onChange={(e) => updateField('cbseDisclosure.sectionA.fields.2.details', e.target.value)}
              />
            </div>

            <div className="cms-form-group">
              <label className="cms-label">Principal Name & Qualifications</label>
              <input
                type="text"
                className="cms-input"
                defaultValue={cbseDisclosure.sectionA?.fields?.[4]?.details || 'Mrs. NARGIS (M.A / B.Ed)'}
                onChange={(e) => updateField('cbseDisclosure.sectionA.fields.4.details', e.target.value)}
              />
            </div>

            <div className="cms-form-group">
              <label className="cms-label">School Email Address</label>
              <input
                type="email"
                className="cms-input"
                defaultValue={cbseDisclosure.sectionA?.fields?.[5]?.details || 'motherteresaacademybaraut@gmail.com'}
                onChange={(e) => updateField('cbseDisclosure.sectionA.fields.5.details', e.target.value)}
              />
            </div>

            <div className="cms-form-group">
              <label className="cms-label">Contact Numbers (Mobile / Landline)</label>
              <input
                type="text"
                className="cms-input"
                defaultValue={cbseDisclosure.sectionA?.fields?.[6]?.details || '9557667999 / 7017551638'}
                onChange={(e) => updateField('cbseDisclosure.sectionA.fields.6.details', e.target.value)}
              />
            </div>

            <div className="cms-form-group">
              <label className="cms-label">Total Teaching Staff (Staff Count)</label>
              <input
                type="text"
                className="cms-input"
                defaultValue={cbseDisclosure.sectionD?.fields?.[1]?.details || '22'}
                onChange={(e) => updateField('cbseDisclosure.sectionD.fields.1.details', e.target.value)}
              />
            </div>

            <div className="cms-form-group">
              <label className="cms-label">Total Campus Area (Sq. Mtrs.)</label>
              <input
                type="text"
                className="cms-input"
                defaultValue={cbseDisclosure.sectionE?.fields?.[0]?.details || '6275 SQ. MTRS. (1.55 ACRES)'}
                onChange={(e) => updateField('cbseDisclosure.sectionE.fields.0.details', e.target.value)}
              />
            </div>

            <div className="cms-form-group">
              <label className="cms-label">Total Classrooms</label>
              <input
                type="text"
                className="cms-input"
                defaultValue={cbseDisclosure.sectionE?.fields?.[1]?.details || '15 ROOMS (EACH > 46.5 SQ. MTR / >500 SQ. FT)'}
                onChange={(e) => updateField('cbseDisclosure.sectionE.fields.1.details', e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Note: Remember to click the top <strong>"Publish"</strong> button to deploy your edits live to Firestore!
            </span>
          </div>
        </div>
      )}

      {/* 4. ADD / EDIT DOCUMENT MODAL */}
      {isModalOpen && (
        <div className="cms-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="cms-modal-card" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div className="cms-modal-header">
              <div className="cms-modal-title-group">
                <FileCheck size={20} style={{ color: '#c5973b' }} />
                <h3>{editingDoc ? 'Edit Disclosure Document' : 'Upload Disclosure Document / Photo'}</h3>
              </div>
              <button
                type="button"
                className="cms-close-icon-btn"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="cms-modal-body">
              {/* Document Title */}
              <div className="cms-form-group">
                <label className="cms-label">Document / Certificate Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CBSE Senior Secondary Affiliation Grant Letter"
                  className="cms-input"
                  value={formState.title}
                  onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                />
              </div>

              {/* Category & Document Type */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="cms-form-group">
                  <label className="cms-label">Category *</label>
                  <select
                    className="cms-select"
                    value={formState.category}
                    onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                  >
                    <option value="Affiliation & Recognition">Affiliation & Recognition</option>
                    <option value="Safety & Compliance">Safety & Compliance</option>
                    <option value="Academics & Fees">Academics & Fees</option>
                    <option value="Society & Governance">Society & Governance</option>
                    <option value="Staff & Administration">Staff & Administration</option>
                  </select>
                </div>

                <div className="cms-form-group">
                  <label className="cms-label">Document Type *</label>
                  <select
                    className="cms-select"
                    value={formState.fileType}
                    onChange={(e) => setFormState({ ...formState, fileType: e.target.value })}
                  >
                    <option value="pdf">PDF Document (.pdf)</option>
                    <option value="photo">Official Photo / Certificate (.jpg, .png)</option>
                  </select>
                </div>
              </div>

              {/* File Upload Box */}
              <div className="cms-form-group">
                <label className="cms-label">Upload File or Provide URL *</label>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />

                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <button
                    type="button"
                    className="cms-btn cms-btn-outline"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={15} />
                    <span>{isUploading ? 'Uploading...' : 'Browse File from Device'}</span>
                  </button>
                </div>

                <input
                  type="text"
                  required
                  placeholder="/disclosure/your-file.pdf or https://..."
                  className="cms-input"
                  value={formState.fileUrl}
                  onChange={(e) => setFormState({ ...formState, fileUrl: e.target.value })}
                />
                
                {formState.fileUrl && (
                  <span style={{ fontSize: '0.78rem', color: '#15803d', display: 'block', marginTop: '0.25rem' }}>
                    ✓ Target File: {formState.fileUrl}
                  </span>
                )}
              </div>

              {/* Reference Number & Issuing Authority */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="cms-form-group">
                  <label className="cms-label">Document Reference / Reg. No.</label>
                  <input
                    type="text"
                    placeholder="e.g. CBSE/2134272/SS-00807-2526"
                    className="cms-input"
                    value={formState.documentNumber}
                    onChange={(e) => setFormState({ ...formState, documentNumber: e.target.value })}
                  />
                </div>

                <div className="cms-form-group">
                  <label className="cms-label">Issuing Authority</label>
                  <input
                    type="text"
                    placeholder="e.g. CBSE New Delhi / CFO Baghpat"
                    className="cms-input"
                    value={formState.issuingAuthority}
                    onChange={(e) => setFormState({ ...formState, issuingAuthority: e.target.value })}
                  />
                </div>
              </div>

              {/* Issue Date & Validity */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="cms-form-group">
                  <label className="cms-label">Issue Date</label>
                  <input
                    type="text"
                    placeholder="e.g. 10/03/2025"
                    className="cms-input"
                    value={formState.issueDate}
                    onChange={(e) => setFormState({ ...formState, issueDate: e.target.value })}
                  />
                </div>

                <div className="cms-form-group">
                  <label className="cms-label">Valid Until</label>
                  <input
                    type="text"
                    placeholder="e.g. 31/03/2030 or Permanent"
                    className="cms-input"
                    value={formState.validUntil}
                    onChange={(e) => setFormState({ ...formState, validUntil: e.target.value })}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="cms-form-group">
                <label className="cms-label">Description / Statutory Notes</label>
                <textarea
                  className="cms-textarea"
                  placeholder="State the compliance details or summary of this statutory document..."
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  rows={2}
                />
              </div>

              {/* Visibility Checkbox */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="doc-publish-toggle"
                  checked={formState.isPublished}
                  onChange={(e) => setFormState({ ...formState, isPublished: e.target.checked })}
                />
                <label htmlFor="doc-publish-toggle" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                  Publish this document on the public Mandatory Disclosure page
                </label>
              </div>

              {/* Modal Footer */}
              <div className="cms-modal-footer" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="cms-btn cms-btn-outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cms-btn cms-btn-primary"
                >
                  <Check size={15} />
                  <span>{editingDoc ? 'Save Changes' : 'Add to Disclosure Vault'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. PREVIEW MODAL */}
      {previewDoc && (
        <div className="doc-modal-backdrop" onClick={() => setPreviewDoc(null)}>
          <div className="doc-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="doc-modal-header">
              <div className="doc-modal-title-group">
                <span>{previewDoc.category || 'Mandatory Public Disclosure'}</span>
                <h3>{previewDoc.title}</h3>
              </div>
              <button
                type="button"
                className="doc-modal-close-btn"
                onClick={() => setPreviewDoc(null)}
              >
                <X size={22} />
              </button>
            </div>

            <div className="doc-modal-content">
              {previewDoc.fileType === 'pdf' || previewDoc.fileUrl?.toLowerCase().endsWith('.pdf') ? (
                <div className="doc-modal-pdf-wrapper">
                  <object
                    data={`${previewDoc.fileUrl}#toolbar=1&navpanes=0`}
                    type="application/pdf"
                    className="doc-modal-pdf-embed"
                  >
                    <iframe
                      src={previewDoc.fileUrl}
                      title={previewDoc.title}
                      className="doc-modal-pdf-embed"
                    />
                  </object>
                </div>
              ) : (
                <div className="doc-modal-img-viewport">
                  <img
                    src={previewDoc.fileUrl}
                    alt={previewDoc.title}
                    className="doc-modal-img"
                  />
                </div>
              )}
            </div>

            <div className="doc-modal-footer">
              <span className="doc-modal-meta">
                Ref: <strong>{previewDoc.documentNumber || '—'}</strong> | Authority: <strong>{previewDoc.issuingAuthority || '—'}</strong>
              </span>

              <div className="doc-modal-actions">
                <a
                  href={previewDoc.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="cms-btn cms-btn-outline cms-btn-compact"
                >
                  <ExternalLink size={14} />
                  <span>Open in Tab</span>
                </a>
                <a
                  href={previewDoc.fileUrl}
                  download
                  className="cms-btn cms-btn-primary cms-btn-compact"
                >
                  <Download size={14} />
                  <span>Download</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
