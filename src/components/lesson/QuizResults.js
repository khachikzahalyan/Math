import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/QuizResults.css';

export default function QuizResults({
  score,
  totalQuestions,
  correctCount,
  questions,
  userAnswers,
  onRepeatAll,
  onRepeatErrors,
  previousScore,
}) {
  const { t } = useTranslation();
  const wrongQuestions = questions.filter(
    (q) => userAnswers[q.id] !== undefined && userAnswers[q.id] != q.correctAnswer
  );
  
  const isPass = score >= 70;
  const improvement = previousScore ? score - previousScore : null;

  return (
    <div className="quiz-results">
      <div className={`results-card ${isPass ? 'pass' : 'fail'}`}>
        <div className="results-icon">
          {isPass ? '🎉' : '📚'}
        </div>
        
        <div className="results-header">
          <h2>{isPass ? t('quizResults.success') : t('quizResults.tryAgain')}</h2>
          <div className="score-display">
            <span className="score-number">{score}%</span>
            <span className="score-label">({correctCount}/{totalQuestions} {t('quizResults.correct')})</span>
          </div>
        </div>

        {improvement !== null && (
          <div className={`improvement ${improvement >= 0 ? 'up' : 'down'}`}>
            {improvement > 0 ? '↑' : improvement < 0 ? '↓' : '→'} 
            {Math.abs(improvement)}% {t(`quizResults.improvement.${improvement > 0 ? 'up' : improvement < 0 ? 'down' : 'noChange'}`)}
          </div>
        )}

        <p className="results-message">
          {isPass
            ? t('quizResults.passMessage')
            : t('quizResults.failMessage')}
        </p>
      </div>

      <div className="actions-section">
        <button className="btn btn-primary" onClick={onRepeatAll}>
          🔄 {t('quizResults.repeatAll')}
        </button>
        
        {wrongQuestions.length > 0 && (
          <button className="btn btn-secondary" onClick={onRepeatErrors}>
            ⚠️ {t('quizResults.repeatErrors', { count: wrongQuestions.length })}
          </button>
        )}
      </div>

      <div className="detailed-results">
        <h3>📋 {t('quizResults.detailedResults')}</h3>
        <div className="results-list">
          {questions.map((question, idx) => {
            const userAnswer = userAnswers[question.id];
            const isCorrect = userAnswer === question.correctAnswer;
            
            return (
              <div key={question.id} className={`result-item ${isCorrect ? 'correct' : 'wrong'}`}>
                <div className="result-index">
                  <span className="number">{idx + 1}</span>
                  <span className={`icon ${isCorrect ? 'check' : 'cross'}`}>
                    {isCorrect ? '✓' : '✗'}
                  </span>
                </div>
                
                <div className="result-content">
                  <p className="result-question">{question.question}</p>
                  <div className="result-answer">
                    <span className="user-answer">
                      Ձեր պատասխան: {question.options[userAnswer]}
                    </span>
                    {!isCorrect && (
                      <span className="correct-answer">
                        Ճիշտ պատասխան: {question.options[question.correctAnswer]}
                      </span>
                    )}
                  </div>
                  {!isCorrect && (
                    <p className="explanation">{question.explanation}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
