import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Popover,
  Avatar,
} from "@mui/material";
import { CheckCircle2, XCircle, FileText } from "lucide-react";

export default function NotificationPanel({ anchorEl, open, onClose }) {
  // Giả sử có 10 tin thông báo để bạn thấy rõ hiệu ứng cuộn (scroll)
  const mockNotifications = [
    {
      id: 1,
      title: "Phê duyệt tạm trú",
      content: "Yêu cầu đăng ký tạm trú của bạn đã được phê duyệt.",
      status: "APPROVED",
      time: "2 phút trước",
    },
    {
      id: 2,
      title: "Thanh toán hóa đơn",
      content: "Giao dịch đóng phí dịch vụ tháng 12 bị từ chối.",
      status: "REJECTED",
      time: "1 giờ trước",
    },
    {
      id: 3,
      title: "Xác nhận sinh tử",
      content: "Khai báo giấy chứng sinh hộ gia đình đã được xác nhận.",
      status: "APPROVED",
      time: "5 giờ trước",
    },
    {
      id: 4,
      title: "Yêu cầu tạm vắng",
      content: "Đơn tạm vắng của bạn đang đợi Admin kiểm tra.",
      status: "PENDING",
      time: "1 ngày trước",
    },
    {
      id: 5,
      title: "Thông báo bảo trì",
      content: "Hệ thống sẽ bảo trì nâng cấp vào lúc 0h ngày mai.",
      status: "PENDING",
      time: "2 ngày trước",
    },
    {
      id: 6,
      title: "Tiền điện tháng 12",
      content: "Đã có hóa đơn tiền điện tháng 12, vui lòng thanh toán.",
      status: "PENDING",
      time: "3 ngày trước",
    },
    {
      id: 7,
      title: "Hệ thống",
      content: "Bạn vừa đổi mật khẩu thành công.",
      status: "APPROVED",
      time: "4 ngày trước",
    },
  ];

  const getIcon = (status) => {
    if (status === "APPROVED")
      return <CheckCircle2 size={20} color="#2e7d32" />;
    if (status === "REJECTED") return <XCircle size={20} color="#d32f2f" />;
    return <FileText size={20} color="#ed6c02" />;
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      PaperProps={{
        sx: {
          mt: 1.5,
          width: 360,
          borderRadius: "16px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
          Thông báo
        </Typography>
      </Box>
      <Divider />

      {/* PHẦN CHỨA DANH SÁCH CÓ CON LĂN (SCROLL) */}
      <List
        sx={{
          p: 0,
          maxHeight: "380px", // Chiều cao cố định (khoảng 4-5 tin tùy độ dài chữ)
          overflowY: "auto", // Hiện con lăn khi nội dung vượt quá maxHeight
          "&::-webkit-scrollbar": { width: "6px" }, // Tùy chỉnh thanh cuộn cho đẹp
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#e0e0e0",
            borderRadius: "10px",
          },
        }}
      >
        {mockNotifications.map((noti) => (
          <ListItem
            key={noti.id}
            button
            onClick={onClose}
            sx={{
              py: 1.5,
              px: 2,
              borderBottom: "1px solid #f0f0f0",
              "&:hover": { bgcolor: "#f0f7ff" },
            }}
          >
            <Box sx={{ mr: 2 }}>
              <Avatar
                sx={{
                  bgcolor:
                    noti.status === "APPROVED"
                      ? "#e8f5e9"
                      : noti.status === "REJECTED"
                      ? "#ffebee"
                      : "#fff3e0",
                  width: 40,
                  height: 40,
                }}
              >
                {getIcon(noti.status)}
              </Avatar>
            </Box>
            <ListItemText
              primary={
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 700 }}>
                  {noti.title}
                </Typography>
              }
              secondary={
                <Box>
                  <Typography sx={{ fontSize: "0.8rem", color: "#4b5563" }}>
                    {noti.content}
                  </Typography>
                  <Typography
                    sx={{ fontSize: "0.7rem", color: "#9ca3af", mt: 0.5 }}
                  >
                    {noti.time}
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>

      <Divider />
      {/* NÚT XEM TẤT CẢ LUÔN NẰM DƯỚI CÙNG KHÔNG BỊ CUỘN THEO */}
      <Box sx={{ p: 1.5, textAlign: "center", bgcolor: "#fff" }}>
        <Typography
          variant="body2"
          sx={{
            color: "#2563eb",
            fontWeight: 700,
            cursor: "pointer",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Xem tất cả
        </Typography>
      </Box>
    </Popover>
  );
}
