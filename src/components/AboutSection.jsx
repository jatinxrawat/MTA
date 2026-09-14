import React from 'react';
import CrestLogo from './CrestLogo';
import { useCMS } from '../context/CMSContext';
import { schoolData } from '../data/schoolData';
import EditableText from './admin/EditableText';

export default function AboutSection() {
  const { content } = useCMS();
  const about = content.about || schoolData.about;
  const general = content.general || schoolData.general;
  const spirit = content.spirit || {};

  return (
    <section id="about" className="section-padding section-parchment" aria-label="About Mother Teresa Academy">
      <div className="container-prospectus">
        {/* Editorial Section Header */}
        <header className="editorial-section-header text-center">
          <span className="prospectus-subhead">
            <EditableText path="spirit.subhead" fallback="Institutional Heritage & Foundation" as="span" />
          </span>
          <h2 className="prospectus-title">
            <EditableText path="spirit.title" fallback="The Spirit of Mother Teresa Academy" as="span" />
          </h2>
          <div className="prospectus-rule centered">
            <span className="prospectus-rule-gem" />
          </div>
        </header>

        {/* Asymmetric Editorial Prospectus Grid */}
        <div className="about-grid">
          {/* Main Editorial Column */}
          <div className="about-editorial-column">
            <p className="about-founding-lead editorial-dropcap">
              <EditableText
                path="about.foundingStory"
                multiline={true}
                fallback={about.foundingStory}
                as="span"
              />
            </p>
            <p style={{ marginBottom: '1.5rem' }}>
              Situated in Baraut in the fertile plains of Western Uttar Pradesh, the institution serves as an intellectual sanctuary where young minds are nurtured away from metropolitan distraction, yet equipped with world-class pedagogical resources.
            </p>

            <blockquote className="editorial-pullquote">
              "
              <EditableText
                path="spirit.pullquote"
                multiline={true}
                fallback={spirit.pullquote || "Not all of us can do great things. But we can do small things with great love."}
                as="span"
              />
              "
              <footer style={{ marginTop: '0.5rem', fontSize: '0.95rem', fontStyle: 'normal', color: 'var(--color-maroon)', fontWeight: '600' }}>
                <EditableText
                  path="spirit.pullquoteAuthor"
                  fallback={spirit.pullquoteAuthor || "— Saint Mother Teresa, Institutional Patron"}
                  as="span"
                />
              </footer>
            </blockquote>

            <p>
              Under the rigorous guidelines of the Central Board of Secondary Education (CBSE), we cultivate scholars who are intellectually curious, emotionally resilient, and morally upright.
            </p>
          </div>

          {/* Sidebar Prospectus Card */}
          <aside className="about-sidebar-column">
            <div className="about-crest-watermark">
              <CrestLogo size={74} animated={false} variant="brass" />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', marginTop: '0.75rem', color: 'var(--color-navy)' }}>
                Prospectus Summary
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--ink-muted)' }}>
                CBSE Affiliation Status: Senior Secondary
              </span>
            </div>

            <div style={{ marginBottom: '1.75rem' }}>
              <h4 className="prospectus-card-title">Our Sacred Mission</h4>
              <p style={{ fontSize: '0.92rem', lineHeight: '1.65' }}>
                <EditableText
                  path="about.missionStatement"
                  multiline={true}
                  fallback={about.missionStatement}
                  as="span"
                />
              </p>
            </div>

            <div style={{ borderTop: '1px solid var(--bg-paper-rule)', paddingTop: '1.5rem' }}>
              <h4 className="prospectus-card-title">Institutional Vision</h4>
              <p style={{ fontSize: '0.92rem', lineHeight: '1.65' }}>
                <EditableText
                  path="about.visionStatement"
                  multiline={true}
                  fallback={about.visionStatement}
                  as="span"
                />
              </p>
            </div>

            <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'var(--bg-parchment-white)', border: '1px dashed var(--bg-paper-rule)' }}>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-maroon)', fontWeight: '700' }}>
                Quick Reference
              </span>
              <div style={{ fontSize: '0.86rem', marginTop: '0.4rem', color: 'var(--ink-secondary)' }}>
                <strong>Campus:</strong> <EditableText path="general.location" fallback={general.location} as="span" />
                <br />
                <strong>Status:</strong> CBSE Co-Educational School
                <br />
                <strong>Est:</strong> <EditableText path="general.establishedYear" fallback={general.establishedYear} as="span" />
              </div>
            </div>
          </aside>
        </div>

        {/* Four Core Pillars of MTA */}
        <div className="core-pillars-grid">
          {(about.corePillars || []).map((pillar, idx) => (
            <article key={pillar.num || idx} className="pillar-item">
              <div className="pillar-num">{pillar.num}</div>
              <h3 className="pillar-title">
                <EditableText path={`about.corePillars.${idx}.title`} fallback={pillar.title} as="span" />
              </h3>
              <p className="pillar-desc">
                <EditableText path={`about.corePillars.${idx}.description`} multiline={true} fallback={pillar.description} as="span" />
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
