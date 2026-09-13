import React from 'react';
import PageHeader from '../components/PageHeader';
import StaffSection from '../components/StaffSection';

export default function StaffPage() {
  return (
    <div className="subpage-view">
      <PageHeader
        title="Faculty & Academic Cadre"
        subtitle="Pedagogical administration, leadership profiles, sanctioned teaching headcount, and CBSE qualification requirements."
        breadcrumb="Faculty & Staff"
        badge="Academic Roster"
      />
      <StaffSection />
    </div>
  );
}
