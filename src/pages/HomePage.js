import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getProgress, getUserStats } from '../lib/progressStorage';
import './HomePage.css';

function HomePage() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [nextLesson, setNextLesson] = useState(null);

  useEffect(() => {
    const userStats = getUserStats();
    setStats(userStats);

    const progress = getProgress();
    const allLessons = [
      'propositional-basics',
      'formula-normalization',
      'tautology-equiv',
      'completeness-rules',
      'boolean-basics',
    ];

    const next = allLessons.find((lesson) => !progress[lesson]?.completed);
    setNextLesson(next);
  }, []);

  return (
    <div className="home-page">
      <section className="hero">
        <h1>{t('home.title')}</h1>
        <p className="subtitle">{t('home.subtitle')}</p>
        <p className="description">
          {t('home.description')}
        </p>

        {stats && stats.totalLessonsCompleted > 0 && (
          <div className="learning-progress">
            <div className="progress-summary">
              <p>{t('home.statsCompleted', { count: stats.totalLessonsCompleted })}</p>
              <p>{t('home.statsAverage', { score: Math.round(stats.averageScore) })}</p>
            </div>
            {nextLesson && (
              <a href={`/lesson/${nextLesson}`} className="btn-continue">
                {t('home.ctaContinue')}
              </a>
            )}
          </div>
        )}
      </section>

      <section className="info-cards">
        <div className="info-card">
          <h3>{t('home.studentsTitle')}</h3>
          <p>{t('home.studentsText')}</p>
          <ul>
            <li>{t('home.studentsItem1')}</li>
            <li>{t('home.studentsItem2')}</li>
            <li>{t('home.studentsItem3')}</li>
          </ul>
        </div>

        <div className="info-card">
          <h3>{t('home.howToLearnTitle')}</h3>
          <p>{t('home.howToLearnText')}</p>
          <ol className="info-steps">
            <li>{t('home.howToLearnStep1')}</li>
            <li>{t('home.howToLearnStep2')}</li>
            <li>{t('home.howToLearnStep3')}</li>
            <li>{t('home.howToLearnStep4')}</li>
          </ol>
        </div>

        <div className="info-card">
          <h3>{t('home.whatLearnTitle')}</h3>
          <p>{t('home.whatLearnText')}</p>
          <ul>
            <li>{t('home.whatLearnItem1')}</li>
            <li>{t('home.whatLearnItem2')}</li>
            <li>{t('home.whatLearnItem3')}</li>
            <li>{t('home.whatLearnItem4')}</li>
            <li>{t('home.whatLearnItem5')}</li>
          </ul>
        </div>
      </section>

      <section className="course-structure">
        <div className="course-head">
          <div>
            <h2>{t('home.structureTitle')}</h2>
            <p className="course-subtitle">{t('home.structureSubtitle')}</p>
          </div>

          {nextLesson && (
            <a href={`/lesson/${nextLesson}`} className="course-continue">
              {t('home.structureContinue')}
            </a>
          )}
        </div>

        <div className="course-grid">
          <a className="course-card" href="/topics#propositions">
            <div className="course-card__top">
              <span className="course-card__title">{t('home.courseCard1Title')}</span>
              <span className="course-chip">{t('home.courseCard1Lessons')}</span>
            </div>
            <p className="course-card__text">{t('home.courseCard1Text')}</p>
            <div className="course-card__bottom">
              <span className="course-link">{t('home.courseOpen')}</span>
              <span className="course-arrow">→</span>
            </div>
          </a>

          <a className="course-card" href="/topics#connectives">
            <div className="course-card__top">
              <span className="course-card__title">{t('home.courseCard2Title')}</span>
              <span className="course-chip">{t('home.courseCard2Lessons')}</span>
            </div>
            <p className="course-card__text">{t('home.courseCard2Text')}</p>
            <div className="course-card__bottom">
              <span className="course-link">{t('home.courseOpen')}</span>
              <span className="course-arrow">→</span>
            </div>
          </a>

          <a className="course-card" href="/topics#tautology">
            <div className="course-card__top">
              <span className="course-card__title">{t('home.courseCard3Title')}</span>
              <span className="course-chip">{t('home.courseCard3Lessons')}</span>
            </div>
            <p className="course-card__text">{t('home.courseCard3Text')}</p>
            <div className="course-card__bottom">
              <span className="course-link">{t('home.courseOpen')}</span>
              <span className="course-arrow">→</span>
            </div>
          </a>

          <a className="course-card" href="/topics#equivalence">
            <div className="course-card__top">
              <span className="course-card__title">{t('home.courseCard4Title')}</span>
              <span className="course-chip">{t('home.courseCard4Lessons')}</span>
            </div>
            <p className="course-card__text">{t('home.courseCard4Text')}</p>
            <div className="course-card__bottom">
              <span className="course-link">{t('home.courseOpen')}</span>
              <span className="course-arrow">→</span>
            </div>
          </a>

          <a className="course-card" href="/topics#inference">
            <div className="course-card__top">
              <span className="course-card__title">{t('home.courseCard5Title')}</span>
              <span className="course-chip">{t('home.courseCard5Lessons')}</span>
            </div>
            <p className="course-card__text">{t('home.courseCard5Text')}</p>
            <div className="course-card__bottom">
              <span className="course-link">{t('home.courseOpen')}</span>
              <span className="course-arrow">→</span>
            </div>
          </a>

          <a className="course-card course-card--accent" href="/practice">
            <div className="course-card__top">
              <span className="course-card__title">{t('home.courseCard6Title')}</span>
              <span className="course-chip">{t('home.courseCard6Lessons')}</span>
            </div>
            <p className="course-card__text">{t('home.courseCard6Text')}</p>
            <div className="course-card__bottom">
              <span className="course-link">{t('home.courseStart')}</span>
              <span className="course-arrow">→</span>
            </div>
          </a>
        </div>
      </section>

      <section className="cta-section">
        <h2>{t('home.ctaReadyTitle')}</h2>
        <p>{t('home.ctaReadyText')}</p>
        <div className="cta-buttons">
          <a href="/topics" className="cta-btn primary">{t('home.ctaTopics')}</a>
          <a href="/lessons" className="cta-btn secondary">{t('home.ctaAllLessons')}</a>
          <a href="/practice" className="cta-btn success">{t('home.ctaPractice')}</a>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
