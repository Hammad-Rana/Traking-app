import React, { useState, useRef, useEffect } from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Circle,
  Text,
  Rect,
  Line,
  Group,
  Tag,
  Label,
} from "react-konva";
import useDeviceStore from "./hooks/useDeviceStore";
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
  const imageRef = useRef(null);
  const [tagImage, setTagImage] = useState(null);
  const [anchorImage, setAnchorImage] = useState(null);

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
    const newX = e.target.x();
    const newY = e.target.y();
    const deltaX = newX - boundary.x;
    const deltaY = newY - boundary.y;

    setBoundary({ ...boundary, x: newX, y: newY });
    setBlueprintPosition({ x: newX, y: newY });

    // setDevices(
    //   devices.map((device) => ({
    //     ...device,
    //     x: device.x + deltaX / 50,
    //     y: device.y + deltaY / 50,
    //   }))
    // );
  };

  // Handle device drag
  const handleDragMove = (e, id) => {
    const newX = e.target.x() / 50;
    const newY = e.target.y() / 50;
    setDevices(
      devices.map((d) => (d.id === id ? { ...d, x: newX, y: newY } : d))
    );
  };

  // Handle boundary drag
  const handleBoundaryDrag = (e) => {
    const newX = e.target.x();
    const newY = e.target.y();
    const deltaX = newX - boundary.x;
    const deltaY = newY - boundary.y;

    setBoundary({ ...boundary, x: newX, y: newY });
    setBlueprintPosition({ x: newX, y: newY });

    setDevices(
      devices.map((device) => ({
        ...device,
        x: device.x + deltaX / 50,
        y: device.y + deltaY / 50,
      }))
    );
  };

  // Handle boundary resize
  const handleBoundaryResize = (e, corner) => {
    const { x, y } = e.target.position();
    const newBoundary = { ...boundary };
  
    if (corner === "topLeft") {
      newBoundary.width += boundary.x - x;
      newBoundary.height += boundary.y - y;
      newBoundary.x = x;
      newBoundary.y = y;
    } else if (corner === "topRight") {
      newBoundary.width = x - boundary.x;
      newBoundary.height += boundary.y - y;
      newBoundary.y = y;
    } else if (corner === "bottomLeft") {
      newBoundary.width += boundary.x - x;
      newBoundary.height = y - boundary.y;
      newBoundary.x = x;
    } else if (corner === "bottomRight") {
      newBoundary.width = x - boundary.x;
      newBoundary.height = y - boundary.y;
    }
  
    setBoundary(newBoundary);
    setBlueprintPosition({ x: newBoundary.x, y: newBoundary.y });
  
    if (imageRef.current) {
      imageRef.current.width(newBoundary.width);
      imageRef.current.height(newBoundary.height);
      imageRef.current.getLayer().batchDraw();
    }
  
    const widthScale = newBoundary.width / boundary.width;
    const heightScale = newBoundary.height / boundary.height;
  
    // setDevices(
    //   devices.map((device) => ({
    //     ...device,
    //     x: device.x * widthScale,
    //     y: device.y * heightScale,
    //   }))
    // );
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
    setStageX(
      -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale
    );
    setStageY(
      -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
    );
  };

  const renderGrid = () => {
    const gridSize = 50;
    const gridLines = [];
    const numLines = 100;

    for (let i = -numLines * gridSize; i <= numLines * gridSize; i += gridSize) {
      gridLines.push(
        <Line
          key={`vertical-${i}`}
          points={[i, -numLines * gridSize, i, numLines * gridSize]}
          stroke="#ddd"
          strokeWidth={1 / stageScale}
        />
      );
    }
    for (let j = -numLines * gridSize; j <= numLines * gridSize; j += gridSize) {
      gridLines.push(
        <Line
          key={`horizontal-${j}`}
          points={[-numLines * gridSize, j, numLines * gridSize, j]}
          stroke="#ddd"
          strokeWidth={1 / stageScale}
        />
      );
    }

    return gridLines;
  };

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
          <KonvaImage
            ref={imageRef}
            image={blueprint}
            x={boundary.x}
            y={boundary.y}
            width={boundary.width}
            height={boundary.height}
            draggable
            onDragMove={handleBlueprintDrag}
          />
        )}

        {/* Boundary Box */}
        {/* <Rect
          x={boundary.x}
          y={boundary.y}
          width={boundary.width}
          height={boundary.height}
          stroke="green"
          strokeWidth={2 / stageScale}
          dash={[4 / stageScale, 4 / stageScale]}
          draggable={false}
          listening={false}
          onDragMove={handleBoundaryDrag}
        /> */}

        {/* Resize Handles - now properly scaled */}
     {/* Resize Handles - now with 4 corners */}
<Circle
  x={boundary.x}
  y={boundary.y}
  radius={6 / stageScale}
  fill="green"
  draggable
  onDragMove={(e) => handleBoundaryResize(e, "topLeft")}
/>
<Circle
  x={boundary.x + boundary.width}
  y={boundary.y}
  radius={6 / stageScale}
  fill="green"
  draggable
  onDragMove={(e) => handleBoundaryResize(e, "topRight")}
/>
<Circle
  x={boundary.x + boundary.width}
  y={boundary.y + boundary.height}
  radius={6 / stageScale}
  fill="green"
  draggable
  onDragMove={(e) => handleBoundaryResize(e, "bottomRight")}
/>
<Circle
  x={boundary.x}
  y={boundary.y + boundary.height}
  radius={6 / stageScale}
  fill="green"
  draggable
  onDragMove={(e) => handleBoundaryResize(e, "bottomLeft")}
/>

        {/* Devices */}
        {devices &&
          devices
            .filter((device) => visibility[device.type])
            .map((device) => {
              const isOutside =
                device.x * 50 < boundary.x ||
                device.y * 50 < boundary.y ||
                device.x * 50 > boundary.x + boundary.width ||
                device.y * 50 > boundary.y + boundary.height;

              return (
                <React.Fragment key={device.id}>
                  <Group
                    draggable
                    x={device.x * 50}
                    y={device.y * 50}
                    onClick={() => {
                      setSelectedDevice(device);
                    }}
                    onDragMove={(e) => handleDragMove(e, device.id)}
                  >
                    <KonvaImage
                      x={-10}
                      y={-10}
                      width={20}
                      height={20}
                      image={device.type === "anchor" ? anchorImage : tagImage}
                      opacity={isOutside ? 0.3 : 1}
                      shadowColor={
                        selectedDevice?.id === device.id ? "yellow" : "black"
                      }
                      shadowBlur={10}
                    />

                    <Label x={10} y={-25}>
                      <Tag fill="gray" cornerRadius={5} opacity={0.8} />
                      <Text
                        text={`${device.name}\n x:${Number(device.x).toFixed(
                          2
                        )} y:${Number(device.y).toFixed(2)}`}
                        fontSize={12}
                        fill="white"
                        padding={5}
                        align="left"
                      />
                    </Label>
                  </Group>
                </React.Fragment>
              );
            })}
      </Layer>
    </Stage>
  );
};

export default BlueprintCanvas;