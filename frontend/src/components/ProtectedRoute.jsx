import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import { Box, CircularProgress, Typography } from "@mui/material";

function ProtectedRoute({ allowedRoles = [], redirectTo = null }) {
  const { token, user, checkAuth } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      if (!token) {
        setIsChecking(false);
        setIsAuthenticated(false);
        return;
      }

      const isValid = await checkAuth();
      setIsAuthenticated(isValid);
      setIsChecking(false);
    };

    verifyAuth();
  }, [token, checkAuth]);

  if (isChecking) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  // Kiểm tra role
  const userRole = user?.role?.role_name;
  
  console.log('🔒 ProtectedRoute Check:', {
    userRole,
    allowedRoles,
    isAllowed: allowedRoles.length === 0 || allowedRoles.includes(userRole),
    user: user
  });
  
  // Nếu không có allowedRoles hoặc role của user nằm trong danh sách cho phép
  if (allowedRoles.length === 0 || allowedRoles.includes(userRole)) {
    return <Outlet />;
  }

  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  // Nếu role không được phép, return null thay vì hiển thị lỗi
  // Điều này cho phép React Router tiếp tục tìm route khác
  return null;
}

export default ProtectedRoute;
