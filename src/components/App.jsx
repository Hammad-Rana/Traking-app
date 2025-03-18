import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import useDeviceStore from "./components/hooks/useDeviceStore";
import Controls from "./components/Controls";
import BlueprintCanvas from "./components/BlueprintCanvas";

const App = () => {
  const { themeMode } = useDeviceStore();
  const theme = createTheme({
    palette: {
      mode: themeMode,
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", height: "100vh", bgcolor: themeMode === "dark" ? "#121212" : "#fff", color: themeMode === "dark" ? "#fff" : "#000" }}>
        <Controls />
        <Box sx={{ flex: 1, overflow: "hidden" }}>
          <BlueprintCanvas />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;