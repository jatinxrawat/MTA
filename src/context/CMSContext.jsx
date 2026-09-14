import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
  loadContent, 
  saveAllContent, 
  fetchContentFromCloud, 
  subscribeToContent, 
  defaultContent, 
  setNestedValue, 
  getNestedValue 
} from '../lib/content';
import { 
  getCurrentUser, 
  onAuthStateChanged, 
  logout as authLogout,
  authenticateWithPin,
  getStoredPin,
  setStoredPin,
  DEFAULT_ADMIN_PIN
} from '../lib/auth';

const CMSContext = createContext(null);

export function CMSProvider({ children }) {
  // Current loaded content (draft working copy)
  const [content, setContent] = useState(() => loadContent());
  // The published/committed state in storage
  const [savedContent, setSavedContent] = useState(() => loadContent());
  // Authentication status
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  // Live edit mode toggle (true = show edit pencils; false = clean visitor preview)
  const [isEditing, setIsEditing] = useState(true);
  // Active toast/notification message
  const [toast, setToast] = useState(null);
  // Publishing status indicator
  const [isPublishing, setIsPublishing] = useState(false);
  // Cloud sync status
  const [isCloudConnected, setIsCloudConnected] = useState(false);

  // Check if draft has unsaved edits
  const isDirty = JSON.stringify(content) !== JSON.stringify(savedContent);
  const isDirtyRef = useRef(isDirty);
  isDirtyRef.current = isDirty;

  // Sync auth state
  useEffect(() => {
    const unsub = onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return unsub;
  }, []);

  // Listen for real-time Firestore content updates across all devices/sessions
  useEffect(() => {
    // 1. Initial async fetch from Cloud Firestore
    fetchContentFromCloud()
      .then((cloudData) => {
        if (cloudData) {
          setIsCloudConnected(true);
          setSavedContent(cloudData);
          setContent((prev) => (isDirtyRef.current ? prev : cloudData));
        }
      })
      .catch((err) => {
        console.warn('Initial cloud content load error:', err);
      });

    // 2. Real-time subscription to Cloud Firestore document updates
    const unsubscribe = subscribeToContent(
      (cloudData) => {
        if (cloudData) {
          setIsCloudConnected(true);
          setSavedContent(cloudData);
          setContent((prev) => (isDirtyRef.current ? prev : cloudData));
        }
      },
      (error) => {
        console.warn('Firestore subscription status:', error);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Also listen for storage/content updates across tabs or windows
  useEffect(() => {
    const handleContentUpdate = (e) => {
      if (e.detail) {
        setContent(e.detail);
        setSavedContent(e.detail);
      }
    };
    window.addEventListener('mta_cms_content_updated', handleContentUpdate);
    return () => window.removeEventListener('mta_cms_content_updated', handleContentUpdate);
  }, []);

  // Show a momentary confirmation toast
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast((curr) => (curr && curr.message === message ? null : curr));
    }, 3800);
  }, []);

  // Update a nested property in the draft content
  const updateField = useCallback((path, value) => {
    setContent((prev) => {
      // Deep clone to prevent mutations
      const clone = JSON.parse(JSON.stringify(prev));
      setNestedValue(clone, path, value);
      return clone;
    });
  }, []);

  // Commit all draft changes to storage (Publish to Firebase Firestore)
  const publishAll = useCallback(async () => {
    setIsPublishing(true);
    try {
      await saveAllContent(content);
      setSavedContent(content);
      showToast('All changes successfully published to the live site!', 'success');
      return true;
    } catch (err) {
      console.error('Publish error:', err);
      showToast('Failed to publish changes: ' + err.message, 'error');
      return false;
    } finally {
      setIsPublishing(false);
    }
  }, [content, showToast]);

  // Revert draft changes back to last published state
  const revertChanges = useCallback(() => {
    setContent(JSON.parse(JSON.stringify(savedContent)));
    showToast('Draft changes discarded. Reverted to published state.', 'info');
  }, [savedContent, showToast]);

  // Reset entirely to factory default content
  const resetToFactory = useCallback(async () => {
    if (window.confirm('Reset ALL site content back to initial school defaults? This will erase custom drafts.')) {
      await saveAllContent(defaultContent);
      setContent(defaultContent);
      setSavedContent(defaultContent);
      showToast('Site content restored to factory school defaults.', 'info');
    }
  }, [showToast]);

  // --- NOTICE BOARD HELPERS ---
  const addNotice = useCallback((newNotice) => {
    setContent((prev) => {
      const currentNotices = prev.notices || [];
      const noticeId = Date.now();
      const updated = [
        {
          id: noticeId,
          isPublished: true,
          isNew: true,
          urgent: false,
          category: 'Academics',
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          linkText: newNotice.pdfUrl ? 'Download Circular (PDF)' : 'Read Notice',
          ref: '#',
          bodyContent: '',
          pdfUrl: '',
          ...newNotice,
        },
        ...currentNotices,
      ];
      return { ...prev, notices: updated };
    });
    showToast('Notice drafted! Click "Save & Publish" when ready to make it live.', 'info');
  }, [showToast]);

  const updateNotice = useCallback((id, updatedFields) => {
    setContent((prev) => {
      const currentNotices = prev.notices || [];
      const updated = currentNotices.map((n) => (n.id === id ? { ...n, ...updatedFields } : n));
      return { ...prev, notices: updated };
    });
  }, []);

  const deleteNotice = useCallback((id) => {
    setContent((prev) => {
      const currentNotices = prev.notices || [];
      const updated = currentNotices.filter((n) => n.id !== id);
      return { ...prev, notices: updated };
    });
    showToast('Notice removed from draft list.', 'info');
  }, [showToast]);

  const toggleNoticePublish = useCallback((id) => {
    setContent((prev) => {
      const currentNotices = prev.notices || [];
      const updated = currentNotices.map((n) => (n.id === id ? { ...n, isPublished: !n.isPublished } : n));
      return { ...prev, notices: updated };
    });
  }, []);

  const reorderNotices = useCallback((reorderedList) => {
    setContent((prev) => ({ ...prev, notices: reorderedList }));
  }, []);

  // --- PHOTO GALLERY HELPERS ---
  const addPhoto = useCallback((photoData) => {
    setContent((prev) => {
      const currentGallery = prev.gallery || [];
      const updated = [
        {
          id: Date.now(),
          title: 'Campus Photograph',
          caption: '',
          category: 'Campus',
          isVisible: true,
          ...photoData,
        },
        ...currentGallery,
      ];
      return { ...prev, gallery: updated };
    });
    showToast('Photo added to gallery draft!', 'info');
  }, [showToast]);

  const updatePhoto = useCallback((id, updatedFields) => {
    setContent((prev) => {
      const currentGallery = prev.gallery || [];
      const updated = currentGallery.map((item) => (item.id === id ? { ...item, ...updatedFields } : item));
      return { ...prev, gallery: updated };
    });
  }, []);

  const deletePhoto = useCallback((id) => {
    setContent((prev) => {
      const currentGallery = prev.gallery || [];
      const updated = currentGallery.filter((item) => item.id !== id);
      return { ...prev, gallery: updated };
    });
    showToast('Photo removed from draft gallery.', 'info');
  }, [showToast]);

  const togglePhotoVisibility = useCallback((id) => {
    setContent((prev) => {
      const currentGallery = prev.gallery || [];
      const updated = currentGallery.map((item) => (item.id === id ? { ...item, isVisible: !item.isVisible } : item));
      return { ...prev, gallery: updated };
    });
  }, []);

  const reorderGallery = useCallback((reorderedList) => {
    setContent((prev) => ({ ...prev, gallery: reorderedList }));
  }, []);

  // --- CUSTOM PAGES HELPERS ---
  const addCustomPage = useCallback((newPage) => {
    const pageId = newPage.id || `page_${Date.now()}`;
    const slug = (newPage.slug || newPage.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) || `page-${Date.now()}`;

    setContent((prev) => {
      const currentPages = prev.customPages || [];
      const updated = [
        {
          id: pageId,
          slug,
          title: newPage.title || 'Untitled Page',
          subtitle: '',
          badge: '',
          category: 'General',
          heroImage: '',
          heroImageCaption: '',
          bodyText: '',
          pullquote: '',
          pullquoteAuthor: '',
          highlightCards: [], // [{ title: '...', desc: '...', icon?: '...' }]
          attachedPdfUrl: '',
          attachedPdfName: '',
          actionButtonText: '',
          actionButtonUrl: '',
          showInMenu: true,
          menuLabel: newPage.title || 'Untitled Page',
          menuBadge: '',
          isPublished: true,
          createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          ...newPage,
        },
        ...currentPages,
      ];
      return { ...prev, customPages: updated };
    });
    showToast('New page drafted! Click "Publish" when ready to make it live.', 'info');
  }, [showToast]);

  const updateCustomPage = useCallback((id, updatedFields) => {
    setContent((prev) => {
      const currentPages = prev.customPages || [];
      const updated = currentPages.map((p) => (p.id === id ? { ...p, ...updatedFields } : p));
      return { ...prev, customPages: updated };
    });
  }, []);

  const deleteCustomPage = useCallback((id) => {
    setContent((prev) => {
      const currentPages = prev.customPages || [];
      const updated = currentPages.filter((p) => p.id !== id);
      return { ...prev, customPages: updated };
    });
    showToast('Page removed from draft list.', 'info');
  }, [showToast]);

  const toggleCustomPagePublish = useCallback((id) => {
    setContent((prev) => {
      const currentPages = prev.customPages || [];
      const updated = currentPages.map((p) => (p.id === id ? { ...p, isPublished: !p.isPublished } : p));
      return { ...prev, customPages: updated };
    });
  }, []);

  const reorderCustomPages = useCallback((reorderedList) => {
    setContent((prev) => ({ ...prev, customPages: reorderedList }));
  }, []);

  // --- PIN AUTHENTICATION & SECURITY (IN-MEMORY SESSION, PERSISTENT PIN) ---
  const activePin = content?.security?.adminPin || getStoredPin() || DEFAULT_ADMIN_PIN;

  const verifyAndLogin = useCallback(async (enteredPin) => {
    const currentPin = content?.security?.adminPin || getStoredPin() || DEFAULT_ADMIN_PIN;
    const user = await authenticateWithPin(enteredPin, currentPin);
    setCurrentUser(user);
    return user;
  }, [content]);

  const changePin = useCallback(async (currentPinInput, newPinInput) => {
    const currentTargetPin = content?.security?.adminPin || getStoredPin() || DEFAULT_ADMIN_PIN;
    if (String(currentPinInput || '').trim() !== String(currentTargetPin).trim()) {
      throw new Error('Current security PIN is incorrect.');
    }
    const cleanNewPin = String(newPinInput || '').trim();
    if (cleanNewPin.length < 4) {
      throw new Error('New security PIN must be at least 4 characters or digits.');
    }

    // 1. Immediately cache locally for instant responsiveness
    setStoredPin(cleanNewPin);

    // 2. Persist to Firestore site_content/main
    const updatedContent = {
      ...content,
      security: {
        ...(content.security || {}),
        adminPin: cleanNewPin,
      },
    };
    setContent(updatedContent);
    await saveAllContent(updatedContent);
    setSavedContent(updatedContent);
    showToast('Admin security PIN changed successfully!', 'success');
    return true;
  }, [content, showToast]);

  const lockAdmin = useCallback(async () => {
    await authLogout();
    setCurrentUser(null);
    showToast('Admin panel locked. Security PIN required to re-enter.', 'info');
  }, [showToast]);

  const logout = useCallback(async () => {
    await lockAdmin();
  }, [lockAdmin]);

  const value = {
    content,
    savedContent,
    isDirty,
    isAdmin: !!currentUser,
    currentUser,
    isEditing,
    setIsEditing,
    toast,
    showToast,
    updateField,
    publishAll,
    revertChanges,
    resetToFactory,
    // Notice helpers
    addNotice,
    updateNotice,
    deleteNotice,
    toggleNoticePublish,
    reorderNotices,
    // Gallery helpers
    addPhoto,
    updatePhoto,
    deletePhoto,
    togglePhotoVisibility,
    reorderGallery,
    // Custom Page helpers
    addCustomPage,
    updateCustomPage,
    deleteCustomPage,
    toggleCustomPagePublish,
    reorderCustomPages,
    // Security & PIN Auth
    activePin,
    verifyAndLogin,
    changePin,
    lockAdmin,
    // Status
    isPublishing,
    isCloudConnected,
    // Auth
    logout,
  };

  return <CMSContext.Provider value={value}>{children}</CMSContext.Provider>;
}

export function useCMS() {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
}
