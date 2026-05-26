import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Button,
  CircularProgress,
  Stack,
  IconButton,
  Pagination,
} from '@mui/material';
import { ArrowUpDown, Trash2 } from 'lucide-react';

function FeeListTable({ fees, loading, onEdit, onDelete, renderStatusChip }) {
  const ROWS_PER_PAGE = 10;
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const pageCount = Math.ceil(fees.length / ROWS_PER_PAGE) || 1;

  // Sorting logic
  const sortedFees = useMemo(() => {
    let sortableFees = [...fees];
    
    if (sortConfig.key) {
      sortableFees.sort((a, b) => {
        let aValue, bValue;
        
        switch (sortConfig.key) {
          case 'name':
            aValue = a.name || '';
            bValue = b.name || '';
            break;
          case 'type':
            // MANDATORY (Bắt buộc) trước, VOLUNTARY (Tự nguyện) sau
            aValue = a.type === 'MANDATORY' ? 0 : 1;
            bValue = b.type === 'MANDATORY' ? 0 : 1;
            break;
          case 'unitPrice':
            aValue = a.unitPrice || 0;
            bValue = b.unitPrice || 0;
            break;
          case 'status':
            aValue = a.status || '';
            bValue = b.status || '';
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
    
    return sortableFees;
  }, [fees, sortConfig]);

  const start = (page - 1) * ROWS_PER_PAGE;
  const visibleFees = sortedFees.slice(start, start + ROWS_PER_PAGE);

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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  return (
    <Box
        sx={{
        backgroundColor: "white",
        borderRadius: "16px",
        boxShadow: "0px 3px 12px rgba(0, 0, 0, 0.1)",
        p: 2,
        }}
    >
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#F8FAFC" }}>
            <TableRow>
              <TableCell align="left">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  Tên khoản thu
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
              <TableCell align="center">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  Loại
                  <IconButton 
                    size="small" 
                    onClick={() => handleSort('type')}
                    sx={{ 
                      padding: '2px',
                      color: sortConfig.key === 'type' ? '#2D66F5' : '#666'
                    }}
                  >
                    <ArrowUpDown size={16} />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  Số tiền
                  <IconButton 
                    size="small" 
                    onClick={() => handleSort('unitPrice')}
                    sx={{ 
                      padding: '2px',
                      color: sortConfig.key === 'unitPrice' ? '#2D66F5' : '#666'
                    }}
                  >
                    <ArrowUpDown size={16} />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  Trạng thái
                  <IconButton 
                    size="small" 
                    onClick={() => handleSort('status')}
                    sx={{ 
                      padding: '2px',
                      color: sortConfig.key === 'status' ? '#2D66F5' : '#666'
                    }}
                  >
                    <ArrowUpDown size={16} />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell align="left">Mô tả</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {visibleFees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    Chưa có khoản thu nào. Nhấn "Tạo khoản thu mới" để bắt đầu.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              visibleFees.map((fee) => (
                <TableRow 
                  key={fee._id} 
                  hover
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell align="left">
                    <Typography sx={{ fontSize: "14px" }}>{fee.name}</Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Box
                      sx={{
                        px: 1.5,
                        py: 0.3,
                        borderRadius: "4px",
                        backgroundColor:
                          fee.type === "MANDATORY" ? "#e3f2fd" : "#f3e5f5",
                        color: fee.type === "MANDATORY" ? "#1976d2" : "#7b1fa2",
                        display: "inline-block",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                      }}
                    >
                      {fee.type === "MANDATORY" ? "Bắt buộc" : "Tự nguyện"}
                    </Box>
                  </TableCell>

                  <TableCell align="center">
                    <Typography sx={{ fontSize: "14px" }}>
                      {fee.unitPrice ? (
                        `${fee.unitPrice.toLocaleString()} VND`
                      ) : (
                        <span style={{ color: "#9e9e9e" }}>-</span>
                      )}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">{renderStatusChip(fee.status)}</TableCell>

                  <TableCell align="left">
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        maxWidth: 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {fee.description || "-"}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => onEdit(fee)}
                        sx={{
                          textTransform: "none",
                          minWidth: "60px",
                          fontSize: "13px"
                        }}
                      >
                        Chỉnh sửa
                      </Button>
                      <Button
                        color="error"
                        size="small"
                        onClick={() => onDelete(fee)}
                        sx={{
                          textTransform: "none",
                          minWidth: "40px",
                          padding: "4px 8px"
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
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

export default FeeListTable;
