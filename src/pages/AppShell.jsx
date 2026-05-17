import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Moon, BookOpen, Leaf, BookMarked, Heart, Wind, Activity, Baby, Settings } from 'lucide-react';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db } from '../data/firebase';
import { useI18n } from '../data/i18n';
import { useAuth } from '../data/AuthContext';
import { useBabies } from '../data/useTrackerData';

function NavItem({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        display: 'flex', alignItems: 'center', gap: '0.7rem',
        padding: '0.7rem 1rem', borderRadius: 14, textDecoration: 'none',
        fontFamily: "'DM Sans', sans-serif", fontSize: '0.93rem',
        fontWeight: isActive ? 500 : 400,
        color: isActive ? 'var(--brown)' : 'var(--brown-light)',
        background: isActive ? 'var(--cream-2)' : 'transparent',
        transition: 'background 0.15s, color 0.15s',
      })}
    >
      {icon}
      {label}
    </NavLink>
  );
}

function OnboardingOverlay() {
  const { user } = useAuth();
  const { t } = useI18n();
  const bp = t.babyProfile;
  const ob = t.onboarding;
  const needsParentName = !user.displayName;
  const [parentName, setParentName] = useState('');
  const [babyName, setBabyName] = useState('');
  const [dob, setDob] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!babyName.trim()) return;
    if (needsParentName && !parentName.trim()) return;
    setBusy(true);
    try {
      if (needsParentName && parentName.trim()) {
        await updateProfile(user, { displayName: parentName.trim() });
        await updateDoc(doc(db, 'users', user.uid), { displayName: parentName.trim() });
      }
      const ref = await addDoc(collection(db, 'users', user.uid, 'babies'), {
        name: babyName.trim(), dateOfBirth: dob, createdAt: serverTimestamp(),
      });
      await updateDoc(doc(db, 'users', user.uid), { activeBabyId: ref.id });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'var(--nav-bg)',
      backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem',
    }}>
      <div style={{ maxWidth: 420, width: '100%', background: 'var(--bg-secondary)', borderRadius: 24, padding: '2rem 1.75rem', border: '1px solid var(--sage-light)', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>👶</div>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--brown)', marginBottom: 8 }}>{ob.title}</h2>
        <p style={{ color: 'var(--brown-light)', fontSize: '0.9rem', marginBottom: 24, lineHeight: 1.5 }}>
          {needsParentName ? ob.body : ob.bodyBabyOnly}
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left' }}>
          {needsParentName && (
            <div>
              <label style={labelStyle}>{ob.parentNameLabel}</label>
              <input
                autoFocus
                value={parentName}
                onChange={e => setParentName(e.target.value)}
                placeholder={ob.parentNamePlaceholder}
                required
                style={inputStyle}
              />
            </div>
          )}
          <div>
            <label style={labelStyle}>{bp.nameLabel}</label>
            <input
              autoFocus={!needsParentName}
              value={babyName}
              onChange={e => setBabyName(e.target.value)}
              placeholder={bp.namePlaceholder}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>{bp.dobLabel}</label>
            <input type="date" value={dob} onChange={e => setDob(e.target.value)} style={inputStyle} />
          </div>
          <button type="submit" disabled={busy || !name.trim()} style={{
            marginTop: 4, padding: '13px', borderRadius: 12, border: 'none',
            background: 'var(--sage)', color: 'var(--btn-text)', fontWeight: 600,
            fontSize: '0.95rem', cursor: busy || !name.trim() ? 'not-allowed' : 'pointer',
            opacity: busy || !name.trim() ? 0.6 : 1, fontFamily: "'DM Sans', sans-serif",
          }}>
            {busy ? bp.saving : bp.save}
          </button>
        </form>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--brown)',
  marginBottom: 4, fontFamily: "'DM Sans', sans-serif",
  textTransform: 'uppercase', letterSpacing: '0.06em',
};

const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--sage-light)',
  fontSize: '0.92rem', fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box',
};

