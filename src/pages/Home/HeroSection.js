import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';

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

function CountUp({ target, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const steps = 35;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref} className="stat__number">
      {count}{suffix || ''}
    </span>
  );
}

function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-bg" />
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
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl font-black leading-tight tracking-tight text-slate-900 md:text-6xl"
        >
          Մաթեմատիկական ուսուցում՝
          <br />
          <span className="bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">
            պարզ և արդյունավետ
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22 }}
          className="mx-auto mt-5 max-w-2xl text-base text-slate-500 md:text-lg"
        >
          Սկսիր մեկ րոպեանոց թեստից, ստացիր քո մակարդակը և անցիր թեմաներով՝
          քայլ առ քայլ։
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.34 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/lessons"
            className="rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 px-7 py-3.5 text-sm font-bold text-white shadow-[0_10px_28px_rgba(79,70,229,0.35)] transition hover:-translate-y-0.5 hover:from-violet-700 hover:to-indigo-700 hover:text-white hover:shadow-[0_14px_32px_rgba(76,29,149,0.4)]"
          >
            Սկսել ուսուցումը
          </Link>
        </motion.div>
      </div>

      <div className="hero-stats">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="stat"
        >
          <CountUp target={6} />
          <span className="stat__label">Մակարդակ</span>
        </motion.div>
        <div className="stat__divider" />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.62 }}
          className="stat"
        >
          <CountUp target={52} />
          <span className="stat__label">Թեմա</span>
        </motion.div>
        <div className="stat__divider" />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.74 }}
          className="stat"
        >
          <CountUp target={500} suffix="+" />
          <span className="stat__label">Հարց</span>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
