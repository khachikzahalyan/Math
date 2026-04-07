import { useCallback, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import StatCountUp from '../../components/StatCountUp/StatCountUp';
import { getCourseStats } from '../../data/topicsUtils';
import AboutSectionVisuals from './AboutSectionVisuals';
import { SECTIONS, PILLARS, FAQ_ITEMS } from './aboutContent';
import './About.css';

/** Must match `.about-visual__ring` animation duration in About.css (28s). */
const ABOUT_RING_DURATION_MS = 28000;
/** Shared phase for pillar icon float (8s loop in CSS). */
const ABOUT_FLOAT_DURATION_MS = 8000;

function About() {
  const reduceMotion = useReducedMotion();
  const stats = useMemo(() => getCourseStats(), []);
  const [openFaq, setOpenFaq] = useState(null);
  /** Shared rotation phase so all three dashed rings stay in sync. */
  const ringPhaseDelaySec = useMemo(
    () => -(Date.now() % ABOUT_RING_DURATION_MS) / 1000,
    [],
  );
  const floatPhaseDelaySec = useMemo(
    () => -(Date.now() % ABOUT_FLOAT_DURATION_MS) / 1000,
    [],
  );

  const pillarMotion = useMemo(
    () =>
      reduceMotion
        ? {}
        : {
            initial: { opacity: 0, y: 14 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, amount: 0.2 },
          },
    [reduceMotion],
  );

  const scrollToSection = useCallback(
    (id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    },
    [reduceMotion],
  );

  return (
    <div
      className="about-page"
      style={{
        '--about-ring-phase': `${ringPhaseDelaySec}s`,
        '--about-float-phase': `${floatPhaseDelaySec}s`,
      }}
    >
      <motion.header
        className="about-hero"
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="about-hero__layers" aria-hidden>
          <div className="about-hero__aurora" />
          <div className="about-hero__orb about-hero__orb--1" />
          <div className="about-hero__orb about-hero__orb--2" />
          <div className="about-hero__orb about-hero__orb--3" />
        </div>
        <div className="about-hero__grain" aria-hidden />
        <div className="about-hero__inner">
          <motion.h1
            className="about-hero__title"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
          >
            Մեր մասին
          </motion.h1>
          <motion.p
            className="about-hero__tagline"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.16 }}
          >
            Մաթեմատիկան՝ մտածելու արվեստ
          </motion.p>
          <motion.p
            className="about-hero__lead"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.22 }}
          >
            Սովորեք հանգիստ, քայլ առ քայլ՝ նույն գաղափարներով, որոնք կառուցում են ամբողջ կուրսը։
          </motion.p>
          <div className="about-hero__pillars about-hero__pillars--tri" role="list">
            {PILLARS.map(({ Icon, label, targetId }, index) => (
              <motion.button
                key={label}
                type="button"
                className="about-hero__pillar"
                role="listitem"
                onClick={() => scrollToSection(targetId)}
                aria-label={`${label} — անցնել համապատասխան բաժին`}
                {...pillarMotion}
                transition={
                  reduceMotion
                    ? undefined
                    : {
                        duration: 0.5,
                        delay: 0.08 * index,
                        ease: [0.22, 1, 0.36, 1],
                      }
                }
              >
                <span className="about-hero__pillarIconWrap" aria-hidden>
                  <span className="about-hero__pillarIconGlow" />
                  <Icon className="about-hero__pillarIcon" size={22} strokeWidth={2} />
                </span>
                <span className="about-hero__pillarLabel">{label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.header>

      <motion.section
        id="about-stats"
        className="about-stats"
        aria-labelledby="about-stats-heading"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 id="about-stats-heading" className="about-stats__title">
          Թվեր և փաստեր
        </h2>
        <p className="about-stats__sub">
          Թվերը հաշվարկվում են ուսումնական նյութերի հիման վրա։
        </p>
        <ul className="about-stats__grid">
          <li className="about-stats__card">
            <StatCountUp className="about-stats__num" target={stats.topicCount} />
            <span className="about-stats__label">Թեմաներ</span>
          </li>
          <li className="about-stats__card">
            <StatCountUp className="about-stats__num" target={stats.levelCount} />
            <span className="about-stats__label">Մակարդակներ</span>
          </li>
          <li className="about-stats__card">
            <StatCountUp className="about-stats__num" target={1} />
            <span className="about-stats__label">Հարցերի տեսակ</span>
          </li>
        </ul>
      </motion.section>

      <div className="about-sections">
        {SECTIONS.map((s, idx) => (
          <motion.section
            key={s.visual}
            id={`about-${s.visual}`}
            className={`about-block ${idx % 2 === 1 ? 'about-block--reverse' : ''}`}
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.48, delay: reduceMotion ? 0 : 0.06 * idx, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="about-block__textWrap">
              <p className="about-block__text">{s.text}</p>
            </div>
            <div className="about-block__visualWrap">
              <AboutSectionVisuals visual={s.visual} />
            </div>
          </motion.section>
        ))}
      </div>

      <section id="about-faq" className="about-faq" aria-labelledby="about-faq-heading">
        <h2 id="about-faq-heading" className="about-faq__title">
          Հաճախ տրվող հարցեր
        </h2>
        <div className="about-faq__list">
          {FAQ_ITEMS.map((item, i) => {
            const open = openFaq === i;
            const panelId = `about-faq-panel-${item.id}`;
            const headerId = `about-faq-header-${item.id}`;
            return (
              <div key={item.id} className={`about-faq__item ${open ? 'about-faq__item--open' : ''}`}>
                <h3 className="about-faq__q">
                  <button
                    type="button"
                    id={headerId}
                    className="about-faq__trigger"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenFaq(open ? null : i)}
                  >
                    <span className="about-faq__qText">{item.q}</span>
                    <ChevronDown className="about-faq__chevron" size={22} strokeWidth={2.2} aria-hidden />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={headerId}
                  className="about-faq__panel"
                  hidden={!open}
                >
                  <p className="about-faq__a">{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default About;
