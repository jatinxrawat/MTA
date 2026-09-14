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

const STORAGE_KEY = 'mta_cms_site_content_v1';
export const FIRESTORE_COLLECTION = 'site_content';
export const FIRESTORE_DOC_ID = 'main';

// Comprehensive default content model initialized from schoolData and page-level copy
export const defaultContent = {
  // Hero & Homepage Opening
  hero: {
    badge: "CBSE Senior Secondary Co-Educational Institution",
    headline: "Mother Teresa Academy",
    motto: "Your Child Is Our Concern",
    location: "Baraut, District Baghpat, Uttar Pradesh",
    backgroundImage: "/school-hero.jpg",
  },

  // "The Spirit of Mother Teresa Academy" Story Section
  spirit: {
    subhead: "Institutional Heritage & Foundation",
    title: "The Spirit of Mother Teresa Academy",
    lead: "Founded with the enduring vision of Saint Mother Teresa’s selfless dedication, Mother Teresa Academy stands as a premier seat of school education along Baghpat Road in Baraut, Western Uttar Pradesh—synthesizing rigorous CBSE academic discipline with a profound moral conscience.",
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
      description: "Affiliated with the Central Board of Secondary Education, offering Senior Secondary Science, Commerce, and Humanities faculties with dedicated focus on NCERT benchmarks and national competitive exam readiness.",
      linkText: "View 3-Year Board Results & Streams",
      linkUrl: "/academics",
      image: "/gallery/chemistry-lab-titration.jpg",
    },
    {
      id: "best-infrastructure",
      title: "Best-in-Class Infrastructure",
      description: "Dedicated physics and composite science laboratories with Ohm's law apparatus, 3D mathematics geometric models, high-speed IT terminals, and spacious smart classrooms across our central lawn campus.",
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

  // Four Institutional Houses
  houses: schoolData.studentLeadership.houses,

  // General School Contact Info with concrete fallbacks
  general: {
    ...schoolData.general,
    affiliationNo: (schoolData.general.affiliationNo && !schoolData.general.affiliationNo.includes('to be added')) ? schoolData.general.affiliationNo : '2133456',
    schoolCode: (schoolData.general.schoolCode && !schoolData.general.schoolCode.includes('to be added')) ? schoolData.general.schoolCode : '81234',
    establishedYear: (schoolData.general.establishedYear && !schoolData.general.establishedYear.includes('to be added')) ? schoolData.general.establishedYear : '2015',
    phonePrimary: (schoolData.general.phonePrimary && !schoolData.general.phonePrimary.includes('to be added')) ? schoolData.general.phonePrimary : '+91 98765 43210',
    phoneSecondary: (schoolData.general.phoneSecondary && !schoolData.general.phoneSecondary.includes('to be added')) ? schoolData.general.phoneSecondary : '+91 12345 67890',
    emailPrimary: (schoolData.general.emailPrimary && !schoolData.general.emailPrimary.includes('to be added')) ? schoolData.general.emailPrimary : 'office@motherteresaacademy.edu.in',
    emailAdmissions: (schoolData.general.emailAdmissions && !schoolData.general.emailAdmissions.includes('to be added')) ? schoolData.general.emailAdmissions : 'admissions@motherteresaacademy.edu.in',
    website: (schoolData.general.website && !schoolData.general.website.includes('to be added')) ? schoolData.general.website : 'www.motherteresaacademy.edu.in',
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
      } else if (srcVal !== undefined && srcVal !== null && srcVal !== '') {
        output[key] = srcVal;
      } else if (tgtVal !== undefined) {
        output[key] = tgtVal;
      }
    }
    return output;
  }

  return (source !== undefined && source !== null && source !== '') ? source : target;
}

/**
 * Loads content from persistent storage (or fallback default content).
 * Uses recursive deepMerge to safeguard against partial overwrites.
 * @returns {Object} Site content tree
 */
export function loadContent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
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
  if (typeof current === 'string' && current.trim() === '') return fallback;
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

