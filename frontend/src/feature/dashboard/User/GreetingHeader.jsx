import React from 'react';
import { Box, Typography } from '@mui/material';

function GreetingHeader({ userName }) {
  // Lấy giờ hiện tại để chào phù hợp
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  return (
    <Box 
      sx={{ 
        mb: 4,
        p: 4,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        color: 'white',
        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
      }}
    >
      <Typography 
        sx={{ 
          fontSize: { xs: '20px', sm: '24px', md: '28px' }, 
          fontWeight: 300,
          mb: 1,
          opacity: 0.9
        }}
      >
        {getGreeting()},
      </Typography>
      <Typography 
        sx={{ 
          fontSize: { xs: '32px', sm: '40px', md: '48px' }, 
          fontWeight: 700,
          mb: 2,
          textShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}
      >
        {userName || 'Người dùng'}!
      </Typography>
      <Typography 
        sx={{ 
          fontSize: { xs: '14px', sm: '16px' },
          opacity: 0.95,
          maxWidth: '600px'
        }}
      >
        Chào mừng bạn quay trở lại với hệ thống quản lý dân cư. 
        Chúc bạn có một ngày tốt lành! 🌟
      </Typography>
    </Box>
  );
}

export default GreetingHeader;
