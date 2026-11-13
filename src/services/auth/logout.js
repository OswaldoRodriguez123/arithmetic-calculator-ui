import { useAppStore } from "@/stores";
import { saveUserDataStorage } from "../core/local-storage/local-storage.service";

/**
 * Shared session cleanup: store and the (non-sensitive) display profile in
 * localStorage. The httpOnly cookie is cleared by the API (logout endpoint);
 * this is the client-side half, used by manual logout and by the axios 401
 * response interceptor. Lives in its own module so the interceptor never
 * imports AuthService (breaks the api.service <-> auth.service cycle).
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
}
