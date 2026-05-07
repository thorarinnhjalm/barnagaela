import { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import DiaryEntry from '../components/DiaryEntry';
import { useI18n } from '../data/i18n';
import { useAuth } from '../data/AuthContext';
import { db } from '../data/firebase';

const STORAGE_KEY = 'barnaglaedur_diary';

function toLocalDatetimeValue(date) {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date - offset).toISOString().slice(0, 16);
}

function useLocalDiary() {
  const [entries, setEntries] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  function addEntry(entry) {
    setEntries(prev => [{ id: Date.now().toString(), ...entry }, ...prev]);
  }
  function removeEntry(id) {
    setEntries(prev => prev.filter(e => e.id !== id));
  }
  return { entries, addEntry, removeEntry };
}

function useFirestoreDiary(userId) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (!userId) return;
    const col = collection(db, 'users', userId, 'diary');
    const q = query(col, orderBy('date', 'desc'));
    return onSnapshot(q, snap => {
      setEntries(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, [userId]);

  async function addEntry(entry) {
    if (!userId) return;
    await addDoc(collection(db, 'users', userId, 'diary'), { ...entry, source: 'app', createdAt: serverTimestamp() });
  }
  async function removeEntry(id) {
    if (!userId) return;
    await deleteDoc(doc(db, 'users', userId, 'diary', id));
  }
  return { entries, addEntry, removeEntry };
}

export default function Diary() {
  const { t } = useI18n();
  const d = t.diary;
  const { user } = useAuth();

  const local = useLocalDiary();
  const cloud = useFirestoreDiary(user?.uid);
  const { entries, addEntry, removeEntry } = user ? cloud : local;

  const [form, setForm] = useState({
    date: toLocalDatetimeValue(new Date()),
    category: 'gratur',
    text: '',
  });
  const [saved, setSaved] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    addEntry({ date: form.date, category: form.category, text: form.text.trim() });
    setForm({ date: toLocalDatetimeValue(new Date()), category: 'gratur', text: '' });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleDelete(id) {
    removeEntry(id);
  }

  const CATEGORIES = [
    { value: 'gratur',  label: d.categories.gratur },
    { value: 'svefn',   label: d.categories.svefn },
    { value: 'faeding', label: d.categories.faeding },
    { value: 'almennt', label: d.categories.almennt },
  ];

  const inputStyle = {
    width: '100%', background: 'var(--cream)', border: '1px solid var(--sage-light)',
    borderRadius: '10px', padding: '0.65rem 0.9rem', fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.93rem', color: 'var(--brown)', outline: 'none', transition: 'border-color 0.15s',
  };

  const subtitle = user
    ? d.subtitle.replace(t.lang === 'is' ? 'tækinu þínu' : t.lang === 'pl' ? 'Twoim urządzeniu' : 'your device', t.lang === 'is' ? 'skýinu' : t.lang === 'pl' ? 'chmurze' : 'the cloud')
    : d.subtitle;

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: 'clamp(2rem, 5vw, 3.5rem) 1.5rem' }}>
      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '0.5rem', color: 'var(--brown)' }}>{d.title}</h1>
      <p style={{ color: 'var(--brown-light)', marginBottom: '2rem', fontSize: '0.95rem' }}>{subtitle}</p>

      <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: '16px', padding: '1.75rem', border: '1px solid var(--sage-light)', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: 'var(--brown-light)', marginBottom: '0.35rem', fontFamily: "'DM Sans', sans-serif" }}>{d.dateLabel}</label>
            <input type="datetime-local" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={inputStyle} required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: 'var(--brown-light)', marginBottom: '0.35rem', fontFamily: "'DM Sans', sans-serif" }}>{d.categoryLabel}</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: 'var(--brown-light)', marginBottom: '0.35rem', fontFamily: "'DM Sans', sans-serif" }}>{d.notesLabel}</label>
          <textarea value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} placeholder={d.notesPlaceholder} rows={3} style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }} />
        </div>
        <button type="submit" style={{ background: 'var(--sage)', color: 'white', border: 'none', borderRadius: '10px', padding: '0.75rem 1.5rem', fontSize: '0.93rem', fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start', transition: 'opacity 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          <PlusCircle size={16} />
          {saved ? d.saved : d.addEntry}
        </button>
      </form>

      {entries.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--brown-light)', padding: '3rem 1rem', fontSize: '0.95rem' }}>{d.empty}</div>
      ) : (
        <div>
          <h2 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--brown)' }}>{d.entriesTitle} ({entries.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {entries.map(entry => <DiaryEntry key={entry.id} entry={entry} onDelete={handleDelete} />)}
          </div>
        </div>
      )}
    </div>
  );
}
