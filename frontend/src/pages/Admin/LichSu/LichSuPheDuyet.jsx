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
  Tabs,
  Tab,
  TextField,
  Chip,
  Alert,
  CircularProgress,
  Button,
  InputAdornment,
} from "@mui/material";
import { Search } from "lucide-react";
import { requestAPI } from "../../../api/apiService";

const statusMap = {
  PENDING: { label: "Chờ duyệt", color: "warning" },
  APPROVED: { label: "Đã duyệt", color: "success" },
  REJECTED: { label: "Từ chối", color: "error" },
};

const ROWS_PER_PAGE = 10;

const formatDateTime = (value) =>
  value ? new Date(value).toLocaleString("vi-VN") : "-";

const sortByCreatedAtDesc = (list) =>
  [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

export default function LichSuPheDuyetTaiKhoanHoDan() {
  const [activeTab, setActiveTab] = useState("REGISTER");
  const [registerRequests, setRegisterRequests] = useState([]);
  const [birthDeathRequests, setBirthDeathRequests] = useState([]);
  const [residenceRequests, setResidenceRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [pageByTab, setPageByTab] = useState({
    REGISTER: 1,
    BIRTH_DEATH: 1,
    RESIDENCE: 1,
  });

  const activeCount =
    activeTab === "REGISTER"
      ? registerRequests.length
      : activeTab === "BIRTH_DEATH"
      ? birthDeathRequests.length
      : residenceRequests.length;

  const fetchAllRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        registerRes,
        birthRes,
        deathRes,
        residenceRes,
        absentRes,
      ] = await Promise.all([
        requestAPI.getRequests({ type: "REGISTER" }),
        requestAPI.getRequests({ type: "BIRTH_REPORT" }),
        requestAPI.getRequests({ type: "DEATH_REPORT" }),
        requestAPI.getRequests({ type: "TEMPORARY_RESIDENCE" }),
        requestAPI.getRequests({ type: "TEMPORARY_ABSENT" }),
      ]);

      setRegisterRequests(registerRes || []);
      setBirthDeathRequests(
        sortByCreatedAtDesc([...(birthRes || []), ...(deathRes || [])])
      );
      setResidenceRequests(
        sortByCreatedAtDesc([...(residenceRes || []), ...(absentRes || [])])
      );
    } catch (err) {
      const msg =
        err?.message || err?.customMessage || "Không thể tải lịch sử phê duyệt";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRequests();
  }, []);

  useEffect(() => {
    setPageByTab((prev) => ({ ...prev, [activeTab]: 1 }));
  }, [activeTab, searchText, activeCount]);

  const activeRequests =
    activeTab === "REGISTER"
      ? registerRequests
      : activeTab === "BIRTH_DEATH"
      ? birthDeathRequests
      : residenceRequests;

  const filtered = useMemo(() => {
    if (!searchText.trim()) return activeRequests;
    const q = searchText.toLowerCase();

    if (activeTab === "REGISTER") {
      return activeRequests.filter((req) => {
        const requester = req.requester || {};
        const note = req.leaderComment || req.requestData?.note || "";
        const statusLabel = statusMap[req.status]?.label || req.status || "";
        return (
          (requester.name || "").toLowerCase().includes(q) ||
          (requester.email || "").toLowerCase().includes(q) ||
          String(requester.userCardID || "").toLowerCase().includes(q) ||
          note.toLowerCase().includes(q) ||
          statusLabel.toLowerCase().includes(q)
        );
      });
    }

    if (activeTab === "BIRTH_DEATH") {
      return activeRequests.filter((req) => {
        const typeLabel = req.type === "BIRTH_REPORT" ? "Khai sinh" : "Khai tử";
        const subject =
          req.type === "BIRTH_REPORT"
            ? req.requestData?.name
            : req.requestData?.deceasedUserName || req.requestData?.deceasedUserId;
        const note = req.leaderComment || req.requestData?.note || "";
        const statusLabel = statusMap[req.status]?.label || req.status || "";
        return (
          (subject || "").toLowerCase().includes(q) ||
          typeLabel.toLowerCase().includes(q) ||
          note.toLowerCase().includes(q) ||
          statusLabel.toLowerCase().includes(q)
        );
      });
    }

    return activeRequests.filter((req) => {
      const typeLabel =
        req.type === "TEMPORARY_RESIDENCE" ? "Tạm trú" : "Tạm vắng";
      const subject =
        req.type === "TEMPORARY_RESIDENCE"
          ? req.requestData?.name
          : req.requestData?.absentUserName || req.requestData?.absentUserId;
      const reason = req.requestData?.reason || "";
      const note = req.leaderComment || "";
      const statusLabel = statusMap[req.status]?.label || req.status || "";
      return (
        (subject || "").toLowerCase().includes(q) ||
        typeLabel.toLowerCase().includes(q) ||
        reason.toLowerCase().includes(q) ||
        note.toLowerCase().includes(q) ||
        statusLabel.toLowerCase().includes(q)
      );
    });
  }, [activeRequests, activeTab, searchText]);

  const activePage = pageByTab[activeTab] || 1;
  const pageCount = Math.ceil(filtered.length / ROWS_PER_PAGE) || 1;
  const visibleRows = filtered.slice(
    (activePage - 1) * ROWS_PER_PAGE,
    activePage * ROWS_PER_PAGE
  );

  const renderStatusChip = (status) => {
    const info = statusMap[status] || { label: status || "N/A", color: "default" };
    return <Chip size="small" label={info.label} color={info.color} />;
  };

  const renderRegisterTable = () => (
    <Table>
      <TableHead sx={{ backgroundColor: "#F8FAFC" }}>
        <TableRow>
          <TableCell>Thời gian</TableCell>
          <TableCell>Trạng thái</TableCell>
          <TableCell>Họ tên</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>CCCD</TableCell>
          <TableCell>Ghi chú</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {visibleRows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} align="center">
              Không có yêu cầu nào.
            </TableCell>
          </TableRow>
        ) : (
          visibleRows.map((req) => {
            const requester = req.requester || {};
            const note = req.leaderComment || req.requestData?.note || "-";
            return (
              <TableRow key={req._id} hover>
                <TableCell>{formatDateTime(req.createdAt)}</TableCell>
                <TableCell>{renderStatusChip(req.status)}</TableCell>
                <TableCell>{requester.name || "-"}</TableCell>
                <TableCell>{requester.email || "-"}</TableCell>
                <TableCell>{requester.userCardID || "-"}</TableCell>
                <TableCell>{note}</TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );

  const renderBirthDeathTable = () => (
    <Table>
      <TableHead sx={{ backgroundColor: "#F8FAFC" }}>
        <TableRow>
          <TableCell>Thời gian</TableCell>
          <TableCell>Loại</TableCell>
          <TableCell>Đối tượng</TableCell>
          <TableCell>Ngày sinh/tử</TableCell>
          <TableCell>Trạng thái</TableCell>
          <TableCell>Ghi chú</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {visibleRows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} align="center">
              Không có yêu cầu nào.
            </TableCell>
          </TableRow>
        ) : (
          visibleRows.map((req) => {
            const typeLabel = req.type === "BIRTH_REPORT" ? "Khai sinh" : "Khai tử";
            const subject =
              req.type === "BIRTH_REPORT"
                ? req.requestData?.name
                : req.requestData?.deceasedUserName || req.requestData?.deceasedUserId;
            const dateValue =
              req.type === "BIRTH_REPORT"
                ? req.requestData?.dob
                : req.requestData?.dateOfDeath;
            const note = req.leaderComment || req.requestData?.note || "-";
            return (
              <TableRow key={req._id} hover>
                <TableCell>{formatDateTime(req.createdAt)}</TableCell>
                <TableCell>{typeLabel}</TableCell>
                <TableCell>{subject || "-"}</TableCell>
                <TableCell>{formatDateTime(dateValue)}</TableCell>
                <TableCell>{renderStatusChip(req.status)}</TableCell>
                <TableCell>{note}</TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );

  const renderResidenceTable = () => (
    <Table>
      <TableHead sx={{ backgroundColor: "#F8FAFC" }}>
        <TableRow>
          <TableCell>Thời gian</TableCell>
          <TableCell>Loại</TableCell>
          <TableCell>Đối tượng</TableCell>
          <TableCell>Từ ngày</TableCell>
          <TableCell>Đến ngày</TableCell>
          <TableCell>Lý do</TableCell>
          <TableCell>Trạng thái</TableCell>
          <TableCell>Ghi chú</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {visibleRows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} align="center">
              Không có yêu cầu nào.
            </TableCell>
          </TableRow>
        ) : (
          visibleRows.map((req) => {
            const typeLabel =
              req.type === "TEMPORARY_RESIDENCE" ? "Tạm trú" : "Tạm vắng";
            const subject =
              req.type === "TEMPORARY_RESIDENCE"
                ? req.requestData?.name
                : req.requestData?.absentUserName || req.requestData?.absentUserId;
            const note = req.leaderComment || "-";
            return (
              <TableRow key={req._id} hover>
                <TableCell>{formatDateTime(req.createdAt)}</TableCell>
                <TableCell>{typeLabel}</TableCell>
                <TableCell>{subject || "-"}</TableCell>
                <TableCell>{formatDateTime(req.requestData?.startDate)}</TableCell>
                <TableCell>{formatDateTime(req.requestData?.endDate)}</TableCell>
                <TableCell>{req.requestData?.reason || "-"}</TableCell>
                <TableCell>{renderStatusChip(req.status)}</TableCell>
                <TableCell>{note}</TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );

  return (
    <Box sx={{ padding: "24px 32px" }}>
      <Typography sx={{ fontSize: 26, fontWeight: 600, mb: 2 }}>
        Lịch sử phê duyệt
      </Typography>

      <Tabs
        value={activeTab}
        onChange={(_, value) => setActiveTab(value)}
        sx={{ mb: 2 }}
      >
        <Tab value="REGISTER" label="Đăng ký tài khoản" />
        <Tab value="BIRTH_DEATH" label="Khai sinh / Khai tử" />
        <Tab value="RESIDENCE" label="Tạm trú / Tạm vắng" />
      </Tabs>

      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0px 3px 12px rgba(0,0,0,0.1)",
          p: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            backgroundColor: "white",
            padding: "22px",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: "13px", mb: 1 }}>Tìm kiếm</Typography>
            <TextField
              fullWidth
              placeholder="Nhập từ khóa tìm kiếm..."
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
                  "& fieldset": { border: "none" },
                },
              }}
            />
          </Box>
          <Box sx={{ alignSelf: "flex-end" }}>
            <Button
              variant="contained"
              onClick={fetchAllRequests}
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
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
              {activeTab === "REGISTER"
                ? renderRegisterTable()
                : activeTab === "BIRTH_DEATH"
                ? renderBirthDeathTable()
                : renderResidenceTable()}
            </TableContainer>

            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <Pagination
                count={pageCount}
                page={activePage}
                onChange={(e, v) =>
                  setPageByTab((prev) => ({ ...prev, [activeTab]: v }))
                }
              />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
