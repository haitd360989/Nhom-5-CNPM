import { Button, Container, Paper, Stack, Typography } from "@mui/material";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import PagePlaceholder from "./components/common/PagePlaceholder.jsx";
import MainLayout from "./components/layout/MainLayout.jsx";
import ProtectedRoute from "./features/auth/components/ProtectedRoute.jsx";
import RoleRoute from "./features/auth/components/RoleRoute.jsx";
import { HOMES } from "./features/auth/config/roles.js";
import { useAuth } from "./features/auth/context/AuthContext.jsx";
import LoginPage from "./features/auth/pages/LoginPage.jsx";
import { roleFeatures } from "./features/index.js";

function HomeRedirect() {
  const { user } = useAuth();
  return <Navigate to={user ? HOMES[user.role] : "/login"} replace />;
}
function AccessDenied() {
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
function featureRoutes(feature) {
  return (
    <Route
      key={feature.role}
      element={<RoleRoute allowedRoles={[feature.role]} />}
    >
      {feature.routes.map(([segment, title]) => (
        <Route
          key={segment || "home"}
          path={segment ? `${feature.prefix}/${segment}` : feature.prefix}
          element={
            <PagePlaceholder
              title={title}
              description="Nội dung minh họa cho khung giao diện G5PSC-18."
            />
          }
        />
      ))}
    </Route>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="unauthorized" element={<AccessDenied />} />
          {roleFeatures.map(featureRoutes)}
        </Route>
      </Route>
      <Route
        path="*"
        element={
          <Container sx={{ py: 10 }}>
            <Stack alignItems="center">
              <Typography variant="h1">404</Typography>
              <Button href="/">Về trang chủ</Button>
            </Stack>
          </Container>
        }
      />
    </Routes>
  );
}
