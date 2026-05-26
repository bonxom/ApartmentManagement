import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Box, TextField, Button, Typography, Alert, InputAdornment
} from '@mui/material'
import { Lock, User } from 'lucide-react'
import useAuthStore from '../../store/authStore'

function SignInLeader() {
  const navigate = useNavigate()
  const { signIn, isLoading, error: authError } = useAuthStore()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({})

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
      const result = await signIn({
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        // Kiểm tra role có phải là LEADER không
        console.log('[SignIn Leader] Full result:', result);
        console.log('[SignIn Leader] User object:', result.user);
        console.log('[SignIn Leader] Role object:', result.user?.role);
        const userRole = result.user?.role?.role_name;
        console.log('[SignIn Leader] User role:', userRole);
        
        if (userRole !== 'HAMLET LEADER') {
          setErrors({ 
            email: userRole === 'MEMBER' 
              ? 'Tài khoản này là Dân cư. Vui lòng sử dụng trang đăng nhập cho Dân cư.'
              : userRole === 'ACCOUNTANT'
              ? 'Tài khoản này là Kế toán. Vui lòng sử dụng trang đăng nhập cho Kế toán.'
              : `Tài khoản không có quyền đăng nhập vào form này. (Role: ${userRole})`
          });
          return;
        }
        
        navigate('/leader/dashboard');
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

  return (
    <Box>
      <Box className="signin-form-header">
        <Typography variant="h4" className="signin-title">
          Đăng nhập Tổ trưởng
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
          placeholder="leader@example.com"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <User size={20} />
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
  );
}

export default SignInLeader;
