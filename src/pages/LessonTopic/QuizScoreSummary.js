/**
 * Shared score row used after quiz completion and inside full review.
 */
export default function QuizScoreSummary({ score, questionCount }) {
  const finalScore = Math.round((score / questionCount) * 100);
  return (
    <div className="topic__result">
      <div className="topic__resultItem">
        <span>Ճիշտ պատասխաններ՝</span>
        <b>
          {score} / {questionCount}
        </b>
      </div>
      <div className="topic__resultItem">
        <span>Վերջնական միավորը՝</span>
        <b>{finalScore} / 100</b>
      </div>
    </div>
  );
}
