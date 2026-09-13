import React from 'react';
import { schoolData } from '../data/schoolData';
import { FileText, Download, Printer, ShieldAlert, CheckCircle2 } from 'lucide-react';
import '../styles/cbse-disclosure.css';

export default function CbseDisclosureSection() {
  const { annexure, title, instructions, sectionA, sectionB, sectionC, sectionD, sectionE } =
    schoolData.cbseDisclosure;

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
                {sectionA.fields.map((field) => (
                  <tr key={field.sNo}>
                    <td>0{field.sNo}</td>
                    <td><strong>{field.information}</strong></td>
                    <td>
                      {field.details.includes('[—') ? (
                        <span className="table-badge-placeholder">{field.details}</span>
                      ) : (
                        <strong>{field.details}</strong>
                      )}
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
                {sectionB.documents.map((doc) => (
                  <tr key={doc.sNo}>
                    <td>0{doc.sNo}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                        <FileText size={16} style={{ color: 'var(--color-navy)', flexShrink: 0, marginTop: '3px' }} />
                        <span>{doc.documentName}</span>
                      </div>
                    </td>
                    <td>
                      <span className="doc-link-placeholder">
                        <Download size={13} />
                        {doc.status}
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
            <span className="disclosure-norm-tag">Academic Schedules & Governance</span>
          </div>
          <div className="academic-table-container" style={{ margin: 0, border: 'none' }}>
            <table className="academic-table" aria-label="CBSE Disclosure Section C Result and Academics">
              <thead>
                <tr>
                  <th scope="col" style={{ width: '80px' }}>S.No.</th>
                  <th scope="col" style={{ width: '54%' }}>Academic & Governance Head</th>
                  <th scope="col">Upload Reference / Location</th>
                </tr>
              </thead>
              <tbody>
                {sectionC.documents.map((item) => (
                  <tr key={item.sNo}>
                    <td>0{item.sNo}</td>
                    <td>
                      <strong>{item.documentName}</strong>
                    </td>
                    <td>
                      {item.docRef.startsWith('#') ? (
                        <a href={item.docRef} className="doc-link-btn">
                          {item.status}
                        </a>
                      ) : (
                        <span className="doc-link-placeholder">
                          <FileText size={13} />
                          {item.status}
                        </span>
                      )}
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
            <span className="disclosure-norm-tag">Faculty Register Metrics</span>
          </div>
          <div className="academic-table-container" style={{ margin: 0, border: 'none' }}>
            <table className="academic-table" aria-label="CBSE Disclosure Section D Staff Teaching">
              <thead>
                <tr>
                  <th scope="col" style={{ width: '80px' }}>S.No.</th>
                  <th scope="col" style={{ width: '45%' }}>Staff Head / Classification</th>
                  <th scope="col">Mandated Details & Sanctioned Headcount</th>
                </tr>
              </thead>
              <tbody>
                {sectionD.fields.map((field, idx) => (
                  <tr key={idx}>
                    <td>{field.sNo ? `0${field.sNo}` : ''}</td>
                    <td><strong>{field.parameter}</strong></td>
                    <td>
                      {field.details.includes('[—') ? (
                        <span className="table-badge-placeholder">{field.details}</span>
                      ) : (
                        field.details
                      )}
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
            <span className="disclosure-norm-tag">Physical Plant & Safety Standards</span>
          </div>
          <div className="academic-table-container" style={{ margin: 0, border: 'none' }}>
            <table className="academic-table" aria-label="CBSE Disclosure Section E School Infrastructure">
              <thead>
                <tr>
                  <th scope="col" style={{ width: '80px' }}>S.No.</th>
                  <th scope="col" style={{ width: '45%' }}>Infrastructure Parameter</th>
                  <th scope="col">Provision Details & Dimensions</th>
                </tr>
              </thead>
              <tbody>
                {sectionE.fields.map((field) => (
                  <tr key={field.sNo}>
                    <td>0{field.sNo}</td>
                    <td><strong>{field.parameter}</strong></td>
                    <td>
                      {field.details.includes('[—') ? (
                        <span className="table-badge-placeholder">{field.details}</span>
                      ) : (
                        field.details
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="disclosure-print-bar">
            <span>
              * Official certification: All certificates maintained at the administrative office, Mother Teresa Academy, Baraut (UP).
            </span>
            <span style={{ fontWeight: '600', color: 'var(--color-maroon)' }}>
              Last Audited: Current Academic Year
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
