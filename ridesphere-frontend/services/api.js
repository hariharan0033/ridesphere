import axios from "axios";

const API_URL = "http://10.0.2.2:5000/api";
// const API_URL = "https://ridesphere-backend.vercel.app/";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach Authorization header if token exists
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};
