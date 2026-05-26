import { Box, Typography, Avatar, Button, Grid, CircularProgress, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import ProfileInfoField from "../feature/profile/ProfileInfoField";
import EditRequestModal from "../feature/profile/EditRequestModal";
import ChangePasswordBox from "../feature/profile/ChangePasswordBox";
import useAuthStore from "../store/authStore";
import { requestAPI } from "../api/apiService";

export default function Profile() {
    const { user, checkAuth } = useAuthStore();
    const [openEditModal, setOpenEditModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const statusDisplay = (() => {
        const map = {
            PENDING: "Chờ duyệt",
            VERIFIED: "Đã xác minh",
            LOCKED: "Bị khóa",
            DECEASED: "Đã qua đời",
        };
        return map[user?.status] || "Chưa cập nhật";
    })();

    const householdDisplay = (() => {
        if (!user?.household) return "Chưa cập nhật";
        if (typeof user.household === "object") {
            return user.household.houseHoldID || user.household._id || "Đã liên kết";
        }
        return user.household;
    })();

    const roleDisplay = user?.role?.role_name || "Chưa cập nhật";

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const isValid = await checkAuth();
                if (!isValid) {
                    setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                }
            } catch (err) {
                setError("Không thể tải thông tin người dùng.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [checkAuth]);
    
    // Dữ liệu hiển thị
    const userInfo = {
        fullName: user?.name || "Chưa cập nhật",
        dobDisplay: user?.dob ? new Date(user.dob).toLocaleDateString("vi-VN") : "Chưa cập nhật",
        sex: user?.sex || "Chưa cập nhật",
        personalId: user?.userCardID || "Chưa cập nhật",
        birthLocation: user?.birthLocation || "Chưa cập nhật",
        ethnic: user?.ethnic || "Chưa cập nhật",
        job: user?.job || "Chưa cập nhật",
        status: statusDisplay,
        role: roleDisplay,
        household: householdDisplay,
        relationshipWithHead: user?.relationshipWithHead || "Chưa cập nhật",
        email: user?.email || "Chưa cập nhật",
        phoneNumber: user?.phoneNumber || "Chưa cập nhật"
    };

    // Dữ liệu thô gửi lên form cập nhật
    const editDefaults = {
        name: user?.name || "",
        dob: user?.dob ? new Date(user.dob).toISOString().slice(0, 10) : "",
        sex: user?.sex || "",
        birthLocation: user?.birthLocation || "",
        ethnic: user?.ethnic || "",
        job: user?.job || "",
        relationshipWithHead: user?.relationshipWithHead || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
    };

    const handleEditRequest = async (formData) => {
        // Chỉ gửi các trường thay đổi so với dữ liệu hiện tại
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
            const currentValue = editDefaults[field] ?? "";
            const newValue = formData[field] ?? "";
            const normalizedCurrent = typeof currentValue === "string" ? currentValue.trim() : currentValue;
            const normalizedNew = typeof newValue === "string" ? newValue.trim() : newValue;

            if (normalizedNew !== normalizedCurrent && normalizedNew !== "") {
                acc[field] = normalizedNew;
            }
            return acc;
        }, {});

        const payload = { ...changes, reason: formData.reason.trim() };

        setError(null);
        try {
            await requestAPI.updateInfo(payload);
            alert("Yêu cầu chỉnh sửa đã được gửi!");
            setOpenEditModal(false);
            return true;
        } catch (err) {
            console.error("Gửi yêu cầu chỉnh sửa thất bại:", err);
            const message = err?.message || err?.customMessage || "Gửi yêu cầu chỉnh sửa thất bại.";
            // Throw error so modal can catch and display it
            throw new Error(message);
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
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
                            {userInfo.fullName ? userInfo.fullName.charAt(0) : "?"}
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

                {error && (
                    <Alert severity="warning" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {/* Thông tin cá nhân */}
                <Typography sx={{ fontSize: "18px", fontWeight: "600", mb: 3, color: "#333" }}>
                    Thông tin cá nhân
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <ProfileInfoField label="Họ và tên" value={userInfo.fullName} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <ProfileInfoField label="Ngày sinh" value={userInfo.dobDisplay} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <ProfileInfoField label="Giới tính" value={userInfo.sex} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <ProfileInfoField label="Số định danh cá nhân" value={userInfo.personalId} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <ProfileInfoField label="Nơi sinh" value={userInfo.birthLocation} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <ProfileInfoField label="Dân tộc" value={userInfo.ethnic} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <ProfileInfoField label="Nghề nghiệp" value={userInfo.job} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <ProfileInfoField label="Hộ gia đình" value={userInfo.household} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <ProfileInfoField label="Quan hệ với chủ hộ" value={userInfo.relationshipWithHead} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <ProfileInfoField label="Trạng thái" value={userInfo.status} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <ProfileInfoField label="Role" value={userInfo.role} />
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
                    currentData={editDefaults}
                    onSubmit={handleEditRequest}
                />
            </Box>

            {/* Đổi mật khẩu */}
            <ChangePasswordBox />
        </>
    );
}
