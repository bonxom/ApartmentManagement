import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material";
import { Search, ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { householdAPI } from "../../../api/apiService";
import useAuthStore from "../../../store/authStore";

// ===== COMPONENT BẢNG =====
function ResidentsTable({ members, loading, onViewDetail }) {
  const ROWS_PER_PAGE = 10;
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const pageCount = Math.ceil(members.length / ROWS_PER_PAGE) || 1;

  // Sorting logic
  const sortedMembers = useMemo(() => {
    let sortableMembers = [...members];
    
    if (sortConfig.key) {
      sortableMembers.sort((a, b) => {
        let aValue, bValue;
        
        switch (sortConfig.key) {
          case 'name':
            aValue = a.name || '';
            bValue = b.name || '';
            break;
          case 'dob':
            aValue = new Date(a.dob || 0).getTime();
            bValue = new Date(b.dob || 0).getTime();
            break;
          default:
            return 0;
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return sortableMembers;
  }, [members, sortConfig]);

  const start = (page - 1) * ROWS_PER_PAGE;
  const visibleRows = sortedMembers.slice(start, start + ROWS_PER_PAGE);

  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        return {
          key,
          direction: prevConfig.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { key, direction: 'asc' };
    });
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (members.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="body1" color="text.secondary">
          Không có thành viên nào trong hộ gia đình
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#F8FAFC" }}>
            <TableRow>
              <TableCell>Số CCCD</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  Họ và tên
                  <IconButton 
                    size="small" 
                    onClick={() => handleSort('name')}
                    sx={{ 
                      padding: '2px',
                      color: sortConfig.key === 'name' ? '#2D66F5' : '#666'
                    }}
                  >
                    <ArrowUpDown size={16} />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell>Quan hệ với chủ hộ</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  Ngày tháng năm sinh
                  <IconButton 
                    size="small" 
                    onClick={() => handleSort('dob')}
                    sx={{ 
                      padding: '2px',
                      color: sortConfig.key === 'dob' ? '#2D66F5' : '#666'
                    }}
                  >
                    <ArrowUpDown size={16} />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {visibleRows.map((row) => (
              <TableRow key={row._id} hover>
                <TableCell>{row.userCardID || "—"}</TableCell>
                <TableCell>{row.name || "—"}</TableCell>
                <TableCell>{row.relationshipWithHead || "—"}</TableCell>
                <TableCell>{formatDate(row.dob)}</TableCell>
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
          shape="rounded"
        />
      </Box>
    </Box>
  );
}

// ===== PAGE CHÍNH =====
export default function ThongTinHoDan() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (user?.household) {
      fetchMembers();
    }
  }, [user]);

  const fetchMembers = async () => {
    setLoading(true);
    setError("");
    try {
      const householdId = user?.household?._id || user?.household;
      const data = await householdAPI.getMembersInfo(householdId);
      setMembers(data || []);
    } catch (err) {
      console.error("Error fetching members:", err);
      setError(err?.message || "Không thể tải danh sách thành viên");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (member) => {
    navigate("/member/ThongTinMember", { state: { memberId: member._id } });
  };

  const filteredMembers = members.filter((member) => {
    if (!searchText.trim()) return true;
    const q = searchText.toLowerCase();
    return (
      (member.name || "").toLowerCase().includes(q) ||
      (member.userCardID || "").toLowerCase().includes(q) ||
      (member.relationshipWithHead || "").toLowerCase().includes(q)
    );
  });

  return (
    <Box sx={{ padding: "24px 32px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography sx={{ fontSize: "26px", fontWeight: "600" }}>
          Thông tin thành viên hộ dân
        </Typography>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }} 
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      {/* SEARCH BOX */}
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
            placeholder="Nhập tên, số CCCD hoặc quan hệ với chủ hộ..."
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

      {/* TABLE AREA */}
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0px 3px 12px rgba(0, 0, 0, 0.1)",
          p: 2,
        }}
      >
        <ResidentsTable
          members={filteredMembers}
          loading={loading}
          onViewDetail={handleViewDetail}
        />
      </Box>
    </Box>
  );
}
