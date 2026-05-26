import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Alert,
  InputAdornment,
} from "@mui/material";
import { Search } from "lucide-react";
import { feeAPI, requestAPI } from "../../../api/apiService";
import FeeTable from "../../../feature/user/FeeTable";
import PaymentDialog from "../../../feature/user/PaymentDialog";

export default function KhoanNop() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [searchText, setSearchText] = useState("");

  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [payLoading, setPayLoading] = useState(false);

  const fetchFees = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await feeAPI.getMyHouseholdFees();
      setFees(data || []);
    } catch (err) {
      const msg = err?.message || err?.customMessage || "Không thể tải danh sách khoản thu.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const filteredFees = useMemo(() => {
    if (!searchText.trim()) return fees;
    const q = searchText.toLowerCase();
    return fees.filter((fee) => fee.name?.toLowerCase().includes(q));
  }, [fees, searchText]);

  const openPayDialog = (fee) => {
    setSelectedFee(fee);
    setPayDialogOpen(true);
    setSuccess(null);
    setError(null);
  };

  const handleSubmitPayment = async ({ amount, note }) => {
    if (!selectedFee) return;
    
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Số tiền không hợp lệ.");
      return;
    }
    
    setPayLoading(true);
    setError(null);
    try {
      await requestAPI.createPayment({
        feeId: selectedFee.feeId || selectedFee._id,
        amount: amount,
        note: note,
      });
      setSuccess("Đã gửi yêu cầu thanh toán. Chờ tổ trưởng duyệt.");
      setPayDialogOpen(false);
      await fetchFees(); // Refresh danh sách khoản thu
    } catch (err) {
      const msg = err?.message || err?.customMessage || "Gửi yêu cầu thất bại.";
      setError(msg);
    } finally {
      setPayLoading(false);
    }
  };

  return (
    <Box sx={{ padding: "24px 32px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography sx={{ fontSize: 26, fontWeight: 600 }}>
          Khoản thu của hộ gia đình
        </Typography>
        <Button 
          variant="contained" 
          onClick={fetchFees}
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
          Làm mới
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          gap: 2,
          backgroundColor: "white",
          padding: "22px",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: "13px", mb: 1 }}>Tìm kiếm</Typography>
          <TextField
            fullWidth
            placeholder="Nhập tên khoản thu..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} color="#777" />
                </InputAdornment>
              ),
              sx: {
                background: "#F1F3F6",
                borderRadius: "8px",
                height: "40px",
                "& .MuiInputBase-input": {
                  padding: "10px 0px",
                },
              },
            }}
          />
        </Box>
      </Box>

      <FeeTable 
        fees={filteredFees} 
        loading={loading} 
        onPayClick={openPayDialog}
      />

      <PaymentDialog
        open={payDialogOpen}
        onClose={() => setPayDialogOpen(false)}
        fee={selectedFee}
        onSubmit={handleSubmitPayment}
        loading={payLoading}
      />
    </Box>
  );
}
