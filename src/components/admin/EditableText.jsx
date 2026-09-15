import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useCMS } from '../../context/CMSContext';
import { getNestedValue } from '../../lib/content';
import { Pencil, Check, X } from 'lucide-react';

/**
 * EditableText: Renders inline editable text for headings, paragraphs, and labels.
 * 
 * @param {string} path Dot-separated content path (e.g. "hero.headline")
 * @param {string} fallback Default text if content is empty
 * @param {string} as HTML tag to render (e.g. 'h1', 'h2', 'p', 'span', 'div')
 * @param {boolean} multiline Whether to use textarea instead of input
 * @param {string} className CSS classes
 * @param {object} style Inline styles
 */
export default function EditableText({
  path,
  fallback = '',
  as: Component = 'span',
  multiline = false,
  className = '',
  style = {},
  children,
  ...props
}) {
  const location = useLocation();
  const isInAdmin = location.pathname.startsWith('/admin');
  const { content, updateField, isAdmin, isEditing } = useCMS();
  const fallbackVal = fallback || (typeof children === 'string' ? children : '') || '';
  const rawValue = path ? getNestedValue(content, path, fallbackVal) : fallbackVal;
  const hasValue = rawValue !== undefined && rawValue !== null && String(rawValue).trim() !== '';
  const displayValue = hasValue ? String(rawValue) : String(fallbackVal);

  const [isEditingInline, setIsEditingInline] = useState(false);
  const [draftValue, setDraftValue] = useState(hasValue ? String(rawValue) : String(fallbackVal));
  const inputRef = useRef(null);

  // Sync draft value if content changes externally
  useEffect(() => {
    setDraftValue(hasValue ? String(rawValue) : String(fallbackVal));
  }, [rawValue, fallbackVal, hasValue]);

  // Focus and select text upon entering edit mode
  useEffect(() => {
    if (isEditingInline && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current.select) {
        inputRef.current.select();
      }
    }
  }, [isEditingInline]);

  // Strict isolation: Public site NEVER shows edit affordances, even if logged in
  if (!isInAdmin || !isAdmin || !isEditing || !path) {
    return (
      <Component className={className} style={style} {...props}>
        {displayValue}
      </Component>
    );
  }

  const handleSave = () => {
    updateField(path, draftValue);
    setIsEditingInline(false);
  };

  const handleCancel = () => {
    setDraftValue(displayValue);
    setIsEditingInline(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (!multiline || e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  if (isEditingInline) {
    return (
      <div className={`cms-inline-editor-wrap ${multiline ? 'multiline' : ''}`} style={style}>
        {multiline ? (
          <textarea
            ref={inputRef}
            value={draftValue}
            onChange={(e) => setDraftValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="cms-inline-textarea"
            rows={Math.max(3, draftValue.split('\n').length)}
          />
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={draftValue}
            onChange={(e) => setDraftValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="cms-inline-input"
          />
        )}
        <div className="cms-inline-actions">
          <button
            type="button"
            onClick={handleSave}
            className="cms-action-btn cms-save-btn"
            title="Commit edit (Enter)"
          >
            <Check size={14} />
            <span>Apply</span>
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="cms-action-btn cms-cancel-btn"
            title="Discard (Esc)"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <Component
      className={`cms-editable-element ${className}`}
      style={{ ...style, position: 'relative' }}
      onClick={(e) => {
        // Prevent link navigation or event bubbling when clicking to edit
        e.stopPropagation();
        setIsEditingInline(true);
      }}
      title="Click to edit content"
      {...props}
    >
      {displayValue || <span className="cms-empty-placeholder">[Empty text — click to edit]</span>}
      <button
        type="button"
        className="cms-edit-pencil-badge"
        aria-label="Edit content"
        onClick={(e) => {
          e.stopPropagation();
          setIsEditingInline(true);
        }}
      >
        <Pencil size={11} />
        <span className="cms-pencil-text">Edit</span>
      </button>
    </Component>
  );
}
