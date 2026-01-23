// LessonTopic.jsx
import { useMemo, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import topics from '../../data/topics';
import Card from '../../components/Card/Card';
import './LessonTopic.css';

function normalize(value) {
  return String(value ?? '')
    .trim()
    .replace(/\s+/g, '')
    .toLowerCase();
}

function LessonTopic() {
  const { topicId } = useParams();
  const topic = useMemo(() => topics.find((t) => t.id === topicId), [topicId]);

  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const [error, setError] = useState(false);
  const [errorKey, setErrorKey] = useState(0);

  // показать ответ по одному вопросу
  const [revealed, setRevealed] = useState({}); // { [questionId]: true/false }

  // подсветка пустых
  const [emptyIds, setEmptyIds] = useState([]);

  // ✅ подсветка правильных/неправильных после проверки
  const [checkedMap, setCheckedMap] = useState({}); // { [questionId]: true/false }

  // ошибка на 3 секунды
  useEffect(() => {
    if (!error) return;
    console.log(errorKey)
    const timer = setTimeout(() => {
      setError(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [error,errorKey]);

  // сброс при смене темы
  useEffect(() => {
    setAnswers({});
    setResult(null);
    setError(false);
    setRevealed({});
    setEmptyIds([]);
    setCheckedMap({});
  }, [topicId]);

  if (!topic) {
    return <Card title="Շուտով կլինի" text="Ապագայում այստեղ կհայտնվի նյութը" />;
  }

  const onChangeAnswer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));

    // если человек заполнил поле — убрать из пустых
    setEmptyIds((prev) => prev.filter((id) => id !== questionId));

    // если он начал менять — убираем подсветку “правильно/неправильно” для этого вопроса
    setCheckedMap((prev) => {
      if (!(questionId in prev)) return prev;
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });
  };

  const toggleReveal = (questionId) => {
    setRevealed((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const onCheck = () => {
    // 1) найти пустые
    const empty = topic.questions
      .filter((q) => !normalize(answers[q.id]))
      .map((q) => q.id);

    if (empty.length > 0) {
      setEmptyIds(empty);
      setError(true);
      setResult(null);
      setErrorKey((k) => k + 1);

      // скролл к первому пустому
      const first = document.querySelector(`[data-qid="${empty[0]}"]`);
      if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });

      return;
    }

    // 2) считаем результат
    setError(false);
    setEmptyIds([]);

    const total = topic.questions.length;
    let correct = 0;
    const map = {};

    for (const q of topic.questions) {
      const userAnswer = normalize(answers[q.id]);
      const rightAnswer = normalize(q.answer);

      const isCorrect = userAnswer === rightAnswer;
      map[q.id] = isCorrect;

      if (isCorrect) correct += 1;
    }

    setCheckedMap(map);

    const score = Math.round(10 + (correct / total) * 90);
    setResult({ total, correct, score });
  };

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
          {topic.examples.map((ex, idx) => (
            <li key={idx} className="topic__listItem">
              {ex}
            </li>
          ))}
        </ul>
      </section>

      <section className="topic__section">
        <h2 className="topic__sectionTitle">Առաջադրանքներ</h2>

        <div className="topic__questions">
          {topic.questions.map((q, idx) => {
            const isRevealed = !!revealed[q.id];
            const isEmpty = emptyIds.includes(q.id);

            const isCorrect = checkedMap[q.id] === true;
            const isWrong = checkedMap[q.id] === false;

            return (
              <div
                key={q.id}
                data-qid={q.id}
                className={[
                  'topic__question',
                  isEmpty ? 'topic__question--empty' : '',
                  isCorrect ? 'topic__question--correct' : '',
                  isWrong ? 'topic__question--wrong' : ''
                ].join(' ')}
              >
                <div className="topic__questionTitle">
                  {idx + 1}. {q.question}
                </div>

                <input
                  className="topic__input"
                  value={answers[q.id] ?? ''}
                  onChange={(e) => onChangeAnswer(q.id, e.target.value)}
                  placeholder="Պատասխան"
                />

                <div className="topic__actionsRow">
                  <button
                    type="button"
                    className="topic__hintBtn"
                    onClick={() => toggleReveal(q.id)}
                  >
                    {isRevealed ? 'Թաքցնել պատասխանը' : 'Ցույց տալ պատասխանը'}
                  </button>

                  {isCorrect && <span className="topic__badge topic__badge--ok">✅ Ճիշտ</span>}
                  {isWrong && <span className="topic__badge topic__badge--bad">❌ Սխալ</span>}
                </div>

                {isRevealed && (
                  <div className="topic__rightAnswer">
                    Ճիշտ պատասխան՝ <b>{q.answer}</b>
                  </div>
                )}
              </div>
            );
          })}
        </div>

 

        <button className="topic__button" onClick={onCheck}>
          Ստուգել
        </button>

        {result && (
          <div className="topic__result">
            <div>
              Ճիշտ պատասխաններ՝ <b>{result.correct}</b> / <b>{result.total}</b>
            </div>
            <div>
              Վերջնական արդյունք՝ <b>{result.score}</b> / 100
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default LessonTopic;
