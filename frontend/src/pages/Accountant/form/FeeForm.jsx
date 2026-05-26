import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function FeeForm({ open, handleClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "MANDATORY",
    unitPrice: "",
    description: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: "",
        type: "MANDATORY",
        unitPrice: "",
        description: "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {formData._id ? "Cập nhật khoản thu" : "Tạo khoản thu mới"}
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Tên khoản thu"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            select
            label="Loại khoản thu"
            name="type"
            value={formData.type}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="MANDATORY">Bắt buộc</MenuItem>
            <MenuItem value="VOLUNTARY">Tự nguyện</MenuItem>
          </TextField>

          <TextField
            label="Đơn giá (VND)"
            name="unitPrice"
            type="number"
            value={formData.unitPrice}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Mô tả"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Hủy</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {formData._id ? "Cập nhật" : "Tạo mới"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default FeeForm;
