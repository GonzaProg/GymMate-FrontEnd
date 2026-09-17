import { useState } from "react";
import { useProfile } from "../../Hooks/Profile/useProfile";
import { useLogout } from "../../Hooks/Login/useLogout"; // Importamos el hook de logout
import { Input } from "../../Components/UI/Input";
import { Button } from "../../Components/UI/Button";
import { AppStyles } from "../../Styles/AppStyles"; 
import { ProfileStyles } from "../../Styles/ProfileStyles"; 
import { formatearFechaUTC } from "../../Helpers/DateUtils";
import { Camera, Edit2, Lock, LogOut, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";

interface ProfileProps {
  isMobile?: boolean; // Prop para diferenciar el contexto
}

export const Profile = ({ isMobile = false }: ProfileProps) => {
  const { logout } = useLogout();
  const [showDangerZone, setShowDangerZone] = useState(false);
  
  const { 
    loading, 
    userData, 
    isEditingProfile, 
    editForm, 
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
    uploadingImage,
    imagePreview,
    handleDeleteAccount
  } = useProfile();

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-300">Cargando...</div>;
  if (!userData) return <div className="min-h-screen flex items-center justify-center text-red-400">Error: No se pudo cargar el usuario.</div>;

  const avatarSrc = imagePreview || (isEditingProfile ? editForm.fotoPerfil : userData.fotoPerfil);
  
  // Estilos condicionales según el entorno
  const containerClasses = isMobile 
    ? `${AppStyles.contentContainer} mt-32 pt-safe pb-32` // Estilo Mobile (Swiper)
    : AppStyles.customScrollbar;

  const cardWidthClass = isMobile ? "w-full max-w-3xl space-y-8 mx-auto" : "w-full max-w-3xl mx-auto space-y-8";

  return (
    <div className={containerClasses}>
        
        <div className={cardWidthClass}>

          {/* --- CARD PERFIL --- */}
          <div className="w-full backdrop-blur-xl bg-gray-900/10 border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative">
            
            <div className={ProfileStyles.coverGradient}></div>

            <div className="px-6 md:px-10 pb-10">
              <div className={ProfileStyles.avatarContainer}>
                <div className={ProfileStyles.avatarWrapper}>
                  {avatarSrc ? (
                    <img 
                      src={avatarSrc} 
                      alt="Perfil" 
                      className={`${ProfileStyles.avatarImg} ${uploadingImage ? 'opacity-50 grayscale' : ''} transition-all duration-300`} 
                    />
                  ) : (
                    <div className={ProfileStyles.avatarPlaceholder}>
                        {userData.nombre?.charAt(0)}
                    </div>
                  )}

                  {uploadingImage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full z-20 backdrop-blur-sm">
                      <div className="flex flex-col items-center">
                          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                          <span className="text-white text-[10px] font-bold tracking-wider animate-pulse">SUBIENDO</span>
                      </div>
                    </div>
                  )}

                  {isEditingProfile && !uploadingImage && (
                    <label className={ProfileStyles.uploadOverlay}>
                      <Camera className="w-10 h-10 cursor-pointer hover:scale-110 transition-transform text-white opacity-80 backdrop-blur-sm" />
                      <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                    </label>
                  )}
                </div>
              </div>

              {/* Contenido Texto */}
              <div className="text-center">
                {isEditingProfile ? (
                  // MODO EDICIÓN
                  <div className="space-y-5 text-left animate-fade-in-up px-2 md:px-4">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="Nombre" value={editForm.nombre} onChange={e => handleEditChange('nombre', e.target.value)} className={AppStyles.inputDark} labelClassName={AppStyles.label}/>
                      <Input label="Apellido" value={editForm.apellido} onChange={e => handleEditChange('apellido', e.target.value)} className={AppStyles.inputDark} labelClassName={AppStyles.label}/>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={AppStyles.label}>Teléfono</label>
                            <Input 
                                value={editForm.telefono || ""} 
                                onChange={e => handleEditChange('telefono', e.target.value)} 
                                className={AppStyles.inputDark} 
                                labelClassName={AppStyles.label}
                                placeholder="Ej: 3445 123456"
                            />
                        </div>
                        <div>
                            <label className={AppStyles.label}>Gmail</label>
                            <Input 
                                value={editForm.gmail || ""} 
                                onChange={e => handleEditChange('gmail', e.target.value)} 
                                className={AppStyles.inputDark} 
                                labelClassName={AppStyles.label}
                                placeholder="Ej: usuario@gmail.com"
                            />
                        </div>
                        <div>
                            <label className={AppStyles.label}>Fecha Nacimiento</label>
                            <Input 
                                type="date" 
                                value={editForm.fechaNacimiento || ""} 
                                onChange={e => handleEditChange('fechaNacimiento', e.target.value)} 
                                className={AppStyles.inputDark} 
                                labelClassName={AppStyles.label}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input 
                            label="DNI (No editable)"
                            type="text" 
                            value={editForm.dni} 
                            readOnly 
                            className={`${AppStyles.inputDark} bg-gray-800/50 cursor-not-allowed`}
                            labelClassName={AppStyles.label}
                            />
                    </div>

                    <div className="flex flex-col md:flex-row justify-center gap-4 pt-6">
                      <Button variant="ghost" onClick={() => setIsEditingProfile(false)} className={`${AppStyles.btnSecondaryNotFlex} w-full md:w-auto`}>Cancelar</Button>
                      <Button onClick={handleSaveProfile} className={`${AppStyles.btnPrimary} w-full md:w-auto`} disabled={uploadingImage}>
                        {uploadingImage ? 'Guardando...' : 'Guardar Cambios'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  // MODO VISTA
                  <div className="space-y-10">
                    <h2 className={ProfileStyles.nameTitle}>
                      {userData.nombre} <span className="text-green-500">{userData.apellido}</span>
                    </h2>
                    
                    {/* Visualización de datos extra responsive */}
                    <div className="grid grid-cols-1 gap-3 mt-6 w-full md:flex md:flex-row md:justify-center md:gap-4 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                        
                        <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl flex flex-col justify-center items-center w-full md:w-auto md:min-w-[140px]">
                            <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider mb-1">DNI</span>
                            <span className="text-white font-mono font-bold text-lg">{userData.dni}</span>
                        </div>

                        {userData.telefono && (
                            <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl flex flex-col justify-center items-center w-full md:w-auto md:min-w-[140px]">
                                <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider mb-1">Teléfono</span>
                                <span className="text-white font-medium">{userData.telefono}</span>
                            </div>
                        )}

                        {userData.gmail && (
                            <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl flex flex-col justify-center items-center w-full md:w-auto md:min-w-[140px]">
                                <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider mb-1">Gmail</span>
                                <span className="text-white font-medium break-all text-center">{userData.gmail}</span>
                            </div>
                        )}

                        {userData.fechaNacimiento && (
                            <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl flex flex-col justify-center items-center w-full md:w-auto md:min-w-[140px]">
                                <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider mb-1">Nacimiento</span>
                                <span className="text-white font-medium">{formatearFechaUTC(userData.fechaNacimiento)}</span>
                            </div>
                        )}
                    </div>

                    <div className="pt-8">
                      <Button 
                        onClick={() => setIsEditingProfile(true)} 
                        className={ProfileStyles.editProfileBtn}
                      >
                        <Edit2 className="w-5 h-5 inline-block mr-2" /> Editar Perfil
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* --- CARD SEGURIDAD --- */}
          <div className={AppStyles.glassCard + " p-6 md:p-8 bg-gray-900/10"}>
            {!showPasswordSection ? (
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="bg-gray-800 p-2 rounded-lg text-white"><Lock className="w-7 h-7" /></div>
                    <div>
                        <span className="font-bold text-gray-100 text-xl block">Seguridad</span>
                        <span className="text-gray-500 text-sm">Gestiona tu contraseña</span>
                    </div>
                  </div>
                  <button onClick={() => setShowPasswordSection(true)} className="text-green-500 hover:text-green-400 font-bold text-base tracking-wider hover:bg-green-500/10 px-4 py-2 rounded-lg transition-all w-full md:w-auto border border-green-500/20 md:border-transparent mt-2 md:mt-0">
                     Cambiar Contraseña
                  </button>
              </div>
            ) : (
              <div className="animate-fade-in-up space-y-6">
                <h3 className={AppStyles.sectionTitle.replace('text-xl', 'text-lg text-gray-300 border-white/5')}><Lock className="w-5 h-5 inline-block mr-2" /> ACTUALIZAR CONTRASEÑA</h3>
                
                <div className="bg-black/20 p-6 rounded-xl border border-white/5 space-y-4">
                    <Input label="Contraseña Actual" type="password" value={passForm.currentPassword} onChange={e => handlePassChange('currentPassword', e.target.value)} className={AppStyles.inputDark} labelClassName={AppStyles.label}/>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Nueva" type="password" autoComplete="new-password" value={passForm.newPassword} onChange={e => handlePassChange('newPassword', e.target.value)} className={AppStyles.inputDark} labelClassName={AppStyles.label}/>
                        <Input label="Repetir" type="password" autoComplete="new-password" value={passForm.confirmPassword} onChange={e => handlePassChange('confirmPassword', e.target.value)} className={AppStyles.inputDark} labelClassName={AppStyles.label}/>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-center gap-4">
                    <Button variant="ghost" onClick={handleCancelPassword} className={`${AppStyles.btnSecondaryNotFlex} w-full md:w-auto`}>Cancelar</Button>
                    <Button onClick={handleChangePassword} className={`${AppStyles.btnDanger} w-full md:w-auto`}>Actualizar</Button>
                </div>
              </div>
            )}
          </div>

          {/* --- CARD ZONA DE PELIGRO (SOLO ALUMNO) --- */}
          {userData.rol === 'Alumno' && (
            <div className={AppStyles.glassCard + " p-6 md:p-8 bg-red-900/10 border-red-500/20"}>
                <div 
                  className="flex justify-between items-center cursor-pointer select-none"
                  onClick={() => setShowDangerZone(!showDangerZone)}
                >
                    <div className="flex items-center gap-4">
                      <div className="bg-red-500/20 p-2 rounded-lg text-red-500"><AlertTriangle className="w-7 h-7" /></div>
                      <div>
                          <span className="font-bold text-red-500 text-xl block">Zona de Peligro</span>
                          <span className="text-gray-400 text-sm">Opciones destructivas para tu cuenta</span>
                      </div>
                    </div>
                    <div className="text-red-500">
                        {showDangerZone ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                    </div>
                </div>

                {showDangerZone && (
                  <div className="mt-6 pt-6 border-t border-red-500/20 animate-fade-in-up flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                      <div className="text-gray-300 text-sm md:max-w-md">
                          Al eliminar tu cuenta, todos tus datos (rutinas, progresos, dietas, etc.) se borrarán permanentemente. Esta acción <strong>no se puede deshacer</strong>.
                      </div>
                      <button 
                        onClick={handleDeleteAccount} 
                        disabled={loading}
                        className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/50 font-bold px-6 py-3 rounded-xl transition-all w-full md:w-auto mt-4 md:mt-0 shadow-lg"
                      >
                         {loading ? 'Eliminando...' : 'Eliminar Cuenta Permanentemente'}
                      </button>
                  </div>
                )}
            </div>
          )}

          {/* --- CARD CERRAR SESIÓN (SOLO MOBILE/ALUMNO) --- */}
          {isMobile && (
            <div className={AppStyles.glassCard + " p-8 bg-gray-900/10"}>                
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="bg-red-900/30 p-2 rounded-lg"><LogOut className="w-7 h-7 text-red-500" /></div>
                      <span className="font-bold text-gray-100 text-base block">Cerrar Sesión</span>
                    </div>
                    <button 
                      onClick={logout} 
                      className={AppStyles.btnSecondaryNotFlex}
                    >
                       Salir
                    </button>
                </div>
            </div>
          )}

        </div>
    </div>
  );
};