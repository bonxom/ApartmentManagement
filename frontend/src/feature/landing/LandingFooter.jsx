import { Container, Box, Typography, Grid, Link, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';
import './style/LandingFooter.css';

function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <Box className="landing-footer">
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Box className="footer-section">
              <Box className="footer-logo">
                <Building2 size={32} className="footer-logo-icon" />
                <Typography variant="h6" className="footer-logo-text">
                  VIM SMARTCITY
                </Typography>
              </Box>
              <Typography variant="body2" className="footer-description">
                Giải pháp quản lý dân cư toàn diện, hiện đại và hiệu quả cho mọi đơn vị.
              </Typography>
              <Box className="social-links">
                <IconButton className="social-icon" aria-label="Facebook" sx={{ color: '#fefefeff' }}>
                  <Facebook size={20} />
                </IconButton>
                <IconButton className="social-icon" aria-label="Twitter" sx={{ color: '#fefefeff' }}>
                  <Twitter size={20} />
                </IconButton>
                <IconButton className="social-icon" aria-label="LinkedIn" sx={{ color: '#fefefeff' }}>
                  <Linkedin size={20} />
                </IconButton>
                <IconButton className="social-icon" aria-label="Youtube" sx={{ color: '#fefefeff' }}>
                  <Youtube size={20} />
                </IconButton>
              </Box>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Box className="footer-section">
              <Typography variant="h6" className="footer-title">
                Liên kết nhanh
              </Typography>
              <Box className="footer-links">
                <Link href="#features" className="footer-link">
                  Tính năng
                </Link>
                <Link href="#how-it-works" className="footer-link">
                  Cách sử dụng
                </Link>
                <Link href="#pricing" className="footer-link">
                  Bảng giá
                </Link>
                <Link href="#testimonials" className="footer-link">
                  Đánh giá
                </Link>
              </Box>
            </Box>
          </Grid>

          {/* Support */}
          <Grid item xs={12} sm={6} md={3}>
            <Box className="footer-section">
              <Typography variant="h6" className="footer-title">
                Hỗ trợ
              </Typography>
              <Box className="footer-links">
                <Link component={RouterLink} to="https://web.facebook.com/aine.mermaid" className="footer-link">
                  Trung tâm trợ giúp
                </Link>
                <Link component={RouterLink} to="https://web.facebook.com/aine.mermaid" className="footer-link">
                  Tài liệu hướng dẫn
                </Link>
                <Link component={RouterLink} to="https://web.facebook.com/aine.mermaid" className="footer-link">
                  Chính sách bảo mật
                </Link>
                <Link component={RouterLink} to="https://web.facebook.com/aine.mermaid" className="footer-link">
                  Điều khoản sử dụng
                </Link>
              </Box>
            </Box>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} sm={6} md={3}>
            <Box className="footer-section">
              <Typography variant="h6" className="footer-title">
                Liên hệ
              </Typography>
              <Box className="contact-info">
                <Box className="contact-item">
                  <Mail size={18} className="contact-icon" />
                  <Typography variant="body2">
                    support@quanlydancu.vn
                  </Typography>
                </Box>
                <Box className="contact-item">
                  <Phone size={18} className="contact-icon" />
                  <Typography variant="body2">
                    1900 xxxx
                  </Typography>
                </Box>
                <Box className="contact-item">
                  <MapPin size={18} className="contact-icon" />
                  <Typography variant="body2">
                    Hà Nội, Việt Nam
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box className="footer-bottom">
          <Typography variant="body2" className="copyright">
            © {currentYear} VIM SMARTCITY. Tất cả quyền được bảo lưu.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default LandingFooter;
