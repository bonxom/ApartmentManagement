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
} from "@mui/material";
import { useParams } from "react-router-dom";

const formatMoney = (v) =>
  typeof v === "number" ? v.toLocaleString("vi-VN") + " đ" : "-";

// mock theo hộ (tạm)
const mockByHousehold = {
  HD00123: {
    householdCode: "HD00123",
    cccdChuHo: "012345678901",
    chuHo: "Nguyễn Văn A",
    transactions: [
      { id: "tx_001", time: "10/12/2025 09:15", feeName: "Phí vệ sinh", period: "12/2025", amount: 150000, status: "PAID", paidAt: "10/12/2025 09:15", method: "Tiền mặt" },
      { id: "tx_002", time: "15/12/2025 08:30", feeName: "Phí điện chiếu sáng", period: "12/2025", amount: 200000, status: "UNPAID", paidAt: "-", method: "-" },
    ],
  },
  HD00124: {
    householdCode: "HD00124",
    cccdChuHo: "012345678902",
    chuHo: "Trần Thị B",
    transactions: [
      { id: "tx_003", time: "12/12/2025 10:00", feeName: "Phí an ninh", period: "12/2025", amount: 100000, status: "PAID", paidAt: "12/12/2025 10:00", method: "Chuyển khoản" },
    ],
  },
};

function TransactionDetailTable({ rows }) {
  const ROWS_PER_PAGE = 10;
  const [page, setPage] = useState(1);

  const pageCount = Math.ceil(rows.length / ROWS_PER_PAGE) || 1;
  const visibleRows = rows.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const statusLabel = (s) => (s === "PAID" ? "Đã đóng" : "Chưa đóng");
  const statusColor = (s) => (s === "PAID" ? "#2e7d32" : "#d32f2f");

  return (
    <Box>
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#F8FAFC" }}>
            <TableRow>
              <TableCell>Thời gian tạo</TableCell>
              <TableCell>Khoản thu</TableCell>
              <TableCell>Kỳ</TableCell>
              <TableCell align="right">Số tiền</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Thời gian đóng</TableCell>
              <TableCell>Hình thức</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.time}</TableCell>
                <TableCell>{row.feeName}</TableCell>
                <TableCell>{row.period}</TableCell>
                <TableCell align="right">{formatMoney(row.amount)}</TableCell>
                <TableCell sx={{ fontWeight: 700, color: statusColor(row.status) }}>
                  {statusLabel(row.status)}
                </TableCell>
                <TableCell>{row.paidAt}</TableCell>
                <TableCell>{row.method}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
        <Pagination count={pageCount} page={page} onChange={(e, v) => setPage(v)} />
      </Box>
    </Box>
  );
}

export default function Lichsugiaodichchitiet() {
  const { householdCode } = useParams();

  const [detail] = useState(
    mockByHousehold[householdCode] || {
      householdCode: householdCode || "-",
      cccdChuHo: "-",
      chuHo: "Không tìm thấy hộ",
      transactions: [],
    }
  );

  const summary = useMemo(() => {
    const paid = detail.transactions.filter((x) => x.status === "PAID");
    const unpaid = detail.transactions.filter((x) => x.status === "UNPAID");
    return {
      paidCount: paid.length,
      unpaidCount: unpaid.length,
      totalPaid: paid.reduce((s, x) => s + x.amount, 0),
      totalUnpaid: unpaid.reduce((s, x) => s + x.amount, 0),
    };
  }, [detail.transactions]);

  return (
    <Box sx={{ padding: "24px 32px" }}>
      <Typography sx={{ fontSize: 26, fontWeight: 600, mb: 1 }}>
        Xem chi tiết giao dịch hộ dân
      </Typography>

      <Box sx={{ mb: 3, display: "flex", flexWrap: "wrap", gap: 2 }}>
        <Box
          sx={{
            background: "white",
            borderRadius: 3,
            p: 2,
            boxShadow: "0px 3px 12px rgba(0,0,0,0.08)",
          }}
        >
          <Typography sx={{ fontWeight: 700 }}>Mã hộ dân: {detail.householdCode}</Typography>
          <Typography>CCCD chủ hộ: {detail.cccdChuHo}</Typography>
          <Typography>Chủ hộ: {detail.chuHo}</Typography>
        </Box>

        <Box
          sx={{
            background: "white",
            borderRadius: 3,
            p: 2,
            boxShadow: "0px 3px 12px rgba(0,0,0,0.08)",
          }}
        >
          <Typography sx={{ fontWeight: 700 }}>Thống kê</Typography>
          <Typography>
            Đã đóng: <b style={{ color: "#2e7d32" }}>{summary.paidCount}</b> khoản — {formatMoney(summary.totalPaid)}
          </Typography>
          <Typography>
            Chưa đóng: <b style={{ color: "#d32f2f" }}>{summary.unpaidCount}</b> khoản — {formatMoney(summary.totalUnpaid)}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0px 3px 12px rgba(0,0,0,0.1)",
          p: 2,
        }}
      >
        <TransactionDetailTable rows={detail.transactions} />
      </Box>
    </Box>
  );
}
