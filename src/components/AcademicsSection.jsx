import React from 'react';
import { schoolData } from '../data/schoolData';
import { GraduationCap, Award, BookOpen } from 'lucide-react';

export default function AcademicsSection() {
  const { overview, streams, classXResults, classXIISResults } = schoolData.academics;

  return (
    <section id="academics" className="section-padding" aria-label="Academics & Board Examination Results">
      <div className="container">
        {/* Section Header */}
        <header className="editorial-section-header text-center">
          <span className="prospectus-subhead">Curricular Rigour & Performance</span>
          <h2 className="prospectus-title">Academics & Board Examination Results</h2>
          <div className="prospectus-rule centered">
            <span className="prospectus-rule-gem" />
          </div>
        </header>

        {/* Academic Overview Box */}
        <div className="academics-intro-box">
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontSize: '1.12rem', lineHeight: '1.8' }}>
              {overview}
            </p>
          </div>

          {/* Three Senior Secondary Streams */}
          <div className="streams-grid">
            {streams.map((stream, idx) => (
              <div key={idx} className="stream-card" style={{ '--reveal-delay': idx }}>
                <h3 className="stream-card-title">{stream.name}</h3>
                <p className="stream-subjects">
                  <strong>Subject Matrix:</strong> {stream.subjects}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Board Examination Results Tables */}
        <div className="results-table-wrapper">
          <div className="results-table-header">
            <div>
              <h3 className="results-title">Class X (AISSE) — Three-Year Performance Record</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--ink-muted)' }}>
                Official Board Examination metrics as stipulated by CBSE Appendix-IX disclosure norms.
              </p>
            </div>
            <span className="results-subtitle">CBSE Secondary School Examination</span>
          </div>

          <div className="academic-table-container">
            <table className="academic-table" aria-label="Class X 3-Year Board Results">
              <thead>
                <tr>
                  <th scope="col">Academic Session</th>
                  <th scope="col">No. of Students Registered</th>
                  <th scope="col">No. of Students Appeared</th>
                  <th scope="col">No. of Students Passed</th>
                  <th scope="col">Pass Percentage (%)</th>
                  <th scope="col">90%+ Distinctions</th>
                  <th scope="col">School Highest Score</th>
                  <th scope="col">Examination Ref</th>
                </tr>
              </thead>
              <tbody>
                {classXResults.map((row, idx) => (
                  <tr key={idx}>
                    <td><strong>{row.year}</strong></td>
                    <td><span className="table-badge-placeholder">{row.registered}</span></td>
                    <td><span className="table-badge-placeholder">{row.appeared}</span></td>
                    <td><span className="table-badge-placeholder">{row.passed}</span></td>
                    <td><strong style={{ color: 'var(--color-navy)' }}>{row.passPercentage}</strong></td>
                    <td><span className="table-badge-placeholder">{row.distinctions}</span></td>
                    <td><strong style={{ color: 'var(--color-maroon)' }}>{row.highestScore}</strong></td>
                    <td style={{ fontSize: '0.84rem' }}>{row.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Class XII Results Table */}
        <div className="results-table-wrapper" style={{ marginTop: '4rem' }}>
          <div className="results-table-header">
            <div>
              <h3 className="results-title">Class XII (AISSCE) — Three-Year Performance Record</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--ink-muted)' }}>
                Senior School Certificate Examination across Science, Commerce & Humanities faculties.
              </p>
            </div>
            <span className="results-subtitle">CBSE Senior Secondary Examination</span>
          </div>

          <div className="academic-table-container">
            <table className="academic-table" aria-label="Class XII 3-Year Board Results">
              <thead>
                <tr>
                  <th scope="col">Academic Session</th>
                  <th scope="col">No. of Students Registered</th>
                  <th scope="col">No. of Students Appeared</th>
                  <th scope="col">No. of Students Passed</th>
                  <th scope="col">Pass Percentage (%)</th>
                  <th scope="col">Distinction Holders</th>
                  <th scope="col">School Highest Score</th>
                  <th scope="col">Examination Ref</th>
                </tr>
              </thead>
              <tbody>
                {classXIISResults.map((row, idx) => (
                  <tr key={idx}>
                    <td><strong>{row.year}</strong></td>
                    <td><span className="table-badge-placeholder">{row.registered}</span></td>
                    <td><span className="table-badge-placeholder">{row.appeared}</span></td>
                    <td><span className="table-badge-placeholder">{row.passed}</span></td>
                    <td><strong style={{ color: 'var(--color-navy)' }}>{row.passPercentage}</strong></td>
                    <td><span className="table-badge-placeholder">{row.distinctions}</span></td>
                    <td><strong style={{ color: 'var(--color-maroon)' }}>{row.highestScore}</strong></td>
                    <td style={{ fontSize: '0.84rem' }}>{row.remarks}</td>
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
