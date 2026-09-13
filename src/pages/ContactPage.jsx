import React from 'react';
import PageHeader from '../components/PageHeader';
import ContactSection from '../components/ContactSection';

export default function ContactPage() {
  return (
    <div className="subpage-view">
      <PageHeader
        title="Contact & Admissions Liaison"
        subtitle="Baraut campus coordinates, administrative office hours, contact helplines, and 2025–26 admission enquiry submission."
        breadcrumb="Contact & Location"
        badge="Administration Desk"
      />
      <ContactSection />
    </div>
  );
}
