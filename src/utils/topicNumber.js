export function buildTopicNumberMap(topics) {
  const byLevel = new Map();
  topics.forEach((t) => {
    if (!byLevel.has(t.level)) byLevel.set(t.level, []);
    byLevel.get(t.level).push(t);
  });
  const map = new Map();
  byLevel.forEach((levelTopics, level) => {
    [...levelTopics]
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .forEach((t, i) => map.set(t.id, `${level}.${i + 1}`));
  });
  return map;
}

export function getTopicNumber(topic, allTopics) {
  if (!topic) return '';
  return buildTopicNumberMap(allTopics).get(topic.id) || '';
}
