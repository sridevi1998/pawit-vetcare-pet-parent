import axios from "axios";
import type { components, paths } from "./pawit-api-types";

type ApiPath = keyof paths;
type JsonResponse<Path extends ApiPath, Method extends keyof paths[Path], Status extends number> =
  paths[Path][Method] extends {
    responses: Record<Status, { content: { "application/json": infer Body } }>;
  }
    ? Body
    : never;

export type Appointment = components["schemas"]["Appointment"];
export type BillingResponse = components["schemas"]["BillingResponse"];
export type MeResponse = components["schemas"]["MeResponse"];
export type PetRecord = components["schemas"]["PetRecord"];

export type AppointmentListResponse = JsonResponse<"/api/v1/appointments", "get", 200>;
export type PetRecordListResponse = JsonResponse<"/api/v1/pets", "get", 200>;

const runtimeConfig = window.__PAWIT_CONFIG__ ?? {};

const api = axios.create({
  baseURL: runtimeConfig.apiBaseUrl || import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1",
  headers: {
    "X-PawIt-Tenant-ID": runtimeConfig.tenantId || import.meta.env.VITE_PAWIT_TENANT_ID,
    "X-PawIt-User-ID": runtimeConfig.userId || import.meta.env.VITE_PAWIT_USER_ID,
    "X-PawIt-Role": runtimeConfig.role || import.meta.env.VITE_PAWIT_ROLE || "PetParent",
  },
  withCredentials: true,
});

export async function getCurrentUser(): Promise<MeResponse> {
  const response = await api.get<MeResponse>("/me");
  return response.data;
}

export async function listAppointments(): Promise<Appointment[]> {
  const response = await api.get<AppointmentListResponse>("/appointments");
  return response.data.items;
}

export async function listPets(): Promise<PetRecord[]> {
  const response = await api.get<PetRecordListResponse>("/pets");
  return response.data.items;
}

export async function getBilling(): Promise<BillingResponse> {
  const response = await api.get<BillingResponse>("/billing");
  return response.data;
}
