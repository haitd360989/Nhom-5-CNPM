import { Button, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { HOMES } from "../../config/roles.js";
import { useAuth } from "../../contexts/AuthContext.jsx";
export default function UnauthorizedPage() {
  const { user } = useAuth(),
    navigate = useNavigate();
  return (
    <Paper sx={{ p: 5, textAlign: "center" }}>
      <Typography variant="h4">Không có quyền truy cập</Typography>
      <Typography color="text.secondary" my={2}>
        Vai trò hiện tại không được phép truy cập trang này.
      </Typography>
      <Button variant="contained" onClick={() => navigate(HOMES[user.role])}>
        Về trang tổng quan
      </Button>
    </Paper>
  );
}
