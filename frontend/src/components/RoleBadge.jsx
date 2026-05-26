import { Chip } from '@mui/material'
import { Crown, Calculator, Home, User } from 'lucide-react'
import { ROLES, ROLE_DESCRIPTIONS } from '../constants/roles'

const roleConfig = {
  [ROLES.TDANPHO]: {
    color: 'error',
    icon: Crown,
    bgcolor: '#d32f2f',
  },
  [ROLES.KIEMTOAN]: {
    color: 'warning',
    icon: Calculator,
    bgcolor: '#ed6c02',
  },
  [ROLES.CHUHO]: {
    color: 'info',
    icon: Home,
    bgcolor: '#0288d1',
  },
  [ROLES.CUDAN]: {
    color: 'default',
    icon: User,
    bgcolor: '#757575',
  },
}

function RoleBadge({ role, size = 'medium' }) {
  const config = roleConfig[role] || roleConfig[ROLES.CUDAN]
  const Icon = config.icon

  return (
    <Chip
      icon={<Icon size={16} />}
      label={ROLE_DESCRIPTIONS[role] || 'Không xác định'}
      color={config.color}
      size={size}
      sx={{
        fontWeight: 600,
        '& .MuiChip-icon': {
          color: 'inherit',
        },
      }}
    />
  )
}

export default RoleBadge