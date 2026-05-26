import { useState } from "react";
import { Box, Fab, Badge, Zoom, Tooltip } from "@mui/material";
import { MessageCircleMore, X } from "lucide-react";
import ChatWindow from "./ChatWindow";
import useAuthStore from "../../store/authStore";

export default function BubbleChat() {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Kiểm tra quyền truy cập
  const hasAccess = user?.role?.role_name && 
    ["HAMLET LEADER", "ACCOUNTANT", "HOUSE MEMBER"].includes(user.role.role_name);

  const handleToggle = () => {
    if (!hasAccess) {
      return;
    }
    setOpen(!open);
    if (!open) {
      setUnreadCount(0);
    }
  };

  const handleNewMessage = () => {
    if (!open) {
      setUnreadCount((prev) => prev + 1);
    }
  };

  // Không hiển thị nếu user không có quyền
  if (!hasAccess) {
    return null;
  }

  return (
    <>
      {/* Floating Chat Bubble */}
      <Zoom in={!open}>
        <Box
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
        >
          <Tooltip title="Mở chat" placement="left">
            <Badge
              badgeContent={unreadCount}
              color="error"
              overlap="circular"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: "12px",
                  height: "22px",
                  minWidth: "22px",
                  borderRadius: "11px",
                  fontWeight: 600,
                },
              }}
            >
              <Fab
                color="primary"
                onClick={handleToggle}
                sx={{
                  width: 64,
                  height: 64,
                  background: "linear-gradient(135deg, #002df8ff 0%, #aaa2faff 100%)",
                  boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transition: "all 1s cubic-bezier(0.4, 0, 0.2, 1)",
                    background: "linear-gradient(135deg, #aaa2faff 0%, #002df8ff 100%)",
                    transform: "scale(1.1) rotate(360deg)",
                    boxShadow: "0 12px 32px rgba(102, 126, 234, 0.5)",
                  },
                  "&:active": {
                    transform: "scale(0.95)",
                  },
                }}
              >
                <MessageCircleMore size={28} color="white" />
              </Fab>
            </Badge>
          </Tooltip>
        </Box>
      </Zoom>

      {/* Close Button when chat is open */}
      <Zoom in={open}>
        <Box
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
        >
          <Tooltip title="Đóng chat" placement="left">
            <Fab
              color="error"
              onClick={handleToggle}
              sx={{
                width: 64,
                height: 64,
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                boxShadow: "0 8px 24px rgba(245, 87, 108, 0.4)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  background: "linear-gradient(135deg, #f5576c 0%, #f093fb 100%)",
                  transform: "scale(1.1) rotate(-5deg)",
                  boxShadow: "0 12px 32px rgba(245, 87, 108, 0.5)",
                },
                "&:active": {
                  transform: "scale(0.95)",
                },
              }}
            >
              <X size={28} color="white" />
            </Fab>
          </Tooltip>
        </Box>
      </Zoom>

      {/* Chat Window */}
      <ChatWindow 
        open={open} 
        onClose={handleToggle}
        onNewMessage={handleNewMessage}
      />
    </>
  );
}
