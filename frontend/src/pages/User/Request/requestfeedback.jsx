import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Send, FileText } from "lucide-react";
import { requestAPI } from "../../../api/apiService";

export default function RequestFeedback() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Vệ sinh");
  const [urgency, setUrgency] = useState("Thường");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Vui lòng nhập đầy đủ các thông tin cần thiết.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await requestAPI.createFeedback({
        title: title.trim(),
        category,
        urgency,
        content: content.trim(),
      });
      setSuccess(true);
      setTitle("");
      setContent("");
    } catch (err) {
      setError(err?.message || "Gửi phản ánh thất bại, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: "700px", margin: "0 auto" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: "12px",
            backgroundColor: "primary.light",
            color: "primary.main",
            display: "flex",
            alignItems: "center",
          }}
        >
          <FileText size={24} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Gửi phản ánh dịch vụ
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Mọi ý kiến của bạn sẽ được chuyển thẳng tới Ban quản lý để phê duyệt và giải quyết.
          </Typography>
        </Box>
      </Box>

      <Card sx={{ boxShadow: "0 8px 24px rgba(0,0,0,0.05)" }}>
        <CardContent sx={{ p: 4 }}>
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Gửi phản ánh thành công! Đơn phản ánh của bạn đang ở trạng thái chờ xử lý.
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
                  Tiêu đề phản ánh <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Nhập ngắn gọn vấn đề (Ví dụ: Thang máy hỏng, Rác chưa dọn...)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
                  Danh mục phản ánh
                </Typography>
                <TextField
                  select
                  fullWidth
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={loading}
                >
                  <MenuItem value="Vệ sinh">Vệ sinh & Môi trường</MenuItem>
                  <MenuItem value="An ninh">An ninh & Trật tự</MenuItem>
                  <MenuItem value="Kỹ thuật">Kỹ thuật & Cơ sở hạ tầng</MenuItem>
                  <MenuItem value="Khác">Ý kiến & Đóng góp khác</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
                  Mức độ khẩn cấp
                </Typography>
                <TextField
                  select
                  fullWidth
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  disabled={loading}
                >
                  <MenuItem value="Thường">Thường (Xử lý trong 3-5 ngày)</MenuItem>
                  <MenuItem value="Khẩn cấp">Khẩn cấp (Cần xử lý ngay)</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
                  Nội dung chi tiết phản ánh <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={5}
                  placeholder="Mô tả cụ thể thời gian, địa điểm, sự cố xảy ra..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Send size={16} />}
                  sx={{
                    px: 4,
                    py: 1.2,
                    fontSize: "14px",
                    fontWeight: 600,
                    borderRadius: "8px",
                  }}
                >
                  {loading ? "Đang gửi..." : "Gửi phản ánh"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
