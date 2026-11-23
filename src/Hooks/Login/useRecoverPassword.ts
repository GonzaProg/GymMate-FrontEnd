import { useState } from "react";
import { AuthApi } from "../../API/Auth/AuthApi";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../../Helpers/Alerts";
import { useGymConfig } from "../../Context/GymConfigContext";

export const useRecoverPassword = () => {
    const navigate = useNavigate();
    const { gymCode } = useGymConfig();
    
    // Pasos: 1 = Seleccionar Método, 2 = Pedir DNI, 3 = Pedir Código y Clave
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Datos
    const [metodo, setMetodo] = useState<'whatsapp' | 'email'>('whatsapp');
    const [dni, setDni] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Para guardar el destino del código (teléfono o email)
    const [destinoRecuperacion, setDestinoRecuperacion] = useState("");

    // PASO 1: SELECCIONAR MÉTODO (Pasa al paso 2)
    const handleSelectMethod = (selectedMethod: 'whatsapp' | 'email') => {
        setMetodo(selectedMethod);
        setStep(2);
    };

    // PASO 2: ENVIAR DNI 
    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            // Guardamos la respuesta de la API (incluyendo gymCode para evitar colisiones si el DNI está en varios gyms)
            const response = await AuthApi.forgotPassword(dni.trim(), metodo, gymCode || undefined); 
            
            // Guardamos el destino recibido para mostrarlo
            if (response.destino || response.telefono) {
                setDestinoRecuperacion(response.destino || response.telefono);
            }
            
            setStep(3); 
        } catch (err: any) {
            const msg = err.response?.data?.error || "Error al enviar código.";
            setError(msg);
            if (msg.includes("no tiene un correo electrónico")) {
                 showError("No tienes un correo registrado. Contacta a la administración o usa WhatsApp.");
            }
        } finally {
            setLoading(false);
        }
    };

    // PASO 3: CAMBIAR CLAVE 
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // 1. VALIDACIÓN: Campos vacíos
        if (!newPassword || !confirmPassword) {
            setError("Por favor completa ambos campos de contraseña.");
            return;
        }

        // 2. VALIDACIÓN: Coincidencia
        if (newPassword !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        // 3. VALIDACIÓN: Longitud (Opcional pero recomendado)
        if (newPassword.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await AuthApi.resetPassword({ token: code, nuevaContrasena: newPassword });
            showSuccess("¡Contraseña actualizada! Ingresa con tus nuevos datos.");
            navigate("/login");
        } catch (err: any) {
            setError(err.response?.data?.error || "Código inválido o expirado.");
        } finally {
            setLoading(false);
        }
    };

    return {
        step,
        setStep,
        loading,
        error,
        metodo,
        handleSelectMethod,
        dni, setDni,
        code, setCode,
        newPassword, setNewPassword,
        confirmPassword, setConfirmPassword,
        destinoRecuperacion,
        handleSendCode,
        handleChangePassword
    };
};