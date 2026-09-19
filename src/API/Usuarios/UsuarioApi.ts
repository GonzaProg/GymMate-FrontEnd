import api from '../axios';

// Interfaz completa del Alumno 
// Definición de la suscripción individual
export interface UserPlanInfo {
    id: number;
    activo: boolean;
    fechaInicio: string;
    fechaVencimiento: string;
    plan: {
        id: number;
        nombre: string;
        tipo: 'Gym' | 'Natacion';
        precio: number;
    }
}

export interface AlumnoDTO {
    id: number;
    dni: string;            
    nombre: string;
    apellido: string;
    telefono?: string;      
    gmail?: string;
    fechaNacimiento?: string; 
    fotoPerfil?: string;
    fechaCreacion?: string;
    // CAMBIO: Ahora es una lista de planes
    userPlans?: UserPlanInfo[]; 
    fechaVencimientoPlan?: string; 
    estadoMembresia?: string;
    planResumen?: {
        estado: 'Activo' | 'Vencido' | 'Sin Plan';
        nombre?: string;
        vencimiento?: string;
    };
}
// Interfaz para Editar Perfil
export interface UpdateProfileDTO {
    nombre: string;
    dni: string;
    apellido: string;
    fotoPerfil: string;
    telefono?: string;       
    gmail?: string;
    fechaNacimiento?: string; 
}

export interface ChangePasswordDTO {
    currentPassword: string;
    newPassword: string;
    confirmPassword?: string;
}

// Interfaz para la respuesta paginada
export interface GetAlumnosResponse {
    total: number;
    alumnos: AlumnoDTO[];
}

export const UsuarioApi = {
// MODIFICADO: Ahora acepta opciones de filtrado y paginación
    getAlumnos: async (options?: { includePlan?: boolean, search?: string, showAll?: boolean }): Promise<GetAlumnosResponse> => {
        const params = new URLSearchParams();
        
        if (options?.includePlan) params.append('includePlan', 'true');
        if (options?.showAll) params.append('showAll', 'true');
        if (options?.search) params.append('search', options.search);

        const response = await api.get(`/users/alumnos?${params.toString()}`); 
        
        // El backend ahora devuelve { total, alumnos }
        return response.data;
    },
    
    // Actualizar Perfil
    update: async (id: number, data: UpdateProfileDTO) => {
        const response = await api.put(`/users/${id}`, data);
        return response.data;
    },

    // Cambiar Contraseña
    changePassword: async (id: number, data: ChangePasswordDTO) => {
        const response = await api.patch(`/users/${id}/password`, data);
        return response.data;
    },

    // Eliminar Cuenta
    deleteAccount: async (id: number) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    },

    // Guardar FCM Token
    saveFcmToken: async (token: string) => {
        const response = await api.post(`/users/fcm-token`, { token });
        return response.data;
    }
};