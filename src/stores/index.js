import { defineStore } from "pinia";
import bootstrap from "bootstrap/dist/js/bootstrap.min.js";

const state = {
  isAuthenticated: false,
  user: null,
}

export const useAppStore = defineStore("storeId", {
  state: () => ({
    bootstrap,
    state
  }),
});
