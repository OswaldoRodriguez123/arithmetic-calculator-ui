import axios from "axios";
import { useAppStore } from "@/stores";
import { saveUserDataStorage } from "../core/local-storage/local-storage.service";

/**
 * Shared logout cleanup: store, localStorage and axios defaults.
 * Lives in its own module so both AuthService.logout() and the axios 401
 * response interceptor can use it without a circular dependency.
 */
export function performLogout() {
  try {
    const store = useAppStore();
    store.state = {
      user: null,
      isAuthenticated: false,
    };
  } catch {
    // No active Pinia (e.g. outside a Vue context): storage cleanup still applies.
  }

  saveUserDataStorage(null);
  delete axios.defaults.headers.common["Authorization"];
}
