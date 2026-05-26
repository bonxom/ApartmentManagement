import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000/api";

// Tạo một instance (thể hiện) của axios
const axiosInstance = axios.create({
  baseURL: SERVER_URL, // URL backend THẬT của bạn
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Tự động thêm token vào MỌI request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Tự động xử lý lỗi 401 (Token hết hạn/Không hợp lệ)
// Đây là một tính năng nâng cao nhưng rất hữu ích
axiosInstance.interceptors.response.use(
  (response) => response, // Trả về response nếu OK
  (error) => {
    if (error.response && error.response.status === 401) {
      // Nếu là lỗi 401 (chưa xác thực)
      // Xóa token cũ và reload trang (đá về trang login)
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // (Không nên dùng window.location.reload() ở đây nếu authStore có thể xử lý)
      // Tạm thời, chúng ta chỉ ném lỗi để authStore bắt
      console.error("Lỗi 401 - Token không hợp lệ hoặc hết hạn.");
    }

    // Ném toàn bộ error object để giữ nguyên error.response
    return Promise.reject(error);
  }
);

export default axiosInstance;
