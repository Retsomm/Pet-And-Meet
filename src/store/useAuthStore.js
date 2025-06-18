import { create } from "zustand";

const useAuthStore = create((set) => ({
  isLoggedIn: !!localStorage.getItem("user"),
  user: JSON.parse(localStorage.getItem("user")) || null,
  login: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ isLoggedIn: true, user });
  },
  logout: () => {
    localStorage.removeItem("user");
    set({ isLoggedIn: false, user: null });
  },
}));

export default useAuthStore;