import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Box,
  Pagination,
  IconButton,
} from "@mui/material";
import { ArrowUpDown } from "lucide-react";
import FeeStatusChip from "./FeeStatusChip";

export default function FeeTable({ fees, loading, onPayClick }) {
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
          case 'type':
            // MANDATORY (Bắt buộc) trước, VOLUNTARY (Tự nguyện) sau
            aValue = a.type === 'MANDATORY' ? 0 : 1;
            bValue = b.type === 'MANDATORY' ? 0 : 1;
            break;
          case 'requiredAmount':
            aValue = a.requiredAmount || 0;
            bValue = b.requiredAmount || 0;
            break;
          case 'paidAmount':
            aValue = a.paidAmount || 0;
            bValue = b.paidAmount || 0;
            break;
          case 'remainingAmount':
            aValue = a.remainingAmount || 0;
            bValue = b.remainingAmount || 0;
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
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#F8FAFC" }}>
            <TableRow>
              <TableCell>Tên khoản thu</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
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
              <TableCell align="right">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                  Định mức
                  <IconButton 
                    size="small" 
                    onClick={() => handleSort('requiredAmount')}
                    sx={{ 
                      padding: '2px',
                      color: sortConfig.key === 'requiredAmount' ? '#2D66F5' : '#666'
                    }}
                  >
                    <ArrowUpDown size={16} />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                  Đã nộp
                  <IconButton 
                    size="small" 
                    onClick={() => handleSort('paidAmount')}
                    sx={{ 
                      padding: '2px',
                      color: sortConfig.key === 'paidAmount' ? '#2D66F5' : '#666'
                    }}
                  >
                    <ArrowUpDown size={16} />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                  Còn thiếu
                  <IconButton 
                    size="small" 
                    onClick={() => handleSort('remainingAmount')}
                    sx={{ 
                      padding: '2px',
                      color: sortConfig.key === 'remainingAmount' ? '#2D66F5' : '#666'
                    }}
                  >
                    <ArrowUpDown size={16} />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
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
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleFees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  Hộ gia đình của bạn chưa có khoản thu nào.
                </TableCell>
              </TableRow>
            ) : (
              visibleFees.map((fee) => (
                <TableRow key={fee.feeId || fee._id} hover>
                  <TableCell>{fee.name}</TableCell>
                  <TableCell>{fee.type === "MANDATORY" ? "Bắt buộc" : "Tự nguyện"}</TableCell>
                  <TableCell align="right">
                    {fee.requiredAmount ? fee.requiredAmount.toLocaleString() + " VND" : "-"}
                  </TableCell>
                  <TableCell align="right">
                    {fee.paidAmount ? fee.paidAmount.toLocaleString() + " VND" : "0"}
                  </TableCell>
                  <TableCell align="right">
                    {fee.remainingAmount ? fee.remainingAmount.toLocaleString() + " VND" : "0"}
                  </TableCell>
                  <TableCell>
                    <FeeStatusChip status={fee.status} />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => onPayClick(fee)}
                      disabled={fee.status === "COMPLETED"}
                      sx={{
                        textTransform: "none",
                        minWidth: "60px",
                        fontSize: "13px"
                      }}
                    >
                      Thanh toán
                    </Button>
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
