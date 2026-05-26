// import React, { useState } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   TextField,
//   InputAdornment,
//   Select,
//   MenuItem,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Pagination,
// } from "@mui/material";
// import { Search, Filter, ChevronDown } from "lucide-react";

// const residentsData = [
//   {
//     id: 1,
//     cccd: "012345678901",
//     fullName: "Nguyễn Văn A",
//     relation: "Chủ hộ",
//     dob: "12/03/1980",
//   },
//   {
//     id: 2,
//     cccd: "012345678902",
//     fullName: "Trần Thị B",
//     relation: "Vợ",
//     dob: "20/11/1985",
//   },
//   {
//     id: 3,
//     cccd: "012345678903",
//     fullName: "Nguyễn Văn C",
//     relation: "Con",
//     dob: "05/04/2010",
//   },
// ];

// export default function ThongTinHoDanPage() {
//   const [page, setPage] = useState(1);

//   return (
//     <Box
//       sx={{ p: "24px 32px", minHeight: "100vh", backgroundColor: "#F5F7FA" }}
//     >
//       {/* HEADER: Tiêu đề trang */}
//       <Box sx={{ mb: 3 }}>
//         <Typography
//           sx={{ fontSize: "26px", fontWeight: "600", color: "#1F2335" }}
//         >
//           Thông tin thành viên hộ dân
//         </Typography>
//       </Box>

//       {/* SEARCH BOX: Đã thu nhỏ tỉ lệ y hệt bản gốc */}
//       <Box
//         sx={{
//           display: "flex",
//           gap: 2,
//           backgroundColor: "white",
//           padding: "20px 24px",
//           borderRadius: "12px",
//           boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
//           alignItems: "center",
//           mb: 4,
//         }}
//       >
//         {/* Ô tìm kiếm */}
//         <Box sx={{ flex: 1 }}>
//           <Typography
//             sx={{ fontSize: "13px", mb: 0.8, color: "#666", fontWeight: 500 }}
//           >
//             Tìm kiếm
//           </Typography>
//           <TextField
//             fullWidth
//             placeholder="Nhập từ khóa..."
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <Search size={18} color="#777" />
//                 </InputAdornment>
//               ),
//               sx: {
//                 background: "#F1F3F6",
//                 borderRadius: "8px",
//                 height: "40px", // Chiều cao chuẩn thu nhỏ
//                 fontSize: "14px",
//                 "& fieldset": { border: "none" },
//               },
//             }}
//           />
//         </Box>

//         {/* Bộ lọc */}
//         <Box sx={{ width: "200px" }}>
//           <Typography
//             sx={{ fontSize: "13px", mb: 0.8, color: "#666", fontWeight: 500 }}
//           >
//             Lọc theo
//           </Typography>
//           <Box
//             sx={{
//               backgroundColor: "#F1F3F6",
//               height: "40px",
//               borderRadius: "8px",
//               display: "flex",
//               alignItems: "center",
//               px: 1.5,
//             }}
//           >
//             <Filter size={16} color="#555" style={{ marginRight: 8 }} />
//             <Select
//               fullWidth
//               displayEmpty
//               defaultValue=""
//               variant="standard"
//               disableUnderline
//               IconComponent={() => <ChevronDown size={16} />}
//               sx={{ fontSize: "14px" }}
//             >
//               <MenuItem value="">Tất cả</MenuItem>
//               <MenuItem value="hokhau">Hộ khẩu</MenuItem>
//               <MenuItem value="nhankhau">Nhân khẩu</MenuItem>
//             </Select>
//           </Box>
//         </Box>

//         {/* Nút Tìm kiếm */}
//         <Button
//           variant="contained"
//           sx={{
//             backgroundColor: "#2D66F5",
//             borderRadius: "8px",
//             textTransform: "none",
//             height: "40px",
//             width: "110px",
//             fontSize: "14px",
//             fontWeight: "500",
//             mt: "24px", // Căn lề để thẳng hàng với input
//             "&:hover": { backgroundColor: "#1E54D4" },
//             boxShadow: "none",
//           }}
//         >
//           Tìm kiếm
//         </Button>
//       </Box>

