import ApiService from "../core/api";
import { performLogout } from "./logout";

export class AuthService {
  constructor() {
    this.apiService = new ApiService();
    this.route = '/auth';
  }

  async login(data) {
    const response = await this.apiService.post(`${this.route}/login`, data);
    return response?.data;
  }

  async logout() {
    performLogout();
  }
}

export default AuthService;
