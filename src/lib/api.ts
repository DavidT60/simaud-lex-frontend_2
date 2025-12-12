import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },
  register: async (data: { email: string; password: string; name: string }) => {
    const response = await api.post("/auth/singin", data);
    return response.data;
  },
};

// NNA API
export const nnaAPI = {
  getAll: async () => {
    const response = await api.get("/nna");
    return response.data;
  },
  getOne: async (id: string) => {
    const response = await api.get(`/nna/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post("/nna", data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.patch(`/nna/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/nna/${id}`);
    return response.data;
  },
};

// Proceso Judicial API
export const procesoJudicialAPI = {
  getAll: async () => {
    const response = await api.get("/proceso-judicial");
    return response.data;
  },
  getOne: async (id: string) => {
    const response = await api.get(`/proceso-judicial/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post("/proceso-judicial", data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.patch(`/proceso-judicial/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/proceso-judicial/${id}`);
    return response.data;
  },
  simularSentencia: async (id: string, data: any) => {
    const response = await api.post(`/proceso-judicial/${id}/simular-sentencia`, data);
    return response.data;
  },
  getHistorialSimulaciones: async (id: string) => {
    const response = await api.get(`/proceso-judicial/${id}/historial-simulaciones`);
    return response.data;
  },
  getSimulacionById: async (simulacionId: string) => {
    const response = await api.get(`/proceso-judicial/simulacion/${simulacionId}`);
    return response.data;
  },
};

// Person API
export const personAPI = {
  getAll: async () => {
    const response = await api.get("/person");
    return response.data;
  },
  getOne: async (id: string) => {
    const response = await api.get(`/person/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post("/person", data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.patch(`/person/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/person/${id}`);
    return response.data;
  },
};
