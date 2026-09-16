import React, { useState, useRef } from 'react';
import { useCMS } from '../../context/CMSContext';
import { schoolData } from '../../data/schoolData';
import { uploadMedia } from '../../lib/media';
import { 
  FileCheck, Plus, Edit2, Trash2, ExternalLink, 
  Upload, Check, X, FileText, Image as ImageIcon, AlertCircle, Loader2 
} from 'lucide-react';
import '../../styles/admin.css';

export default function AdminCbseManager() {
  const { content, addCbseItem, updateCbseItem, deleteCbseItem, showToast } = useCMS();
  
  const cbseData = content.cbseDisclosure || schoolData.cbseDisclosure;
  const sectionA = cbseData.sectionA || schoolData.cbseDisclosure.sectionA;
  const sectionB = cbseData.sectionB || schoolData.cbseDisclosure.sectionB;
  const sectionC = cbseData.sectionC || schoolData.cbseDisclosure.sectionC;
  const sectionD = cbseData.sectionD || schoolData.cbseDisclosure.sectionD;
  const sectionE = cbseData.sectionE || schoolData.cbseDisclosure.sectionE;

  const [activeTab, setActiveTab] = useState('sectionA');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Form state for creating/editing an item
  const [formState, setFormState] = useState({
    title: '',
    details: '',
    fileUrl: '',
    fileName: '',
  });

  const sectionsConfig = [
    { id: 'sectionA', title: 'Section A : General Info', fullTitle: sectionA?.sectionTitle || 'A : GENERAL INFORMATION', isDocs: false, list: sectionA?.fields || [] },
    { id: 'sectionB', title: 'Section B : Documents & Affidavits', fullTitle: sectionB?.sectionTitle || 'B : DOCUMENTS AND INFORMATION', isDocs: true, list: sectionB?.documents || [] },
    { id: 'sectionC', title: 'Section C : Result & Academics', fullTitle: sectionC?.sectionTitle || 'C : RESULT AND ACADEMICS', isDocs: true, list: sectionC?.documents || [] },
    { id: 'sectionD', title: 'Section D : Staff (Teaching)', fullTitle: sectionD?.sectionTitle || 'D : STAFF (TEACHING)', isDocs: false, list: sectionD?.fields || [] },
    { id: 'sectionE', title: 'Section E : Infrastructure', fullTitle: sectionE?.sectionTitle || 'E : SCHOOL INFRASTRUCTURE', isDocs: false, list: sectionE?.fields || [] },
  ];

  const currentSection = sectionsConfig.find((s) => s.id === activeTab) || sectionsConfig[0];

  const openNewItemModal = () => {
    setEditingIndex(null);
    setFormState({
      title: '',
      details: currentSection.isDocs ? 'Available' : '',
      fileUrl: '',
      fileName: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item, index) => {
    setEditingIndex(index);
    setFormState({
      title: item.documentName || item.parameter || item.information || '',
      details: item.details || item.status || '',
      fileUrl: item.fileUrl || '',
      fileName: item.fileName || (item.fileUrl ? 'Attached_Document' : ''),
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      showToast(`Uploading ${file.name} to Cloudinary...`, 'info');
      const uploaded = await uploadMedia(file, { folder: 'mta_cbse_disclosure' });
      setFormState((prev) => ({
        ...prev,
        fileUrl: uploaded.url,
        fileName: file.name,
      }));
      showToast('Document uploaded successfully!', 'success');
    } catch (err) {
      console.error('File upload error:', err);
      showToast('Upload failed: ' + err.message, 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formState.title.trim()) {
      showToast('Please enter a parameter or document title.', 'error');
      return;
    }

    const payload = currentSection.isDocs
      ? {
          documentName: formState.title.trim(),
          status: formState.details.trim() || 'Available',
          fileUrl: formState.fileUrl.trim(),
          fileName: formState.fileName.trim(),
        }
      : {
          parameter: formState.title.trim(),
          information: formState.title.trim(),
          details: formState.details.trim(),
          fileUrl: formState.fileUrl.trim(),
          fileName: formState.fileName.trim(),
        };

    if (editingIndex !== null) {
      updateCbseItem(activeTab, editingIndex, payload);
    } else {
      addCbseItem(activeTab, payload);
    }

    setIsModalOpen(false);
  };

  const handleDeleteItem = (index) => {
    if (window.confirm('Are you sure you want to remove this disclosure point from the table?')) {
      deleteCbseItem(activeTab, index);
    }
  };

  return (
    <div className="cms-management-screen" style={{ padding: '2rem 1.5rem' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#fef3c7', padding: '3px 10px', borderRadius: '4px', marginBottom: '0.4rem', border: '1px solid #fde68a' }}>
            <FileCheck size={14} style={{ color: '#92400e' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Statutory CBSE Regulatory Portal
            </span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
            CBSE Mandatory Public Disclosure (Appendix-IX)
          </h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.88rem' }}>
            Add, edit, or remove statutory disclosure records and attach downloadable PDF certificates or blueprints for Sections A to E.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <a
            href="/cbse-disclosure"
            target="_blank"
            rel="noopener noreferrer"
            className="cms-btn cms-btn-outline-dark"
            title="Preview live public disclosure page"
          >
            <ExternalLink size={14} />
            <span>View Live Disclosure</span>
          </a>
          <button
            type="button"
            onClick={openNewItemModal}
            className="cms-btn cms-btn-primary"
            style={{ backgroundColor: '#0b1b3d' }}
          >
            <Plus size={16} />
            <span>Add New Point / Document</span>
          </button>
        </div>
      </div>

      {/* Section Tabs */}
      <div style={{ display: 'flex', gap: '6px', borderBottom: '2px solid #e2e8f0', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '2px' }}>
        {sectionsConfig.map((sec) => (
          <button
            key={sec.id}
            type="button"
            onClick={() => setActiveTab(sec.id)}
            style={{
              padding: '8px 16px',
              fontSize: '0.86rem',
              fontWeight: 600,
              border: 'none',
              borderBottom: activeTab === sec.id ? '3px solid #c5973b' : '3px solid transparent',
              background: activeTab === sec.id ? '#ffffff' : 'transparent',
              color: activeTab === sec.id ? '#0b1b3d' : '#64748b',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              borderRadius: '4px 4px 0 0',
              transition: 'all 150ms ease'
            }}
          >
            {sec.title}
          </button>
        ))}
      </div>

      {/* Section Content Table */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
              {currentSection.fullTitle}
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Showing {currentSection.list.length} statutory records. Click Edit or Delete to modify entries.
            </span>
          </div>
          <button
            type="button"
            onClick={openNewItemModal}
            className="cms-btn cms-btn-outline-dark"
            style={{ fontSize: '0.8rem', padding: '5px 10px' }}
          >
            <Plus size={14} />
            <span>Add Row to this Section</span>
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9', color: '#475569', textTransform: 'uppercase', fontSize: '0.74rem', letterSpacing: '0.05em' }}>
                <th style={{ padding: '10px 14px', width: '60px' }}>S.No</th>
                <th style={{ padding: '10px 14px', width: '38%' }}>Parameter / Prescribed Document</th>
                <th style={{ padding: '10px 14px' }}>Institutional Record / Status</th>
                <th style={{ padding: '10px 14px', width: '200px' }}>Attached File (PDF / Image)</th>
                <th style={{ padding: '10px 14px', width: '100px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentSection.list.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                    No disclosure entries recorded in this section yet. Click "Add Row" above.
                  </td>
                </tr>
              ) : (
                currentSection.list.map((item, idx) => {
                  const paramTitle = item.documentName || item.parameter || item.information || 'Untitled';
                  const detailsText = item.details || item.status || '—';
                  const sNoDisplay = item.sNo ? String(item.sNo).padStart(2, '0') : String(idx + 1).padStart(2, '0');

                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0b1b3d' }}>
                        {sNoDisplay}
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0f172a' }}>
                        {paramTitle}
                      </td>
                      <td style={{ padding: '12px 14px', color: '#334155' }}>
                        {detailsText}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        {item.fileUrl ? (
                          <a
                            href={item.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '4px 8px',
                              backgroundColor: '#ecfdf5',
                              border: '1px solid #a7f3d0',
                              borderRadius: '4px',
                              color: '#065f46',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              textDecoration: 'none',
                              maxWidth: '180px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                            title="Open attached file"
                          >
                            <FileText size={13} style={{ flexShrink: 0 }} />
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {item.fileName || 'View Document'}
                            </span>
                            <ExternalLink size={10} style={{ flexShrink: 0 }} />
                          </a>
                        ) : (
                          <span style={{ fontSize: '0.76rem', color: '#94a3b8', fontStyle: 'italic' }}>
                            No file attached
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => openEditModal(item, idx)}
                            style={{ background: 'none', border: 'none', padding: '4px', color: '#2563eb', cursor: 'pointer' }}
                            title="Edit row"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(idx)}
                            style={{ background: 'none', border: 'none', padding: '4px', color: '#dc2626', cursor: 'pointer' }}
                            title="Delete row"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal Dialog */}
      {isModalOpen && (
        <div className="cms-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="cms-form-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="cms-modal-header">
              <div className="cms-modal-title-group">
                <FileCheck size={18} style={{ color: '#c5973b' }} />
                <h3>{editingIndex !== null ? 'Edit Disclosure Record' : 'Add Disclosure Record'}</h3>
              </div>
              <button
                type="button"
                className="cms-close-icon-btn"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
              <div className="cms-modal-body" style={{ overflowY: 'auto', flex: 1, minHeight: 0, gap: '1.2rem' }}>
                <div className="cms-form-group">
                  <label htmlFor="cbse-param-title">
                    {currentSection.isDocs ? 'Statutory Document Title *' : 'Information Parameter Title *'}
                  </label>
                  <input
                    id="cbse-param-title"
                    type="text"
                    required
                    value={formState.title}
                    onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                    placeholder="e.g. COPY OF VALID BUILDING SAFETY CERTIFICATE"
                    className="cms-input-field"
                  />
                </div>

                <div className="cms-form-group">
                  <label htmlFor="cbse-param-details">
                    {currentSection.isDocs ? 'Status / Verification Note' : 'Details / Value *'}
                  </label>
                  <input
                    id="cbse-param-details"
                    type="text"
                    required={!currentSection.isDocs}
                    value={formState.details}
                    onChange={(e) => setFormState({ ...formState, details: e.target.value })}
                    placeholder={currentSection.isDocs ? 'e.g. Certified on record / Available' : 'e.g. 5000 Sq. Mtrs. / Yes'}
                    className="cms-input-field"
                  />
                </div>

                {/* File Attachment: PDF or Image */}
                <div className="cms-form-group">
                  <label>
                    Attached Document or Certificate (PDF / Image)
                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 'normal', marginLeft: '6px' }}>
                      (Optional - Upload file or enter web link)
                    </span>
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf,image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                  />

                  <div
                    className="cms-upload-dropzone"
                    onClick={() => fileInputRef.current?.click()}
                    style={{ cursor: 'pointer' }}
                  >
                    {isUploading ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Loader2 size={20} className="cms-spinner" />
                        <span>Uploading file to Cloudinary...</span>
                      </div>
                    ) : (
                      <>
                        <Upload size={20} className="cms-dropzone-icon" />
                        <div>
                          <strong>{formState.fileName || 'Click to select and upload a PDF or Image'}</strong>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                            Upload official CBSE affiliation letter, NOC, building safety, fire NOC, or fee structure
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {formState.fileUrl && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px', fontSize: '0.84rem', marginTop: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                        <span style={{ color: '#166534', fontWeight: 600 }}>✓ Attached:</span>
                        <a
                          href={formState.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#2563eb', textDecoration: 'underline', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '280px' }}
                        >
                          {formState.fileName || 'View Uploaded Document'}
                        </a>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormState({ ...formState, fileUrl: '', fileName: '' })}
                        style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {/* Fallback Direct Link */}
                  <div style={{ marginTop: '8px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>
                      Or paste a Google Drive / Web Document Link:
                    </span>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/... or https://..."
                      value={formState.fileUrl}
                      onChange={(e) => setFormState({
                        ...formState,
                        fileUrl: e.target.value,
                        fileName: formState.fileName || (e.target.value ? 'Official_Document' : '')
                      })}
                      className="cms-input-field"
                      style={{ fontSize: '0.84rem' }}
                    />
                  </div>
                </div>
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
                  style={{ backgroundColor: '#0b1b3d' }}
                >
                  <Check size={16} />
                  <span>{editingIndex !== null ? 'Save Changes' : 'Add to Section'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
