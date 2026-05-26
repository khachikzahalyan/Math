import {
  collection, doc, getDocs, setDoc, deleteDoc,
  onSnapshot, query, orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';

const TOPICS = 'topics';
const QUESTIONS = 'questions';

export function subscribeQuestions(topicId, callback, onError) {
  const q = query(collection(db, TOPICS, topicId, QUESTIONS), orderBy('order', 'asc'));
  return onSnapshot(
    q,
    (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    },
    onError,
  );
}

export async function listQuestions(topicId) {
  const snap = await getDocs(
    query(collection(db, TOPICS, topicId, QUESTIONS), orderBy('order', 'asc')),
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveQuestion(topicId, questionId, data) {
  await setDoc(doc(db, TOPICS, topicId, QUESTIONS, questionId), data, { merge: true });
}

export async function deleteQuestion(topicId, questionId) {
  await deleteDoc(doc(db, TOPICS, topicId, QUESTIONS, questionId));
}

export function validateQuestion(q) {
  if (!q?.question?.trim()) return 'Հարցի տեքստը պարտադիր է';
  if (!Array.isArray(q.options) || q.options.length < 2) return 'Անհրաժեշտ է առնվազն 2 տարբերակ';
  if (q.options.some((o) => !String(o).trim())) return 'Տարբերակները չեն կարող դատարկ լինել';
  if (typeof q.correctOption !== 'number') return 'Ընտրեք ճիշտ տարբերակը';
  if (q.correctOption < 0 || q.correctOption >= q.options.length) return 'Ճիշտ տարբերակը անվավեր է';
  return null;
}
