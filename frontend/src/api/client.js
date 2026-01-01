import axios from "axios";

export const API = axios.create({
  baseURL: "http://192.168.29.156:8001", // change to your machine IP for mobile testing
});
