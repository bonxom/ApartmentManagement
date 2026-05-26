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
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddProfileModal from "../../../feature/profile/AddProfile";
import useAuthStore from "../../../store/authStore";

/* ================== MOCK DATA ================== */

const mockHouseholdTransactions = [
  {
    householdCode: "HD00123",
    cccdChuHo: "012345678901",
    chuHo: "Nguyễn Văn A",
    paidCount: 3,
    unpaidCount: 1,
    totalPaid: 450000,
    totalUnpaid: 150000,
    lastPaidAt: "16/12/2025 10:20",
  },
  {
    householdCode: "HD00124",
    cccdChuHo: "012345678902",
    chuHo: "Trần Thị B",
    paidCount: 1,
    unpaidCount: 2,
    totalPaid: 150000,
    totalUnpaid: 300000,
    lastPaidAt: "15/12/2025 09:05",
  },
  {
    householdCode: "HD00125",
    cccdChuHo: "012345678903",
    chuHo: "Lê Văn C",
    paidCount: 0,
    unpaidCount: 4,
    totalPaid: 0,
    totalUnpaid: 600000,
    lastPaidAt: "-",
  },
  {
    householdCode: "HD00126",
    cccdChuHo: "012345678904",
    chuHo: "Phạm Thị D",
    paidCount: 2,
    unpaidCount: 0,
    totalPaid: 300000,
    totalUnpaid: 0,
    lastPaidAt: "16/12/2025 16:40",
  },
];

const formatMoney = (v) =>
  typeof v === "number" ? v.toLocaleString("vi-VN") + " đ" : "-";

/* ================== TABLE ================== */

function HouseholdTransactionTable({ rows, rolePrefix }) {
  const navigate = useNavigate();

  const ROWS_PER_PAGE = 10;
  const [page, setPage] = useState(1);

  const pageCount = Math.ceil(rows.length / ROWS_PER_PAGE) || 1;

  const visibleRows = useMemo(
    () => rows.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE),
    [rows, page]
  );

  return (
    <Box>
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#F8FAFC" }}>
            <TableRow>
              <TableCell>Mã hộ dân</TableCell>
              <TableCell>CCCD chủ hộ</TableCell>
              <TableCell>Chủ hộ</TableCell>
              <TableCell align="right">Số khoản đã đóng</TableCell>
              <TableCell align="right">Số khoản chưa đóng</TableCell>
              <TableCell align="right">Tổng đã đóng</TableCell>
              <TableCell align="right">Tổng chưa đóng</TableCell>
              <TableCell>Lần đóng gần nhất</TableCell>
              <TableCell align="center">Chi tiết</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {visibleRows.map((row) => (
              <TableRow key={row.householdCode} hover>
                <TableCell>{row.householdCode}</TableCell>
                <TableCell>{row.cccdChuHo}</TableCell>
                <TableCell>{row.chuHo}</TableCell>

                <TableCell align="right" sx={{ fontWeight: 700, color: "#2e7d32" }}>
                  {row.paidCount}
                </TableCell>

                <TableCell align="right" sx={{ fontWeight: 700, color: "#d32f2f" }}>
                  {row.unpaidCount}
                </TableCell>

                <TableCell align="right">{formatMoney(row.totalPaid)}</TableCell>
                <TableCell align="right">{formatMoney(row.totalUnpaid)}</TableCell>

                <TableCell>{row.lastPaidAt}</TableCell>

                <TableCell align="center">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() =>
                      navigate(
                        `${rolePrefix}/lichsugiaodich/chi-tiet/${row.householdCode}`
                      )
                    }
                  >
                    Xem chi tiết
                  </Button>
                </TableCell>
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

/* ================== PAGE ================== */

export default function LichSuGiaoDichTheoHoDan() {
  const [openAddProfileModal, setOpenAddProfileModal] = useState(false);
  const [rows] = useState(mockHouseholdTransactions);

  // ✅ lấy rolePrefix giống Sidebar
  const { user: authUser } = useAuthStore();
  const userRole = authUser?.role?.role_name;
  const rolePrefix =
    userRole === "HAMLET LEADER"
      ? "/leader"
      : userRole === "ACCOUNTANT"
      ? "/accountant"
      : "";

  return (
    <Box sx={{ padding: "24px 32px" }}>
      <Typography sx={{ fontSize: 26, fontWeight: 600, mb: 3 }}>
        Lịch sử giao dịch theo hộ dân
      </Typography>

      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0px 3px 12px rgba(0,0,0,0.1)",
          p: 2,
        }}
      >
        <HouseholdTransactionTable rows={rows} rolePrefix={rolePrefix} />
      </Box>

      <AddProfileModal
        open={openAddProfileModal}
        onClose={() => setOpenAddProfileModal(false)}
        currentData={{}}
        onSubmit={() => {}}
      />
    </Box>
  );
}
