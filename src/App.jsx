import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import ScrollProgressBar from './components/ScrollProgressBar';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import FloatingQuickActions from './components/FloatingQuickActions';
import { useGlobalScrollReveal } from './hooks/useGlobalScrollReveal';
import { CMSProvider } from './context/CMSContext';

// Specific Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import AcademicsPage from './pages/AcademicsPage';
import StaffPage from './pages/StaffPage';
import InfrastructurePage from './pages/InfrastructurePage';
import GalleryPage from './pages/GalleryPage';
import CbseDisclosurePage from './pages/CbseDisclosurePage';
import ContactPage from './pages/ContactPage';
import CustomPageView from './pages/CustomPageView';

// Admin CMS Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';

// Stylesheets
import './styles/variables.css';
import './styles/global.css';
import './styles/sections.css';
import './styles/cbse-disclosure.css';
import './styles/contact-footer.css';
import './styles/home.css';
import './styles/animations.css';
import './styles/admin.css';

import ContactNowModal from './components/ContactNowModal';

function AppContent() {
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Automatically reveals elements on scroll across all routes
  useGlobalScrollReveal();

  // Dedicated Admin Route View (No prospectus navigation or footers)
  if (isAdminRoute) {
    return (
      <div className="cms-app-wrapper">
        <ScrollToTop />
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminLayout />} />
          <Route path="/admin" element={<AdminLayout />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="school-prospectus-app">
      {/* Global Reading Progress Indicator */}
      <ScrollProgressBar />

      {/* Automatic Scroll Reset on Page Navigation */}
      <ScrollToTop />

      {/* Global Sidebar Navigation (Available on every page) */}
      <Navigation onOpenInquiry={() => setInquiryModalOpen(true)} />

      {/* Multi-Page Routes with Smooth Transition */}
      <main
        id="prospectus-main-content"
        key={location.pathname}
        className="page-transition-wrapper"
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage onOpenInquiry={() => setInquiryModalOpen(true)} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/academics" element={<AcademicsPage />} />
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/infrastructure" element={<InfrastructurePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/cbse-disclosure" element={<CbseDisclosurePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/pages/:slug" element={<CustomPageView />} />
          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Institutional Footer across all pages */}
      <Footer />

      {/* Right-Docked Floating Quick Action Pills (Fee, Location, Helpline) */}
      <FloatingQuickActions onOpenInquiry={() => setInquiryModalOpen(true)} />

      {/* Floating Back to Top Control */}
      <BackToTop />

      {/* Contact & Admissions Quick Modal with WhatsApp */}
      <ContactNowModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <CMSProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </CMSProvider>
  );
}
