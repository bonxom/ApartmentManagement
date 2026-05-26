import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

function GenderChart({ genderData }) {
  return (
    <Grid item xs={12} md={6}>
      <Paper
        sx={{
          p: 3,
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          height: '100%',
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Thống kê nhân khẩu theo giới tính
        </Typography>

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
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>

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
              gap: 1,
              width: { xs: '100%', sm: '40%' },
              maxWidth: 200,
            }}
          >
            {genderData.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  p: 1,
                  borderRadius: 1,
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
                <Typography variant="body2" sx={{ flex: 1 }}>
                  {item.name}
                </Typography>
                <Typography variant="subtitle2" fontWeight={600}>
                  {item.value.toLocaleString()}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
}

export default GenderChart;
