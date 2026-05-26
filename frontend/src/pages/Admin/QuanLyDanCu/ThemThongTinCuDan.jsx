import { Box, Typography, TextField, MenuItem, Button, Paper, Tabs, Tab, Alert, Autocomplete } from "@mui/material";
import { useState, useEffect } from "react";
import { UserPlus, Users } from "lucide-react";
import { householdAPI, userAPI } from "../../../api/apiService";

export default function ThemThongTinCuDan() {
  const [tabIndex, setTabIndex] = useState(0); // 0: Thêm dân cư, 1: Thêm kế toán

  // State cho form Dân cư
  const [danCuData, setDanCuData] = useState({
    name: "",
    dateOfBirth: "",
    gender: "",
    nationality: "Việt Nam",
    personalId: "",
    household: "",
    relationshipToHead: "",
    email: "",
    phoneNumber: "",
  });

  // State cho danh sách hộ gia đình từ API
  const [households, setHouseholds] = useState([]);
  const [loadingHouseholds, setLoadingHouseholds] = useState(false);

  // Fetch households từ API
  useEffect(() => {
    const fetchHouseholds = async () => {
      try {
        setLoadingHouseholds(true);
        const response = await householdAPI.getAll();
        console.log("API Response:", response);
        
        // API trả về trực tiếp mảng, không có response.data
        const householdsData = Array.isArray(response) 
          ? response 
          : (Array.isArray(response.data) ? response.data : []);
        
        console.log("Processed households:", householdsData);
        setHouseholds(householdsData);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách hộ gia đình:", error);
        setErrorMessage("Không thể tải danh sách hộ gia đình");
      } finally {
        setLoadingHouseholds(false);
      }
    };
    fetchHouseholds();
  }, []);

  // State cho form Kế toán
  const [keToanData, setKeToanData] = useState({
    name: "",
    dateOfBirth: "",
    gender: "",
    nationality: "Việt Nam",
    personalId: "",
    email: "",
    phoneNumber: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);



  const handleSubmitDanCu = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    
    // Validate
    if (!danCuData.name.trim() || !danCuData.email.trim() || !danCuData.personalId.trim()) {
      setErrorMessage("Vui lòng điền đầy đủ các trường bắt buộc!");
      return;
    }

    if (!danCuData.household) {
      setErrorMessage("Vui lòng chọn hộ gia đình!");
      return;
    }

    if (!danCuData.relationshipToHead.trim()) {
      setErrorMessage("Vui lòng nhập quan hệ với chủ hộ!");
      return;
    }

    try {
      setIsSubmitting(true);

      // 1. Tạo User với role HOUSE MEMBER
      const userData = {
        email: danCuData.email,
        password: "12345678", // Mật khẩu mặc định
        name: danCuData.name,
        sex: danCuData.gender,
        dob: danCuData.dateOfBirth,
        phoneNumber: danCuData.phoneNumber,
        userCardID: danCuData.personalId,
        ethnic: danCuData.nationality,
        roleName: "HOUSE MEMBER",
        status: "VERIFIED"
      };

      const newUser = await userAPI.create(userData);
      console.log("User created:", newUser);

      // 2. Thêm user vào hộ gia đình
      await householdAPI.addMember(danCuData.household, {
        userId: newUser._id,
        relationship: danCuData.relationshipToHead
      });

      setSuccessMessage(`Thêm dân cư ${danCuData.name} thành công! Mật khẩu mặc định: 12345678`);
      
      // Reset form
      setDanCuData({
        name: "",
        dateOfBirth: "",
        gender: "",
        nationality: "Việt Nam",
        personalId: "",
        household: "",
        relationshipToHead: "",
        email: "",
        phoneNumber: "",
      });

      // Clear success message sau 5s
      setTimeout(() => setSuccessMessage(""), 5000);

    } catch (error) {
      console.error("Error creating user:", error);
      const errorMsg = error.response?.data?.message || error.message || "Có lỗi xảy ra khi thêm dân cư";
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitKeToan = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    
    // Validate
    if (!keToanData.name.trim() || !keToanData.email.trim() || !keToanData.personalId.trim()) {
      setErrorMessage("Vui lòng điền đầy đủ các trường bắt buộc!");
      return;
    }

    try {
      setIsSubmitting(true);

      // Tạo User với role ACCOUNTANT
      const userData = {
        email: keToanData.email,
        password: "12345678", // Mật khẩu mặc định
        name: keToanData.name,
        sex: keToanData.gender,
        dob: keToanData.dateOfBirth,
        phoneNumber: keToanData.phoneNumber,
        userCardID: keToanData.personalId,
        ethnic: keToanData.nationality,
        roleName: "ACCOUNTANT",
        status: "VERIFIED"
      };

      const newUser = await userAPI.create(userData);
      console.log("Accountant created:", newUser);

      setSuccessMessage(`Thêm kế toán ${keToanData.name} thành công! Mật khẩu mặc định: 12345678`);
      
      // Reset form
      setKeToanData({
        name: "",
        dateOfBirth: "",
        gender: "",
        nationality: "Việt Nam",
        personalId: "",
        email: "",
        phoneNumber: "",
      });

      // Clear success message sau 5s
      setTimeout(() => setSuccessMessage(""), 5000);

    } catch (error) {
      console.error("Error creating accountant:", error);
      const errorMsg = error.response?.data?.message || error.message || "Có lỗi xảy ra khi thêm kế toán";
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          sx={{ 
            fontSize: '28px', 
            fontWeight: 700,
            color: '#1e293b',
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <UserPlus size={32} />
          Thêm thông tin cư dân
        </Typography>
        <Typography sx={{ fontSize: '14px', color: '#64748b' }}>
          Thêm dân cư hoặc kế toán vào hệ thống. Mật khẩu mặc định: 12345678
        </Typography>
      </Box>

      {/* Alert Messages */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage("")}>
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMessage("")}>
          {errorMessage}
        </Alert>
      )}

      {/* Form Container */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: "16px",
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        }}
      >
        {/* Tabs */}
        <Tabs
          value={tabIndex}
          onChange={(e, newValue) => {
            setTabIndex(newValue);
            setSuccessMessage("");
            setErrorMessage("");
          }}
          variant="fullWidth"
          sx={{ 
            mb: 4,
            '& .MuiTab-root': {
              fontSize: '16px',
              fontWeight: 600,
              textTransform: 'none',
              py: 2,
            },
            '& .Mui-selected': {
              color: '#667eea',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#667eea',
              height: 3,
            }
          }}
        >
          <Tab 
            label="Thêm Dân cư" 
            icon={<Users size={20} />} 
            iconPosition="start"
          />
          <Tab 
            label="Thêm Kế toán" 
            icon={<UserPlus size={20} />} 
            iconPosition="start"
          />
        </Tabs>

        {/* Form Thêm Dân cư */}
        {tabIndex === 0 && (
          <form onSubmit={handleSubmitDanCu}>
            <Box 
              sx={{ 
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 3 
              }}
            >
              <Box>
                <Typography sx={{ fontSize: "13px", fontWeight: "500", mb: 1, color: "#666" }}>
                  Họ và tên <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  value={danCuData.name}
                  onChange={(e) => setDanCuData({ ...danCuData, name: e.target.value })}
                  required
                  fullWidth
                  placeholder="Nguyễn Văn A"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#F5F7FA",
                      borderRadius: "8px",
                      "& fieldset": { borderColor: "transparent" },
                      "&:hover fieldset": { borderColor: "#E0E0E0" },
                      "&.Mui-focused fieldset": { borderColor: "#2D66F5" },
                    },
                    "& .MuiInputBase-input": {
                      padding: "12px 14px",
                      fontSize: "15px",
                      color: "#333"
                    }
                  }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontSize: "13px", fontWeight: "500", mb: 1, color: "#666" }}>
                  Ngày sinh <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  type="date"
                  value={danCuData.dateOfBirth}
                  onChange={(e) => setDanCuData({ ...danCuData, dateOfBirth: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#F5F7FA",
                      borderRadius: "8px",
                      "& fieldset": { borderColor: "transparent" },
                      "&:hover fieldset": { borderColor: "#E0E0E0" },
                      "&.Mui-focused fieldset": { borderColor: "#2D66F5" },
                    },
                    "& .MuiInputBase-input": {
                      padding: "12px 14px",
                      fontSize: "15px",
                      color: "#333"
                    }
                  }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontSize: "13px", fontWeight: "500", mb: 1, color: "#666" }}>
                  Giới tính <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  select
                  value={danCuData.gender}
                  onChange={(e) => setDanCuData({ ...danCuData, gender: e.target.value })}
                  required
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#F5F7FA",
                      borderRadius: "8px",
                      "& fieldset": { borderColor: "transparent" },
                      "&:hover fieldset": { borderColor: "#E0E0E0" },
                      "&.Mui-focused fieldset": { borderColor: "#2D66F5" },
                    },
                    "& .MuiInputBase-input": {
                      padding: "12px 14px",
                      fontSize: "15px",
                      color: "#333"
                    }
                  }}
                >
                  <MenuItem value="Nam">Nam</MenuItem>
                  <MenuItem value="Nữ">Nữ</MenuItem>
                  <MenuItem value="Khác">Khác</MenuItem>
                </TextField>
              </Box>

              <Box>
                <Typography sx={{ fontSize: "13px", fontWeight: "500", mb: 1, color: "#666" }}>
                  Quốc tịch <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  value={danCuData.nationality}
                  onChange={(e) => setDanCuData({ ...danCuData, nationality: e.target.value })}
                  required
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#F5F7FA",
                      borderRadius: "8px",
                      "& fieldset": { borderColor: "transparent" },
                      "&:hover fieldset": { borderColor: "#E0E0E0" },
                      "&.Mui-focused fieldset": { borderColor: "#2D66F5" },
                    },
                    "& .MuiInputBase-input": {
                      padding: "12px 14px",
                      fontSize: "15px",
                      color: "#333"
                    }
                  }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontSize: "13px", fontWeight: "500", mb: 1, color: "#666" }}>
                  Số định danh cá nhân (CCCD) <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  value={danCuData.personalId}
                  onChange={(e) => setDanCuData({ ...danCuData, personalId: e.target.value })}
                  required
                  fullWidth
                  placeholder="001234567890"
                  inputProps={{ maxLength: 12 }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#F5F7FA",
                      borderRadius: "8px",
                      "& fieldset": { borderColor: "transparent" },
                      "&:hover fieldset": { borderColor: "#E0E0E0" },
                      "&.Mui-focused fieldset": { borderColor: "#2D66F5" },
                    },
                    "& .MuiInputBase-input": {
                      padding: "12px 14px",
                      fontSize: "15px",
                      color: "#333"
                    }
                  }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontSize: "13px", fontWeight: "500", mb: 1, color: "#666" }}>
                  Số điện thoại <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  value={danCuData.phoneNumber}
                  onChange={(e) => setDanCuData({ ...danCuData, phoneNumber: e.target.value })}
                  required
                  fullWidth
                  placeholder="0123456789"
                  inputProps={{ maxLength: 10 }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#F5F7FA",
                      borderRadius: "8px",
                      "& fieldset": { borderColor: "transparent" },
                      "&:hover fieldset": { borderColor: "#E0E0E0" },
                      "&.Mui-focused fieldset": { borderColor: "#2D66F5" },
                    },
                    "& .MuiInputBase-input": {
                      padding: "12px 14px",
                      fontSize: "15px",
                      color: "#333"
                    }
                  }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontSize: "13px", fontWeight: "500", mb: 1, color: "#666" }}>
                  Hộ gia đình <span style={{ color: "red" }}>*</span>
                </Typography>
                <Autocomplete
                  value={households.find(h => h._id === danCuData.household) || null}
                  onChange={(event, newValue) => {
                    setDanCuData({ ...danCuData, household: newValue?._id || "" });
                  }}
                  options={households}
                  getOptionLabel={(option) => {
                    const id = option.houseHoldID || option._id || "";
                    const name = option.headOfHousehold?.name || option.leader?.name || "Chưa có chủ hộ";
                    return `${id} - ${name}`;
                  }}
                  renderOption={(props, option) => (
                    <Box component="li" {...props} key={option._id}>
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography sx={{ fontSize: "15px", fontWeight: "500" }}>
                          {option.houseHoldID || option._id} - {option.headOfHousehold?.name || option.leader?.name || "Chưa có chủ hộ"}
                        </Typography>
                        <Typography sx={{ fontSize: "13px", color: "#666" }}>
                          {option.address}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  loading={loadingHouseholds}
                  disabled={loadingHouseholds}
                  noOptionsText="Không tìm thấy hộ gia đình"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={loadingHouseholds ? "Đang tải..." : "Tìm kiếm hộ gia đình..."}
                      required={!danCuData.household}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#F5F7FA",
                          borderRadius: "8px",
                          "& fieldset": { borderColor: "transparent" },
                          "&:hover fieldset": { borderColor: "#E0E0E0" },
                          "&.Mui-focused fieldset": { borderColor: "#2D66F5" },
                        },
                        "& .MuiInputBase-input": {
                          padding: "12px 14px !important",
                          fontSize: "15px",
                          color: "#333"
                        }
                      }}
                    />
                  )}
                />
              </Box>

              <Box>
                <Typography sx={{ fontSize: "13px", fontWeight: "500", mb: 1, color: "#666" }}>
                  Quan hệ với chủ hộ <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  value={danCuData.relationshipToHead}
                  onChange={(e) => setDanCuData({ ...danCuData, relationshipToHead: e.target.value })}
                  required
                  fullWidth
                  placeholder="Ví dụ: Con, Vợ/Chồng, Cha/Mẹ..."
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#F5F7FA",
                      borderRadius: "8px",
                      "& fieldset": { borderColor: "transparent" },
                      "&:hover fieldset": { borderColor: "#E0E0E0" },
                      "&.Mui-focused fieldset": { borderColor: "#2D66F5" },
                    },
                    "& .MuiInputBase-input": {
                      padding: "12px 14px",
                      fontSize: "15px",
                      color: "#333"
                    }
                  }}
                />
              </Box>

            <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 2' } }}>
              <Typography sx={{ fontSize: "13px", fontWeight: "500", mb: 1, color: "#666" }}>
                Email <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                type="email"
                value={danCuData.email}
                onChange={(e) => setDanCuData({ ...danCuData, email: e.target.value })}
                required
                fullWidth
                placeholder="nguyenvana@gmail.com"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#F5F7FA",
                    borderRadius: "8px",
                    "& fieldset": { borderColor: "transparent" },
                    "&:hover fieldset": { borderColor: "#E0E0E0" },
                    "&.Mui-focused fieldset": { borderColor: "#2D66F5" },
                  },
                  "& .MuiInputBase-input": {
                    padding: "12px 14px",
                    fontSize: "15px",
                    color: "#333"
                  }
                }}
              />
            </Box>
            </Box>

            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                type="button"
                variant="contained"
                onClick={() => setDanCuData({
                  name: "",
                  dateOfBirth: "",
                  gender: "",
                  nationality: "Việt Nam",
                  personalId: "",
                  household: "",
                  relationshipToHead: "",
                  email: "",
                  phoneNumber: "",
                })}
                sx={{ 
                  backgroundColor: "#ef4444",
                  borderRadius: "8px",
                  textTransform: "none",
                  px: 3,
                  py: 1,
                  fontSize: "14px",
                  fontWeight: "500",
                  "&:hover": { backgroundColor: "#dc2626" },
                }}
              >
                Xóa form
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                sx={{ 
                  backgroundColor: "#2D66F5",
                  borderRadius: "8px",
                  textTransform: "none",
                  px: 3,
                  py: 1,
                  fontSize: "14px",
                  fontWeight: "500",
                  "&:hover": { backgroundColor: "#1E54D4" },
                  "&:disabled": { backgroundColor: "#ccc" },
                }}
              >
                {isSubmitting ? "Đang xử lý..." : "Thêm dân cư"}
              </Button>
            </Box>
          </form>
        )}

        {/* Form Thêm Kế toán */}
        {tabIndex === 1 && (
          <form onSubmit={handleSubmitKeToan}>
            <Box 
              sx={{ 
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 3 
              }}
            >
              <Box>
                <Typography sx={{ fontSize: "13px", fontWeight: "500", mb: 1, color: "#666" }}>
                  Họ và tên <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  value={keToanData.name}
                  onChange={(e) => setKeToanData({ ...keToanData, name: e.target.value })}
                  required
                  fullWidth
                  placeholder="Nguyễn Thị B"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#F5F7FA",
                      borderRadius: "8px",
                      "& fieldset": { borderColor: "transparent" },
                      "&:hover fieldset": { borderColor: "#E0E0E0" },
                      "&.Mui-focused fieldset": { borderColor: "#2D66F5" },
                    },
                    "& .MuiInputBase-input": {
                      padding: "12px 14px",
                      fontSize: "15px",
                      color: "#333"
                    }
                  }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontSize: "13px", fontWeight: "500", mb: 1, color: "#666" }}>
                  Ngày sinh <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  type="date"
                  value={keToanData.dateOfBirth}
                  onChange={(e) => setKeToanData({ ...keToanData, dateOfBirth: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#F5F7FA",
                      borderRadius: "8px",
                      "& fieldset": { borderColor: "transparent" },
                      "&:hover fieldset": { borderColor: "#E0E0E0" },
                      "&.Mui-focused fieldset": { borderColor: "#2D66F5" },
                    },
                    "& .MuiInputBase-input": {
                      padding: "12px 14px",
                      fontSize: "15px",
                      color: "#333"
                    }
                  }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontSize: "13px", fontWeight: "500", mb: 1, color: "#666" }}>
                  Giới tính <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  select
                  value={keToanData.gender}
                  onChange={(e) => setKeToanData({ ...keToanData, gender: e.target.value })}
                  required
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#F5F7FA",
                      borderRadius: "8px",
                      "& fieldset": { borderColor: "transparent" },
                      "&:hover fieldset": { borderColor: "#E0E0E0" },
                      "&.Mui-focused fieldset": { borderColor: "#2D66F5" },
                    },
                    "& .MuiInputBase-input": {
                      padding: "12px 14px",
                      fontSize: "15px",
                      color: "#333"
                    }
                  }}
                >
                  <MenuItem value="Nam">Nam</MenuItem>
                  <MenuItem value="Nữ">Nữ</MenuItem>
                  <MenuItem value="Khác">Khác</MenuItem>
                </TextField>
              </Box>

              <Box>
                <Typography sx={{ fontSize: "13px", fontWeight: "500", mb: 1, color: "#666" }}>
                  Quốc tịch <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  value={keToanData.nationality}
                  onChange={(e) => setKeToanData({ ...keToanData, nationality: e.target.value })}
                  required
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#F5F7FA",
                      borderRadius: "8px",
                      "& fieldset": { borderColor: "transparent" },
                      "&:hover fieldset": { borderColor: "#E0E0E0" },
                      "&.Mui-focused fieldset": { borderColor: "#2D66F5" },
                    },
                    "& .MuiInputBase-input": {
                      padding: "12px 14px",
                      fontSize: "15px",
                      color: "#333"
                    }
                  }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontSize: "13px", fontWeight: "500", mb: 1, color: "#666" }}>
                  Số định danh cá nhân (CCCD) <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  value={keToanData.personalId}
                  onChange={(e) => setKeToanData({ ...keToanData, personalId: e.target.value })}
                  required
                  fullWidth
                  placeholder="001234567890"
                  inputProps={{ maxLength: 12 }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#F5F7FA",
                      borderRadius: "8px",
                      "& fieldset": { borderColor: "transparent" },
                      "&:hover fieldset": { borderColor: "#E0E0E0" },
                      "&.Mui-focused fieldset": { borderColor: "#2D66F5" },
                    },
                    "& .MuiInputBase-input": {
                      padding: "12px 14px",
                      fontSize: "15px",
                      color: "#333"
                    }
                  }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontSize: "13px", fontWeight: "500", mb: 1, color: "#666" }}>
                  Số điện thoại <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  value={keToanData.phoneNumber}
                  onChange={(e) => setKeToanData({ ...keToanData, phoneNumber: e.target.value })}
                  required
                  fullWidth
                  placeholder="0123456789"
                  inputProps={{ maxLength: 10 }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#F5F7FA",
                      borderRadius: "8px",
                      "& fieldset": { borderColor: "transparent" },
                      "&:hover fieldset": { borderColor: "#E0E0E0" },
                      "&.Mui-focused fieldset": { borderColor: "#2D66F5" },
                    },
                    "& .MuiInputBase-input": {
                      padding: "12px 14px",
                      fontSize: "15px",
                      color: "#333"
                    }
                  }}
                />
              </Box>

              <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 2' } }}>
                <Typography sx={{ fontSize: "13px", fontWeight: "500", mb: 1, color: "#666" }}>
                  Email <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  type="email"
                  value={keToanData.email}
                  onChange={(e) => setKeToanData({ ...keToanData, email: e.target.value })}
                  required
                  fullWidth
                  placeholder="ketoan@gmail.com"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#F5F7FA",
                      borderRadius: "8px",
                      "& fieldset": { borderColor: "transparent" },
                      "&:hover fieldset": { borderColor: "#E0E0E0" },
                      "&.Mui-focused fieldset": { borderColor: "#2D66F5" },
                    },
                    "& .MuiInputBase-input": {
                      padding: "12px 14px",
                      fontSize: "15px",
                      color: "#333"
                    }
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                type="button"
                variant="contained"
                onClick={() => setKeToanData({
                  name: "",
                  dateOfBirth: "",
                  gender: "",
                  nationality: "Việt Nam",
                  personalId: "",
                  email: "",
                  phoneNumber: "",
                })}
                sx={{ 
                  backgroundColor: "#ef4444",
                  borderRadius: "8px",
                  textTransform: "none",
                  px: 3,
                  py: 1,
                  fontSize: "14px",
                  fontWeight: "500",
                  "&:hover": { backgroundColor: "#dc2626" },
                }}
              >
                Xóa form
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                sx={{ 
                  backgroundColor: "#2D66F5",
                  borderRadius: "8px",
                  textTransform: "none",
                  px: 3,
                  py: 1,
                  fontSize: "14px",
                  fontWeight: "500",
                  "&:hover": { backgroundColor: "#1E54D4" },
                  "&:disabled": { backgroundColor: "#ccc" },
                }}
              >
                {isSubmitting ? "Đang xử lý..." : "Thêm kế toán"}
              </Button>
            </Box>
          </form>
        )}

        {/* Password Note */}
        <Box 
          sx={{ 
            mt: 4, 
            p: 3, 
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}
        >
          <Typography sx={{ fontSize: '14px', color: '#64748b', mb: 1 }}>
            <strong>Lưu ý:</strong>
          </Typography>
          <Typography sx={{ fontSize: '14px', color: '#64748b' }}>
            • Mật khẩu mặc định cho tài khoản mới: <strong>12345678</strong>
          </Typography>
          <Typography sx={{ fontSize: '14px', color: '#64748b' }}>
            • Vui lòng thông báo cho người dùng đổi mật khẩu sau lần đăng nhập đầu tiên
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
