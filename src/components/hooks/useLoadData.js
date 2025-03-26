import useDeviceStore from "./useDeviceStore";
import api from "../../api/api";
import devicesdata from "../devicesdata.json";
const useLoadData = () => {
  const { setDevices } = useDeviceStore();

  const getAllDevices = async () => {
      const devices = devicesdata
      .map((item) => {
        const payloadString = item.payload?.payload?.S;
        if (!payloadString) return null;
        const payload = JSON.parse(payloadString);
        return {
          id: item.topic,
          name: payload.label,
          x: payload.anchor?.location?.x ?? payload.tag?.reference_location?.x ?? 0,
          y: payload.anchor?.location?.y ?? payload.tag?.reference_location?.y ?? 0,
          type: payload.anchor ? "anchor" : "tag",
        };
      })
      .filter(Boolean);

    setDevices(devices);
        return true; // Indicate success
  };

  return { getAllDevices }; // Return the function instead of using useEffect
};

export default useLoadData;


 