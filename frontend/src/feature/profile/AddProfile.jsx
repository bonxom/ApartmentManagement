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
    Box
} from "@mui/material";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

export default function AddProfileModal({ open, onClose, currentData, onSubmit }) {
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
        phoneNumber: "",
        reason: ""
    });

    // Update form data when modal opens or currentData changes
    useEffect(() => {
        if (open) {
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
                phoneNumber: currentData.phoneNumber || "",
                reason: ""
            });
        }
    }, [open, currentData]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = () => {
        onSubmit(formData);
        onClose();
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
            phoneNumber: "",
            reason: ""
        });
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
                        Yêu cầu chỉnh sửa thông tin
                    </Typography>
                    <IconButton onClick={handleClose} size="small">
                        <X size={20} />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent>
                <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
                    {/* Họ và tên */}
                    <Grid item xs={12} sm={6}>
                        <Typography sx={{ fontSize: "14px", fontWeight: "500", mb: 1, color: "#333" }}>
                            Họ và tên <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Nhập họ và tên"
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
                                    fontSize: "14px"
                                }
                            }}
                        />
                    </Grid>

                    {/* Ngày sinh */}
                    <Grid item xs={12} sm={6}>
                        <Typography sx={{ fontSize: "14px", fontWeight: "500", mb: 1, color: "#333" }}>
                            Ngày sinh <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
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
                                    fontSize: "14px"
                                }
                            }}
                        />
                    </Grid>

                    {/* Giới tính */}
                    <Grid item xs={12} sm={6}>
                        <Typography sx={{ fontSize: "14px", fontWeight: "500", mb: 1, color: "#333" }}>
                            Giới tính <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            placeholder="Nhập giới tính"
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
                                    fontSize: "14px"
                                }
                            }}
                        />
                    </Grid>

                    {/* Quốc tịch */}
                    <Grid item xs={12} sm={6}>
                        <Typography sx={{ fontSize: "14px", fontWeight: "500", mb: 1, color: "#333" }}>
                            Quốc tịch <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            name="nationality"
                            value={formData.nationality}
                            onChange={handleChange}
                            placeholder="Nhập quốc tịch"
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
                                    fontSize: "14px"
                                }
                            }}
                        />
                    </Grid>

                    {/* Số định danh cá nhân */}
                    <Grid item xs={12} sm={6}>
                        <Typography sx={{ fontSize: "14px", fontWeight: "500", mb: 1, color: "#333" }}>
                            Số định danh cá nhân <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            name="personalId"
                            value={formData.personalId}
                            onChange={handleChange}
                            placeholder="Nhập số định danh"
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
                                    fontSize: "14px"
                                }
                            }}
                        />
                    </Grid>

                    {/* Địa chỉ thường trú */}
                    <Grid item xs={12} sm={6}>
                        <Typography sx={{ fontSize: "14px", fontWeight: "500", mb: 1, color: "#333" }}>
                            Địa chỉ thường trú <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            name="permanentAddress"
                            value={formData.permanentAddress}
                            onChange={handleChange}
                            placeholder="Nhập địa chỉ"
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
                                    fontSize: "14px"
                                }
                            }}
                        />
                    </Grid>

                    {/* Hộ gia đình */}
                    <Grid item xs={12} sm={6}>
                        <Typography sx={{ fontSize: "14px", fontWeight: "500", mb: 1, color: "#333" }}>
                            Hộ gia đình <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            name="household"
                            value={formData.household}
                            onChange={handleChange}
                            placeholder="Nhập mã hộ gia đình"
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
                                    fontSize: "14px"
                                }
                            }}
                        />
                    </Grid>

                    {/* Quan hệ với chủ hộ */}
                    <Grid item xs={12} sm={6}>
                        <Typography sx={{ fontSize: "14px", fontWeight: "500", mb: 1, color: "#333" }}>
                            Quan hệ chủ hộ <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            name="relationshipToHead"
                            value={formData.relationshipToHead}
                            onChange={handleChange}
                            placeholder="Nhập quan hệ"
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
                                    fontSize: "14px"
                                }
                            }}
                        />
                    </Grid>

                    {/* Email */}
                    <Grid item xs={12} sm={6}>
                        <Typography sx={{ fontSize: "14px", fontWeight: "500", mb: 1, color: "#333" }}>
                            Email <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Nhập email"
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
                                    fontSize: "14px"
                                }
                            }}
                        />
                    </Grid>

                    {/* Số điện thoại */}
                    <Grid item xs={12} sm={6}>
                        <Typography sx={{ fontSize: "14px", fontWeight: "500", mb: 1, color: "#333" }}>
                            Số điện thoại <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="Nhập số điện thoại"
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
                                    fontSize: "14px"
                                }
                            }}
                        />
                    </Grid>

                    {/* Lý do chỉnh sửa */}
                    <Grid item xs={12}>
                        <Typography sx={{ fontSize: "14px", fontWeight: "500", mb: 1, color: "#333" }}>
                            Lý do yêu cầu chỉnh sửa <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            placeholder="Nhập lý do yêu cầu chỉnh sửa thông tin"
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
                                    fontSize: "14px"
                                }
                            }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ padding: "16px 24px" }}>
                <Button
                    onClick={handleClose}
                    sx={{
                        textTransform: "none",
                        color: "#666",
                        fontSize: "14px",
                        "&:hover": {
                            backgroundColor: "rgba(0,0,0,0.04)"
                        }
                    }}
                >
                    Hủy
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{
                        backgroundColor: "#2D66F5",
                        borderRadius: "8px",
                        textTransform: "none",
                        px: 3,
                        py: 1,
                        fontSize: "14px",
                        fontWeight: "500",
                        "&:hover": { backgroundColor: "#1E54D4" }
                    }}
                >
                    Gửi yêu cầu
                </Button>
            </DialogActions>
        </Dialog>
    );
}
