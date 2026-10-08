import React, { useState } from 'react';
import { schoolFaqs } from '../data/seoFaqs';
import { 
  ChevronDown, 
  HelpCircle, 
  Award, 
  CheckCircle2, 
  BookOpen, 
  GraduationCap, 
  FlaskConical, 
  Trophy, 
  Bus, 
  ShieldCheck 
} from 'lucide-react';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  const differentiators = [
    {
      icon: <GraduationCap size={24} className="diff-icon" />,
      title: "CBSE Senior Secondary Standard",
      desc: "Full curriculum benchmark up to Class XII offering rigorous Science (PCM/PCB), Commerce, and Humanities faculties under the National Curriculum Framework.",
    },
    {
      icon: <FlaskConical size={24} className="diff-icon" />,
      title: "Advanced Practical Laboratories",
      desc: "Dedicated Physics darkroom, Chemistry titration workstations, Biology specimen lab, and dual Computer Science labs with 1:1 student-PC ratio.",
    },
    {
      icon: <Trophy size={24} className="diff-icon" />,
      title: "Sprawling Sports Complex",
      desc: "Tournament-grade Kabaddi mat arena, 200m athletic track, basketball court, and cricket nets, having hosted CBSE Cluster XIX athletic meets.",
    },
    {
      icon: <BookOpen size={24} className="diff-icon" />,
      title: "Bilingual Eloquence & Character",
      desc: "Empowering scholars in both English and Hindi elocution, debates, and ethical leadership grounded in Saint Mother Teresa's compassionate ideals.",
    },
    {
      icon: <Bus size={24} className="diff-icon" />,
      title: "Safe Transport Across Baghpat",
      desc: "Comfortable and GPS-monitored bus routes connecting Baraut town, Chhaprauli, and surrounding Western UP rural corridors.",
    },
    {
      icon: <ShieldCheck size={24} className="diff-icon" />,
      title: "Transparent Governance & Safety",
      desc: "100% compliant with CBSE Appendix-IX Mandatory Public Disclosure, fire safety certifications, and child-safe CWSN campus architecture.",
    },
  ];

  return (
    <section 
      id="seo-faq-section" 
      className="section-padding section-parchment faq-educational-section" 
      aria-label="Frequently Asked Questions and School Comparison in Baraut"
    >
      <div className="container">
        {/* Section Header */}
        <header className="editorial-section-header text-center">
          <span className="prospectus-subhead">Baraut Educational Benchmark & FAQs</span>
          <h2 className="prospectus-title">Why MTA Ranks Among the Best Schools in Baraut</h2>
          <div className="prospectus-rule centered">
            <span className="prospectus-rule-gem" />
          </div>
          <p className="faq-section-lead text-center">
            Guiding parents and scholars evaluating top CBSE-affiliated Senior Secondary institutions in Baraut, District Baghpat, and Western Uttar Pradesh.
          </p>
        </header>

        {/* 6 Core Differentiator Cards */}
        <div className="baraut-differentiators-grid">
          {differentiators.map((diff, idx) => (
            <div key={idx} className="baraut-diff-card">
              <div className="diff-icon-wrapper">{diff.icon}</div>
              <h3 className="diff-title">{diff.title}</h3>
              <p className="diff-desc">{diff.desc}</p>
            </div>
          ))}
        </div>

        {/* FAQ Accordion Block */}
        <div className="faq-container-wrap">
          <div className="faq-intro-header">
            <div className="faq-badge-pill">
              <HelpCircle size={15} />
              <span>Parent Consultation & Admissions FAQ</span>
            </div>
            <h3 className="faq-block-heading">
              Frequently Asked Questions for Admissions in Baraut
            </h3>
            <p className="faq-block-sub">
              Everything you need to know about curriculum, admission eligibility, subject choices, and campus safety.
            </p>
          </div>

          <div className="faq-accordion-list" role="region" aria-label="Admissions and School FAQs">
            {schoolFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div 
                  key={idx} 
                  className={`faq-item-card ${isOpen ? 'faq-item-open' : ''}`}
                >
                  <button
                    type="button"
                    className="faq-question-btn"
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${idx}`}
                    id={`faq-question-${idx}`}
                  >
                    <div className="faq-question-text-wrap">
                      <span className="faq-category-tag">{faq.category}</span>
                      <span className="faq-question-title">{faq.question}</span>
                    </div>
                    <div className={`faq-chevron-icon ${isOpen ? 'chevron-rotated' : ''}`}>
                      <ChevronDown size={20} />
                    </div>
                  </button>

                  <div
                    id={`faq-answer-${idx}`}
                    role="region"
                    aria-labelledby={`faq-question-${idx}`}
                    className={`faq-answer-collapse ${isOpen ? 'show-answer' : ''}`}
                  >
                    <div className="faq-answer-inner">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
