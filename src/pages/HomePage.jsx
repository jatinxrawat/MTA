import React, { useState } from 'react';
import Hero from '../components/Hero';
import { Link } from 'react-router-dom';
import { schoolData } from '../data/schoolData';
import { useScrollReveal } from '../hooks/useScrollReveal';
import '../styles/home.css';

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
} from 'lucide-react';

export default function HomePage() {
  const { name, postalAddress, phonePrimary, phoneSecondary, emailPrimary, emailAdmissions, officeHours, visitingHoursPrincipal } =
    schoolData.general;
  const { notices, newsAndEvents, studentLeadership, sports, coCurricular, infrastructure } = schoolData;

  // Scroll reveal observers for each section
  const [noticesRef, noticesRevealed] = useScrollReveal();
  const [cornerstonesRef, cornerstonesRevealed] = useScrollReveal();
  const [housesRef, housesRevealed] = useScrollReveal();
  const [galleryRef, galleryRevealed] = useScrollReveal();
  const [eventsRef, eventsRevealed] = useScrollReveal();

  // Filter state for notice board
  const [noticeFilter, setNoticeFilter] = useState('All');
  const [showAllNotices, setShowAllNotices] = useState(false);

  // Lightbox state for gallery preview
  const [activePhoto, setActivePhoto] = useState(null);

  // Home page quick inquiry form state
  const [inquiryData, setInquiryData] = useState({
    parentName: '',
    phone: '',
    grade: 'Class XI - Science',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setInquirySubmitted(true);
    }, 450);
  };

  const filteredNotices =
    noticeFilter === 'All'
      ? notices
      : notices.filter((n) => n.category.toLowerCase().includes(noticeFilter.toLowerCase()));

  // 4-5 notices displayed compactly unless user expands
  const displayedNotices = showAllNotices ? filteredNotices : filteredNotices.slice(0, 4);

  // Exactly 6 photos for preview
  const galleryPreviewPhotos = infrastructure.gallery.slice(0, 6);

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
                <span className="prospectus-subhead">Institutional Heritage & Foundation</span>
                <h2 className="prospectus-title about-column-heading">
                  The Spirit of Mother Teresa Academy
                </h2>
                <div className="prospectus-rule" style={{ margin: '0.65rem 0 1.15rem' }}>
                  <span className="prospectus-rule-gem" />
                </div>
              </header>

              <div className="about-prospectus-body">
                <p className="about-prospectus-lead">
                  Founded with the enduring vision of Saint Mother Teresa’s selfless dedication, Mother Teresa Academy stands as a premier seat of school education along Baghpat Road in Baraut, Western Uttar Pradesh—synthesizing rigorous CBSE academic discipline with a profound moral conscience.
                </p>

                <p className="about-prospectus-para">
                  Our pedagogical framework balances scholastic distinction with character formation. Pupils are guided from formative curiosity towards scholarly mastery—fostering bilingual eloquence, experimental science inquiry in dedicated laboratories, and athletic vigor on our tournament grounds.
                </p>

                {/* Compact Pull-Quote Treatment */}
                <blockquote className="editorial-pullquote about-column-pullquote">
                  "Not all of us can do great things. But we can do small things with great love."
                  <footer className="about-pullquote-footer">
                    — Saint Mother Teresa, Institutional Patron
                  </footer>
                </blockquote>

                {/* Compact Quick Reference Block */}
                <div className="prospectus-quick-reference">
                  <div className="quick-ref-item">
                    <span className="quick-ref-label">Location</span>
                    <strong className="quick-ref-val">Baraut, Baghpat (U.P.)</strong>
                  </div>
                  <div className="quick-ref-item">
                    <span className="quick-ref-label">Affiliation</span>
                    <strong className="quick-ref-val">CBSE Senior Secondary (K–XII)</strong>
                  </div>
                  <div className="quick-ref-item">
                    <span className="quick-ref-label">Established</span>
                    <strong className="quick-ref-val">2015</strong>
                  </div>
                  <div className="quick-ref-item">
                    <span className="quick-ref-label">Motto</span>
                    <strong className="quick-ref-val">"Laborare est Orare"</strong>
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
                <ul ref={noticesRef} className="notice-list">
                  {displayedNotices.map((item, idx) => (
                    <li
                      key={item.id}
                      className={`notice-item scroll-reveal-item ${noticesRevealed ? 'is-revealed' : ''}`}
                      style={{ '--reveal-delay': idx }}
                    >
                      <div className="notice-left">
                        {/* Simple Serif Date Treatment & Small Caps Category */}
                        <div className="notice-date-column">
                          <span className="notice-serif-date">{item.date}</span>
                          <span className="notice-category-caps">{item.category}</span>
                        </div>

                        <div className="notice-title-wrap">
                          <h4 className="notice-title-text">
                            {item.title}
                            {item.isNew && <span className="notice-new-badge">NEW</span>}
                          </h4>
                        </div>
                      </div>

                      {item.ref.startsWith('/') ? (
                        <Link to={item.ref} className="notice-action-link" title={item.linkText}>
                          <FileText size={14} />
                          <span>{item.linkText}</span>
                        </Link>
                      ) : (
                        <a href={item.ref} className="notice-action-link" title={item.linkText}>
                          <Download size={14} />
                          <span>{item.linkText}</span>
                        </a>
                      )}
                    </li>
                  ))}
                </ul>

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
      <section className="section-padding section-parchment" aria-label="School Highlights">
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
              className={`pillar-feature-card scroll-reveal-item ${cornerstonesRevealed ? 'is-revealed' : ''}`}
              style={{ '--reveal-delay': 0 }}
            >
              <div className="pillar-card-icon" style={{ backgroundColor: '#edf2fb', color: 'var(--color-navy)' }}>
                <GraduationCap size={26} />
              </div>
              <h3 className="pillar-card-title">CBSE Academic Excellence</h3>
              <p className="pillar-card-desc">
                Affiliated with the Central Board of Secondary Education, offering Senior Secondary Science, Commerce, and Humanities faculties with dedicated focus on NCERT benchmarks and national competitive exam readiness.
              </p>
              <Link to="/academics" className="pillar-card-link">
                <span>View 3-Year Board Results & Streams</span>
                <ChevronRight size={16} />
              </Link>
            </article>

            {/* Pillar 2: Best Campus Infrastructure */}
            <article
              className={`pillar-feature-card scroll-reveal-item ${cornerstonesRevealed ? 'is-revealed' : ''}`}
              style={{ '--reveal-delay': 1 }}
            >
              <div className="pillar-card-icon" style={{ backgroundColor: '#fff8eb', color: 'var(--color-brass-deep)' }}>
                <Building2 size={26} />
              </div>
              <h3 className="pillar-card-title">Best-in-Class Infrastructure</h3>
              <p className="pillar-card-desc">
                Dedicated physics and composite science laboratories with Ohm's law apparatus, 3D mathematics geometric models, high-speed IT terminals, and spacious smart classrooms across our central lawn campus.
              </p>
              <Link to="/infrastructure" className="pillar-card-link">
                <span>Explore Campus Estates & Labs</span>
                <ChevronRight size={16} />
              </Link>
            </article>

            {/* Pillar 3: Student Leadership & Houses */}
            <article
              className={`pillar-feature-card scroll-reveal-item ${cornerstonesRevealed ? 'is-revealed' : ''}`}
              style={{ '--reveal-delay': 2 }}
            >
              <div className="pillar-card-icon" style={{ backgroundColor: '#fcf0f2', color: 'var(--color-maroon)' }}>
                <Users size={26} />
              </div>
              <h3 className="pillar-card-title">Student Leadership & Houses</h3>
              <p className="pillar-card-desc">
                An active Prefectorial Board led by Head Boy and Head Girl, instilling civic responsibility and democratic leadership across our four distinguished houses: Teresa, Vivekananda, Kalam, and Tagore.
              </p>
              <Link to="/staff" className="pillar-card-link">
                <span>Meet Faculty & Prefects</span>
                <ChevronRight size={16} />
              </Link>
            </article>

            {/* Pillar 4: Sports & Athletics */}
            <article
              className={`pillar-feature-card scroll-reveal-item ${cornerstonesRevealed ? 'is-revealed' : ''}`}
              style={{ '--reveal-delay': 3 }}
            >
              <div className="pillar-card-icon" style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}>
                <Trophy size={26} />
              </div>
              <h3 className="pillar-card-title">Sports & Physical Vigor</h3>
              <p className="pillar-card-desc">
                Tournament-grade mat arena for high-intensity Inter-House Kabaddi championships, cricket practice nets, basketball arena, athletic sprint tracks, morning yoga, and physical self-defense training.
              </p>
              <Link to="/infrastructure" className="pillar-card-link">
                <span>View Sports Facilities</span>
                <ChevronRight size={16} />
              </Link>
            </article>

            {/* Pillar 5: Co-Curricular & Creative Clubs */}
            <article
              className={`pillar-feature-card scroll-reveal-item ${cornerstonesRevealed ? 'is-revealed' : ''}`}
              style={{ '--reveal-delay': 4 }}
            >
              <div className="pillar-card-icon" style={{ backgroundColor: '#f3e5f5', color: '#6a1b9a' }}>
                <Palette size={26} />
              </div>
              <h3 className="pillar-card-title">Co-Curricular & Arts</h3>
              <p className="pillar-card-desc">
                Robotics and STEM tinkering club, bilingual debating society (Hindi & English), classical music choir, environmental eco-warriors, and visual arts studios fostering holistic individual creativity.
              </p>
              <Link to="/about" className="pillar-card-link">
                <span>Discover Co-Curricular Life</span>
                <ChevronRight size={16} />
              </Link>
            </article>

            {/* Pillar 6: CBSE Appendix-IX Public Disclosure */}
            <article
              className={`pillar-feature-card scroll-reveal-item ${cornerstonesRevealed ? 'is-revealed' : ''}`}
              style={{ '--reveal-delay': 5, borderTopColor: 'var(--color-maroon)' }}
            >
              <div className="pillar-card-icon" style={{ backgroundColor: 'var(--color-maroon-soft)', color: 'var(--color-maroon)' }}>
                <ShieldCheck size={26} />
              </div>
              <h3 className="pillar-card-title">CBSE Mandatory Disclosure</h3>
              <p className="pillar-card-desc">
                Complete institutional transparency under CBSE Appendix-IX norms. Complete publication of building safety, fire safety, recognition certificates, and academic governance registers.
              </p>
              <Link to="/cbse-disclosure" className="pillar-card-link" style={{ color: 'var(--color-maroon)' }}>
                <span>Access Statutory Appendix-IX</span>
                <ChevronRight size={16} />
              </Link>
            </article>
          </div>

          {/* Four Noble Houses Showcase: Fade up on scroll with subtle continuous 2-3px bobbing icons */}
          <div style={{ marginTop: '4.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--color-navy-deep)', textAlign: 'center', marginBottom: '0.5rem' }}>
              The Four Institutional Houses
            </h3>
            <p style={{ textAlign: 'center', color: 'var(--ink-muted)', fontSize: '0.92rem', marginBottom: '1.75rem' }}>
              Every scholar belongs to a house, participating in weekly academic debates, sports derbies, and cultural competitions.
            </p>

            <div ref={housesRef} className="houses-strip">
              {studentLeadership.houses.map((house, idx) => {
                const houseClass = `house-${house.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
                return (
                  <div
                    key={idx}
                    className={`house-item-box ${houseClass} scroll-reveal-item ${housesRevealed ? 'is-revealed' : ''}`}
                    style={{ '--house-color': house.color, '--reveal-delay': idx }}
                  >
                  <span className="house-bob-icon" style={{ fontSize: '1.8rem' }} role="img" aria-label={house.name}>
                    {house.icon}
                  </span>
                  <h4 className="house-name">{house.name}</h4>
                  <p className="house-motto">"{house.motto}"</p>
                </div>
              );
            })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. OUR GALLERY: 6 PHOTO PREVIEW + "VIEW FULL GALLERY" BUTTON */}
      <section id="home-gallery" className="section-padding" aria-label="Campus Photo Gallery">
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
          <div ref={galleryRef} className="gallery-grid">
            {galleryPreviewPhotos.map((photo, idx) => (
              <figure
                key={idx}
                className={`gallery-item scroll-reveal-item ${galleryRevealed ? 'is-revealed' : ''}`}
                style={{ '--reveal-delay': idx, cursor: 'pointer' }}
                onClick={() => setActivePhoto(photo)}
              >
                <div className="gallery-image-wrapper">
                  <img
                    src={photo.image}
                    alt={photo.title}
                    className="gallery-image"
                    loading="lazy"
                  />
                </div>
                <figcaption className="gallery-caption-box">
                  <h4 className="gallery-title">{photo.title}</h4>
                  <p className="gallery-desc">{photo.caption}</p>
                </figcaption>
              </figure>
            ))}
          </div>

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

      {/* 5. NEWS & UPCOMING EVENTS: Stagger in on scroll with hover border transitions */}
      <section id="news-events" className="section-padding section-parchment" aria-label="News and Upcoming Events">
        <div className="container">
          <header className="editorial-section-header text-center">
            <span className="prospectus-subhead">Campus Life & Calendar</span>
            <h2 className="prospectus-title">News & Upcoming Events</h2>
            <div className="prospectus-rule centered">
              <span className="prospectus-rule-gem" />
            </div>
          </header>

          <div ref={eventsRef} className="events-grid">
            {newsAndEvents.map((event, idx) => (
              <article
                key={event.id}
                className={`event-card scroll-reveal-item ${eventsRevealed ? 'is-revealed' : ''}`}
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
            ))}
          </div>
        </div>
      </section>

      {/* 6. CONNECT WITH US / GET IN TOUCH */}
      <section id="connect" className="section-padding" aria-label="Connect With Us">
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
              <div className="contact-item-group">
                <div className="contact-item-header">
                  <MapPin size={22} className="contact-icon" />
                  <h3 className="contact-label">Campus Location</h3>
                </div>
                <p className="contact-val">
                  <strong>Mother Teresa Academy</strong>
                  <br />
                  {postalAddress}
                  <br />
                  Baraut, Western Uttar Pradesh, India
                </p>
              </div>

              <div className="contact-item-group">
                <div className="contact-item-header">
                  <Phone size={22} className="contact-icon" />
                  <h3 className="contact-label">Telephonic Helplines</h3>
                </div>
                <p className="contact-val">
                  Administration Office: {phonePrimary}
                  <br />
                  Admissions Cell: {phoneSecondary}
                </p>
              </div>

              <div className="contact-item-group">
                <div className="contact-item-header">
                  <Mail size={22} className="contact-icon" />
                  <h3 className="contact-label">Electronic Mail</h3>
                </div>
                <p className="contact-val">
                  General Desk: {emailPrimary}
                  <br />
                  Admissions: {emailAdmissions}
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
                Academic Session 2025–26 Enquiry
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--ink-muted)', marginBottom: '2rem' }}>
                Fill out the credentials below to receive the official prospectus, syllabus schedule, and admission test dates.
              </p>

              {inquirySubmitted ? (
                <div style={{ backgroundColor: 'var(--bg-parchment-white)', border: '1px solid var(--color-brass)', padding: '2.5rem', textAlign: 'center' }}>
                  <CheckCircle size={42} style={{ color: '#2e7d32', margin: '0 auto 1rem' }} />
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
                    Enquiry Registered Successfully
                  </h4>
                  <p style={{ fontSize: '0.95rem', color: 'var(--ink-secondary)' }}>
                    Thank you, <strong>{inquiryData.parentName}</strong>. Our admissions officer will contact <strong>{inquiryData.phone}</strong> shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setInquirySubmitted(false)}
                    className="btn-academic btn-academic-outline"
                    style={{ marginTop: '1.5rem' }}
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="home-parentName">
                      Parent / Guardian Full Name *
                    </label>
                    <input
                      type="text"
                      id="home-parentName"
                      required
                      className="form-input"
                      placeholder="e.g. Sh. Devendra Kumar"
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
                      placeholder="+91 98XXXXXXXX"
                      value={inquiryData.phone}
                      onChange={(e) => setInquiryData({ ...inquiryData, phone: e.target.value })}
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
              src={activePhoto.image}
              alt={activePhoto.title}
              style={{ width: '100%', maxHeight: '65vh', objectFit: 'cover', display: 'block' }}
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
