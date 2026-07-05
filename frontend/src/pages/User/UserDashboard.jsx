import React, { useEffect, useState } from 'react';
import { Box, Grid, Alert, Button, Paper, Typography } from '@mui/material';
import { Home, Users, Wallet, Clock, User, Settings, ShieldCheck, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { statsAPI } from '../../api/apiService';
import GreetingHeader from '../../feature/dashboard/User/GreetingHeader';
import QuickStatsCards from '../../feature/dashboard/User/QuickStatsCards';
import PaymentChart from '../../feature/dashboard/User/PaymentChart';
import HouseholdInfo from '../../feature/dashboard/User/HouseholdInfo';
import PersonalInfo from '../../feature/dashboard/User/PersonalInfo';
import LoadingState from '../../feature/dashboard/User/LoadingState';

function UserDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userRole = user?.role?.role_name;
  const isMember = userRole === 'MEMBER';

  useEffect(() => {
    if (isMember) {
      setLoading(false);
      setStats(null);
      setError(null);
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Chỉ cần gọi 1 API - getUserDashboard đã bao gồm tất cả
        const dashboardData = await statsAPI.getUserDashboard();
        
        console.log('✅ Dashboard data loaded:', dashboardData);
        
        // Data đã có đầy đủ từ backend
        setStats(dashboardData);
        setError(null);
      } catch (err) {
        console.error('❌ Dashboard error:', err);
        console.error('Response data:', err?.response?.data);
        const errorMessage = err?.response?.data?.message || 'Không thể tải dữ liệu thống kê';
        console.error('Error message:', errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isMember]);

  if (isMember) {
    const statusConfig = {
      VERIFIED: { label: 'Đã xác minh', color: '#16a34a', bg: '#dcfce7' },
      PENDING: { label: 'Chờ xác minh', color: '#f59e0b', bg: '#fef3c7' },
      LOCKED: { label: 'Tạm khóa', color: '#ef4444', bg: '#fee2e2' },
      DECEASED: { label: 'Đã mất', color: '#6b7280', bg: '#f1f5f9' },
    };
    const statusInfo = statusConfig[user?.status] || {
      label: 'Chưa cập nhật',
      color: '#64748b',
      bg: '#f1f5f9',
    };
    const roleLabel = 'Cư dân (chưa thuộc hộ)';
    const steps = [
      'Liên hệ tổ trưởng để được thêm vào hộ gia đình.',
      'Chuẩn bị CCCD và thông tin cư trú để xác minh.',
      'Sau khi được thêm vào hộ, bạn sẽ xem được khoản nộp và lịch sử.',
    ];

    return (
      <Box className="vim-page" sx={{ p: { xs: 2, md: 4 } }}>
        <GreetingHeader userName={user?.name} />

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={7}>
            <Paper
              sx={{
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                height: '100%',
              }}
            >
              <Box
                sx={{
                  p: 3,
                  background: 'linear-gradient(135deg, #e2e8f0 0%, #f8fafc 100%)',
                  borderBottom: '1px solid #e2e8f0',
                }}
              >
                <Typography sx={{ fontSize: '20px', fontWeight: 600, color: '#1e293b' }}>
                  Trạng thái tài khoản
                </Typography>
                <Typography sx={{ fontSize: '14px', color: '#64748b', mt: 0.5 }}>
                  Bạn chưa được liên kết vào hộ gia đình.
                </Typography>
              </Box>

              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 2,
                      py: 1.25,
                      borderRadius: '12px',
                      bgcolor: statusInfo.bg,
                      border: `1px solid ${statusInfo.color}33`,
                    }}
                  >
                    <ShieldCheck size={18} color={statusInfo.color} />
                    <Box>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        Trạng thái
                      </Typography>
                      <Typography sx={{ fontWeight: 600, color: statusInfo.color }}>
                        {statusInfo.label}
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 2,
                      py: 1.25,
                      borderRadius: '12px',
                      bgcolor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <User size={18} color="#2563eb" />
                    <Box>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        Vai trò
                      </Typography>
                      <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>
                        {roleLabel}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box
                  sx={{
                    mt: 3,
                    p: 2.5,
                    borderRadius: '14px',
                    bgcolor: '#eef2ff',
                    border: '1px solid #c7d2fe',
                  }}
                >
                  <Typography sx={{ fontWeight: 600, color: '#1e293b', mb: 0.5 }}>
                    Quyền truy cập hiện tại
                  </Typography>
                  <Typography sx={{ color: '#475569', fontSize: '14px' }}>
                    Bạn có thể xem và cập nhật thông tin cá nhân, quản lý cài đặt tài khoản.
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper
              sx={{
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                height: '100%',
              }}
            >
              <Box
                sx={{
                  p: 3,
                  background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                  borderBottom: '1px solid #f1e1a6',
                }}
              >
                <Typography sx={{ fontSize: '20px', fontWeight: 600, color: '#1e293b' }}>
                  Bước tiếp theo
                </Typography>
                <Typography sx={{ fontSize: '14px', color: '#7c6f3f', mt: 0.5 }}>
                  Hoàn tất liên kết hộ để mở khóa tính năng.
                </Typography>
              </Box>

              <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {steps.map((step, index) => (
                  <Box key={step} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        bgcolor: '#f59e0b',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '14px',
                        flexShrink: 0,
                      }}
                    >
                      {index + 1}
                    </Box>
                    <Typography sx={{ color: '#475569', fontSize: '14px' }}>
                      {step}
                    </Typography>
                  </Box>
                ))}

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<UserPlus size={18} />}
                    onClick={() => navigate('/member/profile')}
                    sx={{
                      textTransform: 'none',
                      borderRadius: '10px',
                      backgroundColor: '#2563eb',
                      '&:hover': { backgroundColor: '#1d4ed8' },
                    }}
                  >
                    Cập nhật hồ sơ
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Settings size={18} />}
                    onClick={() => navigate('/member/setting')}
                    sx={{
                      textTransform: 'none',
                      borderRadius: '10px',
                      borderColor: '#cbd5f5',
                      color: '#1e293b',
                      '&:hover': { borderColor: '#94a3b8', backgroundColor: '#f8fafc' },
                    }}
                  >
                    Cài đặt tài khoản
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <PersonalInfo user={user} />
      </Box>
    );
  }

  // Chuẩn bị dữ liệu cho các components
  const quickStats = [
    {
      icon: <Home size={32} />,
      label: 'Mã hộ gia đình',
      value: stats?.household?.householdId || '--',
      color: '#2563eb',
    },
    {
      icon: <Users size={32} />,
      label: 'Số thành viên',
      value: stats?.members || '--',
      color: '#16a34a',
    },
    {
      icon: <Wallet size={32} />,
      label: 'Số tiền cần đóng (VNĐ)',
      value: stats?.finance?.total_unpaid != null
        ? stats.finance.total_unpaid.toLocaleString('vi-VN')
        : '--',
      color: '#ea580c',
    },
    {
      icon: <Clock size={32} />,
      label: 'Yêu cầu chờ duyệt',
      value: stats?.pending_requests ?? '--',
      color: '#7c3aed',
    },
  ];

  const paymentData = [
    { 
      name: 'Đã đóng', 
      value: stats?.payment_stats?.paid || 0, 
      color: '#16a34a' 
    },
    { 
      name: 'Chưa đóng', 
      value: stats?.payment_stats?.unpaid || 0, 
      color: '#ef4444' 
    },
  ];

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Nếu user chưa thuộc hộ gia đình nào (MEMBER role)
  if (error && (error.includes('chưa thuộc hộ') || error.includes('chưa thuộc hộ gia đình'))) {
    return (
      <Box className="vim-page" sx={{ p: { xs: 2, md: 4 } }}>
        <GreetingHeader userName={user?.name} />
        
        <Alert severity="info" sx={{ mb: 4 }}>
          <strong>Bạn chưa thuộc hộ gia đình nào</strong><br />
          Vui lòng liên hệ với Ban quản lý để được thêm vào hộ gia đình. 
          Sau khi được thêm vào hộ, bạn sẽ có thể xem đầy đủ thông tin và thống kê về hộ gia đình của mình.
        </Alert>
        
        <PersonalInfo user={user} />
      </Box>
    );
  }

  // Nếu có lỗi khác (không phải chưa thuộc hộ)
  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  // Dashboard đầy đủ cho user có hộ gia đình
  return (
    <Box className="vim-page" sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header chào mừng */}
      <GreetingHeader userName={user?.name} />

      {/* 4 Cards thống kê nhanh */}
      <QuickStatsCards statsData={quickStats} />

      {/* Grid 2 cột: Biểu đồ thanh toán + Thông tin hộ */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <PaymentChart paymentData={paymentData} />
        <HouseholdInfo 
          householdData={stats?.household} 
          financeData={stats?.finance}
          membersCount={stats?.members}
        />
      </Grid>

      {/* Thông tin cá nhân */}
      <PersonalInfo user={user} />
    </Box>
  );
}

export default UserDashboard;
