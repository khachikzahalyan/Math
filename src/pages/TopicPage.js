import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { lessons } from '../data/lessons';
import { topics } from '../data/topics';
import { questions } from '../data/questions';
import './TopicPage.css';

function TopicPage() {
  const { t } = useTranslation();
  const { topicSlug } = useParams();
  const topic = topics.find((t) => t.slug === topicSlug);
  const topicLessons = lessons.filter((lesson) => lesson.topicSlug === topicSlug);
  const topicQuestions = questions.filter((q) => q.topicSlug === topicSlug);
  
  const [expandedAnswers, setExpandedAnswers] = useState(new Set());

  const toggleAnswer = (questionId) => {
    const newSet = new Set(expandedAnswers);
    if (newSet.has(questionId)) {
      newSet.delete(questionId);
    } else {
      newSet.add(questionId);
    }
    setExpandedAnswers(newSet);
  };

  if (!topic) {
    return <div>{t('topicPage.notFound')}</div>;
  }

  return (
    <div className="topic-page">
      <div className="topic-header">
        <h1>{topic.title}</h1>
        <p className="topic-description">{topic.description}</p>
        <div className="topic-meta">
          <span className={`level-badge level-${topic.level}`}>{t(`common.difficulty.${topic.level}`)}</span>
          <span className="lessons-count">{topic.lessonsCount} {t('topicPage.lessons')}</span>
        </div>
      </div>

      <div className="topic-content">
        <section className="lessons-section">
          <h2>{t('topicPage.lessonsTitle')}</h2>
          <div className="lessons-list">
            {topicLessons.map((lesson) => (
              <div key={lesson.id} className="lesson-card">
                <h3>{lesson.title}</h3>
                <p className="lesson-level">{t('topicPage.level')}: {t(`common.difficulty.${lesson.level}`)}</p>
                <p className="lesson-content">{lesson.content.substring(0, 150)}...</p>
                <p className="lesson-objectives"><strong>{t('topicPage.objectives')}:</strong> {lesson.objectives}</p>
                <a href={`/lesson/${lesson.slug}`} className="btn btn-primary">{t('topicPage.explore')}</a>
              </div>
            ))}
          </div>
        </section>

        <section className="questions-section">
          <h2>{t('topicPage.practiceTitle', { count: topicQuestions.length })}</h2>
          <div className="questions-container">
            {topicQuestions.map((q, index) => (
              <div key={q.id} className="question-card">
                <div className="question-header">
                  <span className="question-number">{t('topicPage.question')} {index + 1}</span>
                  <button 
                    className={`expand-btn ${expandedAnswers.has(q.id) ? 'expanded' : ''}`}
                    onClick={() => toggleAnswer(q.id)}
                  >
                    {expandedAnswers.has(q.id) ? '▼' : '▶'} {t('topicPage.answer')}
                  </button>
                </div>
                
                <div className="question-text">
                  <p><strong>{q.question}</strong></p>
                </div>

                <div className="options">
                  {q.options.map((option, idx) => (
                    <div
                      key={idx}
                      className={`option ${
                        expandedAnswers.has(q.id) && idx === parseInt(q.correctAnswer)
                          ? 'correct'
                          : ''
                      }`}
                    >
                      <input 
                        type="radio" 
                        id={`q${q.id}-opt${idx}`}
                        name={`question-${q.id}`}
                        value={idx}
                      />
                      <label htmlFor={`q${q.id}-opt${idx}`}>{option}</label>
                    </div>
                  ))}
                </div>

                {expandedAnswers.has(q.id) && (
                  <div className="answer-section">
                    <div className="correct-answer">
                      <strong>✓ {t('topicPage.correctAnswer')}:</strong> {q.options[q.correctAnswer]}
                    </div>
                    <div className="explanation">
                      <strong>{t('topicPage.explanation')}:</strong> {q.explanation}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default TopicPage;
