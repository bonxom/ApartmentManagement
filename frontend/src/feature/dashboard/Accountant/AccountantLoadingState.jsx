import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

function AccountantLoadingState() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: 2,
      }}
    >
      <CircularProgress size={48} />
      <Typography variant="body1" sx={{ color: '#64748b' }}>
        Đang tải dữ liệu...
      </Typography>
    </Box>
  );
}

export default AccountantLoadingState;
