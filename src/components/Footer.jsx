import { Link } from 'react-router-dom';
import { Cloud } from 'lucide-react';
import { useI18n } from '../data/i18n';

export default function Footer() {
  const { t } = useI18n();
  const f = t.footer;

  const links = [
    { to: '/app/gratur', label: t.sidebar.crying },
    { to: '/app/svefn', label: t.sidebar.sleep },
    { to: '/app/faeding', label: t.sidebar.feeding },
    { to: '/app/dagbok', label: t.sidebar.diary },
    { to: '/app/sjalfsum', label: t.sidebar.selfCare },
  ];

  return (
    <footer style={{ background: 'var(--sage-deep)', color: 'rgba(255,255,255,0.7)', padding: '3rem 1.5rem', marginTop: 'auto', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ width: '28px', height: '28px', background: 'var(--sage)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cloud size={13} color="white" fill="white" />
            </span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: '700', fontSize: '1.05rem', color: 'white' }}>Lúlla</span>
          </div>
          <p style={{ fontSize: '0.88rem', lineHeight: 1.65, maxWidth: '240px' }}>{f.description}</p>
        </div>

        <div>
          <h4 style={{ color: 'white', fontSize: '0.85rem', fontFamily: "'Inter', sans-serif", fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>{f.contentHeading}</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {links.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                >{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p style={{ fontSize: '0.82rem', lineHeight: 1.6 }}>{f.disclaimer}</p>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '2rem auto 0', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.82rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div>© {new Date().getFullYear()} Lúlla · {f.copyright}</div>
        <div>
          <Link to="/skilmalar" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'underline' }}>
            Notkunarskilmálar & Persónuvernd
          </Link>
        </div>
      </div>
    </footer>
  );
}
