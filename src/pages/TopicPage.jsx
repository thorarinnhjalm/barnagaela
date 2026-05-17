import { AlertTriangle } from 'lucide-react';
import AccordionItem from '../components/AccordionItem';
import BreathingButton from '../components/BreathingButton';
import { useI18n } from '../data/i18n';

export function Crying()  { return <TopicPage topicKey="gratur" />; }
export function Sleep()   { return <TopicPage topicKey="svefn" />; }
export function Feeding() { return <TopicPage topicKey="faeding" />; }

function TopicPage({ topicKey }) {
  const { t } = useI18n();
  const topic = t.topics[topicKey];

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: 'clamp(2rem, 5vw, 3.5rem) 1.5rem' }}>
      <div style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--brown-light)', marginBottom: 6, fontWeight: 500 }}>
        {topic.label}
      </div>
      <h1 style={{ fontSize: 'clamp(2.4rem, 6vw, 3.4rem)', marginBottom: '1.25rem' }}>
        {topic.label}.
      </h1>

      <div style={{ background: 'var(--cream-2)', borderRadius: 24, padding: '24px 26px', marginBottom: '2rem', fontFamily: "'DM Serif Display', serif", fontSize: '1.25rem', lineHeight: 1.4, color: 'var(--brown)', textWrap: 'pretty' }}>
        &bdquo;{topic.intro}&rdquo;
      </div>

      {topic.emergency && (
        <div style={{ background: 'linear-gradient(160deg, var(--peach), var(--peach-deep))', borderRadius: 24, padding: '24px 24px 22px', marginBottom: '2.5rem', color: '#3d2818', boxShadow: '0 8px 24px -10px rgba(200,120,80,.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: 32, background: 'rgba(255,255,255,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={16} color="#3d2818" />
            </div>
            <h3 style={{ fontSize: '1.4rem', color: '#3d2818' }}>{topic.emergency.title}</h3>
          </div>
          <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {topic.emergency.steps.map((step, i) => (
              <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ width: 22, height: 22, borderRadius: 22, background: 'rgba(255,255,255,.7)', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, fontFamily: "'DM Serif Display', serif" }}>{i + 1}</span>
                <span style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>{step}</span>
              </li>
            ))}
          </ol>
          {topic.emergency.note && (
            <p style={{ marginTop: 14, fontSize: '0.88rem', fontStyle: 'italic', opacity: 0.85 }}>{topic.emergency.note}</p>
          )}
          <div style={{ marginTop: 18, padding: '20px 16px 16px', borderRadius: 18, background: 'rgba(255,255,255,.35)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1rem', marginBottom: 14, opacity: 0.9 }}>
              {t.breathing.breatheIn.split(' ')[0]}…
            </div>
            <BreathingButton size={180} compact />
          </div>
        </div>
      )}

      <div style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--brown-light)', margin: '0 4px 14px', fontWeight: 500 }}>
        {t.topics.tipsHeading}
      </div>

      <div style={{ background: 'var(--bg-secondary)', borderRadius: 18, padding: '0 1.5rem', border: '1px solid var(--brown-faint)' }}>
        {topic.tips.map((tip, i) => (
          <AccordionItem key={tip.id} title={tip.title} body={tip.body} index={i} />
        ))}
      </div>
    </div>
  );
}
