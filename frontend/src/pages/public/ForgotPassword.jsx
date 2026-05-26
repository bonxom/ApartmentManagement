import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Mail, ArrowLeft, Send, Home } from "lucide-react";
import "./style/ForgotPassword.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Vui lòng nhập email của bạn");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email không hợp lệ");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // TODO: Implement forgot password API call
      // await authAPI.forgotPassword({ email });
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setSuccess(true);
      setTimeout(() => {
        navigate("/signin");
      }, 3000);
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="forgot-password-page">
      {/* Home Button */}
      <IconButton
        component={RouterLink}
        to="/"
        className="forgot-password-home-btn"
        aria-label="Go to home"
      >
        <Home size={24} />
      </IconButton>

      {/* Background Decoration */}
      <Box className="forgot-password-background">
        <Box className="forgot-password-bg-blur forgot-password-bg-blur-1" />
        <Box className="forgot-password-bg-blur forgot-password-bg-blur-2" />
      </Box>

      {/* Main Card */}
      <Box className="forgot-password-card-container">
        <Box className="forgot-password-form-content">
          {!success ? (
            <>
              <Box className="forgot-password-header">
                <Box className="forgot-password-icon-wrapper">
                  <Mail size={48} />
                </Box>
                <Typography variant="h4" className="forgot-password-title">
                  Quên mật khẩu?
                </Typography>
                <Typography className="forgot-password-subtitle">
                  Nhập email của bạn để nhận liên kết đặt lại mật khẩu
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="forgot-password-form">
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleChange}
                  error={!!error}
                  placeholder="example@gmail.com"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={20} />
                      </InputAdornment>
                    ),
                  }}
                  className="forgot-password-input"
                  autoComplete="email"
                  autoFocus
                />

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  startIcon={<Send />}
                  className="forgot-password-submit-btn"
                >
                  {isLoading ? "Đang gửi..." : "Gửi liên kết đặt lại"}
                </Button>

                <Button
                  fullWidth
                  component={RouterLink}
                  to="/signin"
                  variant="text"
                  startIcon={<ArrowLeft />}
                  className="forgot-password-back-btn"
                >
                  Quay lại đăng nhập
                </Button>
              </form>
            </>
          ) : (
            <Box className="forgot-password-success">
              <Box className="forgot-password-success-icon">
                <Send size={64} />
              </Box>
              <Typography variant="h4" className="forgot-password-success-title">
                Kiểm tra email của bạn!
              </Typography>
              <Typography className="forgot-password-success-text">
                Chúng tôi đã gửi liên kết đặt lại mật khẩu đến email:
              </Typography>
              <Typography className="forgot-password-success-email">
                {email}
              </Typography>
              <Typography className="forgot-password-success-note">
                Nếu bạn không nhận được email trong vài phút, vui lòng kiểm tra
                thư mục spam hoặc thử lại.
              </Typography>
              <Button
                component={RouterLink}
                to="/signin"
                variant="contained"
                className="forgot-password-submit-btn"
                // tăng bề rộng của nút
                sx={{ mt: 3, width: '100%' }}
              >
                Về trang đăng nhập
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default ForgotPassword;
