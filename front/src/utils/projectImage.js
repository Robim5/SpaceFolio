const PLACEHOLDER_IMAGES = [
  '/assets/placeholders/bug.png',
  '/assets/placeholders/dark.png',
  '/assets/placeholders/dragon.png',
  '/assets/placeholders/eletric.png',
  '/assets/placeholders/fairy.png',
  '/assets/placeholders/fight.png',
  '/assets/placeholders/fire.png',
  '/assets/placeholders/fly.png',
  '/assets/placeholders/ghost.png',
  '/assets/placeholders/grass.png',
  '/assets/placeholders/ground.png',
  '/assets/placeholders/ice.png',
  '/assets/placeholders/normal.png',
  '/assets/placeholders/poison.png',
  '/assets/placeholders/psychic.png',
  '/assets/placeholders/rock.png',
  '/assets/placeholders/steel.png',
  '/assets/placeholders/water.png',
];

const FALLBACK_IMAGE = '/assets/projects/placeholder.png';

function hashSeed(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export default function getProjectImage(project) {
  const image = project?.image;
  if (typeof image === 'string' && image.trim().length > 0) {
    return image;
  }

  const pool = PLACEHOLDER_IMAGES.length ? PLACEHOLDER_IMAGES : [FALLBACK_IMAGE];
  const seed = `${project?.id ?? ''}-${project?.title ?? ''}-${project?.category ?? ''}`;
  return pool[hashSeed(seed) % pool.length];
}
