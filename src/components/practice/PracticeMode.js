import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/PracticeMode.css';

export default function PracticeMode({ mode, tasks, onExit }) {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [completed, setCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(mode.timeLimit ? mode.timeLimit * 60 : null);
  const [showExplanation, setShowExplanation] = useState(false);
  // Պատասխանը (բանաձևը) չպետք է երևա անմիջապես, միայն սեղմումից հետո
  const [showFormula, setShowFormula] = useState(false);

  const currentTask = tasks[currentIndex];

  useEffect(() => {
    if (!timeLeft || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [currentTask.id]: value });
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentIndex < tasks.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowExplanation(false);
      setShowFormula(false);
    } else {
      setCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowExplanation(false);
      setShowFormula(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const score = Object.keys(answers).length;
  const progressPercent = ((currentIndex + 1) / tasks.length) * 100;

  if (completed) {
    return (
      <div className="practice-results">
        <div className="result-card pass">
          <div className="result-icon">🎉</div>
          <h2>{t('practiceMode.completedTitle')}</h2>
          <div className="score-display">
            <span className="score-number">{score}/{tasks.length}</span>
            <span className="score-label">{t('practiceMode.scoreLabel')}</span>
          </div>
          <p>{t('practiceMode.completedMessage')}</p>
          <button className="btn-exit" onClick={onExit}>{t('practiceMode.backToPractice')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="practice-mode">
      <div className="mode-header">
        <h2>{mode.name}</h2>
        <button className="btn-close" onClick={onExit}>✕</button>
      </div>

      <div className="mode-stats">
        <div className="stat">
          <span className="stat-label">{t('practiceMode.taskLabel')}</span>
          <span className="stat-value">{currentIndex + 1}/{tasks.length}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
        {mode.timeLimit && (
          <div className={`stat time ${timeLeft < 300 ? 'warning' : ''}`}>
            <span className="stat-label">{t('practiceMode.timeLeftLabel')}</span>
            <span className="stat-value">{formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      <div className="task-container">
        <div className="task-question">
          <h3>{currentTask.question}</h3>
        </div>

        <div className="task-content">
          {currentTask.type === 'equivalence' && (
            <div className="equivalence-task">
              <p>{t('practiceMode.equivalenceIntro')}</p>
              <table className="truth-table">
                <thead>
                  <tr>
                    <th>P</th>
                    <th>Q</th>
                    <th>{currentTask.formula1}</th>
                    <th>{currentTask.formula2}</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTask.table?.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.P}</td>
                      <td>{row.Q}</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="option-buttons">
                <button 
                  className={`opt-btn ${answers[currentTask.id] === 'yes' ? 'selected' : ''}`}
                  onClick={() => handleAnswer('yes')}
                >
                  ✓ {t('practiceMode.equivalenceYes')}
                </button>
                <button 
                  className={`opt-btn ${answers[currentTask.id] === 'no' ? 'selected' : ''}`}
                  onClick={() => handleAnswer('no')}
                >
                  ✗ {t('practiceMode.equivalenceNo')}
                </button>
              </div>
            </div>
          )}

          {currentTask.type === 'textToFormula' && (
            <div className="text-formula-task">
              <p className="task-text">"{currentTask.text}"</p>
              <div className="variable-mapping">
                <h4>{t('practiceMode.variablesTitle')}</h4>
                {Object.entries(currentTask.vars).map(([key, value]) => (
                  <p key={key}>
                    <strong>{key}</strong> = {value}
                  </p>
                ))}
              </div>

                {!showFormula ? (
                <button className="btn-copy" onClick={() => setShowFormula(true)}>
                  👀 {t('practiceMode.showAnswer')}
                </button>
              ) : (
                <>
                  <p className="formula-answer">{t('practiceMode.answerLabel')} <strong>{currentTask.formula}</strong></p>
                  <button
                    className="btn-copy"
                    onClick={() => navigator.clipboard.writeText(currentTask.formula)}
                  >
                    📋 {t('practiceMode.copyFormula')}
                  </button>
                </>
              )}
            </div>
          )}

          {currentTask.type === 'tautology' && (
            <div className="tautology-task">
              <p>{t('practiceMode.formulaLabel')} <strong>{currentTask.formula}</strong></p>
              <div className="option-buttons">
                <button 
                  className={`opt-btn ${answers[currentTask.id] === 'yes' ? 'selected' : ''}`}
                  onClick={() => handleAnswer('yes')}
                >
                  ✓ Այո, տավտոլոգիա է
                </button>
                <button 
                  className={`opt-btn ${answers[currentTask.id] === 'no' ? 'selected' : ''}`}
                  onClick={() => handleAnswer('no')}
                >
                  ✗ Ոչ
                </button>
              </div>
            </div>
          )}

          {currentTask.type === 'normalForm' && (
            <div className="normal-form-task">
              <p>Բանաձև: <strong>{currentTask.formula}</strong></p>
              <p>{t('practiceMode.toNormalForm', { form: currentTask.targetForm })}</p>
              <input 
                type="text" 
                placeholder={t('practiceMode.normalFormPlaceholder')}
                value={answers[currentTask.id] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
              />
            </div>
          )}

          {currentTask.type === 'truthTable' && (
            <div className="truth-table-task">
              <p>{t('practiceMode.fillTruthTable')}</p>
              <table className="truth-table">
                <thead>
                  <tr>
                    <th>P</th>
                    <th>Q</th>
                    <th>P ∧ Q</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTask.table?.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.P}</td>
                      <td>{row.Q}</td>
                      <td>
                        <input 
                          type="checkbox"
                          onChange={() => {}}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showExplanation && answers[currentTask.id] !== undefined && (
          <div className="explanation">
            <h4>💡 {t('practiceMode.explanationTitle')}</h4>
            <p>
              {currentTask.type === 'tautology' &&
                (currentTask.isTautology
                  ? t('practiceMode.explanationTautologyYes', { formula: currentTask.formula })
                  : t('practiceMode.explanationTautologyNo'))}
              {currentTask.type === 'equivalence' &&
                t('practiceMode.explanationEquivalence')}
              {currentTask.type === 'textToFormula' &&
                t('practiceMode.explanationTextToFormula', {
                  text: currentTask.text,
                  formula: currentTask.formula,
                })}
            </p>
          </div>
        )}
      </div>

      <div className="mode-actions">
        <button 
          className="btn-prev" 
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          {t('practiceMode.prev')}
        </button>
        <button 
          className="btn-next" 
          onClick={handleNext}
          disabled={answers[currentTask.id] === undefined}
        >
          {currentIndex === tasks.length - 1
            ? t('practiceMode.finish')
            : t('practiceMode.next')}
        </button>
      </div>
    </div>
  );
}
