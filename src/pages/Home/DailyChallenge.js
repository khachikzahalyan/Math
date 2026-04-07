import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CalendarCheck2, CheckCircle2, XCircle } from 'lucide-react';
import { getDailyQuestion } from '../../utils/dailyQuestion';
import { recordQuestionAnswered } from '../../utils/progressStorage';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

function DailyChallenge() {
  const reduceMotion = useReducedMotion();
  const question = useMemo(() => getDailyQuestion(), []);
  const [picked, setPicked] = useState(null);

  if (!question) return null;

  const correct = picked !== null && picked === question.correctOption;

  return (
    <section className="daily-challenge" aria-labelledby="daily-heading">
      <div className="daily-challenge__head">
        <CalendarCheck2 className="daily-challenge__headIcon" size={22} strokeWidth={2} aria-hidden />
        <div>
          <h2 id="daily-heading" className="daily-challenge__title">
            Օրվա խնդիր
          </h2>
          <p className="daily-challenge__topic">{question.topicTitle}</p>
        </div>
      </div>

      <p className="daily-challenge__q">{question.question}</p>

      <div className="daily-challenge__options">
        {question.options.map((opt, idx) => {
          const letter = LETTERS[idx] || String(idx + 1);
          const isPicked = picked === idx;
          const isCorrectOpt = idx === question.correctOption;
          let cls = 'daily-challenge__opt';
          if (picked !== null) {
            if (isCorrectOpt) cls += ' daily-challenge__opt--correct';
            else if (isPicked && !isCorrectOpt) cls += ' daily-challenge__opt--wrong';
          } else if (isPicked) cls += ' daily-challenge__opt--picked';

          return (
            <motion.button
              key={idx}
              type="button"
              disabled={picked !== null}
              onClick={() => {
                setPicked(idx);
                recordQuestionAnswered(question.uid);
              }}
              className={cls}
              initial={false}
              whileTap={picked !== null || reduceMotion ? {} : { scale: 0.98 }}
            >
              <span className="daily-challenge__letter">{letter}</span>
              <span className="daily-challenge__optText">{opt}</span>
            </motion.button>
          );
        })}
      </div>

      {picked !== null && (
        <motion.div
          className={`daily-challenge__feedback ${correct ? 'daily-challenge__feedback--ok' : 'daily-challenge__feedback--bad'}`}
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          role="status"
        >
          {correct ? (
            <>
              <CheckCircle2 size={22} strokeWidth={2.2} aria-hidden />
              <span>Ճիշտ է։</span>
            </>
          ) : (
            <>
              <XCircle size={22} strokeWidth={2.2} aria-hidden />
              <span>
                Ճիշտ պատասխանը՝ <strong>{question.options[question.correctOption]}</strong>
              </span>
            </>
          )}
        </motion.div>
      )}

      <p className="daily-challenge__hint">
        Ամեն օր բոլորի համար նույն հարցն է՝ ըստ տեղական ամսաթվի։
      </p>
    </section>
  );
}

export default DailyChallenge;
