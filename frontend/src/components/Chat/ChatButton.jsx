import { useState, useEffect } from "react";
import {
  IconButton,
  Badge,
  Tooltip,
} from "@mui/material";
import { Message as MessageIcon } from "@mui/icons-material";
import ChatWindow from "./ChatWindow";
import useAuthStore from "../../store/authStore";

export default function ChatButton() {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasAccess, setHasAccess] = useState(false);

  // Kiểm tra quyền truy cập chat
  useEffect(() => {
    if (user?.role?.role_name) {
      const allowedRoles = ["HAMLET LEADER", "ACCOUNTANT", "HOUSE MEMBER"];
      const userHasAccess = allowedRoles.includes(user.role.role_name);
      setHasAccess(userHasAccess);
      console.log("🔍 Chat access check:", {
        userRole: user.role.role_name,
        hasAccess: userHasAccess,
        allowedRoles
      });
    }
  }, [user]);

  const handleToggle = () => {
    if (!hasAccess) {
      alert("Bạn không có quyền truy cập chat này");
      return;
    }
    
    setOpen(!open);
    if (!open) {
      // Reset unread count khi mở chat
      setUnreadCount(0);
    }
  };

  // Không hiển thị button nếu user không có quyền
  if (!hasAccess) {
    return null;
  }

  return (
    <>
      <Tooltip title="Tin nhắn">
        <IconButton
          onClick={handleToggle}
          sx={{
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <MessageIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <ChatWindow 
        open={open} 
        onClose={() => setOpen(false)}
        onNewMessage={() => {
          if (!open) {
            setUnreadCount(prev => prev + 1);
          }
        }}
      />
    </>
  );
}