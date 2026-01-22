import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { lessons } from '../data/lessons';
import { questions } from '../data/questions';
import { updateLessonProgress, getLessonProgress } from '../lib/progressStorage';
import LessonContent from '../components/lesson/LessonContent';
import LessonNav from '../components/lesson/LessonNav';
import LessonQuiz from '../components/lesson/LessonQuiz';
import QuizResults from '../components/lesson/QuizResults';
import '../styles/LessonPage.css';

function LessonPage() {
  const { lessonSlug } = useParams();
  const lesson = lessons.find((l) => l.slug === lessonSlug);
  const lessonQuestions = questions.filter((q) => q.topicSlug === lesson?.topicSlug).slice(0, 10);
  
  const [quizState, setQuizState] = useState('not-started'); // not-started, in-progress, completed
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showErrorsOnly, setShowErrorsOnly] = useState(false);
  const [previousProgress, setPreviousProgress] = useState(null);

  useEffect(() => {
    if (lesson) {
      const prev = getLessonProgress(lesson.slug);
      setPreviousProgress(prev);
    }
  }, [lesson]);

  if (!lesson) {
    return <h1>Դաս չ գտնվել</h1>;
  }

  const handleStartQuiz = () => {
    setQuizState('in-progress');
    setAnswers({});
    setShowErrorsOnly(false);
  };

  const handleSubmitQuiz = (userAnswers) => {
    let correctCount = 0;
    const wrongQuestionIds = [];

    Object.entries(userAnswers).forEach(([questionId, selectedOption]) => {
      const question = lessonQuestions.find((q) => q.id === questionId);
      if (question && question.correctAnswer === parseInt(selectedOption)) {
        correctCount++;
      } else {
        wrongQuestionIds.push(questionId);
      }
    });

    const finalScore = Math.round((correctCount / lessonQuestions.length) * 100);
    setScore(finalScore);
    setAnswers(userAnswers);
    
    // Save progress to localStorage
    updateLessonProgress(
      lesson.slug,
      finalScore >= 70,
      Object.values(userAnswers),
      finalScore,
      wrongQuestionIds
    );

    setQuizState('completed');
  };

  const handleRepeatErrors = () => {
    setShowErrorsOnly(true);
    setQuizState('in-progress');
    setAnswers({});
  };

  const displayQuestions = showErrorsOnly 
    ? lessonQuestions.filter((q) => answers[q.id] !== undefined)
    : lessonQuestions;

  return (
    <div className="lesson-page">
      {quizState === 'not-started' && (
        <>
          <LessonContent lesson={lesson} />
          <div className="lesson-objectives">
            <h2>📚 Այս դասից հետո կանիմ:</h2>
            <ul>
              {lesson.objectives?.map((obj, idx) => (
                <li key={idx}>{obj}</li>
              ))}
            </ul>
          </div>
          <button className="btn-start-quiz" onClick={handleStartQuiz}>
            🎯 Սկսել Քուիզը (10 հարցեր)
          </button>
        </>
      )}

      {quizState === 'in-progress' && (
        <LessonQuiz
          questions={displayQuestions}
          onSubmit={handleSubmitQuiz}
          previousAnswers={answers}
          errorOnly={showErrorsOnly}
        />
      )}

      {quizState === 'completed' && (
        <QuizResults
          score={score}
          totalQuestions={lessonQuestions.length}
          correctCount={Math.round((score / 100) * lessonQuestions.length)}
          questions={lessonQuestions}
          userAnswers={answers}
          onRepeatAll={() => handleStartQuiz()}
          onRepeatErrors={() => handleRepeatErrors()}
          previousScore={previousProgress?.score}
        />
      )}

      {quizState !== 'in-progress' && <LessonNav lessonSlug={lessonSlug} />}
    </div>
  );
}

export default LessonPage;
