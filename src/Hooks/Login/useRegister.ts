import { useState } from "react";
import { AuthApi } from "../../API/Auth/AuthApi";
import { useAuthUser } from "../Auth/useAuthUser";
import { useGymConfig } from "../../Context/GymConfigContext";
import { showError, showSuccess } from "../../Helpers/Alerts";

export const useRegister = (onSuccess: () => void) => {
    const { login } = useAuthUser(); // Para autologuear al terminar
    const { gymCode } = useGymConfig(); // Obtenemos el código de la PC

    const [formData, setFormData] = useState({
        dni: "",
        nombre: "",
        apellido: "",
        contraseña: "",
        confirmarContrasena: "",
        telefono: "",
        gmail: "",
        fechaNacimiento: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!gymCode) return showError("Error de configuración: Sin código de gimnasio.");
        if (formData.contraseña !== formData.confirmarContrasena) return showError("Las contraseñas no coinciden.");
        if (formData.contraseña.length < 6) return showError("La contraseña debe tener al menos 6 caracteres.");
        if (!formData.fechaNacimiento) {
            return showError("⚠️ Falta completar la fecha de nacimiento.");
        }
        if (!formData.telefono) {
            return showError("⚠️ Falta completar el número de teléfono.");
        }
        const soloDigitosTel = formData.telefono.replace(/\D/g, '').replace(/^0+/, '');
        if (soloDigitosTel.length < 10 || soloDigitosTel.length > 13) {
            return showError("⚠️ El teléfono debe tener 10 dígitos (característica sin 0 + número sin 15). Ej: 3434527343 o 3445458425.");
        }
        if (formData.gmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.gmail)) {
            return showError("⚠️ El correo electrónico no tiene un formato válido.");
        }
        
        setLoading(true);
        try {
            // Preparamos el DTO
            const payload = {
                ...formData,
                rol: "Alumno",
                codigoGym: gymCode // Enviamos el código del gym configurado en la PC
            };

            const response = await AuthApi.createUser(payload);
            
            // Autologin con la respuesta del registro
            login(response.user, response.token, response.refreshToken);
            
            await showSuccess("¡Cuenta creada! Tienes un Plan de Prueba de 1 día 🎁");
            onSuccess(); // Navegar o cerrar form

        } catch (error: any) {
            showError(error.response?.data?.error || "Error al registrarse");
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        handleChange,
        handleRegister,
        loading
    };
};