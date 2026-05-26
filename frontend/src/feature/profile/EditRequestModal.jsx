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
    Alert
} from "@mui/material";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

export default function EditRequestModal({ open, onClose, currentData, onSubmit }) {
    const [formData, setFormData] = useState({
        name: "",
        dob: "",
        sex: "",
        birthLocation: "",
        ethnic: "",
        job: "",
        relationshipWithHead: "",
        email: "",
        phoneNumber: "",
        reason: ""
    });
    const [error, setError] = useState("");

    // Update form data when modal opens or currentData changes
    useEffect(() => {
        if (open) {
            setFormData({
                name: currentData.name || "",
                dob: currentData.dob || "",
                sex: currentData.sex || "",
                birthLocation: currentData.birthLocation || "",
                ethnic: currentData.ethnic || "",
                job: currentData.job || "",
                relationshipWithHead: currentData.relationshipWithHead || "",
                email: currentData.email || "",
                phoneNumber: currentData.phoneNumber || "",
                reason: ""
            });
            setError("");
        }
    }, [open, currentData]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        // Reset error
        setError("");

        // Validate reason
        if (!formData.reason || !formData.reason.trim()) {
            setError("Vui lòng nhập lý do yêu cầu chỉnh sửa.");
            return;
        }

        // Validate changes - check if there are any changes
        const allowedFields = [
            "name",
            "dob",
            "sex",
            "birthLocation",
            "ethnic",
            "job",
            "relationshipWithHead",
            "email",
            "phoneNumber",
        ];

        const changes = allowedFields.reduce((acc, field) => {
            const currentValue = currentData[field] ?? "";
            const newValue = formData[field] ?? "";
            const normalizedCurrent = typeof currentValue === "string" ? currentValue.trim() : currentValue;
            const normalizedNew = typeof newValue === "string" ? newValue.trim() : newValue;

            if (normalizedNew !== normalizedCurrent && normalizedNew !== "") {
                acc[field] = normalizedNew;
            }
            return acc;
        }, {});

        if (Object.keys(changes).length === 0) {
            setError("Không có thay đổi nào so với thông tin hiện tại.");
            return;
        }

        // If validation passes, call onSubmit
        try {
            const success = await onSubmit(formData);
            if (success) {
                onClose();
            }
        } catch (error) {
            console.error("Submit update-info failed", error);
            const message = error?.message || error?.customMessage || "Gửi yêu cầu chỉnh sửa thất bại.";
            setError(message);
        }
    };

    const handleClose = () => {
        setFormData({
            name: "",
            dob: "",
            sex: "",
            birthLocation: "",
            ethnic: "",
            job: "",
            relationshipWithHead: "",
            email: "",
            phoneNumber: "",
            reason: ""
        });
        setError("");
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
                {error && (
                    <Alert severity="warning" sx={{ mb: 2 }} onClose={() => setError("")}>
                        {error}
                    </Alert>
                )}
                <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
                    {/* Họ và tên */}
                    <Grid item xs={12} sm={6}>
                        <Typography sx={{ fontSize: "14px", fontWeight: "500", mb: 1, color: "#333" }}>
                            Họ và tên <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            name="name"
                            value={formData.name}
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
                            name="dob"
                            value={formData.dob}
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
                            name="sex"
                            value={formData.sex}
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

                    {/* Nơi sinh */}
                    <Grid item xs={12} sm={6}>
                        <Typography sx={{ fontSize: "14px", fontWeight: "500", mb: 1, color: "#333" }}>
                            Nơi sinh
                        </Typography>
                        <TextField
                            fullWidth
                            name="birthLocation"
                            value={formData.birthLocation}
                            onChange={handleChange}
                            placeholder="Nhập nơi sinh"
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

                    {/* Dân tộc */}
                    <Grid item xs={12} sm={6}>
                        <Typography sx={{ fontSize: "14px", fontWeight: "500", mb: 1, color: "#333" }}>
                            Dân tộc
                        </Typography>
                        <TextField
                            fullWidth
                            name="ethnic"
                            value={formData.ethnic}
                            onChange={handleChange}
                            placeholder="Nhập dân tộc"
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

                    {/* Nghề nghiệp */}
                    <Grid item xs={12} sm={6}>
                        <Typography sx={{ fontSize: "14px", fontWeight: "500", mb: 1, color: "#333" }}>
                            Nghề nghiệp
                        </Typography>
                        <TextField
                            fullWidth
                            name="job"
                            value={formData.job}
                            onChange={handleChange}
                            placeholder="Nhập nghề nghiệp"
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
                            Quan hệ với chủ hộ <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            name="relationshipWithHead"
                            value={formData.relationshipWithHead}
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
