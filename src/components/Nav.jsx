import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Cloud, User, LogOut, Moon, Sun, Monitor, Menu, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useI18n } from '../data/i18n';
import { useAuth, signOut } from '../data/AuthContext';
import { useTheme } from '../data/ThemeContext';

const LANG_FLAGS = { is: 'IS', en: 'EN', pl: 'PL' };

export default function Nav() {
  const { pathname } = useLocation();
  const { t, lang, setLang, locales } = useI18n();
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isApp = pathname.startsWith('/app');
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const close = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMobileMenuOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  function cycleLang() {
    const idx = locales.indexOf(lang);
    setLang(locales[(idx + 1) % locales.length]);
  }

  const ThemeBtn = () => (
    <button onClick={toggleTheme} style={{
      background: 'var(--cream-2, #efeeeb)', border: '1px solid var(--brown-faint, #d1c4bf)',
      borderRadius: '8px', padding: '0.35rem 0.6rem', cursor: 'pointer',
      color: 'var(--brown)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'background 0.15s'
    }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--sage-light)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'var(--cream-2, #efeeeb)')}
      title="Skema / Theme"
    >
      {theme === 'dark' ? <Moon size={15} /> : theme === 'light' ? <Sun size={15} /> : <Monitor size={15} />}
    </button>
  );

  return (
    <>
      <style>{`
        .nav-desktop-items { display: flex; align-items: center; gap: 0.75rem; }
        .nav-mobile-toggle { display: none; }
        @media (max-width: 760px) {
          .nav-desktop-items .hide-on-mobile { display: none !important; }
          .nav-mobile-toggle { display: flex; align-items: center; justify-content: center; background: none; border: none; padding: 6px; cursor: pointer; color: var(--brown); }
        }
      `}</style>

      <nav style={{
        background: 'var(--nav-bg)', borderBottom: '1px solid var(--sage-light)',
        padding: '0 1.5rem', position: 'sticky', top: 0, zIndex: 60,
        backdropFilter: 'blur(8px)', transition: 'background-color 0.4s ease'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <span style={{ width: '32px', height: '32px', background: 'var(--sage)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cloud size={16} color="var(--bg-primary)" fill="var(--bg-primary)" />
            </span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: '700', fontSize: '1.15rem', color: 'var(--brown)' }}>Lúlla</span>
          </Link>

          <div className="nav-desktop-items">
            <ThemeBtn />
            
            <button className="hide-on-mobile" onClick={cycleLang} style={{
              background: 'var(--cream-2, #F1ECE2)', border: '1px solid var(--brown-faint, #E5DDD0)',
              borderRadius: '8px', padding: '0.35rem 0.6rem', cursor: 'pointer',
              fontSize: '0.78rem', fontWeight: 600, color: 'var(--brown)',
              fontFamily: "'Inter', sans-serif", letterSpacing: '0.04em', transition: 'background 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--sage-light)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--cream-2, #F1ECE2)')}
              title={t.langLabel}
            >{LANG_FLAGS[lang]}</button>

            <div className="hide-on-mobile">
              {!isApp && (
                <Link to="/app" style={{
                  background: 'var(--sage)', color: 'var(--btn-text)', padding: '0.5rem 1.2rem',
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
            </div>

            <div className="hide-on-mobile">
              {!loading && <UserButton user={user} t={t} />}
            </div>

            <button className="nav-mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div ref={menuRef} style={{
          position: 'fixed', top: '64px', left: 0, right: 0,
          background: 'var(--bg-secondary)', borderBottom: '1px solid var(--sage-light)',
          padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 55,
          fontFamily: "'Inter', sans-serif"
        }}>
          <button onClick={cycleLang} style={{
            background: 'var(--cream-2)', border: '1px solid var(--brown-faint)',
            borderRadius: '8px', padding: '0.75rem', cursor: 'pointer',
            fontSize: '0.9rem', fontWeight: 600, color: 'var(--brown)',
            textAlign: 'center', width: '100%'
          }}>
            Vefmál / Language: {LANG_FLAGS[lang]}
          </button>

          {!isApp ? (
            <Link to="/app" onClick={() => setMobileMenuOpen(false)} style={{
              background: 'var(--sage)', color: 'var(--btn-text)', padding: '0.75rem',
              borderRadius: '8px', textDecoration: 'none', fontSize: '0.95rem',
              fontWeight: 600, textAlign: 'center', width: '100%'
            }}>
              {t.nav.openGuide}
            </Link>
          ) : (
            <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{
              background: 'var(--cream-2)', color: 'var(--brown)', padding: '0.75rem',
              borderRadius: '8px', textDecoration: 'none', fontSize: '0.95rem',
              fontWeight: 600, textAlign: 'center', width: '100%', border: '1px solid var(--brown-faint)'
            }}>
              {t.nav.home}
            </Link>
          )}

          <div style={{ height: 1, background: 'var(--sage-light)', margin: '0.5rem 0' }}></div>

          {!user ? (
            <button onClick={() => { setMobileMenuOpen(false); navigate('/app/maelar'); }} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '0.75rem',
              borderRadius: 8, border: '1px solid var(--sage-light)', background: 'transparent',
              cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600, color: 'var(--brown)'
            }}>
              <User size={18} /> {t.auth.signIn}
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--brown-light)', marginBottom: '0.5rem', textAlign: 'center' }}>
                {t.account.signedInAs} <strong>{user.displayName || user.email}</strong>
              </div>
              <button onClick={() => { setMobileMenuOpen(false); navigate('/app/barn'); }} style={mobileDropItem}>
                {t.babyProfile.title}
              </button>
              <button onClick={() => { setMobileMenuOpen(false); navigate('/app/reikningur'); }} style={mobileDropItem}>
                {t.account.title}
              </button>
              <button onClick={async () => { await signOut(); setMobileMenuOpen(false); }} style={{ ...mobileDropItem, color: '#c0392b' }}>
                <LogOut size={16} /> {t.auth.signOut}
              </button>
            </div>
          )}
        </div>
      )}
    </>
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
        borderRadius: 999, border: '1px solid var(--sage-light)', background: 'var(--bg-secondary)',
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
          background: 'var(--bg-secondary)', borderRadius: 14, border: '1px solid var(--sage-light)',
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

const mobileDropItem = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '12px 16px',
  background: 'var(--cream-2)', border: '1px solid var(--sage-light)', borderRadius: 8, cursor: 'pointer', fontSize: '0.95rem',
  color: 'var(--brown)', fontFamily: "'Inter', sans-serif", textAlign: 'center', fontWeight: 600
};
