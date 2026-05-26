import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Clock, CheckCircle } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { requestAPI } from '../../api/apiService';
import AccountantGreetingHeader from '../../feature/dashboard/Accountant/AccountantGreetingHeader';
import AccountantQuickStatsCards from '../../feature/dashboard/Accountant/AccountantQuickStatsCards';
import AccountantPersonalInfo from '../../feature/dashboard/Accountant/AccountantPersonalInfo';
import AccountantLoadingState from '../../feature/dashboard/Accountant/AccountantLoadingState';

function AccountantDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Lấy tất cả các yêu cầu thanh toán
        const requests = await requestAPI.getRequests({ type: 'PAYMENT' });
        
        // Đếm yêu cầu đang chờ và đã duyệt
        const pendingCount = requests.filter(req => req.status === 'PENDING').length;
        const approvedCount = requests.filter(req => req.status === 'APPROVED').length;
        
        setStats({
          pending: pendingCount,
          approved: approvedCount,
        });
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
      icon: <Clock size={32} />,
      label: 'Yêu cầu đang chờ',
      value: stats?.pending ?? '--',
      color: '#f59e0b',
    },
    {
      icon: <CheckCircle size={32} />,
      label: 'Yêu cầu đã duyệt',
      value: stats?.approved ?? '--',
      color: '#16a34a',
    },
  ];

  if (loading) {
    return <AccountantLoadingState />;
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box className="vim-page" sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header chào mừng */}
      <AccountantGreetingHeader userName={user?.name} />

      {/* Thống kê nhanh */}
      <AccountantQuickStatsCards statsData={quickStats} />

      {/* Thông tin cá nhân */}
      <AccountantPersonalInfo user={user} />
    </Box>
  );
}

export default AccountantDashboard;
