import React from 'react';
import { useCMS } from '../context/CMSContext';
import { schoolData } from '../data/schoolData';
import EditableText from './admin/EditableText';
import { GraduationCap, Award, BookOpen } from 'lucide-react';

export default function AcademicsSection() {
  const { content } = useCMS();
  const academics = content.academics || schoolData.academics;
  const overview = academics.overview || schoolData.academics.overview;
  const streams = academics.streams || schoolData.academics.streams;
  const classXResults = academics.classXResults || schoolData.academics.classXResults;
  const classXIISResults = academics.classXIISResults || schoolData.academics.classXIISResults;

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
              <EditableText
                path="academics.overview"
                multiline={true}
                fallback={overview}
                as="span"
              />
            </p>
          </div>

          {/* Three Senior Secondary Streams */}
          <div className="streams-grid">
            {streams.map((stream, idx) => (
              <div key={idx} className="stream-card" style={{ '--reveal-delay': idx }}>
                <h3 className="stream-card-title">
                  <EditableText path={`academics.streams.${idx}.name`} fallback={stream.name} as="span" />
                </h3>
                <p className="stream-subjects">
                  <strong>Subject Matrix:</strong>{' '}
                  <EditableText
                    path={`academics.streams.${idx}.subjects`}
                    multiline={true}
                    fallback={stream.subjects}
                    as="span"
                  />
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
                    <td>
                      <span className="table-badge-placeholder">
                        <EditableText path={`academics.classXResults.${idx}.registered`} fallback={row.registered} as="span" />
                      </span>
                    </td>
                    <td>
                      <span className="table-badge-placeholder">
                        <EditableText path={`academics.classXResults.${idx}.appeared`} fallback={row.appeared} as="span" />
                      </span>
                    </td>
                    <td>
                      <span className="table-badge-placeholder">
                        <EditableText path={`academics.classXResults.${idx}.passed`} fallback={row.passed} as="span" />
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--color-navy)' }}>
                        <EditableText path={`academics.classXResults.${idx}.passPercentage`} fallback={row.passPercentage} as="span" />
                      </strong>
                    </td>
                    <td>
                      <span className="table-badge-placeholder">
                        <EditableText path={`academics.classXResults.${idx}.distinctions`} fallback={row.distinctions} as="span" />
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--color-maroon)' }}>
                        <EditableText path={`academics.classXResults.${idx}.highestScore`} fallback={row.highestScore} as="span" />
                      </strong>
                    </td>
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
                Senior Secondary graduation outcomes across Science, Commerce, and Humanities.
              </p>
            </div>
            <span className="results-subtitle">CBSE Senior School Certificate Examination</span>
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
                  <th scope="col">90%+ Distinctions</th>
                  <th scope="col">School Highest Score</th>
                  <th scope="col">Examination Ref</th>
                </tr>
              </thead>
              <tbody>
                {classXIISResults.map((row, idx) => (
                  <tr key={idx}>
                    <td><strong>{row.year}</strong></td>
                    <td>
                      <span className="table-badge-placeholder">
                        <EditableText path={`academics.classXIISResults.${idx}.registered`} fallback={row.registered} as="span" />
                      </span>
                    </td>
                    <td>
                      <span className="table-badge-placeholder">
                        <EditableText path={`academics.classXIISResults.${idx}.appeared`} fallback={row.appeared} as="span" />
                      </span>
                    </td>
                    <td>
                      <span className="table-badge-placeholder">
                        <EditableText path={`academics.classXIISResults.${idx}.passed`} fallback={row.passed} as="span" />
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--color-navy)' }}>
                        <EditableText path={`academics.classXIISResults.${idx}.passPercentage`} fallback={row.passPercentage} as="span" />
                      </strong>
                    </td>
                    <td>
                      <span className="table-badge-placeholder">
                        <EditableText path={`academics.classXIISResults.${idx}.distinctions`} fallback={row.distinctions} as="span" />
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--color-maroon)' }}>
                        <EditableText path={`academics.classXIISResults.${idx}.highestScore`} fallback={row.highestScore} as="span" />
                      </strong>
                    </td>
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
