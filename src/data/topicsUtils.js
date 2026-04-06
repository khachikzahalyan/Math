import topics from './topics';

const MIN_LEVEL = 1;
const MAX_LEVEL = 6;

const isValidLevel = (level) =>
  Number.isFinite(level) && level >= MIN_LEVEL && level <= MAX_LEVEL;

export const getSortedTopics = () => {
  return [...topics]
    .filter((topic) => isValidLevel(topic.level))
    .sort((a, b) => {
      if (a.level !== b.level) return a.level - b.level;
      return (a.title || '').localeCompare(b.title || '', 'hy');
    });
};

export const getTopicsByLevel = () => {
  const sorted = getSortedTopics();
  const map = new Map();

  for (let level = MIN_LEVEL; level <= MAX_LEVEL; level += 1) {
    map.set(level, []);
  }

  sorted.forEach((topic) => {
    map.get(topic.level).push(topic);
  });

  return map;
};

export const getLevels = () => {
  return Array.from({ length: MAX_LEVEL }, (_, idx) => idx + 1);
};
