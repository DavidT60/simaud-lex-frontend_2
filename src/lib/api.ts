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
      toast.error(
        "Su sesión ha expirado. Por favor inicie sesión nuevamente.",
        {
          duration: 4000,
        }
      );

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
  sendVerificationCode: async (email: string) => {
    const response = await api.post("/auth/send-code", { email });
    return response.data;
  },
  sendPasswordResetCode: async (email: string) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },
  resetPassword: async (data: { email: string; code: string; newPassword: string }) => {
    const response = await api.post("/auth/reset-password", data);
    return response.data;
  },
  register: async (data: { email: string; password: string; name: string; code: string }) => {
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
    console.log("Post Data Proceso Judicial...");
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
  gradeCase: async (id: string, calificacion: number, detalles: string) => {
    const response = await api.patch(`/proceso-judicial/${id}/grade`, {
      calificacion,
      detalles,
    });
    return response.data;
  },
};

// Course API
export const courseAPI = {
  create: async (data: any) => {
    const response = await api.post("/course", data);
    return response.data;
  },
  getAll: async () => {
    const response = await api.get("/course");
    return response.data;
  },
  getOne: async (id: string) => {
    const response = await api.get(`/course/${id}`);
    return response.data;
  },
  addStudent: async (courseId: string, email: string) => {
    const response = await api.post(`/course/${courseId}/students`, { email });
    return response.data;
  },
  getStudentCases: async (studentId: string) => {
    const response = await api.get(`/course/student/${studentId}/cases`);
    return response.data;
  },
  removeStudent: async (courseId: string, studentId: string) => {
    const response = await api.delete(
      `/course/${courseId}/students/${studentId}`
    );
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
    const { data } = await api.get(`/user/${id}/config`);
    return data;
  },
  updateConfig: async (id: number, config: any) => {
    const { data } = await api.patch(`/user/${id}/config`, config);
    return data;
  },
  updatePassword: async (id: number, passwords: any) => {
    const { data } = await api.patch(`/user/${id}/password`, passwords);
    return data;
  },
  getAll: async () => {
    const response = await api.get("/user");
    return response.data;
  },
  updateRole: async (id: number, role: string) => {
    const response = await api.patch(`/user/${id}/role`, { role });
    return response.data;
  },
  searchStudents: async (email: string) => {
    const response = await api.get(`/user/search/students`, {
      params: { email },
    });
    return response.data;
  },
};

// Notification API
export const notificationAPI = {
  getUnreadCount: async () => {
    console.log("LOG API NOTIFY");
    const response = await api.get("/notification/unread-count");
    return response.data;
  },
  getAll: async () => {
    const response = await api.get("/notification");
    return response.data;
  },
  markAsRead: async (id: string) => {
    const response = await api.patch(`/notification/${id}/read`);
    return response.data;
  },
  markAllAsRead: async () => {
    const response = await api.patch("/notification/read-all");
    return response.data;
  },
};
