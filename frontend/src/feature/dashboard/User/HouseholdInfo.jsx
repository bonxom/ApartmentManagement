import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';

function HouseholdInfo({ householdData, financeData, membersCount }) {
  return (
    <Grid item xs={12} md={6}>
      <Card 
        sx={{ 
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          height: '100%',
        }}
      >
        <Box 
          sx={{ 
            p: 3, 
            background: 'linear-gradient(135deg, #f5f7fa 0%, #f5f7fa 100%)',
            borderBottom: '1px solid #e2e8f0'
          }}
        >
          <Typography 
            sx={{ 
              fontSize: '20px', 
              fontWeight: 600,
              color: '#1e293b'
            }}
          >
            Thông tin hộ gia đình
          </Typography>
        </Box>
        
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box>
                <Typography sx={{ fontSize: '12px', color: '#64748b', mb: 0.5, fontWeight: 500 }}>
                  MÃ HỘ KHẨU
                </Typography>
                <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>
                  {householdData?.householdId || 'Chưa cập nhật'}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box>
                <Typography sx={{ fontSize: '12px', color: '#64748b', mb: 0.5, fontWeight: 500 }}>
                  ĐỊA CHỈ
                </Typography>
                <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>
                  {householdData?.address || 'Chưa cập nhật'}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box>
                <Typography sx={{ fontSize: '12px', color: '#64748b', mb: 0.5, fontWeight: 500 }}>
                  CHỦ HỘ
                </Typography>
                <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>
                  {householdData?.leaderName || 'Chưa cập nhật'}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box>
                <Typography sx={{ fontSize: '12px', color: '#64748b', mb: 0.5, fontWeight: 500 }}>
                  SỐ THÀNH VIÊN
                </Typography>
                <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>
                  {membersCount || 0} người
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: financeData?.total_unpaid > 0 ? '#fef3c7' : '#d1fae5',
                  border: `2px solid ${financeData?.total_unpaid > 0 ? '#fbbf24' : '#10b981'}`,
                }}
              >
                <Typography sx={{ fontSize: '12px', color: '#64748b', mb: 0.5, fontWeight: 500 }}>
                  TÌNH TRẠNG THANH TOÁN
                </Typography>
                <Typography 
                  sx={{ 
                    fontSize: '18px', 
                    fontWeight: 700, 
                    color: financeData?.total_unpaid > 0 ? '#f59e0b' : '#059669' 
                  }}
                >
                  {financeData?.total_unpaid > 0 ? 'Còn nợ' : 'Đã thanh toán đầy đủ'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
}

export default HouseholdInfo;
