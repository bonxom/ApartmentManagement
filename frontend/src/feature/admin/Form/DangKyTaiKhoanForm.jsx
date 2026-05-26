import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  IconButton,
} from "@mui/material";
import { X } from "lucide-react";

function InfoField({ label, value }) {
  return (
    <Box>
      <Typography
        sx={{
          fontSize: "13px",
          fontWeight: "500",
          mb: 1,
          color: "#666",
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: "15px",
          fontWeight: "400",
          color: "#333",
          backgroundColor: "#F5F7FA",
          padding: "12px 14px",
          borderRadius: "8px",
        }}
      >
        {value || "Chưa cập nhật"}
      </Typography>
    </Box>
  );
}

export default function DangKyTaiKhoanForm({
  open,
  onClose,
  request,
  onApprove,
  onReject,
}) {
  if (!request) return null;

  const requester = request.requester || {};
  const requestData = request.requestData || {};

  const householdId = requester.household?.houseHoldID || requester.household || "Chưa cập nhật";
  const roleName = requester.role?.role_name || "MEMBER";
  const dobDisplay = requester.dob
    ? new Date(requester.dob).toLocaleDateString("vi-VN")
    : "Chưa cập nhật";

  const labelMap = {
    name: "Họ và tên",
    dob: "Ngày sinh",
    sex: "Giới tính",
    birthLocation: "Nơi sinh",
    ethnic: "Dân tộc",
    job: "Nghề nghiệp",
    relationshipWithHead: "Quan hệ với chủ hộ",
    email: "Email",
    phoneNumber: "Số điện thoại",
  };
  const updateFields = Object.entries(requestData).filter(([key]) => key !== "reason");
  const reason = requestData?.reason;
  const title =
    request.type === "UPDATE_INFO"
      ? "Yêu cầu cập nhật tài khoản"
      : "Thông tin đăng ký tài khoản";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          boxShadow: "0px 3px 12px rgba(0, 0, 0, 0.08)",
        },
      }}
    >
      <DialogContent sx={{ padding: "24px 32px", position: "relative" }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "#666",
          }}
        >
          <X size={20} />
        </IconButton>
        {/* Title */}
        <Typography
          sx={{
            fontSize: "20px",
            fontWeight: "600",
            mb: 3,
            color: "#333",
          }}
        >
          {title}
        </Typography>

        {/* Form Fields */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <InfoField label="Họ và tên" value={requester.name} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoField label="Vai trò" value={roleName} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoField label="Mã hộ gia đình" value={householdId} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoField label="Email" value={requester.email} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoField label="Ngày sinh" value={dobDisplay} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoField label="Giới tính" value={requester.sex} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoField label="CCCD/ID" value={requester.userCardID} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoField label="Số điện thoại" value={requester.phoneNumber} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoField label="Nghề nghiệp" value={requester.job} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoField label="Dân tộc" value={requester.ethnic} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoField label="Nơi sinh" value={requester.birthLocation} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoField label="Quan hệ với chủ hộ" value={requester.relationshipWithHead} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoField label="Trạng thái tài khoản" value={requester.status} />
          </Grid>
        </Grid>

        {request.type === "UPDATE_INFO" && (
          <Box sx={{ mt: 3 }}>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: "600",
                mb: 2,
                color: "#333",
              }}
            >
              Thông tin yêu cầu cập nhật
            </Typography>
            <Grid container spacing={3}>
              {updateFields.length === 0 ? (
                <Grid item xs={12}>
                  <InfoField label="Không có dữ liệu cập nhật" value="" />
                </Grid>
              ) : (
                updateFields.map(([key, value]) => (
                  <Grid item xs={12} sm={6} key={key}>
                    <InfoField label={labelMap[key] || key} value={value} />
                  </Grid>
                ))
              )}
              {reason && (
                <Grid item xs={12}>
                  <InfoField label="Lý do yêu cầu" value={reason} />
                </Grid>
              )}
            </Grid>
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{ justifyContent: "flex-end", gap: 2, padding: "16px 32px 24px" }}
      >
        <Button
          variant="contained"
          onClick={onApprove}
          sx={{
            minWidth: "140px",
            textTransform: "none",
            backgroundColor: "#a9f5c0",
            color: "#10b981",
            fontWeight: 600,
            borderRadius: "8px",
            py: 1.2,
            fontSize: "15px",
            "&:hover": {
              backgroundColor: "#8de4a8",
            },
          }}
        >
          Phê duyệt
        </Button>
        <Button
          variant="contained"
          onClick={onReject}
          sx={{
            minWidth: "140px",
            textTransform: "none",
            backgroundColor: "#ffcb8a",
            color: "#f97316",
            fontWeight: 600,
            borderRadius: "8px",
            py: 1.2,
            fontSize: "15px",
            "&:hover": {
              backgroundColor: "#fdb863",
            },
          }}
        >
          Không phê duyệt
        </Button>
      </DialogActions>
    </Dialog>
  );
}
