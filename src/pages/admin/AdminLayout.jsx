import React, { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useCMS } from '../../context/CMSContext';
import CrestLogo from '../../components/CrestLogo';
import AdminNoticeManager from './AdminNoticeManager';
import AdminGalleryManager from './AdminGalleryManager';
import AdminPagesManager from './AdminPagesManager';
import AdminCloudGuide from './AdminCloudGuide';

// Live site page components for in-context mirror rendering
import HomePage from '../HomePage';
import AboutPage from '../AboutPage';
import AcademicsPage from '../AcademicsPage';
import StaffPage from '../StaffPage';
import InfrastructurePage from '../InfrastructurePage';
import CbseDisclosurePage from '../CbseDisclosurePage';
import ContactPage from '../ContactPage';
import Footer from '../../components/Footer';

import { 
  FileEdit, Bell, Image as ImageIcon, Code2, LogOut, 
  ExternalLink, Eye, Edit3, RotateCcw, Save, CheckCircle2,
  Menu, X, Loader2, Layers, KeyRound, Lock, ShieldCheck, EyeOff, AlertCircle
} from 'lucide-react';
import '../../styles/admin.css';

export default function AdminLayout() {
  const { 
    isAdmin, currentUser, isEditing, setIsEditing, isDirty, 
    publishAll, revertChanges, logout, lockAdmin, changePin, toast, isPublishing, isCloudConnected 
  } = useCMS();
  const navigate = useNavigate();

  // Change PIN modal state
  const [isChangePinModalOpen, setIsChangePinModalOpen] = useState(false);
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [pinModalError, setPinModalError] = useState('');
  const [pinModalLoading, setPinModalLoading] = useState(false);

  // Active section in admin sidebar: 'content' | 'notices' | 'gallery' | 'guide'
  const [activeSection, setActiveSection] = useState('content');

  // Active page when viewing Site Content live mirror
  const [activeMirrorPage, setActiveMirrorPage] = useState('home');

  // Mobile sidebar drawer state
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If not logged in, redirect to login page
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const mirrorPages = [
    { id: 'home', label: 'Home Page' },
    { id: 'about', label: 'About MTA' },
    { id: 'academics', label: 'Academics & Streams' },
    { id: 'infrastructure', label: 'Campus Infrastructure' },
    { id: 'staff', label: 'Faculty & Staff' },
    { id: 'cbse', label: 'CBSE Appendix-IX' },
    { id: 'contact', label: 'Contact & Location' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const handleOpenChangePinModal = () => {
    setCurrentPinInput('');
    setNewPinInput('');
    setConfirmPinInput('');
    setPinModalError('');
    setShowCurrentPin(false);
    setShowNewPin(false);
    setIsChangePinModalOpen(true);
    setMobileSidebarOpen(false);
  };

  const handleChangePinSubmit = async (e) => {
    e.preventDefault();
    setPinModalError('');

    if (!currentPinInput.trim()) {
      setPinModalError('Please enter your current security PIN.');
      return;
    }
    if (newPinInput.trim().length < 4) {
      setPinModalError('New PIN must be at least 4 characters or digits.');
      return;
    }
    if (newPinInput.trim() !== confirmPinInput.trim()) {
      setPinModalError('New PIN and Confirm PIN do not match.');
      return;
    }

    setPinModalLoading(true);
    try {
      await changePin(currentPinInput.trim(), newPinInput.trim());
      setIsChangePinModalOpen(false);
    } catch (err) {
      setPinModalError(err.message || 'Failed to update PIN. Please verify your current PIN.');
    } finally {
      setPinModalLoading(false);
    }
  };

  const handleNavSelect = (section) => {
    setActiveSection(section);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="cms-admin-root">
      {/* 1. Global Admin Topbar (Responsive for Mobile & Desktop) */}
      <header className="cms-admin-topbar">
        {/* Left: Hamburger + Brand + Mode Switch */}
        <div className="cms-topbar-left">
          {/* Mobile Drawer Hamburger Button */}
          <button
            type="button"
            className="cms-mobile-menu-btn"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            aria-label="Toggle admin navigation menu"
          >
            {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="cms-brand-group">
            <CrestLogo size={30} animated={false} variant="brass" />
            <span className="cms-brand-title">
              <span className="cms-brand-full">Mother Teresa Academy</span>
              <span className="cms-brand-short">MTA</span>
            </span>
            <span className="cms-brand-badge">CMS</span>
          </div>

          {/* Mode Switch (Live Edit vs Visitor Preview) */}
          {activeSection === 'content' && (
            <div className="cms-mode-switch-group">
              <button
                type="button"
                className={`cms-mode-btn ${isEditing ? 'active' : ''}`}
                onClick={() => setIsEditing(true)}
                title="Enable hover pencil badges and click-to-edit inline text fields"
              >
                <Edit3 size={13} />
                <span className="cms-mode-label">Edit</span>
              </button>
              <button
                type="button"
                className={`cms-mode-btn ${!isEditing ? 'active' : ''}`}
                onClick={() => setIsEditing(false)}
                title="Preview the exact site layout without edit affordances"
              >
                <Eye size={13} />
                <span className="cms-mode-label">Preview</span>
              </button>
            </div>
          )}
        </div>

        {/* Right: Status, Publish Actions & User Profile */}
        <div className="cms-topbar-right">
          {/* Dirty Status Pill */}
          <div className={`cms-status-pill ${isDirty ? 'dirty' : 'clean'}`} title={isDirty ? 'Unsaved draft edits' : 'All changes saved'}>
            {isDirty ? (
              <>
                <span className="cms-dirty-dot" />
                <span className="cms-status-text">Drafts pending</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={13} />
                <span className="cms-status-text">Published</span>
              </>
            )}
          </div>

          {/* Discard Drafts Button */}
          {isDirty && (
            <button
              type="button"
              onClick={revertChanges}
              className="cms-btn cms-btn-outline cms-btn-compact"
              title="Revert draft changes back to last published version"
            >
              <RotateCcw size={13} />
              <span className="cms-btn-label">Discard</span>
            </button>
          )}

          {/* Publish Changes Button */}
          <button
            type="button"
            onClick={publishAll}
            disabled={isPublishing}
            className="cms-btn cms-btn-primary cms-btn-compact"
            title="Save and publish all modifications to Firebase live site"
          >
            {isPublishing ? (
              <>
                <Loader2 size={14} className="cms-spinner" />
                <span className="cms-btn-label">Publishing...</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span className="cms-btn-label">Publish</span>
              </>
            )}
          </button>

          {/* Public Site Link */}
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="cms-btn cms-btn-outline cms-btn-compact"
            title="Open live public school website in new tab"
          >
            <ExternalLink size={13} />
            <span className="cms-btn-label">Live Site</span>
          </Link>

          {/* Change Security PIN Button */}
          <button
            type="button"
            onClick={handleOpenChangePinModal}
            className="cms-btn cms-btn-outline cms-btn-compact"
            title="Change Admin Security PIN"
          >
            <KeyRound size={13} />
            <span className="cms-btn-label">Change PIN</span>
          </button>

          {/* Lock Admin Panel */}
          <div className="cms-user-module">
            <button
              type="button"
              onClick={handleLogout}
              className="cms-logout-btn"
              title="Lock Admin Panel (Security PIN required to re-enter)"
              aria-label="Lock Admin Panel"
            >
              <Lock size={13} />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, marginLeft: '4px' }} className="cms-btn-label">
                Lock
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Admin Body: Left Sidebar (with Mobile Slide-Out Drawer) + Main Workspace */}
      <div className="cms-admin-body">
        {/* Mobile Backdrop Overlay */}
        {mobileSidebarOpen && (
          <div
            className="cms-sidebar-backdrop"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Left Sidebar */}
        <aside className={`cms-admin-sidebar ${mobileSidebarOpen ? 'is-mobile-open' : ''}`}>
          {/* Mobile Drawer Header with Close Button */}
          <div className="cms-sidebar-mobile-header">
            <div className="cms-brand-group">
              <CrestLogo size={26} animated={false} variant="brass" />
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>Admin Menu</span>
            </div>
            <button
              type="button"
              className="cms-close-icon-btn"
              onClick={() => setMobileSidebarOpen(false)}
              aria-label="Close navigation drawer"
            >
              <X size={18} />
            </button>
          </div>

          <div className="cms-sidebar-nav">
            <span className="cms-sidebar-heading">Content Management</span>

            <button
              type="button"
              className={`cms-nav-item ${activeSection === 'content' ? 'active' : ''}`}
              onClick={() => handleNavSelect('content')}
            >
              <FileEdit size={16} />
              <span>Live Site Mirror</span>
            </button>

            <button
              type="button"
              className={`cms-nav-item ${activeSection === 'notices' ? 'active' : ''}`}
              onClick={() => handleNavSelect('notices')}
            >
              <Bell size={16} />
              <span>Notice Board</span>
            </button>

            <button
              type="button"
              className={`cms-nav-item ${activeSection === 'gallery' ? 'active' : ''}`}
              onClick={() => handleNavSelect('gallery')}
            >
              <ImageIcon size={16} />
              <span>Photo Gallery</span>
            </button>

            <button
              type="button"
              className={`cms-nav-item ${activeSection === 'pages' ? 'active' : ''}`}
              onClick={() => handleNavSelect('pages')}
            >
              <Layers size={16} />
              <span>Custom Pages</span>
            </button>

            <span className="cms-sidebar-heading" style={{ marginTop: '1.25rem' }}>Configuration</span>

            <button
              type="button"
              className={`cms-nav-item ${activeSection === 'guide' ? 'active' : ''}`}
              onClick={() => handleNavSelect('guide')}
            >
              <Code2 size={16} />
              <span>Cloud Handoff Guide</span>
            </button>

            <button
              type="button"
              className="cms-nav-item"
              onClick={handleOpenChangePinModal}
              title="Change Admin Security PIN"
            >
              <KeyRound size={16} />
              <span>Security PIN</span>
            </button>

            <button
              type="button"
              className="cms-nav-item"
              style={{ color: '#b91c1c' }}
              onClick={handleLogout}
              title="Lock Admin Panel immediately"
            >
              <Lock size={16} />
              <span>Lock Panel</span>
            </button>
          </div>

          {/* Sidebar Footer */}
          <div className="cms-sidebar-footer">
            <strong style={{ color: '#0f172a', display: 'block', marginBottom: '2px' }}>MTA CMS v1.0</strong>
            <span style={{ color: isCloudConnected ? '#15803d' : '#64748b' }}>
              {isCloudConnected ? '● Firebase Cloud Sync Active' : 'Connecting to Firebase...'}
            </span>
          </div>
        </aside>

        {/* Main Content Workspace */}
        <main className="cms-admin-workspace">
          {/* SECTION A: SITE CONTENT LIVE MIRROR */}
          {activeSection === 'content' && (
            <div className="cms-mirror-wrapper">
              {/* Secondary Sub-Bar: Page Selector Tabs */}
              <div className="cms-mirror-subbar">
                <div className="cms-page-selector-group">
                  <span className="cms-page-selector-label">Page:</span>
                  <div className="cms-page-tabs">
                    {mirrorPages.map((page) => (
                      <button
                        key={page.id}
                        type="button"
                        className={`cms-page-tab ${activeMirrorPage === page.id ? 'active' : ''}`}
                        onClick={() => setActiveMirrorPage(page.id)}
                      >
                        {page.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="cms-mirror-hint">
                  {isEditing ? (
                    <span style={{ color: '#2563eb', fontWeight: '600' }}>
                      ✎ Click any text or photo to edit in place
                    </span>
                  ) : (
                    <span>Viewing live preview mode</span>
                  )}
                </div>
              </div>

              {/* Render Selected Mirror Page WITH Full Site Context & Footer */}
              <div className="cms-mirror-page-container">
                <div className="cms-mirror-page-content">
                  {activeMirrorPage === 'home' && <HomePage />}
                  {activeMirrorPage === 'about' && <AboutPage />}
                  {activeMirrorPage === 'academics' && <AcademicsPage />}
                  {activeMirrorPage === 'infrastructure' && <InfrastructurePage />}
                  {activeMirrorPage === 'staff' && <StaffPage />}
                  {activeMirrorPage === 'cbse' && <CbseDisclosurePage />}
                  {activeMirrorPage === 'contact' && <ContactPage />}
                </div>

                {/* Proper Complete Website Footer across all mirror pages */}
                <Footer />
              </div>
            </div>
          )}

          {/* SECTION B: NOTICE BOARD MANAGEMENT */}
          {activeSection === 'notices' && <AdminNoticeManager />}

          {/* SECTION C: PHOTO GALLERY MANAGEMENT */}
          {activeSection === 'gallery' && <AdminGalleryManager />}

          {/* SECTION D: CUSTOM PAGES MANAGEMENT */}
          {activeSection === 'pages' && <AdminPagesManager />}

          {/* SECTION E: CLOUD HANDOFF GUIDE */}
          {activeSection === 'guide' && <AdminCloudGuide />}
        </main>
      </div>

      {/* 3. Change Security PIN Modal */}
      {isChangePinModalOpen && (
        <div className="cms-modal-backdrop" onClick={() => setIsChangePinModalOpen(false)}>
          <div className="cms-modal-card" style={{ maxWidth: '460px' }} onClick={(e) => e.stopPropagation()}>
            <div className="cms-modal-header">
              <div className="cms-modal-title-group">
                <KeyRound size={20} style={{ color: '#c5973b' }} />
                <h3>Change Security PIN</h3>
              </div>
              <button
                type="button"
                className="cms-close-icon-btn"
                onClick={() => setIsChangePinModalOpen(false)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleChangePinSubmit}>
              <div className="cms-modal-body" style={{ gap: '1rem' }}>
                <div style={{ padding: '10px 12px', backgroundColor: '#fdfbf7', border: '1px solid #f1e6d0', borderRadius: '6px', fontSize: '0.82rem', color: '#64748b', display: 'flex', gap: '8px' }}>
                  <ShieldCheck size={16} style={{ color: '#c5973b', flexShrink: 0, marginTop: '2px' }} />
                  <span>
                    The security PIN locks the administration dashboard. As per security protocol, no session is cached and this PIN is required on every reload.
                  </span>
                </div>

                {pinModalError && (
                  <div style={{ padding: '8px 12px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', color: '#991b1b', fontSize: '0.83rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={15} style={{ flexShrink: 0 }} />
                    <span>{pinModalError}</span>
                  </div>
                )}

                <div className="cms-form-group">
                  <label htmlFor="current-pin">Current Security PIN *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="current-pin"
                      type={showCurrentPin ? 'text' : 'password'}
                      required
                      value={currentPinInput}
                      onChange={(e) => setCurrentPinInput(e.target.value)}
                      placeholder="Enter current PIN"
                      className="cms-input-field"
                      style={{ paddingRight: '40px' }}
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPin(!showCurrentPin)}
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
                      aria-label={showCurrentPin ? 'Hide PIN' : 'Show PIN'}
                    >
                      {showCurrentPin ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="cms-form-group">
                  <label htmlFor="new-pin">New Security PIN (Min. 4 Characters / Digits) *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="new-pin"
                      type={showNewPin ? 'text' : 'password'}
                      required
                      value={newPinInput}
                      onChange={(e) => setNewPinInput(e.target.value)}
                      placeholder="Enter new PIN"
                      className="cms-input-field"
                      style={{ paddingRight: '40px' }}
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPin(!showNewPin)}
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
                      aria-label={showNewPin ? 'Hide PIN' : 'Show PIN'}
                    >
                      {showNewPin ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="cms-form-group">
                  <label htmlFor="confirm-pin">Confirm New Security PIN *</label>
                  <input
                    id="confirm-pin"
                    type={showNewPin ? 'text' : 'password'}
                    required
                    value={confirmPinInput}
                    onChange={(e) => setConfirmPinInput(e.target.value)}
                    placeholder="Re-enter new PIN to confirm"
                    className="cms-input-field"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="cms-modal-footer">
                <button
                  type="button"
                  onClick={() => setIsChangePinModalOpen(false)}
                  className="cms-btn cms-btn-outline-dark"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pinModalLoading}
                  className="cms-btn cms-btn-primary"
                >
                  {pinModalLoading ? (
                    <>
                      <Loader2 size={14} className="cms-spinner" />
                      <span>Updating PIN...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={14} />
                      <span>Update Security PIN</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Global Notification Toast */}
      {toast && (
        <div className="cms-toast-container">
          <div className={`cms-toast ${toast.type}`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
