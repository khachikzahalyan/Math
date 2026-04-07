import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { BookOpen, Brain, Library, ListTree, PencilLine, Sparkles } from 'lucide-react';
import { getCourseStats } from '../../data/topicsUtils';

const STEPS = [
  {
    name: 'Տեսություն',
    hint: 'Պարզ բացատրություններ',
    Icon: BookOpen,
  },
  {
    name: 'Մտածողություն',
    hint: 'Գործնական առաջադրանքներ',
    Icon: Brain,
  },
  {
    name: 'Ստուգում',
    hint: 'Արագ թեստեր',
    Icon: PencilLine,
  },
];

function HomeJourney() {
  const reduceMotion = useReducedMotion();
  const { levelCount, topicCount } = useMemo(() => getCourseStats(), []);
  const facts = useMemo(
    () => [
      { Icon: Library, text: 'Ամբողջ կուրսը մեկ տեղում' },
      { Icon: ListTree, text: 'Քայլ առ քայլ' },
      { Icon: Sparkles, text: `${levelCount} մակարդակ · ${topicCount} թեմա` },
    ],
    [levelCount, topicCount],
  );

  return (
    <section
      className="home-journey"
      aria-labelledby="home-journey-heading"
    >
      <motion.div
        className="home-journey__shell"
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <header className="home-journey__head">
          <p className="home-journey__eyebrow">Ուսումնական ուղի</p>
          <h2 id="home-journey-heading" className="home-journey__title">
            Երեք քայլով՝ տեսությունից մինչև ստուգում
          </h2>
          <p className="home-journey__lede">
            Նախ՝ հասկանալը, հետո՝ կիրառումը, վերջում՝ արդյունքի ստուգումը։ Այսպես ճանապարհը միշտ
            պարզ է։
          </p>
        </header>

        <div className="home-journey__rail">
          <div className="home-journey__trackLine" aria-hidden />
          <ol className="home-journey__steps">
            {STEPS.map(({ name, hint, Icon }, index) => (
              <motion.li
                key={name}
                className="home-journey__step"
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  duration: 0.42,
                  delay: reduceMotion ? 0 : 0.08 + index * 0.09,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="home-journey__node">
                  <span className="home-journey__nodeNum">{index + 1}</span>
                  <span className="home-journey__nodeIcon">
                    <Icon size={20} strokeWidth={2} aria-hidden />
                  </span>
                </div>
                <div className="home-journey__stepText">
                  <span className="home-journey__stepName">{name}</span>
                  <span className="home-journey__stepHint">{hint}</span>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        <ul className="home-journey__facts">
          {facts.map(({ Icon, text }, i) => (
            <li key={text} className="home-journey__fact">
              {i > 0 ? <span className="home-journey__factSep" aria-hidden>·</span> : null}
              <Icon className="home-journey__factIcon" size={15} strokeWidth={2.2} aria-hidden />
              {text}
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}

export default HomeJourney;
