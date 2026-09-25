/**
 * MOTHER TERESA ACADEMY - CONTENT DATA LAYER ABSTRACTION
 * 
 * This file serves as the single source of truth for all site content.
 * Currently uses localStorage for persistent mock storage so that edits
 * survive browser refreshes and tab reloads.
 * 
 * ============================================================================
 * HANDOFF NOTE FOR DEVELOPER (FIREBASE FIRESTORE INTEGRATION):
 * ============================================================================
 * To connect this to real Firebase Firestore, follow these steps:
 * 
 * 1. Initialize Firebase in a new file `src/lib/firebase.js`:
 *    import { initializeApp } from 'firebase/app';
 *    import { getFirestore } from 'firebase/firestore';
 *    const app = initializeApp({ ...yourFirebaseConfig });
 *    export const db = getFirestore(app);
 * 
 * 2. In this file:
 *    - Replace `loadInitialContent` / `saveAllContent` with Firestore `getDoc` / `setDoc`:
 *      import { doc, getDoc, setDoc } from 'firebase/firestore';
 *      import { db } from './firebase';
 * 
 *    - To fetch content:
 *      export async function getAllContent() {
 *        const snap = await getDoc(doc(db, 'site_content', 'main'));
 *        return snap.exists() ? snap.data() : defaultContent;
 *      }
 * 
 *    - To save content:
 *      export async function saveAllContent(contentMap) {
 *        await setDoc(doc(db, 'site_content', 'main'), contentMap, { merge: true });
 *      }
 * ============================================================================
 */

import { schoolData } from '../data/schoolData.js';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase.js';

const STORAGE_KEY = 'mta_cms_site_content_v2';
export const FIRESTORE_COLLECTION = 'site_content';
export const FIRESTORE_DOC_ID = 'main';

/**
 * Helper to identify corrupted/unwanted placeholder strings
 */
function isInvalidPlaceholder(val) {
  if (typeof val === 'string') {
    const s = val.trim().toLowerCase();
    return s.includes('to be added') || s.includes('[—') || s.includes('[--') || s === '[— to be added]' || s.includes('[-');
  }
  return false;
}

