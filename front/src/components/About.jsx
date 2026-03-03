import { useEffect, useRef, useState } from 'react';
import RevealOnScroll from './RevealOnScroll';
import styles from './About.module.css';

// about section
export default function About() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // animation when section enters
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
      id="about"
      ref={sectionRef}
      className={`${styles.about} ${isVisible ? styles.visible : ''}`}
    >
      <div className="container">
        <div className={styles.content}>
          <div className={styles.textContent}>
            <RevealOnScroll>
              <h2 className={styles.title}>About me</h2>
              <p className={styles.description}>
                Dedicated developer with a solid academic foundation in software
                engineering.
                From specialized high school training to a 2-year higher technical
                degree, I have dedicated my education to mastering code.
                I am now looking to apply my skills to build elegant,
                functional experiences.
              </p>
              <p className={styles.description}>
                I see code as a tool to turn imagination into reality.
              </p>
            </RevealOnScroll>

            <RevealOnScroll>
              <div className={styles.whatIDo}>
                <h3 className={styles.subtitle}>What I Do</h3>
                <ul className={styles.servicesList}>
                  <li>Full-stack web development with modern technologies</li>
                  <li>Design of intuitive and accessible interfaces</li>
                  <li>Performance optimization and SEO</li>
                  <li>Technical consulting and mentoring</li>
                </ul>
              </div>
            </RevealOnScroll>
          </div>

          <div className={styles.imageContainer}>
            <div className={styles.imageWrapper}>
              <img
                src="/assets/me.jpg"
                alt="Me"
                className={styles.profileImage}
              />
              <div className={styles.imageGlow}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
