import React from 'react';
import PageHeader from '../components/PageHeader';
import AboutSection from '../components/AboutSection';

export default function AboutPage() {
  return (
    <div className="subpage-view">
      <PageHeader
        title="About the Academy"
        subtitle="Institutional heritage, Saint Teresa's enduring inspiration, sacred mission, and foundational core pillars."
        breadcrumb="About MTA"
        badge="Institutional Heritage"
      />
      <AboutSection />
    </div>
  );
}
