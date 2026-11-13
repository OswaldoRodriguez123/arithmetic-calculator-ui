import ApiService from "../core/api";
import { performLogout } from "./logout";

export class AuthService {
  constructor() {
    this.apiService = new ApiService();
    this.route = '/auth';
  }

  /**
   * Log in with username/password. On success the API sets the httpOnly
   * session cookie; the response body is { status, data: <public profile> }.
   * The JWT itself never reaches JavaScript.
   */
  async login(data) {
    const response = await this.apiService.post(`${this.route}/login`, data);
    return response?.data;
  }

  /**
   * Session probe: returns the caller's public profile when the httpOnly
   * cookie (or a Bearer token) is valid; throws otherwise.
   */
  async me() {
    const response = await this.apiService.get(this.route, 'me');
    return response?.data?.data;
  }

  /**
   * Tell the API to clear the session cookie (best effort: local cleanup
   * still happens when the API is unreachable) and clear local state.
   */
  async logout() {
    try {
      await this.apiService.post(`${this.route}/logout`);
    } catch {
      // Best effort: the cookie is httpOnly and expires with JWT_EXPIRATION_SECONDS anyway.
    }
    performLogout();
  }
}

export default AuthService;
