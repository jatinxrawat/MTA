/**
 * MOTHER TERESA ACADEMY - AUTHENTICATION LAYER ABSTRACTION
 * 
 * Provides session management for the school administration area (/admin).
 * Currently uses localStorage for mock session persistence.
 * 
 * ============================================================================
 * HANDOFF NOTE FOR DEVELOPER (FIREBASE AUTH INTEGRATION):
 * ============================================================================
 * To connect this to real Firebase Authentication, follow these steps:
 * 
 * 1. Initialize Firebase Auth in `src/lib/firebase.js`:
 *    import { getAuth } from 'firebase/auth';
 *    export const auth = getAuth(app);
 * 
 * 2. In this file, replace the mock functions with Firebase Auth methods:
 *    import { 
 *      signInWithEmailAndPassword, 
 *      signOut, 
 *      onAuthStateChanged as firebaseOnAuthChanged 
 *    } from 'firebase/auth';
 *    import { auth } from './firebase';
 * 
 *    export async function login(email, password) {
 *      const userCred = await signInWithEmailAndPassword(auth, email, password);
 *      return {
 *        id: userCred.user.uid,
 *        email: userCred.user.email,
 *        displayName: userCred.user.displayName || "Staff Member",
 *        role: "admin",
 *      };
 *    }
 * 
 *    export async function logout() {
 *      await signOut(auth);
 *    }
 * 
 *    export function onAuthStateChanged(callback) {
 *      return firebaseOnAuthChanged(auth, (user) => {
 *        if (user) {
 *          callback({ id: user.uid, email: user.email, role: 'admin' });
 *        } else {
 *          callback(null);
 *        }
 *      });
 *    }
 * ============================================================================
 */

const SESSION_KEY = 'mta_cms_auth_session_v1';

// Default staff credentials for demo / local access
export const DEMO_ADMIN_CREDENTIALS = {
  email: 'admin@motherteresaacademy.edu.in',
  password: 'mta', // Simple staff password for ease of access
  name: 'Staff Administrator',
  role: 'admin',
};

/**
 * Logs in a staff administrator.
 * @param {string} email Staff email
 * @param {string} password Staff password
 * @returns {Promise<Object>} Logged-in user object
 */
export async function login(email, password) {
  // Simulate network latency (200ms)
  await new Promise((res) => setTimeout(res, 200));

  const cleanEmail = (email || '').trim().toLowerCase();
  
  // Allow demo credentials or any email containing 'admin' or 'mta' with password 'mta'
  const isValid = 
    (cleanEmail === DEMO_ADMIN_CREDENTIALS.email && password === DEMO_ADMIN_CREDENTIALS.password) ||
    ((cleanEmail.includes('admin') || cleanEmail.includes('staff')) && (password === 'mta' || password === 'admin123'));

  if (!isValid) {
    throw new Error('Invalid staff email or password. Hint: Use admin@motherteresaacademy.edu.in with password: mta');
  }

  const user = {
    id: 'staff-admin-01',
    email: cleanEmail,
    displayName: cleanEmail.includes('admin') ? 'Senior Administrator' : 'Staff Editor',
    role: 'admin',
    loginTimestamp: new Date().toISOString(),
  };

  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    window.dispatchEvent(new CustomEvent('mta_cms_auth_changed', { detail: user }));
  } catch (err) {
    console.error('Failed to store auth session', err);
  }

  return user;
}

/**
 * Logs out the current administrator.
 * @returns {Promise<void>}
 */
export async function logout() {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new CustomEvent('mta_cms_auth_changed', { detail: null }));
}

/**
 * Retrieves the currently logged-in user synchronously.
 * @returns {Object|null}
 */
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Listens for auth state transitions.
 * @param {Function} callback (user | null) => void
 * @returns {Function} Unsubscribe cleanup function
 */
export function onAuthStateChanged(callback) {
  callback(getCurrentUser());

  const listener = (event) => {
    callback(event.detail);
  };

  window.addEventListener('mta_cms_auth_changed', listener);
  return () => window.removeEventListener('mta_cms_auth_changed', listener);
}
