import { Box, IconButton, Typography } from "@mui/material";
import { Bell, User, Settings, ArrowLeft, Building2 } from "lucide-react";
import useAuthStore from "../store/authStore";
import { useRoleNavigation } from "../hooks/useRoleNavigation";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NotificationPanel from "./In4ButtonTop3/NotificationPanel"; // Đảm bảo đúng đường dẫn file
import useNotificationStore from "../store/notificationStore";

export default function Topbar() {
  const { navigateWithRole } = useRoleNavigation();
  const { checkAuth } = useAuthStore();
  const { enabled: notificationsEnabled } = useNotificationStore();
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleProfileClick = async () => {
    // Refresh user data before navigating to profile
    try {
      await checkAuth();
    } catch (error) {
      console.error("Failed to refresh profile", error);
    }
    navigateWithRole("/profile");
  };

  // Navigate sang Setting
  const handleSettingClick = async () => {
    try {
      await checkAuth();
    } catch (error) {
      console.error("Failed to refresh settings data", error);
    }
    navigateWithRole("/setting");
  };

  // Logic mở thông báo
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenNoti = (event) => {
    if (!notificationsEnabled) return; // đã tắt thông báo -> không mở panel
    setAnchorEl(event.currentTarget);
  };

  const handleCloseNoti = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "74px",
        background: "rgba(255, 255, 255, 0.84)",
        borderBottom: "1px solid #dbe4f1",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: { xs: 2, md: 4 },
        boxShadow: "0 6px 18px rgba(15, 23, 42, 0.06)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
      className="vim-glass-topbar"
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <IconButton
          onClick={handleBackClick}
          sx={{
            color: "#1f2937",
            backgroundColor: "#f1f5f9",
            border: "1px solid #dbe4f1",
            borderRadius: "10px",
            padding: "9px",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "#e0f2fe",
              color: "#0369a1",
              transform: "translateX(-2px)",
            },
          }}
        >
          <ArrowLeft size={20} />
        </IconButton>

        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
          <Building2 size={18} color="#0f766e" />
          <Typography sx={{ fontWeight: 800, fontSize: "14px", letterSpacing: "0.02em", color: "#0f172a" }}>
            VIM SMART CITY
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

        {/* Nút Chuông */}
                <IconButton
          onClick={handleOpenNoti}
          sx={{
            color: !notificationsEnabled
              ? "#9ca3af"
              : anchorEl
              ? "#2563eb"
              : "#1f2937",
            backgroundColor: !notificationsEnabled
              ? "rgba(229, 231, 235, 0.7)"
              : anchorEl
              ? "#e0f2fe"
              : "#f8fafc",
            border: "1px solid #dbe4f1",
            borderRadius: "10px",
            padding: "9px",
            transition: "all 0.3s ease",
            cursor: !notificationsEnabled ? "not-allowed" : "pointer",
            "&:hover": notificationsEnabled
              ? {
                  backgroundColor: "#e0f2fe",
                  color: "#0369a1",
                  transform: "translateY(-2px)",
                }
              : {},
          }}
        >
          <Bell size={20} />
        </IconButton>

        {/* Khung thông báo tách riêng */}
        <NotificationPanel
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseNoti}
        />

        <IconButton
          onClick={handleSettingClick}
          sx={{
            color: "#1f2937",
            backgroundColor: "#f8fafc",
            border: "1px solid #dbe4f1",
            borderRadius: "10px",
            padding: "9px",
            "&:hover": {
              backgroundColor: "#e0f2fe",
              color: "#0369a1",
            },
          }}
        >
          <Settings size={20} />
        </IconButton>

        <IconButton
          onClick={handleProfileClick}
          sx={{
            color: "#1f2937",
            backgroundColor: "#f8fafc",
            border: "1px solid #dbe4f1",
            borderRadius: "10px",
            padding: "9px",
            "&:hover": {
              backgroundColor: "#e0f2fe",
              color: "#0369a1",
            },
          }}
        >
          <User size={20} />
        </IconButton>
      </Box>
    </Box>
  );
}
