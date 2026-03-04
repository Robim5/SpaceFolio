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

// detect if hardware or gpu is weak
function detectLowGPU() {
  if (typeof window === 'undefined') return false;

  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');

    if (!gl) return true; // no WebGL is bc is weak

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
      const lowerRenderer = renderer.toLowerCase();
      // SwiftShader / llvmpipe / Microsoft Basic
      if (
        lowerRenderer.includes('swiftshader') ||
        lowerRenderer.includes('llvmpipe') ||
        lowerRenderer.includes('software') ||
        lowerRenderer.includes('microsoft basic')
      ) {
        return true;
      }
    }

    // low core count is a reasonable low-end signal
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

function computeProfile() {
  if (typeof window === 'undefined') {
    return {
      isPhone: false,
      isTablet: false,
      isLaptop: true,
      useLiteEffects: false,
      reduceMotion: false,
      lowGPU: false,
    };
  }

  const width = window.innerWidth;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const { saveData, slowNetwork } = getConnectionFlags();
  const lowGPU = detectLowGPU();

  const isPhone = width <= 768;
  const isTablet = width > 768 && width <= 1100;
  const isLaptop = width > 1100;

  const useLiteEffects =
    reducedMotion ||
    saveData ||
    slowNetwork ||
    lowGPU ||
    (coarsePointer && width <= 1100);

  return {
    isPhone,
    isTablet,
    isLaptop,
    useLiteEffects,
    reduceMotion: reducedMotion,
    lowGPU,
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
