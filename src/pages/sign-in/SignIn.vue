<template>
  <div class="page-header align-items-start min-vh-100" :style="{
    backgroundImage:
      'url(https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80)'
  }" loading="lazy">
    <span class="mask bg-gradient-dark opacity-6"></span>
    <div class="container my-auto">
      <div class="row">
        <div class="col-lg-4 col-md-8 col-12 mx-auto">
          <div class="card z-index-0 fadeIn3 fadeInBottom">
            <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div class="bg-gradient-success shadow-success border-radius-lg py-3 pe-1">
                <h4 class="text-white font-weight-bolder text-center my-2">
                  Sign in
                </h4>
              </div>
            </div>
            <div class="card-body">
              <form role="form" class="text-start" autocomplete="off" @submit="login">
                <MaterialInput ref="username" @change="(e) => username = e.target.value" id="username" class="input-group-outline my-3" :label="{ text: 'Email', class: 'form-label' }"
                  type="text" />
                <MaterialInput ref="password" @change="(e) => password = e.target.value" id="password" class="input-group-outline mb-3"
                  :label="{ text: 'Password', class: 'form-label' }" type="password" />

                <div class="text-center">
                  <MaterialButton class="my-4 mb-2" variant="gradient" color="success" fullWidth :disabled="isLoading">Sign in
                  </MaterialButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <MaterialToast ref="toast">
    {{errorMessage}}
  </MaterialToast>
</template>

<script>

//Vue Material Kit 2 components
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialButton from "@/components/MaterialButton.vue";
import MaterialToast from "@/components/MaterialToast.vue";

// material-input
import setMaterialInput from "@/assets/js/material-input";

//services
import AuthService from "@/services/auth"

//utils
import { validateEmail } from "@/utils/validate"

//stores
import { useAppStore } from "@/stores";
import { saveUserDataStorage } from "../../services/core/local-storage/local-storage.service";

export default {
  components: {
    MaterialInput,
    MaterialButton,
    MaterialToast
  },
  data() {
    return {
      service: new AuthService(),
      username: "",
      password: "",
      isLoading: false,
      errorMessage: "",
    }
  },
  mounted() {
    setMaterialInput();
  },
  methods: {
    async validateForm() {
      this.showError = false;
      this.errorMessage = "";

      if (!this.username.trim()) {
        this.showError = true;
        this.errorMessage = "Email is required";
        return;
      }

      if(!validateEmail(this.username)) {
        this.showError = true;
        this.errorMessage = "Email is not valid";
        return;
      }

      if (!this.password.trim()) {
        this.showError = true;
        this.errorMessage = "Password is required";
        return;
      }
    },
    async login(e) {
      e.preventDefault();
      await this.validateForm();
      if (this.showError) {
        this.$refs["toast"].displayToast()
        return;
      }
      this.isLoading = true;
      try {
        const data = {
          username: this.username,
          password: this.password,
        }
        const response = await this.service.login(data);
        if (response?.status === 200 && response?.data) {
          const store = useAppStore();
          store.state = {
            user: response.data,
            isAuthenticated: true,
          }

          saveUserDataStorage(response.data);

          this.$router.push({ name: "index" });
        } else {
          this.errorMessage = 'Username or password is incorrect';
          this.$refs["toast"].displayToast()
        }
      } catch (e) {
        console.error(e.message);
        this.errorMessage = 'Something went wrong, please try again';
        this.$refs["toast"].displayToast()
      } finally {
        this.isLoading = false;
      }
    }
  }
}

</script>