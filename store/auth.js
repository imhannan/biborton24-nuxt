import { defineStore } from "pinia";
import { useCookie, useNuxtApp } from "#app";

export const useAuthStore = defineStore("auth", {
  state: () => {
    return {
      isAuthenticated: false,
      user: null,
      token: null,
      error: false,
    };
  },
  getters: {
    getAuthenticated: (state) => state.isAuthenticated,
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    getError: (state) => state.error,
  },
  actions: {
    setAuthenticated(payload) {
      this.isAuthenticated = payload;
    },
    setUser(payload) {
      this.user = payload;
    },
    setToken(payload) {
      this.token = payload;
    },
    setError(payload) {
      this.error = payload;
    },
    async setCurrentUser() {
      const token = useCookie("token");
      const { $axios } = useNuxtApp();
      if (this.token) {
        try {
          const { data: user } = await $axios.get("/api/user", {
            headers: {
              Accept: "application/json",
            },
          });
          this.setUser(user.data);
        } catch (err) {
          if (err.response.status === 401) {
            this.setAuthenticated(false);
            this.setToken(null);
            this.setUser(null);
            this.setError(true);
            token.value = null;
          } else {
            console.log(err.response.status);
            console.log(err.response.data);
          }
        }
      }
    },
    async login(form) {
      let response = null;
      const { $axios } = useNuxtApp();
      const token = useCookie("token");
      try {
        const res = await $axios.post("/login", form, {
          headers: {
            Accept: "application/json",
          },
        });
        this.setAuthenticated(true);
        this.setToken(res.data.token);
        this.setUser(res.data.user);
        token.value = res.data.token;
        response = true;
      } catch (error) {
        console.error(error.response.data);
        response = false;
      }

      return response;
    },
    async register(form) {
      let response = null;
      const { $axios } = useNuxtApp();
      const token = useCookie("token");
      try {
        const res = await $axios.post(
          "/register",
          form,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
        this.setAuthenticated(true);
        this.setToken(res.data.token);
        this.setUser(res.data.user);
        token.value = res.data.token;
        response = true;
      } catch (error) {
        console.error(error.response.data);
        response = false;
      }

      return response;
    },
    async logout() {
      let response = null;
      const token = useCookie("token");
      const { $axios } = useNuxtApp();
      try {
        await $axios.post(
          "/logout",
          {},
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
        this.setAuthenticated(false);
        this.setToken(null);
        this.setUser(null);
        this.setError(false);
        token.value = null;
        response = true;
      } catch (err) {
        console.log(err);
        response = false;
      }
      return response;
    },
  },
});
