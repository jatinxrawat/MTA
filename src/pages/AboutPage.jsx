import React from 'react';
import PageHeader from '../components/PageHeader';
import AboutSection from '../components/AboutSection';
import SEO from '../components/SEO';

export default function AboutPage() {
  return (
    <div className="subpage-view">
      <SEO
        title="About Mother Teresa Academy | Premier CBSE School Heritage & Vision, Baraut"
        description="Discover the legacy of Mother Teresa Academy in Baraut, Baghpat. Guided by Saint Mother Teresa's ideals, our mission combines rigorous academic scholarship, moral leadership, and four foundational pillars."
        keywords="About Mother Teresa Academy, Baraut school history, top school in Baraut Baghpat, CBSE schools Western UP, Saint Mother Teresa education"
        canonical="/about"
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'About Us', item: '/about' },
        ]}
      />
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
