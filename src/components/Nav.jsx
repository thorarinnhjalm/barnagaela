import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Cloud, User, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useI18n } from '../data/i18n';
import { useAuth, signOut } from '../data/AuthContext';

const LANG_FLAGS = { is: 'IS', en: 'EN', pl: 'PL' };

export default function Nav() {
  const { pathname } = useLocation();
  const { t, lang, setLang, locales } = useI18n();
  const { user, loading } = useAuth();
  const isApp = pathname.startsWith('/app');

  function cycleLang() {
    const idx = locales.indexOf(lang);
    setLang(locales[(idx + 1) % locales.length]);
  }

  return (
    <nav style={{
      background: 'var(--cream)', borderBottom: '1px solid var(--sage-light)',
      padding: '0 1.5rem', position: 'sticky', top: 0, zIndex: 50,
      backdropFilter: 'blur(8px)', backgroundColor: 'rgba(251, 249, 246, 0.92)',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <span style={{ width: '32px', height: '32px', background: 'var(--sage)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Cloud size={16} color="white" fill="white" />
          </span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: '700', fontSize: '1.15rem', color: 'var(--brown)' }}>Lúlla</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={cycleLang} style={{
            background: 'var(--cream-2, #F1ECE2)', border: '1px solid var(--brown-faint, #E5DDD0)',
            borderRadius: '8px', padding: '0.35rem 0.6rem', cursor: 'pointer',
            fontSize: '0.78rem', fontWeight: 600, color: 'var(--brown)',
            fontFamily: "'Inter', sans-serif", letterSpacing: '0.04em', transition: 'background 0.15s',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--sage-light)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--cream-2, #F1ECE2)')}
            title={t.langLabel}
          >{LANG_FLAGS[lang]}</button>

          {!isApp && (
            <Link to="/app/gratur" style={{
              background: 'var(--sage)', color: 'white', padding: '0.5rem 1.2rem',
              borderRadius: '999px', textDecoration: 'none', fontSize: '0.9rem',
              fontWeight: 500, fontFamily: "'Inter', sans-serif", transition: 'opacity 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >{t.nav.openGuide}</Link>
          )}
          {isApp && (
            <Link to="/" style={{ color: 'var(--brown-light)', textDecoration: 'none', fontSize: '0.9rem', fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
              {t.nav.home}
            </Link>
          )}

          {!loading && <UserButton user={user} t={t} />}
        </div>
      </div>
    </nav>
  );
}

function UserButton({ user, t }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  if (!user) {
    return (
      <button onClick={() => navigate('/app/maelar')} style={{
        display: 'flex', alignItems: 'center', gap: 6, padding: '0.4rem 0.9rem',
        borderRadius: 999, border: '1px solid var(--sage-light)', background: 'white',
        cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, color: 'var(--brown)',
        fontFamily: "'Inter', sans-serif", transition: 'box-shadow 0.15s',
      }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(92,74,58,0.08)')}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
      >
        <User size={15} />
        {t.auth.signIn}
      </button>
    );
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{
        width: 36, height: 36, borderRadius: '50%', border: '2px solid var(--sage-light)',
        padding: 0, cursor: 'pointer', overflow: 'hidden', background: 'var(--sage-light)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {user.photoURL
          ? <img src={user.photoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <User size={18} color="var(--brown)" />
        }
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '100%', marginTop: 6,
          background: 'white', borderRadius: 14, border: '1px solid var(--sage-light)',
          boxShadow: '0 8px 24px rgba(92,74,58,0.1)', minWidth: 200, overflow: 'hidden', zIndex: 100,
        }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--sage-light)' }}>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--brown)' }}>{user.displayName || user.email}</div>
            {user.displayName && <div style={{ fontSize: '0.8rem', color: 'var(--brown-light)' }}>{user.email}</div>}
          </div>
          <button onClick={() => { setOpen(false); navigate('/app/barn'); }} style={dropItem}>
            {t.babyProfile.title}
          </button>
          <button onClick={() => { setOpen(false); navigate('/app/reikningur'); }} style={dropItem}>
            {t.account.title}
          </button>
          <button onClick={async () => { await signOut(); setOpen(false); }} style={{ ...dropItem, color: '#c0392b', borderTop: '1px solid var(--sage-light)' }}>
            <LogOut size={14} /> {t.auth.signOut}
          </button>
        </div>
      )}
    </div>
  );
}

const dropItem = {
  display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '10px 16px',
  background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.88rem',
  color: 'var(--brown)', fontFamily: "'Inter', sans-serif", textAlign: 'left', fontWeight: 500
};
