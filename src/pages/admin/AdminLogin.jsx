import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCMS } from '../../context/CMSContext';
import CrestLogo from '../../components/CrestLogo';
import { 
  Lock, KeyRound, ShieldCheck, Eye, EyeOff, 
  ArrowRight, ArrowLeft, AlertCircle, Loader2 
} from 'lucide-react';
import '../../styles/admin.css';

export default function AdminLogin() {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const inputRef = useRef(null);
  
  const navigate = useNavigate();
  const { verifyAndLogin, isAdmin, showToast } = useCMS();

  // If already authenticated in memory, redirect directly to dashboard
  useEffect(() => {
    if (isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [isAdmin, navigate]);

  // Auto-focus PIN input field on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleUnlock = async (e) => {
    if (e) e.preventDefault();
    if (!pin.trim()) {
      setError('Please enter the security PIN.');
      triggerShake();
      return;
    }

    setError('');
    setLoading(true);

    try {
      await verifyAndLogin(pin.trim());
      showToast('Admin panel unlocked successfully!', 'success');
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Incorrect security PIN. Access denied.');
      triggerShake();
      setLoading(false);
    }
  };

  return (
    <div className="cms-login-viewport">
      <div className={`cms-login-card ${isShaking ? 'cms-card-shake' : ''}`} style={{ maxWidth: '460px' }}>
        {/* Header */}
        <div className="cms-login-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <CrestLogo size={74} animated={false} variant="brass" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: '#0b1b3d', margin: '0 0 0.25rem 0' }}>
            Mother Teresa Academy
          </h2>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', padding: '3px 10px', borderRadius: '20px', marginTop: '4px' }}>
            <Lock size={13} style={{ color: '#b91c1c' }} />
            <span style={{ fontSize: '0.76rem', fontWeight: '700', color: '#b91c1c', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Protected Admin Portal
            </span>
          </div>
        </div>

        {/* PIN Entry Form */}
        <form onSubmit={handleUnlock} className="cms-login-form">
          <div style={{ textAlign: 'center', marginBottom: '0.25rem' }}>
            <h3 style={{ margin: '0 0 0.35rem 0', fontSize: '1.1rem', color: '#0f172a', fontWeight: 700 }}>
              Enter Security PIN
            </h3>
            <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b', lineHeight: 1.45 }}>
              Enter the administration PIN to unlock the content management dashboard. A PIN is required on every reload.
            </p>
          </div>

          {error && (
            <div style={{ 
              padding: '10px 14px', 
              backgroundColor: '#fef2f2', 
              border: '1px solid #fecaca', 
              borderRadius: '8px', 
              color: '#991b1b', 
              fontSize: '0.85rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              animation: 'fadeIn 200ms ease'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <div className="cms-form-group">
            <label htmlFor="admin-pin" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Security PIN Code</span>
              <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#94a3b8', textTransform: 'none' }}>
                Numbers or Alphanumeric
              </span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                ref={inputRef}
                id="admin-pin"
                type={showPin ? 'text' : 'password'}
                autoComplete="off"
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter PIN (e.g. 2015)"
                className="cms-input-field"
                style={{ 
                  paddingLeft: '40px', 
                  paddingRight: '44px',
                  fontSize: '1.25rem',
                  letterSpacing: showPin ? '0.1em' : '0.25em',
                  fontWeight: '700',
                  textAlign: 'left',
                  borderColor: error ? '#f87171' : undefined
                }}
              />
              <KeyRound 
                size={18} 
                style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: '#94a3b8' 
                }} 
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  padding: '6px',
                  color: '#64748b',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
                title={showPin ? 'Hide PIN' : 'Show PIN'}
              >
                {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Unlock Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="cms-btn cms-btn-primary"
            style={{ 
              width: '100%', 
              padding: '12px', 
              fontSize: '0.98rem',
              backgroundColor: '#0b1b3d',
              boxShadow: '0 4px 14px rgba(11, 27, 61, 0.3)'
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="cms-spinner" />
                <span>Verifying PIN...</span>
              </>
            ) : (
              <>
                <ShieldCheck size={17} />
                <span>Unlock Administration Panel</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

          {/* Return to Public Website */}
          <div style={{ textAlign: 'center', marginTop: '0.25rem' }}>
            <Link
              to="/"
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '6px', 
                color: '#64748b', 
                fontSize: '0.85rem', 
                textDecoration: 'none',
                fontWeight: 500
              }}
            >
              <ArrowLeft size={14} />
              <span>Return to Public School Prospectus</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
