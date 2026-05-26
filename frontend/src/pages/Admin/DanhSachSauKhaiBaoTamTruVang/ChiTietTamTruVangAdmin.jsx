import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { Search, Eye, X, ArrowUpDown } from "lucide-react";
import { householdAPI, userAPI } from "../../../api/apiService";

// ===== COMPONENT BẢNG CHI TIẾT =====
function DetailTable({ data, loading, onViewMember, onComplete }) {
  const ROWS_PER_PAGE = 10;
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const pageCount = Math.ceil(data.length / ROWS_PER_PAGE) || 1;

  // Sorting logic
  const sortedData = React.useMemo(() => {
    let sortableData = [...data];
    
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        let aValue, bValue;
        
        switch (sortConfig.key) {
          case 'name':
            aValue = a.name || '';
            bValue = b.name || '';
            break;
          case 'startDate':
            aValue = new Date(a.startDate || 0).getTime();
            bValue = new Date(b.startDate || 0).getTime();
            break;
          case 'endDate':
            aValue = new Date(a.endDate || 0).getTime();
            bValue = new Date(b.endDate || 0).getTime();
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
    
    return sortableData;
  }, [data, sortConfig]);

  const start = (page - 1) * ROWS_PER_PAGE;
  const visibleRows = sortedData.slice(start, start + ROWS_PER_PAGE);

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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

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

  if (data.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography sx={{ color: "#666" }}>
          Không có dữ liệu tạm trú/tạm vắng
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
              <TableCell sx={{ fontWeight: "600" }}>CCCD</TableCell>
              <TableCell sx={{ fontWeight: "600" }}>
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
              <TableCell sx={{ fontWeight: "600" }}>
                Quan hệ với chủ hộ
              </TableCell>
              <TableCell sx={{ fontWeight: "600" }}>Loại</TableCell>
              <TableCell sx={{ fontWeight: "600" }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  Bắt đầu
                  <IconButton 
                    size="small" 
                    onClick={() => handleSort('startDate')}
                    sx={{ 
                      padding: '2px',
                      color: sortConfig.key === 'startDate' ? '#2D66F5' : '#666'
                    }}
                  >
                    <ArrowUpDown size={16} />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: "600" }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  Kết thúc
                  <IconButton 
                    size="small" 
                    onClick={() => handleSort('endDate')}
                    sx={{ 
                      padding: '2px',
                      color: sortConfig.key === 'endDate' ? '#2D66F5' : '#666'
                    }}
                  >
                    <ArrowUpDown size={16} />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: "600" }} align="center">
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((row) => (
              <TableRow key={row._id} hover>
                <TableCell>{row.userCardID || "N/A"}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>
                  {row.relationshipWithHead || "N/A"}
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.type === "tamtru" ? "Tạm trú" : "Tạm vắng"}
                    color={row.type === "tamtru" ? "primary" : "error"}
                    size="small"
                    sx={{ fontWeight: "500", borderRadius: "6px" }}
                  />
                </TableCell>
                <TableCell>{formatDate(row.startDate)}</TableCell>
                <TableCell>{formatDate(row.endDate)}</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => onViewMember(row)}
                      startIcon={<Eye size={14} />}
                      sx={{ textTransform: "none", borderRadius: "6px" }}
                    >
                      Chi tiết
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      color="error"
                      disabled={row.isActive === false}
                      onClick={() => onComplete(row)}
                      sx={{
                        textTransform: "none",
                        borderRadius: "6px",
                        ...(row.isActive === false && {
                          backgroundColor: "#9e9e9e",
                          color: "#fff",
                          "&:hover": {
                            backgroundColor: "#9e9e9e",
                          },
                        }),
                      }}
                    >
                      Kết thúc
                    </Button>
                  </Box>
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
export default function ChiTietTamTruVangAdmin() {
  const location = useLocation();
  const navigate = useNavigate();
  const householdId = location.state?.householdId;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [endDate, setEndDate] = useState("");
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    if (!householdId) {
      setError("Không tìm thấy thông tin hộ dân");
      return;
    }
    fetchDetailData();
  }, [householdId]);

  const fetchDetailData = async () => {
    setLoading(true);
    try {
      const response = await householdAPI.getTamTruVangDetails(householdId);
      const { temporaryHistory } = response;

      if (!temporaryHistory) {
        setData([]);
        return;
      }

      // Kết hợp dữ liệu tạm trú và tạm vắng
      const formattedData = [];

      // Thêm dữ liệu tạm trú
      if (temporaryHistory.temporaryResidents) {
        temporaryHistory.temporaryResidents.forEach((resident) => {
          formattedData.push({
            _id: resident._id,
            userCardID: resident.userCardID,
            name: resident.name,
            relationshipWithHead: "N/A", // Người tạm trú không có quan hệ với chủ hộ
            type: "tamtru",
            startDate: resident.startDate,
            endDate: resident.endDate,
            reason: resident.reason,
            job: resident.job,
            phoneNumber: resident.phoneNumber,
            dob: resident.dob,
            sex: resident.sex,
            birthLocation: resident.birthLocation,
            ethnic: resident.ethnic,
            permanentAddress: resident.permanentAddress,
            isActive: resident.isActive !== undefined ? resident.isActive : true, // Mặc định là true nếu không có
          });
        });
      }

      // Thêm dữ liệu tạm vắng
      if (temporaryHistory.temporaryAbsent) {
        const absentPromises = temporaryHistory.temporaryAbsent.map(async (absent) => {
          let userCardID = "N/A";
          let userName = "N/A";
          let userId = null;
          let relationshipWithHead = "N/A";

          if (absent.user) {
            // Lấy userId từ user object
            const userIdStr =
              typeof absent.user === "string"
                ? absent.user
                : absent.user._id || absent.user.toString();
            userId = userIdStr;

            // Kiểm tra xem user đã được populate chưa (có userCardID và name)
            if (typeof absent.user === "object" && absent.user.userCardID && absent.user.name) {
              // Đã được populate đầy đủ, dùng dữ liệu sẵn có
              userCardID = absent.user.userCardID;
              userName = absent.user.name;
              relationshipWithHead = absent.user.relationshipWithHead || "N/A";
            } else {
              // Chưa được populate hoặc thiếu thông tin, gọi API để lấy thông tin
              try {
                const userData = await userAPI.getById(userIdStr);
                userCardID = userData.userCardID || "N/A";
                userName = userData.name || "N/A";
                relationshipWithHead = userData.relationshipWithHead || "N/A";
              } catch (err) {
                console.error(`Error fetching user data for ${userIdStr}:`, err);
                // Nếu API lỗi nhưng có dữ liệu từ absent.user, dùng dữ liệu đó
                if (typeof absent.user === "object") {
                  userCardID = absent.user.userCardID || "N/A";
                  userName = absent.user.name || "N/A";
                  relationshipWithHead = absent.user.relationshipWithHead || "N/A";
                }
              }
            }
          }

          return {
            _id: absent._id,
            userCardID: userCardID,
            name: userName,
            userId: userId,
            relationshipWithHead: relationshipWithHead,
            type: "tamvang",
            startDate: absent.startDate,
            endDate: absent.endDate,
            reason: absent.reason,
            temporaryAddress: absent.temporaryAddress,
            isActive: absent.isActive !== undefined ? absent.isActive : true, // Mặc định là true nếu không có
          };
        });

        const absentData = await Promise.all(absentPromises);
        formattedData.push(...absentData);
      }

      setData(formattedData);
    } catch (err) {
      console.error(err);
      setError("Lỗi khi tải dữ liệu chi tiết.");
    } finally {
      setLoading(false);
    }
  };
  const filteredData = data.filter((item) => {
    // Filter theo search term
    const matchesSearch =
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.userCardID?.includes(searchTerm);

    // Filter theo trạng thái (isActive)
    let matchesFilter = true;
    if (filterType === "tamtru") {
      // "Hiện tại" - isActive = true
      matchesFilter = item.isActive === true || item.isActive === undefined;
    } else if (filterType === "tamvang") {
      // "Đã kết thúc" - isActive = false
      matchesFilter = item.isActive === false;
    }
    // "all" - hiển thị tất cả

    return matchesSearch && matchesFilter;
  });

  const handleCompleteClick = (record) => {
    setSelectedRecord(record);
    const currentEndDate = record.endDate
      ? new Date(record.endDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];
    setEndDate(currentEndDate);
    setCompleteDialogOpen(true);
  };

  const handleCompleteConfirm = async () => {
    if (!selectedRecord || !householdId) return;

    setIsCompleting(true);
    setError("");

    try {
      // Fetch resident history để có dữ liệu đầy đủ
      const response = await householdAPI.getTamTruVangDetails(householdId);
      const { temporaryHistory } = response;

      if (!temporaryHistory) {
        throw new Error("Không tìm thấy lịch sử cư trú");
      }

      const recordType =
        selectedRecord.type === "tamtru"
          ? "temporaryResident"
          : "temporaryAbsent";
      const recordId = selectedRecord._id?.toString();

      // Kiểm tra xem ngày kết thúc có thay đổi không
      const currentEndDate = selectedRecord.endDate
        ? new Date(selectedRecord.endDate).toISOString().split("T")[0]
        : null;
      const newEndDate = endDate;

      // Nếu ngày kết thúc thay đổi, cập nhật trước
      if (currentEndDate !== newEndDate) {
        if (recordType === "temporaryResident") {
          const updatedTemporaryResidents = temporaryHistory.temporaryResidents.map(
            (resident) => {
              const residentId = resident._id?.toString();
              if (residentId === recordId) {
                return {
                  ...resident,
                  endDate: new Date(newEndDate).toISOString(),
                };
              }
              return resident;
            }
          );

          await householdAPI.updateResidentHistory(householdId, {
            temporaryResidents: updatedTemporaryResidents,
            temporaryAbsents: temporaryHistory.temporaryAbsent || [],
          });
        } else {
          const updatedTemporaryAbsent = (
            temporaryHistory.temporaryAbsent || []
          ).map((absent) => {
            const absentId = absent._id?.toString();
            if (absentId === recordId) {
              return {
                ...absent,
                endDate: new Date(newEndDate).toISOString(),
              };
            }
            return absent;
          });

          await householdAPI.updateResidentHistory(householdId, {
            temporaryResidents: temporaryHistory.temporaryResidents || [],
            temporaryAbsents: updatedTemporaryAbsent,
          });
        }
      }

      // Sau đó đánh dấu kết thúc
      await householdAPI.completeResidentHistory(householdId, {
        recordType,
        recordId,
      });

      alert("Đã kết thúc tạm trú/tạm vắng thành công!");
      setCompleteDialogOpen(false);
      setSelectedRecord(null);
      // Refresh data
      await fetchDetailData();
    } catch (err) {
      console.error("Failed to complete:", err);
      setError(
        err.response?.data?.message ||
          "Không thể kết thúc tạm trú/tạm vắng. Vui lòng thử lại."
      );
    } finally {
      setIsCompleting(false);
    }
  };

  const handleCompleteCancel = () => {
    setCompleteDialogOpen(false);
    setSelectedRecord(null);
    setEndDate("");
  };

  return (
    <Box sx={{ padding: "24px 32px" }}>
      {/* Tiêu đề */}
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontSize: "26px", fontWeight: "600" }}>
          Chi tiết Tạm trú / Tạm vắng hộ dân
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Thanh tìm kiếm nhanh */}
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
            Tìm kiếm thành viên
          </Typography>
          <TextField
            fullWidth
            placeholder="Nhập họ tên hoặc số CCCD..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} color="#777" />
                </InputAdornment>
              ),
              sx: { background: "#F1F3F6", borderRadius: "8px", height: "40px" },
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
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="tamtru">Hiện tại</MenuItem>
            <MenuItem value="tamvang">Đã kết thúc</MenuItem>
          </Select>
        </Box>
      </Box>

      {/* Bảng dữ liệu */}
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0px 3px 12px rgba(0, 0, 0, 0.1)",
          p: 2,
        }}
      >
        <DetailTable
          data={filteredData}
          loading={loading}
          onViewMember={(member) => {
            if (member.type === "tamtru") {
              // Navigate đến trang thông tin người tạm trú
              navigate("/leader/ThongTinNguoiTamTru", {
                state: { tamTruData: member, householdId: householdId },
              });
            } else if (member.type === "tamvang") {
              // Navigate đến trang thông tin người tạm vắng
              navigate("/leader/ThongTinNguoiTamVang", {
                state: { tamVangData: member, householdId: householdId },
              });
            }
          }}
          onComplete={handleCompleteClick}
        />
      </Box>

      {/* Dialog xác nhận kết thúc */}
      <Dialog
        open={completeDialogOpen}
        onClose={handleCompleteCancel}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            padding: "8px",
          },
        }}
      >
        <DialogTitle sx={{ fontSize: "18px", fontWeight: "600" }}>
          Xác nhận kết thúc{" "}
          {selectedRecord?.type === "tamtru" ? "tạm trú" : "tạm vắng"}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Bạn có chắc chắn muốn kết thúc{" "}
            {selectedRecord?.type === "tamtru" ? "tạm trú" : "tạm vắng"} cho{" "}
            <strong>{selectedRecord?.name}</strong>?
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ fontSize: "13px", fontWeight: "500", mb: 1, color: "#555" }}>
              Ngày kết thúc
            </Typography>
            <TextField
              fullWidth
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCompleteCancel}
            disabled={isCompleting}
            sx={{
              textTransform: "none",
              color: "#666",
              fontSize: "14px",
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleCompleteConfirm}
            variant="contained"
            color="error"
            disabled={isCompleting || !endDate}
            sx={{
              textTransform: "none",
              fontSize: "14px",
            }}
          >
            {isCompleting ? "Đang xử lý..." : "Xác nhận"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
