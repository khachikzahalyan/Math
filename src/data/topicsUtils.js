import topics from './topics';

export const MIN_LEVEL = 1;
export const MAX_LEVEL = 6;

const isValidLevel = (level) =>
  Number.isFinite(level) && level >= MIN_LEVEL && level <= MAX_LEVEL;

/** Cached for the lifetime of the app (`topics` is static). */
let sortedTopicsCache = null;
export const getSortedTopics = () => {
  if (sortedTopicsCache) return sortedTopicsCache;
  sortedTopicsCache = [...topics]
    .filter((topic) => isValidLevel(topic.level))
    .sort((a, b) => {
      if (a.level !== b.level) return a.level - b.level;
      return (a.title || '').localeCompare(b.title || '', 'hy');
    });
  return sortedTopicsCache;
};

/** Cached Map — avoids rebuilding on every Sidebar render. */
let topicsByLevelCache = null;
export const getTopicsByLevel = () => {
  if (topicsByLevelCache) return topicsByLevelCache;
  const sorted = getSortedTopics();
  const map = new Map();

  for (let level = MIN_LEVEL; level <= MAX_LEVEL; level += 1) {
    map.set(level, []);
  }

  sorted.forEach((topic) => {
    map.get(topic.level).push(topic);
  });

  topicsByLevelCache = map;
  return topicsByLevelCache;
};

const LEVELS_ROW = Array.from({ length: MAX_LEVEL }, (_, idx) => idx + 1);
export const getLevels = () => LEVELS_ROW;

/** Aggregates for About / marketing stats (derived from topics data). */
let courseStatsCache = null;
export function getCourseStats() {
  if (courseStatsCache) return courseStatsCache;
  const sorted = getSortedTopics();
  const typeSet = new Set();
  let questionCount = 0;
  sorted.forEach((topic) => {
    (topic.questions || []).forEach((q) => {
      questionCount += 1;
      if (q && q.type) typeSet.add(q.type);
    });
  });
  courseStatsCache = {
    topicCount: sorted.length,
    levelCount: MAX_LEVEL,
    questionTypeCount: typeSet.size,
    questionCount,
  };
  return courseStatsCache;
}
