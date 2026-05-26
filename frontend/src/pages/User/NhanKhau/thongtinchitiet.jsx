import { Box, Typography, Avatar, Button, Grid } from "@mui/material";
import { useState } from "react";

import ProfileInfoField from "../../../feature/profile/ProfileInfoField";
import EditRequestModal from "../../../feature/profile/EditRequestModal";
import useAuthStore from "../../../store/authStore";

export default function DetailProfile() {
    const { user } = useAuthStore();
    const [openEditModal, setOpenEditModal] = useState(false);
    
    // Thông tin người dùng hiện tại (không thể sửa trực tiếp)
    const userInfo = {
        fullName: user?.name || "Nguyễn Văn A",
        dateOfBirth: "01/01/1990",
        gender: "Nam",
        nationality: "Việt Nam",
        personalId: "001234567890",
        permanentAddress: "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
        household: "HGĐ-001",
        relationshipToHead: "Chủ hộ",
        email: user?.email || "nguyenvana@gmail.com",
        phoneNumber: "0123456789"
    };

    const handleEditRequest = (formData) => {
        console.log("Yêu cầu chỉnh sửa:", formData);
        // TODO: Gửi yêu cầu chỉnh sửa đến backend
        alert("Yêu cầu chỉnh sửa đã được gửi!");
    };

    return (
        <Box
            sx={{
                backgroundColor: "white",
                borderRadius: "16px",
                boxShadow: "0px 3px 12px rgba(0, 0, 0, 0.08)",
                padding: "24px 32px",
                maxWidth: "1200px",
                margin: "24px",
            }}
        >
                {/* Header with Avatar and Edit Button */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar
                            sx={{
                                width: 70,
                                height: 70,
                                bgcolor: "#E3F2FD",
                                fontSize: "24px",
                                fontWeight: "600"
                            }}
                        >
                            {userInfo.fullName.charAt(0)}
                        </Avatar>
                        <Box>
                            <Typography sx={{ fontSize: "20px", fontWeight: "600", mb: 0.5 }}>
                                {userInfo.fullName}
                            </Typography>
                            <Typography sx={{ fontSize: "14px", color: "#666" }}>
                                {userInfo.email}
                            </Typography>
                        </Box>
                    </Box>

                    <Button
                        variant="contained"
                        onClick={() => setOpenEditModal(true)}
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
                        Yêu cầu chỉnh sửa
                    </Button>
                </Box>

                {/* Thông tin cá nhân */}
                <Typography sx={{ fontSize: "18px", fontWeight: "600", mb: 3, color: "#333" }}>
                    Thông tin cá nhân
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <ProfileInfoField label="Họ và tên" value={userInfo.fullName} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <ProfileInfoField label="Ngày sinh" value={userInfo.dateOfBirth} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <ProfileInfoField label="Giới tính" value={userInfo.gender} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <ProfileInfoField label="Quốc tịch" value={userInfo.nationality} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <ProfileInfoField label="Số định danh cá nhân" value={userInfo.personalId} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <ProfileInfoField label="Địa chỉ thường trú" value={userInfo.permanentAddress} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <ProfileInfoField label="Hộ gia đình" value={userInfo.household} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <ProfileInfoField label="Quan hệ với chủ hộ" value={userInfo.relationshipToHead} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <ProfileInfoField label="Email" value={userInfo.email} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <ProfileInfoField label="Số điện thoại" value={userInfo.phoneNumber} />
                    </Grid>
                </Grid>

                {/* Modal yêu cầu chỉnh sửa */}
                <EditRequestModal
                    open={openEditModal}
                    onClose={() => setOpenEditModal(false)}
                    currentData={userInfo}
                    onSubmit={handleEditRequest}
                />
        </Box>
    );
}
