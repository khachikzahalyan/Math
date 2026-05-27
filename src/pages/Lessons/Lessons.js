import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Compass, Layers, Zap, Target, Flame, Crown,
  ArrowLeft, ChevronRight, Download, Plus, Pencil, Trash2,
} from 'lucide-react';
import { subscribeTopics, deleteTopic } from '../../data/topicsRepo';
import { seedTopicsFromStaticFile } from '../../utils/seedTopics';
import { recordLevelVisited } from '../../utils/progressStorage';
import { useAuth } from '../../auth/AuthContext';
import TopicEditor from '../../components/TopicEditor/TopicEditor';
import { useModal } from '../../components/Modal/ModalProvider';
import './Lessons.css';

const LEVELS = [
  { level: 1, Icon: Compass, from: '#34d399', to: '#10b981', shadow: '16,185,129', light: '#ecfdf5' },
  { level: 2, Icon: Layers, from: '#60a5fa', to: '#3b82f6', shadow: '59,130,246', light: '#eff6ff' },
  { level: 3, Icon: Zap, from: '#818cf8', to: '#6366f1', shadow: '99,102,241', light: '#eef2ff' },
  { level: 4, Icon: Target, from: '#a78bfa', to: '#8b5cf6', shadow: '139,92,246', light: '#f5f3ff' },
  { level: 5, Icon: Flame, from: '#f472b6', to: '#ec4899', shadow: '236,72,153', light: '#fdf2f8' },
  { level: 6, Icon: Crown, from: '#fbbf24', to: '#f59e0b', shadow: '245,158,11', light: '#fffbeb' },
];

