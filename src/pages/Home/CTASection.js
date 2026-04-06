import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import topics from '../../data/topics';

function CTASection({ externalStartCounter = 0 }) {
  const QUIZ_SIZE = 10;
  const QUIZ_TIME = 60;

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

  const shuffle = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const startQuiz = () => {
    const picked = shuffle(allQuestions).slice(0, QUIZ_SIZE);
    setQuestions(picked);
    setCurrentIndex(0);
    setAnswers({});
    setTimeLeft(QUIZ_TIME);
    setIsSubmitted(false);
    setShowReview(false);
    setIsOpen(true);
  };

  const closeQuiz = () => {
    setIsOpen(false);
  };

  const submitQuiz = () => {
    setIsSubmitted(true);
  };

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
  }, [isOpen, isSubmitted, timeLeft]);

  useEffect(() => {
    if (externalStartCounter > 0) {
      startQuiz();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalStartCounter]);

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
    timeLeft <= 10 ? 'text-red-600' : timeLeft <= 30 ? 'text-amber-500' : 'text-slate-700';

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <section className="mx-auto max-w-6xl pb-8 pt-10 md:pb-14 md:pt-14">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
        className="rounded-[24px] border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-sky-50 px-6 py-10 text-center shadow-[0_14px_36px_rgba(79,70,229,0.12)] md:px-10"
      >
        <h2 className="text-3xl font-black text-slate-900 md:text-4xl">Թեստ 1 րոպեում</h2>
        <p className="mx-auto mt-3 max-w-2xl text-slate-600">
          Պատասխանիր մի քանի հարցի և անմիջապես հասկացիր՝ որտեղից սկսել, որ առաջընթացը լինի
          արագ։
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={startQuiz}
            className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_28px_rgba(79,70,229,0.35)] transition hover:-translate-y-0.5 hover:bg-violet-700 hover:text-white hover:shadow-[0_14px_30px_rgba(67,56,202,0.42)]"
          >
            Անցնել փոքր թեստը
          </button>
          <Link
            to="/lessons"
            className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-700"
          >
            Դիտել բոլոր դասերը
          </Link>
        </div>
      </motion.div>

      {isOpen && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-900/45 px-3 py-6">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Թեստ 1 րոպեում</h3>
                {!isSubmitted ? (
                  <p className="text-sm text-slate-500">
                    Հարց {currentIndex + 1}/{questions.length}
                  </p>
                ) : (
                  <p className="text-sm text-slate-500">Արդյունք</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                {!isSubmitted && (
                  <span className={`text-sm font-bold ${timerClass}`}>{formatTimer(timeLeft)}</span>
                )}
                <button
                  type="button"
                  onClick={closeQuiz}
                  className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100"
                  aria-label="Close quiz"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {!isSubmitted && currentQuestion && (
              <div className="space-y-4 px-4 py-4">
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3 text-xs font-semibold text-indigo-700">
                  {currentQuestion.topicTitle}
                </div>

                <h4 className="text-base font-semibold leading-snug text-slate-900">
                  {currentQuestion.question}
                </h4>

                <div className="space-y-2">
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
                        className={`w-full rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                          isSelected
                            ? 'border-indigo-400 bg-indigo-50 text-indigo-900'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/50'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((v) => Math.max(v - 1, 0))}
                    disabled={currentIndex === 0}
                    className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Նախորդը
                  </button>

                  <div className="flex items-center gap-2">
                    {currentIndex < questions.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => setCurrentIndex((v) => Math.min(v + 1, questions.length - 1))}
                        disabled={typeof selected !== 'number'}
                        className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
                      >
                        Հաջորդը
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={submitQuiz}
                        disabled={typeof selected !== 'number'}
                        className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
                      >
                        Ավարտել
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {isSubmitted && (
              <div className="space-y-4 px-4 py-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                  <p className="text-sm text-slate-500">Ձեր արդյունքը</p>
                  <p className="mt-1 text-3xl font-black text-slate-900">
                    {score} / {questions.length}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Պատասխանված՝ <span className="font-semibold text-slate-900">{answeredCount}</span>,
                    չպատասխանված՝ <span className="font-semibold text-rose-600">{unansweredCount}</span>
                  </p>
                  {unansweredCount > 0 && (
                    <p className="mt-1 text-xs text-rose-600">
                      Ժամանակի ավարտից հետո չպատասխանված հարցերը համարվում են սխալ/չպատասխանված։
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReview((v) => !v)}
                    className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-indigo-300 hover:text-indigo-700"
                  >
                    {showReview ? 'Թաքցնել ստուգումը' : 'Ստուգել ճիշտ պատասխանները'}
                  </button>
                  <button
                    type="button"
                    onClick={startQuiz}
                    className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    Նոր թեստ
                  </button>
                </div>

                {showReview && (
                  <div className="max-h-72 space-y-3 overflow-auto pr-1">
                    {questions.map((q, idx) => {
                      const userAnswer = answers[q.uid];
                      const isCorrect = userAnswer === q.correctOption;
                      return (
                        <div
                          key={q.uid}
                          className={`rounded-xl border p-3 text-sm ${
                            isCorrect
                              ? 'border-emerald-200 bg-emerald-50'
                              : 'border-rose-200 bg-rose-50'
                          }`}
                        >
                          <p className="mb-1 font-semibold text-slate-900">
                            {idx + 1}. {q.question}
                          </p>
                          <p className="text-slate-600">
                            Ձեր պատասխանը:{' '}
                            <span className="font-medium">
                              {typeof userAnswer === 'number' ? q.options[userAnswer] : 'Չի պատասխանվել'}
                            </span>
                          </p>
                          <p className="text-slate-600">
                            Ճիշտ պատասխանը:{' '}
                            <span className="font-medium">{q.options[q.correctOption]}</span>
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
