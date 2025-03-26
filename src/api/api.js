import env from "../config/env";
import axios from "axios";
import { getToken } from "../utils/token";

const api = axios.create({
  baseURL: env.REACT_APP_API_URL,
});

api.interceptors.request.use(
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

api.interceptors.response.use(
  (response) => {
    // If the request is successful, simply return the response
    return response;
  },
  (error) => {
    if (error?.response?.status === 401) {
      // localStorage.clear();

      // window.history.pushState({}, "", "/");
      window.dispatchEvent(new PopStateEvent("popstate"));
    }

    return Promise.reject(error);
  }
);

export default api;
