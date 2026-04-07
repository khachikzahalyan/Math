import { CheckCircle2, XCircle } from 'lucide-react';
import { OPTION_LETTERS } from './lessonTopicConstants';

/**
 * Per-question breakdown after quiz (truth table style).
 */
export default function QuizReviewSection({ questions, userAnswers }) {
  return (
    <div className="topic__review">
      {questions.map((question, idx) => {
        const userAnswer = userAnswers[idx];
        const isCorrect = userAnswer === question.correctOption;
        return (
          <div key={idx} className="topic__reviewQuestion">
            <div className="topic__reviewQuestionHeader">
              <span className="topic__reviewQuestionNumber">Հարց {idx + 1}</span>
              <span
                className={`topic__reviewStatus ${isCorrect ? 'topic__reviewStatus--correct' : 'topic__reviewStatus--wrong'}`}
              >
                {isCorrect ? '✓ Ճիշտ' : '✗ Սխալ'}
              </span>
            </div>

            <div className="topic__reviewQuestionText">{question.question}</div>

            <div className="topic__reviewOptions">
              {question.options.map((option, optIdx) => {
                const isUserSelected = userAnswer === optIdx;
                const isCorrectOption = optIdx === question.correctOption;

                let className = 'topic__reviewOption';
                if (isCorrectOption) {
                  className += ' topic__reviewOption--correct';
                } else if (isUserSelected && !isCorrect) {
                  className += ' topic__reviewOption--wrong';
                }

                return (
                  <div key={optIdx} className={className}>
                    <span
                      className={`topic__reviewLetter ${isCorrectOption ? 'topic__reviewLetter--correct' : ''} ${isUserSelected && !isCorrect ? 'topic__reviewLetter--wrong' : ''}`}
                    >
                      {OPTION_LETTERS[optIdx]}
                    </span>
                    <div className="topic__reviewOptionContent">
                      <span className="topic__reviewOptionText">{option}</span>
                    </div>
                    {isCorrectOption && (
                      <CheckCircle2 size={18} className="topic__reviewIcon topic__reviewIcon--correct" />
                    )}
                    {isUserSelected && !isCorrect && (
                      <XCircle size={18} className="topic__reviewIcon topic__reviewIcon--wrong" />
                    )}
                  </div>
                );
              })}
            </div>

            {userAnswer === undefined && (
              <div className="topic__reviewEmpty">Պատասխան տրված չէ</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
