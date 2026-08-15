import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import { HOMES } from "../config/roles.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", full_name: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to={HOMES[user.role]} replace />;

  const update = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (isRegister) await register(form);
      navigate(await login(form.email, form.password));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

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
      <Container maxWidth="xs">
        <Paper component="form" onSubmit={submit} sx={{ p: 4 }}>
          <Stack spacing={2}>
            <Typography variant="h4" textAlign="center">
              {isRegister ? "Tạo tài khoản" : "Đăng nhập"}
            </Typography>
            <Typography color="text.secondary" textAlign="center">
              Kết nối trực tiếp với backend và cơ sở dữ liệu
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {isRegister && (
              <TextField
                required
                name="full_name"
                label="Họ và tên"
                value={form.full_name}
                onChange={update}
              />
            )}
            <TextField
              required
              name="email"
              type="email"
              label="Email"
              value={form.email}
              onChange={update}
            />
            <TextField
              required
              name="password"
              type="password"
              label="Mật khẩu"
              inputProps={{ minLength: 8 }}
              value={form.password}
              onChange={update}
            />
            <Button
              disabled={busy}
              type="submit"
              variant="contained"
              size="large"
            >
              {busy
                ? "Đang xử lý..."
                : isRegister
                  ? "Đăng ký và đăng nhập"
                  : "Đăng nhập"}
            </Button>
            <Button
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
              }}
            >
              {isRegister
                ? "Đã có tài khoản? Đăng nhập"
                : "Chưa có tài khoản? Đăng ký"}
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
