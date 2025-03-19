import { create } from "zustand";

const useDeviceStore = create((set, get) => ({
  blueprint: null,
  setBlueprint: (img) => set({ blueprint: img }),
  blueprintPosition: { x: 0, y: 0 },
  setBlueprintPosition: (position) => set({ blueprintPosition: position }),
  devices: [],
  setDevices: (newDevices) => set({ devices: newDevices }),
  canvasSize: { width: window.innerWidth * 0.75, height: window.innerHeight },
  zoomLevel: 1,
  setZoomLevel: (level) => set({ zoomLevel: level }),
  visibility: { anchor: true, tag: true },
  toggleVisibility: (type) => set((state) => ({
    visibility: { ...state.visibility, [type]: !state.visibility[type] },
  })),
  boundary: { x: 100, y: 100, width: 600, height: 400 },
  setBoundary: (newBoundary) => set({ boundary: newBoundary }),
  selectedDevice: null,
  setSelectedDevice: (device) => set({ selectedDevice: device }),
  themeMode: "light",
  toggleTheme: () => set((state) => ({
    themeMode: state.themeMode === "light" ? "dark" : "light",
  })),
  endLocation: { x: null, y: null },
  setEndLocation: (location) => set({ endLocation: location }),
  moveTagToEndLocation: () => {
    const { devices, endLocation, setDevices } = get();
  
    // Find the first device of type "tag"
    const tagDevice = devices.find((device) => device.type === "tag");
  
    // Validate inputs
    if (!tagDevice || !endLocation.x || !endLocation.y) {
      console.error("Invalid inputs for moveTagToEndLocation");
      return;
    }
  
    // Convert tag's x and y to numbers (in case they are strings)
    const currentX = parseFloat(tagDevice.x);
    const currentY = parseFloat(tagDevice.y);
  
    // Calculate the distance to the target
    const dx = endLocation.x - currentX;
    const dy = endLocation.y - currentY;
    const distance = Math.sqrt(dx * dx + dy * dy);
  
    // If the tag is already close to the target, stop
    if (distance < 1) {
      console.log("Tag is already at the target location");
      return;
    }
  
    // Set up an interval to move the tag gradually
    const interval = setInterval(() => {
      // Get the latest state of devices
      const currentDevices = get().devices;
  
      // Create a new array with the updated tag position
      const updatedDevices = currentDevices.map((device) => {
        if (device.id === tagDevice.id) {
          // Convert current position to numbers
          const currentX = parseFloat(device.x);
          const currentY = parseFloat(device.y);
  
          // Calculate the distance to the target
          const dx = endLocation.x - currentX;
          const dy = endLocation.y - currentY;
          const distance = Math.sqrt(dx * dx + dy * dy);
  
          // Stop moving if close enough to the target
          if (distance < 1) {
            clearInterval(interval);
            console.log("Tag reached the target location");
            return device;
          }
  
          // Calculate the movement direction
          const angle = Math.atan2(dy, dx);
  
          // Move the tag by a small amount (speed)
          const speed = 1; // Pixels per interval
          const newX = currentX + Math.cos(angle) * speed;
          const newY = currentY + Math.sin(angle) * speed;
  
          console.log("Moving tag to:", newX, newY);
  
          // Return the updated device
          return { ...device, x: newX, y: newY };
        }
        return device;
      });
  
      // Save the updated devices array
      setDevices(updatedDevices);
    }, 140); // Update every 50ms (adjust for smoother/faster animation)
  },
}));

export default useDeviceStore;