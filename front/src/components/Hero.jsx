import { useState, useEffect, useRef } from 'react';
import styles from './Hero.module.css';

// hero section with animated canvas background and content
export default function Hero() {
  const [visible, setVisible] = useState(false);
  const canvasRef = useRef(null);

  // content animation
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // setup and animate floating particles on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];
    let sparkles = [];

    // resize canvas to match container
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // initialize asteroid particles with random properties
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 1.5,
        speedX: (Math.random() - 0.5) * 0.6,
        speedY: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.6 + 0.2,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        hue: Math.random() > 0.5 ? 280 : 270,
      });
    }

    // initialize sparkle particles with pulse animation
    for (let i = 0; i < 25; i++) {
      sparkles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 0.5,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        opacity: Math.random() * 0.8 + 0.2,
      });
    }

    // main animation loop for particles
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // draw and update asteroids
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotSpeed;

        // wrap around screen edges
        if (p.y > canvas.height + 10) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;

        // irregular asteroid shape
        ctx.beginPath();
        const sides = 5 + Math.floor(Math.random() * 3);
        for (let j = 0; j < sides; j++) {
          const angle = (j / sides) * Math.PI * 2;
          const r = p.size * (0.7 + Math.random() * 0.3);
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r;
          if (j === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = `hsla(${p.hue}, 55%, 45%, ${p.opacity})`;
        ctx.fill();

        // glow effect to asteroid
        ctx.shadowColor = `hsla(${p.hue}, 60%, 55%, 0.5)`;
        ctx.shadowBlur = 6;
        ctx.fill();

        ctx.restore();
      });

      // draw and update sparkles with pulsing effect
      sparkles.forEach((s) => {
        s.pulse += s.pulseSpeed;
        const alpha = (Math.sin(s.pulse) + 1) / 2 * s.opacity;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(s.x, s.y);

        // draw cross-shaped sparkle
        const len = s.size;
        ctx.strokeStyle = `hsla(275, 70%, 80%, ${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(-len, 0);
        ctx.lineTo(len, 0);
        ctx.moveTo(0, -len);
        ctx.lineTo(0, len);
        ctx.stroke();

        // center dot of sparkle
        ctx.beginPath();
        ctx.arc(0, 0, 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(275, 80%, 90%, ${alpha})`;
        ctx.fill();

        ctx.restore();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section id="start" className={styles.hero}>
      {/* canvas for asteroids and sparkles */}
      <canvas ref={canvasRef} className={styles.particleCanvas} aria-hidden="true" />

      {/* background gradient */}
      <div className={styles.gradientBg} aria-hidden="true" />

      {/* big right decorative orb */}
      <div className={styles.orbContainer} aria-hidden="true">
        <div className={styles.orb} />
        <div className={styles.orbRing} />
        <div className={styles.orbRing2} />
        <div className={styles.orbGlow} />
      </div>

      {/* small left decorative orb */}
      <div className={styles.orbContainerLeft} aria-hidden="true">
        <div className={styles.orbLeft} />
        <div className={styles.orbLeftRing} />
        <div className={styles.orbLeftRing2} />
        <div className={styles.orbLeftGlow} />
      </div>

      {/* main content */}
      <div className={`${styles.content} ${visible ? styles.visible : ''}`}>
        <span className={styles.badge}>
          <span className={styles.badgeDot} />
          Open for New Projects
        </span>

        <h1 className={styles.title}>
          <span className={styles.titleLine}>
            <span className={styles.titleText}>Dev</span>{' '}
            <span className={styles.titleAccent}>Robim</span>
          </span>
        </h1>

        <p className={styles.lead}>
          Creative developer transforming ideas
          <br/>
          into an amazing reality.
        </p>

        <p className={styles.subtitle}>Design &middot; Code &middot; Creativity</p>

        <div className={styles.actions}>
          <a href="#projects" className={styles.ctaPrimary}>
            See Projects
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        <div className={styles.socialIcons}>
          <a href="https://github.com/Robim5" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={styles.socialIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/fábio-alves-3327a9309" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={styles.socialIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
          </a>
          <a href="mailto:fabiormalves55@gmail.com" aria-label="Email" className={styles.socialIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor" />
            </svg>
          </a>
        </div>
      </div>

      {/* scroll indicator */}
      <div className={styles.scrollIndicator} aria-hidden="true">
        <div className={styles.scrollLine} />
      </div>
    </section>
  );
}
