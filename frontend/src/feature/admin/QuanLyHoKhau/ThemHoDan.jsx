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

export default function ThemHoDan({ open, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        houseHoldID: "",
        address: "",
        leaderId: ""
    });

    const [availableUsers, setAvailableUsers] = useState([]);
    const [selectedLeader, setSelectedLeader] = useState(null);
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

        if (!formData.houseHoldID) {
            newErrors.houseHoldID = "Mã hộ khẩu là bắt buộc";
        }

        if (!formData.address) {
            newErrors.address = "Địa chỉ là bắt buộc";
        }

        if (!formData.leaderId) {
            newErrors.leaderId = "Vui lòng chọn chủ hộ";
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
            await householdAPI.create({
                houseHoldID: formData.houseHoldID,
                address: formData.address,
                leaderId: formData.leaderId
            });

            setSuccessMessage("Thêm hộ dân thành công!");
            
            // Reset form
            setFormData({
                houseHoldID: "",
                address: "",
                leaderId: ""
            });
            setSelectedLeader(null);

            // Call onSuccess callback if provided
            if (onSuccess) {
                onSuccess();
            }

            // Auto close after 2s
            setTimeout(() => {
                handleClose();
            }, 2000);

        } catch (error) {
            const message = error.message || "Thêm hộ dân thất bại. Vui lòng thử lại.";
            setErrorMessage(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            houseHoldID: "",
            address: "",
            leaderId: ""
        });
        setSelectedLeader(null);
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
                        Thêm hộ dân mới
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
                    {/* Mã hộ khẩu */}
                    <Grid item xs={12} sm={6}>
                        <Typography sx={{ fontSize: "14px", fontWeight: "500", mb: 1, color: "#333" }}>
                            Mã hộ khẩu <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            name="houseHoldID"
                            value={formData.houseHoldID}
                            onChange={handleChange}
                            placeholder="Nhập mã hộ khẩu"
                            error={!!errors.houseHoldID}
                            helperText={errors.houseHoldID}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    backgroundColor: "#F5F7FA",
                                    borderRadius: "8px",
                                    "& fieldset": { borderColor: errors.houseHoldID ? "#d32f2f" : "transparent" },
                                    "&:hover fieldset": { borderColor: errors.houseHoldID ? "#d32f2f" : "#E0E0E0" },
                                    "&.Mui-focused fieldset": { borderColor: errors.houseHoldID ? "#d32f2f" : "#2D66F5" },
                                },
                                "& .MuiInputBase-input": {
                                    padding: "12px 14px",
                                    fontSize: "14px"
                                }
                            }}
                        />
                    </Grid>

                    {/* Địa chỉ */}
                    <Grid item xs={12} sm={6}>
                        <Typography sx={{ fontSize: "14px", fontWeight: "500", mb: 1, color: "#333" }}>
                            Địa chỉ <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Nhập địa chỉ"
                            error={!!errors.address}
                            helperText={errors.address}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    backgroundColor: "#F5F7FA",
                                    borderRadius: "8px",
                                    "& fieldset": { borderColor: errors.address ? "#d32f2f" : "transparent" },
                                    "&:hover fieldset": { borderColor: errors.address ? "#d32f2f" : "#E0E0E0" },
                                    "&.Mui-focused fieldset": { borderColor: errors.address ? "#d32f2f" : "#2D66F5" },
                                },
                                "& .MuiInputBase-input": {
                                    padding: "12px 14px",
                                    fontSize: "14px"
                                }
                            }}
                        />
                    </Grid>

                    {/* Chọn chủ hộ */}
                    <Grid item xs={12}>
                        <Typography sx={{ fontSize: "14px", fontWeight: "500", mb: 1, color: "#333" }}>
                            Chủ hộ <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <Autocomplete
                            options={availableUsers}
                            value={selectedLeader}
                            onChange={(event, newValue) => {
                                setSelectedLeader(newValue);
                                setFormData({
                                    ...formData,
                                    leaderId: newValue ? newValue._id : ""
                                });
                                if (errors.leaderId) {
                                    setErrors({
                                        ...errors,
                                        leaderId: ""
                                    });
                                }
                            }}
                            getOptionLabel={(option) => `${option.name} - ${option.userCardID}${option.email ? ` (${option.email})` : ''}`}
                            isOptionEqualToValue={(option, value) => option._id === value._id}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Tìm kiếm và chọn chủ hộ"
                                    error={!!errors.leaderId}
                                    helperText={errors.leaderId}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            backgroundColor: "#F5F7FA",
                                            borderRadius: "8px",
                                            "& fieldset": { borderColor: errors.leaderId ? "#d32f2f" : "transparent" },
                                            "&:hover fieldset": { borderColor: errors.leaderId ? "#d32f2f" : "#E0E0E0" },
                                            "&.Mui-focused fieldset": { borderColor: errors.leaderId ? "#d32f2f" : "#2D66F5" },
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

                    {/* Info text */}
                    <Grid item xs={12}>
                        <Box sx={{ 
                            backgroundColor: "#E3F2FD", 
                            padding: "12px 16px", 
                            borderRadius: "8px",
                            border: "1px solid #90CAF9"
                        }}>
                            <Typography sx={{ fontSize: "13px", color: "#1976D2" }}>
                                <strong>Lưu ý:</strong> Chỉ những người dùng đã được xác minh (VERIFIED), chưa thuộc hộ nào mới có thể được chọn làm chủ hộ mới.
                                Sau khi tạo, chủ hộ sẽ tự động trở thành thành viên đầu tiên của hộ.
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
