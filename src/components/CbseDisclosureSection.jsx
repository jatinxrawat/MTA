import React, { useState } from 'react';
import { useCMS } from '../context/CMSContext';
import { schoolData } from '../data/schoolData';
import EditableText from './admin/EditableText';
import { 
  FileText, Download, Printer, CheckCircle2, 
  ExternalLink, Eye, ShieldCheck, Building2, 
  GraduationCap, Award, X, Image as ImageIcon,
  FileCheck, Calendar, Users, IndianRupee, Layers,
  ZoomIn, ZoomOut, RotateCw, Maximize2
} from 'lucide-react';
import '../styles/cbse-disclosure.css';

export default function CbseDisclosureSection() {
  const { content } = useCMS();
  const cbseData = content.cbseDisclosure || schoolData.cbseDisclosure;
  const disclosureDocs = content.disclosureDocuments || schoolData.disclosureDocuments || [];
  const feeList = content.feeStructure || schoolData.feeStructure || [];

  const { annexure, title, instructions, sectionA, sectionB, sectionC, sectionD, sectionE } = cbseData;

  // Active category filter for certificate vault
  const [activeCategory, setActiveCategory] = useState('All');
  // Selected document for Lightbox / Modal Viewer
  const [selectedDoc, setSelectedDoc] = useState(null);
  // Zoom and rotation states for document inspector
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleOpenDoc = (doc) => {
    setZoomLevel(1);
    setRotation(0);
    setSelectedDoc(doc);
  };

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.3, 3));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.3, 0.7));
  const handleRotate = () => setRotation((r) => (r + 90) % 360);
  const handleResetView = () => {
    setZoomLevel(1);
    setRotation(0);
  };

  const getDocForViewing = (fileUrl, docName, category = 'Mandatory Public Disclosure') => {
    if (!fileUrl) return null;
    const found = disclosureDocs.find((d) => d.fileUrl === fileUrl);
    if (found) return found;
    return {
      id: `doc-ref-${Date.now()}`,
      title: docName || 'Statutory Compliance Document',
      fileUrl,
      fileType: fileUrl.toLowerCase().endsWith('.pdf') ? 'pdf' : 'photo',
      category,
      documentNumber: 'Appendix-IX Compliance',
      issuingAuthority: 'Mother Teresa Academy Compliance Desk',
      validUntil: 'Statutory Public Record',
    };
  };

  const categories = [
    'All',
    'Affiliation & Recognition',
    'Safety & Compliance',
    'Academics & Fees',
    'Society & Governance',
  ];

  const filteredDocs = disclosureDocs.filter((doc) => {
    if (doc.isPublished === false) return false;
    if (activeCategory === 'All') return true;
    return doc.category && doc.category.toLowerCase() === activeCategory.toLowerCase();
  });

  const isInvalid = (val) => {
    if (!val) return true;
    const str = String(val).trim().toLowerCase();
    return str === '' || str.includes('to be added') || str.includes('[—') || str.includes('[--');
  };

  // Section A fields sanitized
  const rawSectionA = (sectionA?.fields && sectionA.fields.length > 0) ? sectionA.fields : schoolData.cbseDisclosure.sectionA.fields;
  const sectionAFields = rawSectionA
    .map((f, i) => {
      const fallbackF = schoolData.cbseDisclosure.sectionA.fields[i] || {};
      const details = isInvalid(f.details) ? fallbackF.details : f.details;
      return { ...f, details };
    })
    .filter(f => !isInvalid(f.details));

  // Section B documents sanitized
  const rawSectionB = (sectionB?.documents && sectionB.documents.length > 0) ? sectionB.documents : schoolData.cbseDisclosure.sectionB.documents;
  const sectionBDocuments = rawSectionB
    .map((d, i) => {
      const fallbackD = schoolData.cbseDisclosure.sectionB.documents[i] || {};
      const fileUrl = isInvalid(d.fileUrl) ? fallbackD.fileUrl : d.fileUrl;
      const status = isInvalid(d.status) ? fallbackD.status : d.status;
      return { ...d, fileUrl, status };
    })
    .filter(d => !isInvalid(d.documentName));

  // Section C documents sanitized
  const rawSectionC = (sectionC?.documents && sectionC.documents.length > 0) ? sectionC.documents : schoolData.cbseDisclosure.sectionC.documents;
  const sectionCDocuments = rawSectionC
    .map((d, i) => {
      const fallbackD = schoolData.cbseDisclosure.sectionC.documents[i] || {};
      const fileUrl = isInvalid(d.fileUrl) ? fallbackD.fileUrl : d.fileUrl;
      const status = isInvalid(d.status) ? fallbackD.status : d.status;
      return { ...d, fileUrl, status };
    })
    .filter(d => !isInvalid(d.documentName));

  // Section D fields sanitized
  const rawSectionD = (sectionD?.fields && sectionD.fields.length > 0) ? sectionD.fields : schoolData.cbseDisclosure.sectionD.fields;
  const sectionDFields = rawSectionD
    .map((f, i) => {
      const fallbackF = schoolData.cbseDisclosure.sectionD.fields[i] || {};
      const details = isInvalid(f.details) ? fallbackF.details : f.details;
      return { ...f, details };
    })
    .filter(f => !isInvalid(f.details));

  // Section E fields sanitized
  const rawSectionE = (sectionE?.fields && sectionE.fields.length > 0) ? sectionE.fields : schoolData.cbseDisclosure.sectionE.fields;
  const sectionEFields = rawSectionE
    .map((f, i) => {
      const fallbackF = schoolData.cbseDisclosure.sectionE.fields[i] || {};
      const details = isInvalid(f.details) ? fallbackF.details : f.details;
      return { ...f, details };
    })
    .filter(f => !isInvalid(f.details));

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
          <p className="prospectus-lead text-center" style={{ maxWidth: '780px', margin: '0.75rem auto 0' }}>
            Official publication of Central Board of Secondary Education (CBSE) Appendix-IX statutory data,
            self-attested regulatory certificates, institutional affiliations, and approved fee schedules.
          </p>
          <div className="prospectus-rule centered">
            <span className="prospectus-rule-gem" />
          </div>
        </header>

        {/* 1. Quick Glance Statutory Metric Cards */}
        <div className="statutory-highlights-grid">
          <div className="statutory-highlight-card">
            <div className="statutory-highlight-icon">
              <Award size={24} />
            </div>
            <div>
              <span className="statutory-highlight-label">CBSE Affiliation No.</span>
              <div className="statutory-highlight-val">2134272</div>
              <span className="statutory-highlight-sub">● Senior Secondary (Fresh)</span>
            </div>
          </div>

          <div className="statutory-highlight-card highlight-accent">
            <div className="statutory-highlight-icon">
              <ShieldCheck size={24} />
            </div>
            <div>
              <span className="statutory-highlight-label">School Code (OASIS)</span>
              <div className="statutory-highlight-val">61658</div>
              <span className="statutory-highlight-sub">● CBSE Examination Center</span>
            </div>
          </div>

          <div className="statutory-highlight-card highlight-brass">
            <div className="statutory-highlight-icon">
              <GraduationCap size={24} />
            </div>
            <div>
              <span className="statutory-highlight-label">Status & Range</span>
              <div className="statutory-highlight-val">Class I to XII</div>
              <span className="statutory-highlight-sub">● Science, Commerce, Arts</span>
            </div>
          </div>

          <div className="statutory-highlight-card">
            <div className="statutory-highlight-icon">
              <Building2 size={24} />
            </div>
            <div>
              <span className="statutory-highlight-label">Campus Land Area</span>
              <div className="statutory-highlight-val">6,275 Sq. M.</div>
              <span className="statutory-highlight-sub">● 1.55 Acres Enclosure</span>
            </div>
          </div>
        </div>

        {/* 2. CBSE Official Appendix-IX Seal Banner */}
        <div className="cbse-seal-banner">
          <div className="cbse-seal-left">
            <div>
              <span className="cbse-official-pill">{annexure || 'APPENDIX - IX'} FORMAT</span>
              <h3 className="cbse-seal-title">{title || 'MANDATORY PUBLIC DISCLOSURE'}</h3>
              <p className="cbse-seal-notice">
                {instructions || 'In compliance with CBSE Affiliation Bye-Laws (Rule 14.10) and Circular No. 03/2021, the following statutory information and self-attested documents are published for public inspection.'}
              </p>
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

        {/* 3. CERTIFICATE & DOCUMENT VAULT (PDFs & Photos) */}
        <div className="disclosure-vault-wrapper">
          <div className="disclosure-vault-header">
            <div className="vault-heading-group">
              <h3>Statutory Certificates & Document Archive</h3>
              <p>Self-attested official copies of affiliation letters, safety certificates, recognition orders, and registrations.</p>
            </div>

            {/* Category Filter Pills */}
            <div className="vault-category-filter">
              {categories.map((cat) => {
                const count = cat === 'All' 
                  ? disclosureDocs.filter((d) => d.isPublished !== false).length 
                  : disclosureDocs.filter((d) => d.isPublished !== false && d.category?.toLowerCase() === cat.toLowerCase()).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    className={`vault-cat-btn ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    <span>{cat}</span>
                    <span className="vault-cat-badge">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="disclosure-cards-grid">
            {filteredDocs.map((doc) => {
              const isPdf = doc.fileType === 'pdf' || doc.fileUrl?.toLowerCase().endsWith('.pdf');
              return (
                <div key={doc.id} className="disclosure-doc-card">
                  {/* Preview Area */}
                  <div 
                    className="disclosure-card-preview"
                    onClick={() => handleOpenDoc(doc)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Inspect ${doc.title}`}
                  >
                    <span className={`disclosure-card-tag ${isPdf ? 'tag-pdf' : 'tag-photo'}`}>
                      {isPdf ? 'PDF Document' : 'Official Certificate'}
                    </span>

                    {isPdf ? (
                      <div className="disclosure-pdf-art">
                        <div className="disclosure-pdf-icon-ring">
                          <FileText size={26} />
                        </div>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc' }}>
                          Official CBSE PDF Document
                        </span>
                      </div>
                    ) : (
                      <img
                        src={doc.fileUrl}
                        alt={doc.title}
                        className="disclosure-card-img"
                        loading="lazy"
                      />
                    )}

                    <div className="disclosure-card-hover-overlay">
                      <Eye size={22} />
                      <span>Click to Inspect / View Document</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="disclosure-card-body">
                    <span className="disclosure-card-cat">{doc.category || 'Statutory Compliance'}</span>
                    <h4 className="disclosure-card-title">{doc.title}</h4>
                    
                    <div className="disclosure-card-meta">
                      {doc.documentNumber && (
                        <div><strong>Doc No:</strong> {doc.documentNumber}</div>
                      )}
                      {doc.issuingAuthority && (
                        <div><strong>Authority:</strong> {doc.issuingAuthority}</div>
                      )}
                      {doc.validUntil && (
                        <div><strong>Validity:</strong> {doc.validUntil}</div>
                      )}
                    </div>

                    <div className="disclosure-card-actions">
                      <button
                        type="button"
                        className="disclosure-action-btn btn-primary"
                        onClick={() => handleOpenDoc(doc)}
                        title="Inspect full document in popup reader"
                      >
                        <Eye size={14} />
                        <span>Inspect</span>
                      </button>

                      <a
                        href={doc.fileUrl}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="disclosure-action-btn"
                        title="Download Certificate File"
                      >
                        <Download size={14} />
                        <span>Download</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. OFFICIAL APPROVED FEE SCHEDULE SECTION (Session 2025–26) */}
        {feeList.length > 0 && (
          <div className="fee-table-section">
            <div className="fee-table-header">
              <div>
                <h3>Official Approved Annual & Monthly Fee Schedule (Session 2025–2026)</h3>
                <span>Approved by School Management Committee & Affiliation Compliance Desk</span>
              </div>
              <button
                type="button"
                onClick={() => handleOpenDoc(getDocForViewing('/disclosure/fee-structure-official.jpg', 'Official Approved Fee Schedule (NUR to XII)', 'Academics & Fees'))}
                className="doc-link-btn"
                style={{ background: '#ffffff', color: '#0b1b3d', border: '1px solid #d0d7e6', cursor: 'pointer' }}
              >
                <Eye size={15} />
                <span>Inspect Signed Document</span>
              </button>
            </div>

            <div className="academic-table-container" style={{ margin: 0, border: 'none' }}>
              <table className="academic-table" aria-label="Official Approved Fee Schedule 2025-2026">
                <thead>
                  <tr>
                    <th scope="col">Class / Standard</th>
                    <th scope="col">Reg. Charges (₹)</th>
                    <th scope="col">Annual Charges (₹)</th>
                    <th scope="col">Monthly Tuition (₹)</th>
                    <th scope="col">Tuition (12 Mos) (₹)</th>
                    <th scope="col">Exam Charges (₹)</th>
                    <th scope="col" style={{ background: '#0b1b3d', color: '#f8fafc' }}>Total Annual Fee (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {feeList.map((item, idx) => (
                    <tr key={item.grade || idx}>
                      <td><strong>{item.grade}</strong></td>
                      <td>₹ {item.regFee?.toLocaleString('en-IN')}/-</td>
                      <td>₹ {item.annualCharges?.toLocaleString('en-IN')}/-</td>
                      <td>₹ {item.monthlyTuition?.toLocaleString('en-IN')}/- pm</td>
                      <td>₹ {item.totalTuition?.toLocaleString('en-IN')}/-</td>
                      <td>₹ {item.examFee?.toLocaleString('en-IN')}/-</td>
                      <td style={{ fontWeight: 700, color: 'var(--color-navy-deep)', background: '#f8fafc' }}>
                        ₹ {item.total?.toLocaleString('en-IN')}/-
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. Section A: GENERAL INFORMATION */}
        <div className="disclosure-table-wrapper">
          <div className="disclosure-section-heading">
            <h3>{sectionA?.sectionTitle || 'A : GENERAL INFORMATION'}</h3>
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
                {sectionAFields.map((field, idx) => (
                  <tr key={field.sNo || idx}>
                    <td>0{field.sNo || idx + 1}</td>
                    <td><strong>{field.information}</strong></td>
                    <td>
                      <div>
                        <EditableText
                          path={`cbseDisclosure.sectionA.fields.${idx}.details`}
                          fallback={field.details}
                          as="span"
                        />
                        {field.fileUrl && (
                          <div style={{ marginTop: '6px' }}>
                            <a
                              href={field.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="doc-link-btn"
                            >
                              <ExternalLink size={13} />
                              <span>{field.fileName || 'View Document'}</span>
                            </a>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 6. Section B: DOCUMENTS AND INFORMATION */}
        <div className="disclosure-table-wrapper">
          <div className="disclosure-section-heading">
            <h3>{sectionB?.sectionTitle || 'B : DOCUMENTS AND INFORMATION'}</h3>
            <span className="disclosure-norm-tag">Self-Attested Statutory Affidavits</span>
          </div>
          <div className="academic-table-container" style={{ margin: 0, border: 'none' }}>
            <table className="academic-table" aria-label="CBSE Disclosure Section B Documents and Information">
              <thead>
                <tr>
                  <th scope="col" style={{ width: '80px' }}>S.No.</th>
                  <th scope="col" style={{ width: '50%' }}>Documents / Prescribed Information</th>
                  <th scope="col">Document Verification & Upload Link</th>
                </tr>
              </thead>
              <tbody>
                {sectionBDocuments.map((doc, idx) => (
                  <tr key={doc.sNo || idx}>
                    <td>0{doc.sNo || idx + 1}</td>
                    <td><strong>{doc.documentName}</strong></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                        {doc.fileUrl ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleOpenDoc(getDocForViewing(doc.fileUrl, doc.documentName, 'Section B Documents'))}
                              className="doc-link-btn"
                              style={{ background: '#0b1b3d', color: '#ffffff', border: '1px solid #0b1b3d', cursor: 'pointer' }}
                              title="Inspect document directly in viewer"
                            >
                              <Eye size={14} />
                              <span>Inspect Document</span>
                            </button>
                            <a
                              href={doc.fileUrl}
                              download
                              target="_blank"
                              rel="noreferrer"
                              className="doc-link-btn"
                              title="Direct download file"
                            >
                              <Download size={13} />
                              <span>Download</span>
                            </a>
                          </>
                        ) : null}
                        <span className="doc-link-verified">
                          <CheckCircle2 size={13} />
                          <EditableText
                            path={`cbseDisclosure.sectionB.documents.${idx}.status`}
                            fallback={doc.status || 'Verified & Uploaded'}
                            as="span"
                          />
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 7. Section C: RESULT AND ACADEMICS */}
        <div className="disclosure-table-wrapper">
          <div className="disclosure-section-heading">
            <h3>{sectionC?.sectionTitle || 'C : RESULT AND ACADEMICS'}</h3>
            <span className="disclosure-norm-tag">Academic Records & Governance</span>
          </div>
          <div className="academic-table-container" style={{ margin: 0, border: 'none' }}>
            <table className="academic-table" aria-label="CBSE Disclosure Section C Result and Academics">
              <thead>
                <tr>
                  <th scope="col" style={{ width: '80px' }}>S.No.</th>
                  <th scope="col" style={{ width: '50%' }}>Statutory Institutional Document</th>
                  <th scope="col">Publication Link / Verification Status</th>
                </tr>
              </thead>
              <tbody>
                {sectionCDocuments.map((doc, idx) => (
                  <tr key={doc.sNo || idx}>
                    <td>0{doc.sNo || idx + 1}</td>
                    <td><strong>{doc.documentName}</strong></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                        {doc.fileUrl && doc.fileUrl.startsWith('/') ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleOpenDoc(getDocForViewing(doc.fileUrl, doc.documentName, 'Section C Records'))}
                              className="doc-link-btn"
                              style={{ background: '#0b1b3d', color: '#ffffff', border: '1px solid #0b1b3d', cursor: 'pointer' }}
                              title="Inspect document directly in viewer"
                            >
                              <Eye size={14} />
                              <span>Inspect Document</span>
                            </button>
                            <a
                              href={doc.fileUrl}
                              download
                              target="_blank"
                              rel="noreferrer"
                              className="doc-link-btn"
                              title="Direct download file"
                            >
                              <Download size={13} />
                              <span>Download</span>
                            </a>
                          </>
                        ) : null}
                        <span className="doc-link-verified">
                          <CheckCircle2 size={13} />
                          <EditableText
                            path={`cbseDisclosure.sectionC.documents.${idx}.status`}
                            fallback={doc.status || 'Verified & Uploaded'}
                            as="span"
                          />
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 8. Section D: STAFF (TEACHING) */}
        <div className="disclosure-table-wrapper">
          <div className="disclosure-section-heading">
            <h3>{sectionD?.sectionTitle || 'D : STAFF (TEACHING)'}</h3>
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
                {sectionDFields.map((field, idx) => (
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

        {/* 9. Section E: SCHOOL INFRASTRUCTURE */}
        <div className="disclosure-table-wrapper">
          <div className="disclosure-section-heading">
            <h3>{sectionE?.sectionTitle || 'E : SCHOOL INFRASTRUCTURE'}</h3>
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
                {sectionEFields.map((field, idx) => (
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

      {/* 10. LIGHTBOX & DOCUMENT MODAL VIEWER */}
      {selectedDoc && (
        <div 
          className="doc-modal-backdrop"
          onClick={() => setSelectedDoc(null)}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="doc-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="doc-modal-header">
              <div className="doc-modal-title-group">
                <span>{selectedDoc.category || 'Mandatory Public Disclosure'}</span>
                <h3>{selectedDoc.title}</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {/* Document Viewer Zoom & Rotate Controls */}
                <div className="doc-modal-tools">
                  <button type="button" className="doc-tool-btn" onClick={handleZoomIn} title="Zoom In (+)">
                    <ZoomIn size={16} />
                  </button>
                  <button type="button" className="doc-tool-btn" onClick={handleZoomOut} title="Zoom Out (-)">
                    <ZoomOut size={16} />
                  </button>
                  <button type="button" className="doc-tool-btn" onClick={handleRotate} title="Rotate 90° Clockwise">
                    <RotateCw size={16} />
                  </button>
                  <button type="button" className="doc-tool-btn" onClick={handleResetView} title="Reset Zoom/Orientation">
                    <Maximize2 size={16} />
                  </button>
                </div>
                <button
                  type="button"
                  className="doc-modal-close-btn"
                  onClick={() => setSelectedDoc(null)}
                  aria-label="Close document viewer"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            <div className="doc-modal-content">
              {selectedDoc.fileType === 'pdf' || selectedDoc.fileUrl?.toLowerCase().endsWith('.pdf') ? (
                <div className="doc-modal-pdf-wrapper">
                  <object
                    data={`${selectedDoc.fileUrl}#toolbar=1&navpanes=0`}
                    type="application/pdf"
                    className="doc-modal-pdf-embed"
                  >
                    <iframe
                      src={selectedDoc.fileUrl}
                      title={selectedDoc.title}
                      className="doc-modal-pdf-embed"
                    >
                      <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <FileText size={48} style={{ color: 'var(--color-navy)', margin: '0 auto 1rem' }} />
                        <p style={{ fontWeight: 600, color: 'var(--color-navy-deep)' }}>
                          PDF Document Loaded ({selectedDoc.title})
                        </p>
                        <a
                          href={selectedDoc.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-academic btn-academic-navy"
                          style={{ marginTop: '1rem', display: 'inline-flex' }}
                        >
                          Open in Full PDF Reader
                        </a>
                      </div>
                    </iframe>
                  </object>
                </div>
              ) : (
                <div className="doc-modal-img-viewport">
                  <img
                    src={selectedDoc.fileUrl}
                    alt={selectedDoc.title}
                    className="doc-modal-img"
                    style={{
                      transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                      transformOrigin: 'center center',
                      transition: 'transform 0.2s cubic-bezier(0.2, 0, 0, 1)',
                    }}
                  />
                </div>
              )}
            </div>

            <div className="doc-modal-footer">
              <div className="doc-modal-meta">
                {selectedDoc.documentNumber && <span><strong>Doc Ref:</strong> {selectedDoc.documentNumber} &nbsp;|&nbsp; </span>}
                {selectedDoc.issuingAuthority && <span><strong>Authority:</strong> {selectedDoc.issuingAuthority} &nbsp;|&nbsp; </span>}
                {selectedDoc.validUntil && <span><strong>Validity:</strong> {selectedDoc.validUntil}</span>}
              </div>

              <div className="doc-modal-actions">
                <a
                  href={selectedDoc.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="disclosure-action-btn"
                  title="Open full resolution file in new browser window"
                >
                  <ExternalLink size={15} />
                  <span>Open in Tab</span>
                </a>
                <a
                  href={selectedDoc.fileUrl}
                  download
                  className="disclosure-action-btn btn-primary"
                  title="Download file directly"
                >
                  <Download size={15} />
                  <span>Download Document</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
