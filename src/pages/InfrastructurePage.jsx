import React from 'react';
import PageHeader from '../components/PageHeader';
import InfrastructureSection from '../components/InfrastructureSection';
import SEO from '../components/SEO';

export default function InfrastructurePage() {
  return (
    <div className="subpage-view">
      <SEO
        title="Campus Infrastructure & Laboratories | Mother Teresa Academy, Baraut"
        description="Explore the state-of-the-art campus of Mother Teresa Academy, Baraut: Physics, Chemistry & Biology laboratories, dual Computer labs, sports complex, smart classrooms, and library."
        keywords="School infrastructure Baraut, science laboratories Baraut, computer lab school Baghpat, sports arena school Baraut, smart classes Baraut"
        canonical="/infrastructure"
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Campus Infrastructure', item: '/infrastructure' },
        ]}
      />
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
