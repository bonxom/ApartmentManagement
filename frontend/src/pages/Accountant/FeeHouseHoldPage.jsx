import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { feeAPI } from "../../api/apiService";

import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Stack,
  Divider,
  IconButton,
  CircularProgress,
  Snackbar,
} from "@mui/material";

function FeeHouseHoldPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();

  const [tab, setTab] = useState(0); // 0: List, 1: Statistics
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendError, setBackendError] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    type: "",
    description: "",
    unitPrice: "",
    status: "ACTIVE",
  });

  // Statistics
  const [openStats, setOpenStats] = useState(false);
  const [statsData, setStatsData] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsFilter, setStatsFilter] = useState("ALL");

  const feeTypes = [
    { value: "MANDATORY", label: "Bắt buộc" },
    { value: "VOLUNTARY", label: "Tự nguyện" },
  ];

  const statusTypes = [
    { value: "ACTIVE", label: "Đang hiệu lực" },
    { value: "COMPLETED", label: "Đã hoàn thành" },
  ];

  useEffect(() => {
    fetchFees();
  }, []);

  const showSuccess = (message) => {
    setSnackbar({ open: true, message, severity: "success" });
  };

  const showError = (message) => {
    setSnackbar({ open: true, message, severity: "error" });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleLogout = () => {
    signOut();
    navigate("/signin");
  };

  const fetchFees = async () => {
    setLoading(true);
    setBackendError("");
    try {
      const data = await feeAPI.getAllFees();
      setFees(data || []);
    } catch (err) {
      console.error("fetchFees:", err);
      const errorMsg = err?.message || "Lỗi khi tải danh sách khoản thu";
      setBackendError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setIsEdit(false);
    setFormData({
      _id: "",
      name: "",
      type: "",
      description: "",
      unitPrice: "",
      status: "ACTIVE",
    });
    setBackendError("");
    setOpen(true);
  };

  const handleOpenEdit = (fee) => {
    setIsEdit(true);
    setFormData({
      _id: fee._id,
      name: fee.name,
      type: fee.type,
      description: fee.description || "",
      unitPrice: fee.unitPrice?.toString() || "",
      status: fee.status || "ACTIVE",
    });
    setBackendError("");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setBackendError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "unitPrice") {
      if (value && !/^\d*$/.test(value)) return;
    }

    if (name === "type" && value === "VOLUNTARY") {
      setFormData((prev) => ({ ...prev, type: value, unitPrice: "" }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (backendError) setBackendError("");
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setBackendError("");

      if (!formData.name?.trim()) {
        setBackendError("Tên khoản thu không được để trống");
        return;
      }

      if (!formData.type) {
        setBackendError("Vui lòng chọn loại khoản thu");
        return;
      }

      if (formData.type === "MANDATORY") {
        if (!formData.unitPrice || Number(formData.unitPrice) <= 0) {
          setBackendError("Phí bắt buộc phải có đơn giá lớn hơn 0");
          return;
        }
      }

      const payload = {
        name: formData.name.trim(),
        type: formData.type,
        description: formData.description.trim(),
      };

      if (formData.type === "MANDATORY") {
        payload.unitPrice = Number(formData.unitPrice);
      }

      if (isEdit) {
        payload.status = formData.status;
      }

      if (isEdit) {
        await feeAPI.updateFee(formData._id, payload);
        showSuccess("Cập nhật khoản thu thành công!");
      } else {
        await feeAPI.createFee(payload);
        showSuccess("Tạo khoản thu thành công!");
      }

      await fetchFees();
      handleClose();
    } catch (err) {
      console.error("handleSubmit:", err);
      const errorMsg = err?.message || "Lỗi hệ thống";
      setBackendError(errorMsg);
      showError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (feeId) => {
    if (!window.confirm("Bạn có chắc muốn xóa khoản thu này?")) return;

    try {
      await feeAPI.deleteFee(feeId);
      setFees((prev) => prev.filter((f) => f._id !== feeId));
      showSuccess("Xóa khoản thu thành công!");
    } catch (err) {
      console.error("handleDelete:", err);
      const errorMsg = err?.message || "Không thể xóa khoản thu!";
      showError(errorMsg);
    }
  };

  // ============ STATISTICS ============
  const handleViewStatistics = async (feeId) => {
    if (!feeId) return;

    try {
      setStatsLoading(true);
      setStatsData(null);
      setStatsFilter("ALL");

      const data = await feeAPI.getFeeStatistics(feeId);
      setStatsData(data);
      setOpenStats(true);
    } catch (err) {
      console.error("getFeeStatistics:", err);
      const errorMsg = err?.message || "Không thể tải báo cáo";
      showError(errorMsg);
    } finally {
      setStatsLoading(false);
    }
  };

  const closeStats = () => {
    setOpenStats(false);
    setStatsData(null);
    setStatsFilter("ALL");
  };

  const filteredDetails = useMemo(() => {
    if (!statsData?.details) return [];
    if (statsFilter === "ALL") return statsData.details;
    return statsData.details.filter((d) => d.status === statsFilter);
  }, [statsData, statsFilter]);

  const renderStatusChip = (status) => {
    const configs = {
      ACTIVE: { bg: "green", text: "Đang hiệu lực" },
      COMPLETED: { bg: "blue", text: "Đã hoàn thành" },
    };

    const config = configs[status] || { bg: "gray", text: status };

    return (
      <Box
        sx={{
          px: 1.5,
          py: 0.4,
          borderRadius: "6px",
          color: "#fff",
          backgroundColor: config.bg,
          display: "inline-block",
          textAlign: "center",
          minWidth: 80,
          fontSize: "0.875rem",
        }}
      >
        {config.text}
      </Box>
    );
  };

  const renderPaymentStatus = (status) => {
    const configs = {
      UNPAID: { bg: "#d32f2f", text: "Chưa đóng" },
      PARTIAL: { bg: "#f57c00", text: "Còn nợ" },
      COMPLETED: { bg: "#388e3c", text: "Đã đóng đủ" },
      CONTRIBUTED: { bg: "#1976d2", text: "Đã đóng góp" },
      NO_CONTRIBUTION: { bg: "#757575", text: "Chưa đóng góp" },
    };

    const config = configs[status] || { bg: "#757575", text: status };

    return (
      <Box
        sx={{
          px: 1,
          py: 0.3,
          borderRadius: "4px",
          color: "white",
          backgroundColor: config.bg,
          display: "inline-block",
          fontSize: "0.875rem",
          fontWeight: 500,
        }}
      >
        {config.text}
      </Box>
    );
  };

  return (
    <Box sx={{ p: 4 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h4" fontWeight={600}>
          Quản lý khoản thu (Accountant)
        </Typography>

        <Box>
          <Button
            variant={tab === 0 ? "contained" : "outlined"}
            sx={{ mr: 1 }}
            onClick={() => setTab(0)}
          >
            Danh sách khoản thu
          </Button>
          <Button
            variant={tab === 1 ? "contained" : "outlined"}
            onClick={() => setTab(1)}
          >
            Báo cáo thống kê
          </Button>
        </Box>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {backendError && !open && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => setBackendError("")}
        >
          {backendError}
        </Alert>
      )}

      {tab === 0 && (
        <>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ mb: 2 }}
            onClick={handleOpenCreate}
          >
            Tạo khoản thu mới
          </Button>

          <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>
              {isEdit ? "Cập nhật khoản thu" : "Tạo khoản thu mới"}
              <Button
                aria-label="close"
                onClick={handleClose}
                sx={{ position: "absolute", right: 8, top: 8 }}
              >
                <Typography variant="body2" component="span">
                  ×
                </Typography>
              </Button>
            </DialogTitle>

            <DialogContent>
              {backendError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {backendError}
                </Alert>
              )}

              <TextField
                label="Tên khoản thu"
                name="name"
                fullWidth
                margin="normal"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="VD: Phí quản lý chung cư"
              />

              <TextField
                select
                label="Loại khoản thu"
                name="type"
                fullWidth
                margin="normal"
                value={formData.type}
                onChange={handleChange}
                required
              >
                {feeTypes.map((t) => (
                  <MenuItem key={t.value} value={t.value}>
                    {t.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Đơn giá (VND)"
                name="unitPrice"
                fullWidth
                margin="normal"
                value={formData.unitPrice}
                onChange={handleChange}
                helperText={
                  formData.type === "MANDATORY"
                    ? "Bắt buộc nhập đơn giá > 0. Tổng phí = Đơn giá × 12 tháng × Số nhân khẩu"
                    : "Không bắt buộc với phí tự nguyện"
                }
                disabled={formData.type === "VOLUNTARY"}
                required={formData.type === "MANDATORY"}
                placeholder="VD: 6000"
              />

              <TextField
                label="Mô tả"
                name="description"
                fullWidth
                margin="normal"
                multiline
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Mô tả chi tiết về khoản thu này..."
              />

              {isEdit && (
                <TextField
                  select
                  label="Trạng thái"
                  name="status"
                  fullWidth
                  margin="normal"
                  value={formData.status}
                  onChange={handleChange}
                  helperText="Chuyển sang 'Đã hoàn thành' để đóng khoản thu này"
                >
                  {statusTypes.map((s) => (
                    <MenuItem key={s.value} value={s.value}>
                      {s.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={handleClose} size="large">
                Hủy
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={isLoading}
                size="large"
              >
                {isLoading ? "Đang lưu..." : isEdit ? "Cập nhật" : "Tạo mới"}
              </Button>
            </DialogActions>
          </Dialog>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress size={48} />
            </Box>
          ) : (
            <Paper elevation={2}>
              <Table>
                <TableHead sx={{ backgroundColor: "#F8FAFC" }}>
                  <TableRow>
                    <TableCell>
                      <strong>Tên khoản thu</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Loại</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Đơn giá</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Trạng thái</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Mô tả</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Hành động</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {fees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          Chưa có khoản thu nào. Nhấn "Tạo khoản thu mới" để bắt
                          đầu.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    fees.map((fee) => (
                      <TableRow key={fee._id} hover>
                        <TableCell>
                          <Typography fontWeight={500}>{fee.name}</Typography>
                        </TableCell>

                        <TableCell>
                          <Box
                            sx={{
                              px: 1.5,
                              py: 0.3,
                              borderRadius: "4px",
                              backgroundColor:
                                fee.type === "MANDATORY"
                                  ? "#e3f2fd"
                                  : "#f3e5f5",
                              color:
                                fee.type === "MANDATORY"
                                  ? "#1976d2"
                                  : "#7b1fa2",
                              display: "inline-block",
                              fontSize: "0.875rem",
                              fontWeight: 500,
                            }}
                          >
                            {fee.type === "MANDATORY"
                              ? "Bắt buộc"
                              : "Tự nguyện"}
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Typography fontWeight={500}>
                            {fee.unitPrice ? (
                              `${fee.unitPrice.toLocaleString()} VND`
                            ) : (
                              <span style={{ color: "#9e9e9e" }}>-</span>
                            )}
                          </Typography>
                        </TableCell>

                        <TableCell>{renderStatusChip(fee.status)}</TableCell>

                        <TableCell>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              maxWidth: 200,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {fee.description || "-"}
                          </Typography>
                        </TableCell>

                        <TableCell align="center">
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="center"
                          >
                            <Button
                              size="small"
                              variant="outlined"
                              color="primary"
                              onClick={() => handleOpenEdit(fee)}
                            >
                              Sửa
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() => handleDelete(fee._id)}
                            >
                              Xóa
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Paper>
          )}
        </>
      )}

      {tab === 1 && (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Báo cáo tình hình thu theo khoản
          </Typography>

          <Paper sx={{ p: 2, mb: 3 }} elevation={2}>
            <TextField
              select
              label="Chọn khoản thu để xem báo cáo"
              fullWidth
              value={statsData?.fee_info?._id || ""}
              onChange={(e) => handleViewStatistics(e.target.value)}
              SelectProps={{
                displayEmpty: true,
              }}
            >
              {fees.map((f) => (
                <MenuItem key={f._id} value={f._id}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <span>{f.name}</span>
                    <span style={{ color: "#757575", marginLeft: 16 }}>
                      ({f.type === "MANDATORY" ? "Bắt buộc" : "Tự nguyện"})
                    </span>
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Paper>

          {/* Loading spinner */}
          {statsLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress size={48} />
            </Box>
          )}

          {statsData && !statsLoading && (
            <Paper sx={{ p: 3 }} elevation={2}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Tổng quan: {statsData.fee_info.name}
              </Typography>

              <Stack
                direction="row"
                spacing={2}
                sx={{ mb: 3, flexWrap: "wrap" }}
              >
                <Paper
                  sx={{
                    p: 2,
                    flex: 1,
                    minWidth: 180,
                    backgroundColor: "#e3f2fd",
                  }}
                  elevation={1}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    Tổng số hộ
                  </Typography>
                  <Typography variant="h4" fontWeight={600} color="primary">
                    {statsData.summary.total_households}
                  </Typography>
                </Paper>

                <Paper
                  sx={{
                    p: 2,
                    flex: 1,
                    minWidth: 180,
                    backgroundColor: "#fff3e0",
                  }}
                  elevation={1}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    Tổng phải thu
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight={600}
                    color="warning.main"
                  >
                    {statsData.summary.total_expected.toLocaleString()} đ
                  </Typography>
                </Paper>

                <Paper
                  sx={{
                    p: 2,
                    flex: 1,
                    minWidth: 180,
                    backgroundColor: "#e8f5e9",
                  }}
                  elevation={1}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    Tổng đã thu
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight={600}
                    color="success.main"
                  >
                    {statsData.summary.total_collected.toLocaleString()} đ
                  </Typography>
                </Paper>

                <Paper
                  sx={{
                    p: 2,
                    flex: 1,
                    minWidth: 180,
                    backgroundColor: "#f3e5f5",
                  }}
                  elevation={1}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    Tỉ lệ hoàn thành
                  </Typography>
                  <Typography variant="h5" fontWeight={600} color="secondary">
                    {statsData.summary.total_expected > 0
                      ? `${Math.round(
                          (statsData.summary.total_collected /
                            statsData.summary.total_expected) *
                            100
                        )}%`
                      : "N/A"}
                  </Typography>
                </Paper>
              </Stack>

              <Divider sx={{ mb: 2 }} />

              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Lọc theo trạng thái đóng tiền:
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                <Button
                  variant={statsFilter === "ALL" ? "contained" : "outlined"}
                  onClick={() => setStatsFilter("ALL")}
                >
                  Tất cả ({statsData.details.length})
                </Button>
                <Button
                  variant={statsFilter === "UNPAID" ? "contained" : "outlined"}
                  color="error"
                  onClick={() => setStatsFilter("UNPAID")}
                >
                  Chưa đóng (
                  {
                    statsData.details.filter((d) => d.status === "UNPAID")
                      .length
                  }
                  )
                </Button>
                <Button
                  variant={statsFilter === "PARTIAL" ? "contained" : "outlined"}
                  color="warning"
                  onClick={() => setStatsFilter("PARTIAL")}
                >
                  Còn nợ (
                  {
                    statsData.details.filter((d) => d.status === "PARTIAL")
                      .length
                  }
                  )
                </Button>
                <Button
                  variant={
                    statsFilter === "COMPLETED" ? "contained" : "outlined"
                  }
                  color="success"
                  onClick={() => setStatsFilter("COMPLETED")}
                >
                  Đã đóng đủ (
                  {
                    statsData.details.filter((d) => d.status === "COMPLETED")
                      .length
                  }
                  )
                </Button>
              </Stack>

              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell>
                      <strong>Mã hộ</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Địa chỉ</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Nhân khẩu</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Phải thu</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Đã thu</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Còn thiếu</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Trạng thái</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredDetails.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          Không tìm thấy hộ phù hợp với bộ lọc hiện tại
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDetails.map((row) => (
                      <TableRow key={row.household_id} hover>
                        <TableCell>
                          <Typography fontWeight={500}>
                            {row.household_code || row.household_id}
                          </Typography>
                        </TableCell>
                        <TableCell>{row.address || "-"}</TableCell>
                        <TableCell align="center">{row.member_count}</TableCell>
                        <TableCell align="right">
                          <Typography fontWeight={500}>
                            {row.required.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography fontWeight={500} color="success.main">
                            {row.paid.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            fontWeight={500}
                            color={
                              row.remaining > 0
                                ? "error.main"
                                : "text.secondary"
                            }
                          >
                            {row.remaining.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          {renderPaymentStatus(row.status)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Paper>
          )}
        </>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default FeeHouseHoldPage;
