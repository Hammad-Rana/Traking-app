Blueprint Visualization App #https://traking-app-bdd13.web.app/
This application allows you to visualize and interact with devices (anchors and tags) on a blueprint image. You can upload a blueprint, adjust the zoom level, set the origin, and toggle the visibility of devices. The app also supports dark mode and provides a boundary box for defining areas of interest.

Features
Blueprint Upload:

Upload a blueprint image (JPEG, PNG, etc.) to visualize devices on it.

The blueprint can be dragged around the canvas for better positioning.

Device Visualization:

Devices are displayed as circles on the canvas.

Anchors are shown in red, and tags are shown in blue.

Devices outside the boundary box are semi-transparent.

Boundary Box:

A draggable and resizable green boundary box is provided to define areas of interest.

Devices outside the boundary box are visually distinct.

Zoom Control:

Adjust the zoom level using a slider.

Reset the zoom to the default level with a single button.

Set Origin:

Set the origin (0,0) based on the position of an anchor or the first device.

Visibility Toggles:

Toggle the visibility of anchors and tags independently.

Dark Mode:

Switch between light and dark themes for better visibility in different lighting conditions.

Device Selection:

Click on a device to view its details (ID, name, type, and position).

Grid Lines:

A grid is displayed on the canvas to help with positioning devices.

How to Use
Upload a Blueprint:

Click the "Choose File" button in the Controls panel to upload a blueprint image.

Interact with Devices:

Drag devices (circles) to reposition them.

Click on a device to view its details in the Controls panel.

Adjust the Boundary Box:

Drag the green boundary box to move it.

Resize the box by dragging the green circles at the top-left or bottom-right corners.

Set the Origin:

Click the "Set Origin (0,0)" button to set the origin based on an anchor or the first device.

Control Zoom:

Use the slider to adjust the zoom level.

Click "Reset Zoom" to return to the default zoom level.

Toggle Visibility:

Use the checkboxes in the Controls panel to show/hide anchors and tags.

Switch Themes:

Toggle the "Dark Mode" switch to change between light and dark themes.


Project Structure

src/
├── components/
│   ├── devicesdata.json          # Sample device data
│   ├── BlueprintCanvas.jsx       # Main canvas component
│   ├── FileUploader.jsx          # File upload component
│   └── Controls.jsx             # Control panel component
├── hooks/
│   ├── useDeviceStore.js         # Zustand store for global state
│   └── useLoadData.js            # Hook to load device data
└── App.jsx                      # Main application component