function Lessons() {
  const { user, isTeacher } = useAuth();
  const modal = useModal();
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [seeding, setSeeding] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);

  const openCreate = () => setEditingTopic('new');
  const openEdit = (t) => setEditingTopic(t);
  const closeEditor = () => setEditingTopic(null);

  const onDeleteTopic = async (t) => {
    const ok = await modal.confirm({
      title: 'Ջնջե՞լ թեման',
      message: `«${t.title}» — բոլոր հարցերն ու աշակերտների փորձերը կկորչեն։`,
      confirmLabel: 'Ջնջել',
    });
    if (!ok) return;
    try {
      await deleteTopic(t.id);
    } catch {
      await modal.alert({
        variant: 'danger',
        title: 'Սխալ',
        message: 'Ջնջումը չհաջողվեց։',
      });
    }
  };

  useEffect(() => {
    setLoadError('');
    const unsub = subscribeTopics(
      (list) => {
        setTopics(list);
        setLoaded(true);
      },
      (err) => {
        console.error('[lessons] subscribeTopics failed:', err?.code, err?.message, err);
        setLoaded(true);
        const code = err?.code || 'unknown';
        let detail = 'Չհաջողվեց բեռնել թեմաները։';
        if (code === 'permission-denied') {
          detail = 'Firestore-ի կանոնները չեն թույլատրում ընթերցել թեմաները։ Թարմացրեք firestore.rules-ը։';
        } else if (code === 'unauthenticated') {
          detail = 'Մուտքն ընդհատվել է։ Մուտք գործեք կրկին։';
        } else if (code === 'failed-precondition') {
          detail = 'Firestore-ին պակասում է ինդեքս։ Տեսեք browser console-ը՝ ստեղծման հղման համար։';
        } else if (code === 'unavailable') {
          detail = 'Firestore-ը հասանելի չէ։ Ստուգեք ինտերնետը։';
        }
        setLoadError(`${detail} (${code})`);
      },
    );
    return unsub;
  }, []);

  const topicsByLevel = useMemo(() => {
    const m = new Map();
    topics.forEach((t) => {
      if (!m.has(t.level)) m.set(t.level, []);
      m.get(t.level).push(t);
    });
    return m;
  }, [topics]);

  const onSeed = async () => {
    setSeeding(true);
    try {
      await seedTopicsFromStaticFile(user?.email || '');
    } catch (e) {
      setLoadError('Ներմուծումը չհաջողվեց։');
    } finally {
      setSeeding(false);
    }
  };

  if (!loaded) {
    return (
      <div className="lessons-page">
        <div className="lessons-page__inner">
          <h1 className="mb-2 text-center text-3xl font-black leading-tight tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
            Դասեր
          </h1>
          <p className="mx-auto mb-5 max-w-xl text-center text-sm text-slate-500 md:mb-6 md:text-base">
            Ընտրեք մակարդակը սկսելու համար։
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
            {LEVELS.map(({ level }) => (
              <div key={level} className="lessons-skel-card">
                <span className="lessons-skel-card__strip" />
                <span className="lessons-skel-card__icon" />
                <span className="lessons-skel-card__num" />
                <span className="lessons-skel-card__label" />
                <span className="lessons-skel-card__count" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="lessons-page">
        <div className="lessons-page__inner" style={{ textAlign: 'center', padding: 40 }}>
          <p style={{ color: '#dc2626', marginBottom: 16 }}>{loadError}</p>
          <button onClick={() => window.location.reload()} type="button">
            Կրկին փորձել
          </button>
        </div>
      </div>
    );
  }

  const isEmpty = topics.length === 0;

  if (isEmpty && isTeacher) {
    return (
      <div className="lessons-page">
        <div className="lessons-page__inner" style={{ textAlign: 'center', padding: 40 }}>
          <h2 style={{ marginBottom: 12 }}>Թեմաներ դեռ չկան</h2>
          <p style={{ color: '#64748b', marginBottom: 20 }}>
            Ներմուծեք նախնական դասերը՝ սկսելու համար։
          </p>
          <button
            onClick={onSeed}
            disabled={seeding}
            type="button"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 20px', borderRadius: 12,
              background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
              color: '#fff', border: 'none', cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            <Download size={16} />
            {seeding ? 'Ներմուծվում է...' : 'Ներմուծել նախնական դասերը'}
          </button>
        </div>
      </div>
    );
  }

  if (isEmpty && !isTeacher) {
    return (
      <div className="lessons-page">
        <div className="lessons-page__inner" style={{ textAlign: 'center', padding: 40 }}>
          <p style={{ color: '#64748b' }}>Թեմաներ դեռ չկան։ Դիմեք ուսուցչին։</p>
        </div>
      </div>
    );
  }

  if (selectedLevel === null) {
    return (
      <div className="lessons-page">
        <div className="lessons-page__inner">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.07 }}
            className="mb-2 text-center text-3xl font-black leading-tight tracking-tight text-slate-900 md:text-4xl lg:text-5xl"
          >
            Դասեր
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.14 }}
            className="mx-auto mb-4 max-w-xl text-center text-sm text-slate-500 md:mb-5 md:text-base"
          >
            Ընտրեք մակարդակը սկսելու համար։
          </motion.p>

          {isTeacher && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
              <button
                onClick={openCreate}
                type="button"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px', borderRadius: 10,
                  background: 'linear-gradient(135deg,#10b981,#059669)',
                  color: '#fff', border: 'none', cursor: 'pointer',
                  fontWeight: 700, fontSize: '0.85rem',
                }}
              >
                <Plus size={14} />
                Ավելացնել թեմա
              </button>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {LEVELS.map(({ level, Icon, from, to, shadow, light }, idx) => {
              const topicsAtLevel = topicsByLevel.get(level) || [];
              return (
                <motion.button
                  key={level}
                  initial={{ opacity: 0, y: 34 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22 + idx * 0.08, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
                  onClick={() => {
                    recordLevelVisited(level);
                    setSelectedLevel(level);
                  }}
                  className="lessons-level-card group"
                  style={{ '--l-from': from, '--l-to': to, '--l-shadow': shadow, '--l-light': light }}
                >
                  <div className="lessons-level-card__strip" />
                  <div className="lessons-level-card__icon">
                    <Icon size={20} strokeWidth={2.2} />
                  </div>
                  <span className="lessons-level-card__number">{level}</span>
                  <span className="lessons-level-card__label">Մակարդակ</span>
                  <span className="lessons-level-card__count">{topicsAtLevel.length} թեմա</span>
                  <ChevronRight size={18} className="lessons-level-card__arrow" />
                </motion.button>
              );
            })}
          </div>
        </div>

        {editingTopic && (
          <TopicEditor
            topic={editingTopic === 'new' ? null : editingTopic}
            onClose={closeEditor}
            nextOrder={topics.length}
          />
        )}
      </div>
    );
  }

  const cfg = LEVELS.find((l) => l.level === selectedLevel) || LEVELS[0];
  const filteredTopics = topicsByLevel.get(selectedLevel) || [];

  return (
    <div key={selectedLevel} className="mx-auto w-full max-w-[1100px] px-4 pb-14 pt-6 md:px-6">
      <motion.button
        initial={{ opacity: 0, x: -14 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
        className="lessons-back group mb-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm"
        onClick={() => setSelectedLevel(null)}
        type="button"
      >
        <ArrowLeft size={17} className="transition group-hover:-translate-x-0.5" />
        Վերադառնալ
      </motion.button>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.06 }}
        className="mb-2 text-center text-3xl font-black tracking-tight md:text-4xl lg:text-5xl"
        style={{
          background: `linear-gradient(135deg, ${cfg.from}, ${cfg.to})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          lineHeight: 1.25,
          paddingBottom: '0.15em',
        }}
      >
        Մակարդակ {selectedLevel}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.12 }}
        className="mx-auto mb-10 max-w-lg text-center text-slate-500"
      >
        Ընտրեք թեմա ուսումնասիրելու համար։
      </motion.p>

      {filteredTopics.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="py-16 text-center text-slate-400"
        >
          Այս մակարդակի համար թեմաներ դեռ չկան։
        </motion.p>
      ) : (
        <div className="lessons-topic-grid">
          {filteredTopics.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 + idx * 0.05, duration: 0.45 }}
              className={`lessons-topic-card${isTeacher ? ' lessons-topic-card--teacher' : ''} group`}
              style={{ '--l-from': cfg.from, '--l-to': cfg.to, '--l-shadow': cfg.shadow }}
            >
              <span
                className="lessons-topic-card__num"
                style={{ color: cfg.from, background: `rgba(${cfg.shadow}, 0.12)` }}
              >
                {selectedLevel}.{idx + 1}
              </span>
              <h3 className="lessons-topic-card__title">{t.title}</h3>
              <p className="lessons-topic-card__desc">{t.description}</p>
              <div className="lessons-topic-card__footer">
                <Link
                  className="lessons-topic-card__link"
                  style={{ background: `linear-gradient(135deg, ${cfg.from}, ${cfg.to})` }}
                  to={t.id}
                >
                  Բացել
                  <ChevronRight size={16} />
                </Link>
              </div>
              {isTeacher && (
                <div className="lessons-topic-card__teacherActions">
                  <button
                    onClick={() => openEdit(t)} type="button"
                    className="lessons-topic-card__iconBtn"
                    aria-label="Խմբագրել"
                    title="Խմբագրել"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => onDeleteTopic(t)} type="button"
                    className="lessons-topic-card__iconBtn lessons-topic-card__iconBtn--danger"
                    aria-label="Ջնջել"
                    title="Ջնջել"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {editingTopic && (
        <TopicEditor
          topic={editingTopic === 'new' ? null : editingTopic}
          onClose={closeEditor}
          nextOrder={topics.length}
        />
      )}
    </div>
  );
}

export default Lessons;
