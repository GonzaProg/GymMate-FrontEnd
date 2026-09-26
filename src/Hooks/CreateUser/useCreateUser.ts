import { useState } from "react";
import { useAuthUser } from "../Auth/useAuthUser";
import { AuthApi, type CreateUserDTO } from "../../API/Auth/AuthApi";
import { showSuccess, showError } from "../../Helpers/Alerts";
import { useGymConfig } from "../../Context/GymConfigContext";

export const useCreateUser = () => {

  const { isAdmin } = useAuthUser();
  const { gymCode } = useGymConfig(); // OBTENER CÓDIGO LOCAL

  // ESTADOS DEL FORMULARIO 
  const [formData, setFormData] = useState<CreateUserDTO>({
    dni: "",
    nombre: "",
    apellido: "",
    contraseña: "",
    telefono: "",
    gmail: "",
    fechaNacimiento: "",
    rol: "Alumno"
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    // Validar campos vacíos
    if (!formData.dni || !formData.contraseña || !formData.nombre) {
      return showError("Por favor completa los campos obligatorios (*)");
    }

    // Validar formato DNI
    if (!/^\d+$/.test(formData.dni)) {
      return showError("El DNI debe contener solo números.");
    }

    // Validar formato Gmail
    if (formData.gmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.gmail)) {
      return showError("El correo electrónico no tiene un formato válido.");
    }

    // Seguridad
    if (formData.rol === "Entrenador" && !isAdmin) {
      return showError("No tienes permisos para crear un Entrenador.");
    }

    setLoading(true);

    try {
      // INYECTAR EL CÓDIGO DEL GIMNASIO AL CREAR
      const dataToSend: any = {
        ...formData,
        codigoGym: gymCode || undefined,
        esCreacionAdmin: true
      };

      // No enviar fechaNacimiento si está vacío
      if (!dataToSend.fechaNacimiento) {
        delete dataToSend.fechaNacimiento;
      }

      // No enviar telefono si está vacío
      if (!dataToSend.telefono) {
        delete dataToSend.telefono;
      }

      // No enviar gmail si está vacío
      if (!dataToSend.gmail) {
        delete dataToSend.gmail;
      }

      await AuthApi.createUser(dataToSend);

      await showSuccess(`Usuario ${formData.nombre} creado con éxito!`);
      window.location.reload();

    } catch (error: any) {
      const msg = error.response?.data?.error || error.message || "Error al crear usuario";
      showError("❌ Error: " + msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => window.location.reload();

  return {
    formData,
    isAdmin,
    loading,
    handleChange,
    handleSubmit,
    handleCancel
  };
};