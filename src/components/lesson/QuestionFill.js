import './QuestionFill.css';

function QuestionFill({ question }) {
  return (
    <div className="question-fill">
      <p>{question?.question}</p>
      <input type="text" placeholder="Your answer" />
    </div>
  );
}

export default QuestionFill;
