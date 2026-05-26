import { writeBatch, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import seed from '../data/topics';

export async function seedTopicsFromStaticFile(userEmail) {
  const batch = writeBatch(db);
  seed.forEach((topic, i) => {
    const { questions, ...rest } = topic;
    batch.set(doc(db, 'topics', topic.id), {
      ...rest,
      order: i,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      updatedBy: userEmail,
    });
    (questions || []).forEach((q, j) => {
      batch.set(
        doc(db, 'topics', topic.id, 'questions', q.id),
        { ...q, order: j },
      );
    });
  });
  await batch.commit();
  return seed.length;
}
