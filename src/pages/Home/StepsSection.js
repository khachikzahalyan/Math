import { motion } from 'framer-motion';
import { BookOpen, Brain, PencilLine } from 'lucide-react';

function StepsSection() {
  return (
    <section className="steps-section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        className="steps-header"
      >
        <h2 className="steps-title">Ինչու է հարթակը աշխատում</h2>
        <p className="steps-subtitle">
          Երեք հիմնական բաղադրիչ՝ սովորելու ամբողջ ճանապարհը պարզ և վերահսկելի դարձնելու համար։
        </p>
      </motion.div>

      <div className="steps-grid">
        <motion.article
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, delay: 0 }}
          className="step-card step-card--1"
        >
          <span className="step-number">01</span>
          <div className="step-icon"><BookOpen size={22} /></div>
          <h3 className="step-title">Տեսություն</h3>
          <p className="step-text">Կարճ, հստակ և հասկանալի բացատրություններ՝ առանց ավելորդ բարդության։</p>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="step-card step-card--2"
        >
          <span className="step-number">02</span>
          <div className="step-icon"><Brain size={22} /></div>
          <h3 className="step-title">Մտածողություն</h3>
          <p className="step-text">Գործնական առաջադրանքներ՝ վերլուծական և տրամաբանական մտածողությունը զարգացնելու համար։</p>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="step-card step-card--3"
        >
          <span className="step-number">03</span>
          <div className="step-icon"><PencilLine size={22} /></div>
          <h3 className="step-title">Ստուգում</h3>
          <p className="step-text">Արագ մինի-թեստեր՝ առաջընթացը հասկանալու և հաջորդ քայլը ճիշտ ընտրելու համար։</p>
        </motion.article>
      </div>
    </section>
  );
}

export default StepsSection;
