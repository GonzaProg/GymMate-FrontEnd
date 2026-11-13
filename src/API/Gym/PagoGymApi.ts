import api from '../axios';

export interface PagoGymDTO {
    id: number;
    monto: number;
    fechaPago: string; // Formato dd/mm/aaaa
    gym?: {
        id: number;
        nombre: string;
        codigoAcceso: string;
    };
}

export interface CreateUpdatePagoGymDTO {
    gymId?: number;
    monto: number;
    fechaPago?: string; // Puede enviarse dd/mm/aaaa o yyyy-mm-dd
}

export interface EstadoPagoMensualGymDTO {
    pagado: boolean;
    debeMostrarAlerta: boolean;
    excluido: boolean;
    enRangoDias: boolean;
    diaActual?: number;
    gymCodigo?: string;
}

export const PagoGymApi = {
    verificarEstadoMensual: async (): Promise<EstadoPagoMensualGymDTO> => {
        const response = await api.get('/pagos-gym/estado-mensual');
        return response.data;
    },

    getAll: async (gymId?: number): Promise<PagoGymDTO[]> => {
        const response = await api.get('/pagos-gym', {
            params: gymId ? { gymId } : undefined
        });
        return response.data;
    },

    getByGym: async (gymId: number): Promise<PagoGymDTO[]> => {
        const response = await api.get(`/pagos-gym/gym/${gymId}`);
        return response.data;
    },

    getById: async (id: number): Promise<PagoGymDTO> => {
        const response = await api.get(`/pagos-gym/${id}`);
        return response.data;
    },

    create: async (data: { gymId: number; monto: number; fechaPago?: string }): Promise<PagoGymDTO> => {
        const response = await api.post('/pagos-gym', data);
        return response.data;
    },

    update: async (id: number, data: CreateUpdatePagoGymDTO): Promise<PagoGymDTO> => {
        const response = await api.put(`/pagos-gym/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<{ message: string }> => {
        const response = await api.delete(`/pagos-gym/${id}`);
        return response.data;
    }
};

