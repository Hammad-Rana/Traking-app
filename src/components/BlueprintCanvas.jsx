import React, { useState } from "react";
import { Stage, Layer, Image, Circle, Text, Rect, Line } from "react-konva";
import useDeviceStore from "./hooks/useDeviceStore";
import useLoadData from "./hooks/useLoadData";

const BlueprintCanvas = () => {
  const {
    blueprint,
    setBlueprint,
    blueprintPosition,
    setBlueprintPosition,
    devices,
    setDevices,
    canvasSize,
    zoomLevel,
    visibility,
    boundary,
    setBoundary,
    selectedDevice,
    setSelectedDevice,
  } = useDeviceStore();
  const [hoveredDevice, setHoveredDevice] = useState(null);
  useLoadData();

  const handleDragMove = (e, id) => {
    const newX = e.target.x() / 50;
    const newY = e.target.y() / 50;
    setDevices(devices.map((d) => (d.id === id ? { ...d, x: newX, y: newY } : d)));
  };

  const handleBoundaryDrag = (e) => {
    setBoundary({ ...boundary, x: e.target.x(), y: e.target.y() });
  };

  const handleBoundaryResize = (e, corner) => {
    const { x, y } = e.target.position();
    const newBoundary = { ...boundary };

    if (corner === "topLeft") {
      newBoundary.x = x;
      newBoundary.y = y;
      newBoundary.width += boundary.x - x;
      newBoundary.height += boundary.y - y;
    } else if (corner === "bottomRight") {
      newBoundary.width = x - boundary.x;
      newBoundary.height = y - boundary.y;
    }

    setBoundary(newBoundary);
  };

  const handleBlueprintDrag = (e) => {
    setBlueprintPosition({
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const renderGrid = () => {
    const gridSize = 50;
    const gridLines = [];
    for (let i = 0; i < canvasSize.width; i += gridSize) {
      gridLines.push(
        <Line key={`vertical-${i}`} points={[i, 0, i, canvasSize.height]} stroke="#ddd" strokeWidth={1} />
      );
    }
    for (let j = 0; j < canvasSize.height; j += gridSize) {
      gridLines.push(
        <Line key={`horizontal-${j}`} points={[0, j, canvasSize.width, j]} stroke="#ddd" strokeWidth={1} />
      );
    }
    return gridLines;
  };

  return (
    <Stage width={canvasSize.width} height={canvasSize.height} scaleX={zoomLevel} scaleY={zoomLevel}>
      <Layer>
        {renderGrid()}
        {blueprint && (
          <Image
            image={blueprint}
            x={blueprintPosition.x}
            y={blueprintPosition.y}
            width={canvasSize.width}
            height={canvasSize.height}
            draggable
            onDragMove={handleBlueprintDrag}
          />
        )}
        <Rect
          x={boundary.x}
          y={boundary.y}
          width={boundary.width}
          height={boundary.height}
          stroke="green"
          strokeWidth={2}
          dash={[4, 4]}
          draggable
          onDragMove={handleBoundaryDrag}
        />
        <Circle x={boundary.x} y={boundary.y} radius={6} fill="green" draggable onDragMove={(e) => handleBoundaryResize(e, "topLeft")} />
        <Circle x={boundary.x + boundary.width} y={boundary.y + boundary.height} radius={6} fill="green" draggable onDragMove={(e) => handleBoundaryResize(e, "bottomRight")} />
        {devices
          .filter((device) => visibility[device.type])
          .map((device) => {
            const isOutside =
              device.x * 50 < boundary.x ||
              device.y * 50 < boundary.y ||
              device.x * 50 > boundary.x + boundary.width ||
              device.y * 50 > boundary.y + boundary.height;

            return (
              <React.Fragment key={device.id}>
                <Circle
                  x={device.x * 50}
                  y={device.y * 50}
                  radius={10}
                  fill={device.type === "anchor" ? "red" : "blue"}
                  opacity={isOutside ? 0.3 : 1}
                  draggable
                  onDragMove={(e) => handleDragMove(e, device.id)}
                  onMouseEnter={() => setHoveredDevice(device)}
                  onMouseLeave={() => setHoveredDevice(null)}
                  onClick={() => setSelectedDevice(device)}
                  shadowColor={selectedDevice?.id === device.id ? "yellow" : "black"}
                  shadowBlur={10}
                />
                <Text x={device.x * 50 + 15} y={device.y * 50} text={device.name} fontSize={12} fill="black" />
              </React.Fragment>
            );
          })}
      </Layer>
    </Stage>
  );
};

export default BlueprintCanvas;