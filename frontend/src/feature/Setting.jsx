import {
  Box,
  Typography,
  Avatar,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Switch,
} from "@mui/material";
import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import ChangePasswordBox from "../feature/profile/ChangePasswordBox";
import useThemeStore from "../store/themeStore";
import useNotificationStore from "../store/notificationStore";

export default function Setting() {
  const { user, checkAuth, updateProfile } = useAuthStore();

  //Chức năng darkmode chưa hoàn thiện, độ tương phản đang bị ngu
  const { mode, toggleMode } = useThemeStore();
  const [initialMode, setInitialMode] = useState(mode);
  const isDark = mode === "dark";

  const {
    enabled: notificationsEnabled,
    toggleEnabled: toggleNotificationsEnabled,
  } = useNotificationStore();

  const [formValues, setFormValues] = useState({
    name: "",
    phoneNumber: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const ok = await checkAuth();
        if (!ok) {
          setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        }
      } catch (err) {
        setError("Không thể tải thông tin người dùng.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [checkAuth]);

  useEffect(() => {
    setFormValues({
      name: user?.name || "",
      phoneNumber: user?.phoneNumber || "",
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess("");

    const nameInput = formValues.name.trim();
    const phoneInput = formValues.phoneNumber.trim();

    const currentName = (user?.name || "").trim();
    const currentPhone = (user?.phoneNumber || "").trim();

    const effectiveName = nameInput || currentName;
    const effectivePhone = phoneInput || currentPhone;

    const themeChanged = initialMode !== mode;
    const infoChanged =
      effectiveName !== currentName || effectivePhone !== currentPhone;

    // Không đổi info, không đổi theme -> không làm gì
    if (!infoChanged && !themeChanged) {
      setError("Không có thay đổi nào so với thông tin hiện tại.");
      return;
    }

    if (!themeChanged && !nameInput && !phoneInput) {
      setError("Vui lòng nhập ít nhất một trường thông tin.");
      return;
    }

    setSubmitLoading(true);
    try {
      // Chỉ gọi API nếu thực sự có thay đổi thông tin
      if (infoChanged) {
        const result = await updateProfile({
          name: effectiveName,
          phoneNumber: effectivePhone,
        });

        if (!result?.success) {
          setError(result?.error || "Cập nhật thất bại.");
          return;
        }
      }

      // Nếu theme thay đổi, cập nhật lại mode gốc để lần sau so sánh đúng
      if (themeChanged) {
        setInitialMode(mode);
      }

      setSuccess("Cập nhật thông tin thành công.");
    } catch (err) {
      console.error("Update profile failed:", err);
      setError("Cập nhật thất bại.");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={(theme) => ({
          backgroundColor: theme.palette.background.paper,
          borderRadius: "16px",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0px 3px 18px rgba(0, 0, 0, 0.7)"
              : "0px 3px 12px rgba(0, 0, 0, 0.08)",
          padding: { xs: "18px 16px", md: "24px 32px" },
          maxWidth: "1200px",
          margin: { xs: "12px", md: "24px" },
        })}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                width: 70,
                height: 70,
                bgcolor: "#E3F2FD",
                fontSize: "24px",
                fontWeight: "600",
              }}
            >
              {(user?.name || user?.email || "?").charAt(0)}
            </Avatar>
            <Box>
              <Typography
                sx={{ fontSize: "20px", fontWeight: "600", mb: 0.5 }}
              >
                {user?.name || "Chưa cập nhật"}
              </Typography>
              <Typography
                sx={(theme) => ({
                  fontSize: "14px",
                  color: theme.palette.text.secondary,
                })}
              >
                {user?.email || "Chưa cập nhật"}
              </Typography>
            </Box>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Typography
          sx={(theme) => ({
            fontSize: "18px",
            fontWeight: "600",
            mb: 3,
            color: theme.palette.text.primary,
          })}
        >
          Cài đặt tài khoản
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography
              sx={(theme) => ({
                fontSize: "14px",
                fontWeight: "500",
                mb: 1,
                color: theme.palette.text.primary,
              })}
            >
              Họ và tên
            </Typography>
            <TextField
              fullWidth
              name="name"
              value={formValues.name}
              onChange={handleChange}
              placeholder="Nhập họ và tên"
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.palette.background.default
                      : "#F5F7FA",
                  borderRadius: "8px",
                  "& fieldset": { borderColor: "transparent" },
                  "&:hover fieldset": { borderColor: "#E0E0E0" },
                  "&.Mui-focused fieldset": { borderColor: "#2D66F5" },
                },
                "& .MuiInputBase-input": {
                  padding: "12px 14px",
                  fontSize: "14px",
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography
              sx={(theme) => ({
                fontSize: "14px",
                fontWeight: "500",
                mb: 1,
                color: theme.palette.text.primary,
              })}
            >
              Số điện thoại
            </Typography>
            <TextField
              fullWidth
              name="phoneNumber"
              value={formValues.phoneNumber}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.palette.background.default
                      : "#F5F7FA",
                  borderRadius: "8px",
                  "& fieldset": { borderColor: "transparent" },
                  "&:hover fieldset": { borderColor: "#E0E0E0" },
                  "&.Mui-focused fieldset": { borderColor: "#2D66F5" },
                },
                "& .MuiInputBase-input": {
                  padding: "12px 14px",
                  fontSize: "14px",
                },
              }}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitLoading}
            sx={{
              backgroundColor: "#2D66F5",
              borderRadius: "8px",
              textTransform: "none",
              px: 3,
              py: 1,
              fontSize: "14px",
              fontWeight: "500",
              "&:hover": { backgroundColor: "#1E54D4" },
            }}
          >
            {submitLoading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </Box>
      </Box>

      <Box
        sx={(theme) => ({
          backgroundColor: theme.palette.background.paper,
          borderRadius: "16px",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0px 3px 18px rgba(0, 0, 0, 0.7)"
              : "0px 3px 12px rgba(0, 0, 0, 0.08)",
          padding: "24px 32px",
          maxWidth: "1200px",
          margin: "0 24px 24px 24px",
        })}
      >
        <Typography
          sx={(theme) => ({
            fontSize: "18px",
            fontWeight: "600",
            mb: 3,
            color: theme.palette.text.primary,
          })}
        >
          Cài đặt hệ thống
        </Typography>

        {/* Giao diện / Dark mode */}
        <Typography
          sx={(theme) => ({
            fontSize: "16px",
            fontWeight: "600",
            mb: 2,
            color: theme.palette.text.primary,
          })}
        >
          Giao diện
        </Typography>

        <Box
          sx={(theme) => ({
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor:
              theme.palette.mode === "dark"
                ? theme.palette.background.default
                : "#F5F7FA",
            borderRadius: "12px",
            padding: "16px 20px",
            mb: 3,
          })}
        >
          <Box>
            <Typography sx={{ fontSize: "14px", fontWeight: 500, mb: 0.5 }}>
              Chế độ tối
            </Typography>
            <Typography
              sx={(theme) => ({
                fontSize: "13px",
                color: theme.palette.text.secondary,
              })}
            >
              Bật để sử dụng giao diện nền tối.
            </Typography>
          </Box>
          <Switch checked={isDark} onChange={toggleMode} />
        </Box>

        {/* Thông báo */}
        <Typography
          sx={(theme) => ({
            fontSize: "16px",
            fontWeight: "600",
            mb: 2,
            color: theme.palette.text.primary,
          })}
        >
          Thông báo
        </Typography>

        <Box
          sx={(theme) => ({
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor:
              theme.palette.mode === "dark"
                ? theme.palette.background.default
                : "#F5F7FA",
            borderRadius: "12px",
            padding: "16px 20px",
          })}
        >
          <Box>
            <Typography sx={{ fontSize: "14px", fontWeight: 500, mb: 0.5 }}>
              Bật thông báo
            </Typography>
            <Typography
              sx={(theme) => ({
                fontSize: "13px",
                color: theme.palette.text.secondary,
              })}
            >
              Cho phép hệ thống hiển thị thông báo ở góc trên bên phải.
            </Typography>
          </Box>
          <Switch
            checked={notificationsEnabled}
            onChange={toggleNotificationsEnabled}
          />
        </Box>
      </Box>
    </>
  );
}
