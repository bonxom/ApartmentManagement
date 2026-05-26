import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  Backdrop,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { X } from "lucide-react";
import { userAPI, householdAPI } from "../../../api/apiService";
import ProfileInfoField from "../../../feature/profile/ProfileInfoField";

export default function ThongTinNguoiTamVang() {
  const location = useLocation();
  const navigate = useNavigate();
  const tamVangData = location.state?.tamVangData;
  const householdId = location.state?.householdId;

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [residentHistory, setResidentHistory] = useState(null);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [endDate, setEndDate] = useState("");
  const [isCompleting, setIsCompleting] = useState(false);

  // Form data for editing - chỉ các trường tạm vắng
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    reason: "",
    temporaryAddress: "",
  });

  useEffect(() => {
    if (!tamVangData) {
      setError("Không tìm thấy thông tin người tạm vắng");
      return;
    }

    // Initialize form data với các trường tạm vắng
    setFormData({
      startDate: tamVangData.startDate ? new Date(tamVangData.startDate).toISOString().split("T")[0] : "",
      endDate: tamVangData.endDate ? new Date(tamVangData.endDate).toISOString().split("T")[0] : "",
      reason: tamVangData.reason || "",
      temporaryAddress: tamVangData.temporaryAddress || "",
    });

    // Nếu có userId, fetch thêm thông tin user
    if (tamVangData.userId) {
      fetchUserData();
    }

    // Fetch resident history if householdId is available
    if (householdId) {
      fetchResidentHistory();
    }
  }, [tamVangData, householdId]);

  const fetchUserData = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await userAPI.getById(tamVangData.userId);
      setUserData(data);
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      // Không set error vì có thể vẫn hiển thị được thông tin từ tamVangData
    } finally {
      setLoading(false);
    }
  };

  const fetchResidentHistory = async () => {
    if (!householdId) return;
    try {
      const response = await householdAPI.getTamTruVangDetails(householdId);
      setResidentHistory(response.temporaryHistory);
    } catch (err) {
      console.error("Failed to fetch resident history:", err);
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
      startDate: tamVangData.startDate ? new Date(tamVangData.startDate).toISOString().split("T")[0] : "",
      endDate: tamVangData.endDate ? new Date(tamVangData.endDate).toISOString().split("T")[0] : "",
      reason: tamVangData.reason || "",
      temporaryAddress: tamVangData.temporaryAddress || "",
    });
  };

  const handleSave = async () => {
    if (!householdId || !residentHistory) {
      setError("Không tìm thấy thông tin hộ gia đình");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      // Tìm và cập nhật item trong temporaryAbsent
      // Convert _id to string for comparison
      const targetId = tamVangData._id?.toString();
      const updatedTemporaryAbsent = (residentHistory.temporaryAbsent || []).map((absent) => {
        const absentId = absent._id?.toString();
        if (absentId === targetId) {
          return {
            ...absent,
            startDate: formData.startDate ? new Date(formData.startDate).toISOString() : absent.startDate,
            endDate: formData.endDate ? new Date(formData.endDate).toISOString() : absent.endDate,
            reason: formData.reason,
            temporaryAddress: formData.temporaryAddress,
          };
        }
        return absent;
      });

      // Update resident history
      await householdAPI.updateResidentHistory(householdId, {
        temporaryResidents: residentHistory.temporaryResidents || [],
        temporaryAbsents: updatedTemporaryAbsent,
      });

      alert("Cập nhật thông tin thành công!");
      setIsEditing(false);
      // Refresh data by navigating back and forward
      navigate(-1);
      navigate("/leader/ChiTietTamTruVangAdmin", {
        state: { householdId: householdId },
        replace: true,
      });
    } catch (err) {
      console.error("Failed to update resident:", err);
      setError(err.response?.data?.message || "Không thể cập nhật thông tin. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCompleteClick = () => {
    const currentEndDate = tamVangData.endDate
      ? new Date(tamVangData.endDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];
    setEndDate(currentEndDate);
    setCompleteDialogOpen(true);
  };

  const handleCompleteConfirm = async () => {
    if (!householdId || !residentHistory) {
      setError("Không tìm thấy thông tin hộ gia đình");
      return;
    }

    setIsCompleting(true);
    setError("");

    try {
      const recordId = tamVangData._id?.toString();
      const currentEndDate = tamVangData.endDate
        ? new Date(tamVangData.endDate).toISOString().split("T")[0]
        : null;
      const newEndDate = endDate;

      // Nếu ngày kết thúc thay đổi, cập nhật trước
      if (currentEndDate !== newEndDate) {
        const updatedTemporaryAbsent = (residentHistory.temporaryAbsent || []).map(
          (absent) => {
            const absentId = absent._id?.toString();
            if (absentId === recordId) {
              return {
                ...absent,
                endDate: new Date(newEndDate).toISOString(),
              };
            }
            return absent;
          }
        );

        await householdAPI.updateResidentHistory(householdId, {
          temporaryResidents: residentHistory.temporaryResidents || [],
          temporaryAbsents: updatedTemporaryAbsent,
        });
      }

      // Sau đó đánh dấu kết thúc
      await householdAPI.completeResidentHistory(householdId, {
        recordType: "temporaryAbsent",
        recordId: recordId,
      });

      alert("Đã kết thúc tạm vắng thành công!");
      setCompleteDialogOpen(false);
      // Refresh data by navigating back and forward
      navigate(-1);
      navigate("/leader/ChiTietTamTruVangAdmin", {
        state: { householdId: householdId },
        replace: true,
      });
    } catch (err) {
      console.error("Failed to complete:", err);
      setError(
        err.response?.data?.message ||
          "Không thể kết thúc tạm vắng. Vui lòng thử lại."
      );
    } finally {
      setIsCompleting(false);
    }
  };

  const handleCompleteCancel = () => {
    setCompleteDialogOpen(false);
    setEndDate("");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  if (loading && !tamVangData) {
    return (
      <Backdrop open={true} sx={{ zIndex: 1300, backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
        <CircularProgress />
      </Backdrop>
    );
  }

  if (!tamVangData) {
    return (
      <Backdrop open={true} sx={{ zIndex: 1300, backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
        <Alert severity="error">{error || "Không tìm thấy thông tin người tạm vắng"}</Alert>
      </Backdrop>
    );
  }

  // Kết hợp dữ liệu từ tamVangData và userData
  // Ưu tiên userData nếu có, vì nó được fetch trực tiếp từ API
  const getDisplayValue = (userValue, tamVangValue) => {
    if (userValue) return userValue;
    if (tamVangValue && tamVangValue !== "N/A") return tamVangValue;
    return "Chưa cập nhật";
  };

  const displayData = {
    name: getDisplayValue(userData?.name, tamVangData.name),
    userCardID: getDisplayValue(userData?.userCardID, tamVangData.userCardID),
    email: userData?.email || "Chưa cập nhật",
    dob: userData?.dob || "Chưa cập nhật",
    sex: userData?.sex || "Chưa cập nhật",
    birthLocation: userData?.birthLocation || "Chưa cập nhật",
    ethnic: userData?.ethnic || "Chưa cập nhật",
    job: userData?.job || "Chưa cập nhật",
    phoneNumber: userData?.phoneNumber || "Chưa cập nhật",
    relationshipWithHead: userData?.relationshipWithHead || "Chưa cập nhật",
    household: userData?.household || null,
    status: userData?.status || "Chưa cập nhật",
    // Thông tin tạm vắng - dùng formData nếu đang edit, nếu không dùng tamVangData
    startDate: isEditing ? formData.startDate : tamVangData.startDate,
    endDate: isEditing ? formData.endDate : tamVangData.endDate,
    reason: isEditing ? formData.reason : (tamVangData.reason || "Chưa cập nhật"),
    temporaryAddress: isEditing ? formData.temporaryAddress : (tamVangData.temporaryAddress || "Chưa cập nhật"),
  };

  return (
    <Backdrop open={true} sx={{ zIndex: 1300, backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
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
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
        >
          <X size={24} />
        </IconButton>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
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
                bgcolor: "#FFE5E5",
                fontSize: "24px",
                fontWeight: "600",
              }}
            >
              {displayData.name?.charAt(0) || "?"}
            </Avatar>
            <Box>
              <Typography sx={{ fontSize: "20px", fontWeight: "600", mb: 0.5 }}>
                {displayData.name}
              </Typography>
              <Typography sx={{ fontSize: "14px", color: "#666" }}>
                Người tạm vắng
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
                    "&:hover": { backgroundColor: "#1E54D4" },
                  }}
                >
                  Chỉnh sửa
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  disabled={tamVangData?.isActive === false}
                  onClick={handleCompleteClick}
                  sx={{
                    borderRadius: "8px",
                    textTransform: "none",
                    px: 3,
                    py: 1,
                    fontSize: "14px",
                    fontWeight: "500",
                    ...(tamVangData?.isActive === false && {
                      backgroundColor: "#9e9e9e",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "#9e9e9e",
                      },
                    }),
                  }}
                >
                  Kết thúc tạm vắng
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
                    "&:hover": { backgroundColor: "#1E54D4" },
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
            <ProfileInfoField label="Họ và tên" value={displayData.name} />
          </Grid>

          {/* Số định danh cá nhân */}
          <Grid item xs={12} sm={6}>
            <ProfileInfoField label="Số định danh cá nhân (CCCD)" value={displayData.userCardID} />
          </Grid>

          {/* Ngày sinh */}
          <Grid item xs={12} sm={6}>
            <ProfileInfoField label="Ngày sinh" value={formatDate(displayData.dob)} />
          </Grid>

          {/* Giới tính */}
          <Grid item xs={12} sm={6}>
            <ProfileInfoField label="Giới tính" value={displayData.sex} />
          </Grid>

          {/* Nơi sinh */}
          <Grid item xs={12} sm={6}>
            <ProfileInfoField label="Nơi sinh" value={displayData.birthLocation} />
          </Grid>

          {/* Dân tộc */}
          <Grid item xs={12} sm={6}>
            <ProfileInfoField label="Dân tộc" value={displayData.ethnic} />
          </Grid>

          {/* Nghề nghiệp */}
          <Grid item xs={12} sm={6}>
            <ProfileInfoField label="Nghề nghiệp" value={displayData.job} />
          </Grid>

          {/* Số điện thoại */}
          <Grid item xs={12} sm={6}>
            <ProfileInfoField label="Số điện thoại" value={displayData.phoneNumber} />
          </Grid>

          {/* Email */}
          <Grid item xs={12} sm={6}>
            <ProfileInfoField label="Email" value={displayData.email} />
          </Grid>

          {/* Hộ gia đình */}
          <Grid item xs={12} sm={6}>
            <ProfileInfoField
              label="Hộ gia đình"
              value={displayData.household?.houseHoldID || "Chưa cập nhật"}
            />
          </Grid>

          {/* Quan hệ với chủ hộ */}
          <Grid item xs={12} sm={6}>
            <ProfileInfoField label="Quan hệ với chủ hộ" value={displayData.relationshipWithHead} />
          </Grid>

          {/* Trạng thái */}
          <Grid item xs={12} sm={6}>
            <ProfileInfoField label="Trạng thái" value={displayData.status} />
          </Grid>
        </Grid>

        {/* Thông tin tạm vắng */}
        <Typography
          sx={{ fontSize: "18px", fontWeight: "600", mb: 3, mt: 4, color: "#333" }}
        >
          Thông tin tạm vắng
        </Typography>

        <Grid container spacing={3}>
          {/* Từ ngày */}
          <Grid item xs={12} sm={6}>
            {isEditing ? (
              <>
                <Typography sx={{ fontSize: "13px", fontWeight: "500", mb: 1, color: "#555" }}>
                  Từ ngày
                </Typography>
                <TextField
                  fullWidth
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  size="small"
                />
              </>
            ) : (
              <ProfileInfoField label="Từ ngày" value={formatDate(displayData.startDate)} />
            )}
          </Grid>

          {/* Đến ngày */}
          <Grid item xs={12} sm={6}>
            {isEditing ? (
              <>
                <Typography sx={{ fontSize: "13px", fontWeight: "500", mb: 1, color: "#555" }}>
                  Đến ngày
                </Typography>
                <TextField
                  fullWidth
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  size="small"
                />
              </>
            ) : (
              <ProfileInfoField label="Đến ngày" value={formatDate(displayData.endDate)} />
            )}
          </Grid>

          {/* Lý do tạm vắng */}
          <Grid item xs={12}>
            {isEditing ? (
              <>
                <Typography sx={{ fontSize: "13px", fontWeight: "500", mb: 1, color: "#555" }}>
                  Lý do tạm vắng
                </Typography>
                <TextField
                  fullWidth
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  size="small"
                  multiline
                  rows={3}
                />
              </>
            ) : (
              <ProfileInfoField label="Lý do tạm vắng" value={displayData.reason} />
            )}
          </Grid>

          {/* Địa chỉ tạm trú */}
          <Grid item xs={12}>
            {isEditing ? (
              <>
                <Typography sx={{ fontSize: "13px", fontWeight: "500", mb: 1, color: "#555" }}>
                  Địa chỉ tạm trú
                </Typography>
                <TextField
                  fullWidth
                  name="temporaryAddress"
                  value={formData.temporaryAddress}
                  onChange={handleInputChange}
                  size="small"
                  multiline
                  rows={3}
                />
              </>
            ) : (
              <ProfileInfoField label="Địa chỉ tạm trú" value={displayData.temporaryAddress} />
            )}
          </Grid>
        </Grid>

        {/* Dialog xác nhận kết thúc */}
        <Dialog
          open={completeDialogOpen}
          onClose={handleCompleteCancel}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: "12px",
              padding: "8px",
            },
          }}
        >
          <DialogTitle sx={{ fontSize: "18px", fontWeight: "600" }}>
            Xác nhận kết thúc tạm vắng
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              Bạn có chắc chắn muốn kết thúc tạm vắng cho{" "}
              <strong>{displayData.name}</strong>?
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ fontSize: "13px", fontWeight: "500", mb: 1, color: "#555" }}>
                Ngày kết thúc
              </Typography>
              <TextField
                fullWidth
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={handleCompleteCancel}
              disabled={isCompleting}
              sx={{
                textTransform: "none",
                color: "#666",
                fontSize: "14px",
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleCompleteConfirm}
              variant="contained"
              color="error"
              disabled={isCompleting || !endDate}
              sx={{
                textTransform: "none",
                fontSize: "14px",
              }}
            >
              {isCompleting ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Backdrop>
  );
}
