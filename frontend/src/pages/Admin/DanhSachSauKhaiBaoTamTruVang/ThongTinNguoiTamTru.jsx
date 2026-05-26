import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  CircularProgress,
  Alert,
  Backdrop,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { X } from "lucide-react";
import { householdAPI } from "../../../api/apiService";
import ProfileInfoField from "../../../feature/profile/ProfileInfoField";

export default function ThongTinNguoiTamTru() {
  const location = useLocation();
  const navigate = useNavigate();
  const tamTruData = location.state?.tamTruData;
  const householdId = location.state?.householdId;

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [residentHistory, setResidentHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [endDate, setEndDate] = useState("");
  const [isCompleting, setIsCompleting] = useState(false);

  // Form data for editing
  const [formData, setFormData] = useState({
    name: "",
    userCardID: "",
    dob: "",
    sex: "",
    birthLocation: "",
    ethnic: "",
    job: "",
    phoneNumber: "",
    permanentAddress: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  useEffect(() => {
    if (!tamTruData) {
      return;
    }

    // Initialize form data
    setFormData({
      name: tamTruData.name || "",
      userCardID: tamTruData.userCardID || "",
      dob: tamTruData.dob ? new Date(tamTruData.dob).toISOString().split("T")[0] : "",
      sex: tamTruData.sex || "",
      birthLocation: tamTruData.birthLocation || "",
      ethnic: tamTruData.ethnic || "",
      job: tamTruData.job || "",
      phoneNumber: tamTruData.phoneNumber || "",
      permanentAddress: tamTruData.permanentAddress || "", 
      startDate: tamTruData.startDate ? new Date(tamTruData.startDate).toISOString().split("T")[0] : "",
      endDate: tamTruData.endDate ? new Date(tamTruData.endDate).toISOString().split("T")[0] : "",
      reason: tamTruData.reason || "",
    });

    // Fetch resident history if householdId is available
    if (householdId) {
      fetchResidentHistory();
    }
  }, [tamTruData, householdId]);

  const fetchResidentHistory = async () => {
    if (!householdId) return;
    setLoading(true);
    try {
      const response = await householdAPI.getTamTruVangDetails(householdId);
      setResidentHistory(response.temporaryHistory);
    } catch (err) {
      console.error("Failed to fetch resident history:", err);
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
      name: tamTruData.name || "",
      userCardID: tamTruData.userCardID || "",
      dob: tamTruData.dob ? new Date(tamTruData.dob).toISOString().split("T")[0] : "",
      sex: tamTruData.sex || "",
      birthLocation: tamTruData.birthLocation || "",
      ethnic: tamTruData.ethnic || "",
      job: tamTruData.job || "",
      phoneNumber: tamTruData.phoneNumber || "",
      permanentAddress: tamTruData.permanentAddress || "",
      startDate: tamTruData.startDate ? new Date(tamTruData.startDate).toISOString().split("T")[0] : "",
      endDate: tamTruData.endDate ? new Date(tamTruData.endDate).toISOString().split("T")[0] : "",
      reason: tamTruData.reason || "",
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
      // Tìm và cập nhật item trong temporaryResidents
      // Convert _id to string for comparison
      const targetId = tamTruData._id?.toString();
      const updatedTemporaryResidents = residentHistory.temporaryResidents.map((resident) => {
        const residentId = resident._id?.toString();
        if (residentId === targetId) {
          return {
            ...resident,
            name: formData.name,
            userCardID: formData.userCardID,
            dob: formData.dob ? new Date(formData.dob).toISOString() : resident.dob,
            sex: formData.sex,
            birthLocation: formData.birthLocation,
            ethnic: formData.ethnic,
            job: formData.job,
            phoneNumber: formData.phoneNumber,
            permanentAddress: formData.permanentAddress,
            startDate: formData.startDate ? new Date(formData.startDate).toISOString() : resident.startDate,
            endDate: formData.endDate ? new Date(formData.endDate).toISOString() : resident.endDate,
            reason: formData.reason,
          };
        }
        return resident;
      });

      // Update resident history
      await householdAPI.updateResidentHistory(householdId, {
        temporaryResidents: updatedTemporaryResidents,
        temporaryAbsents: residentHistory.temporaryAbsent || [],
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
    const currentEndDate = tamTruData.endDate
      ? new Date(tamTruData.endDate).toISOString().split("T")[0]
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
      const recordId = tamTruData._id?.toString();
      const currentEndDate = tamTruData.endDate
        ? new Date(tamTruData.endDate).toISOString().split("T")[0]
        : null;
      const newEndDate = endDate;

      // Nếu ngày kết thúc thay đổi, cập nhật trước
      if (currentEndDate !== newEndDate) {
        const updatedTemporaryResidents = residentHistory.temporaryResidents.map(
          (resident) => {
            const residentId = resident._id?.toString();
            if (residentId === recordId) {
              return {
                ...resident,
                endDate: new Date(newEndDate).toISOString(),
              };
            }
            return resident;
          }
        );

        await householdAPI.updateResidentHistory(householdId, {
          temporaryResidents: updatedTemporaryResidents,
          temporaryAbsents: residentHistory.temporaryAbsent || [],
        });
      }

      // Sau đó đánh dấu kết thúc
      await householdAPI.completeResidentHistory(householdId, {
        recordType: "temporaryResident",
        recordId: recordId,
      });

      alert("Đã kết thúc tạm trú thành công!");
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
          "Không thể kết thúc tạm trú. Vui lòng thử lại."
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

  if (!tamTruData) {
    return (
      <Backdrop open={true} sx={{ zIndex: 1300, backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
        <Alert severity="error">Không tìm thấy thông tin người tạm trú</Alert>
      </Backdrop>
    );
  }

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
                bgcolor: "#E3F2FD",
                fontSize: "24px",
                fontWeight: "600",
              }}
            >
              {formData.name?.charAt(0) || tamTruData.name?.charAt(0) || "?"}
            </Avatar>
            <Box>
              <Typography sx={{ fontSize: "20px", fontWeight: "600", mb: 0.5 }}>
                {formData.name || tamTruData.name || "Chưa cập nhật"}
              </Typography>
              <Typography sx={{ fontSize: "14px", color: "#666" }}>
                Người tạm trú
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
                  disabled={tamTruData?.isActive === false}
                  onClick={handleCompleteClick}
                  sx={{
                    borderRadius: "8px",
                    textTransform: "none",
                    px: 3,
                    py: 1,
                    fontSize: "14px",
                    fontWeight: "500",
                    ...(tamTruData?.isActive === false && {
                      backgroundColor: "#9e9e9e",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "#9e9e9e",
                      },
                    }),
                  }}
                >
                  Kết thúc tạm trú
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
              <ProfileInfoField label="Họ và tên" value={tamTruData.name || "Chưa cập nhật"} />
            )}
          </Grid>

          {/* Số định danh cá nhân (CCCD) */}
          <Grid item xs={12} sm={6}>
            {isEditing ? (
              <>
                <Typography sx={{ fontSize: "13px", fontWeight: "500", mb: 1, color: "#555" }}>
                  Số định danh cá nhân (CCCD)
                </Typography>
                <TextField
                  fullWidth
                  name="userCardID"
                  value={formData.userCardID}
                  onChange={handleInputChange}
                  size="small"
                />
              </>
            ) : (
              <ProfileInfoField
                label="Số định danh cá nhân (CCCD)"
                value={tamTruData.userCardID || "Chưa cập nhật"}
              />
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
              <ProfileInfoField label="Ngày sinh" value={formatDate(tamTruData.dob)} />
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
              <ProfileInfoField label="Giới tính" value={tamTruData.sex || "Chưa cập nhật"} />
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
              <ProfileInfoField
                label="Nơi sinh"
                value={tamTruData.birthLocation || "Chưa cập nhật"}
              />
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
              <ProfileInfoField label="Dân tộc" value={tamTruData.ethnic || "Chưa cập nhật"} />
            )}
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
              <ProfileInfoField label="Nghề nghiệp" value={tamTruData.job || "Chưa cập nhật"} />
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
              <ProfileInfoField
                label="Số điện thoại"
                value={tamTruData.phoneNumber || "Chưa cập nhật"}
              />
            )}
          </Grid>
        </Grid>

        {/* Thông tin tạm trú */}
        <Typography
          sx={{ fontSize: "18px", fontWeight: "600", mb: 3, mt: 4, color: "#333" }}
        >
          Thông tin tạm trú
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
              <ProfileInfoField label="Từ ngày" value={formatDate(tamTruData.startDate)} />
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
              <ProfileInfoField label="Đến ngày" value={formatDate(tamTruData.endDate)} />
            )}
          </Grid>

          {/* Địa chỉ thường trú */}
          <Grid item xs={12}>
            {isEditing ? (
              <>
                <Typography sx={{ fontSize: "13px", fontWeight: "500", mb: 1, color: "#555" }}>
                  Địa chỉ thường trú
                </Typography>
                <TextField
                  fullWidth
                  name="permanentAddress"
                  value={formData.permanentAddress}
                  onChange={handleInputChange}
                  size="small"
                  multiline
                  rows={3}
                />
              </>
            ) : (
              <ProfileInfoField
                label="Địa chỉ thường trú"
                value={tamTruData.permanentAddress || "Chưa cập nhật"}
              />
            )}
          </Grid>

          {/* Lý do tạm trú */}
          <Grid item xs={12}>
            {isEditing ? (
              <>
                <Typography sx={{ fontSize: "13px", fontWeight: "500", mb: 1, color: "#555" }}>
                  Lý do tạm trú
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
              <ProfileInfoField label="Lý do tạm trú" value={tamTruData.reason || "Chưa cập nhật"} />
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
            Xác nhận kết thúc tạm trú
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              Bạn có chắc chắn muốn kết thúc tạm trú cho{" "}
              <strong>{tamTruData.name}</strong>?
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
