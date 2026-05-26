import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { saveTopic } from '../../data/topicsRepo';
import { useAuth } from '../../auth/AuthContext';
import QuestionsEditor from './QuestionsEditor';
import './TopicEditor.css';

export default function TopicEditor({ topic, onClose, nextOrder = 0 }) {
  const { user } = useAuth();
  const isNew = !topic;
  const [tab, setTab] = useState('topic');
  const [savedNew, setSavedNew] = useState(false);
  const [newId, setNewId] = useState('');
  const [form, setForm] = useState({
    level: topic?.level || 1,
    title: topic?.title || '',
    description: topic?.description || '',
    text: topic?.text || '',
    examples: (topic?.examples || []).join('\n'),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const onSave = async () => {
    setError('');
    if (!form.title.trim()) return setError('Վերնագիրը պարտադիր է');
    if (!form.text.trim()) return setError('Տեսության տեքստը պարտադիր է');
    setSaving(true);
    try {
      const id = topic?.id || `t${Date.now()}`;
      await saveTopic(id, {
        level: Number(form.level),
        title: form.title.trim(),
        description: form.description.trim(),
        text: form.text,
        examples: form.examples.split('\n').map((s) => s.trim()).filter(Boolean),
        order: topic?.order ?? nextOrder,
        ...(topic?.createdAt ? { createdAt: topic.createdAt } : {}),
      }, user?.email || '');
      if (isNew) {
        setNewId(id);
        setSavedNew(true);
        setTab('questions');
      } else {
        onClose();
      }
    } catch (e) {
      setError('Չհաջողվեց պահպանել։');
    } finally {
      setSaving(false);
    }
  };

  const questionsTabEnabled = !isNew || savedNew;
  const showTopicFooter = tab === 'topic';
  const activeId = topic?.id || newId;

  return (
    <div className="topicEditor__backdrop" onClick={onClose}>
      <div className="topicEditor" onClick={(e) => e.stopPropagation()}>
        <div className="topicEditor__head">
          <h2 className="topicEditor__title">
            {isNew ? 'Նոր թեմա' : `Խմբագրել՝ ${topic.title}`}
          </h2>
          <button onClick={onClose} type="button" className="topicEditor__close" aria-label="Փակել">
            <X size={20} />
          </button>
        </div>

        <div className="topicEditor__tabs">
          <button
            type="button"
            className={`topicEditor__tab ${tab === 'topic' ? 'is-active' : ''}`}
            onClick={() => setTab('topic')}
          >
            Թեմա
          </button>
          <button
            type="button"
            className={`topicEditor__tab ${tab === 'questions' ? 'is-active' : ''}`}
            onClick={() => setTab('questions')}
            disabled={!questionsTabEnabled}
            title={!questionsTabEnabled ? 'Նախ պահպանեք թեման' : ''}
          >
            Հարցեր
          </button>
        </div>

        {tab === 'topic' && (
          <div className="topicEditor__body">
            <label className="topicEditor__label">
              Մակարդակ (1-6)
              <input
                className="topicEditor__input"
                type="number" min="1" max="6"
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
              />
            </label>

            <label className="topicEditor__label">
              Վերնագիր
              <input
                className="topicEditor__input"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </label>
            <label className="topicEditor__label">
              Կարճ նկարագրություն
              <input
                className="topicEditor__input"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </label>
            <label className="topicEditor__label">
              Տեսության տեքստ
              <textarea
                className="topicEditor__textarea"
                rows={8}
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
              />
            </label>
            <label className="topicEditor__label">
              Օրինակներ (մեկ տողում մեկ օրինակ)
              <textarea
                className="topicEditor__textarea"
                rows={3}
                value={form.examples}
                onChange={(e) => setForm({ ...form, examples: e.target.value })}
              />
            </label>

            {error && <div className="topicEditor__error">{error}</div>}
          </div>
        )}

        {tab === 'questions' && activeId && questionsTabEnabled && (
          <QuestionsEditor topicId={activeId} />
        )}

        {showTopicFooter && (
          <div className="topicEditor__footer">
            <button onClick={onClose} type="button" className="topicEditor__btn topicEditor__btn--ghost">
              Չեղարկել
            </button>
            <button onClick={onSave} type="button" disabled={saving} className="topicEditor__btn topicEditor__btn--primary">
              {saving ? 'Պահպանվում է...' : 'Պահպանել'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
