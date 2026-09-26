import api from '../axios'; 

export interface PlanDTO {
    id?: number;
    nombre: string;
    tipo: 'Gym' | 'Natacion' | 'Pilates';
    precio: number;
    duracionDias: number;
    diasPorSemana: number;
    descripcion: string;
    fechaActualizacion?: Date;
}

// DTO para la lista de planes activos de un usuario
export interface UserPlanDTO {
    userPlanId: number; // ID único de la suscripción
    planId: number;
    nombre: string;
    tipo: string;
    precio: number;
    fechaInicio: string;
    fechaVencimiento: string;
    diasRestantes: number;
    descripcion?: string;
}

export const PlansApi = {
    // 1. Obtener todos los planes disponibles
    getAll: async () => {
        const response = await api.get('/planes');
        return response.data;
    },

    // 2. Obtener MIS planes activos (Devuelve { tienePlan: boolean, planes: UserPlanDTO[] })
    getMyPlan: async () => {
        const response = await api.get('/planes/mi-plan');
        return response.data;
    },

    // 3. Crear Plan
    create: async (data: PlanDTO) => {
        const response = await api.post('/planes/crear', data);
        return response.data;
    },

    // 4. Editar Plan
    update: async (id: number, data: PlanDTO) => {
        const response = await api.put(`/planes/${id}`, data);
        return response.data;
    },

    // 5. Suscribir Usuario
    subscribeUser: async (userId: number, planId: number, metodoPago: string = "Transferencia", fechaInicio?: string) => {
        const response = await api.post('/planes/suscribir', { userId, planId, metodoPago, fechaInicio });
        return response.data;
    },

    // 6. Renovar Plan (CAMBIO: Recibe userPlanId y forzarDesdeVencimiento)
    renewPlan: async (userPlanId: number, metodoPago: string = "Transferencia", forzarDesdeVencimiento: boolean = false, fechaInicio?: string) => {
        const response = await api.post('/planes/renovar', { userPlanId, metodoPago, forzarDesdeVencimiento, fechaInicio });
        return response.data;
    },

    // 7. Cancelar Plan (CAMBIO: Recibe userPlanId)
    cancelPlan: async (userPlanId: number) => {
        const response = await api.post('/planes/cancelar', { userPlanId });
        return response.data;
    },

    enviarReciboManual: async (userId: number, comprobanteUrl?: string) => {
        const response = await api.post('/planes/enviar-recibo', { userId, comprobanteUrl });
        return response.data;
    }
};