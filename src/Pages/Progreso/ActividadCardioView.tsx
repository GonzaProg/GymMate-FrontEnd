import { useState, useMemo } from "react";
import { useActividadCardio } from "../../Hooks/ActividadCardio/useActividadCardio";
import { AppStyles } from "../../Styles/AppStyles";
import { Input } from "../../Components/UI/Input";
import { ChevronLeft, ChevronRight, Activity, Clock, X, Navigation, Bike, Footprints, Plus, ChevronDown, Trophy, ArrowUp, ArrowDown } from "lucide-react";
import { showError } from "../../Helpers/Alerts";

export const ActividadCardioView = () => {
    const { historial, estadisticas, loading, registrarActividad, eliminarActividad } = useActividadCardio();
    
    // Formulario
    const [tipo, setTipo] = useState("Caminar");
    const [distancia, setDistancia] = useState<number | "">("");
    const [unidad, setUnidad] = useState("km");
    const [tiempoHs, setTiempoHs] = useState<number | "">("");
    const [tiempoMin, setTiempoMin] = useState<number | "">("");
    const [isFormOpen, setIsFormOpen] = useState(false);

    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const [selectedDayHist, setSelectedDayHist] = useState<string>(() => {
        const date = new Date();
        const d = date.getDay();
        const index = d === 0 ? 6 : d - 1;
        return diasSemana[index];
    });

    const [weekOffset, setWeekOffset] = useState(0);

    const getLocalDate = (d: Date) => {
        const formatter = new Intl.DateTimeFormat('en-CA', { 
            timeZone: 'America/Argentina/Buenos_Aires', 
            year: 'numeric', month: '2-digit', day: '2-digit' 
        });
        return formatter.format(d);
    };

    const historialSemana = useMemo(() => {
        const now = new Date();
        const localNowStr = getLocalDate(now);
        const localNow = new Date(`${localNowStr}T12:00:00Z`);
        
        const dayOfWeek = localNow.getUTCDay();
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const thisMonday = new Date(localNow);
        thisMonday.setUTCDate(localNow.getUTCDate() - daysToMonday);
        
        const startOfWeek = new Date(thisMonday);
        startOfWeek.setUTCDate(startOfWeek.getUTCDate() - (weekOffset * 7));
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6);
        
        const startStr = startOfWeek.toISOString().split('T')[0];
        const endStr = endOfWeek.toISOString().split('T')[0];

        return historial.filter(h => h.fecha >= startStr && h.fecha <= endStr);
    }, [historial, weekOffset]);

    const historialDiaSeleccionado = useMemo(() => {
        return historialSemana.filter(act => {
            const d = new Date(`${act.fecha}T12:00:00Z`).getDay();
            const index = d === 0 ? 6 : d - 1;
            return diasSemana[index] === selectedDayHist;
        });
    }, [historialSemana, selectedDayHist]);

    const handleGuardar = async () => {
        if (!distancia || distancia <= 0) return showError("Ingresa una distancia válida");
        
        const hs = Number(tiempoHs) || 0;
        const min = Number(tiempoMin) || 0;
        const totalMinutos = (hs * 60) + min;

        if (totalMinutos <= 0) return showError("Ingresa un tiempo válido");

        const success = await registrarActividad({
            tipo,
            distancia,
            unidad,
            tiempoMinutos: totalMinutos
        });

        if (success) {
            setDistancia("");
            setTiempoHs("");
            setTiempoMin("");
            setIsFormOpen(false);
        }
    };

    const isFormValid = distancia && distancia > 0 && ((tiempoHs && tiempoHs >= 0) || (tiempoMin && tiempoMin > 0));

    const getIcono = (tipoAct: string) => {
        if (tipoAct === 'Caminar' || tipoAct === 'Correr') return <Footprints className="w-5 h-5 text-orange-400" />;
        if (tipoAct === 'Bicicleta') return <Bike className="w-5 h-5 text-orange-400" />;
        return <Activity className="w-5 h-5 text-orange-400" />;
    };

    const getStatsForPeriod = (stats: any, prevStats?: any) => {
        if (!stats) return null;
        const caminarKm = (stats.caminar_km || 0) + ((stats.caminar_pasos || 0) / 1300);
        const correrKm = (stats.correr_km || 0) + ((stats.correr_pasos || 0) / 1300);
        const biciKm = stats.bici_km || 0;
        const totalKm = caminarKm + correrKm + biciKm;
        
        let diff = 0;
        let hasPrev = false;
        if (prevStats) {
            const prevCaminar = (prevStats.caminar_km || 0) + ((prevStats.caminar_pasos || 0) / 1300);
            const prevCorrer = (prevStats.correr_km || 0) + ((prevStats.correr_pasos || 0) / 1300);
            const prevBici = prevStats.bici_km || 0;
            const prevTotal = prevCaminar + prevCorrer + prevBici;
            if (prevTotal > 0) {
                hasPrev = true;
                diff = totalKm - prevTotal;
            }
        }
    
        return { caminarKm, correrKm, biciKm, totalKm, diff, hasPrev };
    };

    const StatCard = ({ title, periodStats, isYear }: { title: string, periodStats: any, isYear?: boolean }) => {
        if (!periodStats) return null;
        return (
            <div className={`p-4 rounded-2xl border flex items-center justify-between relative overflow-hidden ${isYear ? 'bg-gradient-to-r from-orange-500/20 to-orange-900/20 border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]' : 'bg-gray-900/50 border-white/5'}`}>
                {isYear && <Trophy className="absolute right-4 top-1/2 -translate-y-1/2 w-20 h-20 text-orange-500/10 rotate-12 pointer-events-none" />}
                
                {/* Izquierda: Título y Total */}
                <div className="flex flex-col relative z-10 w-1/2">
                    <span className={`text-sm font-bold uppercase mb-1 ${isYear ? 'text-orange-400' : 'text-gray-400'}`}>{title}</span>
                    <div className="flex items-baseline gap-1">
                        <span className={`${isYear ? 'text-orange-100' : 'text-white'} font-bold text-3xl md:text-4xl`}>{periodStats.totalKm.toFixed(1)}</span>
                        <span className={`${isYear ? 'text-orange-500/50' : 'text-gray-500'} text-sm`}>km</span>
                    </div>
                    {periodStats.hasPrev && (
                        <div className={`mt-2 text-[14px] flex items-center gap-1 font-bold bg-black/20 self-start px-2 py-1 rounded-full ${periodStats.diff >= 0 ? 'text-green-500' : 'text-red-400'}`}>
                            {periodStats.diff >= 0 ? <ArrowUp className="w-3 h-3"/> : <ArrowDown className="w-3 h-3"/>}
                            {Math.abs(periodStats.diff).toFixed(1)} km vs anterior
                        </div>
                    )}
                </div>

                {/* Derecha: Desglose */}
                <div className="flex flex-col items-end justify-center space-y-2 relative z-10 w-1/2 border-l border-white/10 pl-4 py-1">
                    {periodStats.caminarKm > 0 && (
                        <div className="flex items-center justify-end gap-2 text-base w-full">
                            <span className="font-semibold text-white">{periodStats.caminarKm.toFixed(1)} km</span>
                            <span className="flex items-center gap-1 text-gray-400"><Footprints className="w-3 h-3 text-blue-400"/> Caminar</span>
                        </div>
                    )}
                    {periodStats.correrKm > 0 && (
                        <div className="flex items-center justify-end gap-2 text-base w-full">
                            <span className="font-semibold text-white">{periodStats.correrKm.toFixed(1)} km</span>
                            <span className="flex items-center gap-1 text-gray-400"><Activity className="w-3 h-3 text-red-400"/> Correr</span>
                        </div>
                    )}
                    {periodStats.biciKm > 0 && (
                        <div className="flex items-center justify-end gap-2 text-base w-full">
                            <span className="font-semibold text-white">{periodStats.biciKm.toFixed(1)} km</span>
                            <span className="flex items-center gap-1 text-gray-400"><Bike className="w-3 h-3 text-emerald-400"/> Bici</span>
                        </div>
                    )}
                    {periodStats.totalKm === 0 && (
                        <span className="text-xs text-gray-500 italic">Sin actividad</span>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-fade-in pb-24">
            {/* AGREGAR ACTIVIDAD (ACORDEÓN) */}
            <div className={`${AppStyles.glassCard} overflow-hidden`}>
                <button 
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    className="w-full flex items-center justify-between hover:bg-white/5 transition-colors rounded-2xl"
                >
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <Plus className="w-5 h-5 text-orange-500"/> Añadir Actividad
                    </h3>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isFormOpen ? 'rotate-180' : ''}`} />
                </button>

                <div className={`transition-all duration-500 ease-in-out ${isFormOpen ? 'max-h-[800px] opacity-100 pb-5' : 'max-h-0 opacity-0'}`}>
                    <div className="space-y-4 pt-4 border-t border-white/10">
                        <div className="grid grid-cols-2 gap-3">
                            <select
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value)}
                                className={AppStyles.inputDark}
                            >
                                <option value="Caminar" className="bg-gray-900 text-white">Caminar</option>
                                <option value="Correr" className="bg-gray-900 text-white">Correr</option>
                                <option value="Bicicleta" className="bg-gray-900 text-white">Bicicleta</option>
                            </select>
                            <select
                                value={unidad}
                                onChange={(e) => setUnidad(e.target.value)}
                                className={AppStyles.inputDark}
                            >
                                <option value="km" className="bg-gray-900 text-white">Kilómetros</option>
                                <option value="pasos" className="bg-gray-900 text-white">Pasos</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="relative">
                                <Navigation className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <Input
                                    type="number"
                                    min="0"
                                    placeholder={`Distancia (${unidad})`}
                                    value={distancia}
                                    onChange={(e) => setDistancia(e.target.value ? Number(e.target.value) : "")}
                                    className={`${AppStyles.inputDark} pl-10`}
                                />
                            </div>
                            <div className="flex gap-2">
                                <div className="relative w-1/2">
                                    <Clock className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <Input
                                        type="number"
                                        min="0"
                                        placeholder="Hs"
                                        value={tiempoHs}
                                        onChange={(e) => setTiempoHs(e.target.value ? Number(e.target.value) : "")}
                                        className={`${AppStyles.inputDark} pl-8 text-center`}
                                    />
                                </div>
                                <div className="relative w-1/2">
                                    <Input
                                        type="number"
                                        min="0"
                                        placeholder="Min"
                                        value={tiempoMin}
                                        onChange={(e) => setTiempoMin(e.target.value ? Number(e.target.value) : "")}
                                        className={`${AppStyles.inputDark} px-2 text-center`}
                                    />
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleGuardar} 
                            disabled={!isFormValid}
                            className={`w-full rounded-lg shadow-sm flex items-center justify-center gap-2 font-bold py-3 mt-2 transition-all duration-300 ${isFormValid ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-orange-500 text-white cursor-not-allowed opacity-50'}`}
                        >
                            Guardar Actividad
                        </button>
                    </div>
                </div>
            </div>

            {/* ESTADÍSTICAS GLOBALES */}
            {estadisticas && (
                <div className="flex flex-col gap-3">
                    <StatCard title="Esta Semana" periodStats={getStatsForPeriod(estadisticas.semanaActual)} />
                    <StatCard title="Este Mes" periodStats={getStatsForPeriod(estadisticas.mesActual, estadisticas.mesAnterior)} />
                    <StatCard title="Este Año" periodStats={getStatsForPeriod(estadisticas.anioActual, estadisticas.anioAnterior)} isYear={true} />
                </div>
            )}

            {/* HISTORIAL POR SEMANAS Y DÍAS */}
            <div>
                <h3 className="text-white font-bold mb-3 ml-1 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    Historial
                </h3>
                
                <div className="flex items-center justify-between bg-black/30 p-3 rounded-2xl border border-white/5 mb-4">
                    <button 
                        disabled={weekOffset >= 3}
                        onClick={() => setWeekOffset(prev => prev + 1)}
                        className="p-2 text-gray-400 disabled:opacity-30 hover:text-white transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <span className="font-bold text-orange-400">
                        {weekOffset === 0 ? "Esta Semana" : `Hace ${weekOffset} semana${weekOffset > 1 ? 's' : ''}`}
                    </span>
                    <button 
                        disabled={weekOffset === 0} 
                        onClick={() => setWeekOffset(prev => prev - 1)}
                        className="p-2 text-gray-400 disabled:opacity-30 hover:text-white transition-colors"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>

                <div 
                    className="flex gap-2 overflow-x-auto scrollbar-none py-2 border-b border-white/5 mb-4"
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                >
                    {diasSemana.map(dia => (
                        <button
                            key={dia}
                            onClick={() => setSelectedDayHist(dia)}
                            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all ${
                                selectedDayHist === dia ? 'bg-orange-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                        >
                            {dia}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <p className="text-center text-gray-500 py-6">Cargando...</p>
                ) : historialDiaSeleccionado.length === 0 ? (
                    <div className="bg-white/5 rounded-2xl p-6 text-center border border-white/5">
                        <Activity className="w-10 h-10 mx-auto text-gray-600 mb-2" />
                        <p className="text-gray-500 text-sm">No hay actividades registradas en este día.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {historialDiaSeleccionado.map((act) => (
                            <div key={act.id} className="bg-white/5 rounded-2xl p-4 border border-white/5 flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                                        {getIcono(act.tipo)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="text-white font-bold text-base">{act.tipo}</h4>
                                            <span className="text-[10px] text-gray-500 bg-black/50 px-2 py-0.5 rounded-full">
                                                {new Date(`${act.fecha}T12:00:00Z`).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-400">
                                            <span className="flex items-center gap-1 font-semibold text-gray-300">
                                                {act.distancia} {act.unidad}
                                            </span>
                                            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {act.tiempoMinutos} min
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => eliminarActividad(act.id)}
                                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