// Comprehensive default content model initialized from schoolData and page-level copy
export const defaultContent = {
  // Hero & Homepage Opening
  hero: {
    badge: "CBSE Senior Secondary Co-Educational Institution",
    headline: "Mother Teresa Academy",
    motto: "Your Child Is Our Concern",
    location: "Baraut, District Baghpat, Uttar Pradesh",
    backgroundImage: "/gallery/main-campus-facade-daylight.jpg",
  },

  // "The Spirit of Mother Teresa Academy" Story Section
  spirit: {
    subhead: "Institutional Heritage & Foundation",
    title: "The Spirit of Mother Teresa Academy",
    lead: "Founded with the enduring vision of Saint Mother Teresa’s selfless dedication, Mother Teresa Academy stands as a premier seat of school education along Chhaprauli Road in Baraut, Western Uttar Pradesh—synthesizing rigorous CBSE academic discipline with a profound moral conscience.",
    paragraph: "Our pedagogical framework balances scholastic distinction with character formation. Pupils are guided from formative curiosity towards scholarly mastery—fostering bilingual eloquence, experimental science inquiry in dedicated laboratories, and athletic vigor on our tournament grounds.",
    pullquote: "Not all of us can do great things. But we can do small things with great love.",
    pullquoteAuthor: "— Saint Mother Teresa, Institutional Patron",
    locationQuickRef: "Baraut, Baghpat (U.P.)",
    affiliationQuickRef: "CBSE Senior Secondary (K–XII)",
    establishedQuickRef: "2015",
    mottoQuickRef: "\"Laborare est Orare\"",
    mission: schoolData.about.missionStatement,
    vision: schoolData.about.visionStatement,
  },

  // Cornerstones Cards (6 Key Pillars)
  cornerstones: [
    {
      id: "cbse-academic",
      title: "CBSE Academic Excellence",
      description: "Affiliated with the Central Board of Secondary Education (Affiliation No. 2134272, School Code 61658), offering Senior Secondary Science, Commerce, and Humanities faculties with dedicated focus on NCERT benchmarks.",
      linkText: "View 3-Year Board Results & Streams",
      linkUrl: "/academics",
      image: "/gallery/chemistry-lab-titration.jpg",
    },
    {
      id: "best-infrastructure",
      title: "Best-in-Class Infrastructure",
      description: "Dedicated physics, chemistry, biology, and composite science laboratories with Ohm's law apparatus, 3D mathematics models, high-speed IT terminals, and 15 smart classrooms across our 6,275 sq.m. campus.",
      linkText: "Explore Campus Estates & Labs",
      linkUrl: "/infrastructure",
      image: "/science-maths-composite-lab.jpg",
    },
    {
      id: "student-leadership",
      title: "Student Leadership & Houses",
      description: "An active Prefectorial Board led by Head Boy and Head Girl, instilling civic responsibility and democratic leadership across our four distinguished houses: Teresa, Vivekananda, Kalam, and Tagore.",
      linkText: "Meet Faculty & Prefects",
      linkUrl: "/staff",
      image: "/gallery/championship-trophy-presentation.jpg",
    },
    {
      id: "sports-vigor",
      title: "Sports & Physical Vigor",
      description: "Tournament-grade mat arena for high-intensity Inter-House Kabaddi championships, cricket practice nets, basketball arena, athletic sprint tracks, morning yoga, and physical self-defense training.",
      linkText: "View Sports Facilities",
      linkUrl: "/infrastructure",
      image: "/kabaddi-sports-tournament.jpg",
    },
    {
      id: "co-curricular",
      title: "Co-Curricular & Arts",
      description: "Robotics and STEM tinkering club, bilingual debating society (Hindi & English), classical music choir, environmental eco-warriors, and visual arts studios fostering holistic individual creativity.",
      linkText: "Discover Co-Curricular Life",
      linkUrl: "/about",
      image: "/gallery/cultural-celebrations-diya-lighting.jpg",
    },
    {
      id: "cbse-disclosure",
      title: "CBSE Mandatory Disclosure",
      description: "Complete institutional transparency under CBSE Appendix-IX norms. Complete publication of building safety, fire safety, recognition certificates, and academic governance registers.",
      linkText: "Access Statutory Appendix-IX",
      linkUrl: "/cbse-disclosure",
      image: "/campus-facade.jpg",
    },
  ],

  // News & Upcoming Events Section Background Photo
  newsEvents: {
    backgroundImage: "/news-events-campus.jpg",
  },

  // Four Institutional Houses
  houses: schoolData.studentLeadership.houses,

  // General School Contact Info with concrete verified values
  general: {
    ...schoolData.general,
    affiliationNo: schoolData.general.affiliationNo || '2134272',
    schoolCode: schoolData.general.schoolCode || '61658',
    establishedYear: schoolData.general.establishedYear || '2015',
    phonePrimary: schoolData.general.phonePrimary || '+91 95576 67999',
    phoneSecondary: schoolData.general.phoneSecondary || '+91 70175 51638',
    whatsappNumber: schoolData.general.whatsappNumber || '+91 95576 67999',
    emailPrimary: schoolData.general.emailPrimary || 'motherteresaacademybaraut@gmail.com',
    emailAdmissions: schoolData.general.emailAdmissions || 'motherteresaacademybaraut@gmail.com',
    website: schoolData.general.website || 'www.motherteresaacademy.edu.in',
    youtubeUrl: schoolData.general.youtubeUrl || 'https://www.youtube.com/@motherteresaacademy7598',
  },

  // About Section Detailed Content
  about: schoolData.about,

  // Academics (Overview, Streams, Results)
  academics: schoolData.academics,

  // Staff (Leadership, Cadres, Metrics, Assembly Photo)
  staff: {
    ...schoolData.staff,
    assemblyPhoto: "/faculty-cbp-training.jpg",
  },

  // Infrastructure (Metrics, Sanitation)
  infrastructure: {
    campusOverview: schoolData.infrastructure.campusOverview,
    metrics: schoolData.infrastructure.metrics,
    sanitation: schoolData.infrastructure.sanitation,
  },

  // CBSE Mandatory Appendix-IX Disclosure
  cbseDisclosure: schoolData.cbseDisclosure,

  // Statutory Disclosure Certificates & Documents (PDFs & Photos)
  disclosureDocuments: schoolData.disclosureDocuments || [],

  // Official Fee Structure Breakdown
  feeStructure: schoolData.feeStructure || [],

  // Notice Board items
  notices: schoolData.notices.map((notice) => ({
    ...notice,
    isPublished: true,
    bodyContent: "",
    pdfUrl: "",
  })),

  // Campus Photo Gallery
  gallery: schoolData.infrastructure.gallery.map((item) => ({
    ...item,
    isVisible: true,
  })),

  // Dynamic Custom Pages created via Admin Panel
  customPages: [],

  // Security configuration (Admin PIN lock)
  security: {
    adminPin: '2015',
  },
};

