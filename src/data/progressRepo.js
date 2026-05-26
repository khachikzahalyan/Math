import {
  collection, doc, getDoc, getDocs, query, where, orderBy,
  runTransaction, serverTimestamp, Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

export function score10From(correct, total) {
  if (!total || total <= 0) return 0;
  return Math.round((correct / total) * 10);
}

export async function saveAttempt(uid, attempt) {
  const { topicId, totalQuestions, correctAnswers, answers, startedAt } = attempt;
  const score10 = score10From(correctAnswers, totalQuestions);

  const attemptsCol = collection(db, 'progress', uid, 'attempts');
  const attemptRef = doc(attemptsCol);

  await runTransaction(db, async (tx) => {
    const userRef = doc(db, 'progress', uid);
    const userSnap = await tx.get(userRef);
    const prev = userSnap.exists() ? (userSnap.data().byTopic || {}) : {};
    const prevTopic = prev[topicId] || { bestScore10: 0, lastScore10: 0, attemptsCount: 0 };

    tx.set(attemptRef, {
      topicId,
      totalQuestions,
      correctAnswers,
      score10,
      answers,
      startedAt: startedAt ? Timestamp.fromDate(new Date(startedAt)) : serverTimestamp(),
      finishedAt: serverTimestamp(),
    });

    tx.set(
      userRef,
      {
        lastActiveAt: serverTimestamp(),
        byTopic: {
          ...prev,
          [topicId]: {
            bestScore10: Math.max(prevTopic.bestScore10 || 0, score10),
            lastScore10: score10,
            attemptsCount: (prevTopic.attemptsCount || 0) + 1,
          },
        },
      },
      { merge: true },
    );
  });

  return { score10, attemptId: attemptRef.id };
}

export async function getMyProgress(uid) {
  const snap = await getDoc(doc(db, 'progress', uid));
  return snap.exists() ? snap.data() : null;
}

export async function listAllProgress() {
  const snap = await getDocs(collection(db, 'progress'));
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
}

export async function listAttempts(uid, topicId) {
  const snap = await getDocs(
    query(
      collection(db, 'progress', uid, 'attempts'),
      where('topicId', '==', topicId),
      orderBy('finishedAt', 'desc'),
    ),
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
