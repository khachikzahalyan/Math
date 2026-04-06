import { motion, useReducedMotion } from 'framer-motion';
import { BookOpen, Brain, Compass, Heart, Lightbulb, Sparkles, Zap } from 'lucide-react';
import './About.css';

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
];

const PILLARS = [
  { Icon: Compass, label: 'Պարզ ուղի' },
  { Icon: Lightbulb, label: 'Տրամաբանություն' },
  { Icon: Heart, label: 'Համբերություն և առաջընթաց' },
];

function VisualMission() {
  return (
    <div className="about-visual about-visual--mission" aria-hidden>
      <div className="about-visual__mesh" />
      <div className="about-visual__orb about-visual__orb--1" />
      <div className="about-visual__orb about-visual__orb--2" />
      <div className="about-visual__card">
        <BookOpen className="about-visual__icon" strokeWidth={1.75} />
        <Sparkles className="about-visual__spark" size={22} />
      </div>
      <span className="about-visual__ring" />
    </div>
  );
}

function VisualSkills() {
  return (
    <div className="about-visual about-visual--skills" aria-hidden>
      <div className="about-visual__mesh about-visual__mesh--violet" />
      <div className="about-visual__nodes">
        <span className="about-visual__node" />
        <span className="about-visual__node about-visual__node--lg" />
        <span className="about-visual__node" />
      </div>
      <div className="about-visual__card about-visual__card--brain">
        <div className="about-visual__brainCluster">
          <Brain className="about-visual__icon about-visual__icon--brain" strokeWidth={1.65} />
          <Zap className="about-visual__zap" size={22} strokeWidth={2.4} />
        </div>
      </div>
    </div>
  );
}

function About() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="about-page">
      <motion.header
        className="about-hero"
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="about-hero__eyebrow">Կայքի առաքելություն</span>
        <h1 className="about-hero__title">Մեր մասին</h1>
        <p className="about-hero__tagline">Մաթեմատիկան՝ մտածելու արվեստ</p>
        <p className="about-hero__lead">
          Սովորիր հանգիստ, քայլ առ քայլ՝ նույն գաղափարներով, որոնք կառուցում են ամբողջ կուրսը։
        </p>
        <div className="about-hero__pillars" role="list">
          {PILLARS.map(({ Icon, label }) => (
            <span key={label} className="about-hero__pillar" role="listitem">
              <Icon className="about-hero__pillarIcon" size={18} strokeWidth={2} aria-hidden />
              {label}
            </span>
          ))}
        </div>
      </motion.header>

      <div className="about-sections">
        {SECTIONS.map((s, idx) => (
          <motion.section
            key={idx}
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
              {s.visual === 'mission' ? <VisualMission /> : <VisualSkills />}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
}

export default About;
