import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { householdAPI } from "../../../api/apiService";
import useAuthStore from "../../../store/authStore";
import ProfileInfoField from "../../../feature/profile/ProfileInfoField";

export default function ThongTinMember() {
  const location = useLocation();
  const { user } = useAuthStore();
  const memberId = location.state?.memberId;

  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (memberId && user?.household) {
      fetchMemberData();
    }
  }, [memberId, user]);

  const fetchMemberData = async () => {
    setLoading(true);
    setError("");
    try {
      const householdId = user?.household?._id || user?.household;
      const data = await householdAPI.getMemberById(householdId, memberId);
      setMemberData(data);
    } catch (err) {
      console.error("Error fetching member data:", err);
      setError(err?.message || "Không thể tải thông tin thành viên");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!memberData) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">Không tìm thấy thông tin thành viên</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "24px 32px" }}>
      {/* Header */}
      <Typography sx={{ fontSize: "26px", fontWeight: "600", mb: 3 }}>
        Thông tin chi tiết thành viên
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Main Content */}
      <Paper
        sx={{
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          p: 4,
        }}
      >
        <Grid container spacing={3}>
          {/* Thông tin cá nhân */}
          <Grid item xs={12}>
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: "600",
                mb: 2,
                color: "#1e293b",
                borderBottom: "2px solid #e2e8f0",
                pb: 1,
              }}
            >
              Thông tin cá nhân
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <ProfileInfoField label="Họ và tên" value={memberData.name} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <ProfileInfoField label="Giới tính" value={memberData.sex} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <ProfileInfoField label="Ngày sinh" value={formatDate(memberData.dob)} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <ProfileInfoField label="Số CCCD" value={memberData.userCardID} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <ProfileInfoField label="Số điện thoại" value={memberData.phoneNumber} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <ProfileInfoField label="Email" value={memberData.email} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <ProfileInfoField label="Nghề nghiệp" value={memberData.job} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <ProfileInfoField label="Dân tộc" value={memberData.ethnic} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <ProfileInfoField label="Nơi sinh" value={memberData.birthLocation} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <ProfileInfoField
              label="Quan hệ với chủ hộ"
              value={memberData.relationshipWithHead}
            />
          </Grid>

          {/* Thông tin hộ khẩu */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: "600",
                mb: 2,
                color: "#1e293b",
                borderBottom: "2px solid #e2e8f0",
                pb: 1,
              }}
            >
              Thông tin hộ khẩu
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <ProfileInfoField
              label="Mã hộ khẩu"
              value={memberData.household?.houseHoldID}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <ProfileInfoField
              label="Địa chỉ"
              value={memberData.household?.address}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <ProfileInfoField
              label="Chủ hộ"
              value={memberData.household?.leader?.name}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