/**
 * Deep merges source object into target object so partial edits never
 * wipe out sibling fields or nested arrays.
 */
export function deepMerge(target, source) {
  if (!source) return target;
  if (!target) return source;

  const isObject = (item) => item && typeof item === 'object' && !Array.isArray(item);

  if (Array.isArray(target) && Array.isArray(source)) {
    if (source.length === 0) return target;
    return source.map((srcItem, idx) => {
      const tgtItem = target[idx];
      if (isObject(tgtItem) && isObject(srcItem)) {
        return deepMerge(tgtItem, srcItem);
      }
      if (isInvalidPlaceholder(srcItem)) return tgtItem;
      return (srcItem !== undefined && srcItem !== null && srcItem !== '') ? srcItem : tgtItem;
    });
  }

  if (isObject(target) && isObject(source)) {
    const output = { ...target };
    for (const key of Object.keys(source)) {
      const srcVal = source[key];
      const tgtVal = target[key];

      if (isObject(tgtVal) && isObject(srcVal)) {
        output[key] = deepMerge(tgtVal, srcVal);
      } else if (Array.isArray(tgtVal) && Array.isArray(srcVal)) {
        output[key] = deepMerge(tgtVal, srcVal);
      } else if (isInvalidPlaceholder(srcVal)) {
        output[key] = tgtVal;
      } else if (srcVal !== undefined && srcVal !== null && srcVal !== '') {
        output[key] = srcVal;
      } else if (tgtVal !== undefined) {
        output[key] = tgtVal;
      }
    }
    return output;
  }

  if (isInvalidPlaceholder(source)) return target;
  return (source !== undefined && source !== null && source !== '') ? source : target;
}

/**
 * Loads content from persistent storage (or fallback default content).
 * Uses recursive deepMerge to safeguard against partial overwrites.
 * @returns {Object} Site content tree
 */
export function loadContent() {
  try {
    // Clear legacy v1 storage key if present to purge stale placeholder drafts
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem('mta_cms_site_content_v1');
      }
    } catch (e) {}

    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (!raw) return defaultContent;
    const parsed = JSON.parse(raw);
    return deepMerge(defaultContent, parsed);
  } catch (err) {
    console.warn('Failed to parse CMS content from localStorage, falling back to defaults', err);
    return defaultContent;
  }
}

/**
 * Gets a specific content property using dot notation (e.g. 'hero.headline').
 * Returns fallback if property is undefined, null, or empty string.
 * @param {string} path Dot-separated path
 * @param {any} fallback Fallback if property is missing
 * @returns {any} Content value
 */
