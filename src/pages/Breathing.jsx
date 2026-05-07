import BreathingButton from '../components/BreathingButton';
import { useI18n } from '../data/i18n';

export default function Breathing() {
  const { t } = useI18n();
  const b = t.breathing;

  return (
    <div style={{ maxWidth: '540px', margin: '0 auto', padding: 'clamp(2rem, 5vw, 3.5rem) 1.5rem' }}>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--brown-light)', marginBottom: 6, fontWeight: 500 }}>
          {b.eyebrow}
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--brown)' }}>{b.title}</h1>
      </div>

      <p style={{ marginTop: 14, marginBottom: 36, color: 'var(--brown-light)', fontSize: '1rem', lineHeight: 1.65, fontWeight: 300 }}>
        {b.intro}
      </p>

      <div style={{ background: 'var(--cream-2)', borderRadius: 32, padding: '48px 24px 36px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <BreathingButton size={260} />
      </div>

      <div style={{ marginTop: 24, padding: '18px 20px', borderRadius: 18, background: 'var(--sage-light)', fontSize: '0.9rem', lineHeight: 1.65, color: 'var(--brown)' }}>
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1rem', marginBottom: 6 }}>{b.whyTitle}</div>
        {b.whyBody}
      </div>
    </div>
  );
}
