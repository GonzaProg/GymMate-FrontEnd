import api from '../axios';

// DTO para crear usuario (Ahora incluye codigoGym opcional para enviarlo desde el front)
export interface CreateUserDTO {
    dni: string;
    nombre: string;
    apellido: string;
    contraseña: string;
    telefono?: string;
    gmail?: string;
    fechaNacimiento?: string;
    rol: string;
    codigoGym?: string; // Para vincular el usuario al gym local
    esCreacionAdmin?: boolean; // Para enviar mensaje con datos de la cuenta por whatsapp
}

// DTO para el Login (Ahora incluye codigoGym)
export interface LoginDTO {
    dni: string;
    contraseña: string;
    codigoGym?: string;
}

// Interfaz de respuesta del login (Actualizada con datos del Gym)
export interface LoginResponse {
    token: string;
    refreshToken: string;
    user: {
        id: number;
        dni: string;
        nombre: string;
        apellido: string;
        rol: string;
        gmail?: string;
        fotoPerfil?: string;
        gym?: { // <--- Info del gym
            id: number;
            nombre: string;
            logoUrl?: string;
            fondoInicioCelularUrl?: string;
            codigoAcceso: string;
            moduloAsistencia?: boolean;
            tieneMercadoPago?: boolean;
        };
    };
}

// DTO para Reset Password
export interface ResetPasswordDTO {
    token: string;
    nuevaContrasena: string;
}

export const AuthApi = {
    // Unificado: tanto Alumnos como Entrenadores usan el mismo endpoint
    createUser: async (data: CreateUserDTO) => {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    login: async (credentials: LoginDTO): Promise<LoginResponse> => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    // Solicitar recuperación
    forgotPassword: async (dni: string, metodo: 'whatsapp' | 'email') => {
        const response = await api.post('/auth/forgot-password', { dni, metodo });
        return response.data;
    },

    // Establecer la nueva contraseña
    resetPassword: async (data: ResetPasswordDTO) => {
        const response = await api.post('/auth/reset-password', data);
        return response.data;
    }
}