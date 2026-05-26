import React, { useMemo, useState } from "react";
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
  Chip,
  Button,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import useAuthStore from "../../../../store/authStore";

/* ================== MOCK DATA: CHI TIẾT THAY ĐỔI THEO HỘ ================== */

const mockChangeDetailByHousehold = {
  HD00123: {
    householdCode: "HD00123",
    cccdChuHo: "012345678901",
    chuHo: "Nguyễn Văn A",
    logs: [
      {
        logId: "log_001",
        time: "15/12/2025 08:30",
        action: "ADD", // ADD | DELETE
        cccd: "012345678904",
        fullName: "Lê Văn D",
        relation: "Anh trai",
        dob: "15/06/1978",
        actor: "canbo_phuong01",
        note: "Bổ sung nhân khẩu",
      },
      {
        logId: "log_002",
        time: "15/12/2025 09:10",
        action: "DELETE",
        cccd: "012345678903",
        fullName: "Nguyễn Văn C",
        relation: "Con",
        dob: "05/04/2010",
        actor: "canbo_phuong02",
        note: "Chuyển đi nơi khác",
      },
      {
        logId: "log_003",
        time: "16/12/2025 14:05",
        action: "ADD",
        cccd: "012345678905",
        fullName: "Phạm Thị E",
        relation: "Cháu",
        dob: "22/08/2015",
        actor: "canbo_phuong01",
        note: "Cập nhật nhân khẩu",
      },
    ],
  },
  HD00124: {
    householdCode: "HD00124",
    cccdChuHo: "012345678902",
    chuHo: "Trần Thị B",
    logs: [
      {
        logId: "log_004",
        time: "15/12/2025 09:10",
        action: "ADD",
        cccd: "012345678910",
        fullName: "Trần Văn K",
        relation: "Chồng",
        dob: "10/10/1982",
        actor: "canbo_phuong01",
        note: "Thêm nhân khẩu",
      },
    ],
  },
};

function ActionChip({ action }) {
  const isAdd = action === "ADD";
  return (
    <Chip
      size="small"
      label={isAdd ? "Thêm người" : "Xóa người"}
      sx={{
        fontWeight: 700,
        borderRadius: "999px",
        color: isAdd ? "#166534" : "#991B1B",
        backgroundColor: isAdd ? "#DCFCE7" : "#FEE2E2",
        border: `1px solid ${isAdd ? "#BBF7D0" : "#FECACA"}`,
      }}
    />
  );
}

/* ================== TABLE ================== */

function ChangeLogTable({ logs }) {
  const ROWS_PER_PAGE = 8;
  const [page, setPage] = useState(1);

  const pageCount = Math.ceil(logs.length / ROWS_PER_PAGE) || 1;
  const visibleRows = useMemo(
    () => logs.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE),
    [logs, page]
  );

  return (
    <Box>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: "0px 6px 18px rgba(0,0,0,0.08)",
          overflow: "hidden",
          border: "1px solid #EEF2F7",
        }}
      >
        <Table stickyHeader sx={{ tableLayout: "fixed" }}>
          <TableHead sx={{ backgroundColor: "#F8FAFC" }}>
            <TableRow
              sx={{
                "& th": {
                  fontWeight: 700,
                  fontSize: "13px",
                  color: "#0F172A",
                  borderBottom: "1px solid #E5E7EB",
                  py: 1.25,
                  whiteSpace: "nowrap",
                },
              }}
            >
              <TableCell align="center" sx={{ width: 170 }}>Thời gian</TableCell>
              <TableCell align="center" sx={{ width: 120 }}>Hành động</TableCell>
              <TableCell align="center" sx={{ width: 170 }}>CCCD</TableCell>
              <TableCell align="left" sx={{ width: 220 }}>Họ và tên</TableCell>
              <TableCell align="center" sx={{ width: 140 }}>Quan hệ</TableCell>
              <TableCell align="center" sx={{ width: 130 }}>Ngày sinh</TableCell>
              <TableCell align="center" sx={{ width: 160 }}>Người thực hiện</TableCell>
              <TableCell align="left" sx={{ width: 220 }}>Ghi chú</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {visibleRows.map((row, idx) => (
              <TableRow 
                key={row.logId}
                hover
                sx={{
                  backgroundColor: idx % 2 === 0 ? "#FFFFFF" : "#FCFDFF",
                  "& td": {
                    fontSize: "14px",
                    color: "#111827",
                    borderBottom: "1px solid #EEF2F7",
                    py: 1.25,
                  },
                }}
              >
                <TableCell align="center" sx={{ color: "#475569" }}>{row.time}</TableCell>
                <TableCell align="center">
                  <ActionChip action={row.action} />
                </TableCell>
                <TableCell align="center"
                  sx={{
                    fontFamily:
                      "ui-monospace, SFMono-Regular, Menlo, monospace",
                    color: "#334155",
                  }}
                >
                  {row.cccd}
                </TableCell>
                <TableCell
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={row.fullName}
                >
                  {row.fullName}
                </TableCell>
                <TableCell align="center">{row.relation}</TableCell>
                <TableCell align="center" sx={{ color: "#475569" }}>{row.dob}</TableCell>
                <TableCell align="center" sx={{ color: "#0F172A" }}>
                  {row.actor}
                </TableCell>
                <TableCell
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    color: "#475569",
                  }}
                  title={row.note}
                >
                  {row.note}
                </TableCell>
              </TableRow>
            ))}
            {logs.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} sx={{ py: 4, textAlign: "center", color: "#64748B" }}>
                  Không có lịch sử thay đổi.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
        <Pagination
          count={pageCount}
          page={page}
          onChange={(e, v) => setPage(v)}
          color="primary"
          size="small"
        />
      </Box>
    </Box>
  );
}

