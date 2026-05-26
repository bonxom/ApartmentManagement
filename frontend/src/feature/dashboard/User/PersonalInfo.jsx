import React from 'react';
import { Box, Typography, Paper, Grid, Avatar } from '@mui/material';
import { User, Mail, Phone, Briefcase } from 'lucide-react';

function PersonalInfo({ user }) {
  const infoItems = [
    {
      icon: <User size={18} />,
      label: 'Họ và tên',
      value: user?.name || 'N/A',
    },
    {
      icon: <Mail size={18} />,
      label: 'Email',
      value: user?.email || 'N/A',
    },
    {
      icon: <Phone size={18} />,
      label: 'Số điện thoại',
      value: user?.phoneNumber || 'N/A',
    },
    {
      icon: <Briefcase size={18} />,
      label: 'Vai trò',
      value: 'Cư dân',
    },
  ];

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      }}
    >
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Thông tin cá nhân
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 3 }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: '#2563eb',
            fontSize: '32px',
            fontWeight: 600,
          }}
        >
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </Avatar>

        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            {user?.name || 'Người dùng'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            {user?.email || 'Người dùng hệ thống'}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2}>
        {infoItems.map((item, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 2,
                borderRadius: '12px',
                bgcolor: '#f8fafc',
                border: '1px solid #e2e8f0',
              }}
            >
              <Box
                sx={{
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {item.icon}
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: '#64748b', display: 'block', mb: 0.25 }}
                >
                  {item.label}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, color: '#1e293b' }}
                >
                  {item.value}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

export default PersonalInfo;
