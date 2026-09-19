import { useState } from "react";
import { useLogin } from "../../Hooks/Login/useLogin"; 
import { useRegister } from "../../Hooks/Login/useRegister"; 
import { PageLayout } from "../../Components/UI/PageLayout";
import { Card } from "../../Components/UI/Card";
import { Input } from "../../Components/UI/Input";
import { Button } from "../../Components/UI/Button";
import fondoLogin from "../../assets/Fondo-Login.jpg";
import { LoginStyles } from "../../Styles/LoginStyles";
import { Link, useNavigate } from "react-router-dom";
import { PlanExpiredModal } from "../../Components/Planes/PlanExpiredModal"; 
import { GymCodeModal } from "../../Components/GymCodeModal/GymCodeModal"; 
import { useGymConfig } from "../../Context/GymConfigContext";
import { Rocket, AlertTriangle, Dumbbell } from "lucide-react";
import logoPlayStore from "../../assets/LogoDescargaPlayStore.png";
import { Capacitor } from "@capacitor/core";

export const Login = () => {
  // Estado para alternar vistas
  const [isRegistering, setIsRegistering] = useState(false);
  const [showGymCodeModal, setShowGymCodeModal] = useState(false);
  const navigate = useNavigate();

  // --- HOOK LOGIN ---
  const { 
    dni, password, rememberMe, error: loginError, loading: loginLoading,          
    showExpiredModal, setShowExpiredModal, handleDniChange, handlePasswordChange, 
    handleRememberMeChange, handleLogin 
  } = useLogin();

  // --- HOOK REGISTRO ---
  const {
    formData, handleChange, handleRegister, loading: registerLoading
  } = useRegister(() => navigate("/home"));

  // --- HOOK GYM CONFIG ---
  const { setGymLocal } = useGymConfig();

  // HANDLER PARA CAMBIAR CÓDIGO
  const handleGymCodeChange = (newCode: string) => {
      setGymLocal(newCode); // Actualiza Contexto y LocalStorage a la vez
      console.log("Código de gym actualizado:", newCode);
  };

  return (
    <PageLayout centered showNavbar={false} backgroundImage={fondoLogin}
        className={isRegistering ? "max-w-2xl transition-all duration-500" : "max-w-md transition-all duration-500"}
    >
      
      {/* MODAL (Solo relevante en login) */}
      <PlanExpiredModal 
        isOpen={showExpiredModal} 
        onClose={() => setShowExpiredModal(false)} 
      />

      {/* MODAL PARA CAMBIAR CÓDIGO DE GIMNASIO */}
      <GymCodeModal 
        isOpen={showGymCodeModal}
        onClose={() => setShowGymCodeModal(false)}
        onCodeChange={handleGymCodeChange}
      />

      <Card className={`${LoginStyles.glassCard} max-w-lg transition-all duration-500`}> 
        
        {/* ENCABEZADO */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-black tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00AEEF] to-[#0071BC]">Gym</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF8C00] to-[#d3932b]">Mate</span>
          </h1>
          <p className="text-gray-200 mt-2 text-lg">
            {isRegistering ? "Crea tu cuenta gratis" : "Inicia sesión para entrenar"}
          </p>
        </div>

        {/* --- FORMULARIO DE REGISTRO --- */}
        {isRegistering ? (
            <div className="space-y-4 animate-fade-in mx-center" onKeyDown={(e) => { if (e.key === 'Enter') handleRegister(e as any); }}>
                
                {/* Nombre y Apellido (Responsive) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required className={LoginStyles.inputDark} />
                    <Input name="apellido" placeholder="Apellido" value={formData.apellido} onChange={handleChange} required className={LoginStyles.inputDark} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Input name="dni" placeholder="DNI" type="number" value={formData.dni} onChange={handleChange} required className={LoginStyles.inputDark} />
                        <span className="text-[15px] text-gray-400 mt-1 block ml-1">Sin puntos, ej: 11222333</span>
                    </div>
                    <div>
                        <Input name="telefono" placeholder="Teléfono" type="tel" value={formData.telefono} onChange={handleChange} className={LoginStyles.inputDark} />
                        <span className="text-[15px] text-gray-400 mt-1 block ml-1">Sin espacios, sin 15, con característica, ej: 3445123456</span>
                    </div>
                </div>
                
                <Input 
                    name="gmail" 
                    placeholder="Gmail" 
                    type="email" 
                    value={formData.gmail} 
                    onChange={handleChange} 
                    className={`${LoginStyles.inputDark} text-gray-400`} 
                    labelClassName={LoginStyles.label}
                />

                <Input 
                    name="fechaNacimiento" 
                    type="date" 
                    value={formData.fechaNacimiento} 
                    onChange={handleChange} 
                    className={`${LoginStyles.inputDark} text-gray-400`} 
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input name="contraseña" placeholder="Contraseña" type="password" value={formData.contraseña} onChange={handleChange} required className={LoginStyles.inputDark} />
                    <Input name="confirmarContrasena" placeholder="Repetir Contraseña" type="password" value={formData.confirmarContrasena} onChange={handleChange} required className={LoginStyles.inputDark} />
                </div>

                <Button type="button" onClick={handleRegister} className={LoginStyles.btnPrimary} fullWidth disabled={registerLoading}>
                    <span className="flex items-center justify-center gap-2">
                        {registerLoading ? "CREANDO CUENTA..." : <>REGISTRARME <Rocket className="w-5 h-5" /></>}
                    </span>
                </Button>

                <div className="text-center pt-4 border-t border-white/10">
                    <p className="text-sm text-gray-300 mb-2">¿Ya tienes una cuenta?</p>
                    <button 
                        type="button"
                        onClick={() => setIsRegistering(false)}
                        className="text-green-400 font-bold hover:text-green-300 transition-colors uppercase text-sm tracking-wide"
                    >
                        Inicia Sesión aquí
                    </button>
                </div>
            </div>
        ) : (
            
        /* --- FORMULARIO DE LOGIN --- */
            <div className="space-y-6 animate-fade-in" onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(e as any); }}>
                <div>
                    <label className={LoginStyles.label}>DNI</label> 
                    <Input 
                        type="text" 
                        inputMode="numeric"
                        placeholder="Ingresa tu DNI" 
                        value={dni} 
                        onChange={handleDniChange} 
                        required 
                        className={LoginStyles.inputDark}
                    />
                </div>

                <div>
                    <label className={LoginStyles.label}>Contraseña</label>
                    <Input 
                        type="password" 
                        placeholder="••••••••" 
                        value={password} 
                        onChange={handlePasswordChange} 
                        required 
                        className={LoginStyles.inputDark} 
                    />
                </div>

                <div className="flex items-center gap-2">
                    <input 
                        id="rememberMe"
                        type="checkbox" 
                        checked={rememberMe}
                        onChange={handleRememberMeChange}
                        className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-green-500 focus:ring-green-500 cursor-pointer"
                    />
                    <label htmlFor="rememberMe" className="text-sm text-gray-300 cursor-pointer select-none">
                        Recordar mis datos
                    </label>
                </div>

                {loginError && (
                    <div className={`${LoginStyles.errorBox} flex items-center gap-2`}>
                        {loginError.includes("Mantenimiento") && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
                        {loginError}
                    </div>
                )}

                <Button type="button" onClick={handleLogin} className={LoginStyles.btnPrimary} disabled={loginLoading}>
                    {loginLoading ? "INGRESANDO..." : "INGRESAR"}
                </Button>
                
                <div className="mt-8 text-center flex flex-col gap-4 border-t border-white/10 pt-6">
                    <div>
                        <p className="text-sm text-gray-300 mb-1">¿Eres nuevo en el gimnasio?</p>
                        <button 
                            type="button"
                            onClick={() => setIsRegistering(true)}
                            className="text-green-400 font-bold hover:text-green-300 transition-colors uppercase text-sm tracking-wide"
                        >
                            ¡Crea tu cuenta ahora!
                        </button>
                    </div>

                    <div className="flex flex-col gap-2">
                        <button 
                            type="button"
                            onClick={() => setShowGymCodeModal(true)}
                            className="text-xs text-gray-500 hover:text-gray-300 transition-colors cursor-pointer flex items-center justify-center gap-2"
                        >
                            <Dumbbell className="w-4 h-4" /> Cambiar código de gimnasio
                        </button>

                        <Link 
                            to="/forgot-password" 
                            className="text-xs text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    {/* LINK DE DESCARGA PLAY STORE */}
                    {!Capacitor.isNativePlatform() && (
                        <div className="flex justify-center animate-fade-in">
                            <a 
                            href="https://play.google.com/store/apps/details?id=com.GymMate.app&hl=es_AR" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:scale-110 transition-transform duration-300"
                            >
                            <img 
                                src={logoPlayStore} 
                                alt="Descargar en Play Store" 
                                className="h-32 w-auto drop-shadow-xl" 
                            />
                            </a>
                        </div>
                    )}
                </div>
            </div>
        )}
      </Card>

      
    </PageLayout>
  );
};