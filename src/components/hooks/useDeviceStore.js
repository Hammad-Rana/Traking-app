import { create } from "zustand";

const useDeviceStore = create((set) => ({
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
}));

export default useDeviceStore;