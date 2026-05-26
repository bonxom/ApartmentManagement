import { BrowserRouter as Router, Routes } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import AppRouters from "./routes/AppRouters";
import { useMemo } from "react";
import useThemeStore from "./store/themeStore";
import "./App.css";

function App() {
  const { mode } = useThemeStore();

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#118ab2",
            dark: "#0a5f82",
            light: "#dff4fb",
          },
          secondary: {
            main: "#2a9d8f",
          },
          background: {
            default: mode === "dark" ? "#0f172a" : "#f6f8fc",
            paper: mode === "dark" ? "#1e293b" : "#ffffff",
          },
          text: {
            primary: mode === "dark" ? "#f8fafc" : "#0f172a",
            secondary: mode === "dark" ? "#cbd5e1" : "#475569",
          },
        },
        typography: {
          fontFamily: [
            "Manrope",
            "Be Vietnam Pro",
            "sans-serif",
          ].join(","),
          h5: {
            fontWeight: 700,
          },
          h6: {
            fontWeight: 700,
          },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 14,
                boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 10,
              },
            },
          },
          MuiTextField: {
            defaultProps: {
              size: "small",
              fullWidth: true,
            },
          },
          MuiTableHead: {
            styleOverrides: {
              root: {
                backgroundColor: mode === "dark" ? "#1f2937" : "#f1f5f9",
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>{AppRouters}</Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
