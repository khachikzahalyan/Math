import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Check } from 'lucide-react';
import { saveQuestion, validateQuestion } from '../../data/questionsRepo';
import { NO_AUTOFILL } from '../../utils/noAutofill';

export default function QuestionForm({ topicId, existing, nextOrder, onClose }) {
  const isNew = !existing;
  const [form, setForm] = useState({
    id: existing?.id || `q${Date.now()}`,
    type: 'radio',
    question: existing?.question || '',
    options: existing?.options || ['', '', '', ''],
    correctOption: existing?.correctOption ?? 0,
    order: existing?.order ?? nextOrder,
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const setOption = (i, v) => {
    const next = [...form.options];
    next[i] = v;
    setForm({ ...form, options: next });
  };

  const addOption = () => setForm({ ...form, options: [...form.options, ''] });

  const removeOption = (i) => {
    if (form.options.length <= 2) return;
    const next = form.options.filter((_, idx) => idx !== i);
    let nextCorrect = form.correctOption;
    if (i === form.correctOption) nextCorrect = 0;
    else if (i < form.correctOption) nextCorrect = form.correctOption - 1;
    setForm({ ...form, options: next, correctOption: nextCorrect });
  };

  const onSave = async () => {
    setError('');
    const err = validateQuestion(form);
    if (err) return setError(err);
    setSaving(true);
    try {
      await saveQuestion(topicId, form.id, {
        type: form.type,
        question: form.question.trim(),
        options: form.options.map((o) => o.trim()),
        correctOption: Number(form.correctOption),
        order: Number(form.order),
      });
      onClose();
    } catch {
      setError('Չհաջողվեց պահպանել։');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="questionForm">
      <div className="questionForm__head">
        <button
          onClick={onClose}
          type="button"
          className="questionForm__back"
          aria-label="Վերադառնալ"
        >
          <ArrowLeft size={16} />
          Հարցեր
        </button>
        <h3 className="questionForm__title">
          {isNew ? 'Նոր հարց' : 'Խմբագրել հարցը'}
        </h3>
      </div>

      <div className="questionForm__body">
        <label className="questionForm__label">
          Հարց
          <textarea
            rows={3}
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            className="topicEditor__textarea"
            {...NO_AUTOFILL}
          />
        </label>

        <div>
          <div className="questionForm__label" style={{ marginBottom: 6 }}>
            Տարբերակներ
          </div>
          <div className="questionForm__hint">
            Սեղմեք «Նշել» ճիշտ պատասխանի կողքին
          </div>
          {form.options.map((opt, i) => {
            const isCorrect = form.correctOption === i;
            return (
              <div
                key={i}
                className={
                  isCorrect
                    ? 'questionForm__option questionForm__option--correct'
                    : 'questionForm__option'
                }
              >
                <button
                  type="button"
                  onClick={() => setForm({ ...form, correctOption: i })}
                  title={isCorrect ? 'Ճիշտ պատասխան' : 'Նշել որպես ճիշտ'}
                  className={
                    isCorrect
                      ? 'questionForm__markBtn questionForm__markBtn--correct'
                      : 'questionForm__markBtn'
                  }
                >
                  <Check size={13} strokeWidth={3} />
                  {isCorrect ? 'Ճիշտ' : 'Նշել'}
                </button>
                <input
                  value={opt}
                  onChange={(e) => setOption(i, e.target.value)}
                  className="topicEditor__input"
                  style={{ flex: 1 }}
                  placeholder={`Տարբերակ ${i + 1}`}
                  {...NO_AUTOFILL}
                />
                <button
                  onClick={() => removeOption(i)}
                  type="button"
                  disabled={form.options.length <= 2}
                  title="Ջնջել տարբերակը"
                  className="questionForm__removeBtn"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            );
          })}
          <button
            onClick={addOption}
            type="button"
            className="questionForm__addOption"
          >
            <Plus size={12} />
            Տարբերակ
          </button>
        </div>

        {error && <div className="topicEditor__error">{error}</div>}
      </div>

      <div className="questionForm__footer">
        <button
          onClick={onClose}
          type="button"
          className="topicEditor__btn topicEditor__btn--ghost"
        >
          Չեղարկել
        </button>
        <button
          onClick={onSave}
          type="button"
          disabled={saving}
          className="topicEditor__btn topicEditor__btn--primary"
        >
          {saving ? 'Պահպանվում է...' : 'Պահպանել'}
        </button>
      </div>
    </div>
  );
}
