import React from 'react';
import { useCMS } from '../context/CMSContext';
import { schoolData } from '../data/schoolData';
import EditableText from './admin/EditableText';
import EditableImage from './admin/EditableImage';

export default function StaffSection() {
  const { content } = useCMS();
  const staff = content.staff || schoolData.staff;
  const leadership = staff.leadership || schoolData.staff.leadership;
  const cadreBreakdown = staff.cadreBreakdown || schoolData.staff.cadreBreakdown;
  const metrics = staff.metrics || schoolData.staff.metrics;

  return (
    <section id="staff" className="section-padding section-parchment" aria-label="Teaching Staff & Leadership">
      <div className="container">
        {/* Section Header */}
        <header className="editorial-section-header text-center">
          <span className="prospectus-subhead">Pedagogical Leadership & Faculty</span>
          <h2 className="prospectus-title">The Teaching Faculty & Academic Cadre</h2>
          <div className="prospectus-rule centered">
            <span className="prospectus-rule-gem" />
          </div>
        </header>

        {/* Authentic Faculty Group Photo & Assembly Banner */}
        <div style={{ marginBottom: '3.5rem', background: '#ffffff', border: '1px solid var(--bg-paper-rule)', padding: '0.75rem', boxShadow: 'var(--shadow-editorial)' }}>
          <EditableImage
            path="staff.assemblyPhoto"
            defaultSrc="/faculty-cbp-training.jpg"
            alt="Mother Teresa Academy Teaching Faculty & Leadership at CBSE Capacity Building Programme"
            style={{ width: '100%', height: 'auto', maxHeight: '520px', objectFit: 'cover', display: 'block' }}
            loading="lazy"
          />
          <div style={{ padding: '1.15rem 1.25rem 0.75rem', borderTop: '1px solid var(--bg-paper-rule)' }}>
            <span style={{ fontSize: '0.74rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-maroon)', fontWeight: 700 }}>
              Institutional Assembly & Professional Development
            </span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--color-navy-deep)', margin: '0.25rem 0 0.4rem' }}>
              Mother Teresa Academy Teaching Faculty & Academic Cadre
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--ink-secondary)', margin: 0, lineHeight: 1.6 }}>
              School Principal, administrative leadership, and certified PGT, TGT, and PRT subject educators convened in the school auditorium for the CBSE Capacity Building Programme (CBP).
            </p>
          </div>
        </div>

        {/* Leadership Triptych (Principal, Vice Principal, Headmaster/Headmistress) */}
        {/* Leadership Triptych (Principal, Vice Principal, Headmaster/Headmistress) */}
        {leadership.length === 0 ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', background: '#fff', border: '1px dashed var(--bg-paper-rule)', marginBottom: '2.5rem' }}>
            <p style={{ margin: 0, color: 'var(--ink-secondary)' }}>Staff leadership roster will appear here once added.</p>
          </div>
        ) : (
          <div className="leadership-grid">
            {leadership.map((leader, idx) => (
              <article key={idx} className="leadership-card" style={{ '--reveal-delay': idx }}>
                {leader.photo && (
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--color-brass)', marginBottom: '0.75rem' }}>
                    <img src={leader.photo} alt={leader.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <span className="leadership-role-tag">{leader.role}</span>
                <h3 className="leadership-name">
                  <EditableText path={`staff.leadership.${idx}.name`} fallback={leader.name} as="span" />
                </h3>
                <p className="leadership-qual">
                  <strong>Qualifications:</strong>{' '}
                  <EditableText path={`staff.leadership.${idx}.qualifications`} fallback={leader.qualifications} as="span" />
                </p>
                <div className="leadership-exp">
                  <EditableText path={`staff.leadership.${idx}.experience`} fallback={leader.experience} as="span" />
                </div>
                {leader.messageExcerpt && (
                  <blockquote className="leadership-quote">
                    <EditableText path={`staff.leadership.${idx}.messageExcerpt`} multiline={true} fallback={leader.messageExcerpt} as="span" />
                  </blockquote>
                )}
              </article>
            ))}
          </div>
        )}

        {/* Cadre Metrics Strip */}
        <div className="staff-stats-strip">
          <div className="staff-stat-box">
            <div className="staff-stat-num">
              <EditableText path="staff.metrics.totalTeachingStaff" fallback={metrics.totalTeachingStaff} as="span" />
            </div>
            <div className="staff-stat-label">Total Teaching Faculty</div>
          </div>
          <div className="staff-stat-box">
            <div className="staff-stat-num">
              <EditableText path="staff.metrics.studentTeacherRatio" fallback={metrics.studentTeacherRatio} as="span" />
            </div>
            <div className="staff-stat-label">Teacher : Student Ratio</div>
          </div>
          <div className="staff-stat-box">
            <div className="staff-stat-num">
              <EditableText path="staff.metrics.teachersWithPostGraduation" fallback={metrics.teachersWithPostGraduation} as="span" />
            </div>
            <div className="staff-stat-label">Post-Graduate / B.Ed. Qualified</div>
          </div>
        </div>

        {/* Teaching Staff Cadre Breakdown Table */}
        <div className="results-table-wrapper">
          <div className="results-table-header">
            <div>
              <h3 className="results-title">Faculty Distribution Across Designations</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--ink-muted)' }}>
                Compliant with CBSE Affiliation Bye-Laws cadre qualifications and staffing mandates.
              </p>
            </div>
            <span className="results-subtitle">CBSE Staff Register Format</span>
          </div>

          <div className="academic-table-container">
            <table className="academic-table" aria-label="Staff Cadre Breakdown Table">
              <thead>
                <tr>
                  <th scope="col" style={{ width: '80px' }}>S.No.</th>
                  <th scope="col">Designation / Cadre</th>
                  <th scope="col">Sanctioned / Appointed Count</th>
                  <th scope="col">Mandated Qualification Benchmark</th>
                  <th scope="col">Service Cadre Status</th>
                </tr>
              </thead>
              <tbody>
                {cadreBreakdown.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--ink-secondary)' }}>
                      No staff designations currently recorded.
                    </td>
                  </tr>
                ) : (
                  cadreBreakdown.map((row, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{String(idx + 1).padStart(2, '0')}</td>
                      <td style={{ fontWeight: 600, color: 'var(--color-navy-deep)' }}>{row.category}</td>
                      <td>
                        <span className="status-badge-inline" style={{ fontWeight: 700 }}>
                          <EditableText path={`staff.cadreBreakdown.${idx}.count`} fallback={row.count} as="span" />
                        </span>
                      </td>
                      <td style={{ color: 'var(--ink-secondary)', fontSize: '0.88rem' }}>
                        <EditableText path={`staff.cadreBreakdown.${idx}.qualificationRequirement`} fallback={row.qualificationRequirement} as="span" />
                      </td>
                      <td>
                        <span className="status-badge-inline status-confirmed">{row.status || 'Regular Appointed'}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
