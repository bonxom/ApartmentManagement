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

export default function DanhSachPhanAnh() {
  const [requests, setRequests] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [comment, setComment] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await requestAPI.getRequests({ type: "FEEDBACK", status: "PENDING" });
      setRequests(data || []);
    } catch (err) {
      setError(err?.message || "Không thể tải danh sách phản ánh");
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
        data.title?.toLowerCase().includes(q) ||
        data.content?.toLowerCase().includes(q)
      );
    });
  }, [requests, searchText]);

  const handleReview = async (request, status) => {
    setProcessingId(request._id);
    setError(null);
    try {
      await requestAPI.reviewRequest(request._id, status, comment.trim());
      setRequests((prev) => prev.filter((item) => item._id !== request._id));
      setDetailOpen(false);
      setSelectedRequest(null);
      setComment("");
    } catch (err) {
      setError(err?.message || "Xử lý yêu cầu thất bại");
    } finally {
      setProcessingId(null);
    }
  };

  const handleOpenDetail = (request) => {
    setSelectedRequest(request);
    setComment("");
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
        <TableCell sx={{ padding: "12px 16px", fontWeight: 600 }}>{data.title || "—"}</TableCell>
        <TableCell sx={{ padding: "12px 16px" }}>
          <Chip
            size="small"
            label={data.category || "Ý kiến khác"}
            color="primary"
            variant="outlined"
          />
        </TableCell>
        <TableCell sx={{ padding: "12px 16px" }}>
          <Chip
            size="small"
            label={data.urgency || "Thường"}
            color={data.urgency === "Khẩn cấp" ? "error" : "default"}
            sx={{ fontWeight: data.urgency === "Khẩn cấp" ? 700 : 500 }}
          />
        </TableCell>
        <TableCell sx={{ padding: "12px 16px" }}>{formattedDate}</TableCell>
        <TableCell sx={{ padding: "12px 16px" }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleOpenDetail(request)}
            startIcon={<Eye size={14} />}
            sx={{ textTransform: "none" }}
          >
            Chi tiết & Xử lý
          </Button>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Danh sách phản ánh dịch vụ cư dân
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
          <Typography sx={{ fontSize: "13px", mb: 1 }}>Tìm kiếm phản ánh</Typography>
          <TextField
            fullWidth
            placeholder="Nhập tên cư dân, mã hộ khẩu hoặc tiêu đề phản ánh..."
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
                <TableCell sx={{ fontWeight: "bold", padding: "12px 16px" }}>Cư dân phản ánh</TableCell>
                <TableCell sx={{ fontWeight: "bold", padding: "12px 16px" }}>Mã hộ</TableCell>
                <TableCell sx={{ fontWeight: "bold", padding: "12px 16px" }}>Tiêu đề</TableCell>
                <TableCell sx={{ fontWeight: "bold", padding: "12px 16px" }}>Danh mục</TableCell>
                <TableCell sx={{ fontWeight: "bold", padding: "12px 16px" }}>Mức khẩn cấp</TableCell>
                <TableCell sx={{ fontWeight: "bold", padding: "12px 16px" }}>Thời gian gửi</TableCell>
                <TableCell sx={{ fontWeight: "bold", padding: "12px 16px" }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: "center", py: 3 }}>
                    Không có đơn phản ánh nào chưa xử lý.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((request) => renderRow(request))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog xem chi tiết & phê duyệt xử lý */}
      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Chi tiết phản ánh dịch vụ</DialogTitle>
        <DialogContent dividers>
          {selectedRequest && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Người phản ánh</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {selectedRequest.requester?.name} (Hộ: {selectedRequest.requester?.household?.houseHoldID || "—"} - {selectedRequest.requester?.household?.address || "—"})
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Danh mục</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedRequest.requestData?.category}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Độ khẩn cấp</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedRequest.requestData?.urgency}</Typography>
                </Box>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Tiêu đề phản ánh</Typography>
                <Typography variant="body1" sx={{ fontWeight: 700, color: "primary.main" }}>
                  {selectedRequest.requestData?.title}
                </Typography>
              </Box>
              <Box sx={{ p: 2, backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <Typography variant="caption" color="text.secondary">Nội dung chi tiết</Typography>
                <Typography variant="body2" style={{ whiteSpace: "pre-line", marginTop: "4px" }}>
                  {selectedRequest.requestData?.content}
                </Typography>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
                  Ý kiến phản hồi / Chỉ đạo xử lý của Tổ trưởng
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Ví dụ: Đã ghi nhận phản ánh và chuyển giao ban quản lý kỹ thuật khắc phục sự cố này."
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
            Từ chối tiếp nhận
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => selectedRequest && handleReview(selectedRequest, "APPROVED")}
            disabled={processingId === selectedRequest?._id}
            sx={{ textTransform: "none", borderRadius: "6px" }}
          >
            Duyệt tiếp nhận
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
