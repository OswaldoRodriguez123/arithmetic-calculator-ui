import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

// Nucleo Icons
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";

// Self-hosted fonts and icons (no third-party CDN at runtime)
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/roboto/900.css";
import "@fontsource/roboto-slab/400.css";
import "@fontsource/roboto-slab/700.css";
import "./assets/css/material-icons-round.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import materialKit from "./material-kit";

import PrimeVue from 'primevue/config';

import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(materialKit);
app.use(PrimeVue)
app.mount("#app");
