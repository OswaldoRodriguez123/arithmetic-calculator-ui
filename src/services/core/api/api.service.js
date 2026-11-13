import axios from "axios";
import localStorageService from "../local-storage";
import config from "~/config";
import { performLogout } from "../../auth/logout";

const versionApi = 'v1';

/**
 * Axios response error handler. On 401 the session is dead: clear it and
 * force a full-page reload to sign-in (the JWT cannot be renewed from here).
 * The error is always re-thrown so callers never resolve `undefined`.
 */
export function handleApiError(error) {
  if (error?.response?.status === 401) {
    performLogout();
    try {
      // Full reload: drops any in-memory state that still assumes a session.
      window.location.assign('/sign-in');
    } catch {
      // Non-browser environment (tests, SSR): nothing to reload.
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

    const token = localStorageService.getToken();
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }

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
