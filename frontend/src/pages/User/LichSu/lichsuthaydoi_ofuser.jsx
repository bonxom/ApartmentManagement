import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
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
} from "@mui/material";
import useAuthStore from "../../../store/authStore";
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
        <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
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

export default function LichSuThayDoi() {
  const { user } = useAuthStore();
  const householdId =
    typeof user?.household === "string" ? user.household : user?.household?._id;

  const [household, setHousehold] = useState(null);
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    if (!householdId) return;
    setLoading(true);
    setError(null);
    try {
      const [householdRes, changeRes] = await Promise.all([
        householdAPI.getById(householdId),
        householdAPI.getTamTruVangDetails(householdId),
      ]);
      setHousehold(householdRes || null);
      setHistory(changeRes?.temporaryHistory || null);
    } catch (err) {
      const msg =
        err?.message || err?.customMessage || "Không thể tải lịch sử thay đổi";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (householdId) {
      fetchHistory();
    }
  }, [householdId]);

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

      {!householdId && (
        <Alert severity="warning">
          Bạn chưa thuộc hộ khẩu nào nên không xem được lịch sử thay đổi.
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : householdId ? (
        <>
          {household && (
            <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
              <Typography sx={{ fontWeight: 700 }}>
                Mã hộ: {household.houseHoldID}
              </Typography>
              <Typography sx={{ color: "#475569" }}>
                Địa chỉ: {household.address || "-"}
              </Typography>
              <Typography sx={{ color: "#0F172A" }}>
                Chủ hộ: {household.leader?.name || "-"}{" "}
                {household.leader?.userCardID
                  ? `(${household.leader.userCardID})`
                  : ""}
              </Typography>
            </Paper>
          )}

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
      ) : null}
    </Box>
  );
}
