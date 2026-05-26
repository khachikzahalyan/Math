import {
  collection, doc, getDoc, getDocs, setDoc,
  onSnapshot, query, orderBy, serverTimestamp, writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase';

const TOPICS = 'topics';

export function subscribeTopics(callback, onError) {
  const q = query(collection(db, TOPICS), orderBy('order', 'asc'));
  return onSnapshot(
    q,
    (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    },
    onError,
  );
}

export async function listTopics() {
  const snap = await getDocs(query(collection(db, TOPICS), orderBy('order', 'asc')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getTopic(topicId) {
  const snap = await getDoc(doc(db, TOPICS, topicId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function saveTopic(topicId, data, userEmail) {
  await setDoc(
    doc(db, TOPICS, topicId),
    {
      ...data,
      updatedAt: serverTimestamp(),
      updatedBy: userEmail,
      ...(data.createdAt ? {} : { createdAt: serverTimestamp() }),
    },
    { merge: true },
  );
}

export async function deleteTopic(topicId) {
  const qSnap = await getDocs(collection(db, TOPICS, topicId, 'questions'));
  const batch = writeBatch(db);
  qSnap.docs.forEach((d) => batch.delete(d.ref));
  batch.delete(doc(db, TOPICS, topicId));
  await batch.commit();
}

export async function isTopicsEmpty() {
  const snap = await getDocs(collection(db, TOPICS));
  return snap.empty;
}
