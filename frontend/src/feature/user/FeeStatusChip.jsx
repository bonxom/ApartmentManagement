import { Chip } from "@mui/material";

const statusMap = {
  UNPAID: { label: "Chưa nộp", color: "error" },
  PARTIAL: { label: "Đóng thiếu", color: "warning" },
  COMPLETED: { label: "Đã đủ", color: "success" },
  CONTRIBUTED: { label: "Đã đóng góp", color: "success" },
  NO_CONTRIBUTION: { label: "Chưa đóng góp", color: "default" },
};

export default function FeeStatusChip({ status }) {
  const { label, color } = statusMap[status] || { label: status || "N/A", color: "default" };
  return <Chip size="small" label={label} color={color} />;
}