export default function AppShell() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { babies, loading: babiesLoading } = useBabies();

  const GUIDE_ITEMS = [
    { to: '/app/gratur',   label: t.sidebar.crying,    icon: <Moon size={18} /> },
    { to: '/app/svefn',    label: t.sidebar.sleep,     icon: <BookOpen size={18} /> },
    { to: '/app/faeding',  label: t.sidebar.feeding,   icon: <Leaf size={18} /> },
  ];

  const TRACKER_ITEMS = [
    { to: '/app/maelar/faeding', label: t.tracker.tabs.feeding, icon: <Leaf size={18} /> },
    { to: '/app/maelar/svefn',   label: t.tracker.tabs.sleep,   icon: <Moon size={18} /> },
    { to: '/app/maelar/gratur',  label: t.tracker.tabs.crying,  icon: <Activity size={18} /> },
    { to: '/app/maelar/voxtur',  label: t.tracker.tabs.growth,  icon: <Baby size={18} /> },
    { to: '/app/maelar/mynstur', label: t.tracker.tabs.patterns, icon: <Activity size={18} /> },
  ];

  const OTHER_ITEMS = [
    { to: '/app/anda',     label: t.sidebar.breathing, icon: <Wind size={18} /> },
    { to: '/app/dagbok',   label: t.sidebar.diary,     icon: <BookMarked size={18} /> },
    { to: '/app/sjalfsum', label: t.sidebar.selfCare,  icon: <Heart size={18} /> },
  ];

  const MOBILE_NAV = [
    { to: '/app/gratur',          label: t.sidebar.heading,    icon: <BookOpen size={20} /> },
    { to: '/app/maelar/faeding',  label: t.tracker.title,      icon: <Activity size={20} /> },
    { to: '/app/anda',            label: t.sidebar.breathing,  icon: <Wind size={20} /> },
    { to: '/app/dagbok',          label: t.sidebar.diary,      icon: <BookMarked size={20} /> },
    { to: '/app/sjalfsum',        label: t.sidebar.selfCare,   icon: <Heart size={20} /> },
  ];

  return (
    <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 64px)' }}>
      {user && !babiesLoading && babies.length === 0 && <OnboardingOverlay />}
      <aside className="desktop-sidebar" style={{
        width: 240, flexShrink: 0, borderRight: '1px solid var(--brown-faint)',
        padding: '2rem 1rem', background: 'var(--cream)',
        position: 'sticky', top: 64, height: 'calc(100vh - 64px)',
        overflowY: 'auto', display: 'none',
      }}>
        <p style={sectionLabel}>{t.sidebar.heading}</p>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1.5rem' }}>
          {GUIDE_ITEMS.map(item => <NavItem key={item.to} {...item} />)}
        </nav>

        {user && (
          <>
            <p style={sectionLabel}>{t.tracker.title}</p>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1.5rem' }}>
              {TRACKER_ITEMS.map(item => <NavItem key={item.to} {...item} />)}
            </nav>
          </>
        )}

        <p style={sectionLabel}>&nbsp;</p>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {OTHER_ITEMS.map(item => <NavItem key={item.to} {...item} />)}
        </nav>

        {user && (
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--brown-faint)' }}>
            <NavItem to="/app/barn" label={t.babyProfile.title} icon={<Baby size={18} />} />
            <NavItem to="/app/reikningur" label={t.account.title} icon={<Settings size={18} />} />
          </nav>
        )}
      </aside>

      <main style={{ flex: 1, minWidth: 0 }}>
        <div className="fade-in"><Outlet /></div>
      </main>

      <nav className="mobile-bottom-nav" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        borderTop: '1px solid var(--brown-faint)',
        display: 'none',
        padding: '0.4rem 0.2rem calc(0.4rem + env(safe-area-inset-bottom, 0))',
        zIndex: 40,
      }}>
        {MOBILE_NAV.map(({ to, label, icon }) => (
          <NavLink key={to} to={to}
            style={({ isActive }) => ({
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '0.2rem', padding: '0.45rem 0.3rem', textDecoration: 'none',
              color: isActive ? 'var(--sage-deep)' : 'var(--brown-light)',
              fontFamily: "'DM Sans', sans-serif", fontSize: '0.66rem',
              flex: 1, transition: 'color 0.15s',
            })}
          >{icon}{label}</NavLink>
        ))}
      </nav>

      <style>{`
        @media (min-width: 760px) { .desktop-sidebar { display: block !important; } }
        @media (max-width: 759px) { .mobile-bottom-nav { display: flex !important; } main { padding-bottom: 80px; } }
      `}</style>
    </div>
  );
}

const sectionLabel = {
  fontSize: '0.7rem', fontWeight: 600, color: 'var(--brown-light)',
  textTransform: 'uppercase', letterSpacing: '0.12em',
  padding: '0 0.5rem', marginBottom: '0.75rem',
  fontFamily: "'DM Sans', sans-serif",
};
