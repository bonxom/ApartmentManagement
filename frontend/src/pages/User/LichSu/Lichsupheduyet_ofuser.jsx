import { useEffect, useState } from "react";
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
  Chip,
  Grid,
  Card,
  CardContent,
  CardActions,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  FamilyRestroom,
  HomeWork,
  Visibility,
} from "@mui/icons-material";
import { requestAPI } from "../../../api/apiService";

const formatDateTime = (value) =>
  value ? new Date(value).toLocaleString("vi-VN") : "-";

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("vi-VN") : "-";

const getStatusLabel = (status) => {
  switch (status) {
    case "APPROVED":
      return "Đã duyệt";
    case "REJECTED":
      return "Từ chối";
    default:
      return "Chờ duyệt";
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "APPROVED":
      return "success";
    case "REJECTED":
      return "error";
    default:
      return "warning";
  }
};

function BirthDeathTable({ data }) {
  const ROWS_PER_PAGE = 5;
  const [page, setPage] = useState(1);

  const pageCount = Math.ceil(data.length / ROWS_PER_PAGE) || 1;
  const visibleRows = data.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const getTypeLabel = (type) => (type === "BIRTH_REPORT" ? "Khai sinh" : "Khai tử");
  const getTypeColor = (type) => (type === "BIRTH_REPORT" ? "success" : "error");

  return (
    <Box>
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#F8FAFC" }}>
            <TableRow>
              <TableCell><strong>Thời gian</strong></TableCell>
              <TableCell><strong>Loại</strong></TableCell>
              <TableCell><strong>Đối tượng</strong></TableCell>
              <TableCell><strong>Ngày sinh/tử</strong></TableCell>
              <TableCell><strong>Trạng thái</strong></TableCell>
              <TableCell><strong>Ghi chú</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Không có yêu cầu nào.
                </TableCell>
              </TableRow>
            ) : (
              visibleRows.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.time}</TableCell>
                  <TableCell>
                    <Chip label={getTypeLabel(row.type)} color={getTypeColor(row.type)} size="small" />
                  </TableCell>
                  <TableCell>{row.subjectName}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>
                    <Chip label={getStatusLabel(row.status)} color={getStatusColor(row.status)} size="small" />
                  </TableCell>
                  <TableCell>{row.note}</TableCell>
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
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Box>
  );
}

function ResidenceTable({ data }) {
  const ROWS_PER_PAGE = 5;
  const [page, setPage] = useState(1);

  const pageCount = Math.ceil(data.length / ROWS_PER_PAGE) || 1;
  const visibleRows = data.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const getTypeLabel = (type) =>
    type === "TEMPORARY_RESIDENCE" ? "Tạm trú" : "Tạm vắng";
  const getTypeColor = (type) =>
    type === "TEMPORARY_RESIDENCE" ? "primary" : "secondary";

  return (
    <Box>
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#F8FAFC" }}>
            <TableRow>
              <TableCell><strong>Thời gian</strong></TableCell>
              <TableCell><strong>Loại</strong></TableCell>
              <TableCell><strong>Đối tượng</strong></TableCell>
              <TableCell><strong>Từ ngày</strong></TableCell>
              <TableCell><strong>Đến ngày</strong></TableCell>
              <TableCell><strong>Lý do</strong></TableCell>
              <TableCell><strong>Trạng thái</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Không có yêu cầu nào.
                </TableCell>
              </TableRow>
            ) : (
              visibleRows.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.time}</TableCell>
                  <TableCell>
                    <Chip label={getTypeLabel(row.type)} color={getTypeColor(row.type)} size="small" />
                  </TableCell>
                  <TableCell>{row.subjectName}</TableCell>
                  <TableCell>{row.startDate}</TableCell>
                  <TableCell>{row.endDate}</TableCell>
                  <TableCell>{row.reason}</TableCell>
                  <TableCell>
                    <Chip label={getStatusLabel(row.status)} color={getStatusColor(row.status)} size="small" />
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
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Box>
  );
}

