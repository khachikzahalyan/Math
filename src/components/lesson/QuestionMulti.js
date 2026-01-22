import './QuestionMulti.css';

function QuestionMulti({ question }) {
  return (
    <div className="question-multi">
      <p>{question?.question}</p>
      <div className="options">
        {question?.options?.map((option, idx) => (
          <label key={idx}>
            <input type="checkbox" name={question.id} value={idx} />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}

export default QuestionMulti;
