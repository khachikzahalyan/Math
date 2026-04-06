import { useCallback, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  BookOpen,
  Brain,
  ChevronDown,
  Compass,
  Heart,
  Lightbulb,
  Scale,
} from 'lucide-react';
import StatCountUp from '../../components/StatCountUp/StatCountUp';
import { getCourseStats } from '../../data/topicsUtils';
import './About.css';

/** Must match `.about-visual__ring` animation duration in About.css (28s). */
const ABOUT_RING_DURATION_MS = 28000;
/** Shared phase for pillar icon float (8s loop in CSS). */
const ABOUT_FLOAT_DURATION_MS = 8000;

const SECTIONS = [
  {
    text: `Այս կայքը ստեղծվել է այն գաղափարի շուրջ, որ մաթեմատիկան պետք է լինի հասկանալի, հասանելի և հետաքրքիր յուրաքանչյուր մարդու համար։
Մենք հավատում ենք, որ ճիշտ մոտեցման դեպքում նույնիսկ ամենաբարդ թեմաները կարող են դառնալ պարզ և ընկալելի։`,
    visual: 'mission',
  },
  {
    text: `Մաթեմատիկան միայն թվերի և բանաձևերի համախումբ չէ։
Այն զարգացնում է տրամաբանական մտածողությունը, վերլուծական հմտությունները, խնդիրներ լուծելու կարողությունը և ինքնուրույն մտածելու ունակությունը։
Այս հմտությունները կարևոր են ոչ միայն ուսման ընթացքում, այլ նաև առօրյա կյանքում և մասնագիտական գործունեության մեջ։`,
    visual: 'skills',
  },
  {
    text: `Լոգիկան մաթեմատիկայի կորիզն է՝ ապացույց, հետևություն, կառուցված մտածողություն։
Մենք ընտրել ենք տրամաբանական ուղին, որովհետև այն օգնում է հստակ ձևակերպել, ճիշտ վերջնարկել և վստահ լինել սեփական արդյունքներին։
Յուրաքանչյուր քայլը կառուցված է այն նույն սկզբունքների վրա, որոնք կապում են թեմաները մեկ ամբողջական ուղու մեջ։`,
    visual: 'logic',
  },
];

const PILLARS = [
  { Icon: Compass, label: 'Պարզ ուղի', targetId: 'about-mission' },
  { Icon: Lightbulb, label: 'Տրամաբանություն', targetId: 'about-logic' },
  { Icon: Heart, label: 'Համբերություն և առաջընթաց', targetId: 'about-stats' },
];

const FAQ_ITEMS = [
  {
    id: 'progress',
    q: 'Պահվում է արդյոք իմ առաջընթացը։',
    a: 'Այո։ Ձեր պատասխանները և մակարդակների այցելումները պահվում են այս բրաուզերի localStorage-ում՝ նույն սարքում։ Տվյալները չեն ուղարկվում սերվեր և տեսանելի չեն այլ սարքերին։',
  },
  {
    id: 'account',
    q: 'Պետք է գրանցում կամ հաշիվ ստեղծել։',
    a: 'Ոչ։ Կարող եք օգտագործել հարթակը առանց գրանցման։',
  },
  {
    id: 'offline',
    q: 'Աշխատում է արդյոք առանց ինտերնետի։',
    a: 'Էջերը պետք է առաջին անգամ բեռնվեն ինտերնետով։ Ամբողջական offline-ռեժիմ չի ապահովվում։ Պահված առաջընթացը հասանելի է միայն այս բրաուզերում, նույն սարքում։',
  },
  {
    id: 'clear',
    q: 'Ինչպես ջնջել պահված տվյալները։',
    a: 'Բրաուզերի կարգավորումներից կարող եք մաքրել այս կայքի localStorage-ը կամ օգտագործել գաղտնի պատուհան՝ առանց պահման։',
  },
];

function VisualMission() {
  return (
    <div className="about-visual about-visual--mission" aria-hidden>
      <div className="about-visual__mesh" />
      <div className="about-visual__card">
        <BookOpen className="about-visual__icon" strokeWidth={1.75} />
      </div>
      <span className="about-visual__ring" />
    </div>
  );
}

function VisualSkills() {
  return (
    <div className="about-visual about-visual--skills" aria-hidden>
      <div className="about-visual__mesh about-visual__mesh--violet" />
      <div className="about-visual__card about-visual__card--brain">
        <Brain className="about-visual__icon about-visual__icon--brain" strokeWidth={1.65} />
      </div>
      <span className="about-visual__ring about-visual__ring--violet" />
    </div>
  );
}

function VisualLogic() {
  return (
    <div className="about-visual about-visual--logic" aria-hidden>
      <div className="about-visual__mesh about-visual__mesh--teal" />
      <div className="about-visual__card about-visual__card--logic">
        <Scale className="about-visual__icon about-visual__icon--logic" strokeWidth={1.65} />
      </div>
      <span className="about-visual__ring about-visual__ring--teal" />
    </div>
  );
}

function renderSectionVisual(visual) {
  if (visual === 'mission') return <VisualMission />;
  if (visual === 'skills') return <VisualSkills />;
  if (visual === 'logic') return <VisualLogic />;
  return null;
}

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

  const pillarMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 14 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
      };

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
          <motion.span
            className="about-hero__eyebrow"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            Կայքի առաքելություն
          </motion.span>
          <motion.h1
            className="about-hero__title"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
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
            Սովորիր հանգիստ, քայլ առ քայլ՝ նույն գաղափարներով, որոնք կառուցում են ամբողջ կուրսը։
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
          Ակտուալ թվերը հաշվարկվում են ուսումնական նյութերից (topics)։
        </p>
        <ul className="about-stats__grid">
          <li className="about-stats__card">
            <StatCountUp className="about-stats__num" target={stats.topicCount} />
            <span className="about-stats__label">Թեմա</span>
          </li>
          <li className="about-stats__card">
            <StatCountUp className="about-stats__num" target={stats.levelCount} />
            <span className="about-stats__label">Մակարդակ</span>
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
            <div className="about-block__visualWrap">{renderSectionVisual(s.visual)}</div>
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
