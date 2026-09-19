import api from '../axios';

export interface Ejercicio {
    id: number;
    nombre: string;
    urlVideo?: string;
    imagenUrl?: string;
    musculoTrabajado?: string;
    elementosGym?: string;
    tipoAgarre?: string;
    detalles?: string;
    fechaActualizacion?: Date;
}

export interface EjercicioDTO {
    nombre: string;
    urlVideo?: string;
    imagenUrl?: string;
    musculoTrabajado?: string;
    elementosGym?: string;
    tipoAgarre?: string;
    detalles?: string;
}

export const TIPOS_AGARRE = ["Prono", "Supino", "Neutro", "Mixto"];

export const MUSCULOS_PERMITIDOS = [
    "Cardio", "Halterofilia", "Abdomen", "Antebrazos", "Bíceps", "Cuádriceps",
    "Cuello", "Espalda", "Glúteos", "Hombros",
    "Isquiotibiales", "Pantorrillas", "Pectoral", "Tríceps"
];

export const EjerciciosApi = {
    // 1. Obtener todos
    getAll: async (): Promise<Ejercicio[]> => {
        const response = await api.get('/ejercicios');
        return response.data;
    },

    // 1.5 Obtener por músculo
    getByMusculo: async (musculo: string, excludeId?: number): Promise<Ejercicio[]> => {
        const query = excludeId ? `?musculo=${encodeURIComponent(musculo)}&excludeId=${excludeId}` : `?musculo=${encodeURIComponent(musculo)}`;
        const response = await api.get(`/ejercicios/musculo${query}`);
        return response.data;
    },

    // 2. Crear (completo - solo admin)
    create: async (data: EjercicioDTO): Promise<Ejercicio> => {
        const response = await api.post('/ejercicios', data);
        return response.data;
    },

    // 2b. Crear básico (solo nombre y detalles - admin y entrenador)
    createBasic: async (data: Partial<EjercicioDTO>): Promise<Ejercicio> => {
        const response = await api.post('/ejercicios/basico', data);
        return response.data;
    },

    // 3. Modificar
    update: async (id: number, data: Partial<EjercicioDTO>): Promise<Ejercicio> => {
        const response = await api.put(`/ejercicios/${id}`, data);
        return response.data;
    },

    // 4. Eliminar
    delete: async (id: number): Promise<void> => {
        await api.delete(`/ejercicios/${id}`);
    }
};