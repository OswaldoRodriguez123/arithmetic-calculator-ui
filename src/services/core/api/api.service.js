import axios from "axios";
import config from "~/config";
import { performLogout } from "../../auth/logout";

const versionApi = 'v1';

/**
 * Axios response error handler. On 401 the session is dead: clear it and
 * force a full-page reload — EXCEPT the session-flow endpoints
 * (/auth/login, /auth/me, /auth/logout), where a 401 is an expected,
 * locally-handled outcome: the login form shows the error inline, and the
 * router guard redirects to sign-in. Reloading there would wipe the
 * message and loop forever (probe).
 * The error is always re-thrown so callers never resolve `undefined`.
 */
export function handleApiError(error) {
  const url = String(error?.config?.url ?? '');
  // Any endpoint under /auth/ is part of the session flow: a 401 there is
  // expected and handled by the view/guard, never a "dead session reload".
  const isSessionFlow = url.includes('/auth/');

  if (error?.response?.status === 401) {
    performLogout();
    if (!isSessionFlow) {
      try {
        // Full reload of the current URL: drops in-memory state that assumes
        // a session. The router guard probes /auth/me on boot and redirects
        // to sign-in, so this works regardless of the deploy base path.
        window.location.reload();
      } catch {
        // Non-browser environment (tests, SSR): nothing to reload.
      }
    }
  }
  return Promise.reject(error);
}

let responseInterceptorId = null;

/**
 * Service to call HTTP request via Axios
 */
class ApiService {
  constructor() {
    this.init();
  }

  init() {
    axios.defaults.baseURL = `${config.VITE_API_URL}api/${versionApi}`;

    // The session JWT travels as an httpOnly cookie set by the API at login.
    // JavaScript never sees the token; requests just carry the cookie.
    axios.defaults.withCredentials = true;

    // Register the response interceptor only once per page load, no matter
    // how many services are constructed.
    if (responseInterceptorId === null) {
      responseInterceptorId = axios.interceptors.response.use(
        (response) => response,
        handleApiError,
      );
    }
  }

  query(resource, params) {
    return axios.get(resource, params).catch((error) => {
      throw new Error(`[KT] ApiService ${error}`);
    });
  }

  /**
   * Send the GET HTTP request
   * @param resource
   * @param slug
   * @returns {*}
   */
  get(resource, slug = "") {
    return axios.get(`${resource}/${slug}`).catch((error) => {
      throw new Error(`[KT] ApiService ${error}`);
    });
  }

  /**
   * Set the POST HTTP request
   * @param resource
   * @param params
   * @returns {*}
   */
  post(resource, params) {
    return axios.post(axios.defaults.baseURL + resource, params);
  }

  /**
   * Send the UPDATE HTTP request
   * @param resource
   * @param slug
   * @param params
   * @returns {IDBRequest<IDBValidKey> | Promise<void>}
   */
  update(resource, slug, params) {
    return axios.put(`${resource}/${slug}`, params);
  }

  /**
   * Send the PUT HTTP request
   * @param resource
   * @param params
   * @returns {IDBRequest<IDBValidKey> | Promise<void>}
   */
  put(resource, params) {
    return axios.put(axios.defaults.baseURL + resource, params);
  }

  /**
   * Send the DELETE HTTP request
   * @param resource
   * @returns {*}
   */
  delete(resource, slug = "") {
    return axios.delete(`${resource}/${slug}`).catch((error) => {
      throw new Error(`[RWV] ApiService ${error}`);
    });
  }
}

export default ApiService;
