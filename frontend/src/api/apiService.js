import api from "./axiosInstance"; // Import file thật

export const authAPI = {
  // Đăng nhập
  signIn: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  // Đăng ký
  signUp: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  // Verify token
  verifyToken: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  // Đăng xuất
  signOut: async () => {
    // Backend của ta không có API này, ta chỉ cần xóa token ở client
    return Promise.resolve(); // Chỉ cần trả về thành công
  },
  // Refresh token (nếu backend hỗ trợ)
  refreshToken: async (refreshToken) => {
    return Promise.reject("Chưa hỗ trợ");
  },
};

// ============= USER API =============
export const userAPI = {
  // Lấy tất cả users
  getAll: async (params = {}) => {
    const response = await api.get("/users", { params });
    return response.data;
  },

  // Lấy user theo ID
  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Tạo user mới
  create: async (userData) => {
    const response = await api.post("/users", userData);
    return response.data;
  },

  // Cập nhật user
  update: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Xóa user
  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  // Lấy profile (API này không tồn tại, ta dùng /auth/me)
  getProfile: async () => {
    const response = await api.get("/auth/me"); // Sửa
    return response.data;
  },

  // Đổi mật khẩu
  changePassword: async (userId, oldPassword, newPassword) => {
    const response = await api.patch(`/users/${userId}/password`, {
      oldPassword,
      newPassword,
    });
    return response.data;
  },
};

