import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Grid,
} from "@mui/material";
import FeeInfoField from "./FeeInfoField";

export default function PaymentDialog({ open, onClose, fee, onSubmit, loading }) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (open && fee) {
      const remaining = fee.remainingAmount ?? fee.remaining ?? "";
      setAmount(remaining > 0 ? remaining.toString() : "");
      setNote("");
    }
  }, [open, fee]);

  const handleSubmit = () => {
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      return;
    }
    onSubmit({ amount: value, note: note || undefined });
  };

  if (!fee) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontSize: "20px", fontWeight: "600" }}>
        Gửi yêu cầu thanh toán
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          {/* Thông tin khoản thu */}
          <Grid item xs={12}>
            <FeeInfoField label="Tên khoản thu" value={fee.name} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FeeInfoField 
              label="Loại khoản thu" 
              value={fee.type === "MANDATORY" ? "Bắt buộc" : "Tự nguyện"} 
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FeeInfoField 
              label="Định mức" 
              value={fee.requiredAmount ? fee.requiredAmount.toLocaleString() + " VND" : "-"} 
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FeeInfoField 
              label="Đã nộp" 
              value={fee.paidAmount ? fee.paidAmount.toLocaleString() + " VND" : "0 VND"} 
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FeeInfoField 
              label="Còn thiếu" 
              value={fee.remainingAmount ? fee.remainingAmount.toLocaleString() + " VND" : "0 VND"} 
            />
          </Grid>

          {/* Form nhập thông tin thanh toán */}
          <Grid item xs={12}>
            <TextField
              label="Số tiền muốn nộp"
              value={amount}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "" || /^\d*$/.test(v)) setAmount(v);
              }}
              fullWidth
              size="small"
              InputProps={{ endAdornment: <span style={{ color: "#666", fontSize: 12 }}>VND</span> }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Ghi chú (tuỳ chọn)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              fullWidth
              size="small"
              multiline
              minRows={3}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
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
          onClick={handleSubmit} 
          disabled={loading || !amount || Number(amount) <= 0}
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
          {loading ? <CircularProgress size={20} /> : "Gửi yêu cầu"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
