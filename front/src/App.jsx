import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import AllProjects from './components/AllProjects';
import SpaceBackground from './components/SpaceBackground';
import './App.css';

function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/' || !location.hash) return;

    const id = location.hash.replace('#', '');
    const scrollToSection = () => {
      const section = document.getElementById(id);
      if (!section) return false;
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return true;
    };

    if (scrollToSection()) return;

    const rafId = requestAnimationFrame(scrollToSection);
    return () => cancelAnimationFrame(rafId);
  }, [location.pathname, location.hash]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <SpaceBackground />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<AllProjects />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
