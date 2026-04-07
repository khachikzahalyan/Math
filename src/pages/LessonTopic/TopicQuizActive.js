import { memo } from 'react';
import { GraduationCap, AlertCircle } from 'lucide-react';
import { OPTION_LETTERS } from './lessonTopicConstants';

/**
 * In-progress quiz: progress bar, question, options, submit.
 */
function TopicQuizActive({
  questions,
  currentQuestionIdx,
  currentQuestion,
  selectedOption,
  error,
  onSelectOption,
  onSubmitAnswer,
}) {
  const progress = currentQuestionIdx + 1;

  return (
    <section className="topic__section">
      <h2 className="topic__sectionTitle">
        <GraduationCap size={20} className="topic__sectionIcon" />
        Առաջադրանքներ
      </h2>

      <div className="topic__progress">
        <div className="topic__progressLabel">
          Հարց {progress} / {questions.length}
        </div>
        <div className="topic__progressBar">
          <div
            className="topic__progressFill"
            style={{ width: `${(progress / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="topic__questionCard">
        <div className="topic__questionText">{currentQuestion.question}</div>

        <div className="topic__options">
          {currentQuestion.options && currentQuestion.options.length > 0 ? (
            currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                type="button"
                className={[
                  'topic__option',
                  selectedOption === idx ? 'topic__option--selected' : '',
                ].join(' ')}
                onClick={() => onSelectOption(idx)}
              >
                <span
                  className={[
                    'topic__optionLetter',
                    selectedOption === idx ? 'topic__optionLetter--selected' : '',
                  ].join(' ')}
                >
                  {OPTION_LETTERS[idx]}
                </span>
                <span className="topic__optionLabel">{option}</span>
              </button>
            ))
          ) : (
            <p>Տարբերակներ հասանելի չեն</p>
          )}
        </div>

        {error && (
          <div className="topic__error">
            <AlertCircle size={16} />
            {error}
          </div>
        )}
      </div>

      <div className="topic__actions">
        <button type="button" className="topic__button topic__button--primary" onClick={onSubmitAnswer}>
          Պատասխանել
        </button>
      </div>
    </section>
  );
}

export default memo(TopicQuizActive);
