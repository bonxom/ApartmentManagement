import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
  IconButton,
} from "@mui/material";
import { Search, Plus, Calendar, Settings, Edit, Trash2 } from "lucide-react";
import { maintenanceAPI } from "../../../api/apiService";

export default function MaintenanceManagement() {
  const [maintenances, setMaintenances] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Form states
  const [title, setTitle] = useState("");
  const [facilityName, setFacilityName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [cost, setCost] = useState("0");
  const [status, setStatus] = useState("PENDING");
  const [processing, setProcessing] = useState(false);

  const fetchMaintenances = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await maintenanceAPI.getAll();
      setMaintenances(data || []);
    } catch (err) {
      setError(err?.message || "Không thể tải danh sách lịch bảo trì");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenances();
  }, []);

  const filteredData = useMemo(() => {
    if (!searchText.trim()) return maintenances;
    const q = searchText.toLowerCase();
    return maintenances.filter(
      (m) =>
        m.title?.toLowerCase().includes(q) ||
        m.facilityName?.toLowerCase().includes(q) ||
        m.assignedTo?.toLowerCase().includes(q)
    );
  }, [maintenances, searchText]);

  const handleOpenCreate = () => {
    setEditMode(false);
    setSelectedId(null);
    setTitle("");
    setFacilityName("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setAssignedTo("");
    setCost("0");
    setStatus("PENDING");
    setFormOpen(true);
  };

  const handleOpenEdit = (m) => {
    setEditMode(true);
    setSelectedId(m._id);
    setTitle(m.title || "");
    setFacilityName(m.facilityName || "");
    setDescription(m.description || "");
    setStartDate(m.startDate ? new Date(m.startDate).toISOString().split("T")[0] : "");
    setEndDate(m.endDate ? new Date(m.endDate).toISOString().split("T")[0] : "");
    setAssignedTo(m.assignedTo || "");
    setCost(m.cost?.toString() || "0");
    setStatus(m.status || "PENDING");
    setFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !facilityName || !description || !startDate || !endDate || !assignedTo) {
      setError("Vui lòng nhập đầy đủ các trường bắt buộc");
      return;
    }

    setProcessing(true);
    setError(null);

    const payload = {
      title,
      facilityName,
      description,
      startDate,
      endDate,
      assignedTo,
      cost: Number(cost),
      status,
    };

    try {
      if (editMode) {
        const updated = await maintenanceAPI.update(selectedId, payload);
        setMaintenances((prev) => prev.map((item) => (item._id === selectedId ? updated : item)));
      } else {
        const created = await maintenanceAPI.create(payload);
        setMaintenances((prev) => [created, ...prev]);
      }
      setFormOpen(false);
    } catch (err) {
      setError(err?.message || "Lưu thông tin bảo trì thất bại");
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa lịch trình bảo trì này?")) return;
    setError(null);
    try {
      await maintenanceAPI.delete(id);
      setMaintenances((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      setError(err?.message || "Xóa lịch trình thất bại");
    }
  };

  const formatMoney = (val) => {
    if (!val) return "0 đ";
    return Number(val).toLocaleString("vi-VN") + " đ";
  };

  const formatDate = (val) => {
    if (!val) return "—";
    return new Date(val).toLocaleDateString("vi-VN");
  };

  const getStatusChip = (s) => {
    const map = {
      PENDING: { label: "Chờ thực hiện", color: "warning" },
      IN_PROGRESS: { label: "Đang tiến hành", color: "info" },
      COMPLETED: { label: "Đã hoàn thành", color: "success" },
      CANCELLED: { label: "Đã hủy", color: "error" },
    };
    const { label, color } = map[s] || { label: s || "N/A", color: "default" };
    return <Chip size="small" label={label} color={color} sx={{ fontWeight: 600 }} />;
  };

  return (
    <div style={{ padding: "20px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ p: 1, backgroundColor: "#e3f2fd", color: "#1565c0", borderRadius: "8px", display: "flex" }}>
            <Settings size={20} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Quản lý bảo trì và vận hành thiết bị
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            variant="outlined"
            onClick={fetchMaintenances}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              px: 2.5,
              fontSize: "14px",
            }}
          >
            Làm mới
          </Button>
          <Button
            variant="contained"
            onClick={handleOpenCreate}
            startIcon={<Plus size={18} />}
            sx={{
              backgroundColor: "#2D66F5",
              borderRadius: "8px",
              textTransform: "none",
              px: 3,
              fontSize: "14px",
              fontWeight: "600",
              "&:hover": { backgroundColor: "#1E54D4" },
            }}
          >
            Lên lịch bảo trì
          </Button>
        </Box>
      </Box>

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
          mt: 3,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: "13px", mb: 1 }}>Tìm kiếm kế hoạch</Typography>
          <TextField
            fullWidth
            placeholder="Nhập tiêu đề bảo trì, tên thiết bị hoặc người phụ trách..."
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

      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 3, borderRadius: "12px" }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#F8FAFC" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", padding: "12px 16px" }}>Tiêu đề công việc</TableCell>
                <TableCell sx={{ fontWeight: "bold", padding: "12px 16px" }}>Thiết bị/Khu vực</TableCell>
                <TableCell sx={{ fontWeight: "bold", padding: "12px 16px" }}>Đơn vị phụ trách</TableCell>
                <TableCell sx={{ fontWeight: "bold", padding: "12px 16px" }}>Thời gian dự kiến</TableCell>
                <TableCell sx={{ fontWeight: "bold", padding: "12px 16px" }}>Chi phí thực hiện</TableCell>
                <TableCell sx={{ fontWeight: "bold", padding: "12px 16px" }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: "bold", padding: "12px 16px" }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: "center", py: 3 }}>
                    Chưa có kế hoạch bảo trì nào được ghi nhận.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((m) => (
                  <TableRow key={m._id} sx={{ borderBottom: "1px solid #e0e0e0" }}>
                    <TableCell sx={{ padding: "12px 16px", fontWeight: 600 }}>{m.title}</TableCell>
                    <TableCell sx={{ padding: "12px 16px" }}>{m.facilityName}</TableCell>
                    <TableCell sx={{ padding: "12px 16px" }}>{m.assignedTo}</TableCell>
                    <TableCell sx={{ padding: "12px 16px" }}>
                      {formatDate(m.startDate)} - {formatDate(m.endDate)}
                    </TableCell>
                    <TableCell sx={{ padding: "12px 16px", color: "error.main", fontWeight: 700 }}>
                      {formatMoney(m.cost)}
                    </TableCell>
                    <TableCell sx={{ padding: "12px 16px" }}>{getStatusChip(m.status)}</TableCell>
                    <TableCell sx={{ padding: "12px 16px" }}>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <IconButton size="small" color="primary" onClick={() => handleOpenEdit(m)}>
                          <Edit size={16} />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDelete(m._id)}>
                          <Trash2 size={16} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog tạo/sửa lịch bảo trì */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editMode ? "Cập nhật lịch trình bảo trì" : "Tạo lịch trình bảo trì mới"}
        </DialogTitle>
        <DialogContent dividers>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Tiêu đề công việc <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Ví dụ: Kiểm tra định kỳ thang máy Block B"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Tên thiết bị/khu vực <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Ví dụ: Thang máy B01"
                  value={facilityName}
                  onChange={(e) => setFacilityName(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Đơn vị phụ trách <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Ví dụ: Công ty kỹ thuật Otis"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Ngày bắt đầu dự kiến <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Ngày hoàn thành dự kiến <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Ngân sách/Chi phí thực hiện (VNĐ)
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  placeholder="Nhập chi phí bảo trì..."
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Trạng thái bảo trì
                </Typography>
                <TextField
                  select
                  fullWidth
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value="PENDING">Chờ thực hiện</MenuItem>
                  <MenuItem value="IN_PROGRESS">Đang tiến hành</MenuItem>
                  <MenuItem value="COMPLETED">Đã hoàn thành</MenuItem>
                  <MenuItem value="CANCELLED">Đã hủy bỏ</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Mô tả chi tiết công việc <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Nội dung cần thực hiện bảo trì, các linh kiện kỹ thuật thay đổi..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setFormOpen(false)} sx={{ textTransform: "none" }}>
            Hủy
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={processing}
            sx={{ textTransform: "none", borderRadius: "6px" }}
          >
            {processing ? "Đang lưu..." : "Lưu kế hoạch"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
