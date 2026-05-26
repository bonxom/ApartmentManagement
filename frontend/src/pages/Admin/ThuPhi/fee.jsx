import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../store/authStore";
import { feeAPI } from "../../../api/apiService";
import FeeManagementHeader from "../../../feature/admin/ThuPhi/FeeManagementHeader";
import FeeDialog from "../../../feature/admin/ThuPhi/FeeDialog";
import FeeListTable from "../../../feature/admin/ThuPhi/FeeListTable";
import FeeStatisticsView from "../../../feature/admin/ThuPhi/FeeStatisticsView";

import {
  Box,
  Alert,
  Button,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";

function FeeManagement() {
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

  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [feeToDelete, setFeeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

    if (isEdit && name === "type") return;

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
        description: formData.description.trim(),
      };

      if (!isEdit) {
        payload.type = formData.type;
      }

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

  const handleDelete = (fee) => {
    setFeeToDelete(fee);
    setDeleteDialogOpen(true);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setFeeToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!feeToDelete) return;

    setIsDeleting(true);
    try {
      await feeAPI.deleteFee(feeToDelete._id);
      setFees((prev) => prev.filter((f) => f._id !== feeToDelete._id));
      setDeleteDialogOpen(false);
      setFeeToDelete(null);
      showSuccess("Xóa khoản thu thành công!");
    } catch (err) {
      console.error("handleDelete:", err);
      const errorMsg = err?.message || "Không thể xóa khoản thu!";
      showError(errorMsg);
      setDeleteDialogOpen(false);
    } finally {
      setIsDeleting(false);
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
      <FeeManagementHeader tab={tab} setTab={setTab} />

      {backendError && !open && (
        <Alert
          severity="error"
          sx={{ mb: 2, mt: 2 }}
          onClose={() => setBackendError("")}
        >
          {backendError}
        </Alert>
      )}

      {tab === 0 && (
        <>
          <Button
            variant="contained"
            onClick={handleOpenCreate}
            sx={{
              backgroundColor: "#2D66F5",
              borderRadius: "8px",
              textTransform: "none",
              px: 3,
              py: 1,
              mt: 2,
              mb: 2,
              fontSize: "14px",
              fontWeight: "500",
              "&:hover": { backgroundColor: "#1E54D4" },
            }}
          >
            Tạo khoản thu mới
          </Button>

          <FeeDialog
            open={open}
            onClose={handleClose}
            isEdit={isEdit}
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            backendError={backendError}
            feeTypes={feeTypes}
            statusTypes={statusTypes}
          />

          <FeeListTable
            fees={fees}
            loading={loading}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
            renderStatusChip={renderStatusChip}
          />
        </>
      )}

      {tab === 1 && (
        <FeeStatisticsView
          fees={fees}
          loading={loading}
          onViewStatistics={handleViewStatistics}
          statsLoading={statsLoading}
          openStats={openStats}
          closeStats={closeStats}
          statsData={statsData}
          statsFilter={statsFilter}
          setStatsFilter={setStatsFilter}
          filteredDetails={filteredDetails}
          renderPaymentStatus={renderPaymentStatus}
        />
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
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            padding: "8px"
          }
        }}
      >
        <DialogTitle sx={{ fontSize: "18px", fontWeight: "600" }}>
          Xác nhận xóa khoản thu
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa khoản thu <strong>{feeToDelete?.name}</strong> không?
          </Typography>
          <Typography sx={{ mt: 2, color: "#d32f2f", fontSize: "14px" }}>
            <strong>Cảnh báo:</strong> Hành động này không thể hoàn tác!
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCancelDelete}
            disabled={isDeleting}
            sx={{
              textTransform: "none",
              color: "#666",
              fontSize: "14px"
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={isDeleting}
            sx={{
              textTransform: "none",
              fontSize: "14px"
            }}
          >
            {isDeleting ? "Đang xóa..." : "Xác nhận xóa"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default FeeManagement;