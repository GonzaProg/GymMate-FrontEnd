import { useState, useEffect } from "react";
import { useAuthUser } from "../Auth/useAuthUser"; 
import { UsuarioApi, type UpdateProfileDTO } from "../../API/Usuarios/UsuarioApi"; 
import { showSuccess, showError, showConfirmDelete } from "../../Helpers/Alerts";
import { CloudinaryApi } from "../../Helpers/Cloudinary/Cloudinary"; 
import { useLogout } from "../Login/useLogout"; // Importar hook de logout para eliminar cuenta

export const useProfile = () => {
  const { currentUser } = useAuthUser();
  const { logout } = useLogout();
  const localId = currentUser?.id;

  const [displayUser, setDisplayUser] = useState(currentUser);

  useEffect(() => {
    setDisplayUser(currentUser);
  }, [currentUser]);

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false); 
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  const [editForm, setEditForm] = useState<UpdateProfileDTO>({
    nombre: "",
    dni: "",
    apellido: "",
    fotoPerfil: "",
    telefono: "",         
    gmail: "",
    fechaNacimiento: ""   
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null); 
  const [imagePreview, setImagePreview] = useState<string | null>(null); 

  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passForm, setPassForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (displayUser) {
      let fechaFormateada = "";
      if (displayUser.fechaNacimiento) {
          fechaFormateada = new Date(displayUser.fechaNacimiento).toISOString().split('T')[0];
      }

      setEditForm({
        nombre: displayUser.nombre || "",
        dni: displayUser.dni || "", 
        apellido: displayUser.apellido || "", 
        fotoPerfil: displayUser.fotoPerfil || "",
        telefono: displayUser.telefono || "",           
        gmail: displayUser.gmail || "",
        fechaNacimiento: fechaFormateada            
      });
    }
  }, [displayUser]);

  const handleEditChange = (field: keyof UpdateProfileDTO, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePassChange = (field: string, value: string) => {
    setPassForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    if (!localId) return;

    if (editForm.gmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.gmail)) {
        return showError("⚠️ El correo electrónico no tiene un formato válido.");
    }

    setLoading(true);

    try {
      let finalImageUrl = editForm.fotoPerfil; 

      if (selectedFile) {
          setUploadingImage(true);

          // 1. BORRAR FOTO ANTERIOR
          if (editForm.fotoPerfil && editForm.fotoPerfil.includes("cloudinary")) {
              await CloudinaryApi.delete(editForm.fotoPerfil, 'image');
          }
          
          // 1. OBTENEMOS DATOS DEL GYM
          // Usamos el codigo de acceso del gym para que sea único. 
          // Si no tiene gym (ej: Admin global), va a 'Usuarios/Admin'
          const gymFolder = currentUser?.gym?.codigoAcceso 
              ? `Usuarios/Gym_${currentUser.gym.codigoAcceso}` // Ej: Usuarios/Gym_15
              : `Usuarios/Admin`;

          // 2. LLAMAMOS AL UPLOAD CON LA CARPETA DINÁMICA
          // Param 1: Archivo
          // Param 2: Tipo de preset ('usuarios')
          // Param 3: Ruta carpeta (gymFolder)
          finalImageUrl = await CloudinaryApi.upload(selectedFile, 'usuarios', gymFolder);
          
          setUploadingImage(false);      }

      const updatedDTO: UpdateProfileDTO = {
        ...editForm,
        fotoPerfil: finalImageUrl
      };

      const data = await UsuarioApi.update(localId, updatedDTO);
      
      const updatedUser = { ...displayUser, ...data };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setDisplayUser(updatedUser);
      
      setIsEditingProfile(false);
      setSelectedFile(null);
      setImagePreview(null);
      
      showSuccess("Datos actualizados correctamente.");

    } catch (error: any) {
      setUploadingImage(false);
      showError(error.response?.data?.error || error.message || "Error al actualizar");
    } finally {
        setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!localId) return;

    const currentPass = passForm.currentPassword.trim();
    const newPass = passForm.newPassword.trim();
    const confirmPass = passForm.confirmPassword.trim();

    if (!currentPass || !newPass || !confirmPass) return showError("Todos los campos son obligatorios");
    if (newPass !== confirmPass) return showError("Las nuevas contraseñas no coinciden");
    
    setLoading(true);
    try {
      const passwordData = {
          currentPassword: currentPass,
          newPassword: newPass,
          confirmPassword: confirmPass
      };

      await UsuarioApi.changePassword(localId, passwordData as any);
      showSuccess("Contraseña modificada con éxito.");
      setShowPasswordSection(false);
      setPassForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); 
    } catch (error: any) {
      showError(error.response?.data?.error || "Error al cambiar contraseña");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPassword = () => {
    setShowPasswordSection(false);
    setPassForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleDeleteAccount = async () => {
    if (!localId) return;

    const confirm = await showConfirmDelete(
        "¿Eliminar Cuenta?",
        "Esta acción es irreversible. Se eliminarán todos tus datos personales, rutinas, dietas y progresos."
    );

    if (confirm.isConfirmed) {
        setLoading(true);
        try {
            await UsuarioApi.deleteAccount(localId);
            // La API borrará el usuario, ahora limpiamos la sesión del frontend
            logout(); // Ya redirige a login y limpia localStorage
        } catch (error: any) {
            showError(error.response?.data?.error || "Ocurrió un error al intentar eliminar la cuenta.");
        } finally {
            setLoading(false);
        }
    }
  };

  return {
    loading,
    uploadingImage, 
    userData: displayUser,
    isEditingProfile,
    editForm,
    imagePreview, 
    showPasswordSection,
    passForm,
    setIsEditingProfile,
    setShowPasswordSection,
    handleEditChange,
    handlePassChange,
    handleImageUpload,
    handleSaveProfile,
    handleChangePassword,
    handleCancelPassword,
    handleDeleteAccount
  };
};