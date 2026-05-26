import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  InputAdornment,
} from "@mui/material";
import { Search } from "lucide-react";
import { householdAPI } from "../../../api/apiService";

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("vi-VN") : "-";

const formatDateTime = (value) =>
  value ? new Date(value).toLocaleString("vi-VN") : "-";

const sortByDateDesc = (items, key) =>
  [...items].sort((a, b) => {
    const aTime = a?.[key] ? new Date(a[key]).getTime() : 0;
    const bTime = b?.[key] ? new Date(b[key]).getTime() : 0;
    return bTime - aTime;
  });

const StatusChip = ({ active }) => (
  <Chip
    size="small"
    label={active ? "Đang hiệu lực" : "Đã kết thúc"}
    color={active ? "success" : "default"}
  />
);

function TemporaryResidentsTable({ rows }) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead sx={{ backgroundColor: "#F8FAFC" }}>
          <TableRow>
            <TableCell>Họ tên</TableCell>
            <TableCell>CCCD</TableCell>
            <TableCell>Từ ngày</TableCell>
            <TableCell>Đến ngày</TableCell>
            <TableCell>Lý do</TableCell>
            <TableCell>Trạng thái</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                Không có dữ liệu.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row._id} hover>
                <TableCell>{row.name || "-"}</TableCell>
                <TableCell>{row.userCardID || "-"}</TableCell>
                <TableCell>{formatDate(row.startDate)}</TableCell>
                <TableCell>{formatDate(row.endDate)}</TableCell>
                <TableCell>{row.reason || "-"}</TableCell>
                <TableCell>
                  <StatusChip active={row.isActive !== false} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function TemporaryAbsentTable({ rows }) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead sx={{ backgroundColor: "#F8FAFC" }}>
          <TableRow>
            <TableCell>Họ tên</TableCell>
            <TableCell>Từ ngày</TableCell>
            <TableCell>Đến ngày</TableCell>
            <TableCell>Lý do</TableCell>
            <TableCell>Địa chỉ tạm trú</TableCell>
            <TableCell>Trạng thái</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                Không có dữ liệu.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row._id} hover>
                <TableCell>{row.user?.name || "-"}</TableCell>
                <TableCell>{formatDate(row.startDate)}</TableCell>
                <TableCell>{formatDate(row.endDate)}</TableCell>
                <TableCell>{row.reason || "-"}</TableCell>
                <TableCell>{row.temporaryAddress || "-"}</TableCell>
                <TableCell>
                  <StatusChip active={row.isActive !== false} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function BirthTable({ rows }) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead sx={{ backgroundColor: "#F8FAFC" }}>
          <TableRow>
            <TableCell>Họ tên</TableCell>
            <TableCell>Ngày sinh</TableCell>
            <TableCell>Giới tính</TableCell>
            <TableCell>Nơi sinh</TableCell>
            <TableCell>Số giấy khai sinh</TableCell>
            <TableCell>Ngày ghi nhận</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                Không có dữ liệu.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row._id} hover>
                <TableCell>{row.name || "-"}</TableCell>
                <TableCell>{formatDate(row.dob)}</TableCell>
                <TableCell>{row.sex || "-"}</TableCell>
                <TableCell>{row.birthLocation || "-"}</TableCell>
                <TableCell>{row.birthCertificateNumber || "-"}</TableCell>
                <TableCell>{formatDateTime(row.createdAt)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function DeathTable({ rows }) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead sx={{ backgroundColor: "#F8FAFC" }}>
          <TableRow>
            <TableCell>Họ tên</TableCell>
            <TableCell>CCCD</TableCell>
            <TableCell>Ngày mất</TableCell>
            <TableCell>Lý do</TableCell>
            <TableCell>Ngày ghi nhận</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                Không có dữ liệu.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row._id} hover>
                <TableCell>{row.name || "-"}</TableCell>
                <TableCell>{row.userCardID || "-"}</TableCell>
                <TableCell>{formatDate(row.dateOfDeath)}</TableCell>
                <TableCell>{row.reason || "-"}</TableCell>
                <TableCell>{formatDateTime(row.createdAt)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function LichSuThayDoiTheoHoDan() {
  const [households, setHouseholds] = useState([]);
  const [selectedHouseholdId, setSelectedHouseholdId] = useState("");
  const [selectedHousehold, setSelectedHousehold] = useState(null);
  const [history, setHistory] = useState(null);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState(null);

  const fetchHouseholds = async () => {
    setLoadingList(true);
    setError(null);
    try {
      const res = await householdAPI.getAll();
      setHouseholds(res || []);
    } catch (err) {
      const msg = err?.message || err?.customMessage || "Không thể tải danh sách hộ";
      setError(msg);
    } finally {
      setLoadingList(false);
    }
  };

  const fetchHistory = async (householdId) => {
    if (!householdId) return;
    setLoadingHistory(true);
    setError(null);
    try {
      const res = await householdAPI.getTamTruVangDetails(householdId);
      setHistory(res?.temporaryHistory || null);
    } catch (err) {
      const msg = err?.message || err?.customMessage || "Không thể tải lịch sử thay đổi";
      setError(msg);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHouseholds();
  }, []);

  useEffect(() => {
    if (!selectedHouseholdId) {
      setHistory(null);
      setSelectedHousehold(null);
      return;
    }
    const current = households.find((h) => h._id === selectedHouseholdId);
    setSelectedHousehold(current || null);
    fetchHistory(selectedHouseholdId);
  }, [selectedHouseholdId, households]);

  const temporaryResidents = useMemo(
    () => sortByDateDesc(history?.temporaryResidents || [], "startDate"),
    [history]
  );
  const temporaryAbsent = useMemo(
    () => sortByDateDesc(history?.temporaryAbsent || [], "startDate"),
    [history]
  );
  const births = useMemo(
    () => sortByDateDesc(history?.births || [], "createdAt"),
    [history]
  );
  const deaths = useMemo(
    () => sortByDateDesc(history?.deaths || [], "createdAt"),
    [history]
  );

  return (
    <Box sx={{ padding: "24px 32px" }}>
      <Typography sx={{ fontSize: 26, fontWeight: 600, mb: 3 }}>
        Lịch sử thay đổi của hộ dân
      </Typography>

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
          <Typography sx={{ fontSize: "13px", mb: 1 }}>Chọn hộ khẩu</Typography>
          <TextField
            select
            fullWidth
            value={selectedHouseholdId}
            onChange={(e) => setSelectedHouseholdId(e.target.value)}
            SelectProps={{ displayEmpty: true }}
            disabled={loadingList}
            placeholder="Chọn hộ để xem lịch sử thay đổi"
            sx={{
              "& .MuiOutlinedInput-root": {
                background: "#F1F3F6",
                borderRadius: "8px",
                height: "40px",
                "& fieldset": { border: "none" },
              },
              "& .MuiInputBase-input": {
                padding: "10px 14px",
              },
            }}
          >
            <MenuItem value="">
              <em>Chọn hộ khẩu</em>
            </MenuItem>
            {households.map((household) => (
              <MenuItem key={household._id} value={household._id}>
                {household.houseHoldID} - {household.address}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box sx={{ alignSelf: "flex-end" }}>
          <Button
            variant="contained"
            onClick={fetchHouseholds}
            disabled={loadingList}
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

      {selectedHousehold && (
        <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Typography sx={{ fontWeight: 700 }}>
            Mã hộ: {selectedHousehold.houseHoldID}
          </Typography>
          <Typography sx={{ color: "#475569" }}>
            Địa chỉ: {selectedHousehold.address || "-"}
          </Typography>
          <Typography sx={{ color: "#0F172A" }}>
            Chủ hộ: {selectedHousehold.leader?.name || "-"}{" "}
            {selectedHousehold.leader?.userCardID
              ? `(${selectedHousehold.leader.userCardID})`
              : ""}
          </Typography>
        </Paper>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!selectedHouseholdId ? (
        <Alert severity="info">Chọn hộ khẩu để xem lịch sử thay đổi.</Alert>
      ) : loadingHistory ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 1 }}>
            Tạm trú
          </Typography>
          <TemporaryResidentsTable rows={temporaryResidents} />

          <Divider sx={{ my: 3 }} />

          <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 1 }}>
            Tạm vắng
          </Typography>
          <TemporaryAbsentTable rows={temporaryAbsent} />

          <Divider sx={{ my: 3 }} />

          <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 1 }}>
            Khai sinh
          </Typography>
          <BirthTable rows={births} />

          <Divider sx={{ my: 3 }} />

          <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 1 }}>
            Khai tử
          </Typography>
          <DeathTable rows={deaths} />
        </>
      )}
    </Box>
  );
}
