import { create } from "zustand";

const getInitialEnabled = () => {
  const saved = localStorage.getItem("notificationsEnabled");
  if (saved === "false") return false; // lưu "false" thì tắt
  return true; // mặc định bật
};

const useNotificationStore = create((set) => ({
  enabled: getInitialEnabled(),
  toggleEnabled: () =>
    set((state) => {
      const next = !state.enabled;
      localStorage.setItem("notificationsEnabled", String(next));
      return { enabled: next };
    }),
  setEnabled: (value) => {
    const next = Boolean(value);
    localStorage.setItem("notificationsEnabled", String(next));
    set({ enabled: next });
  },
}));

export default useNotificationStore;