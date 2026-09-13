import React from 'react';
import PageHeader from '../components/PageHeader';
import InfrastructureSection from '../components/InfrastructureSection';

export default function InfrastructurePage() {
  return (
    <div className="subpage-view">
      <PageHeader
        title="Campus Infrastructure & Facilities"
        subtitle="Physical estates, advanced composite laboratories, smart digital classrooms, sports grounds, and photographic gallery."
        breadcrumb="Infrastructure"
        badge="Estates & Facilities"
      />
      <InfrastructureSection />
    </div>
  );
}
