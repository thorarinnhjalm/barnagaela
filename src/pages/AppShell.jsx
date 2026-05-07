import { NavLink, Outlet } from 'react-router-dom';
import { Moon, BookOpen, Leaf, BookMarked, Heart, Wind, Activity, Baby, Settings } from 'lucide-react';
import { useI18n } from '../data/i18n';
import { useAuth } from '../data/AuthContext';

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

export default function AppShell() {
  const { t } = useI18n();
  const { user } = useAuth();

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
        background: 'rgba(250,247,242,0.92)',
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
