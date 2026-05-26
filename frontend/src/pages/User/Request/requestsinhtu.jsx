import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";
import { requestAPI, householdAPI } from "../../../api/apiService";
import useAuthStore from "../../../store/authStore";

const birthFields = [
  { name: "name", label: "Họ và tên bé", required: true },
  { name: "sex", label: "Giới tính", required: true, select: true, options: ["Nam", "Nữ", "Khác"] },
  { name: "dob", label: "Ngày sinh", required: true, type: "date" },
  { name: "birthLocation", label: "Nơi sinh", required: true },
  { name: "ethnic", label: "Dân tộc", required: true },
  { name: "birthCertificateNumber", label: "Số giấy khai sinh", required: true },
];

const deathFields = [
  { name: "userId", label: "Thành viên", required: true, select: true, options: [] },
  { name: "dateOfDeath", label: "Ngày mất", required: true, type: "date" },
  { name: "reason", label: "Nguyên nhân", required: true, multiline: true },
  { name: "deathCertificateUrl", label: "Link giấy khai tử", required: true },
];

const initialBirth = birthFields.reduce((acc, f) => ({ ...acc, [f.name]: "" }), {});
const initialDeath = deathFields.reduce((acc, f) => ({ ...acc, [f.name]: "" }), {});

export default function RequestSinhTu() {
  const { user } = useAuthStore();
  const [mode, setMode] = useState("BIRTH");
  const [birthData, setBirthData] = useState(initialBirth);
  const [deathData, setDeathData] = useState(initialDeath);
  const [members, setMembers] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!user?.household) return;
      try {
        const res = await householdAPI.getMembers(user.household);
        setMembers(res || []);
      } catch (err) {
        console.error("Fetch members failed", err);
      }
    };
    fetchMembers();
  }, [user?.household]);

  const deathFieldsWithOptions = useMemo(() => {
    return deathFields.map((f) =>
      f.name === "userId"
        ? { ...f, options: members.map((m) => ({ value: m._id, label: `${m.name} (${m.userCardID || ""})` })) }
        : f
    );
  }, [members]);

  const handleChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(null);
  };

  const validate = (fields, data) =>
    fields.every((f) => !f.required || (data[f.name] && data[f.name].toString().trim() !== ""));

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      if (!user?.household) throw new Error("Bạn chưa thuộc hộ khẩu nào.");
      if (mode === "BIRTH") {
        if (!validate(birthFields, birthData)) throw new Error("Vui lòng nhập đầy đủ thông tin khai sinh.");
        await requestAPI.createBirthReport(birthData);
        setBirthData(initialBirth);
        setSuccess("Đã gửi yêu cầu khai sinh.");
      } else {
        if (!validate(deathFields, deathData)) throw new Error("Vui lòng nhập đầy đủ thông tin khai tử.");
        await requestAPI.createDeathReport(deathData);
        setDeathData(initialDeath);
        setSuccess("Đã gửi yêu cầu khai tử.");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.customMessage ||
        err?.message ||
        "Gửi yêu cầu thất bại.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field, data, setter) => {
    if (field.select) {
      return (
        <Box>
          <Typography 
            sx={{ 
              fontSize: "13px", 
              fontWeight: "500", 
              mb: 1, 
              color: "#666" 
            }}
          >
            {field.label}
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              name={field.name}
              value={data[field.name]}
              onChange={handleChange(setter)}
              displayEmpty
              sx={{
                backgroundColor: "#F5F7FA",
                borderRadius: "8px",
                fontSize: "15px",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "1px solid #2D66F5",
                },
              }}
            >
              {field.options.map((opt) =>
                typeof opt === "string" ? (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ) : (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
        </Box>
      );
    }

    const dateProps =
      field.type === "date"
        ? {
            InputLabelProps: { shrink: true },
          }
        : {};

    return (
      <Box>
        <Typography 
          sx={{ 
            fontSize: "13px", 
            fontWeight: "500", 
            mb: 1, 
            color: "#666" 
          }}
        >
          {field.label}
        </Typography>
        <TextField
          fullWidth
          size="small"
          name={field.name}
          type={field.type || "text"}
          value={data[field.name]}
          onChange={handleChange(setter)}
          multiline={field.multiline}
          minRows={field.multiline ? 2 : undefined}
          placeholder={field.label}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#F5F7FA",
              borderRadius: "8px",
              fontSize: "15px",
              "& fieldset": {
                border: "none",
              },
              "&:hover fieldset": {
                border: "none",
              },
              "&.Mui-focused fieldset": {
                border: "1px solid #2D66F5",
              },
            },
          }}
          {...dateProps}
        />
      </Box>
    );
  };

  const isBirth = mode === "BIRTH";
  const currentFields = isBirth ? birthFields : deathFieldsWithOptions;
  const currentData = isBirth ? birthData : deathData;
  const currentSetter = isBirth ? setBirthData : setDeathData;

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography sx={{ fontSize: 26, fontWeight: 600 }}>
          Khai báo sinh tử
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button 
            variant={isBirth ? "contained" : "outlined"} 
            onClick={() => setMode("BIRTH")}
            sx={isBirth ? {
              backgroundColor: "#2D66F5",
              borderRadius: "8px",
              textTransform: "none",
              px: 3,
              py: 1,
              fontSize: "14px",
              fontWeight: "500",
              "&:hover": { backgroundColor: "#1E54D4" },
            } : {
              borderRadius: "8px",
              textTransform: "none",
              px: 3,
              py: 1,
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Khai sinh
          </Button>
          <Button 
            variant={!isBirth ? "contained" : "outlined"} 
            onClick={() => setMode("DEATH")}
            sx={!isBirth ? {
              backgroundColor: "#2D66F5",
              borderRadius: "8px",
              textTransform: "none",
              px: 3,
              py: 1,
              fontSize: "14px",
              fontWeight: "500",
              "&:hover": { backgroundColor: "#1E54D4" },
            } : {
              borderRadius: "8px",
              textTransform: "none",
              px: 3,
              py: 1,
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Khai tử
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={2}>
        {currentFields.map((field) => (
          <Grid item xs={12} sm={field.multiline ? 12 : 6} key={field.name}>
            {renderField(field, currentData, currentSetter)}
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => {
            setBirthData(initialBirth);
            setDeathData(initialDeath);
            setError(null);
            setSuccess(null);
          }}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            px: 3,
            py: 1,
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          Xóa form
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit} 
          disabled={loading}
          sx={{
            backgroundColor: "#2D66F5",
            borderRadius: "8px",
            textTransform: "none",
            px: 3,
            py: 1,
            fontSize: "14px",
            fontWeight: "500",
            "&:hover": { backgroundColor: "#1E54D4" },
          }}
        >
          {loading ? <CircularProgress size={20} /> : "Gửi yêu cầu"}
        </Button>
      </Box>
    </Box>
  );
}
