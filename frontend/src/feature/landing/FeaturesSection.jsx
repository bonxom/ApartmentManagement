import { Container, Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { Users, Home, FileText, DollarSign, BarChart3, Shield } from 'lucide-react';
import './style/FeaturesSection.css';

function FeaturesSection() {
  const features = [
    {
      icon: <Users size={48} />,
      title: 'Quản lý nhân khẩu',
      description: 'Theo dõi đầy đủ thông tin từng cá nhân: CCCD, ngày sinh, nghề nghiệp, lịch sử tạm trú/tạm vắng, và nhiều hơn nữa.',
      color: '#1976d2'
    },
    {
      icon: <Home size={48} />,
      title: 'Quản lý hộ khẩu & địa chỉ',
      description: 'Quản lý thông tin từng hộ gia đình, chủ hộ, các thành viên, thay đổi chuyển đến/chuyển đi rõ ràng.',
      color: '#2e7d32'
    },
    {
      icon: <FileText size={48} />,
      title: 'Tạm trú / Tạm vắng online',
      description: 'Tiếp nhận – phê duyệt – gia hạn tạm trú, tạm vắng ngay trên hệ thống, hạn chế hồ sơ giấy.',
      color: '#ed6c02'
    },
    {
      icon: <DollarSign size={48} />,
      title: 'Quản lý thu phí & công nợ',
      description: 'Ghi nhận các khoản thu (phí vệ sinh, quỹ khu phố,...), theo dõi ai đã đóng/chưa đóng, xuất báo cáo thu/chi nhanh chóng.',
      color: '#d32f2f'
    },
    {
      icon: <BarChart3 size={48} />,
      title: 'Báo cáo & thống kê tự động',
      description: 'Báo cáo dân số theo độ tuổi, giới tính, khu vực; thống kê thu phí theo tháng/quý/năm; xuất Excel/PDF chỉ với vài click.',
      color: '#9c27b0'
    },
    {
      icon: <Shield size={48} />,
      title: 'Phân quyền & nhật ký hoạt động',
      description: 'Phân quyền theo vai trò (tổ trưởng, khu phố, phường,...), lưu lại lịch sử thao tác để dễ kiểm tra, giám sát.',
      color: '#0288d1'
    }
  ];

  return (
    <Box id="features" className="features-section">
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box className="section-header">
          <Typography variant="h3" className="section-title" sx={{ mb: 0 }}>
            Tính năng vượt trội
          </Typography>
          <Typography variant="h6" className="section-subtitle" sx={{ mt: '0.5rem', mb: 0 }}>
            Giải pháp toàn diện cho quản lý dân cư hiện đại
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card className="feature-card">
                <CardContent className="feature-card-content">
                  <Box 
                    className="feature-icon"
                    sx={{ color: feature.color }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" className="feature-title">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" className="feature-description">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default FeaturesSection;
