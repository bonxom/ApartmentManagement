import { useEffect, useMemo, useState } from "react";
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

const residenceFields = [
  { name: "name", label: "Họ và tên", required: true },
  { name: "userCardID", label: "CCCD/ID", required: true },
  { name: "dob", label: "Ngày sinh", required: true, type: "date" },
  {
    name: "sex",
    label: "Giới tính",
    required: true,
    select: true,
    options: ["Nam", "Nữ", "Khác"],
  },
  { name: "birthLocation", label: "Nơi sinh", required: true },
  { name: "ethnic", label: "Dân tộc", required: true },
  { name: "phoneNumber", label: "Số điện thoại", required: true },
  { name: "job", label: "Nghề nghiệp", required: true },
  { name: "startDate", label: "Bắt đầu", required: true, type: "date" },
  { name: "endDate", label: "Kết thúc", required: true, type: "date" },
  { name: "permanentAddress", label: "Địa chỉ thường trú", required: true, multiline: true },
  { name: "reason", label: "Lý do", required: true, multiline: true },
];

const absenceFields = [
  {
    name: "memberId",
    label: "Thành viên",
    required: true,
    select: true,
    options: [],
  },
  { name: "fromDate", label: "Từ ngày", required: true, type: "date" },
  { name: "toDate", label: "Đến ngày", required: true, type: "date" },
  { name: "temporaryAddress", label: "Địa chỉ tạm trú", required: true },
  { name: "reason", label: "Lý do", required: true, multiline: true },
];

const initialResidence = residenceFields.reduce(
  (acc, f) => ({ ...acc, [f.name]: "" }),
  {}
);
const initialAbsence = absenceFields.reduce(
  (acc, f) => ({ ...acc, [f.name]: "" }),
  {}
);

export default function RequestTamTruVang() {
  const { user } = useAuthStore();
  const [mode, setMode] = useState("TEMPORARY_RESIDENCE");
  const [residenceData, setResidenceData] = useState(initialResidence);
  const [absenceData, setAbsenceData] = useState(initialAbsence);
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

  const absenceFieldsWithOptions = useMemo(() => {
    return absenceFields.map((f) =>
      f.name === "memberId"
        ? {
            ...f,
            options: members.map((m) => ({
              value: m._id,
              label: `${m.name} (${m.userCardID || ""})`,
            })),
          }
        : f
    );
  }, [members]);

  const handleChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(null);
  };

  const validateFields = (fields, data) => {
    return fields.every(
      (f) =>
        !f.required || (data[f.name] && data[f.name].toString().trim() !== "")
    );
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      if (!user?.household) {
        throw new Error("Bạn chưa thuộc hộ khẩu nào.");
      }
      if (mode === "TEMPORARY_RESIDENCE") {
        if (!validateFields(residenceFields, residenceData)) {
          throw new Error("Vui lòng nhập đầy đủ thông tin tạm trú.");
        }
        await requestAPI.createTemporaryResidence(residenceData);
        setResidenceData(initialResidence);
        setSuccess("Đã gửi yêu cầu tạm trú.");
      } else {
        if (!validateFields(absenceFields, absenceData)) {
          throw new Error("Vui lòng nhập đầy đủ thông tin tạm vắng.");
        }
        const payload = {
          userId: absenceData.memberId,
          fromDate: absenceData.fromDate,
          toDate: absenceData.toDate,
          temporaryAddress: absenceData.temporaryAddress,
          permanentAddress: absenceData.permanentAddress,
          reason: absenceData.reason,
        };
        await requestAPI.createTemporaryAbsence(payload);
        setAbsenceData(initialAbsence);
        setSuccess("Đã gửi yêu cầu tạm vắng.");
      }
    } catch (err) {
      const msg = err?.message || err?.customMessage || "Gửi yêu cầu thất bại.";
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

  const isResidence = mode === "TEMPORARY_RESIDENCE";
  const currentFields = isResidence
    ? residenceFields
    : absenceFieldsWithOptions;
  const currentData = isResidence ? residenceData : absenceData;
  const currentSetter = isResidence ? setResidenceData : setAbsenceData;

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography sx={{ fontSize: 26, fontWeight: 600 }}>
          Khai báo tạm trú tạm vắng
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant={isResidence ? "contained" : "outlined"}
            onClick={() => setMode("TEMPORARY_RESIDENCE")}
            sx={isResidence ? {
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
            Tạm trú
          </Button>
          <Button
            variant={!isResidence ? "contained" : "outlined"}
            onClick={() => setMode("TEMPORARY_ABSENT")}
            sx={!isResidence ? {
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
            Tạm vắng
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
            setResidenceData(initialResidence);
            setAbsenceData(initialAbsence);
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
