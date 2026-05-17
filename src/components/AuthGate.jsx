import { useState } from 'react';
import { useAuth, signInWithGoogle, signInWithEmail, signUpWithEmail } from '../data/AuthContext';
import { useI18n } from '../data/i18n';

export default function AuthGate({ children }) {
  const { user, loading } = useAuth();
  const { t } = useI18n();
  const a = t.auth;

  if (loading) return null;
  if (user) return children;

  return <AuthCard />;
}

function AuthCard() {
  const { t } = useI18n();
  const a = t.auth;
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleGoogle = async () => {
    setBusy(true);
    setError('');
    try { 
      await signInWithGoogle(); 
    } catch (err) { 
      console.error("Google Auth Error:", err);
      setError(a.error); 
    } finally { 
      setBusy(false); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (mode === 'signup') {
        await signUpWithEmail(email, password, name);
      } else {
        await signInWithEmail(email, password);
      }
    } catch { setError(a.error); }
    finally { setBusy(false); }
  };

  return (
    <div style={{ maxWidth: 420, margin: '1.5rem auto', padding: '2rem 1.75rem', background: 'var(--bg-secondary)', borderRadius: 20, border: '1px solid var(--sage-light)', textAlign: 'center' }}>
      <h2 style={{ fontSize: '1.4rem', color: 'var(--brown)', marginBottom: 6 }}>{a.gateTitle}</h2>
      <p style={{ color: 'var(--brown-light)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: 14 }}>{a.gateBody}</p>

      {a.benefits && (
        <div style={{ background: 'var(--cream-2, #F1ECE2)', borderRadius: 12, padding: '10px 14px', marginBottom: 18, textAlign: 'left' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--brown)', marginBottom: 5 }}>{a.benefitsTitle}</div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {a.benefits.map((b, i) => (
              <li key={i} style={{ fontSize: '0.82rem', color: 'var(--brown-light)', lineHeight: 1.4, display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                <span style={{ color: 'var(--sage)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                {b}
              </li>
            ))}
          </ul>
          <p style={{ fontSize: '0.75rem', color: 'var(--brown-light)', marginTop: 6, marginBottom: 0, fontStyle: 'italic' }}>{a.freeNote}</p>
        </div>
      )}

      <button onClick={handleGoogle} disabled={busy} style={{
        width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--sage-light)',
        background: 'var(--bg-secondary)', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 500,
        color: 'var(--brown)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        transition: 'box-shadow 0.15s',
      }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 2px 12px rgba(92,74,58,0.08)')}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
      >
        <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
        {a.googleSignIn}
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0', color: 'var(--brown-light)', fontSize: '0.82rem' }}>
        <div style={{ flex: 1, height: 1, background: 'var(--sage-light)' }} />
        {a.or}
        <div style={{ flex: 1, height: 1, background: 'var(--sage-light)' }} />
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {mode === 'signup' && (
          <input type="text" placeholder={a.displayName} value={name} onChange={e => setName(e.target.value)}
            style={inputStyle} />
        )}
        <input type="email" placeholder={a.email} value={email} onChange={e => setEmail(e.target.value)}
          required style={inputStyle} />
        <input type="password" placeholder={a.password} value={password} onChange={e => setPassword(e.target.value)}
          required minLength={6} style={inputStyle} />

        {error && <p style={{ color: '#c0392b', fontSize: '0.85rem', margin: 0 }}>{error}</p>}

        <button type="submit" disabled={busy} style={{
          padding: '12px', borderRadius: 12, border: 'none', background: 'var(--sage)',
          color: 'var(--btn-text)', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer',
          opacity: busy ? 0.6 : 1,
        }}>
          {busy ? a.signingIn : mode === 'signup' ? a.signUp : a.signIn}
        </button>
      </form>

      <p style={{ marginTop: 16, fontSize: '0.85rem', color: 'var(--brown-light)' }}>
        {mode === 'signin' ? a.noAccount : a.haveAccount}{' '}
        <button onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}
          style={{ background: 'none', border: 'none', color: 'var(--sage)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
          {mode === 'signin' ? a.signUp : a.signIn}
        </button>
      </p>
    </div>
  );
}

const inputStyle = {
  padding: '11px 14px', borderRadius: 10, border: '1px solid var(--sage-light)',
  fontSize: '0.92rem', fontFamily: "'DM Sans', sans-serif", outline: 'none',
  transition: 'border-color 0.15s',
};
