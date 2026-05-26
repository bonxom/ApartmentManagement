import React from 'react';
import { Box, Typography } from '@mui/material';

function LoadingState() {
  return (
    <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography sx={{ fontSize: '18px', color: '#64748b', mb: 2 }}>
          Đang tải dữ liệu Dashboard...
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <div 
            className="spinner" 
            style={{ 
              border: '4px solid #f3f4f6', 
              borderTop: '4px solid #667eea',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              animation: 'spin 1s linear infinite'
            }} 
          />
        </Box>
      </Box>
    </Box>
  );
}

export default LoadingState;
