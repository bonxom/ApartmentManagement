import { Container, Box, Typography, Grid, Card, CardContent, Button, Chip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Check, Star } from 'lucide-react';
import './style/PricingSection.css';

function PricingSection() {
  const pricingPlans = [
    {
      name: 'Cơ bản',
      price: 'Miễn phí',
      period: '',
      description: 'Phù hợp cho tổ dân phố nhỏ (dưới 100 nhân khẩu)',
      features: [
        'Quản lý tối đa 100 nhân khẩu',
        'Quản lý 20 hộ gia đình',
        'Báo cáo cơ bản',
        'Hỗ trợ email',
        'Lưu trữ 1GB'
      ],
      popular: false,
      color: '#1976d2'
    },
    {
      name: 'Chuyên nghiệp',
      price: '199.000đ',
      period: '/tháng',
      description: 'Phù hợp cho khu phố, tổ dân phố lớn',
      features: [
        'Quản lý không giới hạn nhân khẩu',
        'Quản lý không giới hạn hộ gia đình',
        'Báo cáo nâng cao & tùy chỉnh',
        'Hỗ trợ ưu tiên 24/7',
        'Lưu trữ 50GB',
        'Quản lý thu phí',
        'Tạm trú/tạm vắng online',
        'Phân quyền chi tiết'
      ],
      popular: true,
      color: '#2e7d32'
    },
    {
      name: 'Doanh nghiệp',
      price: 'Liên hệ',
      period: '',
      description: 'Giải pháp cho phường, xã, quận',
      features: [
        'Tất cả tính năng Chuyên nghiệp',
        'Quản lý đa cấp (phường/xã/quận)',
        'API tích hợp hệ thống',
        'Đào tạo onsite',
        'Tùy chỉnh theo yêu cầu',
        'Lưu trữ không giới hạn',
        'Dedicated support manager',
        'SLA 99.9% uptime'
      ],
      popular: false,
      color: '#ed6c02'
    }
  ];

  return (
    <Box id="pricing" className="pricing-section">
      <Container maxWidth="lg">
        <Box className="section-header">
          <Typography variant="overline" className="section-badge">
            Bảng giá
          </Typography>
          <Typography variant="h3" className="section-title">
            Chọn gói phù hợp với bạn
          </Typography>
          <Typography variant="h6" className="section-subtitle">
            Linh hoạt, minh bạch, không phí ẩn
          </Typography>
        </Box>

        <Grid container spacing={4} alignItems="stretch">
          {pricingPlans.map((plan, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                className={`pricing-card ${plan.popular ? 'popular' : ''}`}
                elevation={plan.popular ? 8 : 2}
              >
                {plan.popular && (
                  <Chip 
                    icon={<Star size={16} />}
                    label="Phổ biến nhất" 
                    className="popular-badge"
                    color="success"
                  />
                )}
                
                <CardContent className="pricing-card-content">
                  <Typography variant="h5" className="plan-name">
                    {plan.name}
                  </Typography>
                  
                  <Box className="price-box">
                    <Typography variant="h3" className="plan-price" sx={{ color: plan.color }}>
                      {plan.price}
                    </Typography>
                    {plan.period && (
                      <Typography variant="body2" className="price-period">
                        {plan.period}
                      </Typography>
                    )}
                  </Box>
                  
                  <Typography variant="body2" className="plan-description">
                    {plan.description}
                  </Typography>
                  
                  <Box className="features-list">
                    {plan.features.map((feature, idx) => (
                      <Box key={idx} className="feature-item">
                        <Check size={20} className="check-icon" style={{ color: plan.color }} />
                        <Typography variant="body2" className="feature-text">
                          {feature}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  
                  <Button
                    component={RouterLink}
                    to="/signup"
                    variant={plan.popular ? "contained" : "outlined"}
                    fullWidth
                    size="large"
                    className="pricing-button"
                    sx={{ 
                      borderColor: plan.color,
                      color: plan.popular ? '#fff' : plan.color,
                      backgroundColor: plan.popular ? plan.color : 'transparent',
                      '&:hover': {
                        backgroundColor: plan.popular ? plan.color : 'rgba(0,0,0,0.04)',
                        borderColor: plan.color
                      }
                    }}
                  >
                    {plan.price === 'Liên hệ' ? 'Liên hệ ngay' : 'Bắt đầu dùng thử'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default PricingSection;
