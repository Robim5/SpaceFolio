import { useEffect, useRef, useState } from 'react';
import RevealOnScroll from './RevealOnScroll';
import styles from './Skills.module.css';
import skillCategories from '@data/skills';

// svg icons 
const CATEGORY_ICONS = {
  code: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" fill="currentColor" />
    </svg>
  ),
  layers: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" fill="currentColor" />
    </svg>
  ),
  database: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M20 13H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1zM7 19c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM20 3H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1zM7 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="currentColor" />
    </svg>
  ),
  tools: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" fill="currentColor" />
    </svg>
  ),
};

export default function Skills() {
  // visibility state 
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // compute total number of skills
  const totalSkillCount = skillCategories.reduce((acc, cat) => {
    if (cat.skills) return acc + cat.skills.length;
    if (cat.subcategories)
      return acc + cat.subcategories.reduce((a, s) => a + s.skills.length, 0);
    return acc;
  }, 0);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className={`${styles.skills} ${isVisible ? styles.visible : ''}`}
    >
      <div className="container">
        <RevealOnScroll>
          <h2 className={styles.sectionTitle}>Skills</h2>
          <p className={styles.sectionSubtitle}>
            Technologies and tools I have experience with
          </p>
          <div className={styles.skillCount}>
            <span className={styles.countNumber}>{totalSkillCount}</span>
            <span className={styles.countLabel}>technologies</span>
          </div>
        </RevealOnScroll>

        <div className={styles.grid}>
          {skillCategories.map((cat, ci) => (
            <div
              key={cat.title}
              className={`${styles.category} ${cat.subcategories ? styles.categoryWide : ''}`}
              style={{ transitionDelay: `${ci * 0.12}s` }}
            >
              <div className={styles.categoryGlow} />

              <div className={styles.categoryHeader}>
                <div className={styles.categoryIcon}>
                  {CATEGORY_ICONS[cat.iconType]}
                  <div className={styles.iconRing} />
                </div>
                <div className={styles.categoryMeta}>
                  <h3 className={styles.categoryTitle}>{cat.title}</h3>
                  <span className={styles.categoryBadge}>
                    {cat.skills
                      ? cat.skills.length
                      : cat.subcategories.reduce((a, s) => a + s.skills.length, 0)}{' '}
                    skills
                  </span>
                </div>
              </div>

              {cat.skills && (
                <div className={styles.pills}>
                  {cat.skills.map((skill, si) => (
                    <span
                      key={skill.name}
                      className={styles.pill}
                      style={{ transitionDelay: `${ci * 0.12 + si * 0.05}s` }}
                    >
                      <span className={styles.pillIcon}>{skill.abbr}</span>
                      {skill.name}
                    </span>
                  ))}
                </div>
              )}

              {cat.subcategories && (
                <div className={styles.subcategories}>
                  {cat.subcategories.map((sub) => (
                    <div key={sub.label} className={styles.subcategory}>
                      <span className={styles.subLabel}>{sub.label}</span>
                      <div className={styles.pills}>
                        {sub.skills.map((skill) => (
                          <span key={skill.name} className={styles.pill}>
                            <span className={styles.pillIcon}>{skill.abbr}</span>
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
