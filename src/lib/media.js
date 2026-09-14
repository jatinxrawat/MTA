/**
 * MOTHER TERESA ACADEMY - MEDIA UPLOAD LAYER ABSTRACTION
 * 
 * Handles file uploads for:
 * 1. Images (Hero photo, about photo, gallery images, logos, card photos)
 * 2. Documents (PDF circulars, fee structure sheets, CBSE recognition certificates)
 * 
 * ============================================================================
 * HANDOFF NOTE FOR DEVELOPER (CLOUDINARY INTEGRATION):
 * ============================================================================
 * To connect this to real Cloudinary storage, replace `uploadMedia` with:
 * 
 * export async function uploadMedia(file, options = {}) {
 *   const CLOUD_NAME = 'YOUR_CLOUDINARY_CLOUD_NAME';
 *   const UPLOAD_PRESET = 'YOUR_UNSIGNED_UPLOAD_PRESET';
 *   
 *   const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
 *   const resourceType = isPdf ? 'raw' : 'image';
 *   const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;
 * 
 *   const formData = new FormData();
 *   formData.append('file', file);
 *   formData.append('upload_preset', UPLOAD_PRESET);
 *   if (options.folder) formData.append('folder', options.folder);
 * 
 *   const res = await fetch(url, { method: 'POST', body: formData });
 *   if (!res.ok) throw new Error('Cloudinary upload failed: ' + res.statusText);
 *   const data = await res.json();
 * 
 *   return {
 *     url: data.secure_url,
 *     name: file.name,
 *     size: file.size,
 *     type: file.type,
 *     format: data.format || (isPdf ? 'pdf' : 'jpg'),
 *     publicId: data.public_id,
 *   };
 * }
 * ============================================================================
 */

/**
 * Neutral SVG Data URI fallback placeholder image for missing or broken school photographs.
 * Uses institutional navy/brass styling so unpopulated media always looks intentional and polished.
 */
export const NEUTRAL_PLACEHOLDER_IMAGE = 
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20500%22%20width%3D%22100%25%22%20height%3D%22100%25%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22bg%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%22100%25%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%230b1b3d%22%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%231b2e56%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22url(%23bg)%22%2F%3E%3Ccircle%20cx%3D%22400%22%20cy%3D%22210%22%20r%3D%2260%22%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.08%22%2F%3E%3Cpath%20d%3D%22M380%20190h40l10%2015h20a10%2010%200%200%201%2010%2010v45a10%2010%200%200%201-10%2010h-80a10%2010%200%200%201-10-10v-45a10%2010%200%200%201%2010-10h10z%22%20fill%3D%22none%22%20stroke%3D%22%23dfb75c%22%20stroke-width%3D%223%22%2F%3E%3Ccircle%20cx%3D%22400%22%20cy%3D%22230%22%20r%3D%2216%22%20fill%3D%22none%22%20stroke%3D%22%23dfb75c%22%20stroke-width%3D%223%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22310%22%20font-family%3D%22system-ui%2C%20sans-serif%22%20font-size%3D%2216%22%20font-weight%3D%22600%22%20letter-spacing%3D%222%22%20fill%3D%22%23e2e8f0%22%20text-anchor%3D%22middle%22%3EMOTHER%20TERESA%20ACADEMY%3C%2Ftext%3E%3Ctext%20x%3D%22400%22%20y%3D%22335%22%20font-family%3D%22system-ui%2C%20sans-serif%22%20font-size%3D%2213%22%20fill%3D%22%2394a3b8%22%20text-anchor%3D%22middle%22%3ECampus%20Photograph%20Archive%3C%2Ftext%3E%3C%2Fsvg%3E";

/**
 * Resolves a media URL safely with guaranteed fallback to the neutral placeholder graphic.
 * @param {string} url The media URL
 * @param {string} fallback Optional specific fallback URL
 * @returns {string} Usable URL
 */
