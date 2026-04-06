import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

/**
 * Animated integer 0 → target when scrolled into view (matches Home hero stats).
 */
function StatCountUp({ target, suffix, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    if (reduceMotion) {
      setCount(target);
      return undefined;
    }
    const duration = 1400;
    const steps = 35;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target, reduceMotion]);

  return (
    <span ref={ref} className={className}>
      {count}
      {suffix || ''}
    </span>
  );
}

export default StatCountUp;
