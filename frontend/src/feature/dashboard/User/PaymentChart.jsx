import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

function PaymentChart({ paymentData }) {
  return (
    <Grid item xs={12} md={6}>
      <Paper
        sx={{
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          height: '100%',
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{ 
            p: 3, 
            background:  'linear-gradient(135deg, #f5f7fa 0%, #f5f7fa 100%)',
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
            Thống kê thanh toán
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
          }}
        >
          {/* Pie chart */}
          <Box
            sx={{
              width: { xs: '100%', sm: '60%' },
              height: 250,
              maxWidth: 300,
              mx: 'auto',
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => value.toLocaleString('vi-VN') + ' VNĐ'}
                />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  formatter={(value) => (
                    <span style={{ color: '#333' }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>

          {/* Info box */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: { xs: '100%', sm: '40%' },
              maxWidth: 250,
            }}
          >
            {paymentData.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: `${item.color}10`,
                  borderLeft: `4px solid ${item.color}`,
                }}
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: item.color,
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    {item.name}
                  </Typography>
                  <Typography variant="h6" fontWeight={700} sx={{ color: item.color }}>
                    {item.value.toLocaleString('vi-VN')} đ
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
}

export default PaymentChart;
