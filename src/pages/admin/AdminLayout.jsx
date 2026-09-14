import React, { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useCMS } from '../../context/CMSContext';
import CrestLogo from '../../components/CrestLogo';
import AdminNoticeManager from './AdminNoticeManager';
import AdminGalleryManager from './AdminGalleryManager';
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
  ExternalLink, Check, Eye, Edit3, RotateCcw, Save, Shield, CheckCircle2,
  Menu, X, Loader2
} from 'lucide-react';
import '../../styles/admin.css';

export default function AdminLayout() {
  const { 
    isAdmin, currentUser, isEditing, setIsEditing, isDirty, 
    publishAll, revertChanges, logout, toast, isPublishing, isCloudConnected 
  } = useCMS();
  const navigate = useNavigate();

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

          {/* Staff Info & Logout */}
          <div className="cms-user-module">
            <span className="cms-user-name">
              {currentUser?.displayName || 'Admin'}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="cms-logout-btn"
              title="Log out of CMS"
              aria-label="Log out"
            >
              <LogOut size={14} />
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

            <span className="cms-sidebar-heading" style={{ marginTop: '1.25rem' }}>Configuration</span>

            <button
              type="button"
              className={`cms-nav-item ${activeSection === 'guide' ? 'active' : ''}`}
              onClick={() => handleNavSelect('guide')}
            >
              <Code2 size={16} />
              <span>Cloud Handoff Guide</span>
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

          {/* SECTION D: CLOUD HANDOFF GUIDE */}
          {activeSection === 'guide' && <AdminCloudGuide />}
        </main>
      </div>

      {/* 3. Global Notification Toast */}
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
