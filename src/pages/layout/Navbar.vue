<template>
  <nav
    class="navbar navbar-expand-lg top-0 navbar-dark bg-gradient-dark z-index-3 py-3"
  >
    <div
      class="container"
    >
      <RouterLink
        class="navbar-brand text-white font-weight-bolder ms-sm-3"
        :to="{ name: 'index' }"
        rel="tooltip"
        title="Designed and Coded by Creative Tim"
        data-placement="bottom"
      >
        Arithmetic Calculator
      </RouterLink>
      <button
        class="navbar-toggler shadow-none ms-2"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navigation"
        aria-controls="navigation"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon mt-2">
          <span class="navbar-toggler-bar bar1"></span>
          <span class="navbar-toggler-bar bar2"></span>
          <span class="navbar-toggler-bar bar3"></span>
        </span>
      </button>
      <div
        class="collapse navbar-collapse w-100 pt-3 pb-2 py-lg-0"
        id="navigation"
      >
        <ul class="navbar-nav navbar-nav-hover ms-auto">
          <li class="nav-item mx-2">
            <RouterLink
              :to="{ name: 'new-operation' }"
              class="nav-link ps-2 d-flex cursor-pointer align-items-center"
              :class="getTextColor()"
            >
              <i
                class="material-icons opacity-6 me-2 text-md"
                :class="getTextColor()"
                >article</i
              >
              New Operation
            </RouterLink>
          </li>
          <li class="nav-item mx-2">
            <RouterLink
              :to="{ name: 'user-records' }"
              class="nav-link ps-2 d-flex cursor-pointer align-items-center"
              :class="getTextColor()"
            >
              <i
                class="material-icons opacity-6 me-2 text-md"
                :class="getTextColor()"
                >dashboard</i
              >
              User Records
            </RouterLink>
          </li>
          <li class="nav-item dropdown dropdown-hover mx-2">
            <a
              role="button"
              class="nav-link ps-2 d-flex cursor-pointer align-items-center"
              :class="getTextColor()"
              id="dropdownMenuDocs"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Welcome {{ user?.name }}
              <img
                :src="getArrowColor()"
                alt="down-arrow"
                class="arrow ms-2 d-lg-block d-none"
              />
              <img
                :src="getArrowColor()"
                alt="down-arrow"
                class="arrow ms-1 d-lg-none d-block ms-auto"
              />
            </a>
            <div
              class="dropdown-menu dropdown-menu-end dropdown-menu-animation dropdown-md mt-0 mt-lg-3 p-3 border-radius-lg  overflow-hidden"
              aria-labelledby="dropdownMenuDocs"
            >
              <div class="d-none d-lg-block">
                <ul class="list-group">
                  <li class="nav-item list-group-item border-0 p-0">
                    <a
                      class="dropdown-item py-2 ps-3 border-radius-md"
                      @click="logout()"
                    >
                      <h6
                        class="dropdown-header font-weight-bolder d-flex justify-content-cente align-items-center p-0"
                      >
                        Logout
                      </h6>
                    </a>
                  </li>
                </ul>
              </div>
              <div class="row d-lg-none">
                <div class="col-md-12 g-0">
                  <a
                    class="dropdown-item py-2 ps-3 border-radius-md"
                    @click="logout()"
                  >
                    <h6
                      class="dropdown-header font-weight-bolder d-flex align-items-center p-0 text-white"
                    >
                      Logout
                    </h6>
                  </a>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <!-- End Navbar -->
</template>

<script>
import { RouterLink } from "vue-router";
import DownArrWhite from "@/assets/img/down-arrow-white.svg";
import AuthService from "@/services/auth";

//stores
import { useAppStore } from "@/stores";

export default {
  data() {
    return {
      store: useAppStore(),
      user: null,
    }
  },
  mounted() {
    this.user = this.store.state.user;
  },
  methods: {
    getArrowColor() {
      return DownArrWhite;
    },
    getTextColor(){
      return 'text-white'
    },
    async logout() {
      const service = new AuthService();
      await service.logout();
      this.$router.push({ name: "sign-in" });
    }
  }
}

</script>