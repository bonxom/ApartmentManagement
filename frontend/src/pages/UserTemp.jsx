import { Box, Typography, TextField, MenuItem, Button, Paper, Tabs, Tab } from "@mui/material";
import { useState } from "react";

export default function YeuCauTamTruVang() {
  const [tabIndex, setTabIndex] = useState(0); // 0: Tạm trú, 1: Tạm vắng

    // Người tạm vắng cần cung cấp đủ các thông tin cần thiết
  const [tamTruData, setTamTruData] = useState({
    name: "",
    personalId: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    houseHoldID: "",
    chuHo: "",
  });

 /* Mọi thông tin về người tạm vắng đã có trong csdl
    Chỉ yêu thông tin về tên, căn cước và lý do tạm trú */
  const [tamVangData, setTamVangData] = useState({
    name: "",
    personalId: "",
    reason: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmitTamTru = (e) => {
    e.preventDefault();
    console.log("Yêu cầu Tạm trú:", tamTruData);
    setSuccessMessage("Yêu cầu Tạm trú đã được gửi thành công!");
    setTamTruData({
      name: "",
      personalId: "",
      dateOfBirth: "",
      gender: "",
      address: "",
      houseHoldID: "",
      chuHo: "",
    });
  };

  const handleSubmitTamVang = (e) => {
    e.preventDefault();
    console.log("Yêu cầu Tạm vắng:", tamVangData);
    setSuccessMessage("Yêu cầu Tạm vắng đã được gửi thành công!");
    setTamVangData({
      name: "",
      personalId: "",
      dateOfBirth: "",
      gender: "",
      oldAddress: "",
      newAddress: "",
      reason: "",
    });
  };

  return (
    <Box display="flex" justifyContent="center" mt={6} mb={6}>
      <Paper elevation={6} sx={{ p: 5, borderRadius: "16px", maxWidth: 600, width: "100%" }}>
          {/* Tabs */}
          <Tabs
            value={tabIndex}
            onChange={(e, newValue) => {
              setTabIndex(newValue);
              setSuccessMessage(""); // clear success khi đổi tab
            }}
            variant="fullWidth"
            sx={{ mb: 4 }}
          >
            <Tab label="Tạm trú" />
            <Tab label="Tạm vắng" />
          </Tabs>

          {/* Form Tạm trú */}
          {tabIndex === 0 && (
            <form onSubmit={handleSubmitTamTru}>
              <Box display="flex" flexDirection="column" gap={3}>
                <TextField
                  label="Họ và tên người tạm trú"
                  value={tamTruData.name}
                  onChange={(e) => setTamTruData({ ...tamTruData, name: e.target.value })}
                  required
                  fullWidth
                />
                <TextField
                  label="Mã số CMND/CCCD"
                  value={tamTruData.personalId}
                  onChange={(e) => setTamTruData({ ...tamTruData, personalId: e.target.value })}
                  required
                  fullWidth
                />
                <TextField
                  label="Ngày sinh"
                  type="date"
                  value={tamTruData.dateOfBirth}
                  onChange={(e) => setTamTruData({ ...tamTruData, dateOfBirth: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                />
                <TextField
                  label="Giới tính"
                  select
                  value={tamTruData.gender}
                  onChange={(e) => setTamTruData({ ...tamTruData, gender: e.target.value })}
                  required
                  fullWidth
                >
                  <MenuItem value="Nam">Nam</MenuItem>
                  <MenuItem value="Nữ">Nữ</MenuItem>
                </TextField>
                <TextField
                  label="Địa chỉ tạm trú"
                  value={tamTruData.address}
                  onChange={(e) => setTamTruData({ ...tamTruData, address: e.target.value })}
                  required
                  fullWidth
                />
                <TextField
                  label="Mã hộ gia đình muốn tạm trú"
                  value={tamTruData.houseHoldID}
                  onChange={(e) => setTamTruData({ ...tamTruData, houseHoldID: e.target.value })}
                  required
                  fullWidth
                />
                <TextField
                  label="Tên chủ hộ"
                  value={tamTruData.chuHo}
                  onChange={(e) => setTamTruData({ ...tamTruData, chuHo: e.target.value })}
                  required
                  fullWidth
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ py: 1.5, borderRadius: "8px", fontWeight: 600 }}
                >
                  Gửi yêu cầu Tạm trú
                </Button>
              </Box>
            </form>
          )}

          {/* Form Tạm vắng */}
          {tabIndex === 1 && (
            <form onSubmit={handleSubmitTamVang}>
              <Box display="flex" flexDirection="column" gap={3}>
                <TextField
                  label="Họ và tên người tạm vắng"
                  value={tamVangData.name}
                  onChange={(e) => setTamVangData({ ...tamVangData, name: e.target.value })}
                  required
                  fullWidth
                />
                <TextField
                  label="Mã số CMND/CCCD"
                  value={tamVangData.personalId}
                  onChange={(e) => setTamVangData({ ...tamVangData, personalId: e.target.value })}
                  required
                  fullWidth
                />
                <TextField
                  label="Lý do tạm vắng"
                  value={tamVangData.reason}
                  onChange={(e) => setTamVangData({ ...tamVangData, reason: e.target.value })}
                  required
                  fullWidth
                  multiline
                  rows={2}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ py: 1.5, borderRadius: "8px", fontWeight: 600 }}
                >
                  Gửi yêu cầu Tạm vắng
                </Button>
              </Box>
            </form>
          )}

          {/* Success message */}
          {successMessage && (
            <Typography sx={{ mt: 3, textAlign: "center" }} color="success.main">
              {successMessage}
            </Typography>
          )}
        </Paper>
      </Box>
  );
}
