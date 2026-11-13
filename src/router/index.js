import { createRouter, createWebHistory } from "vue-router";
import Index from "../pages/index/Index.vue";
import SignIn from "../pages/sign-in/SignIn.vue";
import NewOperation from "../pages/new-operation/NewOperation.vue";
import UserRecords from "../pages/user-records/UserRecords.vue";
import { saveUserDataStorage } from "@/services/core/local-storage/local-storage.service";
import { performLogout } from "@/services/auth/logout";
import { useAppStore } from "@/stores";
import AuthService from "@/services/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/sign-in",
      name: "sign-in",
      component: SignIn,
    },
    {
      path: "/",
      name: "index",
      component: Index,
      meta: { requiresAuth: true },
    },
    {
      path: "/new-operation",
      name: "new-operation",
      component: NewOperation,
      meta: { requiresAuth: true },
    },
    {
      path: "/user-records",
      name: "user-records",
      component: UserRecords,
      meta: { requiresAuth: true },
    },
  ],
});

let sessionService = null;

// UX-level guard: enforcement lives in the API (401 -> logout + reload).
// The session itself is the httpOnly cookie; JavaScript cannot read it, so the
// only way to know is to ask the API. Validates once per page load
// (store.isAuthenticated is set by a successful probe or by login).
async function checkSession() {
  const store = useAppStore();
  if (store.state.isAuthenticated) {
    return true;
  }
  try {
    sessionService ??= new AuthService();
    const profile = await sessionService.me();
    if (!profile) return false;
    saveUserDataStorage(profile);
    store.state = { user: profile, isAuthenticated: true };
    return true;
  } catch {
    performLogout();
    return false;
  }
}

router.beforeEach(async (to) => {
  if (!to.meta?.requiresAuth) {
    return true;
  }
  return (await checkSession()) ? true : { name: "sign-in" };
});

export default router;
