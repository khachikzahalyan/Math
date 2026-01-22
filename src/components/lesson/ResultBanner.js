import './ResultBanner.css';

function ResultBanner({ score }) {
  return (
    <div className="result-banner">
      <h3>Your Score: {score}%</h3>
    </div>
  );
}

export default ResultBanner;
