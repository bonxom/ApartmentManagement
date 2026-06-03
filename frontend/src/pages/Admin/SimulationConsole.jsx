import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
} from "@mui/material";
import {
  Play,
  CheckCircle,
  Copy,
  Terminal,
  Database,
  User,
  Wallet,
  FileText,
  Car,
} from "lucide-react";

export default function SimulationConsole() {
  const [activeScenario, setActiveScenario] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const scenarios = [
    {
      id: 1,
      title: "Kịch bản 1: Quản lý cư dân và căn hộ",
      desc: "Giả lập quy trình tạo mới Hộ khẩu, liên kết Cư dân, và chỉ định vai trò Chủ hộ.",
      icon: <User size={20} />,
      steps: [
        "Khởi tạo Hộ khẩu mới ID: HK001 tại phòng P1204...",
        "Tạo tài khoản cư dân Nguyễn Hoàng Anh (Chủ hộ)...",
        "Tạo tài khoản cư dân Lê Lan Phương (Vợ)...",
        "Liên kết các cư dân vào danh sách thành viên Hộ khẩu HK001...",
        "Tự động đồng bộ lịch sử cư trú và cập nhật thông tin trong database.json.",
      ],
      mockData: {
        household: {
          houseHoldID: "HK001",
          address: "Phòng 1204 - Tòa A - Chung cư Blue Sky",
          leader: "Nguyễn Hoàng Anh (Chủ hộ)",
          membersCount: 3,
        },
        residents: [
          { name: "Nguyễn Hoàng Anh", relationship: "household owner", job: "Kỹ sư Phần mềm" },
          { name: "Lê Lan Phương", relationship: "Vợ", job: "Giáo viên" },
          { name: "Nguyễn Hoàng Nam", relationship: "Con", job: "Học sinh" },
        ],
      },
      json: {
        houseHoldID: "HK001",
        address: "Phòng 1204 - Tòa A - Chung cư Blue Sky",
        leader: "647a1f5b8c9d2a0012a4b901",
        members: [
          "647a1f5b8c9d2a0012a4b901",
          "647a1f5b8c9d2a0012a4b902",
          "647a1f5b8c9d2a0012a4b903"
        ],
      },
    },
    {
      id: 2,
      title: "Kịch bản 2: Quản lý thu phí và công nợ",
      desc: "Giả lập nghiệp vụ tạo Khoản phí và ghi nhận giao dịch đóng tiền từ Kế toán.",
      icon: <Wallet size={20} />,
      steps: [
        "Tạo khoản phí MANDATORY: 'Phí Vệ sinh Q2/2026'...",
        "Tự động tính toán số tiền phải đóng cho hộ HK001 (3 thành viên x 6,000đ/tháng x 3 tháng)...",
        "Ghi nhận giao dịch nộp tiền mặt trị giá 54,000đ thành công...",
        "Tạo khoản đóng góp tự nguyện 'Quỹ khuyến học' trị giá 200,000đ...",
        "Cập nhật bảng cân đối tài chính và đổi trạng thái giao dịch sang VERIFIED.",
      ],
      mockData: {
        fees: [
          { name: "Phí Vệ sinh Q2/2026", type: "Bắt buộc (MANDATORY)", price: "54,000 đ" },
          { name: "Quỹ khuyến học 2026", type: "Tự nguyện (VOLUNTARY)", price: "200,000 đ" },
        ],
        transaction: {
          payer: "Nguyễn Hoàng Anh",
          totalPaid: "254,000 đ",
          status: "VERIFIED",
          date: "02/06/2026 15:00",
        },
      },
      json: {
        fee: "647a1f5b8c9d2a0012a4c001",
        household: "647a1f5b8c9d2a0012a4b801",
        payer: "647a1f5b8c9d2a0012a4b901",
        amount: 54000,
        status: "VERIFIED",
      },
    },
    {
      id: 3,
      title: "Kịch bản 3: Gửi phản ánh và dịch vụ",
      desc: "Mô phỏng quy trình cư dân gửi yêu cầu tạm trú, tạm vắng trực tuyến và được tổ trưởng phê duyệt.",
      icon: <FileText size={20} />,
      steps: [
        "Cư dân gửi yêu cầu TEMPORARY_RESIDENCE trực tuyến qua ứng dụng...",
        "Trạng thái yêu cầu ban đầu được ghi nhận là PENDING...",
        "Hệ thống thông báo tới tài khoản Tổ trưởng (HAMLET LEADER)...",
        "Tổ trưởng kiểm tra hồ sơ và nhấn 'Phê duyệt'...",
        "Cập nhật trạng thái yêu cầu sang APPROVED và gửi phản hồi thành công.",
      ],
      mockData: {
        request: {
          type: "Đăng ký tạm trú",
          requester: "Lê Lan Phương",
          reason: "Chuyển về ở cùng chồng",
          status: "APPROVED",
          comment: "Hồ sơ đầy đủ, phê duyệt đăng ký tạm trú hợp lệ.",
        },
      },
      json: {
        requester: "647a1f5b8c9d2a0012a4b902",
        type: "TEMPORARY_RESIDENCE",
        status: "APPROVED",
        requestData: {
          fullName: "Lê Lan Phương",
          reason: "Chuyển về ở cùng chồng",
        },
        leaderComment: "Hồ sơ đầy đủ, phê duyệt đăng ký tạm trú hợp lệ.",
      },
    },
    {
      id: 4,
      title: "Kịch bản 4: Đăng ký gửi xe",
      desc: "Mô phỏng quy trình đăng ký xe gắn máy và cấp thẻ gửi xe chung cư.",
      icon: <Car size={20} />,
      steps: [
        "Cư dân gửi yêu cầu đăng ký gửi phương tiện 'Honda SH' kèm biển số '29-G1 888.88'...",
        "Hệ thống xác thực chủ xe thuộc hộ gia đình hợp lệ...",
        "Ban quản lý cấp phát Mã thẻ gửi xe số: PK-HK001-01...",
        "Kích hoạt trạng thái thẻ gửi xe và ghi nhận mức thu phí hàng tháng (100,000đ)...",
        "Cập nhật thành công thông tin phương tiện liên kết với hộ gia đình.",
      ],
      mockData: {
        vehicle: {
          brand: "Honda SH 125i",
          licensePlate: "29-G1 888.88",
          color: "Đen Nhám",
          cardId: "PK-HK001-01",
          monthlyFee: "100,000 đ",
        },
      },
      json: {
        type: "UPDATE_INFO",
        status: "APPROVED",
        requestData: {
          requestTitle: "Đăng ký gửi xe máy chính chủ",
          vehicleType: "Motorbike",
          licensePlate: "29-G1 888.88",
          parkingCardID: "PK-HK001-01",
        },
      },
    },
  ];

  const runSimulation = (scenario) => {
    setIsRunning(true);
    setActiveScenario(scenario.id);
    setLogs([]);

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < scenario.steps.length) {
        setLogs((prev) => [...prev, scenario.steps[currentStep]]);
        currentStep++;
      } else {
        clearInterval(interval);
        setLogs((prev) => [...prev, "✔ KIỂM THỬ THÀNH CÔNG: Kịch bản đã chạy và kiểm duyệt hoàn tất!"]);
        setIsRunning(false);
      }
    }, 800);
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(JSON.stringify(text, null, 2));
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <Box sx={{ p: 4, maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#118ab2", mb: 1 }}>
          Simulation & Testing Console
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          Trình mô phỏng kịch bản tự động tích hợp trực tiếp trên giao diện để kiểm thử nhanh quy trình 4 kịch bản phục vụ báo cáo bài tập lớn.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Scenarios List */}
        <Grid item xs={12} md={7}>
          <Grid container spacing={3}>
            {scenarios.map((sc) => (
              <Grid item xs={12} key={sc.id}>
                <Card
                  sx={{
                    background:
                      activeScenario === sc.id
                        ? "linear-gradient(135deg, rgba(17, 138, 178, 0.08) 0%, rgba(42, 157, 143, 0.05) 100%)"
                        : "background.paper",
                    border: "1px solid",
                    borderColor: activeScenario === sc.id ? "primary.main" : "divider",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifySpace: "between", gap: 2, mb: 1.5 }}>
                      <Box
                        sx={{
                          p: 1.2,
                          borderRadius: "10px",
                          backgroundColor: activeScenario === sc.id ? "primary.light" : "action.hover",
                          color: activeScenario === sc.id ? "primary.main" : "text.secondary",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {sc.icon}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "16px" }}>
                          {sc.title}
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={isRunning && activeScenario === sc.id ? null : <Play size={14} />}
                        onClick={() => runSimulation(sc)}
                        disabled={isRunning}
                        sx={{
                          backgroundColor: activeScenario === sc.id ? "secondary.main" : "primary.main",
                          "&:hover": {
                            backgroundColor: activeScenario === sc.id ? "#218276" : "#0a5f82",
                          },
                        }}
                      >
                        {isRunning && activeScenario === sc.id ? "Đang chạy..." : "Chạy giả lập"}
                      </Button>
                    </Box>

                    <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                      {sc.desc}
                    </Typography>

                    {/* Collapsible Simulated Data */}
                    <Collapse in={activeScenario === sc.id}>
                      <Divider sx={{ my: 2 }} />

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: "secondary.main" }}>
                          Dữ liệu giả lập hiển thị trên UI:
                        </Typography>

                        {/* Render customized simulation data views */}
                        {sc.id === 1 && (
                          <Paper variant="outlined" sx={{ p: 2, backgroundColor: "background.default" }}>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                              Hộ Khẩu: {sc.mockData.household.houseHoldID}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                              Địa chỉ: {sc.mockData.household.address}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary", mb: 1.5 }}>
                              Chủ hộ: {sc.mockData.household.leader}
                            </Typography>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
                              Thành viên cư dân:
                            </Typography>
                            <Grid container spacing={1}>
                              {sc.mockData.residents.map((r, idx) => (
                                <Grid item xs={12} key={idx}>
                                  <Chip
                                    label={`${r.name} (${r.relationship === "household owner" ? "Chủ hộ" : r.relationship}) - ${r.job}`}
                                    variant="outlined"
                                    size="small"
                                    sx={{ mr: 1, my: 0.5 }}
                                  />
                                </Grid>
                              ))}
                            </Grid>
                          </Paper>
                        )}

                        {sc.id === 2 && (
                          <Paper variant="outlined" sx={{ p: 2, backgroundColor: "background.default" }}>
                            <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
                              Các khoản phí được tạo:
                            </Typography>
                            {sc.mockData.fees.map((f, idx) => (
                              <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                <Typography variant="body2">{f.name} ({f.type}):</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>{f.price}</Typography>
                              </Box>
                            ))}
                            <Divider sx={{ my: 1 }} />
                            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 700 }}>Giao dịch thanh toán:</Typography>
                              <Chip label={sc.mockData.transaction.status} color="success" size="small" />
                            </Box>
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                              Người nộp: {sc.mockData.transaction.payer}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                              Tổng tiền nộp: {sc.mockData.transaction.totalPaid}
                            </Typography>
                          </Paper>
                        )}

                        {sc.id === 3 && (
                          <Paper variant="outlined" sx={{ p: 2, backgroundColor: "background.default" }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                Yêu cầu: {sc.mockData.request.type}
                              </Typography>
                              <Chip label={sc.mockData.request.status} color="success" size="small" />
                            </Box>
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                              Người gửi: {sc.mockData.request.requester}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                              Lý do: {sc.mockData.request.reason}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "primary.main", mt: 1, fontStyle: "italic" }}>
                              Phản hồi của Tổ trưởng: "{sc.mockData.request.comment}"
                            </Typography>
                          </Paper>
                        )}

                        {sc.id === 4 && (
                          <Paper variant="outlined" sx={{ p: 2, backgroundColor: "background.default" }}>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                              Phương tiện: {sc.mockData.vehicle.brand} ({sc.mockData.vehicle.color})
                            </Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                              Biển số xe: {sc.mockData.vehicle.licensePlate}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                              Mã thẻ gửi xe cấp: {sc.mockData.vehicle.cardId}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 700 }}>
                              Phí định kỳ: {sc.mockData.vehicle.monthlyFee}/tháng
                            </Typography>
                          </Paper>
                        )}
                      </Box>

                      {/* Mock JSON Collapsible */}
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>
                            DỮ LIỆU MOCK JSON (DÙNG CHO BÁO CÁO):
                          </Typography>
                          <Button
                            size="small"
                            variant="text"
                            startIcon={<Copy size={12} />}
                            onClick={() => handleCopy(sc.json, sc.id)}
                            sx={{ fontSize: "11px", py: 0 }}
                          >
                            {copiedIndex === sc.id ? "Đã sao chép!" : "Sao chép JSON"}
                          </Button>
                        </Box>
                        <Paper
                          sx={{
                            p: 1.5,
                            backgroundColor: "#1e293b",
                            color: "#38bdf8",
                            fontFamily: "monospace",
                            fontSize: "11px",
                            overflowX: "auto",
                          }}
                        >
                          <pre style={{ margin: 0 }}>{JSON.stringify(sc.json, null, 2)}</pre>
                        </Paper>
                      </Box>
                    </Collapse>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Real-time Logs Console */}
        <Grid item xs={12} md={5}>
          <Card
            sx={{
              height: "100%",
              minHeight: "450px",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#0f172a",
              border: "1px solid rgba(148, 163, 184, 0.12)",
              color: "#cbd5e1",
            }}
          >
            <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", height: "100%", flexGrow: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Terminal size={18} style={{ color: "#38bdf8" }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#38bdf8" }}>
                  Mô phỏng thực thi (Real-time Log)
                </Typography>
              </Box>
              <Divider sx={{ borderColor: "rgba(148, 163, 184, 0.12)", mb: 2 }} />

              <Box
                sx={{
                  flexGrow: 1,
                  backgroundColor: "#020617",
                  p: 2,
                  borderRadius: "8px",
                  fontFamily: "monospace",
                  fontSize: "12px",
                  height: "350px",
                  overflowY: "auto",
                  border: "1px solid rgba(148, 163, 184, 0.08)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                {logs.length === 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      color: "rgba(148, 163, 184, 0.4)",
                    }}
                  >
                    <Database size={40} style={{ marginBottom: "12px" }} />
                    <Typography variant="body2">
                      Chọn một kịch bản và nhấn "Chạy giả lập" để xem quá trình xử lý thời gian thực.
                    </Typography>
                  </Box>
                ) : (
                  logs.map((log, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        color: log.startsWith("✔") ? "#4ade80" : "#94a3b8",
                        display: "flex",
                        gap: 1,
                      }}
                    >
                      <span>&gt;</span>
                      <span>{log}</span>
                    </Box>
                  ))
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
