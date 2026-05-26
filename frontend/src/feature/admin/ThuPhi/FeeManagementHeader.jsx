import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';

function FeeManagementHeader({ tab, setTab }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ mb: 2 }}
    >
      <Typography sx={{ fontSize: "26px", fontWeight: "600" }}>
        Quản lý khoản thu
      </Typography>

      <Box>
        <Button
          variant={tab === 0 ? "contained" : "outlined"}
          onClick={() => setTab(0)}
          sx={{
            backgroundColor: tab === 0 ? "#2D66F5" : "transparent",
            borderRadius: "8px",
            textTransform: "none",
            px: 3,
            py: 1,
            fontSize: "14px",
            fontWeight: "500",
            mr: 2,
            "&:hover": { backgroundColor: tab === 0 ? "#1E54D4" : "rgba(45, 102, 245, 0.04)" },
          }}
        >
          Danh sách khoản thu
        </Button>
        <Button
          variant={tab === 1 ? "contained" : "outlined"}
          onClick={() => setTab(1)}
          sx={{
            backgroundColor: tab === 1 ? "#2D66F5" : "transparent",
            borderRadius: "8px",
            textTransform: "none",
            px: 3,
            py: 1,
            fontSize: "14px",
            fontWeight: "500",
            "&:hover": { backgroundColor: tab === 1 ? "#1E54D4" : "rgba(45, 102, 245, 0.04)" },
          }}
        >
          Báo cáo thống kê
        </Button>
      </Box>
    </Stack>
  );
}

export default FeeManagementHeader;
