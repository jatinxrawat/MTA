import React, { useState, useRef } from 'react';
import { useCMS } from '../../context/CMSContext';
import { schoolData } from '../../data/schoolData';
import { uploadMedia } from '../../lib/media';
import { 
  Users, Plus, Edit2, Trash2, ExternalLink, 
  Upload, Check, X, Award, BarChart3, Layers, 
  Image as ImageIcon, Loader2, Sparkles 
} from 'lucide-react';
import '../../styles/admin.css';

export default function AdminStaffManager() {
  const { 
    content, 
    addFacultyMember, 
    updateFacultyMember, 
    deleteFacultyMember,
    updateStaffMetrics,
    addCadreRow,
    updateCadreRow,
    deleteCadreRow,
    showToast 
  } = useCMS();

  const staff = content.staff || schoolData.staff;
  const leadership = Array.isArray(staff.leadership) ? staff.leadership : (schoolData.staff.leadership || []);
  const metrics = staff.metrics || schoolData.staff.metrics || {};
  const cadreBreakdown = Array.isArray(staff.cadreBreakdown) ? staff.cadreBreakdown : (schoolData.staff.cadreBreakdown || []);

  // Tabs: 'faculty' | 'metrics' | 'cadre'
  const [activeTab, setActiveTab] = useState('faculty');

  // --- FACULTY MODAL STATE ---
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
  const [editingFacultyIndex, setEditingFacultyIndex] = useState(null);
  const [facultyForm, setFacultyForm] = useState({
    role: '',
    name: '',
    qualifications: '',
    experience: '',
    messageExcerpt: '',
    photo: '',
  });
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const photoInputRef = useRef(null);

  // --- METRICS FORM STATE ---
  const [metricsForm, setMetricsForm] = useState({
    totalTeachingStaff: metrics.totalTeachingStaff || '42+',
    studentTeacherRatio: metrics.studentTeacherRatio || '1.5 : 1',
    teachersWithPostGraduation: metrics.teachersWithPostGraduation || '88%',
  });

  // --- CADRE MODAL STATE ---
  const [isCadreModalOpen, setIsCadreModalOpen] = useState(false);
  const [editingCadreIndex, setEditingCadreIndex] = useState(null);
  const [cadreForm, setCadreForm] = useState({
    category: '',
    count: '01',
    qualificationRequirement: '',
    status: 'Regular Appointed',
  });

  // --- FACULTY HANDLERS ---
  const openNewFacultyModal = () => {
    setEditingFacultyIndex(null);
    setFacultyForm({
      role: 'Senior Faculty',
      name: '',
      qualifications: 'M.Sc., B.Ed.',
      experience: '10+ Years CBSE Experience',
      messageExcerpt: '',
      photo: '',
    });
    setIsFacultyModalOpen(true);
  };

  const openEditFacultyModal = (member, index) => {
    setEditingFacultyIndex(index);
    setFacultyForm({
      role: member.role || '',
      name: member.name || '',
      qualifications: member.qualifications || '',
      experience: member.experience || '',
      messageExcerpt: member.messageExcerpt || '',
      photo: member.photo || '',
    });
    setIsFacultyModalOpen(true);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    try {
      showToast(`Uploading photo for ${file.name}...`, 'info');
      const uploaded = await uploadMedia(file, { folder: 'mta_faculty_photos' });
      setFacultyForm((prev) => ({ ...prev, photo: uploaded.url }));
      showToast('Faculty portrait uploaded successfully!', 'success');
    } catch (err) {
      console.error('Photo upload error:', err);
      showToast('Upload failed: ' + err.message, 'error');
    } finally {
      setIsUploadingPhoto(false);
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  };

  const handleFacultySubmit = (e) => {
    e.preventDefault();
    if (!facultyForm.name.trim() || !facultyForm.role.trim()) {
      showToast('Please enter both faculty name and role/designation.', 'error');
      return;
    }

    if (editingFacultyIndex !== null) {
      updateFacultyMember(editingFacultyIndex, facultyForm);
    } else {
      addFacultyMember(facultyForm);
    }
    setIsFacultyModalOpen(false);
  };

  const handleDeleteFaculty = (index) => {
    if (window.confirm('Remove this faculty card from the website?')) {
      deleteFacultyMember(index);
    }
  };

  // --- METRICS HANDLERS ---
  const handleSaveMetrics = (e) => {
    e.preventDefault();
    updateStaffMetrics(metricsForm);
  };

  // --- CADRE HANDLERS ---
  const openNewCadreModal = () => {
    setEditingCadreIndex(null);
    setCadreForm({
      category: '',
      count: '01',
      qualificationRequirement: 'Graduate / Post Graduate with B.Ed.',
      status: 'Regular Appointed',
    });
    setIsCadreModalOpen(true);
  };

  const openEditCadreModal = (row, index) => {
    setEditingCadreIndex(index);
    setCadreForm({
      category: row.category || '',
      count: row.count || '',
      qualificationRequirement: row.qualificationRequirement || '',
      status: row.status || 'Regular Appointed',
    });
    setIsCadreModalOpen(true);
  };

  const handleCadreSubmit = (e) => {
    e.preventDefault();
    if (!cadreForm.category.trim()) {
      showToast('Please enter a cadre designation name.', 'error');
      return;
    }

    if (editingCadreIndex !== null) {
      updateCadreRow(editingCadreIndex, cadreForm);
    } else {
      addCadreRow(cadreForm);
    }
    setIsCadreModalOpen(false);
  };

  const handleDeleteCadre = (index) => {
    if (window.confirm('Remove this cadre designation row from the table?')) {
      deleteCadreRow(index);
    }
  };

  return (
    <div className="cms-management-screen" style={{ padding: '2rem 1.5rem' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#eff6ff', padding: '3px 10px', borderRadius: '4px', marginBottom: '0.4rem', border: '1px solid #bfdbfe' }}>
            <Users size={14} style={{ color: '#1d4ed8' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Academic Cadre Administration
            </span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
            Faculty & Teaching Staff Management
          </h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.88rem' }}>
            Add and edit faculty profile cards, adjust official faculty statistics numbers, and manage the designation cadre distribution table.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <a
            href="/staff"
            target="_blank"
            rel="noopener noreferrer"
            className="cms-btn cms-btn-outline-dark"
            title="Preview live faculty page"
          >
            <ExternalLink size={14} />
            <span>View Live Staff Page</span>
          </a>
          {activeTab === 'faculty' && (
            <button
              type="button"
              onClick={openNewFacultyModal}
              className="cms-btn cms-btn-primary"
              style={{ backgroundColor: '#0b1b3d' }}
            >
              <Plus size={16} />
              <span>Add Faculty Member</span>
            </button>
          )}
          {activeTab === 'cadre' && (
            <button
              type="button"
              onClick={openNewCadreModal}
              className="cms-btn cms-btn-primary"
              style={{ backgroundColor: '#0b1b3d' }}
            >
              <Plus size={16} />
              <span>Add Designation</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Feature Tabs */}
      <div style={{ display: 'flex', gap: '6px', borderBottom: '2px solid #e2e8f0', marginBottom: '1.5rem' }}>
        <button
          type="button"
          onClick={() => setActiveTab('faculty')}
          style={{
            padding: '9px 18px',
            fontSize: '0.88rem',
            fontWeight: 600,
            border: 'none',
            borderBottom: activeTab === 'faculty' ? '3px solid #c5973b' : '3px solid transparent',
            background: activeTab === 'faculty' ? '#ffffff' : 'transparent',
            color: activeTab === 'faculty' ? '#0b1b3d' : '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderRadius: '4px 4px 0 0',
            transition: 'all 150ms ease'
          }}
        >
          <Award size={15} />
          <span>Faculty Roster Cards ({leadership.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('metrics')}
          style={{
            padding: '9px 18px',
            fontSize: '0.88rem',
            fontWeight: 600,
            border: 'none',
            borderBottom: activeTab === 'metrics' ? '3px solid #c5973b' : '3px solid transparent',
            background: activeTab === 'metrics' ? '#ffffff' : 'transparent',
            color: activeTab === 'metrics' ? '#0b1b3d' : '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderRadius: '4px 4px 0 0',
            transition: 'all 150ms ease'
          }}
        >
          <BarChart3 size={15} />
          <span>Key Statistics Numbers (3 Metrics)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cadre')}
          style={{
            padding: '9px 18px',
            fontSize: '0.88rem',
            fontWeight: 600,
            border: 'none',
            borderBottom: activeTab === 'cadre' ? '3px solid #c5973b' : '3px solid transparent',
            background: activeTab === 'cadre' ? '#ffffff' : 'transparent',
            color: activeTab === 'cadre' ? '#0b1b3d' : '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderRadius: '4px 4px 0 0',
            transition: 'all 150ms ease'
          }}
        >
          <Layers size={15} />
          <span>Designations & Cadre Distribution ({cadreBreakdown.length})</span>
        </button>
      </div>

      {/* =================================================================== */}
      {/* TAB 1: FACULTY ROSTER CARDS */}
      {/* =================================================================== */}
      {activeTab === 'faculty' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              These cards render on the website in the prominent <strong>Pedagogical Leadership & Faculty</strong> grid.
            </span>
            <button
              type="button"
              onClick={openNewFacultyModal}
              className="cms-btn cms-btn-outline-dark"
              style={{ fontSize: '0.82rem', padding: '5px 12px' }}
            >
              <Plus size={14} />
              <span>Add Faculty Card</span>
            </button>
          </div>

          {leadership.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
              <Users size={32} style={{ color: '#94a3b8', margin: '0 auto 0.75rem' }} />
              <h4 style={{ margin: '0 0 0.25rem 0', color: '#0f172a' }}>No faculty cards in roster</h4>
              <p style={{ margin: '0 0 1rem 0', color: '#64748b', fontSize: '0.85rem' }}>Click the button below to add your first faculty leadership card.</p>
              <button
                type="button"
                onClick={openNewFacultyModal}
                className="cms-btn cms-btn-primary"
              >
                <Plus size={15} />
                <span>Add Faculty Card</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {leadership.map((member, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '1.25rem',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative'
                  }}
                >
                  <div>
                    {/* Top Tag & Actions */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: '#991b1b',
                        backgroundColor: '#fef2f2',
                        padding: '3px 8px',
                        borderRadius: '3px',
                        border: '1px solid #fecaca'
                      }}>
                        {member.role || 'Faculty'}
                      </span>

                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          type="button"
                          onClick={() => openEditFacultyModal(member, idx)}
                          style={{ background: 'none', border: 'none', padding: '4px', color: '#2563eb', cursor: 'pointer' }}
                          title="Edit faculty member"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteFaculty(idx)}
                          style={{ background: 'none', border: 'none', padding: '4px', color: '#dc2626', cursor: 'pointer' }}
                          title="Remove faculty member"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Member Name */}
                    <h3 style={{ margin: '0 0 0.35rem 0', fontSize: '1.15rem', color: '#0b1b3d', fontWeight: 700 }}>
                      {member.name || 'Untitled Member'}
                    </h3>

                    {/* Qualifications */}
                    <p style={{ margin: '0 0 0.4rem 0', fontSize: '0.84rem', color: '#475569' }}>
                      <strong style={{ color: '#0f172a' }}>Qualifications:</strong> {member.qualifications || '—'}
                    </p>

                    {/* Experience */}
                    <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '0.75rem', fontWeight: 500 }}>
                      {member.experience || '—'}
                    </div>

                    {/* Excerpt */}
                    {member.messageExcerpt && (
                      <blockquote style={{
                        margin: '0.5rem 0 0 0',
                        padding: '0.5rem 0.75rem',
                        backgroundColor: '#f8fafc',
                        borderLeft: '3px solid #c5973b',
                        fontSize: '0.82rem',
                        fontStyle: 'italic',
                        color: '#334155',
                        lineHeight: 1.45,
                        borderRadius: '0 4px 4px 0'
                      }}>
                        {member.messageExcerpt}
                      </blockquote>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 2: KEY FACULTY METRICS (NUMBERS ONLY) */}
      {/* =================================================================== */}
      {activeTab === 'metrics' && (
        <div style={{ maxWidth: '640px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', color: '#0f172a', fontWeight: 700 }}>
              Adjust Key Faculty Statistics Numbers
            </h3>
            <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b' }}>
              As per CBSE mandate, the 3 parameters below remain fixed to match the school prospectus, while you can freely update the numbers/values.
            </p>
          </div>

          <form onSubmit={handleSaveMetrics} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Metric 1 */}
            <div className="cms-form-group">
              <label htmlFor="metric-total-staff" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Parameter: Total Teaching Faculty</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'normal' }}>Value / Headcount</span>
              </label>
              <input
                id="metric-total-staff"
                type="text"
                required
                value={metricsForm.totalTeachingStaff}
                onChange={(e) => setMetricsForm({ ...metricsForm, totalTeachingStaff: e.target.value })}
                placeholder="e.g. 42+ or 45"
                className="cms-input-field"
                style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0b1b3d' }}
              />
              <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>Displays in the first gold stat block on the staff page.</span>
            </div>

            {/* Metric 2 */}
            <div className="cms-form-group">
              <label htmlFor="metric-ratio" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Parameter: Teacher : Student Ratio</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'normal' }}>Ratio Value</span>
              </label>
              <input
                id="metric-ratio"
                type="text"
                required
                value={metricsForm.studentTeacherRatio}
                onChange={(e) => setMetricsForm({ ...metricsForm, studentTeacherRatio: e.target.value })}
                placeholder="e.g. 1.5 : 1 (Per Section) or 20 : 1"
                className="cms-input-field"
                style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0b1b3d' }}
              />
              <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>Compliant with CBSE Affiliation Bye-Laws Section 1:1.5 standard.</span>
            </div>

            {/* Metric 3 */}
            <div className="cms-form-group">
              <label htmlFor="metric-pg-qualified" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Parameter: Post-Graduate / B.Ed. Qualified</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'normal' }}>Percentage Value</span>
              </label>
              <input
                id="metric-pg-qualified"
                type="text"
                required
                value={metricsForm.teachersWithPostGraduation}
                onChange={(e) => setMetricsForm({ ...metricsForm, teachersWithPostGraduation: e.target.value })}
                placeholder="e.g. 88% or 92%"
                className="cms-input-field"
                style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0b1b3d' }}
              />
              <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>Displays in the third stat block on the staff page.</span>
            </div>

            <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                className="cms-btn cms-btn-primary"
                style={{ backgroundColor: '#0b1b3d', padding: '10px 20px' }}
              >
                <Check size={16} />
                <span>Save Statistics Numbers</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 3: CADRE BREAKDOWN TABLE */}
      {/* =================================================================== */}
      {activeTab === 'cadre' && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                Faculty Distribution Across Designations
              </h3>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Compliant with CBSE Staff Register format. You can add, edit, or remove tiles/rows anytime.
              </span>
            </div>
            <button
              type="button"
              onClick={openNewCadreModal}
              className="cms-btn cms-btn-outline-dark"
              style={{ fontSize: '0.8rem', padding: '5px 10px' }}
            >
              <Plus size={14} />
              <span>Add Designation Tile</span>
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9', color: '#475569', textTransform: 'uppercase', fontSize: '0.74rem', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '10px 14px', width: '60px' }}>S.No</th>
                  <th style={{ padding: '10px 14px', width: '32%' }}>Designation / Cadre</th>
                  <th style={{ padding: '10px 14px', width: '15%' }}>Sanctioned Count</th>
                  <th style={{ padding: '10px 14px' }}>Mandated Qualification Benchmark</th>
                  <th style={{ padding: '10px 14px', width: '140px' }}>Service Cadre Status</th>
                  <th style={{ padding: '10px 14px', width: '90px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cadreBreakdown.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                      No cadre designations recorded yet. Click "Add Designation Tile" above.
                    </td>
                  </tr>
                ) : (
                  cadreBreakdown.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0b1b3d' }}>
                        {String(idx + 1).padStart(2, '0')}
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>
                        {row.category}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          display: 'inline-block',
                          backgroundColor: '#f1f5f9',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontWeight: 700,
                          color: '#0b1b3d',
                          fontSize: '0.84rem'
                        }}>
                          {row.count || '—'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#475569', fontSize: '0.84rem' }}>
                        {row.qualificationRequirement || '—'}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          display: 'inline-block',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: '#ecfdf5',
                          color: '#065f46',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          border: '1px solid #a7f3d0'
                        }}>
                          {row.status || 'Regular Appointed'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => openEditCadreModal(row, idx)}
                            style={{ background: 'none', border: 'none', padding: '4px', color: '#2563eb', cursor: 'pointer' }}
                            title="Edit designation row"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCadre(idx)}
                            style={{ background: 'none', border: 'none', padding: '4px', color: '#dc2626', cursor: 'pointer' }}
                            title="Delete designation row"
                          >
                            <Trash2 size={15} />
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
      )}

      {/* =================================================================== */}
      {/* MODAL: ADD / EDIT FACULTY MEMBER */}
      {/* =================================================================== */}
      {isFacultyModalOpen && (
        <div className="cms-modal-backdrop" onClick={() => setIsFacultyModalOpen(false)}>
          <div className="cms-form-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="cms-modal-header">
              <div className="cms-modal-title-group">
                <Users size={18} style={{ color: '#c5973b' }} />
                <h3>{editingFacultyIndex !== null ? 'Edit Faculty Card' : 'Add New Faculty Member'}</h3>
              </div>
              <button
                type="button"
                className="cms-close-icon-btn"
                onClick={() => setIsFacultyModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFacultySubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
              <div className="cms-modal-body" style={{ overflowY: 'auto', flex: 1, minHeight: 0, gap: '1.2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="cms-form-group">
                    <label htmlFor="fac-role">Designation / Role *</label>
                    <input
                      id="fac-role"
                      type="text"
                      required
                      value={facultyForm.role}
                      onChange={(e) => setFacultyForm({ ...facultyForm, role: e.target.value })}
                      placeholder="e.g. Principal, PGT Chemistry & Senior Coordinator"
                      className="cms-input-field"
                    />
                  </div>

                  <div className="cms-form-group">
                    <label htmlFor="fac-name">Full Name with Honorific *</label>
                    <input
                      id="fac-name"
                      type="text"
                      required
                      value={facultyForm.name}
                      onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })}
                      placeholder="e.g. Dr. Rajesh Sharma"
                      className="cms-input-field"
                    />
                  </div>
                </div>

                <div className="cms-form-group">
                  <label htmlFor="fac-qual">Educational Qualifications *</label>
                  <input
                    id="fac-qual"
                    type="text"
                    required
                    value={facultyForm.qualifications}
                    onChange={(e) => setFacultyForm({ ...facultyForm, qualifications: e.target.value })}
                    placeholder="e.g. M.Sc. (Chemistry), M.Ed., Ph.D."
                    className="cms-input-field"
                  />
                </div>

                <div className="cms-form-group">
                  <label htmlFor="fac-exp">Teaching Experience</label>
                  <input
                    id="fac-exp"
                    type="text"
                    value={facultyForm.experience}
                    onChange={(e) => setFacultyForm({ ...facultyForm, experience: e.target.value })}
                    placeholder="e.g. 15+ Years in CBSE Senior Secondary Pedagogy"
                    className="cms-input-field"
                  />
                </div>

                <div className="cms-form-group">
                  <label htmlFor="fac-message">Pedagogical Philosophy / Quote (Optional)</label>
                  <textarea
                    id="fac-message"
                    rows={3}
                    value={facultyForm.messageExcerpt}
                    onChange={(e) => setFacultyForm({ ...facultyForm, messageExcerpt: e.target.value })}
                    placeholder="Brief educational thought or excerpt to display inside quotation block..."
                    className="cms-input-field"
                  />
                </div>

                {/* Optional Photo Attachment */}
                <div className="cms-form-group">
                  <label>Faculty Portrait Photo (Optional)</label>
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
                    style={{ cursor: 'pointer' }}
                  >
                    {isUploadingPhoto ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Loader2 size={18} className="cms-spinner" />
                        <span>Uploading portrait...</span>
                      </div>
                    ) : (
                      <>
                        <ImageIcon size={20} className="cms-dropzone-icon" />
                        <div>
                          <strong>{facultyForm.photo ? 'Change Faculty Photograph' : 'Click to Upload Faculty Photograph'}</strong>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Supports PNG, JPG, WebP</p>
                        </div>
                      </>
                    )}
                  </div>

                  {facultyForm.photo && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px', fontSize: '0.84rem', marginTop: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img src={facultyForm.photo} alt="Preview" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                        <span style={{ color: '#166534', fontWeight: 600 }}>Portrait Attached</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFacultyForm({ ...facultyForm, photo: '' })}
                        style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="cms-modal-footer">
                <button
                  type="button"
                  className="cms-btn cms-btn-outline-dark"
                  onClick={() => setIsFacultyModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingPhoto}
                  className="cms-btn cms-btn-primary"
                  style={{ backgroundColor: '#0b1b3d' }}
                >
                  <Check size={16} />
                  <span>{editingFacultyIndex !== null ? 'Save Changes' : 'Add to Roster'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: ADD / EDIT CADRE DESIGNATION */}
      {/* =================================================================== */}
      {isCadreModalOpen && (
        <div className="cms-modal-backdrop" onClick={() => setIsCadreModalOpen(false)}>
          <div className="cms-form-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="cms-modal-header">
              <div className="cms-modal-title-group">
                <Layers size={18} style={{ color: '#c5973b' }} />
                <h3>{editingCadreIndex !== null ? 'Edit Designation Tile' : 'Add Cadre Designation'}</h3>
              </div>
              <button
                type="button"
                className="cms-close-icon-btn"
                onClick={() => setIsCadreModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCadreSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
              <div className="cms-modal-body" style={{ overflowY: 'auto', flex: 1, minHeight: 0, gap: '1.2rem' }}>
                <div className="cms-form-group">
                  <label htmlFor="cadre-name">Designation / Cadre Title *</label>
                  <input
                    id="cadre-name"
                    type="text"
                    required
                    value={cadreForm.category}
                    onChange={(e) => setCadreForm({ ...cadreForm, category: e.target.value })}
                    placeholder="e.g. Post Graduate Teachers (PGT), Special Educator, Librarian"
                    className="cms-input-field"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="cms-form-group">
                    <label htmlFor="cadre-count">Appointed Count *</label>
                    <input
                      id="cadre-count"
                      type="text"
                      required
                      value={cadreForm.count}
                      onChange={(e) => setCadreForm({ ...cadreForm, count: e.target.value })}
                      placeholder="e.g. 01 or 12 or [— to be added]"
                      className="cms-input-field"
                    />
                  </div>

                  <div className="cms-form-group">
                    <label htmlFor="cadre-status">Service Cadre Status</label>
                    <input
                      id="cadre-status"
                      type="text"
                      value={cadreForm.status}
                      onChange={(e) => setCadreForm({ ...cadreForm, status: e.target.value })}
                      placeholder="e.g. Regular Appointed"
                      className="cms-input-field"
                    />
                  </div>
                </div>

                <div className="cms-form-group">
                  <label htmlFor="cadre-qual">Mandated Qualification Benchmark</label>
                  <input
                    id="cadre-qual"
                    type="text"
                    value={cadreForm.qualificationRequirement}
                    onChange={(e) => setCadreForm({ ...cadreForm, qualificationRequirement: e.target.value })}
                    placeholder="e.g. M.Sc. / M.Com / M.A., B.Ed. / RCI Registered"
                    className="cms-input-field"
                  />
                </div>
              </div>

              <div className="cms-modal-footer">
                <button
                  type="button"
                  className="cms-btn cms-btn-outline-dark"
                  onClick={() => setIsCadreModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cms-btn cms-btn-primary"
                  style={{ backgroundColor: '#0b1b3d' }}
                >
                  <Check size={16} />
                  <span>{editingCadreIndex !== null ? 'Save Changes' : 'Add Designation Tile'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
