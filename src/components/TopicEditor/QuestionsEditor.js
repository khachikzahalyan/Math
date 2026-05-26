import { useEffect, useRef, useState } from 'react';
import { subscribeQuestions, deleteQuestion } from '../../data/questionsRepo';
import { useModal } from '../Modal/ModalProvider';
import QuestionForm from './QuestionForm';

export default function QuestionsEditor({ topicId, onSaved, onFinalSave }) {
  const modal = useModal();
  const [questions, setQuestions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const autoOpenedRef = useRef(false);

  useEffect(() => {
    return subscribeQuestions(topicId, (qs) => {
      setQuestions(qs);
      if (!autoOpenedRef.current) {
        autoOpenedRef.current = true;
        if (qs.length === 0) setEditingId('new');
      }
    });
  }, [topicId]);

  const onDelete = async (qid) => {
    const ok = await modal.confirm({
      title: 'Ջնջե՞լ հարցը',
      message: 'Այս գործողությունը հնարավոր չէ հետ բերել։',
      confirmLabel: 'Ջնջել',
    });
    if (!ok) return;
    await deleteQuestion(topicId, qid);
  };

  if (editingId !== null) {
    return (
      <QuestionForm
        topicId={topicId}
        existing={editingId === 'new' ? null : questions.find((q) => q.id === editingId)}
        nextOrder={questions.length}
        onClose={() => setEditingId(null)}
        onSaved={onSaved}
        onFinalSave={onFinalSave}
      />
    );
  }

  return (
    <div className="questionsEditor">
      <div className="questionsEditor__head">
        <h3 className="questionsEditor__title">Հարցեր ({questions.length})</h3>
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
    </div>
  );
}
