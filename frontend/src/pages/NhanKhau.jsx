import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { userAPI } from "../api/apiService";
import { Sidebar, drawerWidth } from "../components/Sidebar";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert
} from "@mui/material";

function NhanKhau() {
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [backendError, setBackendError] = useState("");

  // Dialog state
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    userCardID: "",
    email: "",
    phoneNumber: "",
    location: "",
    dob: "",
    password: "",
    role: ""
  });

  const roles = [
    { _id: "1", role_name: "Chủ hộ" },
    { _id: "2", role_name: "Kế toán" },
    { _id: "3", role_name: "Thành viên" }
  ];

  const handleLogout = () => {
    signOut();
    navigate("/signin");
  };

  // Lấy danh sách nhân khẩu
  const fetchUsers = async () => {
    try {
      const data = await userAPI.getAll();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({
      name: "",
      userCardID: "",
      email: "",
      phoneNumber: "",
      location: "",
      dob: "",
      password: "",
      role: ""
    });
    setBackendError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "userCardID" || name === "phoneNumber") {
      if (value && !/^\d*$/.test(value)) return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
    if (backendError) setBackendError("");
  };

  const handleSubmit = async () => {
  try {
    setBackendError("");
    setIsLoading(true);

    await userAPI.create(formData);

    // Lấy danh sách mới nhất từ backend
    await fetchUsers();

    handleClose();
    alert("Tạo nhân khẩu thành công!");
  } catch (err) {
    setBackendError(err.message || "Có lỗi xảy ra");
  } finally {
    setIsLoading(false);
  }
};


  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa nhân khẩu này?")) return;

    try {
      setIsLoading(true);
      await userAPI.delete(id);
      setUsers(prev => prev.filter(u => u._id !== id)); // Xóa trực tiếp khỏi state
      alert("Xóa nhân khẩu thành công!");
    } catch (err) {
      setBackendError(err.message || "Có lỗi xảy ra khi xóa");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar user={user} navigate={navigate} onLogout={handleLogout} />
      <Box sx={{ flexGrow: 1, p: 4, ml: `${drawerWidth}px` }}>
        <Typography variant="h4" gutterBottom>
          Quản lý nhân khẩu
        </Typography>

        <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 2 }}>
          Tạo nhân khẩu
        </Button>

        {/* Dialog tạo nhân khẩu */}
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>Nhập thông tin nhân khẩu</DialogTitle>
          <DialogContent>
            {backendError && <Alert severity="error" sx={{ mb: 2 }}>{backendError}</Alert>}

            <TextField
              fullWidth
              label="Họ và tên"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Căn cước công dân"
              name="userCardID"
              value={formData.userCardID}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Số điện thoại"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Địa chỉ"
              name="location"
              value={formData.location}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={2}
            />
            <TextField
              fullWidth
              label="Ngày sinh"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Mật khẩu"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Vai trò"
              name="role"
              select
              value={formData.role}
              onChange={handleChange}
              margin="normal"
            >
              {roles.map(r => (
                <MenuItem key={r._id} value={r._id}>{r.role_name}</MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Hủy</Button>
            <Button onClick={handleSubmit} variant="contained" disabled={isLoading}>
              {isLoading ? "Đang lưu..." : "Lưu"}
            </Button>
          </DialogActions>
        </Dialog>

        {loading ? (
          <Typography>Đang tải...</Typography>
        ) : (
          <Paper sx={{ mt: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#F8FAFC" }}>
                <TableRow>
                  <TableCell>CCCD</TableCell>
                  <TableCell>Họ tên</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Số điện thoại</TableCell>
                  <TableCell>Vai trò</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map(u => (
                  <TableRow key={u._id}>
                    <TableCell>{u.userCardID}</TableCell>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.phoneNumber || "-"}</TableCell>
                    <TableCell>{u.role?.role_name || "-"}</TableCell>
                    <TableCell>
                      <Button color="error" onClick={() => handleDelete(u._id)}>
                        Xóa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Box>
    </Box>
  );
}

export default NhanKhau;
