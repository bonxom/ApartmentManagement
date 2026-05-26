import { create } from "zustand";

const getInitialMode = () => {
  const saved = localStorage.getItem("themeMode");
  return saved === "dark" ? "dark" : "light";
};

const useThemeStore = create((set) => ({
  mode: getInitialMode(),
  toggleMode: () =>
    set((state) => {
      const next = state.mode === "light" ? "dark" : "light";
      localStorage.setItem("themeMode", next);
      return { mode: next };
    }),
  setMode: (mode) => {
    const value = mode === "dark" ? "dark" : "light";
    localStorage.setItem("themeMode", value);
    set({ mode: value });
  },
}));

export default useThemeStore;