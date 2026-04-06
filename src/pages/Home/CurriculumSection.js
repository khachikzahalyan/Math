import { motion } from 'framer-motion';

const items = [
  {
    title: 'Հիմունքներ',
    text: 'Թվեր, գործողություններ, բաժանում, տոկոսներ և հիմնական ալգորիթմներ։',
  },
  {
    title: 'Ֆունկցիաներ և գրաֆիկներ',
    text: 'Ֆունկցիաների տեսակներ, գրաֆիկների ընթերցում և լուծման ռազմավարություն։',
  },
  {
    title: 'Խնդիրների լուծում',
    text: 'Քայլ առ քայլ մտածողություն՝ բարդ խնդիրները պարզ մասերի բաժանելու համար։',
  },
];

function CurriculumSection() {
  return (
    <section className="mx-auto max-w-6xl py-10 md:py-14">
      <motion.h2
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        className="mb-2 text-center text-3xl font-extrabold text-slate-900 md:text-4xl"
      >
        Learning Path
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mx-auto mb-8 max-w-2xl text-center text-slate-600"
      >
        Սովորիր փուլերով՝ հիմքից մինչև վստահ և ինքնուրույն լուծումներ։
      </motion.p>

      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item, index) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.45, delay: index * 0.1 }}
            className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-5 shadow-[0_10px_26px_rgba(99,102,241,0.08)]"
          >
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-indigo-600">
              {String(index + 1).padStart(2, '0')}
            </p>
            <h3 className="mb-2 text-lg font-bold text-slate-900">{item.title}</h3>
            <p className="text-sm leading-relaxed text-slate-600">{item.text}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export default CurriculumSection;
