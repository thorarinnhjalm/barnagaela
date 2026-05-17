import { useState } from 'react';
import { Trash2, TrendingUp } from 'lucide-react';
import { useI18n } from '../data/i18n';
import { useActiveBaby, useSubcollection } from '../data/useTrackerData';

export default function GrowthTracker() {
  const { t, lang } = useI18n();
  const tr = t.tracker;
  const g = tr.growth;
  const { activeBabyId } = useActiveBaby();
  const { entries, add, remove } = useSubcollection(activeBabyId, 'growth', 'date');

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState('');
  const [length, setLength] = useState('');
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);

  const handleLog = async (e) => {
    e.preventDefault();
    if (!weight && !length) return;
    setBusy(true);
    await add({
      date,
      ...(weight ? { weightKg: Number(weight) } : {}),
      ...(length ? { lengthCm: Number(length) } : {}),
      ...(notes ? { notes } : {}),
    });
    setWeight('');
    setLength('');
    setNotes('');
    setBusy(false);
  };

  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <h3 style={headingStyle}>{g.title}</h3>

      <form onSubmit={handleLog}>
        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>{g.date}</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>{g.weight}</label>
            <input type="number" step="0.01" value={weight} onChange={e => setWeight(e.target.value)}
              placeholder="kg" style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>{g.length}</label>
            <input type="number" step="0.1" value={length} onChange={e => setLength(e.target.value)}
              placeholder="cm" style={inputStyle} />
          </div>
        </div>

        <input value={notes} onChange={e => setNotes(e.target.value)} placeholder={tr.notesPlaceholder}
          style={{ ...inputStyle, width: '100%', marginBottom: 12, boxSizing: 'border-box' }} />

        <button type="submit" disabled={busy} style={logBtn}>
          {busy ? tr.logging : tr.log}
        </button>
      </form>

      {sorted.length >= 2 && <GrowthChart entries={sorted} labels={g} />}

      <h4 style={{ ...labelStyle, marginTop: 24, marginBottom: 10 }}>{g.measurements}</h4>
      {sorted.length === 0 ? (
        <p style={{ color: 'var(--brown-light)', fontSize: '0.9rem' }}>{tr.noEntries}</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sorted.map(e => {
            const locale = lang === 'is' ? 'is-IS' : lang === 'pl' ? 'pl-PL' : 'en-GB';
            const dateStr = new Date(e.date + 'T00:00:00').toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
            return (
              <div key={e.id} style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: '10px 14px', border: '1px solid var(--sage-light)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <TrendingUp size={14} color="var(--sage)" />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--brown-light)' }}>{dateStr}</span>
                  {e.weightKg && <span style={{ marginLeft: 10, fontSize: '0.9rem', fontWeight: 600, color: 'var(--brown)' }}>{e.weightKg} kg</span>}
                  {e.lengthCm && <span style={{ marginLeft: 10, fontSize: '0.9rem', fontWeight: 600, color: 'var(--brown)' }}>{e.lengthCm} cm</span>}
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

function GrowthChart({ entries, labels }) {
  const withWeight = entries.filter(e => e.weightKg).sort((a, b) => a.date.localeCompare(b.date));
  const withLength = entries.filter(e => e.lengthCm).sort((a, b) => a.date.localeCompare(b.date));
  if (withWeight.length < 2 && withLength.length < 2) return null;

  const W = 320;
  const H = 140;
  const pad = { top: 10, right: 10, bottom: 20, left: 40 };

  const makeLine = (data, key, color) => {
    const vals = data.map(d => d[key]);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const range = max - min || 1;
    const points = data.map((d, i) => {
      const x = pad.left + (i / Math.max(data.length - 1, 1)) * (W - pad.left - pad.right);
      const y = pad.top + (1 - (d[key] - min) / range) * (H - pad.top - pad.bottom);
      return `${x},${y}`;
    });
    return (
      <g key={key}>
        <polyline points={points.join(' ')} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((d, i) => {
          const x = pad.left + (i / Math.max(data.length - 1, 1)) * (W - pad.left - pad.right);
          const y = pad.top + (1 - (d[key] - min) / range) * (H - pad.top - pad.bottom);
          return <circle key={i} cx={x} cy={y} r="3" fill={color} />;
        })}
      </g>
    );
  };

  return (
    <div style={{ marginTop: 20, background: 'var(--bg-secondary)', borderRadius: 14, padding: '14px', border: '1px solid var(--sage-light)' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
        {withWeight.length >= 2 && makeLine(withWeight, 'weightKg', 'var(--peach)')}
        {withLength.length >= 2 && makeLine(withLength, 'lengthCm', 'var(--sage)')}
      </svg>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 6 }}>
        {withWeight.length >= 2 && <span style={{ fontSize: '0.75rem', color: 'var(--peach)', fontWeight: 600 }}>● {labels.weight}</span>}
        {withLength.length >= 2 && <span style={{ fontSize: '0.75rem', color: 'var(--sage)', fontWeight: 600 }}>● {labels.length}</span>}
      </div>
    </div>
  );
}

const headingStyle = { fontSize: '1.15rem', color: 'var(--brown)', marginBottom: 16, fontFamily: "'DM Serif Display', serif" };
const labelStyle = { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--brown-light)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' };
const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--sage-light)', fontSize: '0.92rem', fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box' };
const logBtn = { width: '100%', padding: '14px', borderRadius: 14, border: 'none', background: 'var(--sage)', color: 'var(--btn-text)', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' };
const deleteBtn = { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--brown-light)', padding: 4 };
