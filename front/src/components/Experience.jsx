import { useEffect, useRef, useState } from 'react';
import RevealOnScroll from './RevealOnScroll';
import styles from './Experience.module.css';
import experiences from '@data/professional';

// timeline display
export default function Experience() {
  const [isVisible, setIsVisible] = useState(false); // Animate on visibility
  const sectionRef = useRef(null); // Section element reference

  // show
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="professional"
      ref={sectionRef}
      className={`${styles.experience} ${isVisible ? styles.visible : ''}`}
    >
      <div className="container">
        <RevealOnScroll>
          <h2 className={styles.sectionTitle}>Professional Journey</h2>
        </RevealOnScroll>

        <div className={styles.timeline}>
          {/* render timeline item for each experience */}
          {experiences.map((exp, index) => (
            <div
              key={index}
              className={styles.timelineItem}
              style={{ transitionDelay: `${index * 0.15}s` }}
            >
              <div className={styles.timelineIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M20 7h-4V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 5h4v2h-4V5z" fill="currentColor"/>
                </svg>
              </div>

              <div className={styles.timelineContent}>
                <span className={styles.period}>{exp.period}</span>
                <h3 className={styles.title}>{exp.title}</h3>
                <p className={styles.company}>
                  {exp.company} • <span className={styles.location}>{exp.location}</span>
                </p>
                <p className={styles.description}>{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
