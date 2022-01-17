import { defineNuxtConfig } from "nuxt3";

export default defineNuxtConfig({
  css: ["~/assets/css/tailwind.css"],
  build: {
    postcss: {
      postcssOptions: {
        plugins: {
          tailwindcss: {},
          autoprefixer: {},
        },
      },
    },
  },
  buildModules: [["@pinia/nuxt", { disableVuex: true }]],
  publicRuntimeConfig: {
    baseURL: process.env.BASE_URL || "http://localhost:8000",
    baseUrlApi: process.env.BASE_URL_API || "http://localhost:8000/api",
  },
});
