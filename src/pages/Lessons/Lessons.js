import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Compass, Layers, Zap, Target, Flame, Crown,
  ArrowLeft, ChevronRight,
} from 'lucide-react';
import { getTopicsByLevel } from '../../data/topicsUtils';
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
  const [selectedLevel, setSelectedLevel] = useState(null);
  const topicsByLevel = useMemo(() => getTopicsByLevel(), []);

  if (selectedLevel === null) {
    return (
      <div className="lessons-page">
        <div className="mx-auto w-full max-w-[1160px] px-5 pb-6 pt-6 md:pb-8 md:pt-8">
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

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LEVELS.map(({ level, Icon, from, to, shadow, light }, idx) => {
              const topics = topicsByLevel.get(level) || [];
              return (
                <motion.button
                  key={level}
                  initial={{ opacity: 0, y: 34 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.22 + idx * 0.08,
                    duration: 0.55,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  onClick={() => setSelectedLevel(level)}
                  className="lessons-level-card group"
                  style={{
                    '--l-from': from,
                    '--l-to': to,
                    '--l-shadow': shadow,
                    '--l-light': light,
                  }}
                >
                  <div className="lessons-level-card__strip" />
                  <div className="lessons-level-card__icon">
                    <Icon size={24} strokeWidth={2.2} />
                  </div>
                  <span className="lessons-level-card__number">{level}</span>
                  <span className="lessons-level-card__label">Մակարդակ</span>
                  <span className="lessons-level-card__count">
                    {topics.length} թեմա
                  </span>
                  <ChevronRight size={18} className="lessons-level-card__arrow" />
                </motion.button>
              );
            })}
          </div>
        </div>
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
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-16 text-center text-slate-400"
        >
          Այս մակարդակի համար թեմաներ դեռ չկան։
        </motion.p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTopics.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 + idx * 0.05, duration: 0.45 }}
              className="lessons-topic-card group"
              style={{ '--l-from': cfg.from, '--l-to': cfg.to, '--l-shadow': cfg.shadow }}
            >
              <h3 className="mb-2 text-base font-bold text-slate-900">{t.title}</h3>
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
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Lessons;
