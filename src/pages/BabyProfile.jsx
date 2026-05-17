import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Baby } from 'lucide-react';
import { db } from '../data/firebase';
import { useAuth } from '../data/AuthContext';
import { useBabies } from '../data/useTrackerData';
import { useI18n } from '../data/i18n';
import AuthGate from '../components/AuthGate';

export default function BabyProfile() {
  return (
    <AuthGate>
      <BabyProfileInner />
    </AuthGate>
  );
}

function BabyProfileInner() {
  const { user } = useAuth();
  const { babies, loading } = useBabies();
  const { t } = useI18n();
  const bp = t.babyProfile;
  const [editing, setEditing] = useState(null);

  if (loading) return null;

  return (
    <div style={{ maxWidth: 540, margin: '0 auto', padding: 'clamp(2rem, 5vw, 3.5rem) 1.5rem' }}>
      <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: 'var(--brown)', marginBottom: 24 }}>{bp.title}</h1>

      {babies.length === 0 && !editing && (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--cream-2)', borderRadius: 20 }}>
          <Baby size={48} color="var(--peach)" style={{ marginBottom: 12 }} />
          <p style={{ color: 'var(--brown)', fontWeight: 500, marginBottom: 4 }}>{bp.noBabies}</p>
          <p style={{ color: 'var(--brown-light)', fontSize: '0.9rem', marginBottom: 20 }}>{bp.addFirst}</p>
          <button onClick={() => setEditing({ name: '', dateOfBirth: '' })} style={primaryBtn}>{bp.addTitle}</button>
        </div>
      )}

      {babies.map(b => (
        <div key={b.id} style={{ background: 'var(--bg-secondary)', borderRadius: 16, padding: '1.2rem 1.5rem', border: '1px solid var(--sage-light)', marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--brown)', fontSize: '1.05rem' }}>{b.name}</div>
            {b.dateOfBirth && <div style={{ color: 'var(--brown-light)', fontSize: '0.85rem', marginTop: 2 }}>{b.dateOfBirth}</div>}
          </div>
          <button onClick={() => setEditing({ ...b })} style={{ background: 'none', border: 'none', color: 'var(--sage)', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem' }}>
            {bp.editTitle}
          </button>
        </div>
      ))}

      {babies.length > 0 && !editing && (
        <button onClick={() => setEditing({ name: '', dateOfBirth: '' })} style={{ ...primaryBtn, marginTop: 12 }}>
          {bp.addAnother}
        </button>
      )}

      {editing && (
        <BabyForm
          initial={editing}
          userId={user.uid}
          labels={bp}
          onDone={() => setEditing(null)}
        />
      )}
    </div>
  );
}

function BabyForm({ initial, userId, labels, onDone }) {
  const [name, setName] = useState(initial.name || '');
  const [dob, setDob] = useState(initial.dateOfBirth || '');
  const [busy, setBusy] = useState(false);
  const isEdit = !!initial.id;

  const handleSave = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (isEdit) {
        await updateDoc(doc(db, 'users', userId, 'babies', initial.id), { name, dateOfBirth: dob });
      } else {
        const ref = await addDoc(collection(db, 'users', userId, 'babies'), {
          name, dateOfBirth: dob, createdAt: serverTimestamp(),
        });
        await updateDoc(doc(db, 'users', userId), { activeBabyId: ref.id });
      }
      onDone();
    } catch { setBusy(false); }
  };

  const handleDelete = async () => {
    if (!confirm(labels.deleteConfirm)) return;
    setBusy(true);
    await deleteDoc(doc(db, 'users', userId, 'babies', initial.id));
    onDone();
  };

  return (
    <form onSubmit={handleSave} style={{ background: 'var(--bg-secondary)', borderRadius: 16, padding: '1.5rem', border: '1px solid var(--sage-light)', marginTop: 16 }}>
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>{labels.nameLabel}</label>
        <input value={name} onChange={e => setName(e.target.value)} required placeholder={labels.namePlaceholder}
          style={inputStyle} />
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>{labels.dobLabel}</label>
        <input type="date" value={dob} onChange={e => setDob(e.target.value)} style={inputStyle} />
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button type="submit" disabled={busy} style={primaryBtn}>
          {busy ? labels.saving : labels.save}
        </button>
        <button type="button" onClick={onDone} style={{ ...primaryBtn, background: 'transparent', color: 'var(--brown-light)', border: '1px solid var(--sage-light)' }}>
          ←
        </button>
        {isEdit && (
          <button type="button" onClick={handleDelete} style={{ ...primaryBtn, background: 'transparent', color: '#c0392b', border: '1px solid #e0c0b8', marginLeft: 'auto' }}>
            {labels.delete}
          </button>
        )}
      </div>
    </form>
  );
}

const primaryBtn = {
  padding: '10px 20px', borderRadius: 12, border: 'none', background: 'var(--sage)',
  color: 'var(--btn-text)', fontWeight: 600, fontSize: '0.92rem', cursor: 'pointer',
  fontFamily: "'DM Sans', sans-serif",
};

const labelStyle = {
  display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--brown)',
  marginBottom: 4, fontFamily: "'DM Sans', sans-serif", textTransform: 'uppercase', letterSpacing: '0.06em',
};

const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--sage-light)',
  fontSize: '0.92rem', fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box',
};
