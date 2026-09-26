import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Scanner } from '@yudiel/react-qr-scanner'; 
import { AppStyles } from "../../Styles/AppStyles";
import { useStudentHome } from "../../Hooks/StudentsHome/useStudentHome";
import { useUserPlan } from "../../Hooks/Planes/useUserPlan";
import { CloudinaryApi } from "../../Helpers/Cloudinary/Cloudinary";
import { Camera, Info, Flame, Dumbbell, Quote, Handshake } from "lucide-react";
import { useFraseMotivacional } from "../../Hooks/StudentsHome/useFraseMotivacional";
import { useGymCachedImages } from "../../Hooks/StudentsHome/useGymCachedImages";
import { useStudentDietas } from "../../Hooks/Dietas/useStudentDietas";
import { useNavigate } from "react-router-dom";
import { MercadoPagoApi } from "../../API/Pagos/MercadoPagoApi";
import { Capacitor } from '@capacitor/core';
import { AppLauncher } from '@capacitor/app-launcher';
import { App as CapacitorApp } from '@capacitor/app';
import { showError } from "../../Helpers/Alerts";
import MpLogo from "../../assets/MP_RGB_HANDSHAKE_color_horizontal.svg";

export const StudentHome = ({ currentUser }: { currentUser: any }) => {
    const [loadingMP, setLoadingMP] = useState<number | null>(null);
    const navigate = useNavigate();
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    
    // Conectamos con nuestro nuevo Hook
    const { 
        concurrencia, loadingConcurrencia, isCheckingIn, handleCheckIn,
        isScannerOpen, setIsScannerOpen, isAsistenciaHabilitada
    } = useStudentHome(currentUser);

    // Lógica para cambiar el texto y color según la cantidad de gente y configuración del Gym
    const getMensajeConcurrencia = (cantidad: number) => {
        const bajaMax = currentUser?.gym?.concurrenciaBajaMax;
        const mediaMax = currentUser?.gym?.concurrenciaMediaMax;

        const fraseBaja = currentUser?.gym?.fraseConcurrenciaBaja;
        const fraseMedia = currentUser?.gym?.fraseConcurrenciaMedia;
        const fraseAlta = currentUser?.gym?.fraseConcurrenciaAlta;

        if (cantidad <= bajaMax) return { texto: fraseBaja, color: "text-green-400" };
        if (cantidad > bajaMax && cantidad <= mediaMax) return { texto: fraseMedia, color: "text-yellow-400" };
        return { texto: fraseAlta, color: "text-orange-400" };
    };

    const { frase, loading: loadingFrase } = useFraseMotivacional();

    // Planes del usuario
    const { activePlans, loading: loadingPlans, fetchMyPlans } = useUserPlan();
    const unexpiredPlans = activePlans.filter(p => p.diasRestantes >= 0);
    const expiredPlans = activePlans.filter(p => p.diasRestantes < 0);
    const planesToShow = unexpiredPlans.length > 0 ? unexpiredPlans : expiredPlans;
    const isUserExpired = unexpiredPlans.length === 0 && expiredPlans.length > 0;

    // Nutrición del usuario
    const { registroHoy, dietaAsignada, loadingDietas } = useStudentDietas();
    
    // Función helper para la fecha
    const formatFechaDia = (fechaISO: string) => {
        const d = new Date(fechaISO);
        const diaStr = d.toLocaleDateString('es-AR', { weekday: 'short' }).replace('.', '').replace(',', '');
        const diaCapitalized = diaStr.charAt(0).toUpperCase() + diaStr.slice(1);
        const fechaNums = d.toLocaleDateString('es-AR', { day: 'numeric', month: 'numeric' });
        return `${diaCapitalized} ${fechaNums}`;
    };

    // Info del Gym para la tarjeta
    const gymName = currentUser?.gym?.nombre || "Gimnasio";
    const gymLogoData = currentUser?.gym?.logoUrl ? CloudinaryApi.getUrl(currentUser.gym.logoUrl) : null;
    const fondoGymUrlData = currentUser?.gym?.fondoInicioCelularUrl ? CloudinaryApi.getUrl(currentUser.gym.fondoInicioCelularUrl) : null;

    // Caché local de las imágenes del gym usando el nuevo hook
    const { localLogoUrl: gymLogo, localFondoUrl: fondoGymUrl } = useGymCachedImages(
        gymLogoData, 
        fondoGymUrlData,
        currentUser?.gym?.fechaModificacionLogo,
        currentUser?.gym?.fechaModificacionFondo
    );

    const handlePagoMP = async (userPlanId: number) => {
        const planToPay = activePlans.find(p => p.userPlanId === userPlanId);
        if (planToPay?.nombre === "Plan de Prueba") {
            showError("No tienes ningún plan asignado.");
            return;
        }

        if (currentUser?.gym && currentUser.gym.tieneMercadoPago === false) {
            showError("El gimnasio no tiene MercadoPago configurado.");
            return;
        }

        try {
            setLoadingMP(userPlanId);
            const { init_point } = await MercadoPagoApi.renovarPlan(userPlanId, Capacitor.isNativePlatform());
            if (init_point) {
                if (Capacitor.isNativePlatform()) {
                    // Usamos AppLauncher.openUrl para forzar a que Android maneje el intent
                    // y abra la app nativa de Mercado Pago si está instalada.
                    await AppLauncher.openUrl({ url: init_point });
                } else {
                    window.location.href = init_point;
                }
            }
        } catch (err: any) {
            console.error(err);
            const errMsg = err.response?.data?.error || "No se pudo iniciar el pago con MercadoPago";
            showError(errMsg);
        } finally {
            setLoadingMP(null);
        }
    };

    // Escuchar el retorno del Deep Link de Mercado Pago
    useEffect(() => {
        if (!Capacitor.isNativePlatform()) return;

        const urlListener = CapacitorApp.addListener('appUrlOpen', (data: any) => {
            if (data.url.includes("gymmate://payment")) {
                // Recargamos el plan para reflejar el pago exitoso
                fetchMyPlans();
            }
        });

        return () => {
            urlListener.then((listener: any) => listener.remove());
        };
    }, []);

    return (
        <div className="pt-safe mt-24 p-0 animate-fade-in pb-32 space-y-6 max-w-lg mx-auto relative">
            
            {/* SECCIÓN CON FONDO DINÁMICO */}
            <div className={`relative p-4 ${fondoGymUrl ? 'overflow-hidden' : ''}`}>
                {/* Capa de Fondo */}
                {fondoGymUrl && (
                    <div 
                        className={`absolute inset-0 z-0 pointer-events-none bg-transparent bg-no-repeat bg-[length:100%_auto] ${currentUser?.gym?.tieneMercadoPago ? 'bg-[35%_20%]' : 'bg-[35%_10%]'}`}
                        style={{ 
                            backgroundImage: `url(${fondoGymUrl})`,
                            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 5%, black 90%, transparent)',
                            maskImage: 'linear-gradient(to bottom, transparent, black 25%, black 90%, transparent)'
                        }}
                    >
                        {/* Sombras profundas para una transición invisible */}
                        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-transparent to-gray-950"></div>
                        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent opacity-60"></div>
                        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                    </div>
                )}

                {/* Contenido sobre el fondo */}
                <div className="relative z-10 space-y-6">
                    <div className="mb-4 px-2">
                        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
                    Hola, <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">{currentUser?.nombre}</span>
                </h1>
                <p className="text-gray-400 text-lg font-medium">¿Qué vamos a entrenar hoy?</p>
            </div>

            {/* PLANES DEL USUARIO */}
            {!loadingPlans && planesToShow.length > 0 && (
                <div className="space-y-4 mb-8">
                    {planesToShow.map(plan => {
                        const estaVencido = plan.diasRestantes < 0;
                        const estaPorVencer = plan.diasRestantes <= 3 && plan.diasRestantes >= 0;
                        const borderColor = estaVencido ? "border-red-500" : (estaPorVencer ? "border-orange-500" : "border-green-500");
                        const fechaDesdeStr = formatFechaDia(plan.fechaInicio);
                        const fechaHastaStr = formatFechaDia(plan.fechaVencimiento);

                        return (
                            <div key={plan.userPlanId} className={`bg-black/50 p-5 rounded-3xl shadow-xl relative overflow-hidden group border border-white/5`}>
                                {/* Cabecera de la tarjeta */}
                                <div className="flex items-center gap-4 mb-6">
                                    {gymLogo ? (
                                        <img src={gymLogo} alt="Logo" className={`w-14 h-14 rounded-full object-cover border-2 ${borderColor} p-0.5 bg-black`} />
                                    ) : (
                                        <div className={`w-14 h-14 rounded-full bg-[#1c1c1e] border-2 ${borderColor} flex items-center justify-center p-0.5 shadow-lg`}>
                                            <span className="font-bold text-white text-xs">{gymName.slice(0,3).toUpperCase()}</span>
                                        </div>
                                    )}
                                    <h2 className="text-xl font-bold text-white tracking-wide">{gymName}</h2>
                                </div>

                                {plan.descripcion && (
                                    <p className="text-gray-400 text-xs italic mb-4 line-clamp-2 leading-relaxed">
                                        {plan.descripcion}
                                    </p>
                                )}
                                
                                {/* 3 Columnas Info */}
                                <div className="grid grid-cols-3 gap-2">
                                    <div>
                                        <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">Membresía</p>
                                        <p className="text-white font-bold text-[13px] leading-tight">{plan.nombre}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">Desde</p>
                                        <p className="text-white font-bold text-[13px] leading-tight">{fechaDesdeStr}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">Hasta</p>
                                        <p className="text-white font-bold text-[13px] leading-tight">{fechaHastaStr}</p>
                                    </div>
                                </div>

                                {/* BOTÓN DE MERCADOPAGO */}
                                {currentUser?.gym?.tieneMercadoPago && (
                                    <div className="mt-5">
                                        <button
                                            onClick={() => handlePagoMP(plan.userPlanId)}
                                            disabled={loadingMP === plan.userPlanId}
                                            className="w-full flex items-center justify-center py-2 px-4 rounded-xl text-white bg-[#009EE3] hover:bg-[#008CC9] transition-colors disabled:opacity-50 h-12"
                                        >
                                            {loadingMP === plan.userPlanId ? (
                                                <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                            ) : (
                                                <img src={MpLogo} alt="Pagar con MercadoPago" className="h-16" />
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
            {/* SI ESTÁ VENCIDO, OCULTAMOS EL RESTO DE LA APP */}
            {!isUserExpired && (
                <>
                    {/* ESPACIADOR PARA VER EL TEXTO DEL FONDO */}
                    {fondoGymUrl && <div className="h-40 md:h-40 pointer-events-none"></div>}

                    {/* NUTRICIÓN */}
                    <div 
                        onClick={() => navigate('/dietas')}
                className={`${AppStyles.glassCard.replace("bg-gray-900/80", "bg-black/50")} mb-8 relative overflow-hidden border-orange-500/20 shadow-lg cursor-pointer transition-transform hover:scale-[1.02] active:scale-95`}
            >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-orange-500/20">
                            <Flame className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold tracking-wide">Mi Nutrición</h3>
                            <p className="text-gray-400 text-xs">{(dietaAsignada && dietaAsignada.caloriasDiarias) ? "Progreso de Hoy" : "Ver mi registro diario"}</p>
                        </div>
                    </div>
                    <span className="text-orange-400 text-sm font-bold bg-orange-500/10 px-3 py-1 rounded-full">Abrir</span>
                </div>
                
                {!loadingDietas && (
                    <div className="relative z-10">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-3xl font-black text-white">{Math.round(registroHoy?.totalCalorias || 0)} <span className="text-sm text-gray-500 font-normal">kcal consumidas</span></span>
                        </div>
                        {dietaAsignada?.caloriasDiarias && (
                            <>
                                <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-1000" 
                                        style={{ width: `${Math.min(((registroHoy?.totalCalorias || 0) / dietaAsignada.caloriasDiarias) * 100, 100)}%` }}
                                    ></div>
                                </div>
                                <p className="text-right text-xs text-gray-400 mt-2">Meta: {dietaAsignada.caloriasDiarias} kcal</p>
                            </>
                        )}
                        
                        <div className="mt-6 space-y-4">
                            {/* Proteínas */}
                            <div>
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-gray-300 font-bold text-sm">Proteínas</span>
                                    <span className="text-white font-bold text-sm">{Math.round(registroHoy?.totalProteinas || 0)}g <span className="text-gray-500 font-normal text-xs">{dietaAsignada?.proteinasDiarias ? `/ ${dietaAsignada.proteinasDiarias}g` : ''}</span></span>
                                </div>
                                {dietaAsignada?.proteinasDiarias && (
                                    <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                                        <div className="h-full bg-red-500 transition-all duration-1000" style={{ width: `${Math.min(((registroHoy?.totalProteinas || 0) / dietaAsignada.proteinasDiarias) * 100, 100)}%` }}></div>
                                    </div>
                                )}
                            </div>
                            {/* Carbohidratos */}
                            <div>
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-gray-300 font-bold text-sm">Carbohidratos</span>
                                    <span className="text-white font-bold text-sm">{Math.round(registroHoy?.totalCarbohidratos || 0)}g <span className="text-gray-500 font-normal text-xs">{dietaAsignada?.carbohidratosDiarios ? `/ ${dietaAsignada.carbohidratosDiarios}g` : ''}</span></span>
                                </div>
                                {dietaAsignada?.carbohidratosDiarios && (
                                    <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                                        <div className="h-full bg-yellow-400 transition-all duration-1000" style={{ width: `${Math.min(((registroHoy?.totalCarbohidratos || 0) / dietaAsignada.carbohidratosDiarios) * 100, 100)}%` }}></div>
                                    </div>
                                )}
                            </div>
                            {/* Grasas */}
                            <div>
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-gray-300 font-bold text-sm">Grasas</span>
                                    <span className="text-white font-bold text-sm">{Math.round(registroHoy?.totalGrasas || 0)}g <span className="text-gray-500 font-normal text-xs">{dietaAsignada?.grasasDiarias ? `/ ${dietaAsignada.grasasDiarias}g` : ''}</span></span>
                                </div>
                                {dietaAsignada?.grasasDiarias && (
                                    <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${Math.min(((registroHoy?.totalGrasas || 0) / dietaAsignada.grasasDiarias) * 100, 100)}%` }}></div>
                                    </div>
                                )}
                            </div>
                            {/* Agua */}
                            <div>
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-gray-300 font-bold text-sm">Agua</span>
                                    <span className="text-white font-bold text-sm">{(registroHoy?.totalAgua || 0).toFixed(2)}L <span className="text-gray-500 font-normal text-xs">{dietaAsignada?.litrosAguaDiarios ? `/ ${dietaAsignada.litrosAguaDiarios}L` : ''}</span></span>
                                </div>
                                {dietaAsignada?.litrosAguaDiarios && (
                                    <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${Math.min(((registroHoy?.totalAgua || 0) / dietaAsignada.litrosAguaDiarios) * 100, 100)}%` }}></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* CONDICIONAL: Solo mostramos la asistencia si el gimnasio la habilitó */}
            {isAsistenciaHabilitada ? (
                <>
                    {/* ACORDEÓN DE INFORMACIÓN */}
                    <div className={AppStyles.glassCard.replace("p-8", "p-2").replace("bg-gray-900/80", "bg-black/20")}>
                        <button 
                            onClick={() => setIsInfoOpen(!isInfoOpen)}
                            className="w-full p-2 flex items-center justify-between hover:bg-white/5 transition-colors rounded-2xl"
                        >
                            <h3 className="text-blue-400 font-bold flex items-center gap-2 text-sm">
                                <span><Info className="w-4 h-4" /></span> ¿Cómo funciona esto?
                            </h3>
                            <span className={`text-gray-400 transition-transform duration-300 ${isInfoOpen ? 'rotate-180' : ''}`}>
                                ▼
                            </span>
                        </button>

                        <div className={`transition-all duration-500 ease-in-out px-4 ${isInfoOpen ? 'max-h-[500px] opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
                            <div className="pt-4 border-t border-white/10 text-gray-300 text-sm leading-relaxed">
                                <p>
                                    ¡Ayúdanos a mantener la información actualizada! <Handshake className="w-4 h-4 inline text-blue-400 mx-1" /><br/><br/>
                                    Toca la <strong>"Camara Verde"</strong> cada vez que llegues al gimnasio.<br/><br/>
                                    Esto nos permite calcular cuánta gente hay entrenando en tiempo real para que todos puedan planificar mejor sus horarios.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* TARJETA DE CONCURRENCIA */}
                    <div className={`${AppStyles.glassCard.replace("bg-gray-900/80", "bg-black/50").replace("backdrop-blur-xl", "")} relative overflow-hidden border-green-500/30 shadow-lg shadow-green-900/10`}>
                        <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/30 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                        
                        {/* BOTÓN COMPACTO DE ESCANEO */}
                        <button 
                            onClick={() => setIsScannerOpen(true)}
                            disabled={isCheckingIn}
                            title="Escanear QR"
                            className="absolute top-3 right-3 z-30 p-2.5 bg-green-500 shadow-lg shadow-green-500/20 rounded-full hover:bg-green-400 active:scale-90 transition-all text-white border border-white/20"
                        >
                            <Camera className="w-5 h-5" />
                        </button>
                        
                        <div className="relative z-10 flex items-start gap-4">
                            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 p-4 rounded-2xl flex-shrink-0 border border-green-500/30 shadow-inner">
                                <Flame className="w-8 h-8 text-orange-500" />
                            </div>
                            
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                    </span>
                                    <h3 className="text-green-400 font-bold tracking-widest uppercase text-[10px]">En Vivo</h3>
                                </div>
                                
                                {loadingConcurrencia ? (
                                    <div className="animate-pulse flex flex-col gap-2 mb-2">
                                        <div className="h-6 bg-white/10 rounded w-3/4"></div>
                                        <div className="h-4 bg-white/5 rounded w-full"></div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-white font-medium text-lg leading-tight mb-2">
                                            Hay aprox. <span className="font-black text-xl">{concurrencia} personas</span>.
                                        </p>
                                        <p className={`text-sm leading-relaxed font-semibold ${getMensajeConcurrencia(concurrencia || 0).color}`}>
                                            {getMensajeConcurrencia(concurrencia || 0).texto}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                // SI EL MÓDULO ESTÁ DESACTIVADO, MOSTRAMOS UN MENSAJE DE MOTIVACIÓN
                <div className={`${AppStyles.glassCard.replace("bg-gray-900/80", "bg-black/50").replace("backdrop-blur-xl", "")} text-center py-12 border-white/5 flex flex-col items-center`}>
                    <Dumbbell className="w-16 h-16 text-white mb-6 animate-pulse" />
                    <h3 className="text-2xl font-black text-white mb-2 tracking-wide">¡Vamos a entrenar!</h3>
                    <p className="text-gray-400 text-sm max-w-xs mx-auto">
                        Desliza hacia los costados para ver tus rutinas o superar tus récords personales.
                    </p>
                </div>
                )}
                </>
            )}
                </div> {/* Cierre de Contenido sobre el fondo */}
            </div>{/* FIN SECCIÓN CON FONDO DINÁMICO */}
            
            <div className="px-4 space-y-6">
                {/* FRASE MOTIVADORA DEL DÍA */}
            <div className={`${AppStyles.glassCard.replace("bg-gray-900/80", "bg-black/50")} relative overflow-hidden border-green-500/20 shadow-lg shadow-green-500/20`}>
                <div className="flex flex-col gap-4 relative z-10">
                    <div className="flex items-start gap-3">
                        <Quote className="w-5 h-5 text-blue-400 flex-shrink-0 opacity-80 mt-0.5" />
                        <div className="flex-1 w-full">
                            <h4 className="text-blue-400 font-bold text-[10px] uppercase tracking-widest mb-1 opacity-90">Frase del Día</h4>
                            
                            {loadingFrase ? (
                                <div className="animate-pulse space-y-2 mt-2">
                                    <div className="h-4 bg-white/10 rounded w-full"></div>
                                    <div className="h-4 bg-white/10 rounded w-3/4"></div>
                                </div>
                            ) : frase ? (
                                <p className="text-gray-300 font-medium text-sm leading-relaxed italic">
                                    "{frase.texto}"
                                </p>
                            ) : null}
                        </div>
                    </div>

                    {/* Imagen opcional en caché */}
                    {(!loadingFrase && frase?.localImageUrl) && (
                        <div className="w-full mt-2 rounded-xl overflow-hidden shadow-lg border border-white/5 relative bg-black/40 flex justify-center items-center p-2">
                            <img 
                                src={frase.localImageUrl} 
                                alt="Motivación Diaria" 
                                className="max-w-full max-h-64 object-contain rounded-lg opacity-90 transition-opacity duration-700 ease-in"
                                onLoad={(e) => (e.currentTarget.style.opacity = '1')}
                            />
                        </div>
                    )}
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
            </div>

            {/* MODAL DEL ESCÁNER DE CÁMARA */}
            {isScannerOpen && createPortal(
                <div className={AppStyles.modalOverlay}>
                    <div className={`${AppStyles.modalContent} p-6 items-center bg-gray-950`}>
                        <h3 className="text-xl font-bold text-white mb-2">Escanea el Código</h3>
                        <p className="text-gray-400 text-sm text-center mb-6">Coloca el código QR de tu gimnasio dentro del recuadro para registrar tu asistencia.</p>
                        
                        {/* Contenedor redondeado para la cámara */}
                        <div className="w-full max-w-sm rounded-3xl overflow-hidden border-4 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)] bg-black aspect-square flex items-center justify-center relative">
                            <Scanner
                                onScan={(result) => {
                                    // Verificamos que haya detectado algo
                                    if (result && result.length > 0) {
                                        setIsScannerOpen(false); // Cerramos la cámara
                                        handleCheckIn(result[0].rawValue); // Extraemos el texto del QR
                                    }
                                }}
                                onError={(error: unknown) => {
                                    if (error instanceof Error) {
                                        console.log(error.message);
                                    } else {
                                        console.log(error);
                                    }
                                }}
                            />
                        </div>

                        <button 
                            onClick={() => setIsScannerOpen(false)} 
                            className={`mt-8 ${AppStyles.btnSecondary} w-full max-w-sm`}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>,
                document.body
            )}
            
        </div>
        </div>  
    );
};