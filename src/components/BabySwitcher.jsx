import { useI18n } from '../data/i18n';
import { useActiveBaby } from '../data/useTrackerData';

export default function BabySwitcher() {
  const { t } = useI18n();
  const { activeBaby, babies, switchBaby } = useActiveBaby();

  if (babies.length <= 1) return null;

  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {babies.map(b => (
        <button key={b.id} onClick={() => switchBaby(b.id)} style={{
          padding: '6px 14px', borderRadius: 999, border: '1px solid var(--sage-light)',
          background: b.id === activeBaby?.id ? 'var(--sage)' : 'white',
          color: b.id === activeBaby?.id ? 'white' : 'var(--brown)',
          fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif", transition: 'all 0.15s',
        }}>
          {b.name}
        </button>
      ))}
    </div>
  );
}
