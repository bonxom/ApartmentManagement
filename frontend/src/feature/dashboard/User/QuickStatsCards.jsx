import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';

function QuickStatsCards({ statsData }) {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {statsData.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card 
            sx={{ 
              height: '100%',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box 
                  sx={{ 
                    p: 1.5,
                    borderRadius: '12px',
                    backgroundColor: `${stat.color}15`,
                    color: stat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {stat.icon}
                </Box>
              </Box>
              <Typography 
                sx={{ 
                  fontSize: index === 0 ? '24px' : '32px', 
                  fontWeight: 700, 
                  color: stat.color,
                  mb: 0.5,
                  wordBreak: index === 0 ? 'break-word' : 'normal'
                }}
              >
                {stat.value}
              </Typography>
              <Typography 
                sx={{ 
                  fontSize: '14px', 
                  color: '#64748b',
                  fontWeight: 500
                }}
              >
                {stat.label}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default QuickStatsCards;
