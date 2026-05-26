import { Box, Typography } from "@mui/material";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

export default function LogoutButton({ isExpanded = true }) {
  const navigate = useNavigate();
  const { signOut } = useAuthStore();

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      signOut();
      navigate("/signin");
    }
  };

  return (
    <Box
      onClick={handleLogout}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: isExpanded ? "flex-start" : "center",
        gap: "10px",
        padding: "12px",
        cursor: "pointer",
        transition: "0.2s",
        backgroundColor: "rgba(15, 23, 42, 0.34)",
        border: "1px solid rgba(148, 163, 184, 0.24)",
        borderRadius: "10px",
        mt: "auto",
        mb: 2,
        "&:hover": {
          color: "white",
          backgroundColor: "#b91c1c",
        },
      }}
      title={!isExpanded ? "Đăng xuất" : ""}
    >
      <LogOut size={18} />
      {isExpanded && <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>Đăng xuất</Typography>}
    </Box>
  );
}
