import { useState, useEffect } from 'react'
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom'
import {
  Box, TextField, Button, Typography, Alert, InputAdornment, IconButton
} from '@mui/material'
import { Lock, Users, Mail, UserPlus, Home } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import { signInSchema } from '../../hooks/validation'
import SignInLeader from './SignInLeader'
import SignInAccountant from './SignInAccountant'
import './style/SignIn.css' 

function SignIn() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, isLoading, error: authError } = useAuthStore()

  const initialMode = location.pathname === '/signin/leader' ? 'leader' 
    : location.pathname === '/signin/accountant' ? 'accountant' 
    : 'resident';
  
  const [mode, setMode] = useState(initialMode);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const newMode = location.pathname === '/signin/leader' ? 'leader'
      : location.pathname === '/signin/accountant' ? 'accountant'
      : 'resident';
    setMode(newMode);
  }, [location.pathname]);

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      signInSchema.parse(formData); 
      setErrors({});

      const result = await signIn({
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        // Kiểm tra role và navigate cho đúng
        console.log('[SignIn Resident] Full result:', result);
        console.log('[SignIn Resident] User object:', result.user);
        console.log('[SignIn Resident] Role object:', result.user?.role);
        const userRole = result.user?.role?.role_name;
        console.log('[SignIn Resident] User role:', userRole);
        
        if (userRole === 'HAMLET LEADER' || userRole === 'ACCOUNTANT') {
          // Nếu là Leader/Accountant đăng nhập từ form Dân cư, chọn form cho họ
          setErrors({ email: 'Vui lòng sử dụng form đăng nhập dành cho ' + (userRole === 'HAMLET LEADER' ? 'Tổ trưởng' : 'Kế toán') });
          return;
        }
        
        navigate('/member/dashboard');
      }
    } catch (err) {
      if (err.errors) {
        const formattedErrors = {}
        err.errors.forEach((error) => {
          formattedErrors[error.path[0]] = error.message
        })
        setErrors(formattedErrors)
      }
    }
  };

  const switchMode = (newMode) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setErrors({});
    
    setMode(newMode);
    if (newMode === 'leader') {
      navigate('/signin/leader', { replace: true });
    } else if (newMode === 'accountant') {
      navigate('/signin/accountant', { replace: true });
    } else {
      navigate('/signin', { replace: true });
    }
    
    setTimeout(() => setIsAnimating(false), 900);
  };
  return (
    <Box className="signin-page">
      {/* Home Button */}
      <IconButton 
        component={RouterLink}
        to="/"
        className="signin-home-btn"
        aria-label="Go to home"
      >
        <Home size={24} />
      </IconButton>

      {/* Background Decoration */}
      <Box className="signin-background">
        <Box className="signin-bg-blur signin-bg-blur-1" />
        <Box className="signin-bg-blur signin-bg-blur-2" />
      </Box>

      {/* Main Card */}
      <Box className="signin-card-container">
        {/* LEFT SIDE: Resident Login */}
        <Box className={`signin-form-side signin-form-left ${mode === 'resident' ? 'active' : ''}`}>
          <Box className="signin-form-header">
            <Typography variant="h4" className="signin-title">
              Đăng nhập Dân cư
            </Typography>
            <Typography className="signin-subtitle">
              Vui lòng nhập email và mật khẩu của bạn
            </Typography>
          </Box>

          {authError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {authError}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="signin-form">
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              placeholder="example@gmail.com"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={20} />
                  </InputAdornment>
                ),
              }}
              className="signin-input"
            />

            <TextField
              fullWidth
              label="Mật khẩu"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              placeholder="••••••••"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={20} />
                  </InputAdornment>
                ),
              }}
              className="signin-input"
            />

            <Box className="signin-form-options">
              <label className="signin-checkbox-label">
                <input type="checkbox" />
                Ghi nhớ đăng nhập
              </label>
              <Typography component={RouterLink} to="/forgot-password" className="signin-forgot-link">
                Quên mật khẩu?
              </Typography>
            </Box>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
              startIcon={<Lock />}
              className="signin-submit-btn"
            >
              {isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
            </Button>
          </form>
        </Box>

        {/* RIGHT SIDE: Leader/Accountant Login */}
        <Box className={`signin-form-side signin-form-right ${mode === 'leader' || mode === 'accountant' ? 'active' : ''}`}>
          {mode === 'leader' ? <SignInLeader /> : mode === 'accountant' ? <SignInAccountant /> : null}
        </Box>

        {/* THE SLIDING OVERLAY */}
        <Box className={`signin-overlay ${mode === 'resident' ? 'overlay-right' : 'overlay-left'}`}>
          {/* Overlay Background Decor */}
          <Box className="signin-overlay-blur signin-overlay-blur-1" />
          <Box className="signin-overlay-blur signin-overlay-blur-2" />

          {/* CONTENT: When Resident Login (Show Register + Role Options) */}
          <Box className={`signin-overlay-content ${mode === 'resident' ? 'active' : ''}`}>
            <Box className="signin-overlay-icon">
              <UserPlus size={40} />
            </Box>
            <Typography variant="h3" className="signin-overlay-title">
              Bạn là ai?
            </Typography>
            <Typography className="signin-overlay-subtitle">
              Chọn vai trò của bạn để đăng nhập
            </Typography>
            
            <Box className="signin-overlay-buttons">
              <Button 
                onClick={() => switchMode('leader')}
                className="signin-overlay-btn signin-overlay-btn-primary"
              >
                Tổ trưởng
              </Button>
              <Button 
                onClick={() => switchMode('accountant')}
                className="signin-overlay-btn signin-overlay-btn-secondary"
              >
                Kế toán
              </Button>
              <Button 
                component={RouterLink}
                to="/signup"
                className="signin-overlay-btn signin-overlay-btn-secondary"
              >
                Đăng ký tài khoản
              </Button>
            </Box>
          </Box>

          {/* CONTENT: When Leader/Accountant Login (Show Back to Resident) */}
          <Box className={`signin-overlay-content ${mode === 'leader' || mode === 'accountant' ? 'active' : ''}`}>
            <Box className="signin-overlay-icon">
              <Users size={40} />
            </Box>
            <Typography variant="h3" className="signin-overlay-title">
              Bạn là Dân cư?
            </Typography>
            <Typography className="signin-overlay-subtitle">
              Quay lại đăng nhập cho Dân cư
            </Typography>
            
            <Box sx={{ marginTop: '1.5rem' }}>
              <Button 
                onClick={() => switchMode('resident')}
                className="signin-overlay-btn signin-overlay-btn-primary"
              >
                Đăng nhập Dân cư
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default SignIn