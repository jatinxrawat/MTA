import React from 'react';
import PageHeader from '../components/PageHeader';
import CbseDisclosureSection from '../components/CbseDisclosureSection';
import SEO from '../components/SEO';

export default function CbseDisclosurePage() {
  return (
    <div className="subpage-view">
      <SEO
        title="CBSE Mandatory Public Disclosure (Appendix-IX) | Mother Teresa Academy, Baraut"
        description="Official CBSE Mandatory Public Disclosure for Mother Teresa Academy, Baraut (Baghpat, UP). Statutory Appendix-IX information, affiliation credentials, safety certificates, and management registers."
        keywords="CBSE Mandatory Public Disclosure Baraut, Appendix-IX Mother Teresa Academy, CBSE affiliation Baghpat, school safety certificate Baraut"
        canonical="/cbse-disclosure"
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'CBSE Mandatory Disclosure', item: '/cbse-disclosure' },
        ]}
      />
      <PageHeader
        title="CBSE Mandatory Public Disclosure"
        subtitle="Mandated publication of Appendix-IX format information, self-attested certificates, academic documents, and infrastructure registers."
        breadcrumb="CBSE Disclosure"
        badge="Statutory Compliance"
      />
      <CbseDisclosureSection />
    </div>
  );
}
