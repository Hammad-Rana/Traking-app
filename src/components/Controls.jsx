import React, { useState, useEffect } from "react";
import { Button, Box, Typography, FormControlLabel, Checkbox, Switch, Divider, TextField, Slider } from "@mui/material";
import useDeviceStore from "./hooks/useDeviceStore";
import FileUploader from "./FileUploader";
import useLoadData from "./hooks/useLoadData";

const Controls = () => {
  const {
    endLocation,
    setEndLocation,
    moveTagToEndLocation,
    setZoomLevel,
    toggleVisibility,
    visibility,
    devices,
    setDevices,
    selectedDevice,
    themeMode,
    toggleTheme,
    boundary
  } = useDeviceStore();

  const [endX, setEndX] = useState("");
  const [endY, setEndY] = useState("");
  const [boxSize, setBoxSize] = useState(4); // Initial box size

  // Automatically set the initial position when selectedDevice changes
  useEffect(() => {
    if (selectedDevice) {
      // Set the initial position of the selected device
      setEndX(selectedDevice.x.toString());
      setEndY(selectedDevice.y.toString());
    }
  }, [selectedDevice]);
  const setOrigin = (newBoxSize = boxSize) => {
    if (!selectedDevice) return;
  
    const baseX = selectedDevice.x;
    const baseY = selectedDevice.y;
  
    let cols = Math.ceil(Math.sqrt(devices.filter(d => d.type === "anchor").length)); // Grid columns
    let rows = Math.ceil(devices.filter(d => d.type === "anchor").length / cols); // Grid rows
  
    let usedPositions = new Set();
    usedPositions.add(`${baseX.toFixed(2)},${baseY.toFixed(2)}`); // Ensure selectedDevice stays in place
  
    let index = 0;
  
    const generateBoxPosition = () => {
      let x, y;
      do {
        x = baseX + (index % cols) * newBoxSize; // Move to the right
        y = baseY + Math.floor(index / cols) * newBoxSize - (rows * newBoxSize) / 2; // Keep vertical centering
        index++;
      } while (usedPositions.has(`${x.toFixed(2)},${y.toFixed(2)}`)); // Ensure unique position
  
      usedPositions.add(`${x.toFixed(2)},${y.toFixed(2)}`);
      return { x, y };
    };
  
    const updatedDevices = devices.map((device) => {
      if (device.id === selectedDevice.id) {
        return device; // Keep selectedDevice unchanged
      }
      if (device.type === "anchor") {
        return {
          ...device,
          ...generateBoxPosition(),
        };
      }
      return device;
    });
  
    setDevices(updatedDevices);
  };
  
  

  const handleBoxSizeChange = (event, newValue) => {
    setBoxSize(newValue);
    setOrigin(newValue); // Update the positions immediately when the slider changes
  };

  const handleSetEndLocation = () => {
    if (!endX || !endY) return;
    setEndLocation({ x: parseFloat(endX), y: parseFloat(endY) });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2, width: "25%", height: "100vh", overflowY: "auto" }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>Controls</Typography>
      <FileUploader />
      <Button variant="contained" color="primary" onClick={() => setOrigin()} fullWidth>
        Set Origin ({selectedDevice ? Number(selectedDevice.x).toFixed(2) : "0"},
        {selectedDevice ? Number(selectedDevice.y).toFixed(2) : "0"})
      </Button>
      <Typography variant="h6" sx={{ mt: 2 }}>Anchor Spacing</Typography>
      <Slider
        value={boxSize}
        onChange={handleBoxSizeChange}
        aria-labelledby="box-size-slider"
        valueLabelDisplay="auto"
        min={1}
        max={10}
        step={0.5}
      />
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
          <TextField
            label="End X"
            type="number"
            value={endX}
            onChange={(e) => setEndX(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="End Y"
            type="number"
            value={endY}
            onChange={(e) => setEndY(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleSetEndLocation} fullWidth sx={{ mt: 2 }}>
            Set End Location
          </Button>
          <Button variant="contained" color="secondary" onClick={moveTagToEndLocation} fullWidth sx={{ mt: 2 }}>
            Move Tag to End Location
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Controls;