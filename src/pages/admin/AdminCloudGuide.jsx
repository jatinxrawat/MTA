import React from 'react';
import { Database, Shield, Cloud, Code2, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AdminCloudGuide() {
  return (
    <div className="cms-management-screen" style={{ maxWidth: '960px' }}>
      <div className="cms-screen-header">
        <div>
          <h1>Developer Cloud Integration Guide</h1>
          <p>
            This administration panel was engineered with clean isolation. Swapping the mock data layer
            for real <strong>Firebase (Firestore + Auth)</strong> and <strong>Cloudinary</strong> requires modifying only 3 files.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Architecture overview */}
        <div style={{ padding: '1.25rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: '700', marginBottom: '0.4rem' }}>
            <CheckCircle2 size={18} />
            <span>Zero Component Refactoring Required</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#15803d', lineHeight: 1.5 }}>
            All site components consume the standard React <code>useCMS()</code> hook or content abstractions.
            You do <strong>not</strong> need to edit any UI components or page files. Simply configure the 3 files listed below.
          </p>
        </div>

        {/* 1. Firebase Firestore */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '6px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Database size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a' }}>1. Connect Firebase Firestore (Content Storage)</h3>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Target File: <code>src/lib/content.js</code></span>
            </div>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.5 }}>
            In <code>src/lib/content.js</code>, replace the <code>loadContent</code> and <code>saveAllContent</code> functions with Firestore document calls:
          </p>
          <pre style={{ backgroundColor: '#0f172a', color: '#e2e8f0', padding: '1rem', borderRadius: '6px', fontSize: '0.82rem', overflowX: 'auto' }}>
{`// 1. Initialize Firebase (e.g. in src/lib/firebase.js)
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const app = initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET"
});
export const db = getFirestore(app);

// 2. In src/lib/content.js:
export async function getAllContent() {
  const snap = await getDoc(doc(db, 'site_content', 'main'));
  return snap.exists() ? snap.data() : defaultContent;
}

export async function saveAllContent(contentMap) {
  await setDoc(doc(db, 'site_content', 'main'), contentMap, { merge: true });
}`}
          </pre>
        </div>

        {/* 2. Firebase Auth */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '6px', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a' }}>2. Connect Firebase Authentication (Staff Login)</h3>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Target File: <code>src/lib/auth.js</code></span>
            </div>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.5 }}>
            In <code>src/lib/auth.js</code>, wire <code>login</code>, <code>logout</code>, and <code>onAuthStateChanged</code> to Firebase Auth:
          </p>
          <pre style={{ backgroundColor: '#0f172a', color: '#e2e8f0', padding: '1rem', borderRadius: '6px', fontSize: '0.82rem', overflowX: 'auto' }}>
{`import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged as fbAuthChanged } from 'firebase/auth';
import { app } from './firebase';

export const auth = getAuth(app);

export async function login(email, password) {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  return { id: userCred.user.uid, email: userCred.user.email, role: 'admin' };
}

export async function logout() {
  await signOut(auth);
}

export function onAuthStateChanged(callback) {
  return fbAuthChanged(auth, (user) => {
    callback(user ? { id: user.uid, email: user.email, role: 'admin' } : null);
  });
}`}
          </pre>
        </div>

        {/* 3. Cloudinary */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '6px', backgroundColor: '#fce7f3', color: '#be185d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cloud size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a' }}>3. Connect Cloudinary (Image & PDF Uploads)</h3>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Target File: <code>src/lib/media.js</code></span>
            </div>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.5 }}>
            In <code>src/lib/media.js</code>, replace the <code>FileReader</code> mock with an unsigned HTTP upload to your Cloudinary cloud:
          </p>
          <pre style={{ backgroundColor: '#0f172a', color: '#e2e8f0', padding: '1rem', borderRadius: '6px', fontSize: '0.82rem', overflowX: 'auto' }}>
{`export async function uploadMedia(file, options = {}) {
  const CLOUD_NAME = 'your-cloudinary-cloud-name';
  const UPLOAD_PRESET = 'mta_school_uploads'; // Unsigned upload preset configured in Cloudinary settings

  const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
  const endpoint = isPdf ? 'raw' : 'image';
  const url = \`https://api.cloudinary.com/v1_1/\${CLOUD_NAME}/\${endpoint}/upload\`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  if (options.folder) formData.append('folder', options.folder);

  const res = await fetch(url, { method: 'POST', body: formData });
  if (!res.ok) throw new Error('Cloudinary upload failed: ' + res.statusText);
  const data = await res.json();

  return {
    url: data.secure_url,
    name: file.name,
    size: file.size,
    type: file.type,
    format: data.format || (isPdf ? 'pdf' : 'jpg'),
    publicId: data.public_id,
  };
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
