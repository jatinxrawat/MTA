import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCMS } from '../context/CMSContext';
import PageHeader from '../components/PageHeader';
import CrestLogo from '../components/CrestLogo';
import { 
  FileText, Download, ExternalLink, ArrowLeft 
} from 'lucide-react';

export default function CustomPageView() {
  const { slug } = useParams();
  const { content, isAdmin } = useCMS();
  const customPages = content.customPages || [];

  // Find the page matching the current slug
  const page = customPages.find(
    (p) => p.slug === slug || p.id === slug
  );

  // Fallback if page does not exist or is unpublished (unless logged in as admin)
  if (!page || (!page.isPublished && !isAdmin)) {
    return (
      <div className="subpage-view">
        <PageHeader
          title="Page Under Preparation"
          subtitle="This institutional circular or feature page is currently being updated by the administration."
          breadcrumb="Notice"
          badge="Information"
        />
        <div className="section-padding section-parchment text-center" style={{ minHeight: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <CrestLogo size={70} animated={false} variant="brass" />
          <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-navy-deep)', marginTop: '1.25rem' }}>
            Content Updating
          </h2>
          <p style={{ maxWidth: '520px', color: 'var(--ink-secondary)', margin: '0.75rem auto 1.75rem' }}>
            The page you requested is either still in draft formulation or has been archived. Please explore our official prospectus or check back shortly.
          </p>
          <Link to="/" className="btn-academic btn-academic-brass">
            <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} />
            Return to Prospectus Home
          </Link>
        </div>
      </div>
    );
  }

  // Split narrative text into paragraphs
  const paragraphs = (page.bodyText || '')
    .split('\n')
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="subpage-view">
      {/* 1. Header with Breadcrumb & Brass Rule */}
      <PageHeader
        title={page.title}
        subtitle={page.subtitle}
        breadcrumb={page.menuLabel || page.title}
        badge={page.badge || ''}
      />

      {/* Admin Draft Indicator if viewing an unpublished page */}
      {!page.isPublished && isAdmin && (
        <div style={{ backgroundColor: '#fef3c7', borderBottom: '1px solid #fde68a', padding: '10px', textAlign: 'center', fontSize: '0.85rem', color: '#92400e', fontWeight: '600' }}>
          ⚠️ Notice: This page is currently a <strong>Draft</strong>. Visitors will not see it until you publish it in the Admin CMS.
        </div>
      )}

      {/* 2. Main Page Content */}
      <section className="section-padding section-parchment" aria-label={page.title}>
        <div className="container-prospectus">
          {/* Optional Hero Showcase Photo */}
          {page.heroImage && (
            <div style={{ marginBottom: '2.5rem', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 8px 30px rgba(11,27,61,0.12)', border: '1px solid #e2e8f0' }}>
              <img
                src={page.heroImage}
                alt={page.title}
                style={{ width: '100%', maxHeight: '480px', objectFit: 'cover', display: 'block' }}
              />
              {page.heroImageCaption && (
                <div style={{ backgroundColor: 'var(--color-navy-deep)', color: '#cbd5e1', padding: '10px 18px', fontSize: '0.86rem', fontStyle: 'italic', borderTop: '2px solid var(--color-brass)' }}>
                  {page.heroImageCaption}
                </div>
              )}
            </div>
          )}

          <div className="about-grid">
            {/* Left: Narrative Editorial Column */}
            <div className="about-editorial-column">
              {paragraphs.length > 0 ? (
                paragraphs.map((para, idx) => (
                  <p
                    key={idx}
                    className={idx === 0 ? 'about-founding-lead editorial-dropcap' : ''}
                    style={{ marginBottom: '1.25rem', lineHeight: 1.8, fontSize: '1.05rem', color: '#1e293b' }}
                  >
                    {para}
                  </p>
                ))
              ) : (
                <p className="about-founding-lead editorial-dropcap" style={{ color: '#475569' }}>
                  {page.subtitle || 'Welcome to this official feature of Mother Teresa Academy, Baraut.'}
                </p>
              )}

              {/* Editorial Pullquote (if provided) */}
              {page.pullquote && (
                <blockquote className="editorial-pullquote" style={{ margin: '2rem 0' }}>
                  "{page.pullquote}"
                  {page.pullquoteAuthor && (
                    <footer style={{ marginTop: '0.6rem', fontSize: '0.95rem', fontStyle: 'normal', color: 'var(--color-maroon)', fontWeight: '600' }}>
                      — {page.pullquoteAuthor}
                    </footer>
                  )}
                </blockquote>
              )}

              {/* Key Highlights / Feature Cards Grid (if added) */}
              {page.highlightCards && page.highlightCards.length > 0 && (
                <div style={{ marginTop: '2.5rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-navy)', fontSize: '1.35rem', marginBottom: '1rem', borderBottom: '2px solid var(--color-brass-light)', paddingBottom: '6px' }}>
                    Key Information & Highlights
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                    {page.highlightCards.map((card, cIdx) => (
                      <div
                        key={cIdx}
                        style={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderTop: '3px solid var(--color-brass)',
                          borderRadius: '6px',
                          padding: '1.25rem',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                        }}
                      >
                        <strong style={{ color: 'var(--color-navy-deep)', display: 'block', fontSize: '1rem', marginBottom: '6px' }}>
                          {card.title}
                        </strong>
                        <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: 1.5 }}>
                          {card.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Sidebar Action Column (PDF downloads, crest, registration buttons) */}
            <aside className="about-sidebar-column">
              <div className="about-crest-watermark">
                <CrestLogo size={70} animated={false} variant="brass" />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', marginTop: '0.75rem', color: 'var(--color-navy)' }}>
                  Institutional Portal
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--ink-muted)' }}>
                  Mother Teresa Academy • Baraut
                </span>

                {/* Attached PDF Circular */}
                {page.attachedPdfUrl && (
                  <div style={{ marginTop: '1.5rem', padding: '1.2rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', textAlign: 'center' }}>
                    <FileText size={28} style={{ color: '#dc2626', margin: '0 auto 8px' }} />
                    <strong style={{ display: 'block', fontSize: '0.9rem', color: '#0f172a', marginBottom: '4px' }}>
                      {page.attachedPdfName || 'Official Circular Document'}
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '12px' }}>
                      Official CBSE / MTA Circular
                    </span>
                    <a
                      href={page.attachedPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={page.attachedPdfName || `${page.slug}.pdf`}
                      className="btn-academic btn-academic-brass"
                      style={{ padding: '8px 14px', fontSize: '0.85rem', width: '100%', justifyContent: 'center' }}
                    >
                      <Download size={14} style={{ marginRight: '6px' }} />
                      Download Circular (PDF)
                    </a>
                  </div>
                )}

                {/* Action CTA Button */}
                {page.actionButtonUrl && (
                  <div style={{ marginTop: '1.25rem' }}>
                    <a
                      href={page.actionButtonUrl}
                      target={page.actionButtonUrl.startsWith('http') ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      className="btn-academic btn-academic-navy"
                      style={{ width: '100%', justifyContent: 'center', padding: '10px 14px' }}
                    >
                      {page.actionButtonText || 'Open Portal'}
                      <ExternalLink size={14} style={{ marginLeft: '6px' }} />
                    </a>
                  </div>
                )}

                {/* Quick Facts List */}
                <div style={{ marginTop: '1.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem', textAlign: 'left' }}>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div>
                      <strong style={{ color: '#0f172a' }}>Category:</strong> {page.category || 'General'}
                    </div>
                    <div>
                      <strong style={{ color: '#0f172a' }}>Published:</strong> {page.createdAt || 'Current Session'}
                    </div>
                    <div>
                      <strong style={{ color: '#0f172a' }}>Affiliation:</strong> CBSE Senior Secondary (K-XII)
                    </div>
                  </div>
                </div>

                {/* Back to Home button */}
                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                  <Link
                    to="/"
                    style={{ fontSize: '0.82rem', color: '#2563eb', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}
                  >
                    <ArrowLeft size={13} />
                    <span>Return to Home</span>
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
