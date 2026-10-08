import React from 'react';
import PageHeader from '../components/PageHeader';
import ContactSection from '../components/ContactSection';
import SEO from '../components/SEO';

export default function ContactPage() {
  return (
    <div className="subpage-view">
      <SEO
        title="Contact Admissions & Campus Location | Mother Teresa Academy, Baraut"
        description="Get in touch with Mother Teresa Academy on Chhaprauli Road, Baraut, District Baghpat. Visiting hours, admissions inquiry helpdesk, phone numbers, and verified Google Maps route."
        keywords="Contact Mother Teresa Academy, school admission office Baraut, school address Baraut, Baraut CBSE school phone number, school location Baghpat"
        canonical="/contact"
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Contact & Admissions', item: '/contact' },
        ]}
      />
      <PageHeader
        title="Contact & Admissions Liaison"
        subtitle="Baraut campus coordinates, administrative office hours, contact helplines, and official admission enquiry submission."
        breadcrumb="Contact & Location"
        badge="Administration Desk"
      />
      <ContactSection />
    </div>
  );
}
