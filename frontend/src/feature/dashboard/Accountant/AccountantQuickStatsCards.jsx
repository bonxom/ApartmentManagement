import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';

function AccountantQuickStatsCards({ statsData }) {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {statsData.map((stat, index) => (
        <Grid item xs={12} sm={6} md={6} key={index}>
          <Paper
            sx={{
              p: 3,
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: `${stat.color}15`,
                  color: stat.color,
                }}
              >
                {stat.icon}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#64748b',
                    fontSize: '14px',
                    mb: 0.5,
                  }}
                >
                  {stat.label}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: '#1e293b',
                  }}
                >
                  {stat.value}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

export default AccountantQuickStatsCards;
