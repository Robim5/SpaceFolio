import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import RevealOnScroll from './RevealOnScroll';
import styles from './Projects.module.css';
import allProjects from '@data/projects';
import getProjectImage from '../utils/projectImage';

export default function Projects() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const sectionRef = useRef(null);
  const scrollRef = useRef(null);
  const snapPointsRef = useRef([]);

  // only show first 3 featured projects on homepage
  const projects = useMemo(
    () =>
      allProjects
        .filter((p) => p.featured != null)
        .sort((a, b) => a.featured - b.featured)
        .slice(0, 3),
    []
  );

  // observe section visibilit
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);
  // first first
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = 0;
  }, []);

  // compute snap points based on child positions
  const updateSnapPoints = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    snapPointsRef.current = Array.from(el.children).map((child) => child.offsetLeft);
  }, []);

  // recalc snap points when projects change or on resize
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateSnapPoints();
    const raf = requestAnimationFrame(() => {
      updateSnapPoints();
      el.scrollLeft = 0;
      setActiveSlide(0);
    });

    const onResize = () => updateSnapPoints();
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [projects.length, updateSnapPoints]);

  // update active slide based on nearest snap point during scroll
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const points = snapPointsRef.current;
    if (!points.length) return;

    const current = el.scrollLeft;
    let closestIndex = 0;
    let closestDistance = Infinity;

    points.forEach((point, i) => {
      const distance = Math.abs(point - current);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    });

    setActiveSlide(closestIndex);
  }, []);

  // slide by index
  const scrollToSlide = useCallback((index) => {
    const el = scrollRef.current;
    if (!el) return;

    const points = snapPointsRef.current;
    const target = points[index];
    if (typeof target !== 'number') return;

    el.scrollTo({ left: target, behavior: 'smooth' });
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className={`${styles.projects} ${isVisible ? styles.visible : ''}`}
    >
      <div className="container">
        <RevealOnScroll>
          <h2 className={styles.sectionTitle}>Featured Projects</h2>
          <p className={styles.sectionSubtitle}>
            A selection of the best projects I have developed
          </p>
        </RevealOnScroll>

        <div
          className={styles.grid}
          ref={scrollRef}
          onScroll={handleScroll}
        >
          {projects.map((project, index) => {
            const imageSrc = getProjectImage(project);
            const isPlaceholder = imageSrc.includes('/assets/placeholders/');

            return (
            <article
              key={project.id}
              className={`${styles.card} ${isVisible ? styles.cardVisible : ''}`}
              style={{ transitionDelay: `${index * 0.12}s` }}
            >
              <div className={styles.cardImageWrap}>
                <img src={imageSrc} alt="" aria-hidden="true"
                  className={styles.cardImageBg} loading="lazy" />
                <img src={imageSrc} alt={project.title}
                  className={`${styles.cardImage} ${isPlaceholder ? styles.cardImagePlaceholder : ''}`} loading="lazy" />
                <span className={styles.cardCategory}>{project.category}</span>
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
                    <a href={project.github} target="_blank" rel="noopener noreferrer"
                      className={styles.btnGithub}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                      </svg>
                      Code
                    </a>
                  )}
                  {project.demo && (
                    <a href={project.demo} target="_blank" rel="noopener noreferrer"
                      className={styles.btnDemo}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                          strokeLinejoin="round" />
                      </svg>
                      Demo
                    </a>
                  )}
                </div>
              </div>
            </article>
            );
          })}
        </div>

        <div className={styles.dots}>
          {projects.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === activeSlide ? styles.dotActive : ''}`}
              onClick={() => scrollToSlide(i)}
              aria-label={`Go to project ${i + 1}`}
            />
          ))}
        </div>

        <p className={styles.swipeHint}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          Swipe to explore
        </p>

        <div className={styles.seeAllWrap}>
          <Link to="/projects" className={styles.seeAllBtn}>
            <span>See all my projects</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
