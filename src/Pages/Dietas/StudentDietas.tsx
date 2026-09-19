import { useState } from "react";
import { useStudentDietas } from "../../Hooks/Dietas/useStudentDietas";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MiDiaSection } from "../../Components/StudentDietas/MiDiaSection";
import { HistorialSection } from "../../Components/StudentDietas/HistorialSection";
import { DietaAsignadaSection } from "../../Components/StudentDietas/DietaAsignadaSection";

export const StudentDietas = () => {
    const { 
        dietaAsignada, 
        registroHoy, 
        historial, 
        comidasPredefinidas,
        platosFavoritos,
        loadingDietas, 
        registrarComida, 
        registrarAgua, 
        borrarComida,
        crearPredefinida,
        actualizarPredefinida,
        eliminarPredefinida,
        crearPlatoFavorito,
        actualizarPlatoFavorito,
        eliminarPlatoFavorito
    } = useStudentDietas();
    
    const navigate = useNavigate();
    const [view, setView] = useState<'HOY' | 'HISTORIAL' | 'DIETA'>('HOY');

    if (loadingDietas && !registroHoy) {
        return <div className="p-8 text-center text-white">Cargando tu información nutricional...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 pb-24 text-white">
            <div className="sticky top-0 z-20 bg-[#121212]/90 backdrop-blur-lg border-b border-white/10 pt-safe">
                <div className="px-4 py-4 flex items-center gap-3">
                    <button onClick={() => navigate('/home')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold">Mi Nutrición</h1>
                </div>
            </div>

            <div className="flex gap-2 p-4 overflow-x-auto scrollbar-none border-b border-white/5">
                {['HOY', 'HISTORIAL', 'DIETA'].map(v => (
                    <button
                        key={v}
                        onClick={() => setView(v as any)}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                            view === v ? 'bg-orange-500 text-white' : 'bg-white/10 text-gray-400'
                        }`}
                    >
                        {v === 'HOY' ? 'Mi Día' : v === 'HISTORIAL' ? 'Historial' : 'Dieta Asignada'}
                    </button>
                ))}
            </div>

            {view === 'HOY' && (
                <MiDiaSection 
                    dietaAsignada={dietaAsignada}
                    registroHoy={registroHoy}
                    comidasPredefinidas={comidasPredefinidas}
                    platosFavoritos={platosFavoritos}
                    registrarComida={registrarComida}
                    registrarAgua={registrarAgua}
                    borrarComida={borrarComida}
                    crearPredefinida={crearPredefinida}
                    actualizarPredefinida={actualizarPredefinida}
                    eliminarPredefinida={eliminarPredefinida}
                    crearPlatoFavorito={crearPlatoFavorito}
                    actualizarPlatoFavorito={actualizarPlatoFavorito}
                    eliminarPlatoFavorito={eliminarPlatoFavorito}
                />
            )}

            {view === 'HISTORIAL' && (
                <HistorialSection historial={historial} />
            )}

            {view === 'DIETA' && (
                <DietaAsignadaSection dietaAsignada={dietaAsignada} />
            )}
        </div>
    );
};
