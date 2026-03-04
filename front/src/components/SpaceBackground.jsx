import { useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './SpaceBackground.module.css';
import usePerformanceMode from '../hooks/usePerformanceMode';

// generate deterministic star positions once
function generateStars(count) {
  const stars = [];
  for (let i = 0; i < count; i++) {
    const twinkleRand = Math.random();
    let twinkle = '';
    if (twinkleRand < 0.25) twinkle = 'twinkleSlow';
    else if (twinkleRand < 0.5) twinkle = 'twinkleMed';
    else if (twinkleRand < 0.7) twinkle = 'twinkleFast';

    stars.push({
      id: i,
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      size: Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.7 + 0.15,
      twinkle,
      delay: `${Math.random() * 6}s`,
    });
  }
  return stars;
}

// background with parallax orbs, starfield and shooting stars
function DesktopBackground() {
  const { scrollYProgress } = useScroll();

  // orb 1
  const orb1Y = useTransform(scrollYProgress, [0, 1], ['0%', '-18%']);
  const orb1X = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);

  // orb 2
  const orb2Y = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const orb2X = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);

  // orb 3
  const orb3Y = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const orb3X = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);

  // orb 4
  const orb4Y = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const orb4X = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);

  // orb 5
  const orb5Y = useTransform(scrollYProgress, [0, 1], ['0%', '-40%']);
  const orb5X = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);

  // orb 6
  const orb6Y = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const orb6X = useTransform(scrollYProgress, [0, 1], ['0%', '-5%']);

  // orb 7
  const orb7Y = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);

  // orb 8
  const orb8Y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const orb8X = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);

  // starfield
  const starsY = useTransform(scrollYProgress, [0, 1], ['0%', '-35%']);
  const stars = useMemo(() => generateStars(160), []);

  return (
    <div className={styles.spaceContainer} aria-hidden="true">
      {/* nebula layers */}
      <div className={styles.nebula1} />
      <div className={styles.nebula2} />

      {/* 8 animated orbs with parallax effects */}
      <motion.div className={`${styles.orb} ${styles.orb1}`} style={{ y: orb1Y, x: orb1X }} />
      <motion.div className={`${styles.orb} ${styles.orb2}`} style={{ y: orb2Y, x: orb2X }} />
      <motion.div className={`${styles.orb} ${styles.orb3}`} style={{ y: orb3Y, x: orb3X }} />
      <motion.div className={`${styles.orb} ${styles.orb4}`} style={{ y: orb4Y, x: orb4X }} />
      <motion.div className={`${styles.orb} ${styles.orb5}`} style={{ y: orb5Y, x: orb5X }} />
      <motion.div className={`${styles.orb} ${styles.orb6}`} style={{ y: orb6Y, x: orb6X }} />
      <motion.div className={`${styles.orb} ${styles.orb7}`} style={{ y: orb7Y }} />
      <motion.div className={`${styles.orb} ${styles.orb8}`} style={{ y: orb8Y, x: orb8X }} />

      {/* starfield layer */}
      <motion.div className={styles.starfield} style={{ y: starsY }}>
        {stars.map((s) => (
          <span
            key={s.id}
            className={`${styles.star} ${s.twinkle ? styles[s.twinkle] : ''}`}
            style={{
              left: s.x,
              top: s.y,
              width: s.size,
              height: s.size,
              opacity: s.opacity,
              animationDelay: s.delay,
            }}
          />
        ))}
      </motion.div>

      {/* shooting stars */}
      <div className={styles.shootingStar1} />
      <div className={styles.shootingStar2} />
      <div className={styles.shootingStar3} />

      {/* small floating orbs  */}
      <div className={styles.miniOrb1} />
      <div className={styles.miniOrb2} />
      <div className={styles.miniOrb3} />
      <div className={styles.miniOrb4} />
      <div className={styles.miniOrb5} />
      <div className={styles.miniOrb6} />
      <div className={styles.miniOrb7} />
      <div className={styles.miniOrb8} />
      <div className={styles.miniOrb9} />
      <div className={styles.miniOrb10} />
    </div>
  );
}

function LiteBackground({ isPhone }) {
  const stars = useMemo(() => generateStars(isPhone ? 25 : 72), [isPhone]);

  return (
    <div className={`${styles.spaceContainer} ${styles.lite}`} aria-hidden="true">
      <div className={styles.nebula1} />
      <div className={styles.nebula2} />

      <div className={`${styles.orb} ${styles.orb1}`} />
      <div className={`${styles.orb} ${styles.orb3}`} />
      <div className={`${styles.orb} ${styles.orb6}`} />

      <div className={styles.starfield}>
        {stars.map((s) => (
          <span
            key={s.id}
            className={`${styles.star} ${s.twinkle ? styles[s.twinkle] : ''}`}
            style={{
              left: s.x,
              top: s.y,
              width: s.size,
              height: s.size,
              opacity: s.opacity,
              animationDelay: s.delay,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function SpaceBackground() {
  const { isPhone, isTablet, useLiteEffects, reduceMotion } = usePerformanceMode();
  const useLiteMode = isPhone || isTablet || useLiteEffects || reduceMotion;

  if (useLiteMode) {
    return <LiteBackground isPhone={isPhone} />;
  }

  return <DesktopBackground />;
}
