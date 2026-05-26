import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import StatCountUp from '../../components/StatCountUp/StatCountUp';
import { getCourseStats } from '../../data/topicsUtils';

function HeroSection() {
  const reduceMotion = useReducedMotion();
  const { levelCount, topicCount, questionCount } = useMemo(() => getCourseStats(), []);

  return (
    <section className="hero-section">
      <div className="hero-bg" />
      <div className="hero-grain" aria-hidden />
      <div className="hero-shimmer" />

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
