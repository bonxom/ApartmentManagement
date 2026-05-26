import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

/**
 * Custom hook để navigate với role-specific prefix tự động
 * 
 * @returns {Function} navigateWithRole - Function để navigate với prefix tự động
 * @returns {String} rolePrefix - Prefix hiện tại của user (/member, /leader, /accountant)
 * 
 * @example
 * const { navigateWithRole, rolePrefix } = useRoleNavigation();
 * navigateWithRole('/dashboard'); // Tự động thành /member/dashboard hoặc /leader/dashboard
 * navigateWithRole('/profile'); // Tự động thành /member/profile hoặc /accountant/profile
 */
export const useRoleNavigation = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  // Xác định prefix dựa trên role
  const getRolePrefix = () => {
    const roleName = user?.role?.role_name;
    
    switch(roleName) {
      case 'MEMBER':
      case 'HOUSE MEMBER':
        return '/member';
      case 'HAMLET LEADER':
        return '/leader';
      case 'ACCOUNTANT':
        return '/accountant';
      default:
        return '';
    }
  };
  
  const rolePrefix = getRolePrefix();
  
  /**
   * Navigate với prefix tự động
   * @param {String} path - Đường dẫn tương đối (vd: '/dashboard', '/profile')
   * @param {Object} options - Options cho navigate (vd: { replace: true })
   */
  const navigateWithRole = (path, options = {}) => {
    // Nếu path đã có prefix hoặc là absolute path, giữ nguyên
    if (path.startsWith('/member') || 
        path.startsWith('/leader') || 
        path.startsWith('/accountant') ||
        path.startsWith('/signin') ||
        path.startsWith('/signup') ||
        path.startsWith('/home') ||
        path === '/') {
      navigate(path, options);
    } else {
      // Thêm rolePrefix vào path
      const fullPath = `${rolePrefix}${path.startsWith('/') ? path : '/' + path}`;
      navigate(fullPath, options);
    }
  };
  
  return { navigateWithRole, rolePrefix };
};

export default useRoleNavigation;
