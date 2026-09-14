/**
 * MOTHER TERESA ACADEMY - SECURITY & AUTHENTICATION LAYER
 * 
 * Provides in-memory PIN verification and session management for the school CMS.
 * 
 * IMPORTANT REQUIREMENT:
 * - NO SESSION CACHING: Authentication state is strictly held in memory.
 * - On every browser reload, tab close, or navigation return, the PIN prompt is required.
 * - The security PIN itself is stored persistently in Cloud Firestore (and locally)
 *   so the administrator can change it anytime from inside the admin panel.
 */

// In-memory session holder (ZERO persistence across page reloads/refreshes)
let inMemoryUser = null;

// Storage key for persistent PIN setting (the PIN itself, NOT the login session)
const PIN_STORAGE_KEY = 'mta_admin_pin_setting';

// Initial factory default PIN
export const DEFAULT_ADMIN_PIN = '2015';

/**
 * Retrieves the currently saved PIN setting (fallback before Firestore loads).
 * @returns {string} The active PIN string
 */
export function getStoredPin() {
  try {
    const pin = localStorage.getItem(PIN_STORAGE_KEY);
    return pin ? String(pin).trim() : DEFAULT_ADMIN_PIN;
  } catch {
    return DEFAULT_ADMIN_PIN;
  }
}

/**
 * Persists the PIN setting to local storage as fallback.
 * @param {string} newPin
 */
export function setStoredPin(newPin) {
  try {
    if (newPin) {
      localStorage.setItem(PIN_STORAGE_KEY, String(newPin).trim());
    }
  } catch (err) {
    console.warn('Failed to save PIN locally:', err);
  }
}

/**
 * Verifies if the entered PIN matches the active security PIN.
 * @param {string} enteredPin The PIN entered by the user
 * @param {string} activePin The current active PIN from content or storage
 * @returns {boolean}
 */
export function verifyPin(enteredPin, activePin = null) {
  const targetPin = String(activePin || getStoredPin() || DEFAULT_ADMIN_PIN).trim();
  const inputPin = String(enteredPin || '').trim();
  return inputPin.length > 0 && inputPin === targetPin;
}

/**
 * Authenticates the admin in-memory using the PIN.
 * @param {string} enteredPin
 * @param {string} activePin
 * @returns {Promise<Object>}
 */
export async function authenticateWithPin(enteredPin, activePin = null) {
  // Small simulated latency for natural security feel
  await new Promise((res) => setTimeout(res, 200));

  const isValid = verifyPin(enteredPin, activePin);
  if (!isValid) {
    throw new Error('Incorrect security PIN. Please enter the correct PIN code.');
  }

  const user = {
    id: 'mta-admin-session',
    displayName: 'School Administrator',
    role: 'admin',
    authenticatedAt: new Date().toISOString(),
  };

  inMemoryUser = user;
  window.dispatchEvent(new CustomEvent('mta_cms_auth_changed', { detail: user }));
  return user;
}

/**
 * Logs out the administrator and clears in-memory session.
 * @returns {Promise<void>}
 */
export async function logout() {
  inMemoryUser = null;
  window.dispatchEvent(new CustomEvent('mta_cms_auth_changed', { detail: null }));
}

/**
 * Retrieves the currently logged-in user in memory.
 * Returns null whenever page is reloaded.
 * @returns {Object|null}
 */
export function getCurrentUser() {
  return inMemoryUser;
}

/**
 * Listens for in-memory auth state changes.
 * @param {Function} callback
 * @returns {Function}
 */
export function onAuthStateChanged(callback) {
  callback(inMemoryUser);

  const listener = (event) => {
    callback(event.detail);
  };

  window.addEventListener('mta_cms_auth_changed', listener);
  return () => window.removeEventListener('mta_cms_auth_changed', listener);
}
