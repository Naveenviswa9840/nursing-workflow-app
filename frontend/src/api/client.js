import axios from "axios";

export const API = axios.create({
  baseURL: "http://192.168.0.109:8001", // change to your machine IP for mobile testing
});
