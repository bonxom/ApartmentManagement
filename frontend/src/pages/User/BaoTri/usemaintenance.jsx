import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  Divider,
} from "@mui/material";
import { Wrench, Calendar, Info } from "lucide-react";
import { maintenanceAPI } from "../../../api/apiService";

export default function UserMaintenanceView() {
  const [maintenances, setMaintenances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMaintenances = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await maintenanceAPI.getAll();
      // Filter out CANCELLED maintenance from resident view for clean display
      const activeList = (data || []).filter((m) => m.status !== "CANCELLED");
      setMaintenances(activeList);
    } catch (err) {
      setError(err?.message || "Không thể tải lịch trình bảo trì của tòa nhà");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenances();
  }, []);

  const getStatusChip = (s) => {
    const map = {
      PENDING: { label: "Chờ thực hiện", color: "warning" },
      IN_PROGRESS: { label: "Đang tiến hành", color: "info" },
      COMPLETED: { label: "Đã hoàn thành", color: "success" },
    };
    const { label, color } = map[s] || { label: s || "N/A", color: "default" };
    return <Chip size="small" label={label} color={color} sx={{ fontWeight: 600 }} />;
  };

  const formatDate = (val) => {
    if (!val) return "—";
    return new Date(val).toLocaleDateString("vi-VN");
  };

  return (
    <Box sx={{ p: 4, maxWidth: "900px", margin: "0 auto" }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
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
          <Wrench size={24} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Lịch bảo trì & Vận hành thiết bị
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Xem lịch bảo dưỡng, sửa chữa thang máy, điện, nước và các tiện ích công cộng của tòa nhà.
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {maintenances.length === 0 ? (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: "center", backgroundColor: "background.paper" }}>
                <Info size={40} style={{ color: "#94a3b8", marginBottom: "12px" }} />
                <Typography variant="body1" sx={{ color: "text.secondary" }}>
                  Hiện tại không có lịch bảo trì nào được lên lịch trong tòa nhà.
                </Typography>
              </Paper>
            </Grid>
          ) : (
            maintenances.map((m) => (
              <Grid item xs={12} key={m._id}>
                <Card
                  sx={{
                    borderLeft: "5px solid",
                    borderColor:
                      m.status === "IN_PROGRESS"
                        ? "info.main"
                        : m.status === "COMPLETED"
                        ? "success.main"
                        : "warning.main",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                        gap: 2,
                        mb: 1.5,
                      }}
                    >
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "17px" }}>
                          {m.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          Thiết bị / Khu vực: <span style={{ fontWeight: 600, color: "#1e293b" }}>{m.facilityName}</span>
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        {getStatusChip(m.status)}
                      </Box>
                    </Box>

                    <Divider sx={{ my: 1.5 }} />

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary", mb: 1.5 }}>
                      <Calendar size={16} />
                      <Typography variant="body2">
                        Thời gian dự kiến:{" "}
                        <span style={{ fontWeight: 600, color: "#1e293b" }}>
                          {formatDate(m.startDate)} - {formatDate(m.endDate)}
                        </span>
                      </Typography>
                    </Box>

                    <Box sx={{ p: 2, backgroundColor: "#f8fafc", borderRadius: "8px" }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                        NỘI DUNG / LƯU Ý CHO CƯ DÂN:
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5, color: "#475569" }}>
                        {m.description}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}
    </Box>
  );
}
