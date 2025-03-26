import useDeviceStore from "./useDeviceStore";
import api from "../../api/api";

const useLoadData = () => {
  const { setDevices } = useDeviceStore();

  const getAllDevices = async () => {
    try {
      const response = await api.get("/v1/iot-device/all");
      
      if (response.data.success) {
        const devices = response.data.data.map((item) => {
          // Get device ID from details.id or extract from topic
          const deviceId = item.details?.id || item.topic.split('/').pop();
          
          // Handle coordinates - convert NaN/null to 0
          const x = parseFloat(item.location?.x) || 0;
          const y = parseFloat(item.location?.y) || 0;
          const z = parseFloat(item.location?.z) || 0;
          
          // Determine device name
          let deviceName = item.details?.data?.name;
          if (!deviceName) {
            deviceName = item.type === "anchor" ? "Anchor" 
                       : item.type === "device" ? "Device" 
                       : "Tag";
          }

          return {
            id: deviceId,
            name: deviceName,
            x: x,
            y: y,
            z: z,
            quality: item.location?.quality || 0,
            type: item.type || "device",
            zone: item.zone || null,
            topic: item.topic
          };
        });

        setDevices(devices);
        return true; // Indicate success
      }
      return false;
    } catch (error) {
      console.error("Error fetching devices:", error);
      return false;
    }
  };

  return { getAllDevices }; // Return the function instead of using useEffect
};

export default useLoadData;