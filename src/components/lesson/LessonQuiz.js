import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/LessonQuiz.css';

export default function LessonQuiz({ questions, onSubmit, previousAnswers = {}, errorOnly = false }) {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(previousAnswers);

  const question = questions[currentIndex];
  const isAnswered = answers[question.id] !== undefined;
  const selectedAnswer = answers[question.id];
  const isCorrect = selectedAnswer !== undefined && selectedAnswer === question.correctAnswer;

  const handleSelectAnswer = (optionIndex) => {
    setAnswers({ ...answers, [question.id]: optionIndex.toString() });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onSubmit(answers);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="lesson-quiz">
      <div className="quiz-header">
        <h2>📋 {t('lessonQuiz.title')} - {errorOnly ? t('lessonQuiz.errorsOnly') : t('lessonQuiz.allQuestions')}</h2>
        <div className="quiz-progress">
          <span>{currentIndex + 1} / {questions.length}</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      </div>

      <div className="quiz-content">
        <div className="question-box">
          <h3>{question.question}</h3>
          <p className="difficulty">{t('lessonQuiz.difficulty')}: {t(`common.difficulty.${question.difficulty}`)}</p>
        </div>

        <div className="options">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              className={`option-btn ${
                selectedAnswer === idx.toString() ? 'selected' : ''
              } ${
                isAnswered && idx === question.correctAnswer ? 'correct' : ''
              } ${
                isAnswered && selectedAnswer === idx.toString() && !isCorrect ? 'wrong' : ''
              }`}
              onClick={() => handleSelectAnswer(idx)}
              disabled={isAnswered}
            >
              <span className="option-label">{String.fromCharCode(65 + idx)}.</span>
              <span className="option-text">{option}</span>
              {isAnswered && idx === question.correctAnswer && <span className="icon">✓</span>}
              {isAnswered && selectedAnswer === idx.toString() && !isCorrect && <span className="icon">✗</span>}
            </button>
          ))}
        </div>

        {isAnswered && (
          <div className={`explanation ${isCorrect ? 'correct' : 'wrong'}`}>
            <h4>{isCorrect ? t('lessonQuiz.correct') : t('lessonQuiz.wrong')}</h4>
            <p>{question.explanation}</p>
          </div>
        )}
      </div>

      <div className="quiz-actions">
        <button 
          className="btn-prev" 
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          ← {t('lessonQuiz.previous')}
        </button>
        <button 
          className="btn-next" 
          onClick={handleNext}
          disabled={!isAnswered}
        >
          {currentIndex === questions.length - 1 ? t('lessonQuiz.finish') : t('lessonQuiz.next')} →
        </button>
      </div>
    </div>
  );
}
