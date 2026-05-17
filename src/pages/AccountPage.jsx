import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from 'firebase/auth';
import { useAuth, signOut } from '../data/AuthContext';
import { useI18n } from '../data/i18n';
import AuthGate from '../components/AuthGate';

export default function AccountPage() {
  return (
    <AuthGate>
      <AccountInner />
    </AuthGate>
  );
}

function AccountInner() {
  const { user } = useAuth();
  const { t } = useI18n();
  const a = t.account;
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleDelete = async () => {
    if (!confirm(a.deleteConfirm)) return;
    setDeleting(true);
    try {
      await deleteUser(user);
      navigate('/');
    } catch {
      setDeleting(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 'clamp(2rem, 5vw, 3.5rem) 1.5rem' }}>
      <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: 'var(--brown)', marginBottom: 24 }}>{a.title}</h1>

      <div style={{ background: 'var(--bg-secondary)', borderRadius: 16, padding: '1.5rem', border: '1px solid var(--sage-light)', marginBottom: 20 }}>
        <div style={{ fontSize: '0.82rem', color: 'var(--brown-light)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>{a.signedInAs}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user.photoURL && <img src={user.photoURL} alt="" style={{ width: 40, height: 40, borderRadius: '50%' }} />}
          <div>
            <div style={{ fontWeight: 600, color: 'var(--brown)' }}>{user.displayName || user.email}</div>
            {user.displayName && <div style={{ fontSize: '0.85rem', color: 'var(--brown-light)' }}>{user.email}</div>}
          </div>
        </div>
      </div>

      <button onClick={handleSignOut} style={{
        width: '100%', padding: '12px', borderRadius: 12, border: '1px solid var(--sage-light)',
        background: 'var(--bg-secondary)', color: 'var(--brown)', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer',
        marginBottom: 12,
      }}>{a.signOut}</button>

      <button onClick={handleDelete} disabled={deleting} style={{
        width: '100%', padding: '12px', borderRadius: 12, border: '1px solid #e0c0b8',
        background: 'transparent', color: '#c0392b', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer',
        opacity: deleting ? 0.6 : 1,
      }}>{deleting ? a.deleting : a.deleteAccount}</button>
    </div>
  );
}
