import { motion } from 'framer-motion';
import { BookOpen, Brain, PencilLine } from 'lucide-react';

const benefits = [
  {
    title: 'Տեսություն',
    text: 'Կարճ, հստակ և հասկանալի բացատրություններ՝ առանց ավելորդ բարդության։',
    Icon: BookOpen,
  },
  {
    title: 'Մտածողություն',
    text: 'Գործնական առաջադրանքներ՝ վերլուծական և տրամաբանական մտածողությունը զարգացնելու համար։',
    Icon: Brain,
  },
  {
    title: 'Ստուգում',
    text: 'Արագ մինի-թեստեր՝ առաջընթացը հասկանալու և հաջորդ քայլը ճիշտ ընտրելու համար։',
    Icon: PencilLine,
  },
];

function BenefitsSection() {
  return (
    <section className="mx-auto max-w-6xl px-1 py-10 md:py-14">
      <motion.h2
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        className="mb-2 text-center text-3xl font-extrabold text-slate-900 md:text-4xl"
      >
        Ինչու է հարթակը աշխատում
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mx-auto mb-8 max-w-2xl text-center text-slate-600"
      >
        Երեք հիմնական բաղադրիչ՝ սովորելու ամբողջ ճանապարհը պարզ և վերահսկելի դարձնելու համար։
      </motion.p>

      <div className="grid gap-4 md:grid-cols-3">
        {benefits.map(({ title, text, Icon }, index) => (
          <motion.article
            key={title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.45, delay: index * 0.1 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.07)] transition hover:-translate-y-1"
          >
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Icon size={20} />
            </div>
            <h3 className="mb-2 text-lg font-bold text-slate-900">{title}</h3>
            <p className="text-sm leading-relaxed text-slate-600">{text}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export default BenefitsSection;
