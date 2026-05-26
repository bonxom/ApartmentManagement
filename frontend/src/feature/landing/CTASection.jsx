import { Container, Box, Typography, Button, Grid } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";
import "./style/CTASection.css";

function CTASection() {
  return (
    <Box className="cta-section">
      <Container maxWidth="lg">
        <Box className="cta-content">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h3" className="cta-title">
                Sẵn sàng số hóa quản lý dân cư?
              </Typography>
              <Typography variant="h6" className="cta-description">
                Tham gia cùng hàng nghìn tổ dân phố, phường xã đã tin dùng hệ
                thống. Dùng thử miễn phí 30 ngày, không cần thẻ tín dụng.
              </Typography>
              <Box className="cta-features">
                <Typography variant="body2" className="cta-feature">
                  ✓ Thiết lập trong 5 phút
                </Typography>
                <Typography variant="body2" className="cta-feature">
                  ✓ Đào tạo miễn phí
                </Typography>
                <Typography variant="body2" className="cta-feature">
                  ✓ Hỗ trợ 24/7
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box className="cta-buttons">
                <Button
                  component={RouterLink}
                  to="/signup"
                  variant="contained"
                  size="large"
                  fullWidth
                  className="cta-primary-button"
                  endIcon={<ArrowRight />}
                >
                  Bắt đầu miễn phí
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  className="cta-secondary-button"
                  startIcon={<Phone />}
                  sx={{
                    color: "#ffffff",
                    borderColor: "#ffffff",
                    "&:hover": {
                      borderColor: "#ffffff",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  Liên hệ tư vấn
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default CTASection;
