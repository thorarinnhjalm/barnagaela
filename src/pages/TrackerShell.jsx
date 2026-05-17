import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useI18n } from '../data/i18n';
import { useActiveBaby } from '../data/useTrackerData';
import AuthGate from '../components/AuthGate';
import BabySwitcher from '../components/BabySwitcher';

export default function TrackerShell() {
  return (
    <AuthGate>
      <TrackerShellInner />
    </AuthGate>
  );
}

function TrackerShellInner() {
  const { t } = useI18n();
  const tr = t.tracker;
  const { activeBaby } = useActiveBaby();
  const navigate = useNavigate();

  if (!activeBaby) {
    return (
      <div style={{ maxWidth: 480, margin: '3rem auto', textAlign: 'center', padding: '2rem 1.5rem' }}>
        <p style={{ color: 'var(--brown)', marginBottom: 16, fontSize: '1.05rem' }}>{t.babyProfile.noBabies}</p>
        <p style={{ color: 'var(--brown-light)', fontSize: '0.9rem', marginBottom: 24 }}>{t.babyProfile.addFirst}</p>
        <button onClick={() => navigate('/app/barn')} style={{
          padding: '12px 24px', borderRadius: 12, border: 'none', background: 'var(--sage)',
          color: 'var(--btn-text)', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer',
        }}>{t.babyProfile.addTitle}</button>
      </div>
    );
  }

  const tabs = [
    { path: 'faeding', label: tr.tabs.feeding },
    { path: 'svefn',   label: tr.tabs.sleep },
    { path: 'gratur',  label: tr.tabs.crying },
    { path: 'voxtur',  label: tr.tabs.growth },
    { path: 'mynstur', label: tr.tabs.patterns },
  ];

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: 'clamp(1.5rem, 4vw, 2.5rem) 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--brown)', margin: 0 }}>{activeBaby.name}</h2>
        <BabySwitcher />
      </div>

      <nav style={{ display: 'flex', gap: 4, overflowX: 'auto', paddingBottom: 2, marginBottom: 20, borderBottom: '1px solid var(--sage-light)' }}>
        {tabs.map(tab => (
          <NavLink key={tab.path} to={`/app/maelar/${tab.path}`}
            style={({ isActive }) => ({
              padding: '8px 14px', borderRadius: '10px 10px 0 0', border: 'none',
              background: isActive ? 'var(--sage)' : 'transparent',
              color: isActive ? 'white' : 'var(--brown-light)',
              fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none',
              fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap',
              transition: 'all 0.15s',
            })}
          >{tab.label}</NavLink>
        ))}
      </nav>

      <Outlet />
    </div>
  );
}
