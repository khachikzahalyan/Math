import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import StatCountUp from '../../components/StatCountUp/StatCountUp';
import { getCourseStats } from '../../data/topicsUtils';

const MATH_SYMBOLS = [
  { char: '\u03C0', top: '12%', left: '7%', size: '2.4rem', delay: '0s', dur: '18s', anim: 'symbolFloat1' },
  { char: '\u2211', top: '18%', left: '88%', size: '2rem', delay: '2s', dur: '22s', anim: 'symbolFloat2' },
  { char: '\u221A', top: '72%', left: '9%', size: '2.2rem', delay: '1s', dur: '16s', anim: 'symbolFloat3' },
  { char: '\u221E', top: '66%', left: '86%', size: '2.6rem', delay: '5s', dur: '20s', anim: 'symbolFloat1' },
  { char: '\u0394', top: '6%', left: '48%', size: '1.6rem', delay: '3s', dur: '19s', anim: 'symbolFloat2' },
  { char: '\u00B1', top: '82%', left: '56%', size: '1.8rem', delay: '4s', dur: '17s', anim: 'symbolFloat3' },
  { char: '\u222B', top: '28%', left: '94%', size: '2.3rem', delay: '6s', dur: '21s', anim: 'symbolFloat1' },
  { char: '\u2260', top: '52%', left: '3%', size: '1.7rem', delay: '7s', dur: '15s', anim: 'symbolFloat2' },
  { char: '\u03C6', top: '5%', left: '74%', size: '1.9rem', delay: '1.5s', dur: '23s', anim: 'symbolFloat3' },
  { char: '\u00F7', top: '86%', left: '26%', size: '1.5rem', delay: '3.5s', dur: '18s', anim: 'symbolFloat1' },
  { char: '\u03BB', top: '40%', left: '96%', size: '1.8rem', delay: '8s', dur: '20s', anim: 'symbolFloat2' },
  { char: '\u00D7', top: '58%', left: '16%', size: '1.4rem', delay: '2.5s', dur: '16s', anim: 'symbolFloat3' },
];

function HeroSection() {
  const reduceMotion = useReducedMotion();
  const { levelCount, topicCount, questionCount } = useMemo(() => getCourseStats(), []);

  return (
    <section className="hero-section">
      <div className="hero-bg" />
      <div className="hero-grain" aria-hidden />
      <div className="hero-shimmer" />

      {MATH_SYMBOLS.map((s, i) => (
        <span
          key={i}
          className="math-symbol"
          style={{
            top: s.top,
            left: s.left,
            fontSize: s.size,
            animationName: s.anim,
            animationDuration: s.dur,
            animationDelay: s.delay,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
          }}
        >
          {s.char}
        </span>
      ))}

      <div className="hero-content">
        <motion.h1
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: reduceMotion ? 0 : 0.08 }}
          className="max-w-full break-words text-balance text-[clamp(1.5rem,6.5vw,2.35rem)] font-black leading-[1.12] tracking-tight text-slate-900 sm:text-4xl md:text-6xl md:leading-tight"
        >
          <span className="bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">

          Ժամանակակից մաթեմատիկական կրթություն
          </span>
        </motion.h1>

        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: reduceMotion ? 0 : 0.18 }}
          className="mx-auto mt-5 max-w-2xl break-words text-base text-slate-500 md:text-lg"
        >
          Կառուցված դասընթացներ, տեսական հիմք և կիրառական խնդիրներ՝ համակարգված ուսուցմամբ։
        </motion.p>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: reduceMotion ? 0 : 0.28 }}
          className="mt-9 flex w-full min-w-0 flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/lessons"
            className="max-w-full rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-3.5 text-center text-sm font-bold text-white shadow-[0_10px_28px_rgba(79,70,229,0.35)] transition hover:-translate-y-0.5 hover:from-violet-700 hover:to-indigo-700 hover:text-white hover:shadow-[0_14px_32px_rgba(76,29,149,0.4)] sm:px-7"
          >
            Սկսել ուսուցումը
          </Link>
        </motion.div>
      </div>

      <div className="hero-stats">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.42 }}
          className="stat"
        >
          <StatCountUp className="stat__number" target={levelCount} />
          <span className="stat__label">Մակարդակներ</span>
        </motion.div>
        <div className="stat__divider" />
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.52 }}
          className="stat"
        >
          <StatCountUp className="stat__number" target={topicCount} />
          <span className="stat__label">Թեմաներ</span>
        </motion.div>
        <div className="stat__divider" />
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.62 }}
          className="stat"
        >
          <StatCountUp className="stat__number" target={questionCount} />
          <span className="stat__label">Հարցեր</span>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
