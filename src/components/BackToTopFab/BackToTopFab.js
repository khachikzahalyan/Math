import { useLayoutEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import './BackToTopFab.css';

const SHOW_AFTER_PX = 360;

function getLessonsScrollEl() {
  return document.querySelector('.lessonsLayout__content');
}

function BackToTopFab() {
  const { pathname } = useLocation();
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    const readScroll = () => {
      const lessonsEl = pathname.startsWith('/lessons') ? getLessonsScrollEl() : null;
      if (lessonsEl) {
        setVisible(lessonsEl.scrollTop > SHOW_AFTER_PX);
      } else {
        setVisible(window.scrollY > SHOW_AFTER_PX);
      }
    };

    readScroll();

    const lessonsEl = pathname.startsWith('/lessons') ? getLessonsScrollEl() : null;
    if (lessonsEl) {
      lessonsEl.addEventListener('scroll', readScroll, { passive: true });
      return () => lessonsEl.removeEventListener('scroll', readScroll);
    }

    window.addEventListener('scroll', readScroll, { passive: true });
    return () => window.removeEventListener('scroll', readScroll);
  }, [pathname]);

  const scrollToTop = () => {
    const lessonsEl = pathname.startsWith('/lessons') ? getLessonsScrollEl() : null;
    const behavior = reduceMotion ? 'auto' : 'smooth';
    if (lessonsEl) {
      lessonsEl.scrollTo({ top: 0, behavior });
    } else {
      window.scrollTo({ top: 0, behavior });
    }
  };

  return (
    <AnimatePresence mode="wait">
      {visible ? (
        <motion.button
          key="back-to-top-fab"
          type="button"
          className="backToTopFab"
          onClick={scrollToTop}
          aria-label="Վերադառնալ էջի սկիզբը"
          title="Վերև"
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: 6 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          whileHover={reduceMotion ? undefined : { scale: 1.04 }}
          whileTap={reduceMotion ? undefined : { scale: 0.97 }}
        >
          <span className="backToTopFab__glow" aria-hidden />
          <span className="backToTopFab__orbit" aria-hidden />
          <span className="backToTopFab__inner">
            <ChevronUp className="backToTopFab__icon" strokeWidth={2.2} size={18} aria-hidden />
          </span>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}

export default BackToTopFab;
