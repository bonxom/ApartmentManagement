import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";

// --- STYLES TÁI SỬ DỤNG ---
const labelStyles = {
  fontSize: "13px",
  fontWeight: 500,
  mb: 0.5,
  color: "#666",
};

const inputGroupStyles = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#F5F7FA",
    borderRadius: "8px",
    "& fieldset": { borderColor: "transparent" },
    "&:hover fieldset": { borderColor: "#E0E0E0" },
    "&.Mui-focused fieldset": { borderColor: "#2D66F5" },
  },
  "& .MuiInputBase-input": {
    padding: "10px 14px",
    fontSize: "14px",
  },
};

export default function FormKhaiBaoTamTruVang({ open, onClose, onSubmit }) {
  const initialFormState = {
    name: "",
    gender: "",
    dateOfBirth: "",
    houseHoldID: "",
    chuHo: "",
    address: "",
    type: "Tạm trú",
    role: "Dân cư",
    reason: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (open) setFormData(initialFormState);
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    const requiredFields = [
      "name",
      "gender",
      "dateOfBirth",
      "houseHoldID",
      "chuHo",
      "reason",
    ];
    return requiredFields.every((field) => formData[field]?.trim() !== "");
  };

  const handleSubmit = () => {
    if (!isFormValid()) return;
    if (onSubmit) onSubmit(formData);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: "16px", boxShadow: "0px 4px 20px rgba(0,0,0,0.1)" },
      }}
    >
      <DialogTitle sx={{ fontSize: "20px", fontWeight: 600, pb: 1 }}>
        Khai báo tạm trú tạm vắng
      </DialogTitle>

      <DialogContent sx={{ padding: "16px 32px" }}>
        <Grid container spacing={2.5}>
          {/* HÀNG 1: LOẠI & VAI TRÒ */}
          <Grid item xs={12} sm={6}>
            <Typography sx={labelStyles}>
              Phân loại <span style={{ color: "red" }}>*</span>
            </Typography>
            <FormControl fullWidth sx={inputGroupStyles}>
              <Select name="type" value={formData.type} onChange={handleChange}>
                <MenuItem value="Tạm trú">Tạm trú</MenuItem>
                <MenuItem value="Tạm vắng">Tạm vắng</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography sx={labelStyles}>
              Vai trò <span style={{ color: "red" }}>*</span>
            </Typography>
            <FormControl fullWidth sx={inputGroupStyles}>
              <Select name="role" value={formData.role} onChange={handleChange}>
                <MenuItem value="Dân cư">Dân cư</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* HÀNG 2: HỌ TÊN & GIỚI TÍNH */}
          <Grid item xs={12} sm={6}>
            <Typography sx={labelStyles}>
              Họ và tên <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              fullWidth
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập họ và tên"
              sx={inputGroupStyles}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography sx={labelStyles}>
              Giới tính <span style={{ color: "red" }}>*</span>
            </Typography>
            <FormControl fullWidth sx={inputGroupStyles}>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <MenuItem value="Nam">Nam</MenuItem>
                <MenuItem value="Nữ">Nữ</MenuItem>
                <MenuItem value="Khác">Khác</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* HÀNG 3: NGÀY SINH & MÃ HỘ */}
          <Grid item xs={12} sm={6}>
            <Typography sx={labelStyles}>
              Ngày sinh <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              fullWidth
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={inputGroupStyles}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography sx={labelStyles}>
              Mã hộ gia đình <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              fullWidth
              name="houseHoldID"
              value={formData.houseHoldID}
              onChange={handleChange}
              placeholder="Nhập mã hộ"
              sx={inputGroupStyles}
            />
          </Grid>

          {/* HÀNG 4: CHỦ HỘ */}
          <Grid item xs={12}>
            <Typography sx={labelStyles}>
              Tên chủ hộ <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              fullWidth
              name="chuHo"
              value={formData.chuHo}
              onChange={handleChange}
              placeholder="Nhập tên chủ hộ"
              sx={inputGroupStyles}
            />
          </Grid>

          {/* HÀNG 5: ĐỊA CHỈ & LÝ DO (ĐÃ THU NHỎ) */}
          <Grid item xs={12} sm={6}>
            <Typography sx={labelStyles}>Địa chỉ thường trú</Typography>
            <TextField
              fullWidth
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Số nhà, tên đường..."
              multiline
              rows={1.5}
              sx={inputGroupStyles}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography sx={labelStyles}>
              Lý do {formData.type.toLowerCase()}{" "}
              <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              fullWidth
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Lý do cụ thể..."
              multiline
              rows={1.5}
              sx={inputGroupStyles}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{ justifyContent: "space-between", padding: "16px 32px 24px" }}
      >
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{ textTransform: "none", borderRadius: "8px", px: 3 }}
        >
          Hủy
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleSubmit}
          disabled={!isFormValid()}
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            px: 4,
            boxShadow: "none",
          }}
        >
          Khai báo
        </Button>
      </DialogActions>
    </Dialog>
  );
}
