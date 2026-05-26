import { Dialog, DialogContent, DialogActions, Button, Box, Typography, Grid, IconButton } from "@mui/material";
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

const formatDate = (value) => {
  if (!value) return "Chưa cập nhật";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("vi-VN");
};

export default function TamTruVangForm({ open, onClose, request, onApprove, onReject }) {
  if (!request) return null;

  const requester = request.requester || {};
  const data = request.requestData || {};
  const householdId = requester.household?.houseHoldID || requester.household || "Chưa cập nhật";
  const classification =
    request.type === "TEMPORARY_RESIDENCE" ? "Tạm trú" : "Tạm vắng";

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
        <Typography
          sx={{
            fontSize: "20px",
            fontWeight: "600",
            mb: 3,
            color: "#333",
          }}
        >
          Thông tin tạm trú / tạm vắng
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <InfoField label="Chủ hộ" value={requester.name} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoField label="Mã hộ gia đình" value={householdId} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoField label="Phân loại" value={classification} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoField label="Email chủ hộ" value={requester.email} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoField label="Nơi sinh" value={requester.birthLocation} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoField label="Quan hệ với chủ hộ" value={requester.relationshipWithHead} />
          </Grid>
        </Grid>

        {request.type === "TEMPORARY_RESIDENCE" ? (
          <Box sx={{ mt: 3 }}>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: "600",
                mb: 2,
                color: "#333",
              }}
            >
              Thông tin người tạm trú
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <InfoField label="Họ và tên" value={data.name} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoField label="CCCD/ID" value={data.userCardID} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoField label="Ngày sinh" value={formatDate(data.dob)} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoField label="Nghề nghiệp" value={data.job} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoField label="Ngày bắt đầu" value={formatDate(data.startDate)} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoField label="Ngày kết thúc" value={formatDate(data.endDate)} />
              </Grid>
              <Grid item xs={12}>
                <InfoField label="Lý do" value={data.reason} />
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box sx={{ mt: 3 }}>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: "600",
                mb: 2,
                color: "#333",
              }}
            >
              Thông tin tạm vắng
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <InfoField label="Thành viên" value={data.absentUserName || data.absentUserId} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoField label="Từ ngày" value={formatDate(data.fromDate)} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoField label="Đến ngày" value={formatDate(data.toDate)} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoField label="Địa chỉ tạm trú" value={data.temporaryAddress} />
              </Grid>
              <Grid item xs={12}>
                <InfoField label="Lý do" value={data.reason} />
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "flex-end", gap: 2, padding: "16px 32px 24px" }}>
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
