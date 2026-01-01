import axios from "axios";

export const API = axios.create({
  baseURL: "http://192.168.29.156:8001",
});

export const BASE_URL = "http://192.168.29.156:8001";
