import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { Home, Users, FileText, CheckCircle } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { statsAPI } from '../../api/apiService';
import AdminGreetingHeader from '../../feature/dashboard/Admin/AdminGreetingHeader';
import AdminQuickStatsCards from '../../feature/dashboard/Admin/AdminQuickStatsCards';
import GenderChart from '../../feature/dashboard/Admin/GenderChart';
import FeeStatusChart from '../../feature/dashboard/Admin/FeeStatusChart';
import AdminPersonalInfo from '../../feature/dashboard/Admin/AdminPersonalInfo';
import AdminLoadingState from '../../feature/dashboard/Admin/AdminLoadingState';

function Dashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await statsAPI.getDashboard();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Không thể tải dữ liệu thống kê');
    } finally {
      setLoading(false);
    }
  };

  fetchStats();
}, []);

const quickStats = [
  {
    icon: <Home size={32} />,
    label: 'Hộ gia đình',
    value: stats?.demographics?.total_households ?? '--',
    color: '#2563eb',
  },
  {
    icon: <Users size={32} />,
    label: 'Nhân khẩu đã xác thực',
    value: stats?.demographics?.total_users ?? '--',
    color: '#16a34a',
  },
  {
    icon: <FileText size={32} />,
    label: 'Tổng tiền đã thu (VNĐ)',
    value: stats?.financial?.total_revenue != null
      ? stats.financial.total_revenue.toLocaleString('vi-VN')
      : '--',
    color: '#ea580c',
  },
  {
    icon: <CheckCircle size={32} />,
    label: 'Đợt thu đang mở',
    value: stats?.financial?.active_campaigns ?? '--',
    color: '#7c3aed',
  },
];

const genderData = [
  { name: 'Nam', value: stats?.demographics?.gender?.male || 0, color: '#3b82f6' },
  { name: 'Nữ', value: stats?.demographics?.gender?.female || 0, color: '#ec4899' },
];

const feeStatusData = [
  { 
    name: 'Đã nộp', 
    value: stats?.financial?.payment_status?.paid_amount || 0, 
    color: '#16a34a',
    displayValue: (stats?.financial?.payment_status?.paid_amount || 0).toLocaleString('vi-VN') + ' đ'
  },
  { 
    name: 'Còn thiếu', 
    value: stats?.financial?.payment_status?.unpaid_amount || 0, 
    color: '#ef4444',
    displayValue: (stats?.financial?.payment_status?.unpaid_amount || 0).toLocaleString('vi-VN') + ' đ'
  },
];

if (loading) {
  return <AdminLoadingState />;
}

if (error) {
  return (
    <Box className="vim-page" sx={{ p: { xs: 2, md: 4 } }}>
      <Typography color="error">{error}</Typography>
    </Box>
  );
}

  return (
    <Box sx={{ p: 4 }}>
      {/* Header chào mừng */}
      <AdminGreetingHeader userName={user?.name} />

      {/* Thống kê nhanh */}
      <AdminQuickStatsCards statsData={quickStats} />

      {/* Biểu đồ thống kê */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <GenderChart genderData={genderData} />
        <FeeStatusChart feeStatusData={feeStatusData} />
      </Grid>

      {/* Thông tin cá nhân */}
      <AdminPersonalInfo user={user} />
    </Box>
  );
}

export default Dashboard;
