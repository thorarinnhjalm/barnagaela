import { Link } from 'react-router-dom';
import { Moon, BookOpen, Leaf, BookMarked, Heart, Wind, Activity } from 'lucide-react';
import { useI18n } from '../data/i18n';
import { useAuth } from '../data/AuthContext';

export default function Overview() {
  const { t } = useI18n();
  const { user } = useAuth();
  
  const pillars = [
    { to: '/app/gratur', icon: <Moon size={28} />, label: t.sidebar.crying, desc: t.landing.pillarCrying, bg: 'var(--peach-light)', border: 'var(--peach)', iconBg: 'var(--peach)' },
    { to: '/app/svefn', icon: <BookOpen size={28} />, label: t.sidebar.sleep, desc: t.landing.pillarSleep, bg: 'var(--sage-light)', border: 'var(--sage)', iconBg: 'var(--sage)' },
    { to: '/app/faeding', icon: <Leaf size={28} />, label: t.sidebar.feeding, desc: t.landing.pillarFeeding, bg: 'var(--peach-light)', border: 'var(--peach)', iconBg: 'var(--peach)' },
  ];

  const tools = [
    { to: '/app/anda', icon: <Wind size={22} />, label: t.sidebar.breathing },
    { to: '/app/sjalfsum', icon: <Heart size={22} />, label: t.sidebar.selfCare },
    { to: '/app/dagbok', icon: <BookMarked size={22} />, label: t.sidebar.diary },
    ...(user ? [{ to: '/app/maelar/faeding', icon: <Activity size={22} />, label: t.tracker.title }] : [])
  ];

  return (
    <div className="fade-in" style={{ padding: 'clamp(2rem, 5vw, 3.5rem) 1.5rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1rem', color: 'var(--brown)' }}>
        {t.landing.headline}
      </h1>
      <p style={{ fontSize: '1.1rem', color: 'var(--brown-light)', marginBottom: '2.5rem', maxWidth: '600px', lineHeight: 1.6 }}>
        {t.landing.subheadline}
      </p>

      <h2 style={{ fontSize: '1.1rem', color: 'var(--brown-light)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
        {t.landing.pillarsTitle}
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
        {pillars.map(({ to, icon, label, desc, bg, border, iconBg }) => (
          <Link key={to} to={to} style={{ background: bg, border: `1px solid ${border}40`, borderRadius: '20px', padding: '1.75rem', textDecoration: 'none', transition: 'transform 0.2s, box-shadow 0.2s', display: 'block' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(92,74,58,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ width: '48px', height: '48px', background: iconBg, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--btn-text)', marginBottom: '1rem' }}>{icon}</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--brown)' }}>{label}</h3>
            <p style={{ color: 'var(--brown-light)', fontSize: '0.9rem', lineHeight: 1.5 }}>{desc}</p>
          </Link>
        ))}
      </div>

      <h2 style={{ fontSize: '1.1rem', color: 'var(--brown-light)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
        {t.landing.featuresTitle}
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
        {tools.map(({ to, icon, label }) => (
          <Link key={to} to={to} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--sage-light)', borderRadius: '16px', padding: '1.25rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--brown)', fontWeight: 500, transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--cream-2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
          >
            <div style={{ width: '36px', height: '36px', background: 'var(--sage-light)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sage)' }}>
              {icon}
            </div>
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
