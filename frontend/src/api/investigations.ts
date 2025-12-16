import { authApi } from "../config/axiosAuth";

export const getInvestigations = (patientId: number) =>
  authApi.get(`/patients/${patientId}/investigations`);

export const addInvestigation = (
  patientId: number,
  data: { testName: string; comments?: string }
) =>
  authApi.post(`/patients/${patientId}/investigations`, data);

export const updateInvestigationStatus = (
  patientId: number,
  investigationId: number,
  status: "PENDING" | "COMPLETED"
) =>
  authApi.patch(
    `/patients/${patientId}/investigations/${investigationId}/status`,
    { status }
  );
