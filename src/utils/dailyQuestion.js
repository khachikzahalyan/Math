import topics from '../data/topics';

/**
 * Per-day overrides: pin a specific question for a specific local date.
 * Key — `YYYY-MM-DD` (local time). Value — { topicId, questionId }.
 */
const DATE_OVERRIDES = {
  '2026-06-10': { topicId: 'proposition', questionId: 'q1' },
};

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

function findQuestion(topicId, questionId) {
  const topic = topics.find((t) => t.id === topicId);
  if (!topic) return null;
  const q = (topic.questions || []).find((qq) => qq.id === questionId);
  if (!q) return null;
  return {
    ...q,
    topicId: topic.id,
    topicTitle: topic.title,
    uid: `${topic.id}-${q.id}`,
  };
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
  const { key, hash } = hashDayLocal();

  const override = DATE_OVERRIDES[key];
  if (override) {
    const pinned = findQuestion(override.topicId, override.questionId);
    if (pinned) return pinned;
  }

  const pool = collectRadioQuestions();
  if (pool.length === 0) return null;
  const index = hash % pool.length;
  return pool[index];
}
