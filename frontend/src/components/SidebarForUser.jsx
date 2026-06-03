import { Box, Typography, IconButton } from "@mui/material";
import {
  Home,
  Users,
  User,
  FileText,
  PlusCircle,
  History,
  CheckCircle,
  Repeat,
  Wallet,
  Menu,
  X,
  ClipboardList,
  MapPin,
  MessageSquare,
  Car,
  Wrench,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../feature/admin/LogoutButton";
import useAuthStore from "../store/authStore";

export const drawerWidthExpanded = 304;
export const drawerWidthCollapsed = 80;
export const drawerWidth = drawerWidthExpanded; // For backward compatibility

export function SidebarForUser({ user, onWidthChange }) {
  const { user: authUser } = useAuthStore();
  const resolvedUser = user || authUser;
  const displayName = resolvedUser?.name || resolvedUser?.ten;
  const appTitle = displayName || "Cư dân";
  const userRole = resolvedUser?.role?.role_name;
  const isHouseMember = userRole === "HOUSE MEMBER";
  const [isExpanded, setIsExpanded] = useState(false);

  const currentDrawerWidth = isExpanded
    ? drawerWidthExpanded
    : drawerWidthCollapsed;

  // Notify parent of width changes
  React.useEffect(() => {
    if (onWidthChange) {
      onWidthChange(currentDrawerWidth);
    }
  }, [currentDrawerWidth, onWidthChange]);

  return (
    <Box
      sx={{
        width: `${currentDrawerWidth}px`,
        height: "100vh",
        background:
          "linear-gradient(180deg, #0f172a 0%, #0f2840 55%, #115e59 100%)",
        padding: isExpanded ? "24px 20px" : "24px 12px",
        color: "#dce6f5",
        borderRight: "1px solid rgba(148, 163, 184, 0.22)",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        position: "fixed",
        left: 0,
        top: 0,
        overflowY: "auto",
        overflowX: "hidden",
        zIndex: 1000,
        transition: "width 0.3s ease, padding 0.3s ease",
      }}
    >
      {/* Toggle Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: isExpanded ? "flex-end" : "center",
          mb: 2,
        }}
      >
        <IconButton
          onClick={() => setIsExpanded(!isExpanded)}
          sx={{
            color: "#e2e8f0",
            "&:hover": { backgroundColor: "rgba(148, 163, 184, 0.22)" },
          }}
        >
          {isExpanded ? <X size={20} /> : <Menu size={20} />}
        </IconButton>
      </Box>

      {/* Title */}
      {isExpanded && (
        <Box sx={{ px: 1, mb: 2.5 }}>
          <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#67e8f9", mb: 0.5 }}>
            VIM SMART CITY
          </Typography>
          <Typography sx={{ fontSize: "18px", fontWeight: 800, color: "white", lineHeight: 1.3 }}>
            {appTitle}
          </Typography>
          <Typography sx={{ fontSize: "12px", color: "#bfdbfe", mt: 0.6 }}>
            Cổng cư dân thông minh
          </Typography>
        </Box>
      )}

      {/* MENU */}
      {isExpanded && <SectionTitle text="Menu" />}
      <MenuItem
        icon={<Home size={18} />}
        label="Dashboard"
        to="/member/dashboard"
        isExpanded={isExpanded}
      />
      {isHouseMember && (
        <>
          <MenuItem
            icon={<Users size={18} />}
            label="Thông tin thành viên"
            to="/member/ThongTinHoDan"
            isExpanded={isExpanded}
          />
          <MenuItem
            icon={<Wallet size={18} />}
            label="Các khoản nộp"
            to="/member/feeuser"
            isExpanded={isExpanded}
          />
          <MenuItem
            icon={<ClipboardList size={18} />}
            label="Khai báo sinh tử"
            to="/member/requestsinhtu"
            isExpanded={isExpanded}
          />
          <MenuItem
            icon={<MapPin size={18} />}
            label="Khai báo tạm trú tạm vắng"
            to="/member/requesttamtruvang"
            isExpanded={isExpanded}
          />
          <MenuItem
            icon={<MessageSquare size={18} />}
            label="Gửi phản ánh dịch vụ"
            to="/member/feedback"
            isExpanded={isExpanded}
          />
          <MenuItem
            icon={<Car size={18} />}
            label="Đăng ký gửi xe"
            to="/member/vehicle"
            isExpanded={isExpanded}
          />
          <MenuItem
            icon={<Wrench size={18} />}
            label="Lịch bảo trì tòa nhà"
            to="/member/maintenance"
            isExpanded={isExpanded}
          />
          {/* <MenuItem
            icon={<PlusCircle size={18} />}
            label="Yêu cầu tạm trú/vắng nhanh"
            to="/member/yeucau/tamtruvang"
            isExpanded={isExpanded}
          /> */}
        </>
      )}

      {/* HISTORY */}
      {isHouseMember && isExpanded && <SectionTitle text="History" />}
      {isHouseMember && (
        <>
          <MenuItem
            icon={<History size={18} />}
            label="Lịch sử giao dịch"
            to="/member/lichsugiaodich"
            isExpanded={isExpanded}
          />
          <MenuItem
            icon={<CheckCircle size={18} />}
            label="Lịch sử phê duyệt"
            to="/member/lichsupheduyet"
            isExpanded={isExpanded}
          />
          <MenuItem
            icon={<Repeat size={18} />}
            label="Lịch sử thay đổi"
            to="/member/lichsuthaydoi"
            isExpanded={isExpanded}
          />
        </>
      )}

      {/* Logout Button */}
      <LogoutButton isExpanded={isExpanded} />
    </Box>
  );
}

function SectionTitle({ text }) {
  return (
    <Typography
      sx={{
        fontSize: "12px",
        fontWeight: 700,
        color: "#93c5fd",
        mt: 1,
        mb: "-2px",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
      }}
    >
      {text}
    </Typography>
  );
}

function MenuItem({ icon, label, to, isExpanded }) {
  const navigate = useNavigate();

  return (
    <Box
      onClick={() => to && navigate(to)}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: isExpanded ? "flex-start" : "center",
        gap: "10px",
        padding: "10px",
        cursor: "pointer",
        transition: "0.2s",
        borderRadius: "10px",
        border: "1px solid transparent",
        "&:hover": {
          color: "white",
          borderColor: "rgba(103, 232, 249, 0.28)",
          backgroundColor: "rgba(15, 118, 110, 0.32)",
        },
      }}
      title={!isExpanded ? label : ""}
    >
      {icon}
      {isExpanded && <Typography sx={{ fontSize: "14px" }}>{label}</Typography>}
    </Box>
  );
}

export default SidebarForUser;
