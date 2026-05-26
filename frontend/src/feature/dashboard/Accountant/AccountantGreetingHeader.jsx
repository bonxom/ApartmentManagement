import React from 'react';
import { Box, Typography } from '@mui/material';

function AccountantGreetingHeader({ userName }) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: '#1e293b',
          mb: 1,
        }}
      >
        {getGreeting()}, {userName || 'Kế toán'}! 👋
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: '#64748b',
          fontSize: '16px',
        }}
      >
        Chào mừng bạn quay trở lại với hệ thống quản lý kế toán
      </Typography>
    </Box>
  );
}

export default AccountantGreetingHeader;
