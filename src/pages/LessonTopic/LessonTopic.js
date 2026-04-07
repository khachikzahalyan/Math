import { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Lightbulb, GraduationCap, Trophy, RotateCcw, ArrowRight, CheckCircle2, XCircle, AlertCircle, CircleCheck, CircleX, AlertTriangle, Info } from 'lucide-react';
import topics from '../../data/topics';
import { recordQuestionAnswered } from '../../utils/progressStorage';
import Card from '../../components/Card/Card';
import parseTheoryText from '../../utils/parseTheoryText';
import './LessonTopic.css';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

const CALLOUT_ICONS = {
  positive: CircleCheck,
  negative: CircleX,
  warning: AlertTriangle,
  info: Info,
};

function renderInline(text) {
  if (!text || !text.includes('**')) return text;
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );
}

function TheoryBlock({ block }) {
  switch (block.type) {
    case 'heading':
      return <h3 className="theory__heading">{block.content}</h3>;

    case 'paragraph':
      return <p className="theory__paragraph">{renderInline(block.content)}</p>;

    case 'bullets':
      return (
        <ul className="theory__bullets">
          {block.items.map((item, i) => (
            <li key={i} className="theory__bulletItem">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );

    case 'numbered':
      return (
        <ol className="theory__numbered">
          {block.items.map((item, i) => (
            <li key={i} className="theory__numberedItem">
              <span className="theory__stepNum">{i + 1}</span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ol>
      );

    case 'callout': {
      const variantClass = `theory__callout--${block.variant}`;
      const CalloutIcon = CALLOUT_ICONS[block.variant] || Info;
      return (
        <div className={`theory__callout ${variantClass}`}>
          <div className="theory__calloutHeader">
            <span className={`theory__calloutIcon theory__calloutIcon--${block.variant}`}>
              <CalloutIcon size={18} />
            </span>
            <span className="theory__calloutTitle">{block.title}</span>
          </div>
          {block.body && (
            <div className="theory__calloutBody">
              {block.body.type === 'bullets' && (
                <ul className="theory__bullets">
                  {block.body.items.map((item, i) => (
                    <li key={i} className="theory__bulletItem">
                      {renderInline(item)}
                    </li>
                  ))}
                </ul>
              )}
              {block.body.type === 'numbered' && (
                <ol className="theory__numbered">
                  {block.body.items.map((item, i) => (
                    <li key={i} className="theory__numberedItem">
                      <span className="theory__stepNum">{i + 1}</span>
                      <span>{renderInline(item)}</span>
                    </li>
                  ))}
                </ol>
              )}
              {block.body.type === 'text' && (
                <p className="theory__paragraph">{renderInline(block.body.content)}</p>
              )}
            </div>
          )}
        </div>
      );
    }

    default:
      return null;
  }
}

function LessonTopic() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const topic = useMemo(() => topics.find((t) => t.id === topicId), [topicId]);
  const theoryBlocks = useMemo(
    () => (topic ? parseTheoryText(topic.text) : []),
    [topic]
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

  if (!topic) {
    return <Card title="Շուտով կլինի" text="Ապագայում այստեղ կհայտնվի նյութը" />;
  }

  const questions = topic.questions || [];
  const currentQuestion = questions[currentQuestionIdx];
  const progress = currentQuestionIdx + 1;

  if (!currentQuestion || questions.length === 0) {
    return <Card title="Շուտով կլինի" text="Հարցերը դեռ հասանելի չեն" />;
  }

  const handleSelectOption = (optionIdx) => {
    setSelectedOption(optionIdx);
    setError('');
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) {
      setError('Ընտրեք պատասխանը');
      return;
    }

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
  };



  const handleRetry = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setUserAnswers([]);
    setScore(0);
    setQuizCompleted(false);
    setShowReview(false);
    setError('');
  };

  const handleNextTopic = () => {
    const currentIdx = topics.findIndex((t) => t.id === topicId);
    if (currentIdx < topics.length - 1) {
      const nextTopic = topics[currentIdx + 1];
      navigate(`/lessons/${nextTopic.id}`);
    } else {
      // Последняя тема - переходим на страницу уроков
      navigate('/lessons');
    }
  };

  const isLastTopic = topics.findIndex((t) => t.id === topicId) === topics.length - 1;

  if (quizCompleted && showReview) {
    const finalScore = Math.round((score / questions.length) * 100);
    return (
      <div className="topic">
        <h1 className="topic__title">{topic.title}</h1>
        
        <section className="topic__section">
          <h2 className="topic__sectionTitle">
            <CheckCircle2 size={20} className="topic__sectionIcon" />
            Ճշմարտության աղյուսակներ
          </h2>
          <div className="topic__review">
            {questions.map((question, idx) => {
              const userAnswer = userAnswers[idx];
              const isCorrect = userAnswer === question.correctOption;
              return (
                <div key={idx} className="topic__reviewQuestion">
                  <div className="topic__reviewQuestionHeader">
                    <span className="topic__reviewQuestionNumber">Հարց {idx + 1}</span>
                    <span className={`topic__reviewStatus ${isCorrect ? 'topic__reviewStatus--correct' : 'topic__reviewStatus--wrong'}`}>
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
                          <span className={`topic__reviewLetter ${isCorrectOption ? 'topic__reviewLetter--correct' : ''} ${isUserSelected && !isCorrect ? 'topic__reviewLetter--wrong' : ''}`}>
                            {LETTERS[optIdx]}
                          </span>
                          <div className="topic__reviewOptionContent">
                            <span className="topic__reviewOptionText">{option}</span>
                          </div>
                          {isCorrectOption && <CheckCircle2 size={18} className="topic__reviewIcon topic__reviewIcon--correct" />}
                          {isUserSelected && !isCorrect && <XCircle size={18} className="topic__reviewIcon topic__reviewIcon--wrong" />}
                        </div>
                      );
                    })}
                  </div>
                  
                  {userAnswer === undefined && (
                    <div className="topic__reviewEmpty">
                      Պատասխան տրված չէ
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="topic__resultFinal">
            <div className="topic__resultFinalTitle">
              <Trophy size={22} className="topic__sectionIcon" />
              Վիկտորինայի արդյունքներ
            </div>
            <div className="topic__result">
              <div className="topic__resultItem">
                <span>Ճիշտ պատասխաններ՝</span>
                <b>{score} / {questions.length}</b>
              </div>
              <div className="topic__resultItem">
                <span>Վերջնական միավորը՝</span>
                <b>{finalScore} / 100</b>
              </div>
            </div>

            <div className="topic__resultActions">
              <button className="topic__button topic__button--secondary" onClick={handleRetry}>
                <RotateCcw size={16} />
                Նորից փորձել
              </button>
              <button className="topic__button topic__button--primary" onClick={handleNextTopic}>
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
    const finalScore = Math.round((score / questions.length) * 100);
    return (
      <div className="topic">
        <h1 className="topic__title">{topic.title}</h1>
        
        <section className="topic__section">
          <h2 className="topic__sectionTitle">
            <Trophy size={20} className="topic__sectionIcon" />
            Վիկտորինայի արդյունքներ
          </h2>
          
          <div className="topic__result">
            <div className="topic__resultItem">
              <span>Ճիշտ պատասխաններ՝</span>
              <b>{score} / {questions.length}</b>
            </div>
            <div className="topic__resultItem">
              <span>Վերջնական միավորը՝</span>
              <b>{finalScore} / 100</b>
            </div>
          </div>

          <div className="topic__resultActions">
            <button 
              className="topic__button topic__button--primary" 
              onClick={() => setShowReview(true)}
            >
              <CheckCircle2 size={16} />
              Պատասխանների ստուգում
            </button>
            <button className="topic__button topic__button--secondary" onClick={handleRetry}>
              <RotateCcw size={16} />
              Նորից փորձել
            </button>
            <button className="topic__button topic__button--primary" onClick={handleNextTopic}>
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

      <section className="topic__section">
        <h2 className="topic__sectionTitle">
            <GraduationCap size={20} className="topic__sectionIcon" />
            Առաջադրանքներ
          </h2>

        <div className="topic__progress">
          <div className="topic__progressLabel">
            Հարց {progress} / {questions.length}
          </div>
          <div className="topic__progressBar">
            <div 
              className="topic__progressFill" 
              style={{ width: `${(progress / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="topic__questionCard">
          <div className="topic__questionText">
            {currentQuestion.question}
          </div>

          <div className="topic__options">
            {currentQuestion.options && currentQuestion.options.length > 0 ? (
              currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={[
                    'topic__option',
                    selectedOption === idx ? 'topic__option--selected' : ''
                  ].join(' ')}
                  onClick={() => handleSelectOption(idx)}
                >
                  <span className={[
                    'topic__optionLetter',
                    selectedOption === idx ? 'topic__optionLetter--selected' : ''
                  ].join(' ')}>
                    {LETTERS[idx]}
                  </span>
                  <span className="topic__optionLabel">{option}</span>
                </button>
              ))
            ) : (
              <p>Տարբերակներ հասանելի չեն</p>
            )}
          </div>


          {error && (
            <div className="topic__error">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
        </div>

        <div className="topic__actions">
          <button 
            className="topic__button topic__button--primary" 
            onClick={handleSubmitAnswer}
          >
            Պատասխանել
          </button>
        </div>
      </section>
    </div>
  );
}

export default LessonTopic;
