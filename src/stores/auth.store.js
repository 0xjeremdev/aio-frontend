import { defineStore } from "pinia";
import axios from "axios";

import { router } from "@/router";
import { useAlertStore } from "@/stores";

const baseUrl = `http://${import.meta.env.VITE_URL}/auth`;

console.log(baseUrl);

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    // initialize state from local storage to enable user to stay logged in
    user: JSON.parse(localStorage.getItem("user")),
    returnUrl: null,
  }),
  actions: {
    async login(username, password) {
      try {
        const res = await axios.post(`${baseUrl}/login`, {
          username,
          password,
        });
        const user = { ...res.data.user, token: res.data.token };
        // update pinia state
        this.user = user;
        // store user details and jwt in local storage to keep user logged in between page refreshes
        localStorage.setItem("user", JSON.stringify(user));
        // redirect to previous url or default to home page
        router.push(this.returnUrl || "/");
      } catch (err) {
        const alertStore = useAlertStore();
        alertStore.error(err.response.data.errors);
      }
    },
    async register(username, password) {
      const alertStore = useAlertStore();
      try {
        await axios.post(`${baseUrl}/register`, {
          username,
          password,
        });

        await router.push("/account/login");
        alertStore.success("Registration successful");
      } catch (err) {
        console.log(err);
        alertStore.error(err.response.data.errors);
      }
    },
    logout() {
      this.user = null;
      localStorage.removeItem("user");
      router.push("/account/login");
    },
  },
});
