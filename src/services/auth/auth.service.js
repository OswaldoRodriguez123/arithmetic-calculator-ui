import ApiService from "../core/api";
import { useAppStore } from "@/stores";
import { saveUserDataStorage } from "../core/local-storage/local-storage.service";

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
    const store = useAppStore();

    store.state = {
      user: null,
      isAuthenticated: false,
    }

    saveUserDataStorage(null);
  }
}

export default AuthService;