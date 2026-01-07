import axios from "axios";
import { toast } from "sonner";
// . env reavt|typescript



const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
console.log("API_URL: ", API_URL);

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
      // Show toast notification for session expiration
      toast.error("Su sesión ha expirado. Por favor inicie sesión nuevamente.", {
        duration: 4000,
      });

      // Clear token and redirect to login
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      
      // Small delay to allow user to see the toast
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
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
    console.log("Middleware connecting APO Simulation...");
    console.log(response.data);
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
    const response = await api.post(
      `/proceso-judicial/${id}/simular-sentencia`,
      data
    );
    return response.data;
  },
  getHistorialSimulaciones: async (id: string) => {
    const response = await api.get(
      `/proceso-judicial/${id}/historial-simulaciones`
    );
    return response.data;
  },
  getSimulacionById: async (simulacionId: string) => {
    const response = await api.get(
      `/proceso-judicial/simulacion/${simulacionId}`
    );
    return response.data;
  },
  getCasosSimilaresBySimulacion: async (simulacionId: string) => {
    const response = await api.get(
      `/proceso-judicial/simulacion/${simulacionId}/casos-similares`
    );
    return response.data;
  },
  getReglas: async () => {
    const response = await api.get("/proceso-judicial/reglas");
    return response.data;
  },
  shareCase: async (id: string, recipientEmail: string, message?: string) => {
    const response = await api.post(`/proceso-judicial/${id}/share`, {
      recipientEmail,
      message,
    });
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

// User API
export const userAPI = {
  getConfig: async (id: number) => {
    const response = await api.get(`/user/${id}/config`);
    return response.data;
  },
  updateConfig: async (id: number, data: any) => {
    const response = await api.patch(`/user/${id}/config`, data);
    return response.data;
  },
};
