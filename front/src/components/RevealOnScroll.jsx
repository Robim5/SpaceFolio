import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import usePerformanceMode from '../hooks/usePerformanceMode';

// wraps children with a blue para clear reveal when entering viewport
export default function RevealOnScroll({ children, width = '100%' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { isPhone, isTablet, reduceMotion, useLiteEffects } = usePerformanceMode();
  const useLiteReveal = isPhone || isTablet || reduceMotion || useLiteEffects;

  const hiddenState = useLiteReveal
    ? { opacity: 0, y: 20 }
    : { opacity: 0, filter: 'blur(10px)', y: 30 };

  const visibleState = useLiteReveal
    ? { opacity: 1, y: 0 }
    : { opacity: 1, filter: 'blur(0px)', y: 0 };

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      initial={hiddenState}
      animate={isInView ? visibleState : hiddenState}
      transition={{ duration: useLiteReveal ? 0.55 : 0.8, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
