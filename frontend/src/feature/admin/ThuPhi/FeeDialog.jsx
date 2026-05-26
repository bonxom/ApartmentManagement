import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Alert,
  Typography,
  Box,
  IconButton,
  Grid,
} from '@mui/material';
import { X } from 'lucide-react';

function FeeDialog({
  open,
  onClose,
  isEdit,
  formData,
  onChange,
  onSubmit,
  isLoading,
  backendError,
  feeTypes,
  statusTypes,
}) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
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
            {isEdit ? "Cập nhật khoản thu" : "Tạo khoản thu mới"}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {backendError && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => {}}>
            {backendError}
          </Alert>
        )}

        <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
          {/* Tên khoản thu */}
          <Grid item xs={12}>
            <Typography sx={{ fontSize: "14px", fontWeight: "500", mb: 1, color: "#333" }}>
              Tên khoản thu <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              name="name"
              fullWidth
              value={formData.name}
              onChange={onChange}
              required
              placeholder="VD: Phí quản lý chung cư"
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

          {/* Loại khoản thu - chỉ hiện khi tạo mới */}
          {!isEdit && (
            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontSize: "14px", fontWeight: "500", mb: 1, color: "#333" }}>
                Loại khoản thu <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                select
                name="type"
                fullWidth
                value={formData.type}
                onChange={onChange}
                required
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
              >
                {feeTypes.map((t) => (
                  <MenuItem key={t.value} value={t.value}>
                    {t.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          )}

          {/* Số tiền */}
          <Grid item xs={12} sm={6}>
            <Typography sx={{ fontSize: "14px", fontWeight: "500", mb: 1, color: "#333" }}>
              Số tiền (VND) {formData.type === "MANDATORY" && <span style={{ color: "red" }}>*</span>}
            </Typography>
            <TextField
              name="unitPrice"
              fullWidth
              value={formData.unitPrice}
              onChange={onChange}
              disabled={formData.type === "VOLUNTARY"}
              required={formData.type === "MANDATORY"}
              placeholder="VD: 6000"
              helperText={
                formData.type === "MANDATORY"
                  ? "Bắt buộc nhập đơn giá > 0. Tổng phí = Đơn giá × 12 tháng × Số nhân khẩu"
                  : "Không bắt buộc với phí tự nguyện"
              }
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
                },
                "& .MuiFormHelperText-root": {
                  fontSize: "12px",
                  color: "#666",
                  mt: 0.5
                }
              }}
            />
          </Grid>

          {/* Trạng thái - chỉ hiện khi chỉnh sửa */}
          {isEdit && (
            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontSize: "14px", fontWeight: "500", mb: 1, color: "#333" }}>
                Trạng thái
              </Typography>
              <TextField
                select
                name="status"
                fullWidth
                value={formData.status}
                onChange={onChange}
                helperText="Chuyển sang 'Đã hoàn thành' để đóng khoản thu này"
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
                  },
                  "& .MuiFormHelperText-root": {
                    fontSize: "12px",
                    color: "#666",
                    mt: 0.5
                  }
                }}
              >
                {statusTypes.map((s) => (
                  <MenuItem key={s.value} value={s.value}>
                    {s.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          )}

          {/* Mô tả */}
          <Grid item xs={12}>
            <Typography sx={{ fontSize: "14px", fontWeight: "500", mb: 1, color: "#333" }}>
              Mô tả
            </Typography>
            <TextField
              name="description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={onChange}
              placeholder="Mô tả chi tiết về khoản thu này..."
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

      <DialogActions sx={{ px: 3, pb: 2, pt: 2 }}>
        <Button 
          onClick={onClose}
          sx={{
            textTransform: "none",
            color: "#666",
            fontSize: "14px",
            px: 3,
            py: 1
          }}
        >
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={isLoading}
          sx={{
            textTransform: "none",
            fontSize: "14px",
            px: 3,
            py: 1,
            backgroundColor: "#2D66F5",
            "&:hover": { backgroundColor: "#1E54D4" }
          }}
        >
          {isLoading ? "Đang lưu..." : isEdit ? "Cập nhật" : "Tạo mới"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default FeeDialog;
