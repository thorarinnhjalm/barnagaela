import { Trash2 } from 'lucide-react';
import { useI18n } from '../data/i18n';

const CATEGORY_COLORS = {
  gratur: 'var(--peach)',
  svefn: 'var(--sage-light)',
  faeding: 'var(--peach-light)',
  almennt: '#EEE9E3',
};

export default function DiaryEntry({ entry, onDelete }) {
  const { t, lang } = useI18n();
  const d = t.diary;

  const date = new Date(entry.date);
  const formatted = date.toLocaleDateString(lang === 'is' ? 'is-IS' : lang === 'pl' ? 'pl-PL' : 'en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', padding: '1.2rem 1.4rem', border: '1px solid var(--sage-light)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ background: CATEGORY_COLORS[entry.category] || '#EEE', color: 'var(--brown)', fontSize: '0.78rem', fontWeight: 600, padding: '0.2rem 0.7rem', borderRadius: '999px', fontFamily: "'DM Sans', sans-serif" }}>
            {d.categories[entry.category] || entry.category}
          </span>
          <span style={{ color: 'var(--brown-light)', fontSize: '0.82rem', fontFamily: "'DM Sans', sans-serif" }}>
            {formatted}
          </span>
        </div>
        {entry.text && (
          <p style={{ color: 'var(--brown)', fontSize: '0.93rem', lineHeight: 1.6 }}>{entry.text}</p>
        )}
      </div>
      <button onClick={() => onDelete(entry.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--brown-light)', padding: '0.25rem', borderRadius: '6px', transition: 'color 0.15s', flexShrink: 0 }}
        onMouseEnter={e => (e.currentTarget.style.color = '#c0392b')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--brown-light)')}
        title={d.deleteTooltip}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
