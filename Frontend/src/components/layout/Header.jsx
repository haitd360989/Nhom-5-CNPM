import MenuIcon from "@mui/icons-material/MenuRounded";
import LogoutIcon from "@mui/icons-material/LogoutRounded";
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { WIDTH } from "./Sidebar.jsx";
export default function Header({ toggle }) {
  const { user, logout } = useAuth(),
    nav = useNavigate();
  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${WIDTH}px)` },
        ml: { md: `${WIDTH}px` },
        borderBottom: "1px solid #ddd",
      }}
    >
      <Toolbar>
        <IconButton onClick={toggle} sx={{ display: { md: "none" }, mr: 1 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" flexGrow={1}>
          Không gian học tập
        </Typography>
        <Box
          textAlign="right"
          sx={{ display: { xs: "none", sm: "block" }, mr: 1 }}
        >
          <Typography variant="body2" fontWeight={700}>
            {user.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user.role}
          </Typography>
        </Box>
        <Avatar sx={{ bgcolor: "primary.main" }}>{user.name[0]}</Avatar>
        <IconButton
          onClick={() => {
            logout();
            nav("/login");
          }}
        >
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
