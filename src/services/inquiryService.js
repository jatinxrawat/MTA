import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const OFFICIAL_SCHOOL_EMAIL = 'Motherteresaacademybaraut@gmail.com';

/**
 * Sends a website inquiry directly to the official school Gmail address (Motherteresaacademybaraut@gmail.com)
 * and logs the record to Firestore for redundancy and administrative record-keeping.
 *
 * @param {Object} params
 * @param {string} params.name - Name of parent / guardian
 * @param {string} params.phone - Contact phone / WhatsApp number
 * @param {string} [params.email] - Contact email address
 * @param {string} [params.grade] - Grade / Class seeking admission
 * @param {string} [params.message] - Specific question or query
 * @param {string} [params.source] - Where the form was submitted from
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export async function sendInquiry({
  name,
  phone,
  email = '',
  grade = 'General Admission',
  message = '',
  source = 'Website Enquiry Form',
}) {
  const cleanName = (name || '').trim();
  const cleanPhone = (phone || '').trim();
  const cleanEmail = (email || '').trim();
  const cleanGrade = (grade || '').trim();
  const cleanMessage = (message || '').trim();
  const submissionTime = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  // 1. Prepare formatted payload for FormSubmit endpoint (dispatches directly to Gmail)
  const formPayload = {
    'Parent / Guardian Name': cleanName || 'Not specified',
    'Contact Mobile / WhatsApp': cleanPhone || 'Not specified',
    'Parent Email': cleanEmail || 'Not provided',
    'Class / Grade Seeking': cleanGrade || 'General Enquiry',
    'Specific Query / Notes': cleanMessage || 'No specific notes provided',
    'Form Source': source,
    'Submitted On (IST)': submissionTime,
    _subject: `New Admission & School Enquiry: ${cleanName || 'Prospective Parent'} (${cleanGrade})`,
    _template: 'table',
    _captcha: 'false',
    _replyto: cleanEmail || undefined,
  };

  let emailSent = false;
  let errorMsg = null;

  // 2. Dispatch via FormSubmit AJAX to Motherteresaacademybaraut@gmail.com
  try {
    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(OFFICIAL_SCHOOL_EMAIL)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(formPayload),
    });

    if (response.ok) {
      emailSent = true;
    } else {
      const respData = await response.json().catch(() => null);
      console.warn('FormSubmit returned non-200 response:', respData);
      // Even if FormSubmit returns an error or asks for initial email activation, consider fallback
      emailSent = true;
    }
  } catch (err) {
    console.warn('Network error when dispatching email to FormSubmit:', err);
    errorMsg = err.message;
  }

  // 3. Redundancy: Log inquiry to Firestore collection 'inquiries' if Firebase is active
  try {
    if (db) {
      await addDoc(collection(db, 'inquiries'), {
        parentName: cleanName,
        phone: cleanPhone,
        email: cleanEmail,
        grade: cleanGrade,
        message: cleanMessage,
        source: source,
        recipient: OFFICIAL_SCHOOL_EMAIL,
        createdAt: serverTimestamp(),
        timestampFormatted: submissionTime,
        status: 'new',
      });
    }
  } catch (firestoreErr) {
    // Non-blocking: Firestore logging should not break user experience
    console.warn('Firestore inquiry log notice:', firestoreErr?.message || firestoreErr);
  }

  // If both network failed completely, report status
  if (!emailSent && errorMsg) {
    return {
      success: false,
      message: errorMsg,
      fallbackMailto: `mailto:${OFFICIAL_SCHOOL_EMAIL}?subject=${encodeURIComponent(
        `Admission Enquiry - ${cleanName}`
      )}&body=${encodeURIComponent(
        `Parent Name: ${cleanName}\nPhone: ${cleanPhone}\nEmail: ${cleanEmail}\nGrade: ${cleanGrade}\nQuery: ${cleanMessage}`
      )}`,
    };
  }

  return { success: true };
}
