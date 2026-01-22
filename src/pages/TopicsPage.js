import { topics } from '../data/topics';
import { useTranslation } from 'react-i18next';
import './TopicsPage.css';

function TopicsPage() {
  const { t } = useTranslation();

  return (
    <div className="topics-page">
      <h1>{t('topicsPage.title')}</h1>
      <p className="subtitle">{t('topicsPage.subtitle')}</p>
      
      <div className="topics-grid">
        {topics.map((topic) => (
          <a key={topic.id} href={`/topic/${topic.slug}`} className="topic-card">
            <div className="topic-body">
              <h2>{t(`topics.${topic.slug}.title`, { defaultValue: topic.title })}</h2>
              <p className="topic-description">
                {t(`topics.${topic.slug}.description`, { defaultValue: topic.description })}
              </p>
              <div className="topic-meta">
                <span className="lesson-count">
                  📚 {topic.lessonsCount}
                </span>
              </div>
            </div>
            <div className="topic-footer">
              <span className="view-lessons">{t('topicsPage.viewLessons')}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default TopicsPage;