//       {/* TABLE AREA: Bảng dữ liệu sạch sẽ */}
//       <Box
//         sx={{
//           backgroundColor: "white",
//           borderRadius: "16px",
//           boxShadow: "0px 3px 12px rgba(0, 0, 0, 0.05)",
//           overflow: "hidden",
//         }}
//       >
//         <TableContainer>
//           <Table>
//             <TableHead sx={{ backgroundColor: "#F8F9FB" }}>
//               <TableRow>
//                 <TableCell
//                   sx={{ fontWeight: "600", color: "#475467", fontSize: "14px" }}
//                 >
//                   Số CCCD
//                 </TableCell>
//                 <TableCell
//                   sx={{ fontWeight: "600", color: "#475467", fontSize: "14px" }}
//                 >
//                   Họ và tên
//                 </TableCell>
//                 <TableCell
//                   sx={{ fontWeight: "600", color: "#475467", fontSize: "14px" }}
//                 >
//                   Quan hệ
//                 </TableCell>
//                 <TableCell
//                   sx={{ fontWeight: "600", color: "#475467", fontSize: "14px" }}
//                 >
//                   Ngày sinh
//                 </TableCell>
//                 <TableCell
//                   align="center"
//                   sx={{ fontWeight: "600", color: "#475467", fontSize: "14px" }}
//                 >
//                   Thao tác
//                 </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {residentsData.map((row) => (
//                 <TableRow key={row.id} hover>
//                   <TableCell sx={{ fontSize: "14px", color: "#344054" }}>
//                     {row.cccd}
//                   </TableCell>
//                   <TableCell sx={{ fontSize: "14px", color: "#344054" }}>
//                     {row.fullName}
//                   </TableCell>
//                   <TableCell sx={{ fontSize: "14px", color: "#344054" }}>
//                     {row.relation}
//                   </TableCell>
//                   <TableCell sx={{ fontSize: "14px", color: "#344054" }}>
//                     {row.dob}
//                   </TableCell>
//                   <TableCell align="center">
//                     <Button
//                       variant="text"
//                       sx={{
//                         textTransform: "none",
//                         fontSize: "14px",
//                         color: "#2D66F5",
//                         fontWeight: "600",
//                         "&:hover": {
//                           textDecoration: "underline",
//                           backgroundColor: "transparent",
//                         },
//                       }}
//                     >
//                       Xem chi tiết
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         {/* PHÂN TRANG */}
//         <Box
//           sx={{
//             p: 2,
//             display: "flex",
//             justifyContent: "flex-end",
//             borderTop: "1px solid #EAECF0",
//           }}
//         >
//           <Pagination
//             count={5}
//             page={page}
//             onChange={(e, v) => setPage(v)}
//             shape="rounded"
//             size="small"
//           />
//         </Box>
//       </Box>
//     </Box>
//   );
// }

import React, { useMemo, useState } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
} from "@mui/material";
import { Search, Filter, ChevronDown } from "lucide-react";

/* ===== DATA GIẢ ===== */
const residentsData = [
  {
    id: 1,
    cccd: "012345678901",
    fullName: "Nguyễn Văn A",
    relation: "Chủ hộ",
    dob: "12/03/1980",
    gender: "Nam",
    address: "Số 12, Phường A, Quận B",
    type: "hokhau",
  },
  {
    id: 2,
    cccd: "012345678902",
    fullName: "Trần Thị B",
    relation: "Vợ",
    dob: "20/11/1985",
    gender: "Nữ",
    address: "Số 12, Phường A, Quận B",
    type: "hokhau",
  },
  {
    id: 3,
    cccd: "012345678903",
    fullName: "Nguyễn Văn C",
    relation: "Con",
    dob: "05/04/2010",
    gender: "Nam",
    address: "Số 12, Phường A, Quận B",
    type: "nhankhau",
  },
  {
    id: 4,
    cccd: "012345678904",
    fullName: "Nguyễn Văn D",
    relation: "Con",
    dob: "09/08/2012",
    gender: "Nam",
    address: "Số 12, Phường A, Quận B",
    type: "nhankhau",
  },
  {
    id: 5,
    cccd: "012345678905",
    fullName: "Lê Thị E",
    relation: "Mẹ",
    dob: "01/01/1960",
    gender: "Nữ",
    address: "Số 12, Phường A, Quận B",
    type: "hokhau",
  },
  {
    id: 6,
    cccd: "012345678906",
    fullName: "Phạm Văn F",
    relation: "Cha",
    dob: "02/02/1958",
    gender: "Nam",
    address: "Số 12, Phường A, Quận B",
    type: "hokhau",
  },
];

