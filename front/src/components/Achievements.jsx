import { useEffect, useRef } from 'react';
import styles from './Achievements.module.css';
import achievements from '@data/achievements';
import usePerformanceMode from '../hooks/usePerformanceMode';

// svg icon map
const ICONS = {
    globe: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
        </svg>
    ),
    code: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
        </svg>
    ),
    trophy: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
        </svg>
    ),
    graduation: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6" />
            <path d="M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
    ),
    shield: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
        </svg>
    ),
    palette: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
            <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
            <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
            <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
        </svg>
    ),
    gamepad: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="6" y1="11" x2="10" y2="11" />
            <line x1="8" y1="9" x2="8" y2="13" />
            <circle cx="15" cy="12" r=".5" fill="currentColor" />
            <circle cx="18" cy="10" r=".5" fill="currentColor" />
            <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" />
        </svg>
    ),
    terminal: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 17 10 11 4 5" />
            <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
    ),
    users: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    ),
    star: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    ),
};

const NORMAL_SPEED = 0.5;
const HOVER_SPEED = 0.15;
const LERP = 0.035;

export default function Achievements() {
    const trackRef = useRef(null);
    const animRef = useRef(null);
    const offsetRef = useRef(0);
    const speedRef = useRef({ current: NORMAL_SPEED, target: NORMAL_SPEED });
    const { isPhone, isTablet, useLiteEffects, reduceMotion } = usePerformanceMode();
    const useStaticTrack = isPhone || isTablet || useLiteEffects || reduceMotion;

    // duplicate items 3x
    const items = useStaticTrack
        ? achievements
        : [...achievements, ...achievements, ...achievements];

    // loop ani
    useEffect(() => {
        if (useStaticTrack) return;

        let lastTime = 0;

        const animate = (time) => {
            if (lastTime === 0) lastTime = time;
            const delta = time - lastTime;
            lastTime = time;

            // smooth speed change
            const s = speedRef.current;
            s.current += (s.target - s.current) * LERP;

            if (trackRef.current) {
                offsetRef.current -= s.current * (delta / 16.67);

                // no more? again
                const singleSetWidth = trackRef.current.scrollWidth / 3;
                if (Math.abs(offsetRef.current) >= singleSetWidth) {
                    offsetRef.current += singleSetWidth;
                }

                trackRef.current.style.transform = `translateX(${offsetRef.current}px)`;
            }

            animRef.current = requestAnimationFrame(animate);
        };

        animRef.current = requestAnimationFrame(animate);
        return () => {
            if (animRef.current) cancelAnimationFrame(animRef.current);
        };
    }, [useStaticTrack]);

    // speed handlers
    const handleMouseEnter = () => { speedRef.current.target = HOVER_SPEED; };
    const handleMouseLeave = () => { speedRef.current.target = NORMAL_SPEED; };

    return (
        <section id="achievements" className={styles.achievements}>
            <div className={styles.header}>
                <h2 className={styles.title}>Achievements</h2>
                <p className={styles.subtitle}>Milestones unlocked along the way</p>
            </div>

            {/* ambient glow behind center */}
            <div className={styles.centerGlow} aria-hidden="true" />

            <div
                className={`${styles.viewport} ${useStaticTrack ? styles.viewportStatic : ''}`}
                onMouseEnter={useStaticTrack ? undefined : handleMouseEnter}
                onMouseLeave={useStaticTrack ? undefined : handleMouseLeave}
            >
                <div ref={trackRef} className={`${styles.track} ${useStaticTrack ? styles.trackStatic : ''}`}>
                    {items.map((a, i) => (
                        <div key={`${a.id}-${i}`} className={styles.card}>
                            <div className={styles.cardShimmer} aria-hidden="true" />
                            <div className={styles.cardGlow} />
                            <div className={styles.cardIcon}>
                                {ICONS[a.icon] || ICONS.star}
                            </div>
                            <div className={styles.cardInfo}>
                                <span className={styles.cardTitle}>{a.title}</span>
                                <span className={styles.cardLevel}>{a.level}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
