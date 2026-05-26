import { Alert, Box } from '@mui/material'
import { ShieldAlert } from 'lucide-react'
import useAuthStore from '../store/authStore'

function RequirePermission({ 
  permission, 
  permissions, 
  requireAll = false, 
  fallback = null,
  children 
}) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useAuthStore()
  
  let hasAccess = false
  
  if (permission) {
    // Kiểm tra một quyền
    hasAccess = hasPermission(permission)
  } else if (permissions && permissions.length > 0) {
    // Kiểm tra nhiều quyền
    hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions)
  }
  
  if (!hasAccess) {
    if (fallback) {
      return fallback
    }
    
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="warning" 
          icon={<ShieldAlert size={24} />}
          sx={{ maxWidth: 600, mx: 'auto' }}
        >
          <strong>Không có quyền truy cập</strong>
          <br />
          Bạn không có quyền để xem nội dung này.
        </Alert>
      </Box>
    )
  }
  
  return children
}

export default RequirePermission