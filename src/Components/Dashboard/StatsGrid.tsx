import { type DashboardMetrics } from "../../API/Dashboard/DashboardApi";
import { Users, FileText, Dumbbell, TrendingUp } from "lucide-react";

interface Props {
    metrics: DashboardMetrics;
    userRole: string;
}

export const StatsGrid = ({ metrics, userRole }: Props) => {
    const isEntrenador = userRole === 'Entrenador';
    
    return (
        <div className={`grid gap-6 mt-8 ${isEntrenador ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
            
            {/* CARD 1: Alumnos Activos - Solo para Entrenador */}
            {isEntrenador && (
                <StatCard 
                    title="Alumnos Activos" 
                    value={metrics.alumnosActivos} 
                    total={metrics.alumnosTotales}
                    icon={<Users className="w-6 h-6 text-white" />} 
                    color="from-green-500 to-emerald-600" 
                />
            )}

            {/* CARD 2: Rutinas Creadas - Solo para Entrenador */}
            {isEntrenador && (
                <StatCard 
                    title="Rutinas Totales" 
                    value={metrics.rutinasTotales} 
                    icon={<FileText className="w-6 h-6 text-white" />} 
                    color="from-blue-500 to-cyan-600" 
                />
            )}

            {/* CARD 3: Ejercicios - Para todos */}
            <StatCard 
                title="Ejercicios" 
                value={metrics.ejerciciosTotales} 
                icon={<Dumbbell className="w-6 h-6 text-white" />} 
                color="from-purple-500 to-violet-600" 
            />

            {/* CARD 4: Eficiencia - Solo para Entrenador */}
            {isEntrenador && (
                <StatCard 
                    title="Ratio Activos" 
                    value={`${Math.round((metrics.alumnosActivos! / (metrics.alumnosTotales! || 1)) * 100)}%`} 
                    icon={<TrendingUp className="w-6 h-6 text-white" />} 
                    color="from-orange-500 to-amber-600" 
                />
            )}
        </div>
    );
};

// Subcomponente de Tarjeta con diseño Glassmorphism + Gradiente
const StatCard = ({ title, value, icon, color, total }: any) => (
    <div className="relative group overflow-hidden rounded-2xl p-6 bg-gray-900/60 border border-white/5 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-white/10">

        {/* Fondo Gradiente Sutil */}
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
        
        {/* Glow lateral */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${color}`}></div>

        <div className="relative z-10 flex justify-between items-start">
            <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
                <h3 className="text-3xl font-black text-white drop-shadow-md">{value}</h3>
                {total && (
                    <p className="text-xs text-gray-500 mt-1">de {total} registrados</p>
                )}
            </div>
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl shadow-lg shadow-black/50`}>
                {icon}
            </div>
        </div>
    </div>
);