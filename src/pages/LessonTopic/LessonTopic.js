import { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import topics from '../../data/topics';
import Card from '../../components/Card/Card';
import './LessonTopic.css';

function LessonTopic() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const topic = useMemo(() => topics.find((t) => t.id === topicId), [topicId]);

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

  // Экран с результатами - рецензия ответов
  if (quizCompleted && showReview) {
    const finalScore = Math.round((score / questions.length) * 100);
    return (
      <div className="topic">
        <h1 className="topic__title">{topic.title}</h1>
        
        <section className="topic__section">
          <h2 className="topic__sectionTitle">Իսկության աղյուսակներ</h2>
          
          {/* Все вопросы с рецензией */}
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
                          <div className="topic__reviewOptionContent">
                            <span className="topic__reviewOptionText">{option}</span>
                          </div>
                          {isCorrectOption && <span className="topic__reviewOptionIcon">✓</span>}
                          {isUserSelected && !isCorrect && <span className="topic__reviewOptionIcon">✗</span>}
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
            <div className="topic__resultFinalTitle">Վիկտորինայի արդյունքներ</div>
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
                Նորից փորձել
              </button>
              <button className="topic__button topic__button--primary" onClick={handleNextTopic}>
                {isLastTopic ? 'Անփոփում' : 'Հաջորդ թեմա'}
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
          <h2 className="topic__sectionTitle">Վիկտորինայի արդյունքներ</h2>
          
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
              Պատասխանների ստուգում
            </button>
            <button className="topic__button topic__button--secondary" onClick={handleRetry}>
              Նորից փորձել
            </button>
            <button className="topic__button topic__button--primary" onClick={handleNextTopic}>
              {isLastTopic ? 'Անփոփում' : 'Հաջորդ թեմա'}
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
        <h2 className="topic__sectionTitle">Տեսություն</h2>
        <p className="topic__text">{topic.text}</p>
      </section>

      <section className="topic__section">
        <h2 className="topic__sectionTitle">Օրինակներ</h2>
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
        <h2 className="topic__sectionTitle">Առաջադրանքներ</h2>

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
                <label 
                  key={idx} 
                  className={[
                    'topic__option',
                    selectedOption === idx ? 'topic__option--selected' : ''
                  ].join(' ')}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={idx}
                    checked={selectedOption === idx}
                    onChange={() => handleSelectOption(idx)}
                    disabled={false}
                    className="topic__radio"
                  />
                  <span className="topic__optionLabel">{option}</span>
                </label>
              ))
            ) : (
              <p>Տարբերակներ հասանելի չեն</p>
            )}
          </div>


          {error && (
            <div className="topic__error">
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
