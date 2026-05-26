import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Alert,
} from "@mui/material";
import { Sidebar, drawerWidth } from "../../../components/Sidebar";
import useAuthStore from "../../../store/authStore";
import { feeAPI } from "../../../api/apiService";
import { useNavigate } from "react-router-dom";

function FeeHouseholdPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();

  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [household, setHousehold] = useState(null);
  const [error, setError] = useState("");

  const statusMap = {
    UNPAID: { label: "Chưa nộp", color: "error" },
    PARTIAL: { label: "Còn nợ", color: "warning" },
    COMPLETED: { label: "Đã đủ", color: "success" },
    CONTRIBUTED: { label: "Đã đóng góp", color: "info" },
    NO_CONTRIBUTION: { label: "Chưa đóng góp", color: "default" },
  };

  useEffect(() => {
    const fetchHouseholdFees = async () => {
      setLoading(true);
      setError("");
      try {
        const householdId =
          typeof user?.household === "object"
            ? user.household?._id
            : user?.household;

        if (!householdId) {
          setError("Bạn chưa thuộc hộ khẩu nào.");
          setFees([]);
          setHousehold(null);
          return;
        }

        const data = await feeAPI.getHouseholdFeesByAdmin(householdId);
        setHousehold(data?.household || null);
        setFees(data?.fees || []);
      } catch (err) {
        console.error("Error loading household fees:", err);
        const message =
          err?.message || "Không thể tải danh sách khoản thu của hộ.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchHouseholdFees();
  }, [user?.household]);

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar user={user} navigate={navigate} onLogout={signOut} />

      <Box sx={{ flexGrow: 1, ml: `${drawerWidth}px` }}>
        <Box sx={{ padding: "24px 32px" }}>
          {/* TITLE */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: "26px", fontWeight: "600" }}>
              Khoản thu của hộ gia đình
              {household?.name ? ` (${household.name})` : ""}
            </Typography>
            {household?.address && (
              <Typography sx={{ fontSize: "14px", color: "#666", mt: 1 }}>
                {household.address}
              </Typography>
            )}
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* TABLE AREA */}
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0px 3px 12px rgba(0, 0, 0, 0.1)",
              p: 2,
            }}
          >
            {loading ? (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography sx={{ color: "#666", fontSize: "16px" }}>
                  Đang tải...
                </Typography>
              </Box>
            ) : (
              <Paper sx={{ boxShadow: "none" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "600" }}>Tên khoản thu</TableCell>
                      <TableCell sx={{ fontWeight: "600" }}>Loại</TableCell>
                      <TableCell sx={{ fontWeight: "600" }} align="right">Phải thu</TableCell>
                      <TableCell sx={{ fontWeight: "600" }} align="right">Đã thu</TableCell>
                      <TableCell sx={{ fontWeight: "600" }} align="right">Còn thiếu</TableCell>
                      <TableCell sx={{ fontWeight: "600" }}>Trạng thái</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {fees.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Box sx={{ py: 4 }}>
                            <Typography sx={{ color: "#666", fontSize: "16px" }}>
                              Hộ gia đình của bạn chưa có khoản thu nào.
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      fees.map((fee) => {
                        const chip =
                          statusMap[fee.status] || {
                            label: fee.status || "N/A",
                            color: "default",
                          };
                        return (
                          <TableRow key={fee.feeId} hover>
                            <TableCell>{fee.name}</TableCell>

                            <TableCell>
                              {fee.type === "MANDATORY" ? "Bắt buộc" : "Tự nguyện"}
                            </TableCell>

                            <TableCell align="right">
                              {(fee.requiredAmount || 0).toLocaleString()} VND
                            </TableCell>
                            <TableCell align="right">
                              {(fee.paidAmount || 0).toLocaleString()} VND
                            </TableCell>
                            <TableCell align="right">
                              {(fee.remainingAmount || 0).toLocaleString()} VND
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={chip.label}
                                color={chip.color}
                                size="small"
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </Paper>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default FeeHouseholdPage;
