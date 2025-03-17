import React from "react";
import { Button, Box, Typography, Container, FormControlLabel, Checkbox, Slider, Tooltip, Switch, Paper, Divider } from "@mui/material";
import useDeviceStore from "./hooks/useDeviceStore";
import FileUploader from "./FileUploader";

const Controls = () => {
  const { zoomLevel, setZoomLevel, toggleVisibility, visibility, devices, setDevices, selectedDevice, themeMode, toggleTheme } = useDeviceStore();

  const setOrigin = () => {
    if (devices.length === 0) return;

    const originDevice = devices.find((d) => d.type === "anchor") || devices[0];
    if (!originDevice) return;

    const { x: originX, y: originY } = originDevice;

    const adjustedDevices = devices.map((device) => ({
      ...device,
      x: device.x - originX,
      y: device.y - originY,
    }));

    setDevices(adjustedDevices);
  };

  const resetZoom = () => {
    setZoomLevel(1);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2, width: "25%", height: "100vh", overflowY: "auto" }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>Controls</Typography>
      <FileUploader />
      <Button variant="contained" color="primary" onClick={setOrigin} fullWidth>
        Set Origin (0,0)
      </Button>
      <Tooltip title="Zoom Level">
        <Slider
          value={zoomLevel}
          onChange={(e, value) => setZoomLevel(value)}
          min={0.5}
          max={2}
          step={0.1}
          valueLabelDisplay="auto"
        />
      </Tooltip>
      <Button variant="contained" color="secondary" onClick={resetZoom} fullWidth>
        Reset Zoom
      </Button>
      <FormControlLabel control={<Switch checked={themeMode === "dark"} onChange={toggleTheme} />} label="Dark Mode" />
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6">Visibility</Typography>
      <FormControlLabel control={<Checkbox checked={visibility.anchor} onChange={() => toggleVisibility("anchor")} />} label="Show Anchors" />
      <FormControlLabel control={<Checkbox checked={visibility.tag} onChange={() => toggleVisibility("tag")} />} label="Show Tags" />
      <Divider sx={{ my: 2 }} />
      {selectedDevice && (
        <Box>
          <Typography variant="h6">Selected Device</Typography>
          <Typography>ID: {selectedDevice.id}</Typography>
          <Typography>Name: {selectedDevice.name}</Typography>
          <Typography>Type: {selectedDevice.type}</Typography>
          <Typography>Position: ({selectedDevice.x}, {selectedDevice.y})</Typography>
        </Box>
      )}
    </Box>
  );
};

export default Controls;