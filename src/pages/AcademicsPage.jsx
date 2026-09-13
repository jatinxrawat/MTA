import React from 'react';
import PageHeader from '../components/PageHeader';
import AcademicsSection from '../components/AcademicsSection';

export default function AcademicsPage() {
  return (
    <div className="subpage-view">
      <PageHeader
        title="Academics & Board Results"
        subtitle="CBSE curriculum benchmarks, Senior Secondary stream offerings, and Three-Year Class X and XII Board performance ledgers."
        breadcrumb="Academics & Results"
        badge="Curricular Rigour"
      />
      <AcademicsSection />
    </div>
  );
}
