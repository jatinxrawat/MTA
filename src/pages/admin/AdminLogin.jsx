import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, DEMO_ADMIN_CREDENTIALS } from '../../lib/auth';
import { useCMS } from '../../context/CMSContext';
import CrestLogo from '../../components/CrestLogo';
import { ShieldCheck, ArrowRight, ArrowLeft, KeyRound, Mail, AlertCircle } from 'lucide-react';
import '../../styles/admin.css';

export default function AdminLogin() {
  const [email, setEmail] = useState(DEMO_ADMIN_CREDENTIALS.email);
  const [password, setPassword] = useState(DEMO_ADMIN_CREDENTIALS.password);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useCMS();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      showToast(`Welcome back, ${user.displayName}!`, 'success');
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    setEmail(DEMO_ADMIN_CREDENTIALS.email);
    setPassword(DEMO_ADMIN_CREDENTIALS.password);
    setError('');
  };

  return (
    <div className="cms-login-viewport">
      <div className="cms-login-card">
        {/* Header */}
        <div className="cms-login-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <CrestLogo size={70} animated={false} variant="brass" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-navy-deep)', margin: '0 0 0.25rem 0' }}>
            Mother Teresa Academy
          </h2>
          <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--color-maroon)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Staff Administration Portal (CMS)
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="cms-login-form">
          {error && (
            <div style={{ padding: '10px 14px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', color: '#991b1b', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <div className="cms-form-group">
            <label htmlFor="admin-email">Staff Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@motherteresaacademy.edu.in"
                className="cms-input-field"
                style={{ paddingLeft: '38px' }}
              />
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            </div>
          </div>

          <div className="cms-form-group">
            <label htmlFor="admin-pass">Staff Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-pass"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="cms-input-field"
                style={{ paddingLeft: '38px' }}
              />
              <KeyRound size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            </div>
          </div>

          <div className="cms-login-hint-box">
            <strong>Staff Local Credentials:</strong>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
              <span>Email: <code>{DEMO_ADMIN_CREDENTIALS.email}</code></span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
              <span>Password: <code>{DEMO_ADMIN_CREDENTIALS.password}</code></span>
              <button
                type="button"
                onClick={handleQuickFill}
                style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: '600', cursor: 'pointer', fontSize: '0.78rem' }}
              >
                Auto-fill
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="cms-btn cms-btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
          >
            {loading ? 'Authenticating...' : 'Enter Administration Area'}
            <ArrowRight size={16} />
          </button>

          <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
            <Link
              to="/"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#64748b', fontSize: '0.85rem', textDecoration: 'none' }}
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
