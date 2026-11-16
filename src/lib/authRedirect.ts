/**
 * URL Supabase should send the user back to after a magic-link sign-in:
 * the page they signed in from (e.g. https://hanbinbaik.dev/editor/), without
 * query or hash. Without this, Supabase falls back to the project's Site URL
 * (the domain root), so /editor and /inbox logins landed on the homepage.
 *
 * The URL must match an entry in Supabase → Authentication → URL Configuration
 * → Redirect URLs (e.g. https://hanbinbaik.dev/**), or Supabase ignores it.
 */
export function authRedirectUrl(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  return `${window.location.origin}${window.location.pathname}`;
}
