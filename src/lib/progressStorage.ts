export interface LessonProgress {
  completed: boolean;
  answers: string[];
  score: number;
  wrongQuestionIds?: string[];
  lastAttempt?: number;
  attempts?: number;
}

export interface Progress {
  [lessonSlug: string]: LessonProgress;
}

export interface UserStats {
  totalLessonsCompleted: number;
  averageScore: number;
  totalPoints: number;
  streak: number;
  lastActivityDate?: number;
  lessonsByTopic: { [topic: string]: number };
  achievements: string[];
}

export function getProgress(): Progress {
  if (typeof window === "undefined") return {};
  const stored = localStorage.getItem("logic-learning-progress");
  return stored ? JSON.parse(stored) : {};
}

export function setProgress(progress: Progress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("logic-learning-progress", JSON.stringify(progress));
}

export function updateLessonProgress(
  lessonSlug: string,
  completed: boolean,
  answers: string[],
  score: number,
  wrongQuestionIds: string[] = []
): void {
  const progress = getProgress();
  progress[lessonSlug] = {
    completed,
    answers,
    score,
    wrongQuestionIds,
    lastAttempt: Date.now(),
    attempts: (progress[lessonSlug]?.attempts || 0) + 1,
  };
  setProgress(progress);
}

export function getLessonProgress(lessonSlug: string): LessonProgress | null {
  const progress = getProgress();
  return progress[lessonSlug] || null;
}

export function getUserStats(): UserStats {
  const progress = getProgress();
  let totalCompleted = 0;
  let totalScore = 0;
  let totalPoints = 0;
  const lessonsByTopic: { [key: string]: number } = {};

  Object.entries(progress).forEach(([, data]) => {
    if (data.completed) {
      totalCompleted++;
      totalScore += data.score || 0;
      totalPoints += Math.round((data.score || 0) / 10);
    }
  });

  return {
    totalLessonsCompleted: totalCompleted,
    averageScore: totalCompleted > 0 ? totalScore / totalCompleted : 0,
    totalPoints,
    streak: calculateStreak(),
    lessonsByTopic,
    achievements: calculateAchievements(),
  };
}

export function calculateStreak(): number {
  const progress = getProgress();
  let streak = 0;
  const today = new Date().setHours(0, 0, 0, 0);

  Object.values(progress)
    .sort((a, b) => (b.lastAttempt || 0) - (a.lastAttempt || 0))
    .forEach((lesson) => {
      if (lesson.lastAttempt) {
        const lessonDate = new Date(lesson.lastAttempt).setHours(0, 0, 0, 0);
        if (lessonDate === today - streak * 24 * 60 * 60 * 1000) {
          streak++;
        } else {
          return;
        }
      }
    });

  return streak;
}

export function calculateAchievements(progress?: Progress): string[] {
  const achievements: string[] = [];
  const p = progress || getProgress();

  let totalCompleted = 0;
  let totalScore = 0;
  Object.values(p).forEach((data) => {
    if (data.completed) {
      totalCompleted++;
      totalScore += data.score || 0;
    }
  });

  const averageScore = totalCompleted > 0 ? totalScore / totalCompleted : 0;

  if (totalCompleted >= 5) achievements.push("5_lessons");
  if (totalCompleted >= 10) achievements.push("10_lessons");
  if (averageScore >= 90) achievements.push("perfect_score");
  if (calculateStreak() >= 5) achievements.push("5_day_streak");

  return achievements;
}

export function getWrongQuestions(lessonSlug: string): string[] {
  const progress = getLessonProgress(lessonSlug);
  return progress?.wrongQuestionIds || [];
}
