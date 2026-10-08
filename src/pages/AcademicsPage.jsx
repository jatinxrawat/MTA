import React from 'react';
import PageHeader from '../components/PageHeader';
import AcademicsSection from '../components/AcademicsSection';
import SEO from '../components/SEO';

export default function AcademicsPage() {
  return (
    <div className="subpage-view">
      <SEO
        title="Academics & CBSE Board Results | Mother Teresa Academy, Baraut"
        description="Comprehensive CBSE curriculum details, Senior Secondary streams (Science PCM/PCB, Commerce, Humanities), and 3-Year Class X and XII Board results at Mother Teresa Academy, Baraut."
        keywords="CBSE academics Baraut, Class 10 and 12 results Baraut, Science stream school Baraut, Commerce coaching Baraut, Humanities CBSE, best school in Baraut for 11th and 12th"
        canonical="/academics"
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Academics & Results', item: '/academics' },
        ]}
      />
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
