import { useState, useEffect } from 'react';
import { GymApi } from '../../API/Gym/GymApi';

export interface User {
    id?: number;
    dni: string;
    nombre?: string;
    apellido?: string;
    telefono?: string;
    fechaNacimiento?: string;
    email?: string;
    gmail?: string;
    fotoPerfil?: string;
    rol: string;
    token?: string;
    fcmTokens?: string[];
    gym?: {
        id: number;
        nombre: string;
        logoUrl?: string;
        codigoAcceso?: string;
        moduloAsistencia?: boolean;
        concurrenciaBajaMax?: number;
        concurrenciaMediaMax?: number;
        fraseConcurrenciaBaja?: string;
        fraseConcurrenciaMedia?: string;
        fraseConcurrenciaAlta?: string;
        fondoInicioCelularUrl?: string;
        fechaModificacionFondo?: number;
        fechaModificacionLogo?: number;
        ultimaVersionApp?: string;
    };
}

let hasRefreshedGymData = false;

export const useAuthUser = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isEntrenador, setIsEntrenador] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const userLocal = localStorage.getItem("user");
        const tokenLocal = localStorage.getItem("token");
        const userSession = sessionStorage.getItem("user");
        const tokenSession = sessionStorage.getItem("token");

        const userStr = userLocal || userSession;
        const tokenStr = tokenLocal || tokenSession;

        if (userStr && tokenStr) {
            try {
                const userObj: User = JSON.parse(userStr);
                establecerEstadoUsuario(userObj, tokenStr);

                // Background check para actualizar info del gym (logos y fondos) en cache
                if (!hasRefreshedGymData && userObj.gym?.codigoAcceso) {
                    hasRefreshedGymData = true;
                    GymApi.getByCode(userObj.gym.codigoAcceso).then((freshGym: any) => {
                        const isLogoChanged = freshGym.logoUrl !== userObj.gym?.logoUrl || freshGym.fechaModificacionLogo !== userObj.gym?.fechaModificacionLogo;
                        const isFondoChanged = freshGym.fondoInicioCelularUrl !== userObj.gym?.fondoInicioCelularUrl || freshGym.fechaModificacionFondo !== userObj.gym?.fechaModificacionFondo;

                        if (isLogoChanged || isFondoChanged) {
                            const updatedUser = { ...userObj, gym: freshGym };
                            localStorage.setItem("user", JSON.stringify(updatedUser));
                            if (userLocal) localStorage.setItem("user", JSON.stringify(updatedUser));
                            if (userSession) sessionStorage.setItem("user", JSON.stringify(updatedUser));
                            window.location.reload(); // Recargar para que todos los componentes tomen el usuario nuevo
                        }
                    }).catch(console.error);
                }

            } catch (error) {
                console.error("Error sesión:", error);
                logout();
            }
        }
        setIsLoading(false);
    }, []);

    // Helper interno para setear estados
    const establecerEstadoUsuario = (user: User, token: string) => {
        setCurrentUser(user);
        setToken(token);
        const admin = user.rol === "Admin";
        setIsAdmin(admin);
        setIsEntrenador(user.rol === "Entrenador" || admin);
    };

    // Autologin al crear nuevo usuario
    const login = (user: User, accessToken: string, refreshToken: string, remember: boolean = true) => {
        const storage = remember ? localStorage : sessionStorage;

        storage.setItem("token", accessToken);
        storage.setItem("refreshToken", refreshToken);
        storage.setItem("user", JSON.stringify(user));

        establecerEstadoUsuario(user, accessToken);
    };

    const logout = () => {
        localStorage.clear();
        sessionStorage.clear();
        setIsAdmin(false);
        setIsEntrenador(false);
        setCurrentUser(null);
        setToken(null);
    };

    return {
        isAdmin,
        isEntrenador,
        currentUser,
        token,
        isLoading,
        login, // <--- AHORA SÍ EXISTE
        logout
    };
};