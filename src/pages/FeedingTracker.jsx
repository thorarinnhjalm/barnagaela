import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useI18n } from '../data/i18n';
import { useActiveBaby, useSubcollection } from '../data/useTrackerData';

const TYPES = [
  { key: 'breast-left', icon: '🤱', side: 'L' },
  { key: 'breast-right', icon: '🤱', side: 'R' },
  { key: 'bottle', icon: '🍼' },
  { key: 'solids', icon: '🥄' },
];

const TYPE_LABELS = {
  'breast-left': 'breastLeft',
  'breast-right': 'breastRight',
  bottle: 'bottle',
  solids: 'solids',
};

export default function FeedingTracker() {
  const { t, lang } = useI18n();
  const tr = t.tracker;
  const f = tr.feeding;
  const { activeBabyId } = useActiveBaby();
  const { entries, add, remove } = useSubcollection(activeBabyId, 'feedings');

  const [type, setType] = useState('breast-left');
  const [duration, setDuration] = useState(15);
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);

  const handleLog = async () => {
    setBusy(true);
    await add({
      time: new Date().toISOString(),
      type,
      durationMin: duration,
      ...(type === 'bottle' && amount ? { amountMl: Number(amount) } : {}),
      ...(notes ? { notes } : {}),
    });
    setNotes('');
    setAmount('');
    setBusy(false);
  };

  const todayCount = entries.filter(e => {
    const d = new Date(e.time);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  return (
    <div>
      <h3 style={headingStyle}>{f.title}</h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
        {TYPES.map(tp => (
          <button key={tp.key} onClick={() => setType(tp.key)} style={{
            padding: '14px 4px', borderRadius: 14, border: type === tp.key ? '2px solid var(--sage)' : '1px solid var(--sage-light)',
            background: type === tp.key ? 'var(--sage-light)' : 'white', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            transition: 'all 0.15s',
          }}>
            <span style={{ fontSize: 24 }}>{tp.icon}</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--brown)', fontFamily: "'DM Sans', sans-serif" }}>
              {f[TYPE_LABELS[tp.key]]}
            </span>
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 120 }}>
          <label style={labelStyle}>{f.duration}</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button onClick={() => setDuration(d => Math.max(1, d - 5))} style={stepperBtn}>−</button>
            <span style={{ minWidth: 36, textAlign: 'center', fontSize: '1.1rem', fontWeight: 600, color: 'var(--brown)' }}>{duration}</span>
            <button onClick={() => setDuration(d => d + 5)} style={stepperBtn}>+</button>
          </div>
        </div>
        {type === 'bottle' && (
          <div style={{ flex: 1, minWidth: 120 }}>
            <label style={labelStyle}>{f.amount}</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="ml"
              style={inputStyle} />
          </div>
        )}
      </div>

      <input value={notes} onChange={e => setNotes(e.target.value)} placeholder={tr.notesPlaceholder}
        style={{ ...inputStyle, width: '100%', marginBottom: 12, boxSizing: 'border-box' }} />

      <button onClick={handleLog} disabled={busy} style={logBtn}>
        {busy ? tr.logging : tr.log}
      </button>

      {todayCount > 0 && (
        <div style={{ marginTop: 16, padding: '10px 14px', background: 'var(--peach-light)', borderRadius: 12, fontSize: '0.9rem', color: 'var(--brown)', fontWeight: 500 }}>
          {todayCount} {f.todayTotal}
        </div>
      )}

      <h4 style={{ ...labelStyle, marginTop: 24, marginBottom: 10 }}>{tr.entries}</h4>
      {entries.length === 0 ? (
        <p style={{ color: 'var(--brown-light)', fontSize: '0.9rem' }}>{tr.noEntries}</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {entries.map(e => (
            <EntryRow key={e.id} entry={e} labels={f} lang={lang} onDelete={() => remove(e.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function EntryRow({ entry, labels, lang, onDelete }) {
  const d = new Date(entry.time);
  const time = d.toLocaleTimeString(lang === 'is' ? 'is-IS' : lang === 'pl' ? 'pl-PL' : 'en-GB', { hour: '2-digit', minute: '2-digit' });
  const date = d.toLocaleDateString(lang === 'is' ? 'is-IS' : lang === 'pl' ? 'pl-PL' : 'en-GB', { day: 'numeric', month: 'short' });

  return (
    <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: '10px 14px', border: '1px solid var(--sage-light)', display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: '0.82rem', color: 'var(--brown-light)' }}>{date} {time}</span>
        <span style={{ marginLeft: 8, fontSize: '0.85rem', fontWeight: 600, color: 'var(--brown)' }}>
          {labels[TYPE_LABELS[entry.type]] || entry.type}
        </span>
        <span style={{ marginLeft: 6, fontSize: '0.82rem', color: 'var(--brown-light)' }}>{entry.durationMin} min</span>
        {entry.amountMl && <span style={{ marginLeft: 6, fontSize: '0.82rem', color: 'var(--brown-light)' }}>{entry.amountMl} ml</span>}
      </div>
      <button onClick={onDelete} style={deleteBtn}><Trash2 size={14} /></button>
    </div>
  );
}

const headingStyle = { fontSize: '1.15rem', color: 'var(--brown)', marginBottom: 16, fontFamily: "'DM Serif Display', serif" };
const labelStyle = { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--brown-light)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' };
const inputStyle = { padding: '10px 12px', borderRadius: 10, border: '1px solid var(--sage-light)', fontSize: '0.92rem', fontFamily: "'DM Sans', sans-serif", outline: 'none' };
const stepperBtn = { width: 36, height: 36, borderRadius: 10, border: '1px solid var(--sage-light)', background: 'var(--bg-secondary)', fontSize: '1.1rem', cursor: 'pointer', color: 'var(--brown)' };
const logBtn = { width: '100%', padding: '14px', borderRadius: 14, border: 'none', background: 'var(--sage)', color: 'var(--btn-text)', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' };
const deleteBtn = { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--brown-light)', padding: 4 };
