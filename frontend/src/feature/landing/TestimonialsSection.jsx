import { Container, Box, Typography, Grid, Card, CardContent, Avatar, Rating } from '@mui/material';
import { Quote } from 'lucide-react';
import './style/TestimonialsSection.css';

function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Lê Đức Chú',
      role: 'Tổ trưởng dân phố, Hoa Thanh Quế',
      avatar: 'user1.jpg',
      rating: 5,
      comment: 'Hệ thống giúp công việc quản lý dân cư của tôi dễ dàng hơn rất nhiều. Không còn phải lật giở hồ sơ giấy tờ như trước nữa. Mọi thông tin đều được lưu trữ và tìm kiếm nhanh chóng.'
    },
    {
      name: 'Bùi Xuân Huấn',
      role: 'Cán bộ phường, Hà Nội',
      avatar: 'user2.jpg',
      rating: 5,
      comment: 'Tính năng báo cáo tự động thực sự hữu ích. Tôi có thể tạo báo cáo dân số theo nhiều tiêu chí khác nhau chỉ trong vài phút. Xuất Excel rất tiện lợi để gửi lên cấp trên.'
    },
    {
      name: 'Hoàng Tạ Fuc',
      role: 'Công an Đắk Lắk',
      avatar: 'user3.jpg',
      rating: 5,
      comment: 'Quản lý thu phí chưa bao giờ đơn giản đến thế. Hệ thống tự động theo dõi ai đã đóng, ai chưa đóng. Giảm thiểu sai sót và tranh chấp với người dân rất nhiều.'
    },
    {
      name: 'Đỗ Văn Ri',
      role: 'Công dân, Đà Nẵng',
      avatar: 'user4.jpeg',
      rating: 5,
      comment: 'Là người dân, tôi rất thích tính năng nộp phí online cho trọng tài. Không cần đến tận nơi, chỉ cần vào app là có thể thanh toán mọi khoản phí. Tiện lợi và tiết kiệm thời gian.'
    },
    {
      name: 'Sa Văn Tị',
      role: 'Người tạm trú, Hải Phòng',
      avatar: 'user5.jpeg',
      rating: 5,
      comment: 'Tính năng thống kê thu chi rất chi tiết và chính xác. Tôi có thể theo dõi dòng tiền, xuất báo cáo tài chính hàng tháng một cách chuyên nghiệp.'
    },
    {
      name: 'Nguyễn Công Phương',
      role: 'Nhân viên Jollibee, Nghệ An',
      avatar: 'user6.png',
      rating: 5,
      comment: 'Hỗ trợ khách hàng rất tốt. Khi gặp vấn đề, đội ngũ support luôn nhiệt tình giúp đỡ và giải quyết nhanh chóng. Đào tạo sử dụng cũng rất dễ hiểu.'
    }
  ];

  return (
    <Box id="testimonials" className="testimonials-section">
      <Container maxWidth="lg">
        <Box className="section-header">
          <Typography variant="h3" className="section-title">
            Khách hàng nói gì về chúng tôi
          </Typography>
          <Typography variant="h6" className="section-subtitle">
            Hơn 1000+ tổ dân phố và phường xã đã tin dùng hệ thống
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card className="testimonial-card">
                <CardContent className="testimonial-card-content">
                  <Quote className="quote-icon" size={40} />
                  
                  <Rating 
                    value={testimonial.rating} 
                    readOnly 
                    className="testimonial-rating"
                  />
                  
                  <Typography variant="body2" className="testimonial-comment">
                    "{testimonial.comment}"
                  </Typography>
                  
                  <Box className="testimonial-author">
                    <Avatar 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="author-avatar"
                    />
                    <Box>
                      <Typography variant="subtitle2" className="author-name">
                        {testimonial.name}
                      </Typography>
                      <Typography variant="caption" className="author-role">
                        {testimonial.role}
                      </Typography>
                    </Box>
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

export default TestimonialsSection;
