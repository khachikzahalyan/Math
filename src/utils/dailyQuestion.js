import topics from '../data/topics';

function collectRadioQuestions() {
  return topics
    .flatMap((topic) =>
      (topic.questions || []).map((q) => ({
        ...q,
        topicId: topic.id,
        topicTitle: topic.title,
        uid: `${topic.id}-${q.id}`,
      })),
    )
    .filter(
      (q) =>
        q.type === 'radio' &&
        Array.isArray(q.options) &&
        q.options.length > 1 &&
        typeof q.correctOption === 'number',
    );
}

function hashDayLocal() {
  const d = new Date();
  const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  let h = 0;
  for (let i = 0; i < key.length; i += 1) {
    h = Math.imul(31, h) + key.charCodeAt(i);
  }
  return { key, hash: Math.abs(h) };
}

/** Same question for everyone on a given local calendar day. */
export function getDailyQuestion() {
  const pool = collectRadioQuestions();
  if (pool.length === 0) return null;
  const { hash } = hashDayLocal();
  const index = hash % pool.length;
  return pool[index];
}
