import { AppStyles } from "./AppStyles";

export const MyRoutinesStyles = {
    // Grid Principal
    grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",

    // Tarjeta de Rutina (Grid Item)
    routineCard: "w-full backdrop-blur-xl bg-gray-900/80 border border-white/10 rounded-2xl shadow-xl p-6 relative overflow-hidden group hover:border-green-500/50 hover:bg-gray-800/90 transition-all duration-300 cursor-pointer hover:-translate-y-1",

    cardHeader: "border-b border-white/10 pb-3 mb-4",
    cardTitle: "text-2xl font-bold text-white truncate",
    profeTag: "text-sm text-green-400 font-bold tracking-wider mt-1",

    // Lista de ejercicios en tarjeta
    exerciseList: "space-y-2",
    exerciseItem: "text-base flex justify-between text-gray-300 border-b border-white/5 pb-1 last:border-0",
    moreExercisesBadge: "text-xs text-green-500 font-bold mt-3 text-center bg-green-500/10 py-1 rounded",

    viewDetailBtn: "text-white text-xs font-bold group-hover:text-green-400 transition-colors flex items-center justify-center gap-1",

    // --- Modal Detalle Específico ---
    modalHeader: "bg-gray-800/50 p-6 border-b border-white/10 flex justify-between items-start relative",
    modalBody: `p-6 flex-1 space-y-4 bg-gray-900 ${AppStyles.customScrollbar}`,
    exerciseRow: "bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 hover:bg-white/10 transition-colors",

    // Métricas (Cajitas de peso/reps)
    metricBox: "bg-black/40 p-2 rounded-lg w-16 border border-white/5 text-center",
    metricLabel: "text-[10px] text-gray-500 font-bold uppercase",
    metricValue: "font-bold text-white text-lg",

    videoBtn: "text-blue-400 text-sm font-bold flex items-center gap-1 hover:text-blue-300 mt-2 bg-blue-500/10 px-3 py-1 rounded transition-colors",

    // Videos Ejercicios
    videoContainer: "fixed inset-0 z-[1200] bg-black/95 flex flex-col items-center justify-center animate-fade-in backdrop-blur-xl pt-safe pb-safe",

    // Boton Cerrar Video
    closeVideoBtn: "absolute top-safe-offset right-safe-offset z-[1210] text-white bg-white/15 hover:bg-red-500/80 rounded-full w-12 h-12 flex items-center justify-center transition border border-white/20 shadow-lg backdrop-blur-md cursor-pointer touch-manipulation",
};