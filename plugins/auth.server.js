import { defineNuxtPlugin, useCookie } from "#app";
import { useAuthStore } from "~~/store/auth";

export default defineNuxtPlugin((nuxtApp) => {
  const auth = useAuthStore();
  const token = useCookie("token");

  if (token.value) {
    auth.setAuthenticated(true);
    auth.setToken(token.value);
    // auth.setCurrentUser();
  }
});
