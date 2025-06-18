import { create } from "zustand";

const useThemeStore = create((set) => ({
  currentTheme: "sunset",
  toggleTheme: () =>
    set((state) => ({
      currentTheme: state.currentTheme === "sunset" ? "winter" : "sunset",
    })),
}));

export default useThemeStore;