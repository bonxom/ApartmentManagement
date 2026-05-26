import React from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  CircularProgress,
  Stack,
  Divider,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';

function FeeStatisticsView({
  fees,
  statsData,
  statsLoading,
  statsFilter,
  setStatsFilter,
  onViewStatistics,
  filteredDetails,
  renderPaymentStatus,
}) {
  return (
    <>
      <Typography variant="h6" sx={{ mb: 2}}>
        Báo cáo tình hình thu theo khoản
      </Typography>

      <Paper sx={{ p: 2, mb: 3, borderRadius: "16px" }} elevation={2}>
        <Typography 
          sx={{ 
            fontSize: "13px", 
            fontWeight: "500", 
            mb: 1, 
            color: "#666",
          }}
        >
          Chọn khoản thu để xem báo cáo
        </Typography>
        <TextField
          select
          fullWidth
          value={statsData?.fee_info?._id || ""}
          onChange={(e) => onViewStatistics(e.target.value)}
          SelectProps={{
            displayEmpty: true,
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#F5F7FA",
              borderRadius: "8px",
              "& fieldset": { borderColor: "transparent" },
              "&:hover fieldset": { borderColor: "#E0E0E0" },
              "&.Mui-focused fieldset": { borderColor: "#2D66F5" },
            },
            "& .MuiInputBase-input": {
              padding: "12px 14px",
              fontSize: "15px",
              color: "#333"
            }
          }}
        >
          <MenuItem value="" disabled style={{ color: "#999", fontStyle: "italic" }}>
            Ví dụ: Phí vệ sinh
          </MenuItem>
          {fees.map((f) => (
            <MenuItem key={f._id} value={f._id}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <span>{f.name}</span>
                <span style={{ color: "#757575", marginLeft: 16 }}>
                  ({f.type === "MANDATORY" ? "Bắt buộc" : "Tự nguyện"})
                </span>
              </Box>
            </MenuItem>
          ))}
        </TextField>
      </Paper>

      {statsLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={48} />
        </Box>
      )}

      {statsData && !statsLoading && (
        <Paper sx={{ p: 3, borderRadius: "16px" }} elevation={2}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Tổng quan: {statsData.fee_info.name}
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: "wrap" }}>
            <Paper
              sx={{ p: 2, flex: 1, minWidth: 180, backgroundColor: "#e3f2fd" }}
              elevation={1}
            >
              <Typography variant="subtitle2" color="text.secondary">
                Tổng số hộ
              </Typography>
              <Typography variant="h4" fontWeight={600} color="primary">
                {statsData.summary.total_households}
              </Typography>
            </Paper>

            <Paper
              sx={{ p: 2, flex: 1, minWidth: 180, backgroundColor: "#fff3e0" }}
              elevation={1}
            >
              <Typography variant="subtitle2" color="text.secondary">
                Tổng phải thu
              </Typography>
              <Typography variant="h5" fontWeight={600} color="warning.main">
                {statsData.summary.total_expected.toLocaleString()} đ
              </Typography>
            </Paper>

            <Paper
              sx={{ p: 2, flex: 1, minWidth: 180, backgroundColor: "#e8f5e9" }}
              elevation={1}
            >
              <Typography variant="subtitle2" color="text.secondary">
                Tổng đã thu
              </Typography>
              <Typography variant="h5" fontWeight={600} color="success.main">
                {statsData.summary.total_collected.toLocaleString()} đ
              </Typography>
            </Paper>

            <Paper
              sx={{ p: 2, flex: 1, minWidth: 180, backgroundColor: "#f3e5f5" }}
              elevation={1}
            >
              <Typography variant="subtitle2" color="text.secondary">
                Tỉ lệ hoàn thành
              </Typography>
              <Typography variant="h5" fontWeight={600} color="secondary">
                {statsData.summary.total_expected > 0
                  ? `${Math.round(
                      (statsData.summary.total_collected /
                        statsData.summary.total_expected) *
                        100
                    )}%`
                  : "N/A"}
              </Typography>
            </Paper>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Lọc theo trạng thái đóng tiền:
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
            <Button
              variant={statsFilter === "ALL" ? "contained" : "outlined"}
              onClick={() => setStatsFilter("ALL")}
            >
              Tất cả ({statsData.details.length})
            </Button>
            <Button
              variant={statsFilter === "UNPAID" ? "contained" : "outlined"}
              color="error"
              onClick={() => setStatsFilter("UNPAID")}
            >
              Chưa đóng (
              {statsData.details.filter((d) => d.status === "UNPAID").length})
            </Button>
            <Button
              variant={statsFilter === "PARTIAL" ? "contained" : "outlined"}
              color="warning"
              onClick={() => setStatsFilter("PARTIAL")}
            >
              Còn nợ (
              {statsData.details.filter((d) => d.status === "PARTIAL").length})
            </Button>
            <Button
              variant={statsFilter === "COMPLETED" ? "contained" : "outlined"}
              color="success"
              onClick={() => setStatsFilter("COMPLETED")}
            >
              Đã đóng đủ (
              {statsData.details.filter((d) => d.status === "COMPLETED").length}
              )
            </Button>
          </Stack>

          <Table size="small">
            <TableHead sx={{ backgroundColor: "#F8FAFC" }}>
              <TableRow>
                <TableCell>
                  <strong>Mã hộ</strong>
                </TableCell>
                <TableCell>
                  <strong>Địa chỉ</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Nhân khẩu</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Phải thu</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Đã thu</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Còn thiếu</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Trạng thái</strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredDetails.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      Không tìm thấy hộ phù hợp với bộ lọc hiện tại
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredDetails.map((row) => (
                  <TableRow key={row.household_id} hover>
                    <TableCell>
                      <Typography fontWeight={500}>
                        {row.household_code || row.household_id}
                      </Typography>
                    </TableCell>
                    <TableCell>{row.address || "-"}</TableCell>
                    <TableCell align="center">{row.member_count}</TableCell>
                    <TableCell align="right">
                      <Typography fontWeight={500}>
                        {row.required.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight={500} color="success.main">
                        {row.paid.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        fontWeight={500}
                        color={
                          row.remaining > 0 ? "error.main" : "text.secondary"
                        }
                      >
                        {row.remaining.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {renderPaymentStatus(row.status)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>
      )}
    </>
  );
}

export default FeeStatisticsView;
