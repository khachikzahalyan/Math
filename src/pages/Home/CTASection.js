import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Trophy, X, Zap } from 'lucide-react';
import topics from '../../data/topics';
import { recordQuestionAnswered } from '../../utils/progressStorage';
import './CTASection.css';

const QUIZ_SIZE = 10;
const QUIZ_TIME = 60;

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function CTASection({ externalStartCounter = 0 }) {
  const reduceMotion = useReducedMotion();

  const [isOpen, setIsOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const allQuestions = useMemo(() => {
    return topics
      .flatMap((topic) =>
        (topic.questions || []).map((q) => ({
          ...q,
          topicTitle: topic.title,
          uid: `${topic.id}-${q.id}`,
        })),
      )
      .filter(
        (q) =>
          q.type === 'radio' &&
          Array.isArray(q.options) &&
          q.options.length > 1 &&
          typeof q.correctOption === 'number',
      );
  }, []);

  const currentQuestion = questions[currentIndex];
  const selected = currentQuestion ? answers[currentQuestion.uid] : undefined;

  const submitQuiz = useCallback(() => {
    setIsSubmitted(true);
  }, []);

  const startQuiz = useCallback(() => {
    const picked = shuffleArray(allQuestions).slice(0, QUIZ_SIZE);
    setQuestions(picked);
    setCurrentIndex(0);
    setAnswers({});
    setTimeLeft(QUIZ_TIME);
    setIsSubmitted(false);
    setShowReview(false);
    setIsOpen(true);
  }, [allQuestions]);

  const closeQuiz = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen || isSubmitted) return undefined;

    const timerId = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timerId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [isOpen, isSubmitted]);

  useEffect(() => {
    if (isOpen && !isSubmitted && timeLeft === 0) {
      submitQuiz();
    }
  }, [isOpen, isSubmitted, timeLeft, submitQuiz]);

  useEffect(() => {
    if (externalStartCounter > 0) {
      startQuiz();
    }
  }, [externalStartCounter, startQuiz]);

  useEffect(() => {
    if (!currentQuestion) return;
    const uid = currentQuestion.uid;
    if (typeof answers[uid] === 'number') {
      recordQuestionAnswered(uid);
    }
  }, [answers, currentQuestion]);

  const score = useMemo(() => {
    if (!isSubmitted) return 0;
    return questions.reduce((acc, q) => {
      return acc + (answers[q.uid] === q.correctOption ? 1 : 0);
    }, 0);
  }, [isSubmitted, questions, answers]);

  const answeredCount = useMemo(() => {
    return questions.reduce((acc, q) => {
      return acc + (typeof answers[q.uid] === 'number' ? 1 : 0);
    }, 0);
  }, [questions, answers]);

  const unansweredCount = Math.max(questions.length - answeredCount, 0);

  const timerClass =
    timeLeft <= 10 ? 'quiz-timer--danger' : timeLeft <= 30 ? 'quiz-timer--warn' : '';

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <section className="home-cta quiz-cta mx-auto max-w-6xl pb-2 pt-2 md:pb-4 md:pt-4">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
        className="quiz-cta-card"
      >
        <div className="quiz-cta-card__inner">
          <div className="quiz-cta-card__decor">
            <Trophy className="quiz-cta-card__icon" size={26} strokeWidth={2.2} aria-hidden />
            <div className="quiz-cta-badges">
              <span className="quiz-cta-badge">60 վրկ</span>
              <span className="quiz-cta-badge quiz-cta-badge--cyan">{QUIZ_SIZE} հարց</span>
            </div>
            <Zap className="quiz-cta-card__icon" size={26} strokeWidth={2.2} aria-hidden />
          </div>

          <h2 className="quiz-cta-title">Թեստ 1 րոպեում</h2>
          <p className="quiz-cta-sub">
            Պատասխանեք մի քանի հարցի՝ տեսնելու համար, թե որտեղից սկսել, և առաջընթացը արագացնելու
            համար։
          </p>

          <div className="quiz-cta-actions">
            <button type="button" onClick={startQuiz} className="quiz-cta-btn quiz-cta-btn--primary">
              Անցնել փոքր թեստը
            </button>
            <Link to="/lessons" className="quiz-cta-btn quiz-cta-btn--ghost">
              Դիտել բոլոր դասերը
            </Link>
          </div>
        </div>
      </motion.div>

      {isOpen && (
        <div className="quiz-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="quiz-modal-title">
          <div className="quiz-modal">
            <div className="quiz-modal__head">
              <div>
                <h3 id="quiz-modal-title" className="quiz-modal__title">
                  Թեստ 1 րոպեում
                </h3>
                {!isSubmitted ? (
                  <p className="quiz-modal__meta">
                    Հարց {currentIndex + 1}/{questions.length}
                  </p>
                ) : (
                  <p className="quiz-modal__meta">Արդյունք</p>
                )}
              </div>
              <div className="quiz-modal__right">
                {!isSubmitted && (
                  <span
                    className={['quiz-timer', timerClass].filter(Boolean).join(' ')}
                  >
                    {formatTimer(timeLeft)}
                  </span>
                )}
                <button
                  type="button"
                  onClick={closeQuiz}
                  className="quiz-modal__close"
                  aria-label="Փակել"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {!isSubmitted && currentQuestion && (
              <div className="quiz-modal__body">
                <div className="quiz-topic-pill">{currentQuestion.topicTitle}</div>

                <h4 className="quiz-q">{currentQuestion.question}</h4>

                <div className="quiz-options">
                  {currentQuestion.options.map((option, optionIndex) => {
                    const isSelected = selected === optionIndex;
                    return (
                      <button
                        key={`${currentQuestion.uid}-opt-${optionIndex}`}
                        type="button"
                        onClick={() =>
                          setAnswers((prev) => ({
                            ...prev,
                            [currentQuestion.uid]: optionIndex,
                          }))
                        }
                        className={`quiz-option${isSelected ? ' quiz-option--selected' : ''}`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                <div className="quiz-nav">
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((v) => Math.max(v - 1, 0))}
                    disabled={currentIndex === 0}
                    className="quiz-nav__btn quiz-nav__btn--outline"
                  >
                    Նախորդը
                  </button>

                  <div>
                    {currentIndex < questions.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => setCurrentIndex((v) => Math.min(v + 1, questions.length - 1))}
                        disabled={typeof selected !== 'number'}
                        className="quiz-nav__btn quiz-nav__btn--go"
                      >
                        Հաջորդը
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={submitQuiz}
                        disabled={typeof selected !== 'number'}
                        className="quiz-nav__btn quiz-nav__btn--go"
                      >
                        Ավարտել
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {isSubmitted && (
              <div className="quiz-result">
                <div className="quiz-result__box">
                  <p className="quiz-result__label">Ձեր արդյունքը</p>
                  <p className="quiz-result__score">
                    {score} / {questions.length}
                  </p>
                  <p className="quiz-result__detail">
                    Պատասխանված՝ <strong>{answeredCount}</strong>, չպատասխանված՝{' '}
                    <strong className="quiz-result__bad-count">{unansweredCount}</strong>
                  </p>
                  {unansweredCount > 0 && (
                    <p className="quiz-result__warn">
                      Ժամանակի ավարտից հետո չպատասխանված հարցերը համարվում են սխալ/չպատասխանված։
                    </p>
                  )}
                </div>

                <div className="quiz-result__actions">
                  <button
                    type="button"
                    onClick={() => setShowReview((v) => !v)}
                    className="quiz-result__btn"
                  >
                    {showReview ? 'Թաքցնել ստուգումը' : 'Ստուգել ճիշտ պատասխանները'}
                  </button>
                  <button type="button" onClick={startQuiz} className="quiz-result__btn quiz-result__btn--primary">
                    Նոր թեստ
                  </button>
                </div>

                {showReview && (
                  <div className="quiz-review">
                    {questions.map((q, idx) => {
                      const userAnswer = answers[q.uid];
                      const isCorrect = userAnswer === q.correctOption;
                      return (
                        <div
                          key={q.uid}
                          className={`quiz-review__item ${
                            isCorrect ? 'quiz-review__item--ok' : 'quiz-review__item--bad'
                          }`}
                        >
                          <p className="quiz-review__q">
                            {idx + 1}. {q.question}
                          </p>
                          <p className="quiz-review__line">
                            Ձեր պատասխանը՝{' '}
                            <span className="quiz-review__em">
                              {typeof userAnswer === 'number' ? q.options[userAnswer] : 'Չի պատասխանվել'}
                            </span>
                          </p>
                          <p className="quiz-review__line">
                            Ճիշտ պատասխանը՝{' '}
                            <span className="quiz-review__em">{q.options[q.correctOption]}</span>
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default CTASection;
