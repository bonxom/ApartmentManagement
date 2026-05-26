import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Alert,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Search, Eye } from "lucide-react";
import KhaiBaoSinhTuForm from "../../../feature/admin/Form/KhaiBaoSinhTuForm";
import { requestAPI } from "../../../api/apiService";

const typeLabel = {
  BIRTH_REPORT: "Khai sinh",
  DEATH_REPORT: "Khai tử",
};

const statusMap = {
  PENDING: { label: "Chờ duyệt", color: "warning" },
  APPROVED: { label: "Đã duyệt", color: "success" },
  REJECTED: { label: "Từ chối", color: "error" },
};

function StatusChip({ status }) {
  const { label, color } = statusMap[status] || { label: status || "N/A", color: "default" };
  return <Chip size="small" label={label} color={color} />;
}

export default function DanhSachKhaiBaoSinhTu() {
  const [requests, setRequests] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const [birthRes, deathRes] = await Promise.all([
        requestAPI.getRequests({ type: "BIRTH_REPORT", status: "PENDING" }),
        requestAPI.getRequests({ type: "DEATH_REPORT", status: "PENDING" }),
      ]);
      const merged = [...(birthRes || []), ...(deathRes || [])].sort((a, b) => {
        const aTime = new Date(a.createdAt).getTime();
        const bTime = new Date(b.createdAt).getTime();
        return bTime - aTime;
      });
      setRequests(merged);
    } catch (err) {
      const msg = err?.message || err?.customMessage || "Không thể tải danh sách yêu cầu";
      setError(msg);
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
      const householdId = requester.household?.houseHoldID || requester.household || "";
      return (
        requester.name?.toLowerCase().includes(q) ||
        requester.email?.toLowerCase().includes(q) ||
        householdId.toLowerCase().includes(q) ||
        req.requestData?.name?.toLowerCase().includes(q)
      );
    });
  }, [requests, searchText]);

  const handleReview = async (request, status) => {
    setProcessingId(request._id);
    setError(null);
    try {
      await requestAPI.reviewRequest(request._id, status);
      setRequests((prev) => prev.filter((r) => r._id !== request._id));
      if (selectedRequest?._id === request._id) setSelectedRequest(null);
    } catch (err) {
      const msg = err?.message || err?.customMessage || "Xử lý yêu cầu thất bại";
      setError(msg);
    } finally {
      setProcessingId(null);
    }
  };

  const renderRow = (request) => {
    const requester = request.requester || {};
    const data = request.requestData || {};
    const householdId = requester.household?.houseHoldID || requester.household || "—";

    return (
      <TableRow key={request._id} sx={{ borderBottom: "1px solid #e0e0e0" }}>
        <TableCell sx={{ padding: "12px 16px" }}>{requester.name || "—"}</TableCell>
        <TableCell sx={{ padding: "12px 16px" }}>{householdId}</TableCell>
        <TableCell sx={{ padding: "12px 16px" }}>{typeLabel[request.type] || "—"}</TableCell>
        <TableCell sx={{ padding: "12px 16px" }}>
          {request.type === "BIRTH_REPORT" ? data.name || "—" : data.deceasedUserName || data.deceasedUserId || "—"}
        </TableCell>
        <TableCell sx={{ padding: "12px 16px" }}>
          <StatusChip status={request.status} />
        </TableCell>
        <TableCell sx={{ padding: "12px 16px" }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              color="success"
              size="small"
              disabled={processingId === request._id}
              onClick={() => handleReview(request, "APPROVED")}
            >
              Duyệt
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              disabled={processingId === request._id}
              onClick={() => handleReview(request, "REJECTED")}
            >
              Từ chối
            </Button>
            <Button
              variant="outlined"
              size="small"
              sx={{ textTransform: "none", minWidth: "40px", padding: "4px 8px" }}
              onClick={() => setSelectedRequest(request)}
            >
              <Eye size={16} />
            </Button>
          </Box>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Danh sách khai báo sinh tử
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
          <Typography sx={{ fontSize: "13px", mb: 1 }}>Tìm kiếm</Typography>
          <TextField
            fullWidth
            placeholder="Nhập chủ hộ, mã hộ, tên bé hoặc người mất..."
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
                <TableCell sx={{ fontWeight: "bold", padding: "12px 16px" }}>
                  Chủ hộ
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", padding: "12px 16px" }}>
                  Mã hộ gia đình
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", padding: "12px 16px" }}>
                  Phân loại
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", padding: "12px 16px" }}>
                  Đối tượng
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", padding: "12px 16px" }}>
                  Trạng thái
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", padding: "12px 16px" }}>
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: "center", py: 3 }}>
                    Không có yêu cầu nào.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((request) => renderRow(request))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <KhaiBaoSinhTuForm
        open={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        request={selectedRequest}
        onApprove={() => selectedRequest && handleReview(selectedRequest, "APPROVED")}
        onReject={() => selectedRequest && handleReview(selectedRequest, "REJECTED")}
      />
    </div>
  );
}
