import { createRouter, createWebHistory } from "vue-router";
import Index from "../pages/index/Index.vue";
import SignIn from "../pages/sign-in/SignIn.vue";
import NewOperation from "../pages/new-operation/NewOperation.vue";
import UserRecords from "../pages/user-records/UserRecords.vue";
import { getUserDataStorage } from "@/services/core/local-storage/local-storage.service";

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

// UX-level guard: enforcement lives in the API (401 -> logout + reload).
// This only spares unauthenticated users a blank guarded page.
router.beforeEach((to) => {
  if (!to.meta?.requiresAuth) {
    return true;
  }
  if (getUserDataStorage()) {
    return true;
  }
  return { name: "sign-in" };
});

export default router;
