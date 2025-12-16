import { API } from "./client";

export const getPatients = () => API.get("/patients");

export const getPatientById = (id) => API.get(`/patients/${id}`);
