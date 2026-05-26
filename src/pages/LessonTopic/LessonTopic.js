import { useMemo, useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Lightbulb,
  Trophy,
  RotateCcw,
  ArrowRight,
  CheckCircle2,
  Pencil,
} from 'lucide-react';
import { getTopic, listTopics } from '../../data/topicsRepo';
import { listQuestions } from '../../data/questionsRepo';
import { saveAttempt } from '../../data/progressRepo';
import { useAuth } from '../../auth/AuthContext';
import Card from '../../components/Card/Card';
import TopicEditor from '../../components/TopicEditor/TopicEditor';
import parseTheoryText from '../../utils/parseTheoryText';
import { buildTopicNumberMap } from '../../utils/topicNumber';
import { TheoryBlock } from './TheoryBlock';
import QuizScoreSummary from './QuizScoreSummary';
import QuizReviewSection from './QuizReviewSection';
import TopicQuizActive from './TopicQuizActive';
import './LessonTopic.css';

function LessonTopic() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { user, isTeacher } = useAuth();
  const [showEditor, setShowEditor] = useState(false);

  const [topic, setTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [topicLoading, setTopicLoading] = useState(true);
  const [allTopicsIds, setAllTopicsIds] = useState([]);
  const [allTopics, setAllTopics] = useState([]);

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [error, setError] = useState('');
  const [savedScore10, setSavedScore10] = useState(null);
  const [saveError, setSaveError] = useState('');
  const [startedAt, setStartedAt] = useState(() => Date.now());

  useEffect(() => {
    let cancel = false;
    setTopicLoading(true);
    (async () => {
      try {
        const [t, qs, all] = await Promise.all([
          getTopic(topicId),
          listQuestions(topicId),
          listTopics(),
        ]);
        if (cancel) return;
        setTopic(t);
        setQuestions(qs);
        setAllTopics(all);
        setAllTopicsIds(all.map((x) => x.id));
      } finally {
        if (!cancel) setTopicLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [topicId]);

  const theoryBlocks = useMemo(
    () => (topic ? parseTheoryText(topic.text) : []),
    [topic],
  );

  const topicNumber = useMemo(() => {
    if (!topic || allTopics.length === 0) return '';
    return buildTopicNumberMap(allTopics).get(topic.id) || '';
  }, [topic, allTopics]);

  useEffect(() => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setUserAnswers([]);
    setScore(0);
    setQuizCompleted(false);
    setShowReview(false);
    setError('');
    setSavedScore10(null);
    setSaveError('');
    setStartedAt(Date.now());
  }, [topicId]);

  const currentQuestion = questions[currentQuestionIdx];

  const isLastTopic = useMemo(
    () =>
      allTopicsIds.length > 0 &&
      allTopicsIds[allTopicsIds.length - 1] === topicId,
    [allTopicsIds, topicId],
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

    if (correct) {
      setScore((prev) => prev + 1);
    }

    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedOption(null);
      setError('');
    } else {
      setQuizCompleted(true);
      if (user) {
        const finalScore = score + (correct ? 1 : 0);
        const answers = newAnswers.map((sel, i) => {
          const qq = questions[i];
          return {
            questionId: qq.id,
            selectedOption: sel,
            correctOption: qq.correctOption,
            isCorrect: sel === qq.correctOption,
          };
        });
        saveAttempt(user.uid, {
          topicId: topic.id,
          totalQuestions: questions.length,
          correctAnswers: finalScore,
          answers,
          startedAt,
        })
          .then(({ score10 }) => setSavedScore10(score10))
          .catch(() => setSaveError('Արդյունքը չպահպանվեց։'));
      }
    }
  }, [
    selectedOption,
    currentQuestion,
    currentQuestionIdx,
    userAnswers,
    topic,
    questions,
    user,
    score,
    startedAt,
  ]);

  const handleRetry = useCallback(() => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setUserAnswers([]);
    setScore(0);
    setQuizCompleted(false);
    setShowReview(false);
    setError('');
    setSavedScore10(null);
    setSaveError('');
    setStartedAt(Date.now());
  }, []);

  const handleNextTopic = useCallback(() => {
    const idx = allTopicsIds.indexOf(topicId);
    if (idx >= 0 && idx < allTopicsIds.length - 1) {
      navigate(`/lessons/${allTopicsIds[idx + 1]}`);
    } else {
      navigate('/lessons');
    }
  }, [navigate, topicId, allTopicsIds]);

  const openReview = useCallback(() => setShowReview(true), []);

  if (topicLoading) {
    return <Card title="Բեռնում..." text="" />;
  }

  if (!topic) {
    return <Card title="Շուտով կլինի" text="Ապագայում այստեղ կհայտնվի նյութը" />;
  }

  if (!currentQuestion || questions.length === 0) {
    return <Card title="Շուտով կլինի" text="Հարցերը դեռ հասանելի չեն" />;
  }

  if (quizCompleted && showReview) {
    return (
      <div className="topic">
        <h1 className="topic__title">
          {topicNumber && <span className="topic__titleNum">{topicNumber}</span>}
          {topic.title}
        </h1>

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
            {savedScore10 !== null && (
              <div style={{
                textAlign: 'center', fontSize: 22, fontWeight: 800,
                color: '#0f172a', marginTop: 12,
              }}>
                Գնահատական՝ {savedScore10}/10
              </div>
            )}
            {saveError && (
              <div style={{ textAlign: 'center', color: '#dc2626', marginTop: 8 }}>
                {saveError}
              </div>
            )}

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
        <h1 className="topic__title">
          {topicNumber && <span className="topic__titleNum">{topicNumber}</span>}
          {topic.title}
        </h1>

        <section className="topic__section">
          <h2 className="topic__sectionTitle">
            <Trophy size={20} className="topic__sectionIcon" />
            Վիկտորինայի արդյունքներ
          </h2>

          <QuizScoreSummary score={score} questionCount={questions.length} />
          {savedScore10 !== null && (
            <div style={{
              textAlign: 'center', fontSize: 22, fontWeight: 800,
              color: '#0f172a', marginTop: 12,
            }}>
              Գնահատական՝ {savedScore10}/10
            </div>
          )}
          {saveError && (
            <div style={{ textAlign: 'center', color: '#dc2626', marginTop: 8 }}>
              {saveError}
            </div>
          )}

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <h1 className="topic__title" style={{ margin: 0 }}>
          {topicNumber && <span className="topic__titleNum">{topicNumber}</span>}
          {topic.title}
        </h1>
        {isTeacher && (
          <button
            onClick={() => setShowEditor(true)}
            type="button"
            className="topic__editBtn"
            aria-label="Խմբագրել"
            title="Խմբագրել"
          >
            <Pencil size={14} />
            <span>Խմբագրել</span>
          </button>
        )}
      </div>
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

      {showEditor && (
        <TopicEditor
          topic={topic}
          onClose={() => {
            setShowEditor(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}

export default LessonTopic;
