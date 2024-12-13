// src/components/ThemeProvider.tsx
"use client";

import React, { useMemo } from "react";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useLocalStorage } from "usehooks-ts"; // Optional: for saving dark mode preference across sessions

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [darkMode] = useLocalStorage<boolean>("darkMode", false); // Save dark mode state
  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode: darkMode ? "dark" : "light", // Switch between dark and light mode
        primary: {
          main: "#1976d2", // Blue primary color
        },
        background: {
          default: darkMode ? "#121212" : "#fafafa", // Dark background for dark mode
          paper: darkMode ? "#1e1e1e" : "#ffffff", // Slightly lighter background for paper elements
        },
        text: {
          primary: darkMode ? "#ffffff" : "#000000", // White text for dark mode, black for light mode
          secondary: darkMode ? "#b0bec5" : "#757575", // Secondary text color for dark mode
        },
      },
      typography: {
        h4: {
          color: darkMode ? "#ffffff" : "#000000", // Text color for headers
        },
        body1: {
          color: darkMode ? "#ffffff" : "#000000", // Text color for body
        },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              backgroundColor: darkMode ? "#1976d2" : "#3f51b5", // Blue button background
              color: "#ffffff", // White text on buttons
              "&:hover": {
                backgroundColor: darkMode ? "#1565c0" : "#303f9f", // Darker blue on hover
              },
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundColor: darkMode ? "#333333" : "#ffffff", // Dark app bar in dark mode
            },
          },
        },
        MuiBottomNavigation: {
          styleOverrides: {
            root: {
              backgroundColor: darkMode ? "#333333" : "#ffffff", // Bottom nav bar background
            },
          },
        },
      },
    });
  }, [darkMode]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline /> {/* Apply baseline styles for dark mode */}
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeProvider;
