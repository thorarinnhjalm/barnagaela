import { useState, useEffect } from 'react';
import {
  collection, query, orderBy, onSnapshot,
  addDoc, deleteDoc, doc, updateDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './AuthContext';

export function useBabies() {
  const { user } = useAuth();
  const [babies, setBabies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setBabies([]); setLoading(false); return; }
    const q = query(collection(db, 'users', user.uid, 'babies'), orderBy('createdAt', 'asc'));
    return onSnapshot(q, snap => {
      setBabies(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
  }, [user]);

  return { babies, loading };
}

export function useActiveBaby() {
  const { user } = useAuth();
  const { babies } = useBabies();
  const [activeBabyId, setActiveBabyId] = useState(null);

  useEffect(() => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid);
    return onSnapshot(ref, snap => {
      const data = snap.data();
      setActiveBabyId(data?.activeBabyId || null);
    });
  }, [user]);

  const activeBaby = babies.find(b => b.id === activeBabyId) || babies[0] || null;

  async function switchBaby(babyId) {
    if (!user) return;
    await updateDoc(doc(db, 'users', user.uid), { activeBabyId: babyId });
  }

  return { activeBaby, activeBabyId: activeBaby?.id, switchBaby, babies };
}

export function useSubcollection(babyId, subcollection, orderField = 'time') {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !babyId) { setEntries([]); setLoading(false); return; }
    const col = collection(db, 'users', user.uid, 'babies', babyId, subcollection);
    const q = query(col, orderBy(orderField, 'desc'));
    return onSnapshot(q, snap => {
      setEntries(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
  }, [user, babyId, subcollection, orderField]);

  async function add(data) {
    if (!user || !babyId) return;
    const col = collection(db, 'users', user.uid, 'babies', babyId, subcollection);
    return addDoc(col, { ...data, createdAt: serverTimestamp() });
  }

  async function remove(entryId) {
    if (!user || !babyId) return;
    return deleteDoc(doc(db, 'users', user.uid, 'babies', babyId, subcollection, entryId));
  }

  async function update(entryId, data) {
    if (!user || !babyId) return;
    return updateDoc(doc(db, 'users', user.uid, 'babies', babyId, subcollection, entryId), data);
  }

  return { entries, loading, add, remove, update };
}
