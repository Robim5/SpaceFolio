import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

// navigation header with scroll background and mobile hamburger
export default function Header() {
  const [scrolled, setScrolled] = useState(false); // if page scrolled
  const [menuOpen, setMenuOpen] = useState(false); // mobile menu visibility
  const location = useLocation();
  const navigate = useNavigate();

  // see scroll for header styling
  useEffect(() => {
    let rafId = 0;

    const handleScroll = () => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 50);
        rafId = 0;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // no body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // handle nav clicks — navigate home first if on another page, then scroll
  const handleNavClick = (e, hash) => {
    setMenuOpen(false);

    if (location.pathname !== '/') {
      e.preventDefault();
      navigate('/' + hash);
    }
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.headerInner}>
        <a href="#start" className={styles.logo} onClick={(e) => handleNavClick(e, '#start')}>
          <span className={styles.logoSymbol}>&lt;</span>
          Rob
          <span className={styles.logoAccent}>Folio</span>
          <span className={styles.logoSymbol}>/&gt;</span>
        </a>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          <a href="#start" onClick={(e) => handleNavClick(e, '#start')}>Start</a>
          <a href="#about" onClick={(e) => handleNavClick(e, '#about')}>About</a>
          <a href="#professional" onClick={(e) => handleNavClick(e, '#professional')}>Exp</a>
          <a href="#projects" onClick={(e) => handleNavClick(e, '#projects')}>Projects</a>
          <a href="#skills" onClick={(e) => handleNavClick(e, '#skills')}>Skills</a>
          <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')}>Contact</a>
        </nav>

        <a href="#contact" className={styles.cta} onClick={(e) => handleNavClick(e, '#contact')}>Work with me</a>

        {/* hamburger menu for mobile */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* overlay for mobile menu */}
      {menuOpen && (
        <div className={styles.overlay} onClick={() => setMenuOpen(false)} />
      )}
    </header>
  );
}
