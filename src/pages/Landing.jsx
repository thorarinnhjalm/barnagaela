import { Link } from 'react-router-dom';
import { BookOpen, Moon, Leaf, BookMarked, AlertCircle, Users, Heart } from 'lucide-react';
import { useI18n } from '../data/i18n';

export default function Landing() {
  const { t } = useI18n();
  const l = t.landing;

  const pillars = [
    { to: '/app/gratur', icon: <Moon size={28} />, label: t.sidebar.crying, desc: l.pillarCrying, bg: 'var(--peach-light)', border: 'var(--peach)', iconBg: 'var(--peach)' },
    { to: '/app/svefn', icon: <BookOpen size={28} />, label: t.sidebar.sleep, desc: l.pillarSleep, bg: 'var(--sage-light)', border: 'var(--sage)', iconBg: 'var(--sage)' },
    { to: '/app/faeding', icon: <Leaf size={28} />, label: t.sidebar.feeding, desc: l.pillarFeeding, bg: 'var(--peach-light)', border: 'var(--peach)', iconBg: 'var(--peach)' },
  ];

  const features = [
    { icon: <BookMarked size={22} />, title: l.featureDiaryTitle, desc: l.featureDiaryDesc },
    { icon: <AlertCircle size={22} />, title: l.featureEmergencyTitle, desc: l.featureEmergencyDesc },
    { icon: <Users size={22} />, title: l.featureExpertTitle, desc: l.featureExpertDesc },
    { icon: <Heart size={22} />, title: l.featureSelfCareTitle, desc: l.featureSelfCareDesc },
  ];

  return (
    <div className="fade-in">
      {/* Hero */}
      <section style={{ padding: 'clamp(4rem, 10vw, 8rem) 1.5rem', textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
        <h1 style={{ fontSize: 'clamp(2.6rem, 6vw, 4.2rem)', marginBottom: '1.2rem', color: 'var(--brown)' }}>{l.headline}</h1>
        <p style={{ fontSize: 'clamp(1rem, 2.2vw, 1.2rem)', color: 'var(--brown-light)', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto 2.5rem', fontWeight: 300 }}>{l.subheadline}</p>
        <Link to="/app" style={{ background: 'var(--sage)', color: 'var(--btn-text)', padding: '0.9rem 2.2rem', borderRadius: '999px', textDecoration: 'none', fontSize: '1rem', fontWeight: 500, fontFamily: "'DM Sans', sans-serif", display: 'inline-block', transition: 'opacity 0.2s, transform 0.15s', boxShadow: '0 4px 20px rgba(107, 143, 113, 0.3)' }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >{l.cta}</Link>
      </section>

      {/* Pillars */}
      <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 1.5rem', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', marginBottom: '0.75rem' }}>{l.pillarsTitle}</h2>
          <p style={{ textAlign: 'center', color: 'var(--brown-light)', marginBottom: '3rem', fontSize: '1rem' }}>{l.pillarsSubtitle}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {pillars.map(({ to, icon, label, desc, bg, border, iconBg }) => (
              <Link key={to} to={to} style={{ background: bg, border: `1px solid ${border}30`, borderRadius: '20px', padding: '2rem', textDecoration: 'none', transition: 'transform 0.2s, box-shadow 0.2s', display: 'block' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(92,74,58,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ width: '52px', height: '52px', background: iconBg, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--btn-text)', marginBottom: '1.2rem' }}>{icon}</div>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: 'var(--brown)' }}>{label}</h3>
                <p style={{ color: 'var(--brown-light)', fontSize: '0.93rem', lineHeight: 1.6 }}>{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 1.5rem', background: 'var(--cream)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', marginBottom: '3rem' }}>{l.featuresTitle}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {features.map(({ icon, title, desc }) => (
              <div key={title} style={{ background: 'var(--bg-secondary)', borderRadius: '16px', padding: '1.75rem', border: '1px solid var(--sage-light)' }}>
                <div style={{ width: '44px', height: '44px', background: 'var(--sage-light)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sage)', marginBottom: '1rem' }}>{icon}</div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem', color: 'var(--brown)' }}>{title}</h3>
                <p style={{ color: 'var(--brown-light)', fontSize: '0.9rem', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reassurance strip */}
      <section style={{ background: 'var(--peach-light)', padding: 'clamp(3rem, 7vw, 5.5rem) 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', color: 'var(--brown)', lineHeight: 1.35, marginBottom: '1rem', whiteSpace: 'pre-line' }}>{l.reassuranceTitle}</p>
          <p style={{ color: 'var(--brown-light)', fontSize: '0.95rem', lineHeight: 1.7, fontWeight: 300 }}>{l.reassuranceBody}</p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ padding: 'clamp(3.5rem, 7vw, 6rem) 1.5rem', textAlign: 'center', background: 'var(--cream)' }}>
        <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', marginBottom: '1.5rem' }}>{l.ctaBottomTitle}</h2>
        <Link to="/app" style={{ background: 'var(--sage)', color: 'var(--btn-text)', padding: '0.9rem 2.4rem', borderRadius: '999px', textDecoration: 'none', fontSize: '1rem', fontWeight: 500, fontFamily: "'DM Sans', sans-serif", display: 'inline-block', boxShadow: '0 4px 20px rgba(107, 143, 113, 0.3)' }}>{l.ctaBottomButton}</Link>
      </section>
    </div>
  );
}
