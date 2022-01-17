import { defineStore } from "pinia";
export const useStore = defineStore("main", {
  state: () => {
    return {
      posts: [],
      categories: [],
    };
  },
  getters: {
    getPosts: (state) => {
      return state.posts;
    },
    getCategories: (state) => {
      return state.categories;
    }
  },
  actions: {
    setPosts(payload) {
      this.posts = payload;
    },
    setCategories(payload) {
      this.categories = payload;
    },
  },
});
