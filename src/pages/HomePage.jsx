import React, { useState } from 'react';
import Hero from '../components/Hero';
import { Link } from 'react-router-dom';
import { schoolData } from '../data/schoolData';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useCMS } from '../context/CMSContext';
import EditableText from '../components/admin/EditableText';
import EditableImage from '../components/admin/EditableImage';
import { NEUTRAL_PLACEHOLDER_IMAGE } from '../lib/media';

import { sendInquiry, OFFICIAL_SCHOOL_EMAIL } from '../services/inquiryService';

import {
  Bell,
  Calendar,
  FileText,
  Download,
  BookOpen,
  GraduationCap,
  Users,
  Building2,
  Trophy,
  Palette,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  Loader2,
  Image as ImageIcon,
  Heart,
  Sun,
  Rocket,
  Sparkles,
  Navigation,
  Map,
} from 'lucide-react';

function getHouseIcon(iconType, props = {}) {
  switch (iconType) {
    case 'heart':
      return <Heart {...props} />;
    case 'sun':
      return <Sun {...props} />;
    case 'rocket':
      return <Rocket {...props} />;
    case 'palette':
    default:
      return <Palette {...props} />;
  }
}

export default function HomePage({ onOpenInquiry }) {
  const { content } = useCMS();
  const general = content.general || schoolData.general;
  const { postalAddress, phonePrimary, phoneSecondary, emailPrimary, emailAdmissions, officeHours, visitingHoursPrincipal } =
    general;
  const notices = (content.notices || schoolData.notices).filter((n) => n.isPublished !== false);
  const houses = content.houses || schoolData.studentLeadership.houses;
  const galleryItems = (content.gallery || schoolData.infrastructure.gallery).filter((g) => g.isVisible !== false);
  const { newsAndEvents, studentLeadership, sports, coCurricular } = schoolData;

  // Scroll reveal observers for each section
  const [noticesRef, noticesRevealed] = useScrollReveal();
  const [cornerstonesRef, cornerstonesRevealed] = useScrollReveal();
  const [housesRef, housesRevealed] = useScrollReveal();
  const [galleryRef, galleryRevealed] = useScrollReveal();
  const [eventsRef, eventsRevealed] = useScrollReveal();

  // Filter state for notice board
  const [noticeFilter, setNoticeFilter] = useState('All');
  const [showAllNotices, setShowAllNotices] = useState(false);

  // House interactive card toggle states
  const [toggledHouses, setToggledHouses] = useState({});
  const [allHousesToggled, setAllHousesToggled] = useState(false);

  const handleToggleHouse = (idx) => {
    setToggledHouses((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleToggleAllHouses = (active) => {
    setAllHousesToggled(active);
    const nextState = {};
    studentLeadership.houses.forEach((_, idx) => {
      nextState[idx] = active;
    });
    setToggledHouses(nextState);
  };

  // Lightbox state for gallery preview
  const [activePhoto, setActivePhoto] = useState(null);

  // Interactive map state for home contact section
  const [showHomeInteractiveMap, setShowHomeInteractiveMap] = useState(false);

  // Home page quick inquiry form state
  const [inquiryData, setInquiryData] = useState({
    parentName: '',
    phone: '',
    email: '',
    grade: 'Pre-Primary (Nursery - UKG)',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await sendInquiry({
        name: inquiryData.parentName,
        phone: inquiryData.phone,
        email: inquiryData.email,
        grade: inquiryData.grade,
        message: inquiryData.message,
        source: 'Homepage Quick Enquiry',
      });
      setInquirySubmitted(true);
    } catch (err) {
      console.error('Inquiry submission error:', err);
      setInquirySubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredNotices =
    noticeFilter === 'All'
      ? notices
      : notices.filter((n) => n.category.toLowerCase().includes(noticeFilter.toLowerCase()));

  // 4-5 notices displayed compactly unless user expands
  const displayedNotices = showAllNotices ? filteredNotices : filteredNotices.slice(0, 4);

  // Exactly 6 photos for preview
  const galleryPreviewPhotos = galleryItems.slice(0, 6);

  return (
    <div className="home-page-view">
      {/* 1. Full-Screen 100vh Hero Opening Photo */}
      <Hero
        onScrollClick={() => {
          const target = document.getElementById('notice-board');
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* 2. INSTITUTIONAL OVERVIEW & OFFICIAL NOTICE BOARD (TWO-COLUMN PROSPECTUS LAYOUT) */}
      <section id="notice-board" className="notice-board-section section-parchment" aria-label="About the Academy and Official Notice Board">
        <div className="container">
          <div className="notice-overview-grid">
            {/* LEFT COLUMN: About the Academy (roughly 45% width) */}
            <article className="about-academy-column">
              <header className="about-academy-header">
                <span className="prospectus-subhead">
                  <EditableText path="spirit.subhead" fallback="Institutional Heritage & Foundation" as="span" />
                </span>
                <h2 className="prospectus-title about-column-heading">
                  <EditableText path="spirit.title" fallback="The Spirit of Mother Teresa Academy" as="span" />
                </h2>
                <div className="prospectus-rule" style={{ margin: '0.65rem 0 1.15rem' }}>
                  <span className="prospectus-rule-gem" />
                </div>
              </header>

              {/* Campus Photo Showcase */}
              <div className="about-showcase-card">
                <div className="about-showcase-img-wrap">
                  <EditableImage
                    path="spirit.showcaseImage"
                    defaultSrc="/campus-facade.jpg"
                    alt="Mother Teresa Academy Main Campus Building"
                    className="about-showcase-img"
                  />
                </div>
              </div>

              <div className="about-prospectus-body">
                <p className="about-prospectus-lead">
                  <EditableText
                    path="spirit.lead"
                    multiline={true}
                    fallback="Founded with the enduring vision of Saint Mother Teresa’s selfless dedication, Mother Teresa Academy stands as a premier seat of school education along Baghpat Road in Baraut, Western Uttar Pradesh—synthesizing rigorous CBSE academic discipline with a profound moral conscience."
                    as="span"
                  />
                </p>

                <p className="about-prospectus-para">
                  <EditableText
                    path="spirit.paragraph"
                    multiline={true}
                    fallback="Our pedagogical framework balances scholastic distinction with character formation. Pupils are guided from formative curiosity towards scholarly mastery—fostering bilingual eloquence, experimental science inquiry in dedicated laboratories, and athletic vigor on our tournament grounds."
                    as="span"
                  />
                </p>

                {/* Compact Pull-Quote Treatment */}
                <blockquote className="editorial-pullquote about-column-pullquote">
                  "
                  <EditableText
                    path="spirit.pullquote"
                    multiline={true}
                    fallback="Not all of us can do great things. But we can do small things with great love."
                    as="span"
                  />
                  "
                  <footer className="about-pullquote-footer">
                    <EditableText
                      path="spirit.pullquoteAuthor"
                      fallback="— Saint Mother Teresa, Institutional Patron"
                      as="span"
                    />
                  </footer>
                </blockquote>

                {/* Multi-Colored Quick Reference Stat Cards */}
                <div className="prospectus-quick-reference">
                  <div className="quick-ref-item ref-location">
                    <div className="quick-ref-icon-title">
                      <MapPin size={15} className="quick-ref-icon" />
                      <span className="quick-ref-label">Location</span>
                    </div>
                    <strong className="quick-ref-val">
                      <EditableText path="spirit.locationQuickRef" fallback="Baraut, Baghpat (U.P.)" as="span" />
                    </strong>
                  </div>
                  <div className="quick-ref-item ref-affiliation">
                    <div className="quick-ref-icon-title">
                      <GraduationCap size={15} className="quick-ref-icon" />
                      <span className="quick-ref-label">Affiliation</span>
                    </div>
                    <strong className="quick-ref-val">
                      <EditableText path="spirit.affiliationQuickRef" fallback="CBSE Senior Secondary (K–XII)" as="span" />
                    </strong>
                  </div>
                  <div className="quick-ref-item ref-established">
                    <div className="quick-ref-icon-title">
                      <Building2 size={15} className="quick-ref-icon" />
                      <span className="quick-ref-label">Established</span>
                    </div>
                    <strong className="quick-ref-val">
                      <EditableText path="spirit.establishedQuickRef" fallback="2015" as="span" />
                    </strong>
                  </div>
                  <div className="quick-ref-item ref-motto">
                    <div className="quick-ref-icon-title">
                      <ShieldCheck size={15} className="quick-ref-icon" />
                      <span className="quick-ref-label">Motto</span>
                    </div>
                    <strong className="quick-ref-val">
                      <EditableText path="spirit.mottoQuickRef" fallback='"Laborare est Orare"' as="span" />
                    </strong>
                  </div>
                </div>
              </div>
            </article>

            {/* RIGHT COLUMN: Notice Board (roughly 55% width) */}
            <aside className="notice-board-card-column" aria-label="Official Circulars and Notice Board">
              <div className="notice-board-compact-card">
                {/* Column Header */}
                <div className="notice-card-header">
                  <div>
                    <span className="prospectus-subhead" style={{ fontSize: '0.92rem', marginBottom: '0.2rem', display: 'block' }}>
                      Circulars & Announcements
                    </span>
                    <h3 className="notice-card-heading">
                      Official Notice Board
                    </h3>
                  </div>

                  {/* Compact Category Filters */}
                  <div className="notice-filter-bar">
                    {['All', 'Admissions', 'CBSE Exam', 'Academics'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setNoticeFilter(cat)}
                        className={`notice-filter-pill ${noticeFilter === cat ? 'active' : ''}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Restrained Urgent Alert Banner */}
                <div className="notice-urgent-ticker">
                  <span className="notice-urgent-tag">URGENT</span>
                  <span className="notice-urgent-text">
                    <strong>Session 2025–2026 Admissions:</strong> Registration forms are now available online and at the administrative office (Baraut).
                  </span>
                </div>

                {/* List of Active Notices (Compact rows with Hairline Dividers) */}
                {displayedNotices.length === 0 ? (
                  <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center', color: 'var(--ink-secondary)' }}>
                    <p style={{ margin: 0, fontSize: '0.92rem' }}>No official circulars currently published under {noticeFilter}.</p>
                  </div>
                ) : (
                  <ul ref={noticesRef} className="notice-list">
                    {displayedNotices.map((item, idx) => {
                      const catLower = (item.category || '').toLowerCase();
                      const catClass = catLower.includes('admiss')
                        ? 'cat-admissions'
                        : catLower.includes('exam')
                        ? 'cat-exam'
                        : catLower.includes('acad')
                        ? 'cat-academics'
                        : 'cat-general';

                      return (
                        <li
                          key={item.id}
                          className={`notice-item ${catClass} scroll-reveal-item ${noticesRevealed ? 'is-revealed' : ''}`}
                          style={{ '--reveal-delay': idx }}
                        >
                          <div className="notice-left">
                            {/* Category Colored Date Badge & Tag */}
                            <div className="notice-date-column">
                              <span className="notice-serif-date">{item.date}</span>
                              <span className="notice-category-caps">{item.category}</span>
                            </div>

                          <div className="notice-title-wrap">
                            <h4 className="notice-title-text">
                              {item.title}
                              {item.isNew && <span className="notice-new-badge">NEW</span>}
                            </h4>
                            {item.bodyContent && (
                              <p className="notice-body-excerpt" style={{ margin: '6px 0 0 0', fontSize: '0.86rem', color: '#475569', lineHeight: 1.5 }}>
                                {item.bodyContent}
                              </p>
                            )}
                          </div>
                        </div>

                        {item.pdfUrl ? (
                          <a
                            href={item.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={item.pdfName || 'school_circular.pdf'}
                            className="notice-action-link"
                            title={item.linkText || 'Download Official Circular (PDF)'}
                          >
                            <Download size={14} />
                            <span>{item.linkText || 'Download PDF'}</span>
                          </a>
                        ) : item.ref && item.ref !== '#' && item.ref.startsWith('/') ? (
                          <Link to={item.ref} className="notice-action-link" title={item.linkText || 'View Document'}>
                            <FileText size={14} />
                            <span>{item.linkText || 'View Document'}</span>
                          </Link>
                        ) : item.ref && item.ref !== '#' ? (
                          <a
                            href={item.ref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="notice-action-link"
                            title={item.linkText || 'View Circular'}
                          >
                            <Download size={14} />
                            <span>{item.linkText || 'View Circular'}</span>
                          </a>
                        ) : null}
                      </li>
                      );
                    })}
                  </ul>
                )}

                {/* Card Footer: View All Toggle if > 4 notices */}
                {filteredNotices.length > 4 && (
                  <div className="notice-card-footer">
                    <button
                      type="button"
                      onClick={() => setShowAllNotices(!showAllNotices)}
                      className="notice-view-toggle-btn"
                    >
                      {showAllNotices
                        ? 'Show Recent Circulars Only'
                        : `View All (${filteredNotices.length}) Circulars & Archives`}
                    </button>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* 3. CORE INSTITUTIONAL PILLARS SHOWCASE (CORNERSTONES) */}
      <section className="section-padding section-parchment cornerstones-section" aria-label="School Highlights">
        <div className="container">
          <header className="editorial-section-header text-center">
            <span className="prospectus-subhead">Holistic Formation & Excellence</span>
            <h2 className="prospectus-title">The Cornerstones of Mother Teresa Academy</h2>
            <div className="prospectus-rule centered">
              <span className="prospectus-rule-gem" />
            </div>
            <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.1rem', color: 'var(--ink-secondary)' }}>
              Dedicated to academic rigour, world-class campus infrastructure, character cultivation, athletic vitality, and multi-dimensional co-curricular scholarship.
            </p>
          </header>

          {/* Six Cornerstones Cards: Stagger in on scroll, gentle lift on hover */}
          <div ref={cornerstonesRef} className="pillars-showcase-grid">
            {/* Pillar 1: CBSE Academic Rigor */}
            <article
              className={`pillar-feature-card pillar-theme-blue scroll-reveal-item ${cornerstonesRevealed ? 'is-revealed' : ''}`}
              style={{ '--reveal-delay': 0 }}
            >
              <div className="pillar-card-bg" aria-hidden="true">
                <EditableImage
                  path="cornerstones.0.image"
                  defaultSrc="/gallery/chemistry-lab-titration.jpg"
                  alt=""
                  className="pillar-card-bg-img"
                  loading="lazy"
                />
                <div className="pillar-card-bg-scrim" />
              </div>
              <div className="pillar-card-icon" style={{ backgroundColor: '#edf2fb', color: '#1d4ed8' }}>
                <GraduationCap size={26} />
              </div>
              <h3 className="pillar-card-title">
                <EditableText
                  path="cornerstones.0.title"
                  fallback="CBSE Academic Excellence"
                  as="span"
                />
              </h3>
              <p className="pillar-card-desc">
                <EditableText
                  path="cornerstones.0.description"
                  multiline={true}
                  fallback="Affiliated with the Central Board of Secondary Education, offering Senior Secondary Science, Commerce, and Humanities faculties with dedicated focus on NCERT benchmarks and national competitive exam readiness."
                  as="span"
                />
              </p>
              <Link to="/academics" className="pillar-card-link">
                <span>View 3-Year Board Results & Streams</span>
                <ChevronRight size={16} />
              </Link>
            </article>

            {/* Pillar 2: Best Campus Infrastructure */}
            <article
              className={`pillar-feature-card pillar-theme-teal scroll-reveal-item ${cornerstonesRevealed ? 'is-revealed' : ''}`}
              style={{ '--reveal-delay': 1 }}
            >
              <div className="pillar-card-bg" aria-hidden="true">
                <EditableImage
                  path="cornerstones.1.image"
                  defaultSrc="/science-maths-composite-lab.jpg"
                  alt=""
                  className="pillar-card-bg-img"
                  loading="lazy"
                />
                <div className="pillar-card-bg-scrim" />
              </div>
              <div className="pillar-card-icon" style={{ backgroundColor: '#fff8eb', color: 'var(--color-brass-deep)' }}>
                <Building2 size={26} />
              </div>
              <h3 className="pillar-card-title">
                <EditableText
                  path="cornerstones.1.title"
                  fallback="Best-in-Class Infrastructure"
                  as="span"
                />
              </h3>
              <p className="pillar-card-desc">
                <EditableText
                  path="cornerstones.1.description"
                  multiline={true}
                  fallback="Dedicated physics and composite science laboratories with Ohm's law apparatus, 3D mathematics geometric models, high-speed IT terminals, and spacious smart classrooms across our central lawn campus."
                  as="span"
                />
              </p>
              <Link to="/infrastructure" className="pillar-card-link">
                <span>Explore Campus Estates & Labs</span>
                <ChevronRight size={16} />
              </Link>
            </article>

            {/* Pillar 3: Student Leadership & Houses */}
            <article
              className={`pillar-feature-card pillar-theme-crimson scroll-reveal-item ${cornerstonesRevealed ? 'is-revealed' : ''}`}
              style={{ '--reveal-delay': 2 }}
            >
              <div className="pillar-card-bg" aria-hidden="true">
                <EditableImage
                  path="cornerstones.2.image"
                  defaultSrc="/gallery/championship-trophy-presentation.jpg"
                  alt=""
                  className="pillar-card-bg-img"
                  loading="lazy"
                />
                <div className="pillar-card-bg-scrim" />
              </div>
              <div className="pillar-card-icon" style={{ backgroundColor: '#fff1f2', color: '#be123c' }}>
                <Users size={26} />
              </div>
              <h3 className="pillar-card-title">
                <EditableText
                  path="cornerstones.2.title"
                  fallback="Student Leadership & Houses"
                  as="span"
                />
              </h3>
              <p className="pillar-card-desc">
                <EditableText
                  path="cornerstones.2.description"
                  multiline={true}
                  fallback="An active Prefectorial Board led by Head Boy and Head Girl, instilling civic responsibility and democratic leadership across our four distinguished houses: Teresa, Vivekananda, Kalam, and Tagore."
                  as="span"
                />
              </p>
              <Link to="/staff" className="pillar-card-link">
                <span>Meet Faculty & Prefects</span>
                <ChevronRight size={16} />
              </Link>
            </article>

            {/* Pillar 4: Sports & Athletics */}
            <article
              className={`pillar-feature-card pillar-theme-emerald scroll-reveal-item ${cornerstonesRevealed ? 'is-revealed' : ''}`}
              style={{ '--reveal-delay': 3 }}
            >
              <div className="pillar-card-bg" aria-hidden="true">
                <EditableImage
                  path="cornerstones.3.image"
                  defaultSrc="/kabaddi-sports-tournament.jpg"
                  alt=""
                  className="pillar-card-bg-img"
                  loading="lazy"
                />
                <div className="pillar-card-bg-scrim" />
              </div>
              <div className="pillar-card-icon" style={{ backgroundColor: '#e8f5e9', color: '#16a34a' }}>
                <Trophy size={26} />
              </div>
              <h3 className="pillar-card-title">
                <EditableText
                  path="cornerstones.3.title"
                  fallback="Sports & Physical Vigor"
                  as="span"
                />
              </h3>
              <p className="pillar-card-desc">
                <EditableText
                  path="cornerstones.3.description"
                  multiline={true}
                  fallback="Tournament-grade mat arena for high-intensity Inter-House Kabaddi championships, cricket practice nets, basketball arena, athletic sprint tracks, morning yoga, and physical self-defense training."
                  as="span"
                />
              </p>
              <Link to="/infrastructure" className="pillar-card-link">
                <span>View Sports Facilities</span>
                <ChevronRight size={16} />
              </Link>
            </article>

            {/* Pillar 5: Co-Curricular & Creative Clubs */}
            <article
              className={`pillar-feature-card pillar-theme-amber scroll-reveal-item ${cornerstonesRevealed ? 'is-revealed' : ''}`}
              style={{ '--reveal-delay': 4 }}
            >
              <div className="pillar-card-bg" aria-hidden="true">
                <EditableImage
                  path="cornerstones.4.image"
                  defaultSrc="/gallery/cultural-celebrations-diya-lighting.jpg"
                  alt=""
                  className="pillar-card-bg-img"
                  loading="lazy"
                />
                <div className="pillar-card-bg-scrim" />
              </div>
              <div className="pillar-card-icon" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
                <Palette size={26} />
              </div>
              <h3 className="pillar-card-title">
                <EditableText
                  path="cornerstones.4.title"
                  fallback="Co-Curricular & Arts"
                  as="span"
                />
              </h3>
              <p className="pillar-card-desc">
                <EditableText
                  path="cornerstones.4.description"
                  multiline={true}
                  fallback="Robotics and STEM tinkering club, bilingual debating society (Hindi & English), classical music choir, environmental eco-warriors, and visual arts studios fostering holistic individual creativity."
                  as="span"
                />
              </p>
              <Link to="/about" className="pillar-card-link">
                <span>Discover Co-Curricular Life</span>
                <ChevronRight size={16} />
              </Link>
            </article>

            {/* Pillar 6: CBSE Appendix-IX Public Disclosure */}
            <article
              className={`pillar-feature-card pillar-theme-brass scroll-reveal-item ${cornerstonesRevealed ? 'is-revealed' : ''}`}
              style={{ '--reveal-delay': 5 }}
            >
              <div className="pillar-card-bg" aria-hidden="true">
                <EditableImage
                  path="cornerstones.5.image"
                  defaultSrc="/campus-facade.jpg"
                  alt=""
                  className="pillar-card-bg-img"
                  loading="lazy"
                />
                <div className="pillar-card-bg-scrim" />
              </div>
              <div className="pillar-card-icon" style={{ backgroundColor: 'var(--color-maroon-soft)', color: 'var(--color-maroon)' }}>
                <ShieldCheck size={26} />
              </div>
              <h3 className="pillar-card-title">
                <EditableText
                  path="cornerstones.5.title"
                  fallback="CBSE Mandatory Disclosure"
                  as="span"
                />
              </h3>
              <p className="pillar-card-desc">
                <EditableText
                  path="cornerstones.5.description"
                  multiline={true}
                  fallback="Complete institutional transparency under CBSE Appendix-IX norms. Complete publication of building safety, fire safety, recognition certificates, and academic governance registers."
                  as="span"
                />
              </p>
              <Link to="/cbse-disclosure" className="pillar-card-link" style={{ color: 'var(--color-maroon)' }}>
                <span>Access Statutory Appendix-IX</span>
                <ChevronRight size={16} />
              </Link>
            </article>
          </div>

          {/* Four Noble Houses Showcase: Interactive Cool Toggles & Dual-View Cards */}
          <div style={{ marginTop: '4.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--color-navy-deep)', textAlign: 'center', marginBottom: '0.5rem' }}>
              The Four Institutional Houses
            </h3>
            <p style={{ textAlign: 'center', color: 'var(--ink-muted)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
              Every scholar belongs to a house, participating in weekly academic debates, sports derbies, and cultural competitions.
            </p>

            {/* Master Toggle Bar: Switch all houses between Motto and Heritage */}
            <div className="houses-master-toggle-container">
              <button
                type="button"
                className={`houses-master-pill-btn ${!allHousesToggled ? 'is-active' : ''}`}
                onClick={() => handleToggleAllHouses(false)}
                aria-label="View all house mottos"
              >
                <span>Motto Overview</span>
              </button>
              <button
                type="button"
                className={`houses-master-pill-btn ${allHousesToggled ? 'is-active' : ''}`}
                onClick={() => handleToggleAllHouses(true)}
                aria-label="View all house profiles and heritage"
              >
                <Sparkles size={13} />
                <span>Heritage & Profiles</span>
              </button>
            </div>

            <div ref={housesRef} className="houses-strip">
              {houses.map((house, idx) => {
                const houseClass = `house-${(house.name || '').toLowerCase().replace(/[^a-z0-9]/g, '')}`;
                const isToggled = !!toggledHouses[idx];
                return (
                  <div
                    key={idx}
                    className={`house-item-box ${houseClass} ${isToggled ? 'is-toggled' : ''} scroll-reveal-item ${housesRevealed ? 'is-revealed' : ''}`}
                    style={{
                      '--house-color': house.color,
                      '--house-color-rgb': house.colorRgb || '11, 27, 61',
                      '--reveal-delay': idx,
                    }}
                    onClick={() => handleToggleHouse(idx)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleToggleHouse(idx);
                      }
                    }}
                    title="Click card or toggle switch to flip between Motto and House Profile"
                  >
                    {/* Cool Interactive Pill Toggle replacing static emoji */}
                    <div className="house-toggle-wrapper">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isToggled}
                        aria-label={`Toggle ${house.name} view mode`}
                        className={`house-cool-toggle ${isToggled ? 'is-active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleHouse(idx);
                        }}
                      >
                        {/* Track Left: House Symbol */}
                        <span className="toggle-track-icon left">
                          {getHouseIcon(house.iconType, { size: 12, strokeWidth: 2.6 })}
                        </span>
                        {/* Track Right: Sparkles / Heritage Indicator */}
                        <span className="toggle-track-icon right">
                          <Sparkles size={11} strokeWidth={2.4} />
                        </span>
                        {/* Smooth Gliding Thumb */}
                        <span className="toggle-thumb">
                          {isToggled ? (
                            <Sparkles size={12} strokeWidth={2.4} />
                          ) : (
                            getHouseIcon(house.iconType, { size: 12, strokeWidth: 2.6 })
                          )}
                        </span>
                      </button>

                      {/* Micro Status Mode Badge */}
                      <div className="toggle-status-pill">
                        <span className="toggle-status-dot" />
                        <span>{isToggled ? 'Profile' : 'Motto'}</span>
                      </div>
                    </div>

                    {/* Dual-View Animated Content */}
                    <div className="house-card-content">
                      <div className={`house-view-panel ${!isToggled ? 'is-active' : 'is-hidden'}`}>
                        <h4 className="house-name">
                          <EditableText path={`houses.${idx}.name`} fallback={house.name} as="span" />
                        </h4>
                        <p className="house-motto">
                          "
                          <EditableText path={`houses.${idx}.motto`} fallback={house.motto} as="span" />
                          "
                        </p>
                      </div>

                      <div className={`house-view-panel ${isToggled ? 'is-active' : 'is-hidden'}`}>
                        <h4 className="house-patron-title">{house.patron || house.name}</h4>
                        <p className="house-virtues-text">
                          <EditableText path={`houses.${idx}.virtues`} fallback={house.virtues} as="span" />
                        </p>
                        <span className="house-mascot-pill">Mascot: {house.mascot}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. OUR GALLERY: 6 PHOTO PREVIEW + "VIEW FULL GALLERY" BUTTON */}
      <section id="home-gallery" className="section-padding home-gallery-section" aria-label="Campus Photo Gallery">
        <div className="container">
          <header className="editorial-section-header text-center">
            <span className="prospectus-subhead">Visual Panorama of Campus Life</span>
            <h2 className="prospectus-title">Our Campus Gallery</h2>
            <div className="prospectus-rule centered">
              <span className="prospectus-rule-gem" />
            </div>
            <p style={{ maxWidth: '720px', margin: '0 auto', fontSize: '1.05rem', color: 'var(--ink-secondary)' }}>
              A photographic glimpse into our academic quadrangle, specialized science laboratories, athletic grounds, and vibrant learning spaces.
            </p>
          </header>

          {/* 6 Photo Preview Grid: Stagger in on scroll, subtle hover crop zoom (scale 1.04) */}
          {galleryPreviewPhotos.length === 0 ? (
            <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center', background: '#ffffff', border: '1px dashed var(--bg-paper-rule)', borderRadius: '4px', margin: '2rem 0' }}>
              <p style={{ margin: 0, color: 'var(--ink-secondary)', fontSize: '1.05rem' }}>Photographs are being curated and will appear here once published.</p>
            </div>
          ) : (
            <div ref={galleryRef} className="gallery-grid">
              {galleryPreviewPhotos.map((photo, idx) => (
                <figure
                  key={photo.id || idx}
                  className={`gallery-item scroll-reveal-item ${galleryRevealed ? 'is-revealed' : ''}`}
                  style={{ '--reveal-delay': idx, cursor: 'pointer' }}
                  onClick={() => setActivePhoto(photo)}
                >
                  <div className="gallery-image-wrapper">
                    <img
                      src={photo.image || NEUTRAL_PLACEHOLDER_IMAGE}
                      alt={photo.title || 'Mother Teresa Academy Campus Photo'}
                      className="gallery-image"
                      loading="lazy"
                      onError={(e) => {
                        if (e.target.src !== NEUTRAL_PLACEHOLDER_IMAGE) {
                          e.target.src = NEUTRAL_PLACEHOLDER_IMAGE;
                        }
                      }}
                    />
                  </div>
                  <figcaption className="gallery-caption-box">
                    <h4 className="gallery-title">{photo.title}</h4>
                    <p className="gallery-desc">{photo.caption}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}

          {/* "View Full Gallery" CTA Button */}
          <div className="gallery-cta-bar">
            <Link
              to="/gallery"
              className="btn-academic btn-academic-brass"
              style={{ gap: '0.65rem', padding: '1rem 2.25rem', fontSize: '0.96rem' }}
            >
              <ImageIcon size={18} />
              View More Photos in Our Gallery
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. NEWS & UPCOMING EVENTS: Real school photo background */}
      <section id="news-events" className="section-padding news-events-section" aria-label="News and Upcoming Events">
        {/* Real School Photo Background Layer */}
        <div className="news-events-bg-container">
          <EditableImage
            path="newsEvents.backgroundImage"
            defaultSrc="/news-events-campus.jpg"
            alt="Mother Teresa Academy Main Campus Facade, Entrance Portico, and Central Lawns"
            className="news-events-bg-img"
            loading="lazy"
          />
          <div className="news-events-overlay-scrim" />
        </div>

        <div className="container news-events-content-container">
          <header className="editorial-section-header text-center news-events-header">
            <span className="prospectus-subhead news-events-subhead">Campus Life & Calendar</span>
            <h2 className="prospectus-title news-events-title">News & Upcoming Events</h2>
            <div className="prospectus-rule centered news-events-rule">
              <span className="prospectus-rule-gem" />
            </div>
            <p className="news-events-intro-lead">
              Official updates, regional CBSE athletic meets, exhibitions, and scholastic milestones across the academy.
            </p>
          </header>

          <div ref={eventsRef} className="events-grid">
            {newsAndEvents.map((event, idx) => {
              const themeClass = idx === 0 ? 'theme-emerald'
                : idx === 1 ? 'theme-sapphire'
                : idx === 2 ? 'theme-amber'
                : 'theme-crimson';

              return (
                <article
                  key={event.id}
                  className={`event-card ${themeClass} scroll-reveal-item ${eventsRevealed ? 'is-revealed' : ''}`}
                  style={{ '--reveal-delay': idx }}
                >
                  <div className="event-date-badge">
                    <div className="event-day">{event.day}</div>
                  <div className="event-month">{event.month}</div>
                  <div className="event-year">{event.year}</div>
                </div>

                <div className="event-body">
                  <span className="event-category-pill">{event.category}</span>
                  <h3 className="event-title">{event.title}</h3>
                  <p className="event-desc">{event.description}</p>
                  <div className="event-venue">
                    <MapPin size={14} style={{ color: 'var(--color-maroon)' }} />
                    <span>{event.venue}</span>
                  </div>
                </div>
              </article>
            );
          })}
          </div>
        </div>
      </section>

      {/* 6. CONNECT WITH US / GET IN TOUCH */}
      <section id="connect" className="section-padding home-connect-section" aria-label="Connect With Us">
        <div className="container">
          <header className="editorial-section-header text-center">
            <span className="prospectus-subhead">Admissions Liaison & Enquiries</span>
            <h2 className="prospectus-title">Connect with Mother Teresa Academy</h2>
            <div className="prospectus-rule centered">
              <span className="prospectus-rule-gem" />
            </div>
            <p style={{ maxWidth: '720px', margin: '0 auto', fontSize: '1.05rem', color: 'var(--ink-secondary)' }}>
              We welcome prospective parents and scholars to schedule a campus tour, consult our admissions counselors, or submit an official enquiry.
            </p>
          </header>

          <div className="contact-layout-grid">
            {/* Campus Coordinates & Visiting Hours */}
            <div className="contact-details-box">
              {/* Unified Campus Location & Interactive Google Maps Card */}
              <div className="contact-location-merged-card">
                <div className="merged-card-top-bar">
                  <div className="merged-location-header">
                    <MapPin size={22} className="contact-icon" />
                    <h3 className="merged-location-title">Campus Location</h3>
                  </div>
                  <div className="map-live-status-pill" style={{ marginBottom: 0 }}>
                    <span className="live-status-dot" />
                    <span>Verified Location</span>
                  </div>
                </div>

                <div className="merged-card-body">
                  <a
                    href="https://maps.app.goo.gl/LXHxYsqPKy6rnrNo9?g_st=ic"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="map-pin-pulse"
                    aria-label="Open Mother Teresa Academy in Google Maps"
                    title="Click to navigate on Google Maps"
                  >
                    <MapPin size={26} />
                  </a>

                  <h4 className="merged-location-school-name">Mother Teresa Academy</h4>
                  <p className="merged-location-address">
                    {postalAddress}
                    <span className="merged-location-region">Baraut, Western Uttar Pradesh, India</span>
                  </p>
                  <div className="map-coords">GPS: 29.1004° N, 77.2606° E • Baraut</div>

                  <div className="map-actions-row">
                    <a
                      href="https://maps.app.goo.gl/LXHxYsqPKy6rnrNo9?g_st=ic"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="map-btn map-btn-primary"
                    >
                      <Navigation size={14} />
                      <span>Open in Google Maps</span>
                      <ExternalLink size={13} />
                    </a>

                    <button
                      type="button"
                      className="map-btn map-btn-secondary"
                      onClick={() => setShowHomeInteractiveMap(!showHomeInteractiveMap)}
                    >
                      <Map size={14} />
                      <span>{showHomeInteractiveMap ? 'Hide Map' : 'View Live Map'}</span>
                    </button>
                  </div>

                  {showHomeInteractiveMap && (
                    <div className="map-embed-container">
                      <iframe
                        title="Mother Teresa Academy Campus Location Map"
                        src="https://www.openstreetmap.org/export/embed.html?bbox=77.2306%2C29.0804%2C77.2906%2C29.1204&layer=mapnik&marker=29.1004%2C77.2606"
                        className="map-iframe"
                        loading="lazy"
                      />
                      <div className="map-embed-overlay-bar">
                        <span>Mother Teresa Academy, Chhaprauli Rd, Baraut</span>
                        <a
                          href="https://maps.app.goo.gl/LXHxYsqPKy6rnrNo9?g_st=ic"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="map-embed-link"
                        >
                          Get Directions on Google Maps ↗
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="contact-item-group">
                <div className="contact-item-header">
                  <Phone size={22} className="contact-icon" />
                  <h3 className="contact-label">Telephonic Helplines &amp; WhatsApp</h3>
                </div>
                <p className="contact-val">
                  Administration Office: {phonePrimary}{' '}
                  <a
                    href="https://wa.me/919557667999?text=Hello%20Mother%20Teresa%20Academy%2C%20I%20would%20like%20to%20inquire%20about%20admissions."
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      background: '#25d366',
                      color: '#ffffff',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      marginLeft: '0.5rem',
                      verticalAlign: 'middle',
                    }}
                    title="Direct WhatsApp Chat"
                  >
                    💬 WhatsApp
                  </a>
                  <br />
                  Admissions Cell: {phoneSecondary}{' '}
                  <a
                    href="https://wa.me/917017551638?text=Hello%20Mother%20Teresa%20Academy%2C%20I%20would%20like%20to%20inquire%20about%20admissions."
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      background: '#25d366',
                      color: '#ffffff',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      marginLeft: '0.5rem',
                      verticalAlign: 'middle',
                    }}
                    title="Direct WhatsApp Chat"
                  >
                    💬 WhatsApp
                  </a>
                </p>
              </div>

              <div className="contact-item-group">
                <div className="contact-item-header">
                  <Mail size={22} className="contact-icon" />
                  <h3 className="contact-label">Electronic Mail &amp; YouTube</h3>
                </div>
                <p className="contact-val">
                  Official Email: {emailPrimary}
                  <br />
                  YouTube Channel:{' '}
                  <a
                    href="https://www.youtube.com/@motherteresaacademy7598"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#dc2626', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    ▶ @motherteresaacademy7598
                  </a>
                </p>
              </div>

              <div className="contact-item-group">
                <div className="contact-item-header">
                  <Clock size={22} className="contact-icon" />
                  <h3 className="contact-label">Office & Visiting Hours</h3>
                </div>
                <p className="contact-val">
                  {officeHours}
                  <br />
                  <em>{visitingHoursPrincipal}</em>
                </p>
              </div>
            </div>

            {/* Quick Admission Enquiry Card with Smooth Focus and Button Micro-Interaction */}
            <div className="inquiry-form-card">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--color-navy-deep)', marginBottom: '0.5rem' }}>
                Admission &amp; School Enquiry
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--ink-muted)', marginBottom: '2rem' }}>
                Fill out the credentials below to receive the official prospectus, syllabus schedule, or discuss any specific query with our team.
              </p>

              {inquirySubmitted ? (
                <div style={{ backgroundColor: 'var(--bg-parchment-white)', border: '1px solid var(--color-brass)', padding: '2.5rem', textAlign: 'center' }}>
                  <CheckCircle size={42} style={{ color: '#2e7d32', margin: '0 auto 1rem' }} />
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
                    Enquiry Dispatched to Admissions
                  </h4>
                  <p style={{ fontSize: '0.95rem', color: 'var(--ink-secondary)', marginBottom: '0.5rem' }}>
                    Thank you, <strong>{inquiryData.parentName}</strong>. Your query has been forwarded directly to our administration desk (<strong>{OFFICIAL_SCHOOL_EMAIL}</strong>).
                  </p>
                  <p style={{ fontSize: '0.88rem', color: 'var(--ink-muted)' }}>
                    Our Admissions Secretariat will review your inquiry and contact <strong>{inquiryData.phone}</strong> shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setInquirySubmitted(false);
                      setInquiryData({
                        parentName: '',
                        phone: '',
                        email: '',
                        grade: 'Pre-Primary (Nursery - UKG)',
                        message: '',
                      });
                    }}
                    className="btn-academic btn-academic-outline"
                    style={{ marginTop: '1.5rem' }}
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="home-parent-name">
                      Parent / Guardian Name *
                    </label>
                    <input
                      type="text"
                      id="home-parent-name"
                      required
                      className="form-input"
                      placeholder="Enter full name"
                      value={inquiryData.parentName}
                      onChange={(e) => setInquiryData({ ...inquiryData, parentName: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="home-phone">
                      Contact Mobile / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      id="home-phone"
                      required
                      className="form-input"
                      placeholder="Enter 10-digit mobile number"
                      value={inquiryData.phone}
                      onChange={(e) => setInquiryData({ ...inquiryData, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="home-email">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="home-email"
                      className="form-input"
                      placeholder="parent@example.com"
                      value={inquiryData.email}
                      onChange={(e) => setInquiryData({ ...inquiryData, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="home-grade">
                      Class Seeking Admission *
                    </label>
                    <select
                      id="home-grade"
                      className="form-select"
                      value={inquiryData.grade}
                      onChange={(e) => setInquiryData({ ...inquiryData, grade: e.target.value })}
                    >
                      <option value="Pre-Primary (Nursery - UKG)">Pre-Primary (Nursery, LKG, UKG)</option>
                      <option value="Primary Wing (Class I - V)">Primary Wing (Class I - V)</option>
                      <option value="Middle Wing (Class VI - VIII)">Middle Wing (Class VI - VIII)</option>
                      <option value="Secondary Wing (Class IX - X)">Secondary Wing (Class IX - X)</option>
                      <option value="Senior Secondary - Science (Class XI - XII)">Senior Secondary — Science Faculty (PCM / PCB)</option>
                      <option value="Senior Secondary - Commerce (Class XI - XII)">Senior Secondary — Commerce Faculty</option>
                      <option value="Senior Secondary - Humanities (Class XI - XII)">Senior Secondary — Humanities Faculty</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="home-message">
                      Specific Query / Custom Problem (Optional)
                    </label>
                    <textarea
                      id="home-message"
                      className="form-textarea"
                      placeholder="Mention any specific problem, transport route, syllabus query, or assistance needed..."
                      value={inquiryData.message}
                      onChange={(e) => setInquiryData({ ...inquiryData, message: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`btn-academic btn-academic-brass ${isSubmitting ? 'btn-submit-loading' : ''}`}
                    style={{ width: '100%', padding: '1rem', marginTop: '0.5rem' }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="spinner-icon" style={{ marginRight: '0.5rem' }} />
                        Recording Official Registration...
                      </>
                    ) : (
                      <>
                        <Send size={16} style={{ marginRight: '0.5rem' }} />
                        Submit Official Admission Enquiry
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal for Photo Gallery Preview */}
      {activePhoto && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(7, 18, 36, 0.92)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
          onClick={() => setActivePhoto(null)}
        >
          <div
            style={{
              maxWidth: '900px',
              width: '100%',
              backgroundColor: '#ffffff',
              border: '2px solid var(--color-brass)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activePhoto.image || NEUTRAL_PLACEHOLDER_IMAGE}
              alt={activePhoto.title || 'Mother Teresa Academy'}
              style={{ width: '100%', maxHeight: '65vh', objectFit: 'cover', display: 'block' }}
              onError={(e) => {
                if (e.target.src !== NEUTRAL_PLACEHOLDER_IMAGE) {
                  e.target.src = NEUTRAL_PLACEHOLDER_IMAGE;
                }
              }}
            />
            <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-parchment-white)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--color-navy)' }}>
                  {activePhoto.title}
                </h3>
                <button
                  type="button"
                  onClick={() => setActivePhoto(null)}
                  style={{
                    background: 'none',
                    border: '1px solid var(--bg-paper-rule)',
                    padding: '0.4rem 0.8rem',
                    cursor: 'pointer',
                    fontWeight: '600',
                  }}
                >
                  Close [ESC]
                </button>
              </div>
              <p style={{ marginTop: '0.5rem', fontSize: '0.92rem', color: 'var(--ink-secondary)' }}>
                {activePhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
