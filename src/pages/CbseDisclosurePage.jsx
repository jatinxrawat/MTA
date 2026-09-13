import React from 'react';
import PageHeader from '../components/PageHeader';
import CbseDisclosureSection from '../components/CbseDisclosureSection';

export default function CbseDisclosurePage() {
  return (
    <div className="subpage-view">
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
