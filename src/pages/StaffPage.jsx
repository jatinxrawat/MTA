import React from 'react';
import PageHeader from '../components/PageHeader';
import StaffSection from '../components/StaffSection';
import SEO from '../components/SEO';

export default function StaffPage() {
  return (
    <div className="subpage-view">
      <SEO
        title="Faculty & Academic Leadership | Mother Teresa Academy, Baraut"
        description="Meet the distinguished faculty and leadership at Mother Teresa Academy, Baraut. Highly qualified PGT, TGT, and PRT educators committed to academic excellence and student mentorship."
        keywords="Teachers in Baraut, school faculty Baraut, PGT teachers Baghpat, principal Mother Teresa Academy, teaching staff Baraut school"
        canonical="/staff"
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Faculty & Staff', item: '/staff' },
        ]}
      />
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
