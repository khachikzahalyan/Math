import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { lessons } from '../data/lessons';
import { topics } from '../data/topics';
import './AllLessonsPage.css';

function AllLessonsPage() {
  const { t } = useTranslation();
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  const filteredLessons = lessons.filter((lesson) => {
    const topicMatch = selectedTopic === 'all' || lesson.topicSlug === selectedTopic;
    const levelMatch = selectedLevel === 'all' || lesson.level === selectedLevel;
    return topicMatch && levelMatch;
  });

  return (
    <div className="all-lessons-page">
      <h1>{t('allLessonsPage.title')}</h1>

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="topic-filter">{t('allLessonsPage.filterTopic')}</label>
          <select
            id="topic-filter"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
          >
            <option value="all">{t('allLessonsPage.filterAllTopics')}</option>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.slug}>
                {topic.title}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="level-filter">{t('allLessonsPage.filterLevel')}</label>
          <select
            id="level-filter"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            <option value="all">{t('allLessonsPage.filterAllLevels')}</option>
            <option value="beginner">{t('common.difficulty.beginner')}</option>
            <option value="intermediate">{t('common.difficulty.intermediate')}</option>
            <option value="advanced">{t('common.difficulty.advanced')}</option>
            <option value="expert">{t('common.difficulty.expert')}</option>
          </select>
        </div>

        <div className="filter-info">
          {filteredLessons.length} {t('allLessonsPage.lessonsCount')}
        </div>
      </div>

      <div className="lessons-grid">
        {filteredLessons.length > 0 ? (
          filteredLessons.map((lesson) => (
            <a key={lesson.id} href={`/lesson/${lesson.slug}`} className="lesson-item">
              <div className="lesson-header">
                <h3>{lesson.title}</h3>
                <span className={`level-badge level-${lesson.level}`}>
                  {t(`common.difficulty.${lesson.level}`)}
                </span>
              </div>
              <p className="lesson-description">{lesson.content.substring(0, 100)}...</p>
              <div className="lesson-meta">
                <span className="topic-name">{lesson.topicSlug}</span>
                <span className="arrow">→</span>
              </div>
            </a>
          ))
        ) : (
          <div className="no-results">
            <p>{t('allLessonsPage.noResults')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllLessonsPage;
