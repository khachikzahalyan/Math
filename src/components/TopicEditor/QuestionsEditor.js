import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { subscribeQuestions, deleteQuestion } from '../../data/questionsRepo';
import QuestionForm from './QuestionForm';

export default function QuestionsEditor({ topicId }) {
  const [questions, setQuestions] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => subscribeQuestions(topicId, setQuestions), [topicId]);

  const onDelete = async (qid) => {
    if (!window.confirm('Ջնջե՞լ այս հարցը։')) return;
    await deleteQuestion(topicId, qid);
  };

  return (
    <div className="questionsEditor">
      <div className="questionsEditor__head">
        <h3 className="questionsEditor__title">Հարցեր ({questions.length})</h3>
        <button
          onClick={() => setEditingId('new')}
          type="button"
          className="questionsEditor__add"
        >
          <Plus size={13} />
          Ավելացնել
        </button>
      </div>

      {questions.map((q, i) => (
        <div key={q.id} className="questionsEditor__item">
          <div className="questionsEditor__itemHead">
            <div className="questionsEditor__itemBody">
              <div className="questionsEditor__itemIdx">#{i + 1}</div>
              <div className="questionsEditor__itemText">{q.question}</div>
              <ol className="questionsEditor__options">
                {q.options.map((opt, j) => (
                  <li
                    key={j}
                    className={
                      j === q.correctOption
                        ? 'questionsEditor__option questionsEditor__option--correct'
                        : 'questionsEditor__option'
                    }
                  >
                    {opt} {j === q.correctOption && '✓'}
                  </li>
                ))}
              </ol>
            </div>
            <div className="questionsEditor__itemActions">
              <button
                onClick={() => setEditingId(q.id)}
                type="button"
                className="questionsEditor__btn"
              >
                Խմբ.
              </button>
              <button
                onClick={() => onDelete(q.id)}
                type="button"
                className="questionsEditor__btn questionsEditor__btn--danger"
              >
                Ջնջել
              </button>
            </div>
          </div>
        </div>
      ))}

      {questions.length === 0 && (
        <p className="questionsEditor__empty">
          Հարցեր դեռ չկան։ Ավելացրեք առաջինը։
        </p>
      )}

      {editingId !== null && (
        <QuestionForm
          topicId={topicId}
          existing={editingId === 'new' ? null : questions.find((q) => q.id === editingId)}
          nextOrder={questions.length}
          onClose={() => setEditingId(null)}
        />
      )}
    </div>
  );
}
