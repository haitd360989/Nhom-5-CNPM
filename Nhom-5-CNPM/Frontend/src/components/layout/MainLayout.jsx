import { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Sidebar, { WIDTH } from "./Sidebar.jsx";
export default function MainLayout() {
  const [open, setOpen] = useState(false);
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Header toggle={() => setOpen(!open)} />
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${WIDTH}px)` },
          p: { xs: 2, sm: 3 },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
