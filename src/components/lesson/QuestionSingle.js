import './QuestionSingle.css';

function QuestionSingle({ question }) {
  return (
    <div className="question-single">
      <p>{question?.question}</p>
      <div className="options">
        {question?.options?.map((option, idx) => (
          <label key={idx}>
            <input type="radio" name={question.id} value={idx} />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}

export default QuestionSingle;
