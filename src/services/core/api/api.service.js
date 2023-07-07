import axios from "axios";
import localStorageService from "../local-storage";
import config from "~/config";
import AuthService from "../../auth";

const versionApi = 'v1';

/**
 * Service to call HTTP request via Axios
 */

class ApiService {
  constructor() {
    this.init();
  }

  init() {
    axios.defaults.baseURL = `${config.VITE_API_URL}api/${versionApi}`;

    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${localStorageService.getToken()}`;

    // Add a response interceptor
    axios.interceptors.response.use((response) => {
      return response;
    }, (error) => {
      const authService = new AuthService();
      if(error?.response?.status === 401) {
        authService.logout();
      } else{
        return Promise.reject(error);
      }
    });
  }

  query(resource, params) {
    return axios.get(resource, params).catch((error) => {
      // console.log(error);
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
      // console.log(error);
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
      // console.log(error);
      throw new Error(`[RWV] ApiService ${error}`);
    });
  }
}

export default ApiService;
