import { Box, Typography } from "@mui/material";

export default function ProfileInfoField({ label, value }) {
    return (
        <Box sx={{ mb: 3 }}>
            <Typography 
                sx={{ 
                    fontSize: "13px", 
                    fontWeight: "500", 
                    mb: 1, 
                    color: "#666" 
                }}
            >
                {label}
            </Typography>
            <Typography 
                sx={{ 
                    fontSize: "15px", 
                    fontWeight: "400", 
                    color: "#333",
                    backgroundColor: "#F5F7FA",
                    padding: "12px 14px",
                    borderRadius: "8px"
                }}
            >
                {value || "Chưa cập nhật"}
            </Typography>
        </Box>
    );
}
