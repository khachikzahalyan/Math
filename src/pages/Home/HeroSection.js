import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

function HeroSection({ onStartQuiz }) {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/80 px-6 py-14 shadow-[0_24px_70px_rgba(99,102,241,0.12)] backdrop-blur-xl md:px-10 md:py-20">
      <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-indigo-200/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-10 h-56 w-56 rounded-full bg-sky-200/60 blur-3xl" />

      <div className="relative mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.45 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700"
        >
          <Sparkles size={14} />
          <span>EdTech հարթակ տրամաբանական մտածողության համար</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="text-4xl font-black leading-tight tracking-tight text-slate-900 md:text-6xl"
        >
          Ուսիր մաթեմատիկան
          <br />
          <span className="bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">
            պարզ և վստահ
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="mx-auto mt-4 max-w-2xl text-base text-slate-600 md:text-lg"
        >
          Սկսիր մեկ րոպեանոց թեստից, ստացիր քո մակարդակը և անցիր թեմաներով՝
          քայլ առ քայլ։
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.55, delay: 0.28 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/lessons"
            className="rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-3 text-sm font-bold text-white shadow-[0_10px_28px_rgba(79,70,229,0.4)] transition hover:-translate-y-0.5 hover:from-violet-700 hover:to-indigo-700 hover:text-white hover:shadow-[0_14px_32px_rgba(76,29,149,0.42)]"
          >
            Սկսել ուսուցումը
          </Link>
          <button
            type="button"
            onClick={onStartQuiz}
            className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
          >
            Թեստ 1 րոպեում
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
