import { Container, Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { UserPlus, Activity, FileBarChart } from 'lucide-react';
import './style/HowItWorksSection.css';

function HowItWorksSection() {
  const steps = [
    {
      icon: <UserPlus size={56} />,
      step: 'Bước 1',
      title: 'Đối với người dân',
      description: 'Nộp phí online, khai báo tạm trú, tạm vắng, tạo yêu cầu gửi lên tổ trưởng một cách nhanh chóng và tiện lợi.',
      features: [
        '✓ Nộp phí trực tuyến 24/7',
        '✓ Khai báo tạm trú/tạm vắng',
        '✓ Gửi yêu cầu hỗ trợ'
      ],
      color: '#1976d2'
    },
    {
      icon: <Activity size={56} />,
      step: 'Bước 2',
      title: 'Vận hành hàng ngày',
      description: 'Cập nhật biến động nhân khẩu, xử lý hồ sơ tạm trú/tạm vắng, ghi nhận thu phí một cách dễ dàng và chính xác.',
      features: [
        '✓ Cập nhật thông tin nhân khẩu',
        '✓ Xử lý hồ sơ tạm trú/vắng',
        '✓ Ghi nhận thu phí'
      ],
      color: '#2e7d32'
    },
    {
      icon: <FileBarChart size={56} />,
      step: 'Bước 3',
      title: 'Xem báo cáo & chia sẻ',
      description: 'Tạo báo cáo dân số, báo cáo thu phí, xuất file gửi lãnh đạo hoặc in lưu trữ chỉ với vài thao tác đơn giản.',
      features: [
        '✓ Báo cáo dân số chi tiết',
        '✓ Thống kê thu phí',
        '✓ Xuất Excel/PDF dễ dàng'
      ],
      color: '#ed6c02'
    }
  ];

  return (
    <Box id="how-it-works" className="how-it-works-section">
      <Container maxWidth="lg">
        <Box className="section-header">
          <Typography variant="h3" className="section-title">
            Cách sử dụng hệ thống
          </Typography>
          <Typography variant="h6" className="section-subtitle" sx={{ mt: '0.5rem', mb: 0 }}>
            Quản lý dân cư chưa bao giờ dễ dàng đến thế
          </Typography>
        </Box>

        <Grid container spacing={4} alignItems="stretch">
          {steps.map((step, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card className="step-card">
                <CardContent className="step-card-content">
                  <Box 
                    className="step-icon"
                    sx={{ color: step.color }}
                  >
                    {step.icon}
                  </Box>
                  <Typography variant="h5" className="step-title">
                    {step.title}
                  </Typography>
                  <Typography variant="body2" className="step-description">
                    {step.description}
                  </Typography>
                  <Box className="step-features">
                    {step.features.map((feature, idx) => (
                      <Typography 
                        key={idx} 
                        variant="body2" 
                        className="step-feature-item"
                        sx={{ color: step.color }}
                      >
                        {feature}
                      </Typography>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default HowItWorksSection;
