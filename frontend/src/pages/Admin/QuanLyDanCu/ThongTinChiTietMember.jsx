import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Grid,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Backdrop,
} from "@mui/material";
import { X } from "lucide-react";
import { userAPI, householdAPI } from "../../../api/apiService";
import ProfileInfoField from "../../../feature/profile/ProfileInfoField";

export default function ThongTinChiTietMember() {
  const location = useLocation();
  const navigate = useNavigate();
  const memberId = location.state?.memberId;

  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form data for editing
  const [formData, setFormData] = useState({
    name: "",
    sex: "",
    dob: "",
    phoneNumber: "",
    job: "",
    ethnic: "",
    birthLocation: "",
    relationshipWithHead: "",
  });

  useEffect(() => {
    if (!memberId) {
      setError("Không tìm thấy ID thành viên");
      return;
    }
    fetchMemberData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberId]);

  const fetchMemberData = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await userAPI.getById(memberId);
      setMemberData(data);
      // Set form data for editing
      setFormData({
        name: data.name || "",
        sex: data.sex || "",
        dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : "",
        phoneNumber: data.phoneNumber || "",
        job: data.job || "",
        ethnic: data.ethnic || "",
        birthLocation: data.birthLocation || "",
        relationshipWithHead: data.relationshipWithHead || "",
      });
    } catch (err) {
      console.error("Failed to fetch member data:", err);
      setError("Không thể tải thông tin thành viên. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data
    setFormData({
      name: memberData.name || "",
      sex: memberData.sex || "",
      dob: memberData.dob ? new Date(memberData.dob).toISOString().split('T')[0] : "",
      phoneNumber: memberData.phoneNumber || "",
      job: memberData.job || "",
      ethnic: memberData.ethnic || "",
      birthLocation: memberData.birthLocation || "",
      relationshipWithHead: memberData.relationshipWithHead || "",
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    try {
      await userAPI.update(memberId, formData);
      await fetchMemberData();
      setIsEditing(false);
      alert("Cập nhật thông tin thành công!");
    } catch (err) {
      console.error("Failed to update member:", err);
      setError(err.response?.data?.message || "Không thể cập nhật thông tin. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setError("");
    try {
      // Lấy householdId từ memberData
      const householdId = memberData?.household?._id || memberData?.household;
      
      if (!householdId) {
        setError("Không tìm thấy thông tin hộ gia đình");
        setIsDeleting(false);
        return;
      }

      await householdAPI.removeMember(householdId, memberId);
      alert("Đã xóa thành viên khỏi hộ thành công");
      navigate(-1);
    } catch (err) {
      console.error("Failed to remove member:", err);
      setError(err.response?.data?.message || "Không thể xóa thành viên. Vui lòng thử lại.");
      setDeleteDialogOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <Backdrop open={true} sx={{ zIndex: 1300, backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
        <CircularProgress />
      </Backdrop>
    );
  }

  if (!memberData) {
    return (
      <Backdrop open={true} sx={{ zIndex: 1300, backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
        <Alert severity="error">{error || "Không tìm thấy thông tin thành viên"}</Alert>
      </Backdrop>
    );
  }

  return (
    <Backdrop open={true} sx={{ zIndex: 1300, backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0px 3px 12px rgba(0, 0, 0, 0.3)",
          padding: "24px 32px",
          maxWidth: "900px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            color: "#666",
            "&:hover": { backgroundColor: "#f5f5f5" }
          }}
        >
          <X size={24} />
        </IconButton>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }} 
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        {/* Header with Avatar and Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, pr: 5 }}>
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
              {memberData.name?.charAt(0) || "?"}
            </Avatar>
            <Box>
              <Typography sx={{ fontSize: "20px", fontWeight: "600", mb: 0.5 }}>
                {memberData.name}
              </Typography>
              <Typography sx={{ fontSize: "14px", color: "#666" }}>
                {memberData.email}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            {!isEditing ? (
              <>
                <Button
                  variant="contained"
                  onClick={handleEdit}
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
                  Chỉnh sửa
                </Button>
                <Button
                  variant="contained"
                  onClick={handleDeleteClick}
                  sx={{
                    backgroundColor: "#ef4444",
                    borderRadius: "8px",
                    textTransform: "none",
                    px: 3,
                    py: 1,
                    fontSize: "14px",
                    fontWeight: "500",
                    "&:hover": { backgroundColor: "#dc2626" }
                  }}
                >
                  Xóa
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={isSaving}
                  sx={{
                    borderRadius: "8px",
                    textTransform: "none",
                    px: 3,
                    py: 1,
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Hủy
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={isSaving}
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
                  {isSaving ? "Đang lưu..." : "Lưu"}
                </Button>
              </>
            )}
          </Box>
        </Box>

        {/* Thông tin cá nhân */}
        <Typography sx={{ fontSize: "18px", fontWeight: "600", mb: 3, color: "#333" }}>
          Thông tin cá nhân
        </Typography>

        <Grid container spacing={3}>
          {/* Họ và tên */}
          <Grid item xs={12} sm={6}>
            {isEditing ? (
              <>
                <Typography sx={{ fontSize: "13px", fontWeight: "500", mb: 1, color: "#555" }}>
                  Họ và tên
                </Typography>
                <TextField
                  fullWidth
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  size="small"
                />
              </>
            ) : (
              <ProfileInfoField label="Họ và tên" value={memberData.name || "Chưa cập nhật"} />
            )}
          </Grid>

          {/* Ngày sinh */}
          <Grid item xs={12} sm={6}>
            {isEditing ? (
              <>
                <Typography sx={{ fontSize: "13px", fontWeight: "500", mb: 1, color: "#555" }}>
                  Ngày sinh
                </Typography>
                <TextField
                  fullWidth
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  size="small"
                />
              </>
            ) : (
              <ProfileInfoField label="Ngày sinh" value={formatDate(memberData.dob)} />
            )}
          </Grid>

          {/* Giới tính */}
          <Grid item xs={12} sm={6}>
            {isEditing ? (
              <>
                <Typography sx={{ fontSize: "13px", fontWeight: "500", mb: 1, color: "#555" }}>
                  Giới tính
                </Typography>
                <TextField
                  fullWidth
                  name="sex"
                  value={formData.sex}
                  onChange={handleInputChange}
                  size="small"
                />
              </>
            ) : (
              <ProfileInfoField label="Giới tính" value={memberData.sex || "Chưa cập nhật"} />
            )}
          </Grid>

          {/* Số định danh cá nhân */}
          <Grid item xs={12} sm={6}>
            <ProfileInfoField label="Số định danh cá nhân" value={memberData.userCardID || "Chưa cập nhật"} />
          </Grid>

          {/* Nghề nghiệp */}
          <Grid item xs={12} sm={6}>
            {isEditing ? (
              <>
                <Typography sx={{ fontSize: "13px", fontWeight: "500", mb: 1, color: "#555" }}>
                  Nghề nghiệp
                </Typography>
                <TextField
                  fullWidth
                  name="job"
                  value={formData.job}
                  onChange={handleInputChange}
                  size="small"
                />
              </>
            ) : (
              <ProfileInfoField label="Nghề nghiệp" value={memberData.job || "Chưa cập nhật"} />
            )}
          </Grid>

          {/* Dân tộc */}
          <Grid item xs={12} sm={6}>
            {isEditing ? (
              <>
                <Typography sx={{ fontSize: "13px", fontWeight: "500", mb: 1, color: "#555" }}>
                  Dân tộc
                </Typography>
                <TextField
                  fullWidth
                  name="ethnic"
                  value={formData.ethnic}
                  onChange={handleInputChange}
                  size="small"
                />
              </>
            ) : (
              <ProfileInfoField label="Dân tộc" value={memberData.ethnic || "Chưa cập nhật"} />
            )}
          </Grid>

          {/* Nơi sinh */}
          <Grid item xs={12} sm={6}>
            {isEditing ? (
              <>
                <Typography sx={{ fontSize: "13px", fontWeight: "500", mb: 1, color: "#555" }}>
                  Nơi sinh
                </Typography>
                <TextField
                  fullWidth
                  name="birthLocation"
                  value={formData.birthLocation}
                  onChange={handleInputChange}
                  size="small"
                />
              </>
            ) : (
              <ProfileInfoField label="Nơi sinh" value={memberData.birthLocation || "Chưa cập nhật"} />
            )}
          </Grid>

          {/* Số điện thoại */}
          <Grid item xs={12} sm={6}>
            {isEditing ? (
              <>
                <Typography sx={{ fontSize: "13px", fontWeight: "500", mb: 1, color: "#555" }}>
                  Số điện thoại
                </Typography>
                <TextField
                  fullWidth
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  size="small"
                />
              </>
            ) : (
              <ProfileInfoField label="Số điện thoại" value={memberData.phoneNumber || "Chưa cập nhật"} />
            )}
          </Grid>

          {/* Email */}
          <Grid item xs={12} sm={6}>
            <ProfileInfoField label="Email" value={memberData.email || "Chưa cập nhật"} />
          </Grid>

          {/* Hộ gia đình */}
          <Grid item xs={12} sm={6}>
            <ProfileInfoField label="Hộ gia đình" value={memberData.household?.houseHoldID || "Chưa cập nhật"} />
          </Grid>

          {/* Quan hệ với chủ hộ */}
          <Grid item xs={12} sm={6}>
            {isEditing ? (
              <>
                <Typography sx={{ fontSize: "13px", fontWeight: "500", mb: 1, color: "#555" }}>
                  Quan hệ với chủ hộ
                </Typography>
                <TextField
                  fullWidth
                  name="relationshipWithHead"
                  value={formData.relationshipWithHead}
                  onChange={handleInputChange}
                  size="small"
                />
              </>
            ) : (
              <ProfileInfoField label="Quan hệ với chủ hộ" value={memberData.relationshipWithHead || "Chưa cập nhật"} />
            )}
          </Grid>

          {/* Trạng thái */}
          <Grid item xs={12} sm={6}>
            <ProfileInfoField label="Trạng thái" value={memberData.status || "Chưa cập nhật"} />
          </Grid>
        </Grid>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleCancelDelete}
          PaperProps={{
            sx: {
              borderRadius: "12px",
              padding: "8px"
            }
          }}
        >
          <DialogTitle sx={{ fontSize: "18px", fontWeight: "600" }}>
            Xác nhận xóa thành viên
          </DialogTitle>
          <DialogContent>
            <Typography>
              Bạn có chắc chắn muốn xóa thành viên <strong>{memberData.name}</strong> không?
            </Typography>
            <Typography sx={{ mt: 2, color: "#d32f2f", fontSize: "14px" }}>
              <strong>Cảnh báo:</strong> Hành động này không thể hoàn tác!
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={handleCancelDelete}
              disabled={isDeleting}
              sx={{
                textTransform: "none",
                color: "#666",
                fontSize: "14px"
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirmDelete}
              variant="contained"
              color="error"
              disabled={isDeleting}
              sx={{
                textTransform: "none",
                fontSize: "14px"
              }}
            >
              {isDeleting ? "Đang xóa..." : "Xác nhận xóa"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Backdrop>
  );
}
