import { authApi } from "../config/axiosAuth";

export const getNotes = (patientId: string) =>
  authApi.get(`/patients/${patientId}/notes`);

export const addNote = (patientId: string, content: string) =>
  authApi.post(`/patients/${patientId}/notes`, { content });
