import { createTheme } from "@mui/material/styles";
export default createTheme({
  palette: {
    primary: { main: "#3157d5" },
    secondary: { main: "#10a37f" },
    background: { default: "#f5f7fb" },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: "Inter,system-ui,sans-serif",
    h4: { fontWeight: 750 },
    h6: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 650 },
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 10 } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
  },
});
