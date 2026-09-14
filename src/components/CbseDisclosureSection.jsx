import React from 'react';
import { useCMS } from '../context/CMSContext';
import { schoolData } from '../data/schoolData';
import EditableText from './admin/EditableText';
import { FileText, Download, Printer, ShieldAlert, CheckCircle2 } from 'lucide-react';
import '../styles/cbse-disclosure.css';

export default function CbseDisclosureSection() {
  const { content } = useCMS();
  const cbseData = content.cbseDisclosure || schoolData.cbseDisclosure;
  const { annexure, title, instructions, sectionA, sectionB, sectionC, sectionD, sectionE } = cbseData;

  const handlePrint = () => {
    window.print();
  };

  return (
    <section
      id="cbse-disclosure"
      className="cbse-disclosure-section"
      aria-label="CBSE Mandatory Public Disclosure"
    >
      <div className="container">
        {/* Section Header */}
        <header className="editorial-section-header text-center">
          <span className="prospectus-subhead">Statutory Regulatory Compliance</span>
          <h2 className="prospectus-title">CBSE Mandatory Public Disclosure</h2>
          <div className="prospectus-rule centered">
            <span className="prospectus-rule-gem" />
          </div>
        </header>

        {/* CBSE Official Appendix-IX Seal Banner */}
        <div className="cbse-seal-banner">
          <div className="cbse-seal-left">
            <div>
              <span className="cbse-official-pill">{annexure} FORMAT</span>
              <h3 className="cbse-seal-title">{title}</h3>
              <p className="cbse-seal-notice">{instructions}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handlePrint}
            className="btn-academic btn-academic-outline"
            style={{ whiteSpace: 'nowrap', gap: '0.5rem' }}
            title="Print or export Mandatory Disclosure as PDF"
          >
            <Printer size={16} />
            Print / Save Appendix-IX
          </button>
        </div>

        {/* Section A: GENERAL INFORMATION */}
        <div className="disclosure-table-wrapper">
          <div className="disclosure-section-heading">
            <h3>{sectionA.sectionTitle}</h3>
            <span className="disclosure-norm-tag">CBSE Circular 03/2021 Norms</span>
          </div>
          <div className="academic-table-container" style={{ margin: 0, border: 'none' }}>
            <table className="academic-table" aria-label="CBSE Disclosure Section A General Information">
              <thead>
                <tr>
                  <th scope="col" style={{ width: '80px' }}>S.No.</th>
                  <th scope="col" style={{ width: '38%' }}>Information Parameter</th>
                  <th scope="col">Institutional Details</th>
                </tr>
              </thead>
              <tbody>
                {sectionA.fields.map((field, idx) => (
                  <tr key={field.sNo || idx}>
                    <td>0{field.sNo || idx + 1}</td>
                    <td><strong>{field.information}</strong></td>
                    <td>
                      <EditableText
                        path={`cbseDisclosure.sectionA.fields.${idx}.details`}
                        fallback={field.details}
                        as="span"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section B: DOCUMENTS AND INFORMATION */}
        <div className="disclosure-table-wrapper">
          <div className="disclosure-section-heading">
            <h3>{sectionB.sectionTitle}</h3>
            <span className="disclosure-norm-tag">Self-Attested Statutory Affidavits</span>
          </div>
          <div className="academic-table-container" style={{ margin: 0, border: 'none' }}>
            <table className="academic-table" aria-label="CBSE Disclosure Section B Documents and Information">
              <thead>
                <tr>
                  <th scope="col" style={{ width: '80px' }}>S.No.</th>
                  <th scope="col" style={{ width: '54%' }}>Documents / Prescribed Information</th>
                  <th scope="col">Document Verification & Upload Status</th>
                </tr>
              </thead>
              <tbody>
                {sectionB.documents.map((doc, idx) => (
                  <tr key={doc.sNo || idx}>
                    <td>0{doc.sNo || idx + 1}</td>
                    <td><strong>{doc.documentName}</strong></td>
                    <td>
                      <span className="table-badge-placeholder">
                        <EditableText
                          path={`cbseDisclosure.sectionB.documents.${idx}.status`}
                          fallback={doc.status}
                          as="span"
                        />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section C: RESULT AND ACADEMICS */}
        <div className="disclosure-table-wrapper">
          <div className="disclosure-section-heading">
            <h3>{sectionC.sectionTitle}</h3>
            <span className="disclosure-norm-tag">Academic Records & Governance</span>
          </div>
          <div className="academic-table-container" style={{ margin: 0, border: 'none' }}>
            <table className="academic-table" aria-label="CBSE Disclosure Section C Result and Academics">
              <thead>
                <tr>
                  <th scope="col" style={{ width: '80px' }}>S.No.</th>
                  <th scope="col" style={{ width: '54%' }}>Statutory Institutional Document</th>
                  <th scope="col">Publication Link / Verification Status</th>
                </tr>
              </thead>
              <tbody>
                {sectionC.documents.map((doc, idx) => (
                  <tr key={doc.sNo || idx}>
                    <td>0{doc.sNo || idx + 1}</td>
                    <td><strong>{doc.documentName}</strong></td>
                    <td>
                      <span className="table-badge-placeholder">
                        <EditableText
                          path={`cbseDisclosure.sectionC.documents.${idx}.status`}
                          fallback={doc.status}
                          as="span"
                        />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section D: STAFF (TEACHING) */}
        <div className="disclosure-table-wrapper">
          <div className="disclosure-section-heading">
            <h3>{sectionD.sectionTitle}</h3>
            <span className="disclosure-norm-tag">Affiliation Bye-Laws Staffing Ratio</span>
          </div>
          <div className="academic-table-container" style={{ margin: 0, border: 'none' }}>
            <table className="academic-table" aria-label="CBSE Disclosure Section D Staff">
              <thead>
                <tr>
                  <th scope="col" style={{ width: '80px' }}>S.No.</th>
                  <th scope="col" style={{ width: '45%' }}>Staff Head / Designation</th>
                  <th scope="col">Statutory Deployment Record</th>
                </tr>
              </thead>
              <tbody>
                {sectionD.fields.map((field, idx) => (
                  <tr key={idx}>
                    <td>{field.sNo ? `0${field.sNo}` : '—'}</td>
                    <td><strong>{field.parameter}</strong></td>
                    <td>
                      <EditableText
                        path={`cbseDisclosure.sectionD.fields.${idx}.details`}
                        fallback={field.details}
                        as="span"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section E: SCHOOL INFRASTRUCTURE */}
        <div className="disclosure-table-wrapper">
          <div className="disclosure-section-heading">
            <h3>{sectionE.sectionTitle}</h3>
            <span className="disclosure-norm-tag">Physical Estate Verification Norms</span>
          </div>
          <div className="academic-table-container" style={{ margin: 0, border: 'none' }}>
            <table className="academic-table" aria-label="CBSE Disclosure Section E Infrastructure">
              <thead>
                <tr>
                  <th scope="col" style={{ width: '80px' }}>S.No.</th>
                  <th scope="col" style={{ width: '48%' }}>Infrastructure Metric Head</th>
                  <th scope="col">Certified Measurement / Inspection Record</th>
                </tr>
              </thead>
              <tbody>
                {sectionE.fields.map((field, idx) => (
                  <tr key={field.sNo || idx}>
                    <td>0{field.sNo || idx + 1}</td>
                    <td><strong>{field.parameter}</strong></td>
                    <td>
                      <EditableText
                        path={`cbseDisclosure.sectionE.fields.${idx}.details`}
                        fallback={field.details}
                        as="span"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
