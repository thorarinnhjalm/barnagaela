import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '../data/i18n';
import { useActiveBaby, useSubcollection } from '../data/useTrackerData';

const HELP_OPTIONS = ['swaddle', 'whiteNoise', 'walking', 'feeding', 'diaper', 'holding', 'nothing'];

export default function CryingTracker() {
  const { t, lang } = useI18n();
  const tr = t.tracker;
  const c = tr.crying;
  const { activeBabyId } = useActiveBaby();
  const { entries, add, remove } = useSubcollection(activeBabyId, 'cryings', 'startTime');

  const [duration, setDuration] = useState(10);
  const [helped, setHelped] = useState([]);
  const [helpedOther, setHelpedOther] = useState('');
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);

  const toggleHelp = (key) => {
    setHelped(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const handleLog = async () => {
    setBusy(true);
    await add({
      startTime: new Date().toISOString(),
      durationMin: duration,
      helped,
      ...(helpedOther ? { helpedOther } : {}),
      ...(notes ? { notes } : {}),
    });
    setHelped([]);
    setHelpedOther('');
    setNotes('');
    setDuration(10);
    setBusy(false);
  };

  return (
    <div>
      <h3 style={headingStyle}>{c.title}</h3>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>{c.duration}</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => setDuration(d => Math.max(5, d - 5))} style={stepperBtn}>−</button>
          <span style={{ minWidth: 40, textAlign: 'center', fontSize: '1.2rem', fontWeight: 600, color: 'var(--brown)' }}>{duration}</span>
          <button onClick={() => setDuration(d => d + 5)} style={stepperBtn}>+</button>
          <span style={{ fontSize: '0.85rem', color: 'var(--brown-light)' }}>min</span>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>{c.whatHelped}</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {HELP_OPTIONS.map(key => (
            <button key={key} onClick={() => toggleHelp(key)} style={{
              padding: '8px 14px', borderRadius: 999,
              border: helped.includes(key) ? '2px solid var(--sage)' : '1px solid var(--sage-light)',
              background: helped.includes(key) ? 'var(--sage-light)' : 'white',
              color: 'var(--brown)', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer',
              transition: 'all 0.15s',
            }}>{c.helped[key]}</button>
          ))}
        </div>
      </div>

      <input value={helpedOther} onChange={e => setHelpedOther(e.target.value)} placeholder={c.otherLabel}
        style={{ ...inputStyle, width: '100%', marginBottom: 10, boxSizing: 'border-box' }} />

      <input value={notes} onChange={e => setNotes(e.target.value)} placeholder={tr.notesPlaceholder}
        style={{ ...inputStyle, width: '100%', marginBottom: 12, boxSizing: 'border-box' }} />

      <button onClick={handleLog} disabled={busy} style={logBtn}>
        {busy ? tr.logging : tr.log}
      </button>

      <Link to="/app/gratur" style={{ display: 'block', marginTop: 12, color: 'var(--sage)', fontSize: '0.9rem', fontWeight: 500 }}>
        {c.seeGuide}
      </Link>

      <h4 style={{ ...labelStyle, marginTop: 24, marginBottom: 10 }}>{tr.entries}</h4>
      {entries.length === 0 ? (
        <p style={{ color: 'var(--brown-light)', fontSize: '0.9rem' }}>{tr.noEntries}</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {entries.map(e => {
            const d = new Date(e.startTime);
            const locale = lang === 'is' ? 'is-IS' : lang === 'pl' ? 'pl-PL' : 'en-GB';
            const time = d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
            const date = d.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
            return (
              <div key={e.id} style={{ background: 'white', borderRadius: 12, padding: '10px 14px', border: '1px solid var(--sage-light)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--brown-light)' }}>{date} {time}</span>
                  <span style={{ marginLeft: 8, fontSize: '0.85rem', fontWeight: 600, color: 'var(--brown)' }}>{e.durationMin} min</span>
                  {e.helped?.length > 0 && (
                    <div style={{ marginTop: 4, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {e.helped.map(h => (
                        <span key={h} style={{ fontSize: '0.75rem', background: 'var(--peach-light)', padding: '2px 8px', borderRadius: 999, color: 'var(--brown)' }}>
                          {c.helped[h] || h}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={() => remove(e.id)} style={deleteBtn}><Trash2 size={14} /></button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const headingStyle = { fontSize: '1.15rem', color: 'var(--brown)', marginBottom: 16, fontFamily: "'DM Serif Display', serif" };
const labelStyle = { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--brown-light)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' };
const inputStyle = { padding: '10px 12px', borderRadius: 10, border: '1px solid var(--sage-light)', fontSize: '0.92rem', fontFamily: "'DM Sans', sans-serif", outline: 'none' };
const stepperBtn = { width: 40, height: 40, borderRadius: 12, border: '1px solid var(--sage-light)', background: 'white', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--brown)' };
const logBtn = { width: '100%', padding: '14px', borderRadius: 14, border: 'none', background: 'var(--sage)', color: 'white', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' };
const deleteBtn = { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--brown-light)', padding: 4 };
