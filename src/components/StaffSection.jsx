import React from 'react';
import { schoolData } from '../data/schoolData';

export default function StaffSection() {
  const { leadership, cadreBreakdown, metrics } = schoolData.staff;

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
          <img
            src="/faculty-cbp-training.jpg"
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
        <div className="leadership-grid">
          {leadership.map((leader, idx) => (
            <article key={idx} className="leadership-card" style={{ '--reveal-delay': idx }}>
              <span className="leadership-role-tag">{leader.role}</span>
              <h3 className="leadership-name">{leader.name}</h3>
              <p className="leadership-qual">
                <strong>Qualifications:</strong> {leader.qualifications}
              </p>
              <div className="leadership-exp">
                {leader.experience}
              </div>
              <blockquote className="leadership-quote">
                {leader.messageExcerpt}
              </blockquote>
            </article>
          ))}
        </div>

        {/* Cadre Metrics Strip */}
        <div className="staff-stats-strip">
          <div className="staff-stat-box">
            <div className="staff-stat-num">{metrics.totalTeachingStaff}</div>
            <div className="staff-stat-label">Total Teaching Faculty</div>
          </div>
          <div className="staff-stat-box">
            <div className="staff-stat-num">{metrics.studentTeacherRatio}</div>
            <div className="staff-stat-label">Teacher : Student Ratio</div>
          </div>
          <div className="staff-stat-box">
            <div className="staff-stat-num">{metrics.teachersWithPostGraduation}</div>
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
                {cadreBreakdown.map((row, idx) => (
                  <tr key={idx}>
                    <td>0{idx + 1}</td>
                    <td><strong>{row.category}</strong></td>
                    <td><span className="table-badge-placeholder">{row.count}</span></td>
                    <td>{row.qualificationRequirement}</td>
                    <td style={{ fontSize: '0.86rem', color: 'var(--color-navy)' }}>Regular / Full-Time Appointee</td>
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
