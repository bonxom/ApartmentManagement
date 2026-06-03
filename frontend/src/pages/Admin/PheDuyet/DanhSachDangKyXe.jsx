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
} from "@mui/material";
import { Search, Eye } from "lucide-react";
import { requestAPI } from "../../../api/apiService";

export default function DanhSachDangKyXe() {
  const [requests, setRequests] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [parkingCardId, setParkingCardId] = useState("");
  const [comment, setComment] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await requestAPI.getRequests({ type: "VEHICLE_REGISTRATION", status: "PENDING" });
      setRequests(data || []);
    } catch (err) {
      setError(err?.message || "Không thể tải danh sách đăng ký gửi xe");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredData = useMemo(() => {
    if (!searchText.trim()) return requests;
    const q = searchText.toLowerCase();
    return requests.filter((req) => {
      const requester = req.requester || {};
      const data = req.requestData || {};
      const householdId = requester.household?.houseHoldID || "";
      return (
        requester.name?.toLowerCase().includes(q) ||
        householdId.toLowerCase().includes(q) ||
        data.licensePlate?.toLowerCase().includes(q) ||
        data.brand?.toLowerCase().includes(q)
      );
    });
  }, [requests, searchText]);

  const handleReview = async (request, status) => {
    setProcessingId(request._id);
    setError(null);
    try {
      let finalComment = comment.trim();
      if (status === "APPROVED" && parkingCardId.trim()) {
        finalComment = `Đã duyệt cấp thẻ gửi xe mã: ${parkingCardId.trim()}. ${finalComment}`;
      }
      await requestAPI.reviewRequest(request._id, status, finalComment);
      setRequests((prev) => prev.filter((item) => item._id !== request._id));
      setDetailOpen(false);
      setSelectedRequest(null);
      setComment("");
      setParkingCardId("");
    } catch (err) {
      setError(err?.message || "Xử lý yêu cầu thất bại");
    } finally {
      setProcessingId(null);
    }
  };

  const handleOpenDetail = (request) => {
    setSelectedRequest(request);
    setComment("");
    setParkingCardId(`PK-${request.requester?.household?.houseHoldID || "GEN"}-${Math.floor(100 + Math.random() * 900)}`);
    setDetailOpen(true);
  };

  const renderRow = (request) => {
    const requester = request.requester || {};
    const data = request.requestData || {};
    const householdId = requester.household?.houseHoldID || "—";
    const formattedDate = new Date(request.createdAt).toLocaleDateString("vi-VN") + " " + new Date(request.createdAt).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' });

    return (
      <TableRow key={request._id} sx={{ borderBottom: "1px solid #e0e0e0" }}>
        <TableCell sx={{ padding: "12px 16px" }}>{requester.name || "—"}</TableCell>
        <TableCell sx={{ padding: "12px 16px" }}>{householdId}</TableCell>
        <TableCell sx={{ padding: "12px 16px" }}>
          <Chip
            size="small"
            label={data.vehicleType || "Xe máy"}
            sx={{
              backgroundColor: data.vehicleType === "Ô tô" ? "#e3f2fd" : "#e6f4ea",
              color: data.vehicleType === "Ô tô" ? "#1565c0" : "#137333",
              fontWeight: 600,
            }}
          />
        </TableCell>
        <TableCell sx={{ padding: "12px 16px", fontWeight: 700, color: "primary.main" }}>{data.licensePlate || "—"}</TableCell>
        <TableCell sx={{ padding: "12px 16px" }}>{data.brand || "—"}</TableCell>
        <TableCell sx={{ padding: "12px 16px" }}>{data.color || "—"}</TableCell>
        <TableCell sx={{ padding: "12px 16px" }}>{formattedDate}</TableCell>
        <TableCell sx={{ padding: "12px 16px" }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleOpenDetail(request)}
            startIcon={<Eye size={14} />}
            sx={{ textTransform: "none" }}
          >
            Chi tiết & Cấp thẻ
          </Button>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Danh sách đăng ký gửi xe chung cư
        </Typography>
        <Button
          variant="contained"
          onClick={fetchRequests}
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
          mt: 2,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: "13px", mb: 1 }}>Tìm kiếm đăng ký xe</Typography>
          <TextField
            fullWidth
            placeholder="Nhập tên cư dân, biển số xe, nhãn hiệu hoặc mã hộ..."
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
        <Alert severity="error" sx={{ mt: 2 }}>
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
                <TableCell sx={{ fontWeight: "bold", padding: "12px 16px" }}>Chủ phương tiện</TableCell>
                <TableCell sx={{ fontWeight: "bold", padding: "12px 16px" }}>Mã hộ</TableCell>
                <TableCell sx={{ fontWeight: "bold", padding: "12px 16px" }}>Loại xe</TableCell>
                <TableCell sx={{ fontWeight: "bold", padding: "12px 16px" }}>Biển số xe</TableCell>
                <TableCell sx={{ fontWeight: "bold", padding: "12px 16px" }}>Nhãn hiệu</TableCell>
                <TableCell sx={{ fontWeight: "bold", padding: "12px 16px" }}>Màu sắc</TableCell>
                <TableCell sx={{ fontWeight: "bold", padding: "12px 16px" }}>Thời gian đăng ký</TableCell>
                <TableCell sx={{ fontWeight: "bold", padding: "12px 16px" }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} sx={{ textAlign: "center", py: 3 }}>
                    Không có đăng ký xe nào chưa duyệt.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((request) => renderRow(request))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog xem chi tiết & phê duyệt cấp thẻ */}
      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Thông tin chi tiết Đăng ký gửi xe</DialogTitle>
        <DialogContent dividers>
          {selectedRequest && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Chủ phương tiện</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {selectedRequest.requester?.name} (Hộ: {selectedRequest.requester?.household?.houseHoldID || "—"} - {selectedRequest.requester?.household?.address || "—"})
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Loại xe</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedRequest.requestData?.vehicleType}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Biển số xe</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "primary.main" }}>{selectedRequest.requestData?.licensePlate}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Nhãn hiệu xe</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedRequest.requestData?.brand}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Màu sắc</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedRequest.requestData?.color}</Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 1 }} />

              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
                  Mã thẻ gửi xe cấp phát <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Nhập mã số thẻ gửi xe được cấp..."
                  value={parkingCardId}
                  onChange={(e) => setParkingCardId(e.target.value)}
                />
              </Box>

              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
                  Ghi chú phê duyệt
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Ví dụ: Đã hoàn tất đối soát thông tin và cấp thẻ gửi xe."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setDetailOpen(false)} sx={{ textTransform: "none" }}>
            Đóng
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => selectedRequest && handleReview(selectedRequest, "REJECTED")}
            disabled={processingId === selectedRequest?._id}
            sx={{ textTransform: "none", borderRadius: "6px" }}
          >
            Từ chối duyệt
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => selectedRequest && handleReview(selectedRequest, "APPROVED")}
            disabled={processingId === selectedRequest?._id || !parkingCardId.trim()}
            sx={{ textTransform: "none", borderRadius: "6px" }}
          >
            Phê duyệt & Cấp thẻ
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
