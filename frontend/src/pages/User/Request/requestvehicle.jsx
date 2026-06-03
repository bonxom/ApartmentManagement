import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Send, Car } from "lucide-react";
import { requestAPI } from "../../../api/apiService";

export default function RequestVehicle() {
  const [vehicleType, setVehicleType] = useState("Xe máy");
  const [licensePlate, setLicensePlate] = useState("");
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!licensePlate.trim() || !brand.trim() || !color.trim()) {
      setError("Vui lòng nhập đầy đủ các thông tin chi tiết xe.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await requestAPI.createVehicleRegistration({
        vehicleType,
        licensePlate: licensePlate.trim().toUpperCase(),
        brand: brand.trim(),
        color: color.trim(),
      });
      setSuccess(true);
      setLicensePlate("");
      setBrand("");
      setColor("");
    } catch (err) {
      setError(err?.message || "Đăng ký xe thất bại, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: "700px", margin: "0 auto" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: "12px",
            backgroundColor: "primary.light",
            color: "primary.main",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Car size={24} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Đăng ký gửi xe chung cư
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Đăng ký phương tiện giao thông và xin cấp thẻ gửi xe chung cư định kỳ.
          </Typography>
        </Box>
      </Box>

      <Card sx={{ boxShadow: "0 8px 24px rgba(0,0,0,0.05)" }}>
        <CardContent sx={{ p: 4 }}>
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Đăng ký gửi xe thành công! Yêu cầu cấp thẻ gửi xe của bạn đang ở trạng thái chờ duyệt.
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
                  Loại phương tiện
                </Typography>
                <TextField
                  select
                  fullWidth
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  disabled={loading}
                >
                  <MenuItem value="Xe máy">Xe máy (100,000 đ/tháng)</MenuItem>
                  <MenuItem value="Ô tô">Ô tô (1,200,000 đ/tháng)</MenuItem>
                  <MenuItem value="Xe đạp điện">Xe đạp điện/Xe máy điện (50,000 đ/tháng)</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
                  Biển số xe <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Ví dụ: 29-G1 888.88"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
                  Hãng xe/Nhãn hiệu <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Ví dụ: Honda SH, Mazda 3..."
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
                  Màu sắc xe <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Ví dụ: Đen, Trắng đỏ..."
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Send size={16} />}
                  sx={{
                    px: 4,
                    py: 1.2,
                    fontSize: "14px",
                    fontWeight: 600,
                    borderRadius: "8px",
                  }}
                >
                  {loading ? "Đang gửi..." : "Gửi yêu cầu đăng ký"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
