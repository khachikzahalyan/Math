import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { getUserStats, getProgress } from "../lib/progressStorage";
import "../styles/MyProgressPage.css";

export default function MyProgressPage() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [progress, setProgress] = useState({});

  useEffect(() => {
    const userStats = getUserStats();
    const progressData = getProgress();
    setStats(userStats);
    setProgress(progressData);
  }, []);

  if (!stats) return <div className="loading">{t('progressPage.loading')}</div>;

  const completedLessons = Object.values(progress).filter(
    (p) => p.completed
  ).length;

  const achievements = [
    {
      id: "5_lessons",
      name: t('progressPage.achievement5LessonsName'),
      description: t('progressPage.achievement5LessonsDesc'),
      unlocked: stats.achievements.includes("5_lessons"),
    },
    {
      id: "10_lessons",
      name: t('progressPage.achievement10LessonsName'),
      description: t('progressPage.achievement10LessonsDesc'),
      unlocked: stats.achievements.includes("10_lessons"),
    },
    {
      id: "perfect_score",
      name: t('progressPage.achievementPerfectName'),
      description: t('progressPage.achievementPerfectDesc'),
      unlocked: stats.achievements.includes("perfect_score"),
    },
    {
      id: "5_day_streak",
      name: t('progressPage.achievementStreakName'),
      description: t('progressPage.achievementStreakDesc'),
      unlocked: stats.achievements.includes("5_day_streak"),
    },
  ];

  return (
    <div className="my-progress-page">
      <div className="progress-header">
        <h1>📊 {t('progressPage.title')}</h1>
        <p>{t('progressPage.subtitle')}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{completedLessons}</div>
          <div className="stat-label">{t('progressPage.statsCompleted')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{Math.round(stats.averageScore)}%</div>
          <div className="stat-label">{t('progressPage.statsAverage')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.streak}</div>
          <div className="stat-label">{t('progressPage.statsStreak')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalPoints}</div>
          <div className="stat-label">{t('progressPage.statsTotalPoints')}</div>
        </div>
      </div>

      <section className="achievements-section">
        <h2>🏆 {t('progressPage.achievementsTitle')}</h2>
        <div className="achievements-grid">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`achievement-badge ${
                achievement.unlocked ? "unlocked" : "locked"
              }`}
            >
              <div className="badge-icon">{achievement.name.split(" ")[0]}</div>
              <div className="badge-text">
                <p className="badge-name">{achievement.name}</p>
                <p className="badge-desc">{achievement.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="completed-lessons-section">
        <h2>✅ {t('progressPage.completedLessonsTitle')}</h2>
        <div className="completed-list">
          {Object.entries(progress).filter(([, p]) => p.completed).length > 0 ? (
            Object.entries(progress)
              .filter(([, p]) => p.completed)
              .map(([slug, data]) => (
                <div key={slug} className="completed-item">
                  <div className="item-info">
                    <span className="item-name">{slug}</span>
                    <span className="item-score">
                      {Math.round(data.score)}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${data.score}%` }}
                    ></div>
                  </div>
                </div>
              ))
          ) : (
            <p className="empty-message">
              {t('progressPage.emptyMessage')}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
