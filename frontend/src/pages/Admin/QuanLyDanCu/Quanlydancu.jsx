import React, { useState, useEffect } from "react";
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
  IconButton,
} from "@mui/material";
import { Search, Trash2, ArrowUpDown } from "lucide-react";
import { useRoleNavigation } from "../../../hooks/useRoleNavigation";
import AddProfileModal from "../../../feature/profile/AddProfile";
import ThemHoDan from "../../../feature/admin/QuanLyHoKhau/ThemHoDan";
import { householdAPI } from "../../../api/apiService";

// ===== COMPONENT BẢNG HỘ DÂN =====
function ResidentsTable({ selected, setSelected, households, loading, onDelete, onViewDetail }) {
  const ROWS_PER_PAGE = 10;
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const { navigateWithRole } = useRoleNavigation();

  const pageCount = Math.ceil(households.length / ROWS_PER_PAGE) || 1;

  // Sorting logic
  const sortedHouseholds = React.useMemo(() => {
    let sortableHouseholds = [...households];
    
    if (sortConfig.key) {
      sortableHouseholds.sort((a, b) => {
        let aValue, bValue;
        
        switch (sortConfig.key) {
          case 'houseHoldID':
            aValue = a.houseHoldID || '';
            bValue = b.houseHoldID || '';
            break;
          case 'createdAt':
            aValue = new Date(a.createdAt || 0).getTime();
            bValue = new Date(b.createdAt || 0).getTime();
            break;
          case 'memberCount':
            aValue = a.members?.length || 0;
            bValue = b.members?.length || 0;
            break;
          default:
            return 0;
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return sortableHouseholds;
  }, [households, sortConfig]);

  const start = (page - 1) * ROWS_PER_PAGE;
  const visibleRows = sortedHouseholds.slice(start, start + ROWS_PER_PAGE);

  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        // Toggle direction
        return {
          key,
          direction: prevConfig.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      // New key, default to ascending
      return { key, direction: 'asc' };
    });
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

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (households.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography sx={{ color: '#666', fontSize: '16px' }}>
          Chưa có hộ dân nào
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
                  indeterminate={
                    selected.length > 0 && selected.length < visibleRows.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell align="center">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  Mã hộ dân
                  <IconButton 
                    size="small" 
                    onClick={() => handleSort('houseHoldID')}
                    sx={{ 
                      padding: '2px',
                      color: sortConfig.key === 'houseHoldID' ? '#2D66F5' : '#666'
                    }}
                  >
                    <ArrowUpDown size={16} />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell align="left">Chủ hộ</TableCell>
              <TableCell align="center">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  Ngày khởi tạo
                  <IconButton 
                    size="small" 
                    onClick={() => handleSort('createdAt')}
                    sx={{ 
                      padding: '2px',
                      color: sortConfig.key === 'createdAt' ? '#2D66F5' : '#666'
                    }}
                  >
                    <ArrowUpDown size={16} />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  Số thành viên
                  <IconButton 
                    size="small" 
                    onClick={() => handleSort('memberCount')}
                    sx={{ 
                      padding: '2px',
                      color: sortConfig.key === 'memberCount' ? '#2D66F5' : '#666'
                    }}
                  >
                    <ArrowUpDown size={16} />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell align="center">Thao tác</TableCell>
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
                  {/* CHECKBOX TỪNG DÒNG */}
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={checked}
                      onChange={() => handleSelectRow(row._id)}
                    />
                  </TableCell>

                  <TableCell align="center">{row.houseHoldID}</TableCell>
                  <TableCell align="left">{row.leader?.name || "N/A"}</TableCell>
                  <TableCell align="center">{formatDate(row.createdAt)}</TableCell>
                  <TableCell align="center">{row.members?.length || 0}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 , justifyContent:"center"}}>
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
                        // variant="outlined"
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
export default function Quanlydancu() {
  const [openAddProfileModal, setOpenAddProfileModal] = useState(false);
  const [openThemHoDan, setOpenThemHoDan] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [selected, setSelected] = useState([]);
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [batchDeleteDialogOpen, setBatchDeleteDialogOpen] = useState(false);
  const [householdToDelete, setHouseholdToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { navigateWithRole } = useRoleNavigation();

  // Fetch households on component mount
  useEffect(() => {
    fetchHouseholds();
  }, []);

  const fetchHouseholds = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await householdAPI.getAll();
      setHouseholds(data);
    } catch (err) {
      console.error("Failed to fetch households:", err);
      setError("Không thể tải danh sách hộ dân. Vui lòng thử lại.");
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

  // Bấm nút "Thêm thành viên" -> mở form trống
  const handleOpenAddMember = () => {
    setUserInfo({});
    setOpenAddProfileModal(true);
  };

  // Bấm nút "Thêm hộ dân" -> mở form ThemHoDan
  const handleOpenThemHoDan = () => {
    setOpenThemHoDan(true);
  };

  // Callback khi thêm hộ dân thành công
  const handleHouseholdAdded = () => {
    // Refresh danh sách hộ dân
    fetchHouseholds();
  };

  // Xử lý xóa hộ dân (single)
  const handleDeleteSingle = (household) => {
    setHouseholdToDelete(household);
    setDeleteDialogOpen(true);
  };

  // Xử lý xem chi tiết
  const handleViewDetail = (household) => {
    navigateWithRole('/ThongTinHoDanAdmin', { state: { householdId: household._id } });
  };

  // Xử lý xóa nhiều hộ dân (batch)
  const handleDeleteBatch = () => {
    if (selected.length === 0) return;
    setBatchDeleteDialogOpen(true);
  };

  // Xác nhận xóa hàng loạt
  const handleConfirmBatchDelete = async () => {
    setIsDeleting(true);
    setError("");

    try {
      // Xóa từng hộ dân được chọn
      await Promise.all(
        selected.map(id => householdAPI.delete(id))
      );

      // Refresh danh sách
      await fetchHouseholds();
      setSelected([]);
      setBatchDeleteDialogOpen(false);
      alert(`Đã xóa thành công ${selected.length} hộ dân`);
    } catch (err) {
      console.error("Failed to delete households:", err);
      setError(err.message || "Không thể xóa hộ dân. Vui lòng thử lại.");
      setBatchDeleteDialogOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  // Hủy xóa hàng loạt
  const handleCancelBatchDelete = () => {
    setBatchDeleteDialogOpen(false);
  };

  // Xác nhận xóa từ dialog
  const handleConfirmDelete = async () => {
    if (!householdToDelete) return;

    setIsDeleting(true);
    setError("");

    try {
      await householdAPI.delete(householdToDelete._id);
      await fetchHouseholds();
      setDeleteDialogOpen(false);
      setHouseholdToDelete(null);
      alert("Đã xóa hộ dân thành công");
    } catch (err) {
      console.error("Failed to delete household:", err);
      setError(err.message || "Không thể xóa hộ dân. Vui lòng thử lại.");
      setDeleteDialogOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  // Hủy xóa
  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setHouseholdToDelete(null);
  };

  // Filter and search logic
  const filteredHouseholds = households.filter(household => {
    const matchesSearch =
      household.houseHoldID?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      household.leader?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      household.address?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const handleSearch = () => {
    // Search is already reactive through filteredHouseholds
    // This function can be used for additional actions if needed
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
            Thông tin hộ dân
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
              onClick={handleDeleteBatch}
              disabled={selected.length === 0 || isDeleting}
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
              {isDeleting ? "Đang xóa..." : `Xóa hộ dân${selected.length > 0 ? ` (${selected.length})` : ""}`}
            </Button>

            <Button
              variant="contained"
              onClick={handleOpenThemHoDan}
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
              Thêm hộ dân
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
              placeholder="Nhập mã hộ dân, tên chủ hộ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
            households={filteredHouseholds}
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

      {/* MODAL THÊM HỘ DÂN */}
      <ThemHoDan
        open={openThemHoDan}
        onClose={() => setOpenThemHoDan(false)}
        onSuccess={handleHouseholdAdded}
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
          Xác nhận xóa hộ dân
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa hộ dân <strong>{householdToDelete?.houseHoldID}</strong> (Chủ hộ: <strong>{householdToDelete?.leader?.name}</strong>) không?
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

      {/* BATCH DELETE CONFIRMATION DIALOG */}
      <Dialog
        open={batchDeleteDialogOpen}
        onClose={handleCancelBatchDelete}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            padding: "8px"
          }
        }}
      >
        <DialogTitle sx={{ fontSize: "18px", fontWeight: "600" }}>
          Xác nhận xóa nhiều hộ dân
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa <strong>{selected.length} hộ dân</strong> đã chọn không?
          </Typography>
          <Typography sx={{ mt: 2, color: "#d32f2f", fontSize: "14px" }}>
            <strong>Cảnh báo:</strong> Hành động này không thể hoàn tác!
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCancelBatchDelete}
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
            onClick={handleConfirmBatchDelete}
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
    </>
  );
}
