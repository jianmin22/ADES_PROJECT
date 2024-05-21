import axios from "axios";
const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8081";
export default axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});


export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
