import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
  Pagination,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Search, Filter, ChevronDown, Trash2 } from "lucide-react";
import { useRoleNavigation } from "../../../hooks/useRoleNavigation";
import { useNavigate } from "react-router-dom";
import AddProfileModal from "../../../feature/profile/AddProfile";
import ThemThanhVien from "../../../feature/admin/QuanLyHoKhau/ThemThanhVien";
import { householdAPI, userAPI } from "../../../api/apiService";

// ===== COMPONENT BẢNG =====
function ResidentsTable({ selected, setSelected, members, loading, onDelete, onViewDetail }) {
  const ROWS_PER_PAGE = 10;
  const [page, setPage] = useState(1);
  const { navigateWithRole } = useRoleNavigation();

  const pageCount = Math.ceil(members.length / ROWS_PER_PAGE) || 1;
  const start = (page - 1) * ROWS_PER_PAGE;
  const visibleRows = members.slice(start, start + ROWS_PER_PAGE);

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const handleSelectRow = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const idsOnPage = visibleRows.map((r) => r._id);
      setSelected(idsOnPage);
    } else {
      setSelected([]);
    }
  };

  const isAllSelectedOnPage =
    visibleRows.length > 0 &&
    visibleRows.every((row) => selected.includes(row._id));

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (members.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography sx={{ color: '#666', fontSize: '16px' }}>
          Chưa có thành viên nào
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#F8FAFC" }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={isAllSelectedOnPage}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Số CCCD</TableCell>
              <TableCell>Họ và tên</TableCell>
              <TableCell>Quan hệ với chủ hộ</TableCell>
              <TableCell>Ngày tháng năm sinh</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((row) => {
              const checked = selected.includes(row._id);
              return (
                <TableRow
                  key={row._id}
                  hover
                  selected={checked}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={checked}
                      onChange={() => handleSelectRow(row._id)}
                    />
                  </TableCell>
                  <TableCell>{row.userCardID || "N/A"}</TableCell>
                  <TableCell>{row.name || "N/A"}</TableCell>
                  <TableCell>{row.relationshipWithHead || row.relationWithLeader || "N/A"}</TableCell>
                  <TableCell>{formatDate(row.dob)}</TableCell>

                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => onViewDetail(row)}
                        sx={{
                          textTransform: "none",
                          minWidth: "60px",
                          fontSize: "13px"
                        }}
                      >
                        Xem chi tiết
                      </Button>
                      <Button
                        color="error"
                        size="small"
                        onClick={() => onDelete(row)}
                        sx={{
                          textTransform: "none",
                          minWidth: "40px",
                          padding: "4px 8px"
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
        <Pagination
          count={pageCount}
          page={page}
          onChange={(e, value) => setPage(value)}
        />
      </Box>
    </Box>
  );
}

// ===== PAGE CHÍNH =====
export default function ThongTinHoDanAdmin() {
  const location = useLocation();
  const householdId = location.state?.householdId;
  const [openAddProfileModal, setOpenAddProfileModal] = useState(false);
  const [openAddMemberModal, setOpenAddMemberModal] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [selected, setSelected] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const navigate = useNavigate();

  // Fetch members when component mounts
  useEffect(() => {
    if (!householdId) {
      setError("Không tìm thấy ID hộ dân");
      return;
    }
    fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [householdId]);

  const fetchMembers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await householdAPI.getMembersInfo(householdId);
      setMembers(data);
    } catch (err) {
      console.error("Failed to fetch members:", err);
      setError("Không thể tải danh sách thành viên. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddRequest = (formData) => {
    console.log("Yêu cầu thêm thành viên:", formData);
    // TODO: Gửi formData lên backend
    alert("Yêu cầu đã được gửi!");
    setOpenAddProfileModal(false);
  };

  // Bấm nút "Yêu cầu thêm thành viên" -> mở form trống
  const handleOpenAddMember = () => {
    setOpenAddMemberModal(true);
  };

  // Callback khi thêm thành viên thành công
  const handleAddMemberSuccess = () => {
    fetchMembers();
  };

  // Xử lý xem chi tiết thành viên
  const handleViewDetail = (member) => {
    navigate('/leader/ThongTinChiTietMember', { state: { memberId: member._id } });
  };

  // Xử lý xóa thành viên (single)
  const handleDeleteSingle = (member) => {
    setMemberToDelete(member);
    setDeleteDialogOpen(true);
  };

  // Xác nhận xóa từ dialog
  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;

    setIsDeleting(true);
    setError("");

    try {
      await householdAPI.removeMember(householdId, memberToDelete._id);
      await fetchMembers();
      setDeleteDialogOpen(false);
      setMemberToDelete(null);
      alert("Đã xóa thành viên khỏi hộ thành công");
    } catch (err) {
      console.error("Failed to remove member:", err);
      setError(err.response?.data?.message || "Không thể xóa thành viên. Vui lòng thử lại.");
      setDeleteDialogOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  // Hủy xóa
  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setMemberToDelete(null);
  };

  // Xử lý xóa nhiều thành viên
  const handleBulkDelete = () => {
    if (selected.length === 0) return;
    setBulkDeleteDialogOpen(true);
  };

  // Xác nhận xóa nhiều từ dialog
  const handleConfirmBulkDelete = async () => {
    setIsBulkDeleting(true);
    setError("");

    try {
      // Xóa từng member một
      await Promise.all(
        selected.map(memberId => householdAPI.removeMember(householdId, memberId))
      );
      
      await fetchMembers();
      setSelected([]);
      setBulkDeleteDialogOpen(false);
      alert(`Đã xóa ${selected.length} thành viên khỏi hộ thành công`);
    } catch (err) {
      console.error("Failed to remove members:", err);
      setError(err.response?.data?.message || "Không thể xóa thành viên. Vui lòng thử lại.");
      setBulkDeleteDialogOpen(false);
    } finally {
      setIsBulkDeleting(false);
    }
  };

  // Hủy xóa nhiều
  const handleCancelBulkDelete = () => {
    setBulkDeleteDialogOpen(false);
  };

  return (
    <>
      <Box sx={{ padding: "24px 32px" }}>
        {/* TITLE + BUTTON */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography sx={{ fontSize: "26px", fontWeight: "600" }}>
            Thông tin thành viên hộ dân
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Button
              variant="contained"
              disabled={selected.length === 0}
              onClick={handleBulkDelete}
              sx={{
                backgroundColor: selected.length === 0 ? "#fca5a5" : "#ef4444",
                borderRadius: "8px",
                textTransform: "none",
                px: 3,
                py: 1,
                fontSize: "14px",
                fontWeight: "500",
                "&:hover": { 
                  backgroundColor: selected.length === 0 ? "#fca5a5" : "#c84848ff" 
                },
                "&.Mui-disabled": {
                  backgroundColor: "#fca5a5",
                  color: "rgba(255, 255, 255, 0.7)",
                },
              }}
            >
              Xóa thành viên
            </Button>

            <Button
              variant="contained"
              onClick={handleOpenAddMember}
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
              Thêm thành viên
            </Button>
          </Box>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }} 
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        {/* SEARCH BOX */}
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
          {/* SEARCH INPUT */}
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: "13px", mb: 1 }}>Tìm kiếm</Typography>
            <TextField
              fullWidth
              placeholder="Nhập từ khóa..."
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

          {/* SEARCH BUTTON */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#2D66F5",
              borderRadius: "8px",
              textTransform: "none",
              height: "40px",
              width: "120px",
              "&:hover": { backgroundColor: "#1E54D4" },
              alignItems: "center",
              mt: "26px",
            }}
          >
            Tìm kiếm
          </Button>
        </Box>

        {/* TABLE AREA */}
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0px 3px 12px rgba(0, 0, 0, 0.1)",
            p: 2,
          }}
        >
          <ResidentsTable 
            selected={selected} 
            setSelected={setSelected}
            members={members}
            loading={loading}
            onDelete={handleDeleteSingle}
            onViewDetail={handleViewDetail}
          />
        </Box>
      </Box>

      {/* MODAL THÊM THÀNH VIÊN */}
      <AddProfileModal
        open={openAddProfileModal}
        onClose={() => setOpenAddProfileModal(false)}
        currentData={userInfo}
        onSubmit={handleAddRequest}
      />

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
          Xác nhận xóa thành viên
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa thành viên <strong>{memberToDelete?.name}</strong> không?
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

      {/* BULK DELETE CONFIRMATION DIALOG */}
      <Dialog
        open={bulkDeleteDialogOpen}
        onClose={handleCancelBulkDelete}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            padding: "8px"
          }
        }}
      >
        <DialogTitle sx={{ fontSize: "18px", fontWeight: "600" }}>
          Xác nhận xóa nhiều thành viên
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa <strong>{selected.length} thành viên</strong> đã chọn khỏi hộ này không?
          </Typography>
          <Typography sx={{ mt: 2, color: "#d32f2f", fontSize: "14px" }}>
            <strong>Cảnh báo:</strong> Hành động này không thể hoàn tác!
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCancelBulkDelete}
            disabled={isBulkDeleting}
            sx={{
              textTransform: "none",
              color: "#666",
              fontSize: "14px"
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirmBulkDelete}
            variant="contained"
            color="error"
            disabled={isBulkDeleting}
            sx={{
              textTransform: "none",
              fontSize: "14px"
            }}
          >
            {isBulkDeleting ? "Đang xóa..." : "Xác nhận xóa"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* MODAL THÊM THÀNH VIÊN MỚI */}
      <ThemThanhVien
        open={openAddMemberModal}
        onClose={() => setOpenAddMemberModal(false)}
        onSuccess={handleAddMemberSuccess}
        householdId={householdId}
      />
    </>
  );
}
