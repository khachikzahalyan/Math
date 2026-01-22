import { useMemo, useState } from 'react';
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

  if (!topic) {
    return <Card title="Շուտով կլինի" text="Ապագայում այստեղ կհայտնվի նյութը" />;
  }

  const onChangeAnswer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const onCheck = () => {
    const total = topic.questions.length;
    let correct = 0;

    for (const q of topic.questions) {
      const userAnswer = normalize(answers[q.id]);
      const rightAnswer = normalize(q.answer);
      if (userAnswer !== '' && userAnswer === rightAnswer) correct += 1;
    }

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
          {topic.questions.map((q, idx) => (
            <div key={q.id} className="topic__question">
              <div className="topic__questionTitle">
                {idx + 1}. {q.question}
              </div>
              <input
                className="topic__input"
                value={answers[q.id] ?? ''}
                onChange={(e) => onChangeAnswer(q.id, e.target.value)}
                placeholder="Պատասխան"
              />
            </div>
          ))}
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
