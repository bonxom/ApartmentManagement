import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  CircularProgress,
} from "@mui/material";
import { Search } from "lucide-react";
import { useRoleNavigation } from "../../../hooks/useRoleNavigation";
import { householdAPI } from "../../../api/apiService";
// ===== COMPONENT BẢNG TẠM TRÚ TẠM VẮNG =====
function TamTruVangTable({ households, loading, onViewDetail }) {
  const ROWS_PER_PAGE = 10;
  const [page, setPage] = useState(1);

  const pageCount = Math.ceil(households.length / ROWS_PER_PAGE) || 1;
  const start = (page - 1) * ROWS_PER_PAGE;
  const visibleRows = households.slice(start, start + ROWS_PER_PAGE);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 8,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 3, boxShadow: "none" }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#F8FAFC" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "600" }}>Mã hộ dân</TableCell>
              <TableCell sx={{ fontWeight: "600" }}>Tên chủ hộ</TableCell>
              <TableCell sx={{ fontWeight: "600" }} align="center">
                Tạm trú
              </TableCell>
              <TableCell sx={{ fontWeight: "600" }} align="center">
                Tạm vắng
              </TableCell>
              <TableCell sx={{ fontWeight: "600" }} align="center">
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((row) => (
              <TableRow key={row._id} hover>
                <TableCell>{row.houseHoldID}</TableCell>
                <TableCell>{row.leader?.name || "N/A"}</TableCell>
                <TableCell align="center">
                  <Typography sx={{ color: "#2D66F5", fontWeight: "500" }}>
                    {row.tamTruCount || 0}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={{ color: "#EF4444", fontWeight: "500" }}>
                    {row.tamVangCount || 0}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => onViewDetail(row)}
                    sx={{
                      textTransform: "none",
                      minWidth: "60px",
                      fontSize: "13px"
                    }}
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
        <Pagination
          count={pageCount}
          page={page}
          onChange={(e, value) => setPage(value)}
        />
      </Box>
    </Box>
  );
}

// ===== PAGE CHÍNH =====
export default function QuanLiTamTruVang() {
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const { navigateWithRole } = useRoleNavigation();

  useEffect(() => {
    fetchData();
  }, []);

  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       // Gọi API lấy danh sách hộ dân (có kèm thông số tạm trú/vắng)
  //       const data = await householdAPI.getAll();
  //       setHouseholds(data);
  //     } catch (err) {
  //       console.error("Lỗi tải dữ liệu:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  // Lấy dữ liệu từ ResidentHistory thay vì requests

  const fetchData = async () => {
    setLoading(true);
    try {
      const households = await householdAPI.getAll();

      // Lấy thông tin tạm trú/tạm vắng cho từng hộ
      const updatedHouseholds = await Promise.all(
        households.map(async (h) => {
          try {
            const changes = await householdAPI.getTamTruVangDetails(h._id);
            const { temporaryHistory } = changes;

            const tamTruCount = temporaryHistory?.temporaryResidents?.length || 0;
            const tamVangCount = temporaryHistory?.temporaryAbsent?.length || 0;

            return { ...h, tamTruCount, tamVangCount };
          } catch (err) {
            console.error(`Error fetching data for household ${h._id}:`, err);
            return { ...h, tamTruCount: 0, tamVangCount: 0 };
          }
        })
      );

      setHouseholds(updatedHouseholds);
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (row) => {
    // Điều hướng sang trang chi tiết tạm trú tạm vắng của hộ đó
    navigateWithRole("/ChiTietTamTruVangAdmin", {
      state: { householdId: row._id },
    });
  };

  const filteredData = households.filter((item) => {
    // Filter theo search term
    const matchesSearch =
      item.houseHoldID?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.leader?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter theo type (tamtru/tamvang/all)
    let matchesFilter = true;
    if (filterType === "tamtru") {
      matchesFilter = (item.tamTruCount || 0) > 0;
    } else if (filterType === "tamvang") {
      matchesFilter = (item.tamVangCount || 0) > 0;
    }

    return matchesSearch && matchesFilter;
  });

  return (
    <Box sx={{ padding: "24px 32px" }}>
      <Typography sx={{ fontSize: "26px", fontWeight: "600", mb: 3 }}>
        Quản lý Tạm trú & Tạm vắng
      </Typography>

      {/* THANH TÌM KIẾM & LỌC */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          alignItems: "flex-end",
          mb: 4,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: "13px", mb: 1, fontWeight: "500" }}>
            Tìm kiếm hộ dân
          </Typography>
          <TextField
            fullWidth
            placeholder="Mã hộ, tên chủ hộ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
              },
            }}
          />
        </Box>

        <Box sx={{ width: "200px" }}>
          <Typography sx={{ fontSize: "13px", mb: 1, fontWeight: "500" }}>
            Trạng thái
          </Typography>
          <Select
            fullWidth
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            sx={{
              background: "#F1F3F6",
              borderRadius: "8px",
              height: "40px",
              fontSize: "14px",
            }}
          >
            <MenuItem value="all">Tất cả hộ dân</MenuItem>
            <MenuItem value="tamtru">Có người tạm trú</MenuItem>
            <MenuItem value="tamvang">Có người tạm vắng</MenuItem>
          </Select>
        </Box>
      </Box>

      {/* BẢNG DỮ LIỆU */}
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0px 3px 12px rgba(0, 0, 0, 0.08)",
          p: 2,
        }}
      >
        <TamTruVangTable
          households={filteredData}
          loading={loading}
          onViewDetail={handleViewDetail}
        />
      </Box>
    </Box>
  );
}
