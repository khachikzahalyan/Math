import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import QuestionSingle from './QuestionSingle';
import QuestionMulti from './QuestionMulti';
import QuestionFill from './QuestionFill';
import './QuizBlock.css';

function QuizBlock({ questions, onComplete }) {
  const { t } = useTranslation();
  const [answers, setAnswers] = useState({});

  const handleSubmit = () => {
    if (onComplete) onComplete(answers);
  };

  return (
    <section className="quiz-block">
      <h2>{t('common.questions')}</h2>
      {questions.map((question) => (
        <div key={question.id} className="question-wrapper">
          {question.type === 'single' && <QuestionSingle question={question} />}
          {question.type === 'multi' && <QuestionMulti question={question} />}
          {question.type === 'fill' && <QuestionFill question={question} />}
        </div>
      ))}
      <button onClick={handleSubmit}>{t('common.submit')}</button>
    </section>
  );
}

export default QuizBlock;