/* ================== PAGE ================== */

export default function ChiTietLichSuThayDoiHoDan() {
  const navigate = useNavigate();
  const { householdCode } = useParams();

  // ✅ lấy rolePrefix giống Sidebar
  const { user: authUser } = useAuthStore();
  const userRole = authUser?.role?.role_name;
  const rolePrefix =
    userRole === "HAMLET LEADER"
      ? "/leader"
      : userRole === "ACCOUNTANT"
      ? "/accountant"
      : "";

  const detail =
    mockChangeDetailByHousehold[householdCode] || {
      householdCode: householdCode || "-",
      cccdChuHo: "-",
      chuHo: "Không tìm thấy hộ",
      logs: [],
    };

  const summary = useMemo(() => {
    const addCount = detail.logs.filter((x) => x.action === "ADD").length;
    const deleteCount = detail.logs.filter((x) => x.action === "DELETE").length;
    return { addCount, deleteCount, total: detail.logs.length };
  }, [detail.logs]);

  return (
    <Box sx={{ padding: "24px 32px" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography sx={{ fontSize: 26, fontWeight: 600 }}>
          Chi tiết lịch sử thay đổi hộ dân
        </Typography>

        <Button
          variant="outlined"
          sx={{ textTransform: "none", borderRadius: "10px" }}
          onClick={() => navigate(`${rolePrefix}/lichsuthaydoi`)}
        >
          Quay lại danh sách
        </Button>
      </Box>

      {/* Thông tin hộ + thống kê */}
      <Box sx={{ mb: 3, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
        <Box
          sx={{
            background: "#FFFFFF",
            borderRadius: 3,
            p: 2,
            border: "1px solid #EEF2F7",
            boxShadow: "0px 3px 12px rgba(0,0,0,0.06)",
          }}
        >
          <Typography sx={{ fontWeight: 800, color: "#0F172A" }}>
            Mã hộ dân: {detail.householdCode}
          </Typography>
          <Typography sx={{ color: "#475569", mt: 0.5 }}>
            CCCD chủ hộ:{" "}
            <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
              {detail.cccdChuHo}
            </span>
          </Typography>
          <Typography sx={{ color: "#0F172A", mt: 0.5 }}>
            Chủ hộ: <b>{detail.chuHo}</b>
          </Typography>
        </Box>

        <Box
          sx={{
            background: "#FFFFFF",
            borderRadius: 3,
            p: 2,
            border: "1px solid #EEF2F7",
            boxShadow: "0px 3px 12px rgba(0,0,0,0.06)",
          }}
        >
          <Typography sx={{ fontWeight: 800, color: "#0F172A" }}>Thống kê</Typography>
          <Box sx={{ display: "flex", gap: 1.5, mt: 1, flexWrap: "wrap" }}>
            <Chip
              label={`Thêm người: ${summary.addCount}`}
              sx={{
                fontWeight: 700,
                color: "#166534",
                backgroundColor: "#DCFCE7",
                border: "1px solid #BBF7D0",
              }}
            />
            <Chip
              label={`Xóa người: ${summary.deleteCount}`}
              sx={{
                fontWeight: 700,
                color: "#991B1B",
                backgroundColor: "#FEE2E2",
                border: "1px solid #FECACA",
              }}
            />
            <Chip
              label={`Tổng: ${summary.total}`}
              sx={{
                fontWeight: 700,
                color: "#1D4ED8",
                backgroundColor: "#EFF6FF",
                border: "1px solid #DBEAFE",
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Bảng chi tiết */}
      <ChangeLogTable logs={detail.logs} />
    </Box>
  );
}
