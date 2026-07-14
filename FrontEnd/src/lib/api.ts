import axios from "axios";

// Instancia global de Axios apuntando al backend
export const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para inyectar el token JWT en cada petición si existe en localStorage
api.interceptors.request.use(
  (config) => {
    // Evitamos ejecutarlo en SSR si localStorage no está definido en el servidor
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuesta para manejar errores globales (ej. expiración de token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        console.warn("Sesión expirada o no autorizada. Redirigiendo a login...");
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        // Si no estamos ya en la pantalla de login, redirigir
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

// Interfaces de datos
export interface UsuarioProfile {
  id: number;
  negocioId: number | null;
  nombres: string;
  apellidos: string;
  email: string;
  rol: "ADMIN" | "TENANT" | "ATHLETE";
  objetivoFitness?: string;
  requerimientoKcal?: number;
  reqProteinasG?: number;
  reqCarbohidratosG?: number;
  reqGrasasG?: number;
}

export interface AuthResponse {
  token: string | null;
  id: number;
  negocioId: number | null;
  nombres: string;
  apellidos: string;
  email: string;
  rol: "ADMIN" | "TENANT" | "ATHLETE";
  objetivoFitness?: string;
  requerimientoKcal?: number;
  reqProteinasG?: number;
  reqCarbohidratosG?: number;
  reqGrasasG?: number;
}

export interface NegocioResponse {
  id: number;
  nombreComercial: string;
  slug: string;
  ruc: string;
  telefono: string;
  estado: string;
  plan: string;
  ciudad: string;
  fechaRegistro: string;
}

export interface AdminDashboardResponse {
  negociosActivos: number;
  usuariosTotales: number;
  mrr: number;
  churn: number;
  negociosNuevos: NegocioResponse[];
}

export interface LineaPedidoResponse {
  id: number;
  platoId: number;
  platoNombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface PedidoResponse {
  id: number;
  negocioId: number;
  usuarioId: number;
  estado: string; // PENDIENTE, PREPARACION, EN_CAMINO, ENTREGADO
  montoTotal: number;
  direccionEntrega: string;
  fechaEntrega: string;
  fechaCreacion: string;
  lineas: LineaPedidoResponse[];
}

export interface ActualizarObjetivosRequest {
  objetivoFitness: string;
  requerimientoKcal: number;
  reqProteinasG: number;
  reqCarbohidratosG: number;
  reqGrasasG: number;
}

export interface PlatoResponse {
  id: number;
  negocioId: number;
  nombre: string;
  descripcion: string;
  precio: number;
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
  disponible: boolean;
}

export interface PlatoRequest {
  nombre: string;
  descripcion: string;
  precio: number;
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
  disponible: boolean;
}

export interface ComidaProgramadaRequest {
  platoId: number;
  diaSemana: string;
  tipoComida: string;
  cantidad: number;
}

export interface PlanSemanalRequest {
  usuarioId: number;
  negocioId: number;
  fechaInicioSemana: string;
  montoTotal: number;
  comidas: ComidaProgramadaRequest[];
}

export interface ComidaProgramadaResponse {
  platoId: number;
  diaSemana: string;
  tipoComida: string;
  cantidad: number;
}

export interface PlanSemanalResponse {
  id: number;
  negocioId: number;
  usuarioId: number;
  usuarioNombre: string;
  fechaInicioSemana: string;
  estadoPago: string;
  montoTotal: number;
  comidas: ComidaProgramadaResponse[];
}

// Servicios de Autenticación
export const authService = {
  login: async (email: string, contrasenia: string): Promise<AuthResponse> => {
    const response = await api.post("/api/v1/auth/login", { email, password: contrasenia });
    return response.data;
  },
  getMe: async (): Promise<UsuarioProfile> => {
    const response = await api.get("/api/v1/auth/me");
    return response.data;
  },
  updateObjectives: async (datos: ActualizarObjetivosRequest): Promise<UsuarioProfile> => {
    const response = await api.put("/api/v1/auth/me", datos);
    return response.data;
  },
};

// Servicios de Platos
export const platosService = {
  listarPlatos: async (): Promise<PlatoResponse[]> => {
    const response = await api.get("/api/v1/platos");
    return response.data;
  },
  listarPlatosGenerales: async (): Promise<PlatoResponse[]> => {
    const response = await api.get("/api/v1/platos/all");
    return response.data;
  },
  listarPlatosDeNegocio: async (negocioId: number): Promise<PlatoResponse[]> => {
    const response = await api.get("/api/v1/platos", {
      headers: {
        "X-TenantID": negocioId.toString(),
      },
    });
    return response.data;
  },
  obtenerPlato: async (id: number): Promise<PlatoResponse> => {
    const response = await api.get(`/api/v1/platos/${id}`);
    return response.data;
  },
  crearPlato: async (plato: PlatoRequest): Promise<PlatoResponse> => {
    const response = await api.post("/api/v1/platos", plato);
    return response.data;
  },
  actualizarPlato: async (id: number, plato: PlatoRequest): Promise<PlatoResponse> => {
    const response = await api.put(`/api/v1/platos/${id}`, plato);
    return response.data;
  },
};

// Servicios de Plan Semanal
export const planesService = {
  getMisPlanes: async (): Promise<PlanSemanalResponse[]> => {
    const response = await api.get("/api/v1/planes/mis-planes");
    return response.data;
  },
  guardarPlan: async (plan: PlanSemanalRequest): Promise<PlanSemanalResponse> => {
    const response = await api.post("/api/v1/planes", plan);
    return response.data;
  },
};

// Servicios de Super Admin
export const adminService = {
  getStats: async (): Promise<AdminDashboardResponse> => {
    const response = await api.get("/api/v1/admin/dashboard/stats");
    return response.data;
  },
  getNegocios: async (): Promise<NegocioResponse[]> => {
    const response = await api.get("/api/v1/admin/negocios");
    return response.data;
  },
  aprobarNegocio: async (id: number): Promise<NegocioResponse> => {
    const response = await api.patch(`/api/v1/admin/negocios/${id}/aprobar`);
    return response.data;
  },
  suspenderNegocio: async (id: number): Promise<NegocioResponse> => {
    const response = await api.patch(`/api/v1/admin/negocios/${id}/suspender`);
    return response.data;
  },
};

// Servicios de Logística / Cocina
export const pedidosService = {
  getPedidosNegocio: async (): Promise<PedidoResponse[]> => {
    const response = await api.get("/api/v1/pedidos/negocio");
    return response.data;
  },
  cambiarEstadoPedido: async (id: number, estado: string): Promise<PedidoResponse> => {
    const response = await api.patch(`/api/v1/pedidos/${id}/estado`, null, {
      params: { estado },
    });
    return response.data;
  },
};

// Servicios de Tenant Dashboard & Logística
export const tenantService = {
  obtenerDashboard: async () => {
    const response = await api.get("/api/v1/pedidos/dashboard");
    return response.data;
  },
  obtenerProduccion: async (fechaSemana: string) => {
    const response = await api.get("/api/v1/logistica/produccion", {
      params: { fechaSemana }
    });
    return response.data;
  },
  obtenerClientes: async () => {
    const response = await api.get("/api/v1/pedidos/clientes");
    return response.data;
  },
  obtenerReporteMensual: async () => {
    const response = await api.get("/api/v1/pedidos/reporte-mensual");
    return response.data;
  }
};

// Servicios de Negocio (Tenants)
export const negocioService = {
  getAll: async (): Promise<any[]> => {
    const response = await api.get("/api/v1/negocios/all");
    return response.data;
  }
};