export function getContent(path, fallback = '') {
  const content = loadContent();
  return getNestedValue(content, path, fallback);
}

/**
 * Updates a specific key/value pair in content and persists to storage.
 * @param {string} path Dot-separated path
 * @param {any} value New value
 * @returns {Promise<void>}
 */
export async function updateContent(path, value) {
  const current = loadContent();
  const updated = setNestedValue({ ...current }, path, value);
  await saveAllContent(updated);
}

/**
 * Fetches the latest published content from Cloud Firestore.
 * Automatically deep-merges with factory defaults and caches in localStorage.
 * @returns {Promise<Object>} The resolved content model
 */
export async function fetchContentFromCloud() {
  try {
    const docRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const cloudData = snap.data();
      const merged = deepMerge(defaultContent, cloudData);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } catch (err) {
        console.warn('LocalStorage cache write error:', err);
      }
      return merged;
    } else {
      // First time initialization: seed Firestore with default school content
      try {
        await setDoc(docRef, defaultContent, { merge: true });
      } catch (e) {
        console.warn('Could not auto-seed Firestore default content:', e);
      }
      return loadContent();
    }
  } catch (err) {
    console.warn('Could not fetch content from Firestore, using local cache:', err);
    return loadContent();
  }
}

/**
 * Subscribes to real-time content changes from Cloud Firestore.
 * When an admin publishes new content, all connected browsers update instantly.
 * @param {Function} callback Callback with latest content
 * @param {Function} onError Error callback
 * @returns {Function} Unsubscribe function
 */
export function subscribeToContent(callback, onError) {
  try {
    const docRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);
    return onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          const cloudData = snap.data();
          const merged = deepMerge(defaultContent, cloudData);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          } catch (e) {
            console.warn('LocalStorage cache write error:', e);
          }
          callback(merged);
        }
      },
      (error) => {
        console.warn('Firestore real-time subscription error:', error);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.warn('Failed to attach Firestore snapshot listener:', err);
    return () => {};
  }
}

/**
 * Saves entire content map to persistent storage (both LocalStorage cache and Cloud Firestore).
 * @param {Object} contentMap Entire content model
 * @returns {Promise<void>}
 */
export async function saveAllContent(contentMap) {
  try {
    // 1. Immediately cache in localStorage for instant local responsiveness
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contentMap));
    window.dispatchEvent(new CustomEvent('mta_cms_content_updated', { detail: contentMap }));

    // 2. Persist to Cloud Firestore so all visitors across the world see it on the live site
    const docRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);
    await setDoc(docRef, contentMap, { merge: true });
  } catch (err) {
    console.error('Failed to save CMS content to Firestore/storage', err);
    throw err;
  }
}

/**
 * Resets all content back to factory defaults.
 * @returns {Promise<void>}
 */
export async function resetContent() {
  localStorage.removeItem(STORAGE_KEY);
  try {
    const docRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);
    await setDoc(docRef, defaultContent);
  } catch (e) {
    console.warn('Failed to reset Firestore content:', e);
  }
  window.dispatchEvent(new CustomEvent('mta_cms_content_updated', { detail: defaultContent }));
}

// Internal path helpers
export function getNestedValue(obj, path, fallback = '') {
  if (!obj || !path) return fallback;
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current === undefined || current === null) return fallback;
    current = current[part];
  }
  if (current === undefined || current === null) return fallback;
  if (typeof current === 'string') {
    const s = current.trim().toLowerCase();
    if (s === '' || s.includes('to be added') || s.includes('[—') || s.includes('[--') || s === '[— to be added]') {
      return fallback;
    }
  }
  return current;
}

export function setNestedValue(obj, path, value) {
  const parts = path.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!current[part] || typeof current[part] !== 'object') {
      current[part] = {};
    }
    current = current[part];
  }
  current[parts[parts.length - 1]] = value;
  return obj;
}

