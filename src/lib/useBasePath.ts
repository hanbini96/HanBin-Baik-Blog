/**
 * Gets the BASE_URL for the application (handles GitHub Pages base path)
 * This replicates what BaseLink.astro does in React components
 */
export function getBasePath(path: string): string {
  const baseUrl = import.meta.env.BASE_URL || '/';
  // Remove trailing slash from baseUrl and ensure path starts with /
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}