const PAGE_SIZE = 5;

export default function ThongTinHoDanPage() {
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [filterType, setFilterType] = useState("");
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedResident, setSelectedResident] = useState(null);

  /* ===== SEARCH + FILTER ===== */
  const filteredData = useMemo(() => {
    return residentsData.filter((r) => {
      const matchKeyword =
        r.fullName.toLowerCase().includes(keyword.toLowerCase()) ||
        r.cccd.includes(keyword);
      const matchType = filterType ? r.type === filterType : true;
      return matchKeyword && matchType;
    });
  }, [keyword, filterType]);

  /* ===== PAGINATION ===== */
  const totalPage = Math.ceil(filteredData.length / PAGE_SIZE);
  const pagedData = filteredData.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* ===== OPEN DETAIL ===== */
  const handleViewDetail = (resident) => {
    setSelectedResident(resident);
    setOpenDetail(true);
  };

  return (
    <Box
      sx={{ p: "24px 32px", minHeight: "100vh", backgroundColor: "#F5F7FA" }}
    >
      {/* ===== TITLE ===== */}
      <Typography sx={{ fontSize: 26, fontWeight: 600, mb: 3 }}>
        Thông tin thành viên hộ dân
      </Typography>

      {/* ===== SEARCH + FILTER ===== */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          backgroundColor: "white",
          p: "20px 24px",
          borderRadius: "12px",
          mb: 4,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: 13, mb: 0.8 }}>Tìm kiếm</Typography>
          <TextField
            fullWidth
            placeholder="Nhập tên hoặc CCCD..."
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(1);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} />
                </InputAdornment>
              ),
              sx: {
                background: "#F1F3F6",
                borderRadius: "8px",
                height: "40px",
                "& fieldset": { border: "none" },
              },
            }}
          />
        </Box>

        <Box sx={{ width: 200 }}>
          <Typography sx={{ fontSize: 13, mb: 0.8 }}>Lọc theo</Typography>
          <Box
            sx={{
              backgroundColor: "#F1F3F6",
              height: "40px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              px: 1.5,
            }}
          >
            <Filter size={16} />
            <Select
              fullWidth
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setPage(1);
              }}
              variant="standard"
              disableUnderline
              IconComponent={() => <ChevronDown size={16} />}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="hokhau">Hộ khẩu</MenuItem>
              <MenuItem value="nhankhau">Nhân khẩu</MenuItem>
            </Select>
          </Box>
        </Box>
      </Box>

      {/* ===== TABLE ===== */}
      <Paper sx={{ borderRadius: "16px", overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#F8FAFC" }}>
              <TableRow>
                <TableCell>Số CCCD</TableCell>
                <TableCell>Họ và tên</TableCell>
                <TableCell>Quan hệ</TableCell>
                <TableCell>Ngày sinh</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pagedData.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.cccd}</TableCell>
                  <TableCell>{row.fullName}</TableCell>
                  <TableCell>{row.relation}</TableCell>
                  <TableCell>{row.dob}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="text"
                      onClick={() => handleViewDetail(row)}
                    >
                      Xem chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "flex-end",
            borderTop: "1px solid #EAECF0",
          }}
        >
          <Pagination
            count={totalPage}
            page={page}
            onChange={(e, v) => setPage(v)}
            shape="rounded"
            size="small"
          />
        </Box>
      </Paper>

      {/* ===== DETAIL MODAL ===== */}
      <Dialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Thông tin chi tiết</DialogTitle>
        <DialogContent dividers>
          {selectedResident && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Số CCCD"
                  value={selectedResident.cccd}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Họ và tên"
                  value={selectedResident.fullName}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Quan hệ"
                  value={selectedResident.relation}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Ngày sinh"
                  value={selectedResident.dob}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Giới tính"
                  value={selectedResident.gender}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Nơi ở"
                  value={selectedResident.address}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
