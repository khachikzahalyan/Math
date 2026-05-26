import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mail,
  MessageSquare,
  Send,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import './Contact.css';

const WEB3FORMS_ACCESS_KEY = '86691d0e-6b86-4ceb-8522-976f86b15e29';
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
const SUCCESS_HOLD_MS = 2000;
const TOAST_HOLD_MS = 4000;

function Contact() {
  const reduceMotion = useReducedMotion();
  const successTimerRef = useRef(null);
  const toastTimerRef = useRef(null);
  /** idle → loading (spinner) → success (check) → idle */
  const [submitPhase, setSubmitPhase] = useState('idle');
  const [toast, setToast] = useState(null);

  useEffect(
    () => () => {
      if (successTimerRef.current) window.clearTimeout(successTimerRef.current);
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    },
    []
  );

  const showToast = (message) => {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    setToast({ message });
    toastTimerRef.current = window.setTimeout(() => {
      toastTimerRef.current = null;
      setToast(null);
    }, TOAST_HOLD_MS);
  };

  const dismissToast = () => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    setToast(null);
  };

  /* Lock document scroll on desktop only — on phones/tablets allow scroll so the keyboard
     doesn’t trap content (iOS/Android). */
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 901px)');
    const html = document.documentElement;
    const body = document.body;

    const apply = () => {
      if (mq.matches) {
        html.style.overflow = 'hidden';
        body.style.overflow = 'hidden';
      } else {
        html.style.overflow = '';
        body.style.overflow = '';
      }
    };

    apply();
    mq.addEventListener('change', apply);
    return () => {
      mq.removeEventListener('change', apply);
      html.style.overflow = '';
      body.style.overflow = '';
    };
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const nameInput = form.elements.namedItem('name');
    const emailInput = form.elements.namedItem('email');
    const messageInput = form.elements.namedItem('message');

    [nameInput, emailInput, messageInput].forEach((el) => {
      if (el && 'setCustomValidity' in el) el.setCustomValidity('');
    });

    const name = formData.name.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();

    if (!name) {
      nameInput.setCustomValidity('Խնդրում ենք լրացնել այս դաշտը');
      nameInput.reportValidity();
      return;
    }
    if (!email) {
      emailInput.setCustomValidity('Խնդրում ենք լրացնել այս դաշտը');
      emailInput.reportValidity();
      return;
    }
    if (!message) {
      messageInput.setCustomValidity('Խնդրում ենք լրացնել այս դաշտը');
      messageInput.reportValidity();
      return;
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      emailInput.setCustomValidity('Մուտքագրեք վավեր էլ․ փոստ');
      emailInput.reportValidity();
      return;
    }

    if (submitPhase !== 'idle') return;

    setSubmitPhase('loading');

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name,
          email,
          message,
          subject: `Նոր հաղորդագրություն՝ ${name}`,
          from_name: name,
          replyto: email,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || `Send failed (HTTP ${response.status})`);
      }

      setFormData({ name: '', email: '', message: '' });
      setSubmitPhase('success');
      if (successTimerRef.current) window.clearTimeout(successTimerRef.current);
      successTimerRef.current = window.setTimeout(() => {
        successTimerRef.current = null;
        setSubmitPhase('idle');
      }, SUCCESS_HOLD_MS);
    } catch (err) {
      console.error('[contact] submit failed:', err);
      setSubmitPhase('idle');
      showToast('Չհաջողվեց ուղարկել հաղորդագրությունը։ Փորձեք կրկին։');
    }
  };

  const fieldMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 10 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
      };

  return (
    <div className="contact-page">
      <motion.header
        className="contact-hero"
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="contact-hero__layers" aria-hidden>
          <div className="contact-hero__blob contact-hero__blob--a" />
          <div className="contact-hero__blob contact-hero__blob--b" />
        </div>
        <div className="contact-hero__inner">
          <div className="contact-hero__mark" aria-hidden>
            <Mail className="contact-hero__markIcon" size={44} strokeWidth={1.75} />
            <Sparkles className="contact-hero__spark" size={22} strokeWidth={2} aria-hidden />
          </div>
          <h1 className="contact-hero__title">Կապվեք մեզ հետ</h1>
          <p className="contact-hero__lead">
            Հարցեր, առաջարկներ կամ մեկնաբանությունների համար լրացրեք ներքևի ձևը։
          </p>
        </div>
      </motion.header>

      <motion.section
        className="contact-shell"
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.06, ease: [0.22, 1, 0.36, 1] }}
      >
        <form className="contact-form" onSubmit={handleSubmit}>
          <motion.div className="contact-field" {...fieldMotion} transition={{ ...fieldMotion.transition, delay: 0 }}>
            <label className="contact-field__label" htmlFor="name">
              <span className="contact-field__labelIcon" aria-hidden>
                <User size={17} strokeWidth={2} />
              </span>
              Անուն
            </label>
            <div className="contact-field__control">
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="Ձեր անունը"
                value={formData.name}
                onChange={handleChange}
                onInvalid={(e) =>
                  e.target.setCustomValidity('Խնդրում ենք լրացնել այս դաշտը')
                }
                onInput={(e) => e.target.setCustomValidity('')}
              />
            </div>
          </motion.div>

          <motion.div className="contact-field" {...fieldMotion} transition={{ ...fieldMotion.transition, delay: 0.05 }}>
            <label className="contact-field__label" htmlFor="email">
              <span className="contact-field__labelIcon" aria-hidden>
                <Mail size={17} strokeWidth={2} />
              </span>
              Էլ․ փոստ
            </label>
            <div className="contact-field__control">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Ձեր էլ․ փոստը"
                value={formData.email}
                onChange={handleChange}
                onInvalid={(e) =>
                  e.target.setCustomValidity('Խնդրում ենք լրացնել այս դաշտը')
                }
                onInput={(e) => e.target.setCustomValidity('')}
              />
            </div>
          </motion.div>

          <motion.div className="contact-field" {...fieldMotion} transition={{ ...fieldMotion.transition, delay: 0.1 }}>
            <label className="contact-field__label" htmlFor="message">
              <span className="contact-field__labelIcon" aria-hidden>
                <MessageSquare size={17} strokeWidth={2} />
              </span>
              Հաղորդագրություն
            </label>
            <div className="contact-field__control contact-field__control--textarea">
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                placeholder="Ձեր հարցը կամ հաղորդագրությունը"
                value={formData.message}
                onChange={handleChange}
                onInvalid={(e) =>
                  e.target.setCustomValidity('Խնդրում ենք լրացնել այս դաշտը')
                }
                onInput={(e) => e.target.setCustomValidity('')}
              />
            </div>
          </motion.div>

          <div className="contact-submitWrap">
            <motion.button
              type="submit"
              disabled={submitPhase !== 'idle'}
              aria-busy={submitPhase === 'loading'}
              className={[
                'contact-submit',
                submitPhase === 'loading' && 'contact-submit--loading',
                submitPhase === 'success' && 'contact-submit--success',
              ]
                .filter(Boolean)
                .join(' ')}
              whileHover={
                submitPhase === 'idle' && !reduceMotion ? { scale: 1.02 } : undefined
              }
              whileTap={
                submitPhase === 'idle' && !reduceMotion ? { scale: 0.98 } : undefined
              }
            >
              {submitPhase === 'loading' && (
                <>
                  <Loader2
                    className={
                      reduceMotion
                        ? 'contact-submit__spinner contact-submit__spinner--reduced'
                        : 'contact-submit__spinner'
                    }
                    size={18}
                    strokeWidth={2.4}
                    aria-hidden
                  />
                  <span>Ուղարկում…</span>
                </>
              )}
              {submitPhase === 'success' && (
                <>
                  <CheckCircle2
                    className="contact-submit__icon"
                    size={18}
                    strokeWidth={2.4}
                    aria-hidden
                  />
                  <span>Ուղարկված է</span>
                </>
              )}
              {submitPhase === 'idle' && (
                <>
                  <Send className="contact-submit__icon" size={18} strokeWidth={2.2} aria-hidden />
                  <span>Ուղարկել</span>
                </>
              )}
            </motion.button>
          </div>
        </form>

        <p className="contact-footnote">
          Մենք կպատասխանենք հնարավորինս արագ։
        </p>
      </motion.section>

      <AnimatePresence>
        {toast && (
          <motion.div
            key="contact-toast"
            className="contact-toast"
            role="alert"
            aria-live="assertive"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <AlertCircle className="contact-toast__icon" size={18} strokeWidth={2.2} aria-hidden />
            <span className="contact-toast__text">{toast.message}</span>
            <button
              type="button"
              className="contact-toast__close"
              onClick={dismissToast}
              aria-label="Փակել"
            >
              <X size={16} strokeWidth={2.2} aria-hidden />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Contact;
