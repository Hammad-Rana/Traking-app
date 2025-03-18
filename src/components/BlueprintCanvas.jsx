import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Image as KonvaImage, Circle, Text, Rect, Line, Transformer } from "react-konva";
import useDeviceStore from "./hooks/useDeviceStore";
import useLoadData from "./hooks/useLoadData";

// Import your icons
import tagIcon from "./../assets/anchor.png";
import anchorIcon from "./../assets/tag.png";

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
  const [stageScale, setStageScale] = useState(1);
  const [stageX, setStageX] = useState(0);
  const [stageY, setStageY] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const imageRef = useRef(null);
  const transformerRef = useRef(null);
  const [tagImage, setTagImage] = useState(null);
  const [anchorImage, setAnchorImage] = useState(null);
  useLoadData();

  // Load the icons
  useEffect(() => {
    const loadImages = async () => {
      const tagImg = new window.Image();
      tagImg.src = tagIcon;
      tagImg.onload = () => setTagImage(tagImg);

      const anchorImg = new window.Image();
      anchorImg.src = anchorIcon;
      anchorImg.onload = () => setAnchorImage(anchorImg);
    };

    loadImages();
  }, []);

  // Handle blueprint drag
  const handleBlueprintDrag = (e) => {
    setBlueprintPosition({
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  // Handle device drag
  const handleDragMove = (e, id) => {
    const newX = e.target.x() / 50;
    const newY = e.target.y() / 50;
    setDevices(devices.map((d) => (d.id === id ? { ...d, x: newX, y: newY } : d)));
  };

  // Handle boundary drag
  const handleBoundaryDrag = (e) => {
    setBoundary({ ...boundary, x: e.target.x(), y: e.target.y() });
  };

  // Handle boundary resize
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

  // Handle zoom and pan
  const handleWheel = (e) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    setStageScale(newScale);
    setStageX(-(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale);
    setStageY(-(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale);
  };

  // Render grid lines
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

  // Update transformer when blueprint is selected
  useEffect(() => {
    if (selectedId === "blueprint" && transformerRef.current) {
      transformerRef.current.nodes([imageRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedId]);

  // Handle clicks outside the image
  useEffect(() => {
    const handleStageClick = (e) => {
      if (e.target === e.target.getStage()) {
        setSelectedId(null);
      }
    };

    const stage = imageRef.current?.getStage();
    if (stage) {
      stage.on('click', handleStageClick);
    }

    return () => {
      if (stage) {
        stage.off('click', handleStageClick);
      }
    };
  }, []);

  return (
    <Stage
      width={canvasSize.width}
      height={canvasSize.height}
      scaleX={stageScale}
      scaleY={stageScale}
      x={stageX}
      y={stageY}
      onWheel={handleWheel}
      draggable
    >
      <Layer>
        {/* Grid Lines */}
        {renderGrid()}

        {/* Blueprint Image */}
        {blueprint && (
          <>
            <KonvaImage
              ref={imageRef}
              image={blueprint}
              x={blueprintPosition.x}
              y={blueprintPosition.y}
              width={blueprint.width}
              height={blueprint.height}
              draggable
              onDragMove={handleBlueprintDrag}
              onClick={() => {
                setSelectedId("blueprint");
              }}
            />
            {selectedId === "blueprint" && (
              <Transformer
                ref={transformerRef}
                boundBoxFunc={(oldBox, newBox) => {
                  // Limit resizing to maintain aspect ratio
                  if (newBox.width < 50 || newBox.height < 50) {
                    return oldBox;
                  }
                  return newBox;
                }}
              />
            )}
          </>
        )}

        {/* Boundary Box */}
        <Rect
          x={boundary.x}
          y={boundary.y}
          width={boundary.width}
          height={boundary.height}
          stroke="green"
          strokeWidth={2}
          dash={[4, 4]}
          draggable={false} // Disable dragging
          listening={false} 
          onDragMove={handleBoundaryDrag}
        />

        {/* Resize Handles */}
        <Circle x={boundary.x} y={boundary.y} radius={6} fill="green" draggable onDragMove={(e) => handleBoundaryResize(e, "topLeft")} />
        <Circle x={boundary.x + boundary.width} y={boundary.y + boundary.height} radius={6} fill="green" draggable onDragMove={(e) => handleBoundaryResize(e, "bottomRight")} />

        {/* Devices */}
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
                <KonvaImage
                  x={device.x * 50 - 10} // Adjust position to center the icon
                  y={device.y * 50 - 10} // Adjust position to center the icon
                  width={20}
                  height={20}
                  image={device.type === "anchor" ? anchorImage : tagImage}
                  opacity={isOutside ? 0.3 : 1}
                  // draggable
                  onDragMove={(e) => handleDragMove(e, device.id)}
                  onMouseEnter={() => setHoveredDevice(device)}
                  onMouseLeave={() => setHoveredDevice(null)}
                  onClick={() => setSelectedDevice(device)}
                  shadowColor={selectedDevice?.id === device.id ? "yellow" : "black"}
                  shadowBlur={10}
                />
                {hoveredDevice?.id === device.id && (
                  <Text
                    x={device.x * 50 + 15}
                    y={device.y * 50 - 20}
                    text={`${device.name}\n(${device.x}, ${device.y})`}
                    fontSize={12}
                    fill="black"
                    padding={5}
                    align="center"
                    backgroundFill="white"
                  />
                )}
              </React.Fragment>
            );
          })}
      </Layer>
    </Stage>
  );
};

export default BlueprintCanvas;