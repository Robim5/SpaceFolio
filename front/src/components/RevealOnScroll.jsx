import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// wraps children with a blue para clear reveal when entering viewport
export default function RevealOnScroll({ children, width = '100%' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      initial={{ opacity: 0, filter: 'blur(10px)', y: 30 }}
      animate={
        isInView
          ? { opacity: 1, filter: 'blur(0px)', y: 0 }
          : { opacity: 0, filter: 'blur(10px)', y: 30 }
      }
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
