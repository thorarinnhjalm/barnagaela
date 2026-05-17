import { useState, useEffect, useRef } from 'react';
import { Trash2, Moon, Sun } from 'lucide-react';
import { useI18n } from '../data/i18n';
import { useActiveBaby, useSubcollection } from '../data/useTrackerData';

export default function SleepTracker() {
  const { t, lang } = useI18n();
  const tr = t.tracker;
  const s = tr.sleep;
  const { activeBabyId } = useActiveBaby();
  const { entries, add, remove, update } = useSubcollection(activeBabyId, 'sleeps', 'startTime');

  const activeSleep = entries.find(e => !e.endTime);
  const [elapsed, setElapsed] = useState(0);
  const [showManual, setShowManual] = useState(false);
  const [manualStart, setManualStart] = useState('');
  const [manualEnd, setManualEnd] = useState('');
  const [notes, setNotes] = useState('');
  const intervalRef = useRef(null);

  useEffect(() => {
    if (activeSleep) {
      const tick = () => {
        const start = new Date(activeSleep.startTime);
        setElapsed(Math.floor((Date.now() - start.getTime()) / 1000));
      };
      tick();
      intervalRef.current = setInterval(tick, 1000);
      return () => clearInterval(intervalRef.current);
    } else {
      setElapsed(0);
    }
  }, [activeSleep]);

  const handleStart = async () => {
    await add({ startTime: new Date().toISOString(), endTime: null, durationMin: null, notes: '' });
  };

  const handleStop = async () => {
    if (!activeSleep) return;
    const start = new Date(activeSleep.startTime);
    const end = new Date();
    const dur = Math.round((end - start) / 60000);
    await update(activeSleep.id, { endTime: end.toISOString(), durationMin: dur });
  };

  const handleManual = async (e) => {
    e.preventDefault();
    const start = new Date(manualStart);
    const end = new Date(manualEnd);
    const dur = Math.round((end - start) / 60000);
    if (dur <= 0) return;
    await add({ startTime: start.toISOString(), endTime: end.toISOString(), durationMin: dur, notes });
    setManualStart('');
    setManualEnd('');
    setNotes('');
    setShowManual(false);
  };

  const fmtElapsed = () => {
    const h = Math.floor(elapsed / 3600);
    const m = Math.floor((elapsed % 3600) / 60);
    const sec = elapsed % 60;
    return `${h > 0 ? h + s.hours + ' ' : ''}${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const todayTotal = entries.filter(e => {
    if (!e.durationMin) return false;
    const d = new Date(e.startTime);
    return d.toDateString() === new Date().toDateString();
  }).reduce((sum, e) => sum + (e.durationMin || 0), 0);

  const totalH = Math.floor(todayTotal / 60);
  const totalM = todayTotal % 60;

  return (
    <div>
      <div style={{ textAlign: 'center', padding: '2rem 0', marginBottom: 20 }}>
        <button onClick={activeSleep ? handleStop : handleStart} style={{
          width: 160, height: 160, borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: activeSleep
            ? 'radial-gradient(circle at 35% 30%, var(--peach), var(--peach-deep))'
            : 'radial-gradient(circle at 35% 30%, var(--sage), var(--sage-deep))',
          color: 'var(--btn-text)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          boxShadow: activeSleep
            ? '0 12px 40px -8px rgba(200,140,100,.4)'
            : '0 12px 40px -8px rgba(80,110,90,.4)',
          transition: 'all 0.3s ease',
        }}>
          {activeSleep ? <Sun size={28} /> : <Moon size={28} />}
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1rem', marginTop: 6 }}>
            {activeSleep ? s.stop : s.start}
          </span>
        </button>

        {activeSleep && (
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--brown-light)', letterSpacing: '.04em' }}>{s.sleeping}</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--brown)', fontFamily: "'DM Sans', sans-serif", letterSpacing: '.02em' }}>
              {fmtElapsed()}
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, background: 'var(--sage-light)', borderRadius: 14, padding: '14px 18px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--brown-light)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>{s.totalToday}</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--brown)' }}>
            {totalH}{s.hours} {totalM}{s.minutes}
          </div>
        </div>
      </div>

      <button onClick={() => setShowManual(!showManual)} style={{
        background: 'none', border: '1px solid var(--sage-light)', borderRadius: 10,
        padding: '8px 14px', color: 'var(--brown-light)', fontSize: '0.85rem', cursor: 'pointer', marginBottom: 12,
      }}>{s.manualEntry}</button>

      {showManual && (
        <form onSubmit={handleManual} style={{ background: 'var(--bg-secondary)', borderRadius: 14, padding: '1rem', border: '1px solid var(--sage-light)', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>{s.startTime}</label>
              <input type="datetime-local" value={manualStart} onChange={e => setManualStart(e.target.value)} required style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>{s.endTime}</label>
              <input type="datetime-local" value={manualEnd} onChange={e => setManualEnd(e.target.value)} required style={inputStyle} />
            </div>
          </div>
          <button type="submit" style={logBtn}>{tr.log}</button>
        </form>
      )}

      <h4 style={{ ...labelStyle, marginTop: 20, marginBottom: 10 }}>{tr.entries}</h4>
      {entries.filter(e => e.endTime).length === 0 ? (
        <p style={{ color: 'var(--brown-light)', fontSize: '0.9rem' }}>{tr.noEntries}</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {entries.filter(e => e.endTime).map(e => {
            const start = new Date(e.startTime);
            const end = new Date(e.endTime);
            const locale = lang === 'is' ? 'is-IS' : lang === 'pl' ? 'pl-PL' : 'en-GB';
            const time = `${start.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })} – ${end.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}`;
            const date = start.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
            const h = Math.floor((e.durationMin || 0) / 60);
            const m = (e.durationMin || 0) % 60;
            return (
              <div key={e.id} style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: '10px 14px', border: '1px solid var(--sage-light)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Moon size={14} color="var(--sage)" />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--brown-light)' }}>{date}</span>
                  <span style={{ marginLeft: 8, fontSize: '0.85rem', color: 'var(--brown)' }}>{time}</span>
                  <span style={{ marginLeft: 8, fontSize: '0.82rem', fontWeight: 600, color: 'var(--sage)' }}>
                    {h > 0 ? `${h}${s.hours} ` : ''}{m}{s.minutes}
                  </span>
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

const labelStyle = { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--brown-light)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' };
const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--sage-light)', fontSize: '0.92rem', fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box' };
const logBtn = { width: '100%', padding: '12px', borderRadius: 12, border: 'none', background: 'var(--sage)', color: 'var(--btn-text)', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer' };
const deleteBtn = { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--brown-light)', padding: 4 };
