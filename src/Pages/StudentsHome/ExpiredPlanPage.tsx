import { useState } from "react";
import { CloudinaryApi } from "../../Helpers/Cloudinary/Cloudinary";
import { MercadoPagoApi } from "../../API/Pagos/MercadoPagoApi";
import { showError } from "../../Helpers/Alerts";
import MpLogo from "../../assets/MP_RGB_HANDSHAKE_color_horizontal.svg";
import { AppLauncher } from '@capacitor/app-launcher';
import { Capacitor } from '@capacitor/core';
import { useGymCachedImages } from "../../Hooks/StudentsHome/useGymCachedImages";
import { LogOut } from "lucide-react";
import { useOptimizedHome } from "../../Hooks/Home/useOptimizedHome";

interface ExpiredPlanPageProps {
    currentUser: any;
    expiredPlan: any;
}

export const ExpiredPlanPage = ({ currentUser, expiredPlan }: ExpiredPlanPageProps) => {
    const [loadingMP, setLoadingMP] = useState(false);
    const { logout } = useOptimizedHome();

    // Info del Gym
    const gymName = currentUser?.gym?.nombre || "Gimnasio";
    const gymLogoData = currentUser?.gym?.logoUrl ? CloudinaryApi.getUrl(currentUser.gym.logoUrl) : null;
    const fondoGymUrlData = currentUser?.gym?.fondoInicioCelularUrl ? CloudinaryApi.getUrl(currentUser.gym.fondoInicioCelularUrl) : null;

    const { localLogoUrl: gymLogo, localFondoUrl: fondoGymUrl } = useGymCachedImages(gymLogoData, fondoGymUrlData);

    const formatFechaDia = (fechaISO: string) => {
        const d = new Date(fechaISO);
        const diaStr = d.toLocaleDateString('es-AR', { weekday: 'short' }).replace('.', '').replace(',', '');
        const diaCapitalized = diaStr.charAt(0).toUpperCase() + diaStr.slice(1);
        const fechaNums = d.toLocaleDateString('es-AR', { day: 'numeric', month: 'numeric' });
        return `${diaCapitalized} ${fechaNums}`;
    };

    const handlePagoMP = async () => {
        if (expiredPlan?.nombre === "Plan de Prueba") {
            showError("No tienes ningún plan asignado.");
            return;
        }

        try {
            setLoadingMP(true);
            if (!expiredPlan?.userPlanId) {
                showError("No hay un plan previo para renovar");
                setLoadingMP(false);
                return;
            }
            const { init_point } = await MercadoPagoApi.renovarPlan(expiredPlan.userPlanId);
            if (init_point) {
                if (Capacitor.isNativePlatform()) {
                    await AppLauncher.openUrl({ url: init_point });
                } else {
                    window.location.href = init_point;
                }
            }
        } catch (err: any) {
            console.error(err);
            showError("No se pudo iniciar el pago con MercadoPago");
        } finally {
            setLoadingMP(false);
        }
    };

    const fechaDesdeStr = expiredPlan ? formatFechaDia(expiredPlan.fechaInicio) : "---";
    const fechaHastaStr = expiredPlan ? formatFechaDia(expiredPlan.fechaVencimiento) : "---";

    return (
        <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center relative overflow-hidden font-sans">
            {/* Capa de Fondo */}
            {fondoGymUrl && (
                <div 
                    className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-cover bg-center"
                    style={{ backgroundImage: `url(${fondoGymUrl})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-gray-950/90 to-gray-950"></div>
                </div>
            )}

            <div className="relative z-10 w-full max-w-md p-6 animate-fade-in-up">
                
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
                        Hola, <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">{currentUser?.nombre}</span>
                    </h1>
                    <p className="text-red-400/80 text-base font-medium">Tu suscripción ha finalizado.</p>
                </div>

                <div className="bg-black/60 p-6 rounded-3xl shadow-2xl relative overflow-hidden border border-red-500/30 backdrop-blur-xl">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-orange-500"></div>

                    {/* Cabecera de la tarjeta */}
                    <div className="flex items-center gap-4 mb-6 mt-2">
                        {gymLogo ? (
                            <img src={gymLogo} alt="Logo" className="w-16 h-16 rounded-full object-cover border-2 border-red-500 p-0.5 bg-black" />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-[#1c1c1e] border-2 border-red-500 flex items-center justify-center p-0.5 shadow-lg">
                                <span className="font-bold text-white text-sm">{gymName.slice(0,3).toUpperCase()}</span>
                            </div>
                        )}
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-wide">{gymName}</h2>
                            <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 border border-red-500/20 mt-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                                Vencido
                            </span>
                        </div>
                    </div>

                    {expiredPlan?.descripcion && (
                        <p className="text-gray-400 text-xs italic mb-5 line-clamp-2 leading-relaxed">
                            {expiredPlan.descripcion}
                        </p>
                    )}
                    
                    {/* 3 Columnas Info */}
                    <div className="grid grid-cols-3 gap-3 mb-8 bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div>
                            <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">Membresía</p>
                            <p className="text-white font-bold text-sm leading-tight">{expiredPlan?.nombre || "Sin Membresía"}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">Desde</p>
                            <p className="text-white font-bold text-sm leading-tight">{fechaDesdeStr}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">Hasta</p>
                            <p className="text-red-400 font-bold text-sm leading-tight">{fechaHastaStr}</p>
                        </div>
                    </div>

                    {/* BOTÓN DE MERCADOPAGO */}
                    <button
                        onClick={handlePagoMP}
                        disabled={loadingMP}
                        className="w-full flex items-center justify-center py-2 px-4 rounded-xl text-white bg-[#009EE3] hover:bg-[#008CC9] hover:shadow-[0_0_20px_rgba(0,158,227,0.4)] transition-all duration-300 disabled:opacity-50 h-14 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                        {loadingMP ? (
                            <span className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin relative z-10"></span>
                        ) : (
                            <img src={MpLogo} alt="Pagar con MercadoPago" className="h-16 relative z-10 drop-shadow-md" />
                        )}
                    </button>
                    
                    <p className="text-center text-gray-500 text-[11px] mt-4 max-w-[250px] mx-auto leading-relaxed">
                        Paga de forma segura para reactivar tu acceso a la plataforma inmediatamente.
                    </p>
                </div>

                <div className="mt-8 flex justify-center">
                    <button 
                        onClick={logout}
                        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm font-medium"
                    >
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
};