export function getMedia(url, fallback = NEUTRAL_PLACEHOLDER_IMAGE) {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return fallback || NEUTRAL_PLACEHOLDER_IMAGE;
  }
  return url;
}

const CLOUDINARY_CLOUD_NAME = 'p6cec4mr';
const CLOUDINARY_API_KEY = '622671185136636';
const CLOUDINARY_API_SECRET = '0lGyeloxY0-gbw1DKsaoVvUo0oA';

/**
 * Computes a SHA-1 hexadecimal hash for Cloudinary signed requests
 * using the standard browser Web Crypto API.
 */
async function generateCloudinarySignature(paramsToSign, apiSecret) {
  // 1. Sort parameter keys alphabetically
  const sortedKeys = Object.keys(paramsToSign).sort();
  // 2. Format as key=val&key2=val2
  const serialized = sortedKeys.map((key) => `${key}=${paramsToSign[key]}`).join('&');
  // 3. Append secret directly to the end
  const stringToSign = `${serialized}${apiSecret}`;

  // 4. Compute SHA-1 digest
  const encoder = new TextEncoder();
  const data = encoder.encode(stringToSign);
  const hashBuffer = await window.crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Uploads an image or PDF file to Cloudinary (100% Free Plan).
 * Generates an optimized public CDN URL and falls back gracefully to data URL if network is offline.
 * 
 * @param {File} file The File object selected from file input or drag-and-drop
 * @param {Object} options Optional settings (folder, etc.)
 * @returns {Promise<{ url: string, name: string, size: number, type: string, format: string, publicId?: string }>}
 */
export async function uploadMedia(file, options = {}) {
  if (!file) {
    throw new Error('No file provided for upload');
  }

  // Detect file type
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  const isImage = file.type.startsWith('image/');

  if (!isPdf && !isImage) {
    throw new Error('Unsupported file type. Please upload an image (JPG, PNG, WebP) or a PDF document.');
  }

  const extension = file.name.split('.').pop().toLowerCase();
  const folder = options.folder || (isPdf ? 'mta_school/documents' : 'mta_school/images');
  const timestamp = Math.floor(Date.now() / 1000);

  try {
    const paramsToSign = {
      folder,
      timestamp,
    };

    const signature = await generateCloudinarySignature(paramsToSign, CLOUDINARY_API_SECRET);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', CLOUDINARY_API_KEY);
    formData.append('timestamp', timestamp.toString());
    formData.append('folder', folder);
    formData.append('signature', signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson?.error?.message || `Cloudinary upload failed with status ${response.status}`);
    }

    const data = await response.json();

    return {
      url: data.secure_url,
      name: file.name,
      size: file.size,
      type: file.type || (isPdf ? 'application/pdf' : 'image/jpeg'),
      format: data.format || extension,
      uploadedAt: new Date().toISOString(),
      publicId: data.public_id,
    };
  } catch (storageErr) {
    console.warn('Cloudinary upload error, falling back to local data URL:', storageErr);

    // Resilient fallback to FileReader data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          url: reader.result,
          name: file.name,
          size: file.size,
          type: file.type || (isPdf ? 'application/pdf' : 'image/jpeg'),
          format: extension,
          uploadedAt: new Date().toISOString(),
          isFallback: true,
        });
      };
      reader.onerror = (err) => {
        reject(new Error('Failed to read file for upload: ' + err));
      };
      reader.readAsDataURL(file);
    });
  }
}

/**
 * Bulk uploads multiple files concurrently.
 * @param {FileList|File[]} files Array of files
 * @param {Object} options Upload options
 * @returns {Promise<Array<{ url: string, name: string, size: number, type: string }>>}
 */
export async function uploadMultipleMedia(files, options = {}) {
  const fileArray = Array.from(files);
  const uploadPromises = fileArray.map((file) => uploadMedia(file, options));
  return Promise.all(uploadPromises);
}
