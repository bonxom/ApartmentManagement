import { Container, Box, Typography, Button, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import './style/HeroSection.css';

function HeroSection() {
  return (
    <Box className="hero-section">
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box className="hero-content">
              {/* <Typography variant="overline" className="hero-badge">
                Giải pháp số hóa quản lý
              </Typography> */}
              
              <Typography variant="h2" className="hero-title" sx={{ mb: '1.5rem' }}>
              <span className="highlight-wrapper">
                  <span className="highlight-text">
                  VIM SMARTCITY
                  </span>

                  <svg
                  className="highlight-underline"
                  height="12"
                  viewBox="0 0 200 12"
                  xmlns="http://www.w3.org/2000/svg"
                  >
                  <defs>
                      <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#eff6ff" />
                      <stop offset="50%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#1d4ed8" />
                      </linearGradient>
                  </defs>
                  <path
                      d="M0 8 Q50 2, 100 8 T200 8"
                      stroke="url(#blueGradient)"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                  />
                  </svg>
              </span>
              </Typography>

              
              <Typography variant="h6" className="hero-description" sx={{ mt: 0, mb: 0 }}>
                Số hóa toàn bộ quy trình quản lý chung cư trên một nền tảng thống nhất – minh bạch hơn, nhanh chóng hơn, hiệu quả hơn
              </Typography>
              
              <Box className="hero-buttons">
                <Button
                  component={RouterLink}
                  to="/signup"
                  variant="contained"
                  size="large"
                  className="primary-cta-button"
                >
                  Dùng thử miễn phí
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  className="secondary-cta-button"
                  startIcon={<Play />}
                >
                  Xem demo hệ thống
                </Button>
              </Box>
              
              <Box className="hero-trust-badges">
                <Typography variant="body2" className="trust-text">
                  ✓ Miễn phí 30 ngày dùng thử
                </Typography>
                <Typography variant="body2" className="trust-text">
                  ✓ Không cần thẻ tín dụng
                </Typography>
                <Typography variant="body2" className="trust-text">
                  ✓ Hỗ trợ 24/7
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box className="hero-image">
              <img                                                                                                                                                                      
                src="/landingPage.jpg" 
                alt="Hệ thống quản lý dân cư" 
                className="hero-img"
              />                        
              <Box className="hero-image-overlay"></Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default HeroSection;
