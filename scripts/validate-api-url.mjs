/**
 * Build-time guard for VITE_API_URL (critic GAP-1).
 *
 * The SPA bakes the API base URL into the bundle at build time. Without a
 * check, an http URL to a remote host would put every credentialed request
 * (the session cookie) on the wire unencrypted. This fails the build unless the
 * URL is https:, or an explicit local loopback host (http is accepted for
 * local development only).
 */

const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);
export const LOCAL_API_URL = 'http://localhost:3001/';

export function validateApiUrl(raw, command, warn = (msg) => console.warn(msg)) {
  const value = typeof raw === 'string' ? raw.trim() : '';

  if (!value) {
    if (command === 'build') {
      throw new Error(
        'VITE_API_URL is not set. Refusing to build without an explicit API origin: ' +
        'set VITE_API_URL to an https:// URL (or http://localhost:3001/ for local builds).'
      );
    }
    warn(`[validate-api-url] VITE_API_URL is not set; using ${LOCAL_API_URL} (dev only).`);
    return LOCAL_API_URL;
  }

  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`VITE_API_URL "${value}" is not a parseable URL.`);
  }

  if (url.username || url.password) {
    throw new Error('VITE_API_URL must not embed credentials (user:password@).');
  }

  if (url.search || url.hash) {
    throw new Error('VITE_API_URL must not contain a query string or fragment.');
  }

  if (url.protocol === 'https:') {
    // ok
  } else if (url.protocol === 'http:' && LOCAL_HOSTNAMES.has(url.hostname)) {
    // local development only
  } else {
    throw new Error(
      `VITE_API_URL "${value}" must use https: (http is allowed only for loopback hosts).`
    );
  }

  // Normalize: the app appends "api/v1" to this base URL, so keep a trailing slash.
  if (!url.pathname.endsWith('/')) {
    url.pathname = `${url.pathname}/`;
  }

  return url.toString();
}