export default function Lichsupheduyet() {
  const [activeSection, setActiveSection] = useState(null);
  const [birthDeathHistory, setBirthDeathHistory] = useState([]);
  const [residenceHistory, setResidenceHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const [birthRes, deathRes, residenceRes, absentRes] = await Promise.all([
        requestAPI.getMyHouseholdRequests({ type: "BIRTH_REPORT" }),
        requestAPI.getMyHouseholdRequests({ type: "DEATH_REPORT" }),
        requestAPI.getMyHouseholdRequests({ type: "TEMPORARY_RESIDENCE" }),
        requestAPI.getMyHouseholdRequests({ type: "TEMPORARY_ABSENT" }),
      ]);

      const birthDeathData = [...(birthRes || []), ...(deathRes || [])]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((req) => ({
          id: req._id,
          time: formatDateTime(req.createdAt),
          type: req.type,
          status: req.status,
          subjectName:
            req.type === "BIRTH_REPORT"
              ? req.requestData?.name || "-"
              : req.requestData?.deceasedUserName ||
                req.requestData?.deceasedUserId ||
                "-",
          date:
            req.type === "BIRTH_REPORT"
              ? formatDate(req.requestData?.dob)
              : formatDate(req.requestData?.dateOfDeath),
          note: req.leaderComment || req.requestData?.note || "-",
        }));

      const residenceData = [...(residenceRes || []), ...(absentRes || [])]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((req) => ({
          id: req._id,
          time: formatDateTime(req.createdAt),
          type: req.type,
          status: req.status,
          subjectName:
            req.type === "TEMPORARY_RESIDENCE"
              ? req.requestData?.name || "-"
              : req.requestData?.absentUserName ||
                req.requestData?.absentUserId ||
                "-",
          startDate:
            req.type === "TEMPORARY_RESIDENCE"
              ? formatDate(req.requestData?.startDate)
              : formatDate(req.requestData?.fromDate),
          endDate:
            req.type === "TEMPORARY_RESIDENCE"
              ? formatDate(req.requestData?.endDate)
              : formatDate(req.requestData?.toDate),
          reason: req.requestData?.reason || "-",
        }));

      setBirthDeathHistory(birthDeathData);
      setResidenceHistory(residenceData);
    } catch (err) {
      const msg =
        err?.message || err?.customMessage || "Không thể tải lịch sử phê duyệt";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const sections = [
    {
      id: "birth-death",
      title: "Lịch sử phê duyệt sinh tử",
      description: "Xem lịch sử các yêu cầu khai sinh, khai tử đã được phê duyệt",
      icon: <FamilyRestroom sx={{ fontSize: 40 }} />,
      color: "#10b981",
      bgColor: "#ecfdf5",
      data: birthDeathHistory,
      component: BirthDeathTable,
    },
    {
      id: "residence",
      title: "Lịch sử phê duyệt tạm trú/vắng",
      description: "Xem lịch sử các yêu cầu tạm trú, tạm vắng đã được phê duyệt",
      icon: <HomeWork sx={{ fontSize: 40 }} />,
      color: "#3b82f6",
      bgColor: "#eff6ff",
      data: residenceHistory,
      component: ResidenceTable,
    },
  ];

  const handleSectionClick = (sectionId) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  return (
    <Box sx={{ padding: "24px 32px" }}>
      <Typography sx={{ fontSize: 26, fontWeight: 600, mb: 3 }}>
        Lịch sử phê duyệt
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {sections.map((section) => (
          <Grid item xs={12} md={6} key={section.id}>
            <Card
              sx={{
                height: "100%",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                borderRadius: "16px",
                background: activeSection === section.id 
                  ? `linear-gradient(135deg, ${section.bgColor} 0%, #ffffff 100%)`
                  : "#ffffff",
                boxShadow: activeSection === section.id
                  ? `0 8px 32px ${section.color}20`
                  : "0 2px 12px rgba(0,0,0,0.08)",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: `0 12px 40px ${section.color}30`,
                },
                border: activeSection === section.id
                  ? `2px solid ${section.color}`
                  : "2px solid transparent",
              }}
              onClick={() => handleSectionClick(section.id)}
            >
              <CardContent sx={{ textAlign: "center", p: 4 }}>
                <Box 
                  sx={{ 
                    color: section.color, 
                    mb: 2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "80px",
                    height: "80px",
                    borderRadius: "20px",
                    backgroundColor: section.bgColor,
                    margin: "0 auto 16px",
                  }}
                >
                  {section.icon}
                </Box>
                <Typography 
                  variant="h6" 
                  fontWeight={600} 
                  mb={1.5}
                  sx={{ 
                    fontSize: "18px",
                    color: "#1a202c",
                  }}
                >
                  {section.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  mb={3}
                  sx={{
                    fontSize: "14px",
                    lineHeight: 1.6,
                    color: "#64748b",
                  }}
                >
                  {section.description}
                </Typography>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                    px: 2,
                    py: 0.75,
                    borderRadius: "12px",
                    backgroundColor: section.bgColor,
                  }}
                >
                  <Typography 
                    variant="body2" 
                    fontWeight={600} 
                    sx={{ 
                      color: section.color,
                      fontSize: "15px",
                    }}
                  >
                    {section.data.length}
                  </Typography>
                  <Typography 
                    variant="body2"
                    sx={{ 
                      color: section.color,
                      fontSize: "14px",
                    }}
                  >
                    bản ghi
                  </Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: "center", pb: 3 }}>
                <Button
                  variant={activeSection === section.id ? "contained" : "outlined"}
                  startIcon={<Visibility />}
                  sx={{
                    backgroundColor: activeSection === section.id ? section.color : "transparent",
                    borderColor: section.color,
                    color: activeSection === section.id ? "white" : section.color,
                    borderRadius: "10px",
                    textTransform: "none",
                    px: 3,
                    py: 1,
                    fontSize: "14px",
                    fontWeight: 500,
                    borderWidth: "2px",
                    "&:hover": {
                      backgroundColor: section.color,
                      color: "white",
                      borderColor: section.color,
                      borderWidth: "2px",
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  {activeSection === section.id ? "Đang xem" : "Xem chi tiết"}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {activeSection && (
        <Box sx={{ mt: 5 }}>
          {sections.map((section) => {
            if (section.id !== activeSection) return null;
            const TableComponent = section.component;
            return (
              <Box key={section.id}>
                <Box 
                  sx={{ 
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 3,
                    pb: 2,
                    borderBottom: `3px solid ${section.color}`,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      backgroundColor: section.bgColor,
                      color: section.color,
                    }}
                  >
                    {section.icon}
                  </Box>
                  <Typography 
                    variant="h5" 
                    fontWeight={600} 
                    sx={{ 
                      color: section.color,
                      fontSize: "22px",
                    }}
                  >
                    {section.title}
                  </Typography>
                </Box>
                <Paper 
                  sx={{ 
                    p: 3, 
                    borderRadius: "16px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    border: "1px solid #f1f5f9",
                  }}
                >
                  {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                      <CircularProgress sx={{ color: section.color }} />
                    </Box>
                  ) : (
                    <TableComponent data={section.data} />
                  )}
                </Paper>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
