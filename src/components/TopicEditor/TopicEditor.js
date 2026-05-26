import { useEffect, useState } from 'react';
import { X, Compass, Layers, Zap, Target, Flame, Crown } from 'lucide-react';
import { saveTopic } from '../../data/topicsRepo';
import { useAuth } from '../../auth/AuthContext';
import { useModal } from '../Modal/ModalProvider';
import { NO_AUTOFILL } from '../../utils/noAutofill';
import QuestionsEditor from './QuestionsEditor';
import './TopicEditor.css';

const LEVEL_OPTIONS = [
  { level: 1, Icon: Compass, from: '#34d399', to: '#10b981' },
  { level: 2, Icon: Layers, from: '#60a5fa', to: '#3b82f6' },
  { level: 3, Icon: Zap, from: '#818cf8', to: '#6366f1' },
  { level: 4, Icon: Target, from: '#a78bfa', to: '#8b5cf6' },
  { level: 5, Icon: Flame, from: '#f472b6', to: '#ec4899' },
  { level: 6, Icon: Crown, from: '#fbbf24', to: '#f59e0b' },
];

export default function TopicEditor({ topic, onClose, nextOrder = 0 }) {
  const { user } = useAuth();
  const { toast } = useModal();
  const isNew = !topic;
  const [tab, setTab] = useState('topic');
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
      toast(isNew ? 'Թեման ստեղծվեց' : 'Փոփոխությունները պահպանվեցին');
      onClose();
    } catch (e) {
      setError('Չհաջողվեց պահպանել։');
    } finally {
      setSaving(false);
    }
  };

  const questionsTabEnabled = !isNew;
  const showTopicFooter = tab === 'topic';
  const activeId = topic?.id;

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
            <div className="topicEditor__label">
              Մակարդակ
              <div className="topicEditor__levels" role="radiogroup" aria-label="Մակարդակ">
                {LEVEL_OPTIONS.map(({ level, Icon, from, to }) => {
                  const isActive = Number(form.level) === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      onClick={() => setForm({ ...form, level })}
                      className={`topicEditor__levelChip${isActive ? ' is-active' : ''}`}
                      style={{ '--lvl-from': from, '--lvl-to': to }}
                    >
                      <Icon size={14} strokeWidth={2.4} />
                      <span>{level}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="topicEditor__label">
              Վերնագիր
              <input
                className="topicEditor__input"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                {...NO_AUTOFILL}
              />
            </label>
            <label className="topicEditor__label">
              Կարճ նկարագրություն
              <input
                className="topicEditor__input"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                {...NO_AUTOFILL}
              />
            </label>
            <label className="topicEditor__label">
              Տեսության տեքստ
              <textarea
                className="topicEditor__textarea"
                rows={8}
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                {...NO_AUTOFILL}
              />
            </label>
            <label className="topicEditor__label">
              Օրինակներ (մեկ տողում մեկ օրինակ)
              <textarea
                className="topicEditor__textarea"
                rows={3}
                value={form.examples}
                onChange={(e) => setForm({ ...form, examples: e.target.value })}
                {...NO_AUTOFILL}
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
