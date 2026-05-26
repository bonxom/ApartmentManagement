import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions,
    TextField, 
    Button, 
    Grid,
    IconButton,
    Typography,
    Box,
    Alert,
    Autocomplete
} from "@mui/material";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { householdAPI, userAPI } from "../../../api/apiService";

export default function ThemThanhVien({ open, onClose, onSuccess, householdId }) {
    const [formData, setFormData] = useState({
        userId: "",
        relationship: ""
    });

    const [availableUsers, setAvailableUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Fetch available users when modal opens
    useEffect(() => {
        if (open) {
            fetchAvailableUsers();
        }
    }, [open]);

    const fetchAvailableUsers = async () => {
        try {
            const users = await userAPI.getAll();
            // Filter users who don't have a household yet and have VERIFIED status
            const usersWithoutHousehold = users.filter(user => 
                !user.household && user.status === "VERIFIED"
            );
            setAvailableUsers(usersWithoutHousehold);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            setErrorMessage("Không thể tải danh sách người dùng");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        // Clear error when user types
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ""
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.userId) {
            newErrors.userId = "Vui lòng chọn thành viên";
        }

        if (!formData.relationship || !formData.relationship.trim()) {
            newErrors.relationship = "Quan hệ với chủ hộ là bắt buộc";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        if (!householdId) {
            setErrorMessage("Không tìm thấy ID hộ dân");
            return;
        }

        setIsLoading(true);
        setSuccessMessage("");
        setErrorMessage("");

        try {
            await householdAPI.addMember(householdId, {
                userId: formData.userId,
                relationship: formData.relationship.trim()
            });

            setSuccessMessage("Thêm thành viên thành công!");
            
            // Reset form
            setFormData({
                userId: "",
                relationship: ""
            });
            setSelectedUser(null);

            // Call onSuccess callback if provided
            if (onSuccess) {
                onSuccess();
            }

            // Auto close after 2s
            setTimeout(() => {
                handleClose();
            }, 2000);

        } catch (error) {
            const message = error.message || "Thêm thành viên thất bại. Vui lòng thử lại.";
            setErrorMessage(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            userId: "",
            relationship: ""
        });
        setSelectedUser(null);
        setErrors({});
        setSuccessMessage("");
        setErrorMessage("");
        onClose();
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: "16px",
                    padding: "8px"
                }
            }}
        >
            <DialogTitle sx={{ pb: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography sx={{ fontSize: "20px", fontWeight: "600" }}>
                        Thêm thành viên vào hộ
                    </Typography>
                    <IconButton onClick={handleClose} size="small">
                        <X size={20} />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent>
                {/* Success/Error Messages */}
                {successMessage && (
                    <Alert severity="success" sx={{ mb: 2, width: "100%" }} onClose={() => setSuccessMessage("")}>
                        {successMessage}
                    </Alert>
                )}
                {errorMessage && (
                    <Alert severity="error" sx={{ mb: 2, width: "100%" }} onClose={() => setErrorMessage("")}>
                        {errorMessage}
                    </Alert>
                )}

                <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
                    {/* Chọn thành viên */}
                    <Grid item xs={12}>
                        <Typography sx={{ fontSize: "14px", fontWeight: "500", mb: 1, color: "#333" }}>
                            Thành viên <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <Autocomplete
                            options={availableUsers}
                            value={selectedUser}
                            onChange={(event, newValue) => {
                                setSelectedUser(newValue);
                                setFormData({
                                    ...formData,
                                    userId: newValue ? newValue._id : ""
                                });
                                if (errors.userId) {
                                    setErrors({
                                        ...errors,
                                        userId: ""
                                    });
                                }
                            }}
                            getOptionLabel={(option) => `${option.name} - ${option.userCardID}${option.email ? ` (${option.email})` : ''}`}
                            isOptionEqualToValue={(option, value) => option._id === value._id}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Tìm kiếm và chọn thành viên"
                                    error={!!errors.userId}
                                    helperText={errors.userId}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            backgroundColor: "#F5F7FA",
                                            borderRadius: "8px",
                                            "& fieldset": { borderColor: errors.userId ? "#d32f2f" : "transparent" },
                                            "&:hover fieldset": { borderColor: errors.userId ? "#d32f2f" : "#E0E0E0" },
                                            "&.Mui-focused fieldset": { borderColor: errors.userId ? "#d32f2f" : "#2D66F5" },
                                        },
                                        "& .MuiInputBase-input": {
                                            padding: "12px 14px !important",
                                            fontSize: "14px"
                                        }
                                    }}
                                />
                            )}
                            noOptionsText="Không tìm thấy người dùng phù hợp"
                            sx={{
                                "& .MuiAutocomplete-popupIndicator": { 
                                    color: "#666" 
                                },
                                "& .MuiAutocomplete-clearIndicator": { 
                                    color: "#666" 
                                }
                            }}
                        />
                    </Grid>

                    {/* Quan hệ với chủ hộ */}
                    <Grid item xs={12}>
                        <Typography sx={{ fontSize: "14px", fontWeight: "500", mb: 1, color: "#333" }}>
                            Quan hệ với chủ hộ <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            name="relationship"
                            value={formData.relationship}
                            onChange={handleChange}
                            placeholder="Ví dụ: Con, Vợ/Chồng, Cha/Mẹ, ..."
                            error={!!errors.relationship}
                            helperText={errors.relationship}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    backgroundColor: "#F5F7FA",
                                    borderRadius: "8px",
                                    "& fieldset": { borderColor: errors.relationship ? "#d32f2f" : "transparent" },
                                    "&:hover fieldset": { borderColor: errors.relationship ? "#d32f2f" : "#E0E0E0" },
                                    "&.Mui-focused fieldset": { borderColor: errors.relationship ? "#d32f2f" : "#2D66F5" },
                                },
                                "& .MuiInputBase-input": {
                                    padding: "12px 14px",
                                    fontSize: "14px"
                                }
                            }}
                        />
                    </Grid>

                    {/* Info text */}
                    <Grid item xs={12}>
                        <Box sx={{ 
                            backgroundColor: "#E3F2FD", 
                            padding: "12px 16px", 
                            borderRadius: "8px",
                            border: "1px solid #90CAF9"
                        }}>
                            <Typography sx={{ fontSize: "13px", color: "#1976D2" }}>
                                <strong>Lưu ý:</strong> Chỉ những người dùng đã được xác minh (VERIFIED) và chưa thuộc hộ nào mới có thể được thêm vào.
                                Sau khi thêm, thành viên sẽ được liên kết với hộ này và có thể truy cập thông tin hộ gia đình.
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
                <Button
                    onClick={handleClose}
                    disabled={isLoading}
                    sx={{
                        textTransform: "none",
                        color: "#666",
                        borderRadius: "8px",
                        px: 3,
                        py: 1,
                        fontSize: "14px",
                        fontWeight: "500",
                        "&:hover": {
                            backgroundColor: "#F5F5F5"
                        }
                    }}
                >
                    Hủy
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={isLoading}
                    sx={{
                        textTransform: "none",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        borderRadius: "8px",
                        px: 3,
                        py: 1,
                        fontSize: "14px",
                        fontWeight: "500",
                        boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                        "&:hover": {
                            background: "linear-gradient(135deg, #5568d3 0%, #63408a 100%)",
                            boxShadow: "0 6px 16px rgba(102, 126, 234, 0.4)",
                        },
                        "&:disabled": {
                            background: "#B0BEC5",
                            color: "#fff"
                        }
                    }}
                >
                    {isLoading ? "Đang xử lý..." : "Xác nhận"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
