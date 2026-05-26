// Guest progress storage (localStorage).
// Используется ТОЛЬКО для маркетинговых виджетов на главной странице
// (CTASection, AchievementsSection, DailyChallenge), чтобы гости видели
// какой-то прогресс без авторизации. Реальный учебный прогресс ученика
// после теста хранится в Firestore через progressRepo.
const STORAGE_KEY = 'math-platform-progress-v1';

function defaultState() {
  return {
    answeredQuestionIds: [],
    visitedLevels: [],
  };
}

function loadRaw() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const p = JSON.parse(raw);
    return {
      answeredQuestionIds: Array.isArray(p.answeredQuestionIds) ? p.answeredQuestionIds : [],
      visitedLevels: Array.isArray(p.visitedLevels)
        ? p.visitedLevels.map(Number).filter((n) => n >= 1 && n <= 6)
        : [],
    };
  } catch {
    return defaultState();
  }
}

function saveRaw(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent('math-platform-progress'));
  } catch {
    /* ignore quota / private mode */
  }
}

/** Unique id: `${topicId}-${questionId}` */
export function recordQuestionAnswered(uid) {
  if (!uid || typeof uid !== 'string') return;
  const p = loadRaw();
  if (p.answeredQuestionIds.includes(uid)) return;
  p.answeredQuestionIds = [...p.answeredQuestionIds, uid];
  saveRaw(p);
}

export function recordLevelVisited(level) {
  const n = Number(level);
  if (!Number.isFinite(n) || n < 1 || n > 6) return;
  const p = loadRaw();
  if (p.visitedLevels.includes(n)) return;
  p.visitedLevels = [...p.visitedLevels, n].sort((a, b) => a - b);
  saveRaw(p);
}

export function getProgressStats() {
  const p = loadRaw();
  const answeredCount = p.answeredQuestionIds.length;
  const visitedLevels = p.visitedLevels;
  const levelsNeeded = [1, 2, 3, 4, 5, 6];
  const hasAllLevels = levelsNeeded.every((l) => visitedLevels.includes(l));
  return {
    answeredCount,
    visitedLevels,
    hasAllLevels,
  };
}

export function subscribeProgress(callback) {
  const handler = () => callback();
  window.addEventListener('math-platform-progress', handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener('math-platform-progress', handler);
    window.removeEventListener('storage', handler);
  };
}
