import AdminIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import TeacherIcon from "@mui/icons-material/SchoolRounded";
import StudentIcon from "@mui/icons-material/PersonRounded";
import ParentIcon from "@mui/icons-material/FamilyRestroomRounded";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import { HOMES, LABELS, ROLES } from "../config/roles.js";
import { useAuth } from "../context/AuthContext.jsx";

const choices = [
  [ROLES.ADMIN, AdminIcon, "Quản lý tài khoản và cấu hình hệ thống"],
  [ROLES.TEACHER, TeacherIcon, "Quản lý học liệu, câu hỏi và phân tích"],
  [ROLES.STUDENT, StudentIcon, "Học tập, luyện tập và theo dõi lộ trình"],
  [ROLES.PARENT, ParentIcon, "Theo dõi tiến độ của con (chỉ xem)"],
];

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  if (user) return <Navigate to={HOMES[user.role]} replace />;
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        py: 5,
        background:
          "radial-gradient(circle at 15% 15%,#e5eaff,transparent 35%),radial-gradient(circle at 85% 85%,#daf5ed,transparent 35%)",
      }}
    >
      <Container maxWidth="md">
        <Stack textAlign="center" alignItems="center" spacing={1} mb={4}>
          <Typography variant="h4">Chào mừng đến SWR-ACT</Typography>
          <Typography color="text.secondary">
            Chọn vai trò để đăng nhập giả lập và kiểm tra phân quyền
          </Typography>
        </Stack>
        <Grid container spacing={2}>
          {choices.map(([role, Icon, description]) => (
            <Grid key={role} size={{ xs: 12, sm: 6 }}>
              <Paper variant="outlined" sx={{ p: 3, height: "100%" }}>
                <Stack spacing={2}>
                  <Icon color="primary" fontSize="large" />
                  <Box>
                    <Typography variant="h6">{LABELS[role]}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {description}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    onClick={() => navigate(login(role))}
                  >
                    Đăng nhập {LABELS[role]}
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          textAlign="center"
          mt={3}
        >
          Demo frontend — không kết nối API hoặc cơ sở dữ liệu
        </Typography>
      </Container>
    </Box>
  );
}
