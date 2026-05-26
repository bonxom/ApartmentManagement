import { Box, Typography, TextField, Button, Grid, IconButton, InputAdornment, Alert } from "@mui/material";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { userAPI } from "../../api/apiService";
import useAuthStore from "../../store/authStore";

export default function ChangePasswordBox() {
    const { user } = useAuthStore();
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
        // Clear error when user types
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ""
            });
        }
    };

    const toggleShowPassword = (field) => {
        setShowPassword({
            ...showPassword,
            [field]: !showPassword[field]
        });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!passwordData.currentPassword) {
            newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
        }

        if (!passwordData.newPassword) {
            newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
        } else if (passwordData.newPassword.length < 8) {
            newErrors.newPassword = "Mật khẩu phải có ít nhất 8 ký tự";
        }

        if (!passwordData.confirmPassword) {
            newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới";
        } else if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
        }

        if (passwordData.currentPassword === passwordData.newPassword) {
            newErrors.newPassword = "Mật khẩu mới phải khác mật khẩu hiện tại";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        setSuccessMessage("");
        setErrorMessage("");

        try {
            await userAPI.changePassword(
                user._id,
                passwordData.currentPassword,
                passwordData.newPassword
            );

            setSuccessMessage("Đổi mật khẩu thành công!");
            
            // Reset form
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

            // Auto dismiss success message after 5s
            setTimeout(() => setSuccessMessage(""), 5000);
        } catch (error) {
            const message = error.message || "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại.";
            setErrorMessage(message);
            
            // Auto dismiss error message after 5s
            setTimeout(() => setErrorMessage(""), 5000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            sx={{
                backgroundColor: "white",
                borderRadius: "16px",
                boxShadow: "0px 3px 12px rgba(0, 0, 0, 0.08)",
                padding: { xs: "18px 16px", md: "24px 32px" },
                maxWidth: "1200px",
                margin: { xs: "12px", md: "24px" },
            }}
        >
            <Typography sx={{ fontSize: "18px", fontWeight: "600", mb: 3, color: "#333" }}>
                Đổi mật khẩu
            </Typography>

            {/* Success/Error Messages */}
            {successMessage && (
                <Alert severity="success" sx={{ mb: 3, width: "100%" }} onClose={() => setSuccessMessage("")}>
                    {successMessage}
                </Alert>
            )}
            {errorMessage && (
                <Alert severity="error" sx={{ mb: 3, width: "100%" }} onClose={() => setErrorMessage("")}>
                    {errorMessage}
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Mật khẩu hiện tại */}
                <Grid item xs={12} sm={6}>
                    <Typography sx={{ fontSize: "14px", fontWeight: "500", mb: 1, color: "#333" }}>
                        Mật khẩu hiện tại <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <TextField
                        fullWidth
                        type={showPassword.currentPassword ? "text" : "password"}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handleChange}
                        placeholder="Nhập mật khẩu hiện tại"
                        error={!!errors.currentPassword}
                        helperText={errors.currentPassword}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => toggleShowPassword('currentPassword')}
                                        edge="end"
                                        size="small"
                                    >
                                        {showPassword.currentPassword ? 
                                            <EyeOff size={18} color="#666" /> : 
                                            <Eye size={18} color="#666" />
                                        }
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                backgroundColor: "#F5F7FA",
                                borderRadius: "8px",
                                "& fieldset": {
                                    borderColor: errors.currentPassword ? "#d32f2f" : "transparent",
                                },
                                "&:hover fieldset": {
                                    borderColor: errors.currentPassword ? "#d32f2f" : "#E0E0E0",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: errors.currentPassword ? "#d32f2f" : "#2D66F5",
                                },
                            },
                            "& .MuiInputBase-input": {
                                padding: "12px 14px",
                                fontSize: "14px"
                            }
                        }}
                    />
                </Grid>

                {/* Spacer */}
                <Grid item xs={12} sm={6} />

                {/* Mật khẩu mới */}
                <Grid item xs={12} sm={6}>
                    <Typography sx={{ fontSize: "14px", fontWeight: "500", mb: 1, color: "#333" }}>
                        Mật khẩu mới <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <TextField
                        fullWidth
                        type={showPassword.newPassword ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handleChange}
                        placeholder="Nhập mật khẩu mới"
                        error={!!errors.newPassword}
                        helperText={errors.newPassword}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => toggleShowPassword('newPassword')}
                                        edge="end"
                                        size="small"
                                    >
                                        {showPassword.newPassword ? 
                                            <EyeOff size={18} color="#666" /> : 
                                            <Eye size={18} color="#666" />
                                        }
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                backgroundColor: "#F5F7FA",
                                borderRadius: "8px",
                                "& fieldset": {
                                    borderColor: errors.newPassword ? "#d32f2f" : "transparent",
                                },
                                "&:hover fieldset": {
                                    borderColor: errors.newPassword ? "#d32f2f" : "#E0E0E0",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: errors.newPassword ? "#d32f2f" : "#2D66F5",
                                },
                            },
                            "& .MuiInputBase-input": {
                                padding: "12px 14px",
                                fontSize: "14px"
                            }
                        }}
                    />
                </Grid>

                {/* Xác nhận mật khẩu mới */}
                <Grid item xs={12} sm={6}>
                    <Typography sx={{ fontSize: "14px", fontWeight: "500", mb: 1, color: "#333" }}>
                        Xác nhận mật khẩu mới <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <TextField
                        fullWidth
                        type={showPassword.confirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Nhập lại mật khẩu mới"
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => toggleShowPassword('confirmPassword')}
                                        edge="end"
                                        size="small"
                                    >
                                        {showPassword.confirmPassword ? 
                                            <EyeOff size={18} color="#666" /> : 
                                            <Eye size={18} color="#666" />
                                        }
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                backgroundColor: "#F5F7FA",
                                borderRadius: "8px",
                                "& fieldset": {
                                    borderColor: errors.confirmPassword ? "#d32f2f" : "transparent",
                                },
                                "&:hover fieldset": {
                                    borderColor: errors.confirmPassword ? "#d32f2f" : "#E0E0E0",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: errors.confirmPassword ? "#d32f2f" : "#2D66F5",
                                },
                            },
                            "& .MuiInputBase-input": {
                                padding: "12px 14px",
                                fontSize: "14px"
                            }
                        }}
                    />
                </Grid>
            </Grid>

            {/* Submit Button */}
            <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    sx={{
                        backgroundColor: "#2D66F5",
                        borderRadius: "8px",
                        textTransform: "none",
                        px: 4,
                        py: 1.2,
                        fontSize: "14px",
                        fontWeight: "500",
                        "&:hover": { backgroundColor: "#1E54D4" },
                        "&:disabled": { backgroundColor: "#B0BEC5" }
                    }}
                >
                    {isLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
                </Button>
            </Box>
        </Box>
    );
}
