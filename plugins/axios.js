import { defineNuxtPlugin, useRuntimeConfig } from "#app";
import axios from "axios";
import { useAuthStore } from "~~/store/auth";

export default defineNuxtPlugin(() => {
  const auth = useAuthStore();
  const config = useRuntimeConfig();
  const instance = axios.create({
    baseURL: config.baseURL,
  });

  if (auth.token) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`;
  }
  return {
    provide: {
      axios: instance,
    },
  };
});
