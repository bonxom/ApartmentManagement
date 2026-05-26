import { Container, Box, Grid, Typography, Paper } from '@mui/material';
import { Users, Home, TrendingDown, Clock } from 'lucide-react';
import './style/StatsSection.css';

function StatsSection() {
  const stats = [
    {
      icon: <Users size={40} />,
      number: '10.000+',
      label: 'Nhân khẩu được quản lý',
      color: '#1976d2'
    },
    {
      icon: <Home size={40} />,
      number: '500+',
      label: 'Hộ gia đình trong hệ thống',
      color: '#2e7d32'
    },
    {
      icon: <TrendingDown size={40} />,
      number: '70%',
      label: 'Giảm thời gian xử lý hồ sơ',
      color: '#ed6c02'
    },
    {
      icon: <Clock size={40} />,
      number: '24/7',
      label: 'Truy cập mọi lúc mọi nơi',
      color: '#9c27b0'
    }
  ];

  return (
    <Box className="stats-section">
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper className="stat-card" elevation={3}>
                <Box 
                  className="stat-icon" 
                  sx={{ color: stat.color }}
                >
                  {stat.icon}
                </Box>
                <Typography variant="h3" className="stat-number" sx={{ color: stat.color }}>
                  {stat.number}
                </Typography>
                <Typography variant="body1" className="stat-label">
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default StatsSection;
