import { useMemo, useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Lightbulb,
  Trophy,
  RotateCcw,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import topics from '../../data/topics';
import { recordQuestionAnswered } from '../../utils/progressStorage';
import Card from '../../components/Card/Card';
import parseTheoryText from '../../utils/parseTheoryText';
import { TheoryBlock } from './TheoryBlock';
import QuizScoreSummary from './QuizScoreSummary';
import QuizReviewSection from './QuizReviewSection';
import TopicQuizActive from './TopicQuizActive';
import './LessonTopic.css';

function LessonTopic() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const topic = useMemo(() => topics.find((t) => t.id === topicId), [topicId]);
  const theoryBlocks = useMemo(
    () => (topic ? parseTheoryText(topic.text) : []),
    [topic],
  );

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setUserAnswers([]);
    setScore(0);
    setQuizCompleted(false);
    setShowReview(false);
    setError('');
  }, [topicId]);

  const questions = topic?.questions || [];
  const currentQuestion = questions[currentQuestionIdx];
  const isLastTopic = useMemo(
    () =>
      topic != null &&
      topics.findIndex((t) => t.id === topicId) === topics.length - 1,
    [topic, topicId],
  );

  const handleSelectOption = useCallback((optionIdx) => {
    setSelectedOption(optionIdx);
    setError('');
  }, []);

  const handleSubmitAnswer = useCallback(() => {
    if (selectedOption === null) {
      setError('Ընտրեք պատասխանը');
      return;
    }
    if (!topic || !currentQuestion) return;

    const correct = selectedOption === currentQuestion.correctOption;
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIdx] = selectedOption;
    setUserAnswers(newAnswers);
    recordQuestionAnswered(`${topic.id}-${currentQuestion.id}`);

    if (correct) {
      setScore((prev) => prev + 1);
    }

    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedOption(null);
      setError('');
    } else {
      setQuizCompleted(true);
    }
  }, [
    selectedOption,
    currentQuestion,
    currentQuestionIdx,
    userAnswers,
    topic,
    questions.length,
  ]);

  const handleRetry = useCallback(() => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setUserAnswers([]);
    setScore(0);
    setQuizCompleted(false);
    setShowReview(false);
    setError('');
  }, []);

  const handleNextTopic = useCallback(() => {
    const currentIdx = topics.findIndex((t) => t.id === topicId);
    if (currentIdx < topics.length - 1) {
      const nextTopic = topics[currentIdx + 1];
      navigate(`/lessons/${nextTopic.id}`);
    } else {
      navigate('/lessons');
    }
  }, [navigate, topicId]);

  const openReview = useCallback(() => setShowReview(true), []);

  if (!topic) {
    return <Card title="Շուտով կլինի" text="Ապագայում այստեղ կհայտնվի նյութը" />;
  }

  if (!currentQuestion || questions.length === 0) {
    return <Card title="Շուտով կլինի" text="Հարցերը դեռ հասանելի չեն" />;
  }

  if (quizCompleted && showReview) {
    return (
      <div className="topic">
        <h1 className="topic__title">{topic.title}</h1>

        <section className="topic__section">
          <h2 className="topic__sectionTitle">
            <CheckCircle2 size={20} className="topic__sectionIcon" />
            Ճշմարտության աղյուսակներ
          </h2>
          <QuizReviewSection questions={questions} userAnswers={userAnswers} />

          <div className="topic__resultFinal">
            <div className="topic__resultFinalTitle">
              <Trophy size={22} className="topic__sectionIcon" />
              Վիկտորինայի արդյունքներ
            </div>
            <QuizScoreSummary score={score} questionCount={questions.length} />

            <div className="topic__resultActions">
              <button type="button" className="topic__button topic__button--secondary" onClick={handleRetry}>
                <RotateCcw size={16} />
                Նորից փորձել
              </button>
              <button type="button" className="topic__button topic__button--primary" onClick={handleNextTopic}>
                {isLastTopic ? 'Դասեր' : 'Հաջորդ թեմա'}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="topic">
        <h1 className="topic__title">{topic.title}</h1>

        <section className="topic__section">
          <h2 className="topic__sectionTitle">
            <Trophy size={20} className="topic__sectionIcon" />
            Վիկտորինայի արդյունքներ
          </h2>

          <QuizScoreSummary score={score} questionCount={questions.length} />

          <div className="topic__resultActions">
            <button type="button" className="topic__button topic__button--primary" onClick={openReview}>
              <CheckCircle2 size={16} />
              Պատասխանների ստուգում
            </button>
            <button type="button" className="topic__button topic__button--secondary" onClick={handleRetry}>
              <RotateCcw size={16} />
              Նորից փորձել
            </button>
            <button type="button" className="topic__button topic__button--primary" onClick={handleNextTopic}>
              {isLastTopic ? 'Դասեր' : 'Հաջորդ թեմա'}
              <ArrowRight size={16} />
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="topic">
      <h1 className="topic__title">{topic.title}</h1>
      <p className="topic__description">{topic.description}</p>

      <section className="topic__section">
        <h2 className="topic__sectionTitle">
          <BookOpen size={20} className="topic__sectionIcon" />
          Տեսություն
        </h2>
        <div className="topic__theory">
          {theoryBlocks.map((block, idx) => (
            <TheoryBlock key={idx} block={block} />
          ))}
        </div>
      </section>

      <section className="topic__section">
        <h2 className="topic__sectionTitle">
          <Lightbulb size={20} className="topic__sectionIcon" />
          Օրինակներ
        </h2>
        <ul className="topic__list">
          {topic.examples && topic.examples.length > 0 ? (
            topic.examples.map((ex, idx) => (
              <li key={idx} className="topic__listItem">
                {ex}
              </li>
            ))
          ) : (
            <li className="topic__listItem">Օրինակներ հասանելի չեն</li>
          )}
        </ul>
      </section>

      <TopicQuizActive
        questions={questions}
        currentQuestionIdx={currentQuestionIdx}
        currentQuestion={currentQuestion}
        selectedOption={selectedOption}
        error={error}
        onSelectOption={handleSelectOption}
        onSubmitAnswer={handleSubmitAnswer}
      />
    </div>
  );
}

export default LessonTopic;
