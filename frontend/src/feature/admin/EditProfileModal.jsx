import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    MenuItem,
    Box,
    Typography,
    IconButton
} from "@mui/material";
import { useState, useEffect } from "react";

export default function EditProfileModal({ open, onClose, currentData, onSubmit }) {
    const [formData, setFormData] = useState({
        fullName: "",
        dateOfBirth: "",
        gender: "",
        nationality: "",
        personalId: "",
        permanentAddress: "",
        household: "",
        relationshipToHead: "",
        email: "",
        phoneNumber: ""
    });

    const [errors, setErrors] = useState({});

    // Update form data when modal opens or currentData changes
    useEffect(() => {
        if (open && currentData) {
            setFormData({
                fullName: currentData.fullName || "",
                dateOfBirth: currentData.dateOfBirth || "",
                gender: currentData.gender || "",
                nationality: currentData.nationality || "",
                personalId: currentData.personalId || "",
                permanentAddress: currentData.permanentAddress || "",
                household: currentData.household || "",
                relationshipToHead: currentData.relationshipToHead || "",
                email: currentData.email || "",
                phoneNumber: currentData.phoneNumber || ""
            });
            setErrors({});
        }
    }, [open, currentData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Họ và tên không được để trống";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email không được để trống";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email không hợp lệ";
        }

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = "Số điện thoại không được để trống";
        } else if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = "Số điện thoại phải có 10 chữ số";
        }

        if (!formData.personalId.trim()) {
            newErrors.personalId = "Số định danh cá nhân không được để trống";
        } else if (!/^[0-9]{12}$/.test(formData.personalId)) {
            newErrors.personalId = "Số định danh phải có 12 chữ số";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSubmit(formData);
            onClose();
        }
    };

    const handleClose = () => {
        setFormData({
            fullName: "",
            dateOfBirth: "",
            gender: "",
            nationality: "",
            personalId: "",
            permanentAddress: "",
            household: "",
            relationshipToHead: "",
            email: "",
            phoneNumber: ""
        });
        setErrors({});
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
                    borderRadius: "12px",
                    boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12)"
                }
            }}
        >
            <DialogTitle
                sx={{
                    fontSize: "20px",
                    fontWeight: "600",
                    color: "#333",
                    borderBottom: "1px solid #E0E0E0",
                    pb: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                Chỉnh sửa thông tin cá nhân
                <IconButton
                    onClick={handleClose}
                    sx={{
                        color: "#666",
                        fontSize: "28px",
                        "&:hover": { backgroundColor: "#F5F5F5" }
                    }}
                >
                    ×
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 3, pb: 2 }}>
                <Grid container spacing={2.5}>
                    {/* Họ và tên */}
                    <Grid item xs={12} sm={6}>
                        <Typography sx={{ fontSize: "14px", fontWeight: "500", mb: 1, color: "#333" }}>
                            Họ và tên <span style={{ color: "#d32f2f" }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            error={!!errors.fullName}
                            helperText={errors.fullName}
                            placeholder="Nhập họ và tên"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "8px",
                                    fontSize: "14px"
                                }
                            }}
                        />
                    </Grid>

                    {/* Ngày sinh */}
                    <Grid item xs={12} sm={6}>
                        <Typography sx={{ fontSize: "14px", fontWeight: "500", mb: 1, color: "#333" }}>
                            Ngày sinh
                        </Typography>
                        <TextField
                            fullWidth
                            name="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "8px",
                                    fontSize: "14px"
                                }
                            }}
                        />
                    </Grid>

                    {/* Giới tính */}
                    <Grid item xs={12} sm={6}>
                        <Typography sx={{ fontSize: "14px", fontWeight: "500", mb: 1, color: "#333" }}>
                            Giới tính
                        </Typography>
                        <TextField
                            fullWidth
                            select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "8px",
                                    fontSize: "14px"
                                }
                            }}
                        >
                            <MenuItem value="Nam">Nam</MenuItem>
                            <MenuItem value="Nữ">Nữ</MenuItem>
                            <MenuItem value="Khác">Khác</MenuItem>
                        </TextField>
                    </Grid>

                    {/* Quốc tịch */}
                    <Grid item xs={12} sm={6}>
                        <Typography sx={{ fontSize: "14px", fontWeight: "500", mb: 1, color: "#333" }}>
                            Quốc tịch
                        </Typography>
                        <TextField
                            fullWidth
                            name="nationality"
                            value={formData.nationality}
                            onChange={handleChange}
                            placeholder="Nhập quốc tịch"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "8px",
                                    fontSize: "14px"
                                }
                            }}
                        />
                    </Grid>

                    {/* Số định danh cá nhân */}
                    <Grid item xs={12} sm={6}>
                        <Typography sx={{ fontSize: "14px", fontWeight: "500", mb: 1, color: "#333" }}>
                            Số định danh cá nhân <span style={{ color: "#d32f2f" }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            name="personalId"
                            value={formData.personalId}
                            onChange={handleChange}
                            error={!!errors.personalId}
                            helperText={errors.personalId}
                            placeholder="Nhập số định danh 12 chữ số"
                            inputProps={{ maxLength: 12 }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "8px",
                                    fontSize: "14px"
                                }
                            }}
                        />
                    </Grid>

                    {/* Email */}
                    <Grid item xs={12} sm={6}>
                        <Typography sx={{ fontSize: "14px", fontWeight: "500", mb: 1, color: "#333" }}>
                            Email <span style={{ color: "#d32f2f" }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                            placeholder="Nhập email"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "8px",
                                    fontSize: "14px"
                                }
                            }}
                        />
                    </Grid>

                    {/* Số điện thoại */}
                    <Grid item xs={12} sm={6}>
                        <Typography sx={{ fontSize: "14px", fontWeight: "500", mb: 1, color: "#333" }}>
                            Số điện thoại <span style={{ color: "#d32f2f" }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            error={!!errors.phoneNumber}
                            helperText={errors.phoneNumber}
                            placeholder="Nhập số điện thoại 10 chữ số"
                            inputProps={{ maxLength: 10 }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "8px",
                                    fontSize: "14px"
                                }
                            }}
                        />
                    </Grid>

                    {/* Hộ gia đình */}
                    <Grid item xs={12} sm={6}>
                        <Typography sx={{ fontSize: "14px", fontWeight: "500", mb: 1, color: "#333" }}>
                            Hộ gia đình
                        </Typography>
                        <TextField
                            fullWidth
                            name="household"
                            value={formData.household}
                            onChange={handleChange}
                            placeholder="Nhập mã hộ gia đình"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "8px",
                                    fontSize: "14px"
                                }
                            }}
                        />
                    </Grid>

                    {/* Quan hệ với chủ hộ */}
                    <Grid item xs={12} sm={6}>
                        <Typography sx={{ fontSize: "14px", fontWeight: "500", mb: 1, color: "#333" }}>
                            Quan hệ với chủ hộ
                        </Typography>
                        <TextField
                            fullWidth
                            select
                            name="relationshipToHead"
                            value={formData.relationshipToHead}
                            onChange={handleChange}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "8px",
                                    fontSize: "14px"
                                }
                            }}
                        >
                            <MenuItem value="Chủ hộ">Chủ hộ</MenuItem>
                            <MenuItem value="Vợ/Chồng">Vợ/Chồng</MenuItem>
                            <MenuItem value="Con">Con</MenuItem>
                            <MenuItem value="Bố/Mẹ">Bố/Mẹ</MenuItem>
                            <MenuItem value="Anh/Chị/Em">Anh/Chị/Em</MenuItem>
                            <MenuItem value="Khác">Khác</MenuItem>
                        </TextField>
                    </Grid>

                    {/* Địa chỉ thường trú */}
                    <Grid item xs={12}>
                        <Typography sx={{ fontSize: "14px", fontWeight: "500", mb: 1, color: "#333" }}>
                            Địa chỉ thường trú
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            name="permanentAddress"
                            value={formData.permanentAddress}
                            onChange={handleChange}
                            placeholder="Nhập địa chỉ thường trú"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "8px",
                                    fontSize: "14px"
                                }
                            }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions
                sx={{
                    borderTop: "1px solid #E0E0E0",
                    px: 3,
                    py: 2,
                    gap: 1.5
                }}
            >
                <Button
                    onClick={handleClose}
                    sx={{
                        color: "#666",
                        textTransform: "none",
                        fontSize: "14px",
                        fontWeight: "500",
                        px: 3,
                        py: 1,
                        borderRadius: "8px",
                        "&:hover": { backgroundColor: "#F5F5F5" }
                    }}
                >
                    Hủy
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{
                        backgroundColor: "#2D66F5",
                        textTransform: "none",
                        fontSize: "14px",
                        fontWeight: "500",
                        px: 3,
                        py: 1,
                        borderRadius: "8px",
                        "&:hover": { backgroundColor: "#1E54D4" }
                    }}
                >
                    Lưu thay đổi
                </Button>
            </DialogActions>
        </Dialog>
    );
}
