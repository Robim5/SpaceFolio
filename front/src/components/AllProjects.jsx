import { useMemo, useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './AllProjects.module.css';
import projects from '@data/projects';
import getProjectImage from '../utils/projectImage';

// status section config
const SECTIONS = [
  {
    key: 'done',
    title: 'Completed',
    subtitle: 'Projects that are alive for you to be impressed',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    color: '#4ade80',
    dotClass: 'statusDone',
  },
  {
    key: 'in-progress',
    title: 'In Progress',
    subtitle: 'Currently being built, stay tuned',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
    color: '#fbbf24',
    dotClass: 'statusInProgress',
  },
  {
    key: 'planned',
    title: 'Future Plans',
    subtitle: 'Many ideas, little time... coming soon ',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    color: '#9382dc',
    dotClass: 'statusPlanned',
  },
];

// projects card reused
function ProjectCard({ project, statusCfg }) {
  const imageSrc = getProjectImage(project);
  const isPlaceholder = imageSrc.includes('/assets/placeholders/');

  return (
    <article className={styles.card}>
      <div className={styles.cardImageWrap}>
        <img src={imageSrc} alt="" aria-hidden="true"
          className={styles.cardImageBg} loading="lazy" draggable={false} />
        <img src={imageSrc} alt={project.title}
          className={`${styles.cardImage} ${isPlaceholder ? styles.cardImagePlaceholder : ''}`} loading="lazy" draggable={false} />
        <div className={styles.cardBadges}>
          <span className={`${styles.statusBadge} ${styles[statusCfg.dotClass]}`}>
            <span className={styles.statusDot} />
            {statusCfg.title}
          </span>
          <span className={styles.cardCategory}>{project.category}</span>
        </div>
      </div>

      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{project.title}</h3>
        <p className={styles.cardDesc}>{project.description}</p>

        <div className={styles.tags}>
          {project.tags.map((t) => (
            <span key={t} className={styles.tag}>{t}</span>
          ))}
        </div>

        <div className={styles.cardActions}>
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className={styles.btnGithub}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              Code
            </a>
          )}
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer" className={styles.btnDemo}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Demo
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

// caroussel per selecion
function SectionCarousel({ items, statusCfg }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const dragStartX = useRef(0);
  const dragStartTime = useRef(0);
  const dragged = useRef(false);

  const maxIndex = Math.max(0, items.length - visibleCount);
  const needsCarousel = items.length > visibleCount;

  /* responsive (3desk, 1mob) */
  useEffect(() => {
    const update = () => setVisibleCount(window.innerWidth <= 768 ? 1 : 3);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const clampedIndex = Math.min(currentIndex, maxIndex);

  const goTo = useCallback((i) => {
    setCurrentIndex(Math.max(0, Math.min(i, maxIndex)));
  }, [maxIndex]);

  const goPrev = useCallback(() => goTo(clampedIndex - 1), [clampedIndex, goTo]);
  const goNext = useCallback(() => goTo(clampedIndex + 1), [clampedIndex, goTo]);

  // swipe
  const handleDragStart = useCallback((x) => {
    setIsDragging(true);
    dragged.current = false;
    dragStartX.current = x;
    dragStartTime.current = Date.now();
    setDragOffset(0);
  }, []);

  const handleDragMove = useCallback((x) => {
    if (!isDragging) return;
    const delta = x - dragStartX.current;
    if (Math.abs(delta) > 4) dragged.current = true;
    setDragOffset(delta);
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    const elapsed = Date.now() - dragStartTime.current;
    const velocity = Math.abs(dragOffset) / Math.max(elapsed, 1);
    const threshold = velocity > 0.4 ? 30 : 60;
    if (dragOffset > threshold) goPrev();
    else if (dragOffset < -threshold) goNext();
    setDragOffset(0);
  }, [isDragging, dragOffset, goPrev, goNext]);

  const onTouchStart = (e) => handleDragStart(e.touches[0].clientX);
  const onTouchMove = (e) => handleDragMove(e.touches[0].clientX);
  const onTouchEnd = () => handleDragEnd();
  const onMouseDown = (e) => { e.preventDefault(); handleDragStart(e.clientX); };
  const onMouseMove = (e) => handleDragMove(e.clientX);
  const onMouseUp = () => handleDragEnd();
  const onMouseLeave = () => { if (isDragging) handleDragEnd(); };
  const onClickCapture = (e) => { if (dragged.current) { e.preventDefault(); e.stopPropagation(); } };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') goPrev();
    if (e.key === 'ArrowRight') goNext();
  };

  const slidePercent = 100 / visibleCount;
  const trackStyle = {
    transform: `translateX(calc(${-clampedIndex * slidePercent}% + ${dragOffset}px))`,
    transition: isDragging ? 'none' : 'transform 0.55s cubic-bezier(0.32, 0.72, 0, 1)',
  };

  const totalPositions = maxIndex + 1;

  /* if 3 or fewer items normal grid */
  if (!needsCarousel) {
    return (
      <div className={styles.grid}>
        {items.map((project) => (
          <ProjectCard key={project.id} project={project} statusCfg={statusCfg} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div
        className={styles.carouselWrap}
        onKeyDown={onKeyDown}
        tabIndex={0}
        role="region"
        aria-label={`${statusCfg.title} projects carousel`}
      >
        {/* prev arrow */}
        <button
          className={`${styles.arrow} ${styles.arrowLeft}`}
          onClick={goPrev}
          disabled={clampedIndex === 0}
          aria-label="Previous projects"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* viewport */}
        <div
          className={styles.viewport}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onClickCapture={onClickCapture}
        >
          <div className={styles.track} style={trackStyle}>
            {items.map((project) => (
              <div key={project.id} className={styles.slide} style={{ flex: `0 0 ${slidePercent}%` }}>
                <ProjectCard project={project} statusCfg={statusCfg} />
              </div>
            ))}
          </div>
        </div>

        {/* next arrow */}
        <button
          className={`${styles.arrow} ${styles.arrowRight}`}
          onClick={goNext}
          disabled={clampedIndex === maxIndex}
          aria-label="Next projects"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* dot indicators */}
      <div className={styles.dots} role="tablist" aria-label="Carousel position">
        {Array.from({ length: totalPositions }, (_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === clampedIndex ? styles.dotActive : ''}`}
            onClick={() => goTo(i)}
            role="tab"
            aria-selected={i === clampedIndex}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function AllProjects() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  // group by status
  const grouped = useMemo(() => {
    const map = {};
    SECTIONS.forEach((s) => { map[s.key] = []; });
    projects.forEach((p) => {
      if (map[p.status]) map[p.status].push(p);
    });
    return map;
  }, []);

  const total = projects.length;

  return (
    <div className={styles.page}>
      <div className="container">
        <Link to="/" className={styles.backLink}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Home
        </Link>

        <motion.div
          className={styles.pageHeader}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={styles.pageTitle}>All Projects</h1>
          <p className={styles.pageSubtitle}>
            Everything I&apos;ve built, am building, and plan to build
          </p>

          <div className={styles.statsBar}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{total}</span>
              <span className={styles.statLabel}>Total</span>
            </div>
            {SECTIONS.map((s) => (
              <div key={s.key} className={styles.stat}>
                <span className={styles.statNumber} style={{ color: s.color }}>
                  {grouped[s.key].length}
                </span>
                <span className={styles.statLabel}>{s.title}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* status sections */}
        {SECTIONS.map((section) => {
          const sectionProjects = grouped[section.key];
          if (sectionProjects.length === 0) return null;

          return (
            <div key={section.key} className={styles.statusSection}>
              <motion.div
                className={styles.sectionHeader}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5 }}
              >
                <div className={styles.sectionIconWrap} style={{ '--section-color': section.color }}>
                  {section.icon}
                  <div className={styles.sectionIconGlow} />
                </div>
                <div className={styles.sectionMeta}>
                  <h2 className={styles.sectionTitle}>
                    {section.title}
                    <span className={styles.sectionCount}>{sectionProjects.length}</span>
                  </h2>
                  <p className={styles.sectionSubtitle}>{section.subtitle}</p>
                </div>
                <div className={styles.sectionLine} style={{ '--section-color': section.color }} />
              </motion.div>

              <SectionCarousel items={sectionProjects} statusCfg={section} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
