import api from '../axios';

// Interfaz para MOSTRAR datos (Lectura)
export interface GymDTO {
    id: number;
    nombre: string;
    codigoAcceso: string;
    activo: boolean;
    logoUrl?: string;
    fondoInicioCelularUrl?: string;
    cambiarMPAccessToken?: boolean;
    concurrenciaBajaMax?: number;
    concurrenciaMediaMax?: number;
    fraseConcurrenciaBaja?: string;
    fraseConcurrenciaMedia?: string;
    fraseConcurrenciaAlta?: string;
}

// Interfaz para ACTUALIZAR datos
export interface CreateUpdateGymDTO {
    nombre: string;
    codigoAcceso: string;
    logoUrl?: string;
    fondoInicioCelularUrl?: string | null;
}

export interface GymPreferencesDTO {
    envioAutomaticoCumpleanos?: boolean; 
    envioAutomaticoRecibos?: boolean;
    mensajeCumpleanos?: string;
    mensajeInactividad?: string;
    moduloAsistencia?: boolean;
    finanzasPassword?: string;
    mpAccessToken?: string;
    cambiarMPAccessToken?: boolean;
    concurrenciaBajaMax?: number;
    concurrenciaMediaMax?: number;
    fraseConcurrenciaBaja?: string;
    fraseConcurrenciaMedia?: string;
    fraseConcurrenciaAlta?: string;
}

export const GymApi = {
    // 1. Crear: Ahora acepta CreateGymDTO (sin id ni activo)
    create: async (data: CreateUpdateGymDTO) => {
        const response = await api.post('/gyms', data);
        return response.data; // El backend nos devolverá el GymDTO completo (con ID)
    },

    // 2. Obtener todos
    getAll: async (): Promise<GymDTO[]> => {
        const response = await api.get('/gyms');
        return response.data;
    },

    getByCode: async (code: string) => {
        const response = await api.get(`/gyms/by-code/${code}`);
        return response.data; 
    },

    // 3. Bloquear / Desbloquear
    toggleStatus: async (id: number, activo: boolean) => {
        const response = await api.patch(`/gyms/${id}/status`, { activo });
        return response.data;
    },

    toggleMpAccess: async (id: number, cambiarMPAccessToken: boolean) => {
        const response = await api.patch(`/gyms/${id}/mp-access`, { cambiarMPAccessToken });
        return response.data;
    },

    desvincularMercadoPago: async () => {
        const response = await api.post('/gyms/mp-unlink');
        return response.data;
    },

    // 4. Actualizar
    update: async (id: number, data: CreateUpdateGymDTO) => {
        const response = await api.put(`/gyms/${id}`, data);
        return response.data;
    },

    getPreferences: async () => {
        const response = await api.get('/gyms/preferences');
        return response.data;
    },
    
    updatePreferences: async (data: GymPreferencesDTO) => {
        const response = await api.put("/gyms/preferences", data);
        return response.data;
    },

    verifyFinancePassword: async (password: string) => {
        const response = await api.post("/gyms/verify-finance-password", { password });
        return response.data;
    }
};