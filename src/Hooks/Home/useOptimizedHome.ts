import { useState, useEffect, useRef } from 'react';
import { DashboardApi, type DashboardMetrics } from "../../API/Dashboard/DashboardApi";
import { UsuarioApi } from "../../API/Usuarios/UsuarioApi";
import { useNavigate } from "react-router-dom";

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
        nombre?: string;
        codigoAcceso?: string;
        moduloAsistencia?: boolean;
        logoUrl?: string;
        fondoInicioCelularUrl?: string;
    };
}

export const useOptimizedHome = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isEntrenador, setIsEntrenador] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    
    // Refs para evitar múltiples llamadas
    const authLoadedRef = useRef(false);
    const metricsLoadedRef = useRef(false);

    const navigate = useNavigate();

    useEffect(() => {
        // Evitar múltiples inicializaciones
        if (authLoadedRef.current) return;
        authLoadedRef.current = true;

        const userLocal = localStorage.getItem("user");
        const tokenLocal = localStorage.getItem("token");
        const userSession = sessionStorage.getItem("user");
        const tokenSession = sessionStorage.getItem("token");

        const userStr = userLocal || userSession;
        const tokenStr = tokenLocal || tokenSession;

        if (userStr && tokenStr) {
            try {
                const userObj: User = JSON.parse(userStr);
                setCurrentUser(userObj);
                setToken(tokenStr);
                const admin = userObj.rol === "Admin";
                setIsAdmin(admin);
                setIsEntrenador(userObj.rol === "Entrenador" || admin);
                
                // Cargar métricas solo después de tener el usuario
                loadMetrics(userObj.rol);

                // Actualizar última conexión al abrir la app o entrar con sesión recordada
                // y sincronizar fcmTokens desde la base de datos
                UsuarioApi.actualizarUltimaConexion()
                    .then((res) => {
                        if (res && Array.isArray(res.fcmTokens)) {
                            const storage = localStorage.getItem("user") ? localStorage : sessionStorage;
                            const storedStr = storage.getItem("user");
                            if (storedStr) {
                                const parsed = JSON.parse(storedStr);
                                parsed.fcmTokens = res.fcmTokens;
                                storage.setItem("user", JSON.stringify(parsed));
                            }
                            setCurrentUser((prev) => prev ? { ...prev, fcmTokens: res.fcmTokens } : prev);
                        }
                    })
                    .catch((err) => {
                        console.error("Error actualizando última conexión:", err);
                    });

            } catch (error) {
                console.error("Error sesión:", error);
                logout();
            }
        }
        setIsLoading(false);
    }, []);

    const loadMetrics = async (userRole: string) => {
        // Evitar múltiples cargas de métricas y solo cargar para roles autorizados
        if (metricsLoadedRef.current || !userRole || userRole === '' || userRole === 'Usuario') return;
        metricsLoadedRef.current = true;

        try {
            const data = await DashboardApi.getMetrics(userRole);
            setMetrics(data);
        } catch (error) {
            console.error("Error loading dashboard metrics", error);
        }
    };

    const login = (user: User, accessToken: string, refreshToken: string, remember: boolean = true) => {
        const storage = remember ? localStorage : sessionStorage;
        
        storage.setItem("token", accessToken);
        storage.setItem("refreshToken", refreshToken);
        storage.setItem("user", JSON.stringify(user));

        setCurrentUser(user);
        setToken(accessToken);
        const admin = user.rol === "Admin";
        setIsAdmin(admin);
        setIsEntrenador(user.rol === "Entrenador" || admin);
        
        // Resetear métricas para que se carguen con el nuevo rol
        metricsLoadedRef.current = false;
        loadMetrics(user.rol);

        UsuarioApi.actualizarUltimaConexion().catch((err) => {
            console.error("Error actualizando última conexión:", err);
        });
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        sessionStorage.clear();

        setIsAdmin(false);
        setIsEntrenador(false);
        setCurrentUser(null);
        setToken(null);
        setMetrics(null);
        
        // Resetear refs para futuras sesiones
        authLoadedRef.current = false;
        metricsLoadedRef.current = false;

        navigate("/login", { replace: true });
    };

    return { 
        isAdmin,
        isEntrenador, 
        currentUser,
        token,
        isLoading,
        metrics,
        login,
        logout
    };
};
