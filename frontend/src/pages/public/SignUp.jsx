import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { IdCard, Phone, Mail, User, MapPin, Lock, Users, Home, Briefcase, Globe } from "lucide-react";
import { authAPI } from "../../api/apiService";
import { signUpSchema } from "../../hooks/validation";
import "./style/SignUp.css";

function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    userCardID: "",
    email: "",
    birthLocation: "",
    password: "",
    confirmPassword: "",
    dob: "",
    sex: "",
    job: "",
    ethnic: "",
  });

  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "userCardID" || name === "phoneNumber") {
      if (value && !/^\d*$/.test(value)) return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (backendError) setBackendError("");
  };

   const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate form data bằng Zod
      signUpSchema.parse(formData);
      setErrors({});
      setIsLoading(true);

      await authAPI.signUp(formData);

      alert(
        "Đăng ký thành công!\n\n" +
          "Tài khoản của bạn đang chờ duyệt. " +
          "Bạn sẽ được thông báo khi tài khoản được kích hoạt."
      );
      navigate("/signin");
    } catch (err) {
      if (err.errors) {
        // Nếu là lỗi Zod
        const formattedErrors = {};
        err.errors.forEach((error) => {
          formattedErrors[error.path[0]] = error.message;
        });
        setErrors(formattedErrors);
      } else if (err.message) {
        // Lỗi từ backend
        setBackendError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Box className="signup-page">
      {/* Home Button */}
      <IconButton 
        component={RouterLink}
        to="/"
        className="signup-home-btn"
        aria-label="Go to home"
      >
        <Home size={24} />
      </IconButton>

      {/* Background Decoration */}
      <Box className="signup-background">
        <Box className="signup-bg-blur signup-bg-blur-1" />
        <Box className="signup-bg-blur signup-bg-blur-2" />
      </Box>

      {/* Main Card */}
      <Box className="signup-card-container">
        <Box className="signup-form-content">
          <Box className="signup-header">
            <Box className="signup-icon-wrapper">
              <Users size={48} />
            </Box>
            <Typography variant="h4" className="signup-title">
              Đăng ký tài khoản
            </Typography>
            <Typography className="signup-subtitle">
              Điền đầy đủ thông tin để gửi yêu cầu xác nhận
            </Typography>
          </Box>

            {backendError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {backendError}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="signup-form">
              <TextField
                fullWidth
                label="Họ và tên"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                placeholder="Nguyễn Văn A"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <User size={20} />
                    </InputAdornment>
                  ),
                }}
                className="signup-input"
                autoComplete="name"
              />

              <TextField
                fullWidth
                select
                label="Giới tính"
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                error={!!errors.sex}
                helperText={errors.sex}
                SelectProps={{
                  native: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                className="signup-input"
              >
                <option value="" disabled>Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </TextField>

              <TextField
                fullWidth
                label="Căn cước công dân"
                name="userCardID"
                type="text"
                value={formData.userCardID}
                onChange={handleChange}
                error={!!errors.userCardID}
                helperText={errors.userCardID}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IdCard size={20} />
                    </InputAdornment>
                  ),
                }}
                className="signup-input"
                autoComplete="idcard"
              />

              <TextField
                fullWidth
                label="Số điện thoại"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                error={!!errors.phoneNumber}
                placeholder="0912345678"
                helperText={errors.phoneNumber}
                inputProps={{ maxLength: 10 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone size={20} />
                    </InputAdornment>
                  ),
                }}
                className="signup-input"
                autoComplete="tel"
              />

              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                placeholder="example@gmail.com"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail size={20} />
                    </InputAdornment>
                  ),
                }}
                className="signup-input"
                autoComplete="email"
              />

              <TextField
                fullWidth
                label="Ngày sinh"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                error={!!errors.dob}
                helperText={errors.dob}
                InputLabelProps={{ shrink: true }}
                className="signup-input"
              />

              <TextField
                fullWidth
                label="Nơi sinh"
                name="birthLocation"
                value={formData.birthLocation}
                onChange={handleChange}
                error={!!errors.birthLocation}
                helperText={errors.birthLocation}
                placeholder="Tỉnh/Thành phố nơi sinh"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MapPin size={20} />
                    </InputAdornment>
                  ),
                }}
                className="signup-input"
              />

              <TextField
                fullWidth
                label="Nghề nghiệp"
                name="job"
                value={formData.job}
                onChange={handleChange}
                error={!!errors.job}
                helperText={errors.job}
                placeholder="Kỹ sư, Giáo viên, Sinh viên..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Briefcase size={20} />
                    </InputAdornment>
                  ),
                }}
                className="signup-input"
              />

              <TextField
                fullWidth
                label="Dân tộc"
                name="ethnic"
                value={formData.ethnic}
                onChange={handleChange}
                error={!!errors.ethnic}
                helperText={errors.ethnic}
                placeholder="Kinh, Tày, Mường..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Globe size={20} />
                    </InputAdornment>
                  ),
                }}
                className="signup-input"
              />

              <TextField
                fullWidth
                label="Mật khẩu"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password || "Tối thiểu 8 ký tự"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={20} />
                    </InputAdornment>
                  ),
                }}
                className="signup-input"
                autoComplete="new-password"
              />

              <TextField
                fullWidth
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={20} />
                    </InputAdornment>
                  ),
                }}
                className="signup-input"
                autoComplete="new-password"
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={isLoading}
                startIcon={<Users />}
                className="signup-submit-btn"
              >
                {isLoading ? "Đang gửi yêu cầu..." : "Gửi yêu cầu đăng ký"}
              </Button>

              <Typography variant="body2" className="signup-footer">
                Đã có tài khoản?{" "}
                <Link component={RouterLink} to="/signin" className="signup-signin-link">
                  Đăng nhập
                </Link>
              </Typography>
            </form>
          </Box>
        </Box>
      </Box>
  );
}

export default SignUp;
