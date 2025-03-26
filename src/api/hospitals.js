import env from "@/config/env";
import api from "./api";
import { getToken } from "../utils/token";

export const hospitals = api.create({
  baseURL: env.REACT_APP_API_URL + "/v1/hospital-image",
});

hospitals.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const setFloorNumber = async (numberOfFloors) => {
  const response = await hospitals.post("/set-floors", { numberOfFloors });
  return response.data;
};

export const getAllFloors = async () => {
  const response = await hospitals.get("/all-floors");
  return response.data;
};

export const uploadImage = async (floorNumber, formData) => {
  const response = await hospitals.post(`/create/${floorNumber}`, formData);
  return response.data;
};

export const removeImage = async (floorNumber) => {
  const response = await hospitals.delete(`/${floorNumber}`);
  return response.data;
};

export const getImageByFloorNumber = async (floorNumber) => {
  const response = await hospitals.get(`/floor/${floorNumber}`);
  return response.data;
};

export const setFloorZAxis = async (floorNumber, minZ, maxZ) => {
  const response = await hospitals.patch(`/set-floor-zaxis/${floorNumber}`, {
    minZ,
    maxZ,
  });
  return response.data;
};

export const setFloorBoundaries = async (floorNumber, boundaries) => {
  const response = await hospitals.patch(
    `/set-floor-boundaries/${floorNumber}`,
    {
      boundaries,
    }
  );
  return response.data;
};


const setFloorStartingPoint = async (floorNumber, x, y, z) => {
  const response = await hospitals.patch(
    `/set-floor-starting-point/${floorNumber}`,
    {
      latitude: x,
      longitude: y,
      zAxis: z,
    }
  );
  return response.data;
};


export const hospitalApi = {
  setFloorNumber,
  getAllFloors,
  uploadImage,
  removeImage,
  getImageByFloorNumber,
  setFloorZAxis,
  setFloorBoundaries,

  setFloorStartingPoint,

};
