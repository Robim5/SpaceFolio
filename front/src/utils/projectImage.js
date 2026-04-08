const PLACEHOLDER_IMAGE = '/assets/placeholder.gif';

export default function getProjectImage(project) {
  const image = project?.image;
  if (typeof image === 'string' && image.trim().length > 0) {
    return image;
  }
  return PLACEHOLDER_IMAGE;
}
