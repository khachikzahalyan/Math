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
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [empty, setEmpty] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);

  const openCreate = () => setEditingTopic('new');
  const openEdit = (t) => setEditingTopic(t);
  const closeEditor = () => setEditingTopic(null);

  const onDeleteTopic = async (t) => {
    if (!window.confirm(`Ջնջե՞լ թեման «${t.title}»։ Բոլոր հարցերն ու աշակերտների փորձերը կկորչեն։`)) return;
    try {
      await deleteTopic(t.id);
    } catch {
      alert('Ջնջումը չհաջողվեց։');
    }
  };

  useEffect(() => {
    setLoadError('');
    const unsub = subscribeTopics(
      (list) => {
        setTopics(list);
        setEmpty(list.length === 0);
      },
      (err) => {
        console.error('[lessons] subscribeTopics failed:', err?.code, err?.message, err);
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

  if (empty && isTeacher) {
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

  if (empty && !isTeacher) {
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
            className="mb-3 text-center text-4xl font-black leading-tight tracking-tight text-slate-900 md:text-5xl lg:text-6xl"
          >
            Դասեր
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.14 }}
            className="mx-auto mb-8 max-w-xl text-center text-base text-slate-500 md:mb-10 md:text-lg"
          >
            Ընտրեք մակարդակը սկսելու համար։
          </motion.p>

          {isTeacher && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <button
                onClick={openCreate}
                type="button"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '10px 18px', borderRadius: 12,
                  background: 'linear-gradient(135deg,#10b981,#059669)',
                  color: '#fff', border: 'none', cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                <Plus size={16} />
                Ավելացնել թեմա
              </button>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                    <Icon size={24} strokeWidth={2.2} />
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTopics.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 + idx * 0.05, duration: 0.45 }}
              className="lessons-topic-card group"
              style={{ '--l-from': cfg.from, '--l-to': cfg.to, '--l-shadow': cfg.shadow }}
            >
              <h3 className="mb-2 text-base font-bold text-slate-900">
                <span
                  className="lessons-topic-card__num"
                  style={{ color: cfg.from }}
                >
                  {selectedLevel}.{idx + 1}
                </span>
                {t.title}
              </h3>
              <p className="flex-1 text-sm leading-relaxed text-slate-500">{t.description}</p>
              <div className="mt-auto pt-4">
                <Link
                  className="lessons-topic-card__link inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${cfg.from}, ${cfg.to})` }}
                  to={t.id}
                >
                  Բացել
                  <ChevronRight size={15} />
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
