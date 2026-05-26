import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  TextField,
  InputAdornment,
  Chip,
  Alert,
  CircularProgress,
  Button,
} from "@mui/material";
import { Search } from "lucide-react";
import { requestAPI } from "../../../api/apiService";

const statusMap = {
  PENDING: { label: "Chờ duyệt", color: "warning" },
  APPROVED: { label: "Đã duyệt", color: "success" },
  REJECTED: { label: "Từ chối", color: "error" },
};

const formatMoney = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed.toLocaleString("vi-VN") + " đ" : "-";
};

const formatDateTime = (value) =>
  value ? new Date(value).toLocaleString("vi-VN") : "-";

export default function Lichsugiaodich() {
  const [requests, setRequests] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const ROWS_PER_PAGE = 5;

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await requestAPI.getMyHouseholdPaymentRequests();
      setRequests(res || []);
    } catch (err) {
      const msg = err?.message || err?.customMessage || "Không thể tải lịch sử yêu cầu";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchText, requests.length]);

  const filtered = useMemo(() => {
    if (!searchText.trim()) return requests;
    const q = searchText.toLowerCase();
    return requests.filter((req) => {
      const requesterName = req.requester?.name || "";
      const feeName = req.requestData?.feeName || "";
      const note = req.requestData?.note || "";
      const statusLabel = statusMap[req.status]?.label || req.status || "";
      return (
        requesterName.toLowerCase().includes(q) ||
        feeName.toLowerCase().includes(q) ||
        note.toLowerCase().includes(q) ||
        statusLabel.toLowerCase().includes(q)
      );
    });
  }, [requests, searchText]);

  const pageCount = Math.ceil(filtered.length / ROWS_PER_PAGE) || 1;

  const visibleRows = useMemo(
    () => filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE),
    [filtered, page]
  );

  return (
    <Box sx={{ padding: "24px 32px", backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography sx={{ fontSize: 24, fontWeight: 700, color: "#333" }}>
          Lịch sử yêu cầu thanh toán
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

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

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
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: "13px", mb: 1 }}>Tìm kiếm</Typography>
          <TextField
            fullWidth
            placeholder="Nhập người gửi, khoản thu, ghi chú, trạng thái..."
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

      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
          p: 2,
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{ border: "1px solid #efefef", borderRadius: 3 }}
            >
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ backgroundColor: "#F8FAFC" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Khoản thu</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">
                      Số tiền
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Thời gian gửi</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Ghi chú</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        Không có yêu cầu nào.
                      </TableCell>
                    </TableRow>
                  ) : (
                    visibleRows.map((req) => {
                      const statusInfo = statusMap[req.status] || {
                        label: req.status || "N/A",
                        color: "default",
                      };
                      return (
                        <TableRow
                          key={req._id}
                          hover
                          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                        >
                          <TableCell>{req.requestData?.feeName || "-"}</TableCell>
                          <TableCell align="right">
                            {formatMoney(req.requestData?.amount)}
                          </TableCell>
                          <TableCell>
                            <Chip size="small" label={statusInfo.label} color={statusInfo.color} />
                          </TableCell>
                          <TableCell>{formatDateTime(req.createdAt)}</TableCell>
                          <TableCell>{req.requestData?.note || "-"}</TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <Pagination
                count={pageCount}
                page={page}
                onChange={(e, v) => setPage(v)}
                shape="rounded"
                size="small"
              />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
