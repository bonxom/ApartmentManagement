import { create } from "zustand";
// import * as jose from 'jose' // <--- KHÔNG CẦN NỮA
import { authAPI, userAPI } from "../api/apiService"; // Giả sử file này gọi axiosInstance

// Helper để lấy user/token từ localStorage một cách an toàn
const getInitialToken = () => localStorage.getItem("token") || null;
const getInitialUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch (e) {
    return null;
  }
};

const useAuthStore = create((set, get) => ({
  token: getInitialToken(),
  user: getInitialUser(),
  isLoading: false,
  error: null,
  isLoggedIn: !!getInitialToken(), // Thêm state này

  // ===== SỬA HÀM ĐĂNG NHẬP =====
  signIn: async (credentials) => {
    // credentials từ form là { email, password }
    set({ isLoading: true, error: null });
    try {
      // 1. Gọi API (giả sử authAPI.signIn gọi POST /auth/login)
      // Backend trả về { token, user }
      const data = await authAPI.signIn(credentials);

      // 2. Chúng ta lấy 'user' trực tiếp từ response, KHÔNG CẦN DECODE TOKEN
      const { user, token } = data;

      // 3. Lưu vào localStorage và state
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      set({ token, user, isLoading: false, isLoggedIn: true, error: null });
      return { success: true, user, token }; // Trả về user và token
    } catch (error) {
      const message = error.customMessage || "Đăng nhập thất bại";
      set({ isLoading: false, error: message, isLoggedIn: false });
      return { success: false, error: message };
    }
  },

  // ===== SỬA HÀM ĐĂNG KÝ =====
  signUp: async (userData) => {
    // userData từ form SignUp
    set({ isLoading: true, error: null });
    try {
      const apiPayload = {
        name: userData.name,
        sex: userData.sex,
        userCardID: userData.userCardID,
        phoneNumber: userData.phoneNumber,
        email: userData.email,
        dob: userData.dob,
        birthLocation: userData.birthLocation,
        job: userData.job,
        ethnic: userData.ethnic,
        password: userData.password,
      };

      const data = await authAPI.signUp(apiPayload);
      set({ isLoading: false });
      return { success: true, data };
    } catch (error) {
      const message = error.customMessage || "Đăng ký thất bại";
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },

  // ===== SỬA HÀM CHECK AUTH (Đơn giản hóa) =====
  checkAuth: async () => {
    const token = get().token;
    if (!token) {
      set({ isLoggedIn: false });
      return false;
    }

    try {
      // authAPI.verifyToken() nên gọi 'GET /auth/me' của chúng ta
      // Endpoint này sẽ tự kiểm tra token và trả về user mới nhất
      const user = await authAPI.verifyToken();

      // Cập nhật lại user phòng khi có thay đổi
      localStorage.setItem("user", JSON.stringify(user));
      set({ user, isLoggedIn: true });
      return true;
    } catch (error) {
      console.error("Auth check failed:", error);
      get().signOut(); // Token hỏng hoặc hết hạn -> Đăng xuất
      return false;
    }
  },

  // Đăng xuất (Thêm isLoggedIn: false)
  signOut: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ token: null, user: null, isLoggedIn: false }); // Thêm isLoggedIn
  },

  // Load user (Giữ nguyên, nhưng nên được gọi ở file index/main)
  loadUserFromStorage: () => {
    const user = getInitialUser();
    const token = getInitialToken();
    if (user && token) {
      set({ user, token, isLoggedIn: true });
    }
  },

  // ===== SỬA CÁC HÀM PERMISSION =====
  // (Giả định backend đã được sửa ở Bước 1)
  _getPermissionNames: () => {
    const user = get().user;
    if (!user || !user.role || !user.role.permissions) {
      return [];
    }
    // user.role.permissions bây giờ là [ {permission_name: '...'}, ... ]
    return user.role.permissions.map((p) => p.permission_name.toUpperCase());
  },

  hasPermission: (permission) => {
    const userPermissions = get()._getPermissionNames();
    return userPermissions.includes(permission.toUpperCase());
  },

  hasAnyPermission: (permissions) => {
    const userPermissions = get()._getPermissionNames();
    return permissions.some((p) => userPermissions.includes(p.toUpperCase()));
  },

  hasAllPermissions: (permissions) => {
    const userPermissions = get()._getPermissionNames();
    return permissions.every((p) => userPermissions.includes(p.toUpperCase()));
  },

  // ===== SỬA HÀM CẬP NHẬT PROFILE =====
  updateProfile: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const userId = get().user._id;
      if (!userId) throw new Error("Không tìm thấy ID người dùng");

      const apiPayload = {
        name: userData.name,
        phoneNumber: userData.phoneNumber,
      };

      const data = await userAPI.update(userId, apiPayload);

      const updatedUser = { ...get().user, ...data };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      set({ user: updatedUser, isLoading: false });

      return { success: true, data };
    } catch (error) {
      const message = error.message || "Cập nhật thất bại";
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },
}));

// Gọi hàm này 1 lần khi app khởi động (trong main.jsx hoặc App.jsx)
useAuthStore.getState().loadUserFromStorage();

export default useAuthStore;
