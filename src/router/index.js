import { createRouter, createWebHistory } from "vue-router";
import Index from "../pages/index/Index.vue";
import SignIn from "../pages/sign-in/SignIn.vue";
import NewOperation from "../pages/new-operation/NewOperation.vue";
import UserRecords from "../pages/user-records/UserRecords.vue";

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
    },
    {
      path: "/new-operation",
      name: "new-operation",
      component: NewOperation,
    },
    {
      path: "/user-records",
      name: "user-records",
      component: UserRecords,
    },
  ],
});

export default router;
