import { Heart } from 'lucide-react';
import { useI18n } from '../data/i18n';

export default function SelfCare() {
  const { t } = useI18n();
  const sc = t.selfCare;

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: 'clamp(2rem, 5vw, 3.5rem) 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
        <Heart size={22} color="var(--peach)" fill="var(--peach)" />
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--brown)' }}>{sc.title}</h1>
      </div>

      <p style={{ color: 'var(--brown-light)', fontSize: '1rem', lineHeight: 1.75, marginBottom: '2.5rem', fontWeight: 300, borderLeft: '3px solid var(--peach)', paddingLeft: '1rem' }}>
        {sc.intro}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {sc.items.map(item => (
          <div key={item.id} style={{ background: 'white', borderRadius: '16px', padding: '1.5rem 1.75rem', border: '1px solid var(--sage-light)', transition: 'box-shadow 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(92,74,58,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
          >
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.6rem', color: 'var(--brown)' }}>{item.title}</h3>
            <p style={{ color: 'var(--brown-light)', fontSize: '0.92rem', lineHeight: 1.7 }}>{item.body}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '3rem', background: 'var(--peach-light)', borderRadius: '16px', padding: '2rem', textAlign: 'center' }}>
        <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.3rem', color: 'var(--brown)', marginBottom: '0.5rem' }}>{sc.ctaTitle}</p>
        <p style={{ color: 'var(--brown-light)', fontSize: '0.92rem', lineHeight: 1.7 }}>{sc.ctaBody}</p>
      </div>
    </div>
  );
}