// ============= HOUSEHOLD API =============
export const householdAPI = {
  // CRUD
  getAll: async (params = {}) => {
    const response = await api.get("/households", { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/households/${id}`);
    return response.data;
  },

  create: async (householdData) => {
    const response = await api.post("/households", householdData);
    return response.data;
  },

  update: async (id, householdData) => {
    const response = await api.put(`/households/${id}`, householdData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/households/${id}`);
    return response.data;
  },

  getMembers: async (id) => {
    const response = await api.get(`/households/${id}/members`);
    return response.data;
  },

  getMembersInfo: async (id) => {
    const response = await api.get(`/households/${id}/members-info`);
    return response.data;
  },

  getMemberById: async (householdId, userId) => {
    const response = await api.get(`/households/${householdId}/member/${userId}`);
    return response.data;
  },

  addMember: async (id, memberData) => {
    const response = await api.post(`/households/${id}/members`, memberData);
    return response.data;
  },

  removeMember: async (householdId, memberId) => {
    const response = await api.delete(
      `/households/${householdId}/members/${memberId}`
    );
    return response.data;
  },

  getResidentHistory: async (householdId) => {
    const response = await api.get(
      `/households/${householdId}/resident-history`
    );
    return response.data;
  },

  //
  splitHousehold: async (splitData) => {
    // splitData = { userId, newHouseHoldID, newAddress }
    const response = await api.post("/households/split", splitData);
    return response.data;
  },

  moveMember: async (moveData) => {
    // moveData = { userId, targetHouseholdId, relationship }
    const response = await api.post("/households/move", moveData);
    return response.data;
  },
  // Lấy chi tiết tạm trú/tạm vắng từ ResidentHistory 
  getTamTruVangDetails: async (householdId) => {
    const response = await api.get(`/households/${householdId}/changes`);
    return response.data;
  },

  addTemporaryResident: async (householdId, residentData) => {
    const response = await api.post(
      `/households/${householdId}/temporary-residents`,
      residentData
    );
    return response.data;
  },

  completeResidentHistory: async (householdId, data) => {
    const response = await api.put(
      `/households/${householdId}/resident-history/complete`,
      data
    );
    return response.data;
  },

  updateResidentHistory: async (householdId, historyData) => {
    const response = await api.put(
      `/households/${householdId}/resident-history`,
      historyData
    );
    return response.data;
  }
};

// ==============FEE API===============

export const feeAPI = {
  // Tạo fee
  createFee: async (data) => {
    const res = await api.post("/fees", data);
    return res.data;
  },

  // Lấy tất cả fee
  getAllFees: async () => {
    const res = await api.get("/fees");
    return res.data;
  },

  // Thống kê
  getFeeStatistics: async (feeId) => {
    const res = await api.get(`/fees/${feeId}/statistics`);
    return res.data;
  },

  // Cập nhật fee
  updateFee: async (feeId, data) => {
    const res = await api.put(`/fees/${feeId}`, data);
    return res.data;
  },

  // Xóa fee
  deleteFee: async (feeId) => {
    const res = await api.delete(`/fees/${feeId}`);
    return res.data;
  },

  // Leader lấy fee hộ gia đình
  getMyHouseholdFees: async () => {
    const res = await api.get("/fees/my-household");
    return res.data;
  },

  // Admin lấy fee của một hộ
  getHouseholdFeesByAdmin: async (householdId) => {
    const res = await api.get(`/fees/household/${householdId}`);
    return res.data;
  },
};

// ============= REQUEST API =============
export const requestAPI = {
  // Cư dân gửi yêu cầu cập nhật thông tin
  updateInfo: async (newData) => {
    const response = await api.post("/requests/update-info", { newData });
    return response.data;
  },
  // Cư dân gửi yêu cầu thanh toán khoản thu
  createPayment: async (payload) => {
    const response = await api.post("/requests/payment", payload);
    return response.data;
  },
  // Cư dân khai báo tạm trú
  createTemporaryResidence: async (payload) => {
    const response = await api.post("/requests/temporary-residence", payload);
    return response.data;
  },
  // Cư dân khai báo tạm vắng
  createTemporaryAbsence: async (payload) => {
    const response = await api.post("/requests/temporary-absence", payload);
    return response.data;
  },
  // Lấy danh sách yêu cầu
  getRequests: async (params = {}) => {
    const response = await api.get("/requests", { params });
    return response.data;
  },
  // Cư dân xem lịch sử yêu cầu nộp tiền của hộ mình
  getMyHouseholdPaymentRequests: async (params = {}) => {
    const response = await api.get("/requests/my-household/payments", { params });
    return response.data;
  },
  // Cư dân xem lịch sử yêu cầu của hộ mình
  getMyHouseholdRequests: async (params = {}) => {
    const response = await api.get("/requests/my-household", { params });
    return response.data;
  },
  // Tổ trưởng duyệt/từ chối yêu cầu
  reviewRequest: async (id, status, leaderComment = "") => {
    const response = await api.put(`/requests/${id}/review`, {
      status,
      leaderComment,
    });
    return response.data;
  },
  // Báo sinh
  createBirthReport: async (payload) => {
    const response = await api.post("/requests/birth", payload);
    return response.data;
  },
  // Báo tử
  createDeathReport: async (payload) => {
    const response = await api.post("/requests/death", payload);
    return response.data;
  },
};

// ============= STATS API =============
export const statsAPI = {
  // Lấy số liệu tổng quan cho Dashboard (Admin/Leader)
  getDashboard: async () => {
    const response = await api.get('/stats/dashboard');
    return response.data;
  },
  
  // Lấy thống kê Dashboard cho User (về hộ gia đình của họ)
  getUserDashboard: async () => {
    const response = await api.get('/stats/user-dashboard');
    return response.data;
  },

};

// ============= CHAT API =============
export const chatAPI = {
  // Lấy tin nhắn
  getMessages: async (params = {}) => {
    const response = await api.get('/chat/messages', { params });
    return response.data;
  },

  // Gửi tin nhắn
  sendMessage: async (messageData) => {
    const response = await api.post('/chat/messages', messageData);
    return response.data;
  },

  // Lấy danh sách người tham gia
  getParticipants: async () => {
    const response = await api.get('/chat/participants');
    return response.data;
  },

  // Cập nhật trạng thái online
  updateStatus: async () => {
    const response = await api.put('/chat/status');
    return response.data;
  },

  // Xóa tin nhắn
  deleteMessage: async (messageId) => {
    const response = await api.delete(`/chat/messages/${messageId}`);
    return response.data;
  },

  // Khởi tạo chat (admin only)
  initializeChat: async () => {
    const response = await api.post('/chat/initialize');
    return response.data;
  },

  // Đồng bộ tất cả users hiện có vào chat (admin only)
  syncAllUsers: async () => {
    const response = await api.post('/chat/sync-all');
    return response.data;
  },

  // Thêm admin hiện tại vào chat (admin only)
  addMeToChat: async () => {
    const response = await api.post('/chat/add-me');
    return response.data;
  },
};