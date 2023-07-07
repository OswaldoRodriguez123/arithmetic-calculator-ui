import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from "url";

export default {
  plugins: [vue()],
  test: {
    include: ['**/*.(spec|test).(js|ts)'],
    globals: true,
    environment: 'happy-dom',
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "~": fileURLToPath(new URL("./", import.meta.url)),
    }
  }
}