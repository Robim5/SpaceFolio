import { useEffect, useMemo, useState } from 'react';

function getConnectionFlags() {
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;

  if (!connection) {
    return { saveData: false, slowNetwork: false };
  }

  const slowTypes = ['slow-2g', '2g', '3g'];
  return {
    saveData: Boolean(connection.saveData),
    slowNetwork: slowTypes.includes(connection.effectiveType),
  };
}

function computeProfile() {
  if (typeof window === 'undefined') {
    return {
      isPhone: false,
      isTablet: false,
      isLaptop: true,
      useLiteEffects: false,
      reduceMotion: false,
    };
  }

  const width = window.innerWidth;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const { saveData, slowNetwork } = getConnectionFlags();

  const isPhone = width <= 768;
  const isTablet = width > 768 && width <= 1100;
  const isLaptop = width > 1100;

  const useLiteEffects =
    reducedMotion ||
    saveData ||
    slowNetwork ||
    (coarsePointer && width <= 1100);

  return {
    isPhone,
    isTablet,
    isLaptop,
    useLiteEffects,
    reduceMotion: reducedMotion,
  };
}

export default function usePerformanceMode() {
  const [profile, setProfile] = useState(() => computeProfile());

  useEffect(() => {
    const mediaQueries = [
      window.matchMedia('(pointer: coarse)'),
      window.matchMedia('(prefers-reduced-motion: reduce)'),
    ];

    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;

    const updateProfile = () => setProfile(computeProfile());

    updateProfile();
    window.addEventListener('resize', updateProfile, { passive: true });
    mediaQueries.forEach((query) => query.addEventListener('change', updateProfile));
    connection?.addEventListener?.('change', updateProfile);

    return () => {
      window.removeEventListener('resize', updateProfile);
      mediaQueries.forEach((query) => query.removeEventListener('change', updateProfile));
      connection?.removeEventListener?.('change', updateProfile);
    };
  }, []);

  return useMemo(() => profile, [profile]);
}
