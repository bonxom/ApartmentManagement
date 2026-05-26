import { Box, Typography, IconButton } from "@mui/material";
import {
  Home,
  Users,
  FileText,
  PlusCircle,
  History,
  CheckCircle,
  Repeat,
  ChevronDown,
  Menu,
  X,
  Wallet,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../feature/admin/LogoutButton";
import useAuthStore from "../store/authStore";

export const drawerWidthExpanded = 304;
export const drawerWidthCollapsed = 80;
export const drawerWidth = drawerWidthExpanded; // For backward compatibility

export function Sidebar({ user, onWidthChange }) {
  const { user: authUser } = useAuthStore();
  const userRole = authUser?.role?.role_name;
  const rolePrefix =
    userRole === "HAMLET LEADER"
      ? "/leader"
      : userRole === "ACCOUNTANT"
      ? "/accountant"
      : "";

  const appTitle = authUser?.name || user?.ten || "Tổ trưởng";
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [hideTimeout, setHideTimeout] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const currentDrawerWidth = isExpanded
    ? drawerWidthExpanded
    : drawerWidthCollapsed;

  // Notify parent of width changes
  React.useEffect(() => {
    if (onWidthChange) {
      onWidthChange(currentDrawerWidth);
    }
  }, [currentDrawerWidth, onWidthChange]);

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setExpandedMenu(null);
    }, 150);
    setHideTimeout(timeout);
  };

  const handleMouseEnter = () => {
    if (hideTimeout) clearTimeout(hideTimeout);
    setExpandedMenu("approval");
  };

  return (
    <Box
      sx={{
        width: `${currentDrawerWidth}px`,
        height: "100vh",
        background:
          "linear-gradient(180deg, #0f172a 0%, #102a43 55%, #134e4a 100%)",
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
            Trung tâm vận hành chung cư
          </Typography>
        </Box>
      )}

      {/* MENU */}
      {isExpanded && <SectionTitle text="Menu" />}
      <MenuItem
        icon={<Home size={18} />}
        label="Dashboard"
        to={`${rolePrefix}/dashboard`}
        isExpanded={isExpanded}
      />
      <MenuItem
        icon={<Users size={18} />}
        label="Quản lý hộ khẩu"
        to={`${rolePrefix}/qldc`}
        isExpanded={isExpanded}
      />
      <MenuItem
        icon={<Users size={18} />}
        label="Quản lý tạm trú/vắng"
        to={`${rolePrefix}/qlnkskKhaiBaoTamtruvang`}
        isExpanded={isExpanded}
      />

      {/* ACTION */}
      {isExpanded && <SectionTitle text="Action" />}
      <MenuItem
        icon={<Wallet size={18} />}
        label="Thu phí"
        to={`${rolePrefix}/fee`}
        isExpanded={isExpanded}
      />
      {isExpanded ? (
        <MenuItemWithSubmenu
          icon={<FileText size={18} />}
          label="Danh sách cần phê duyệt"
          isExpanded={expandedMenu === "approval"}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          submenu={[
            {
              label: "Danh sách đăng kí tài khoản",
              path: `${rolePrefix}/dktk`,
            },
            { label: "Danh sách khai báo sinh tử", path: `${rolePrefix}/kbst` },
            { label: "Danh sách thu tiền", path: `${rolePrefix}/thutien` },
            {
              label: "Danh sách tạm trú tạm vắng",
              path: `${rolePrefix}/tamtruvang`,
            },
          ]}
          onSubmenuClick={(path) => {
            navigate(path);
            setExpandedMenu(null);
          }}
        />
      ) : (
        <MenuItem
          icon={<FileText size={18} />}
          label="Phê duyệt"
          to={`${rolePrefix}/dktk`}
          isExpanded={isExpanded}
        />
      )}
      <MenuItem
        icon={<PlusCircle size={18} />}
        label="Thêm thông tin cư dân"
        to={`${rolePrefix}/themcudan`}
        isExpanded={isExpanded}
      />

      {/* HISTORY */}
      {isExpanded && <SectionTitle text="History" />}
      <MenuItem
        icon={<History size={18} />}
        label="Lịch sử giao dịch"
        to={`${rolePrefix}/lichsugiaodich`}
        isExpanded={isExpanded}
      />
      <MenuItem
        icon={<CheckCircle size={18} />}
        label="Lịch sử phê duyệt"
        to={`${rolePrefix}/lichsupheduyet`}
        isExpanded={isExpanded}
      />
      <MenuItem
        icon={<Repeat size={18} />}
        label="Lịch sử thay đổi"
        to={`${rolePrefix}/lichsuthaydoi`}
        isExpanded={isExpanded}
      />

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

function MenuItemWithSubmenu({
  icon,
  label,
  isExpanded,
  onMouseEnter,
  onMouseLeave,
  submenu,
  onSubmenuClick,
}) {
  return (
    <Box
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      sx={{
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
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
      >
        {icon}
        <Typography sx={{ fontSize: "14px", flex: 1 }}>{label}</Typography>
        <ChevronDown
          size={16}
          style={{
            transition: "transform 0.2s",
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </Box>

      {/* Dropdown Menu */}
      {isExpanded && (
        <Box
          sx={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            backgroundColor: "#0f172a",
            border: "1px solid rgba(103, 232, 249, 0.28)",
            borderRadius: "10px",
            zIndex: 1001,
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
            minWidth: "100%",
          }}
        >
          {submenu.map((item, idx) => (
            <Box
              key={idx}
              onClick={() => onSubmenuClick(item.path)}
              sx={{
                padding: "10px 12px",
                fontSize: "13px",
                color: "#dce6f5",
                cursor: "pointer",
                transition: "0.2s",
                borderBottom:
                  idx < submenu.length - 1 ? "1px solid rgba(148, 163, 184, 0.24)" : "none",
                "&:hover": {
                  color: "white",
                  backgroundColor: "rgba(15, 118, 110, 0.32)",
                  paddingLeft: "16px",
                },
              }}
            >
              {item.label}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default Sidebar;
