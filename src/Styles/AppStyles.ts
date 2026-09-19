export const AppStyles = {
    // BUSCADOR HERO (Más grande que el input normal)
    searchWrapper: "max-w-2xl mx-auto relative group",
    // searchGlow ponerle color asi: `${AppStyles.searchGlow} bg-gradient-to-r from-green-600 to-blue-600`
    searchGlow: "absolute -inset-1 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000",
    // searchInput ponerle color asi: `${AppStyles.searchInput} focus:border-green-500 focus:ring-1 focus:ring-green-500`
    searchInput: "w-full bg-gray-900/80 border border-gray-600 text-white placeholder-gray-500 rounded-lg py-4 px-6 focus:outline-none transition-all text-lg shadow-xl backdrop-blur-md relative z-10",

    // LAYOUT PRINCIPAL 
    principalContainer: "mt-10 w-full h-full flex flex-col pt-6 animate-fade-in px-4 pb-10 items-center",
    pageContainer: "relative min-h-screen font-sans bg-gray-900 text-gray-200",
    fixedBackground: "fixed inset-0 z-0 bg-cover bg-center bg-fixed brightness-[0.6] contrast-[1.1]",
    contentContainer: "relative z-10 pt-28 pb-10 px-4 w-full flex justify-center",

    // LISTAS Y SUGERENCIAS (Buscador)
    suggestionsList: "absolute z-[100] w-full bg-gray-900 border border-white/20 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] mt-1 max-h-60 overflow-y-auto overflow-x-hidden thin-scrollbar",
    suggestionItem: "p-3 hover:bg-green-600/20 cursor-pointer border-b border-white/5 transition-colors flex items-center gap-3 group",
    avatarSmall: "group-hover:scale-110 transition-transform w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border bg-gray-800 text-green-400 border-green-500/30",

    // Desplegable de Opciones
    darkBackgroundSelect: "bg-gray-900 text-gray-300 py-2",

    // TEXTOS 
    headerContainer: "text-center mb-8 mt-4 animate-fade-in-down",
    title: "text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 drop-shadow-lg",
    subtitle: "text-gray-200 mt-2 text-lg",
    highlight: "text-green-500",

    // COMPONENTES UI COMPARTIDOS 
    glassCard: "w-full backdrop-blur-xl bg-gray-900/80 border border-white/10 rounded-2xl shadow-xl p-8 relative overflow-hidden",

    // Inputs
    inputDark: "w-full bg-black/30 border border-white/10 text-white focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 p-3 rounded-lg outline-none transition-all placeholder-gray-500 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert",
    inputDarkBorderOrange: "w-full bg-black/30 border border-orange-700 text-white focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 p-3 rounded-lg outline-none transition-all placeholder-gray-500 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert",
    inputDarkBorderBlue: "w-full bg-black/30 border border-blue-700 text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 p-3 rounded-lg outline-none transition-all placeholder-gray-500 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert",
    inputDarkBorderPurple: "w-full bg-black/30 border border-purple-700 text-white focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 p-3 rounded-lg outline-none transition-all placeholder-gray-500 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert",
    label: "block text-gray-400 text-xs uppercase font-bold tracking-wider mb-2",

    // Botones
    btnPrimary: "bg-green-600/60 hover:bg-green-500 text-white font-bold px-14 py-3 rounded-xl shadow-lg shadow-green-900/20 border border-green-500 transition-all hover:scale-105",
    btnSecondary: "flex-1 bg-transparent border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 font-semibold py-3 px-6 rounded-xl transition-all",
    btnSecondaryNotFlex: "bg-transparent border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 font-semibold py-3 px-6 rounded-xl transition-all",
    btnDanger: "bg-red-600/80 hover:bg-red-500 text-white shadow-lg shadow-red-900/20 px-20 py-3 rounded-xl border border-red-500/20 font-bold transition-all hover:scale-105",
    btnExportRed: "flex items-center justify-center p-2.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-500/20 hover:scale-105",
    btnExportGreen: "flex items-center justify-center p-2.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-xl transition-all border border-emerald-500/20 hover:scale-105",

    // Decoración
    gradientDivider: "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500/50 to-transparent",
    sectionTitle: "text-xl font-bold text-white border-b border-white/10 pb-4 mb-6 flex items-center gap-2",
    numberBadge: "bg-green-600/20 text-green-500 py-1 px-3 rounded-lg text-sm",

    // TABLAS (Resumen Rutina)
    tableHeader: "bg-black/40 text-gray-300 uppercase text-xs font-bold tracking-wider",
    tableRow: "hover:bg-white/5 transition-colors border-b border-white/5 last:border-0",

    // MODAL BASE
    modalOverlay: "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in",
    modalContent: "bg-gray-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-white/10 flex flex-col max-h-[90vh] overflow-hidden",

    // Alertas
    errorBox: "bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-lg mb-6 flex items-center gap-3",
    infoBox: "mt-2 flex items-center gap-2 text-yellow-500/80 bg-yellow-500/10 p-2 rounded-lg border border-yellow-500/20 text-xs font-bold",

    // Botones de acción en listas (Editar/Borrar/Guardar/Cancelar pequeños)
    actionBtnBase: "px-3 py-1 rounded-lg text-sm transition-all border",

    btnSave: "bg-green-600/20 text-green-500 hover:bg-green-600 hover:text-white border-green-500/30",
    btnCancel: "bg-gray-700 text-gray-300 hover:bg-gray-600 border-transparent",
    btnBack: "text-gray-400 hover:text-white flex items-center gap-2 transition-colors text-sm font-bold uppercase tracking-widest cursor-pointer",

    btnIconBase: "p-2 rounded-lg transition-all border",
    btnEdit: "p-2 rounded-lg transition-all border bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-black border-yellow-500/20",
    btnDelete: "p-2 rounded-lg transition-all border bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-black border-red-500/20",

    // Dietas, Iconos de acción en listas (Editar/Borrar)
    iconButtonEditBlue: "p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors",
    iconButtonEditPurple: "p-2 text-purple-400 hover:bg-purple-500/20 rounded-lg transition-colors",
    iconButtonDelete: "p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors",

    // SCROLLBAR PERSONALIZADO OSCURO
    customScrollbar: "overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20",
    customScrollbarHorizontal: "overflow-x-auto [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20",

    // ETIQUETAS DE EJERCICIOS
    tagMuscle: "flex items-center gap-1 text-[10px] md:text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30",
    tagGrip: "flex items-center gap-1 text-[10px] md:text-xs bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded border border-orange-500/30",
    tagElements: "flex items-center gap-1 text-[10px] md:text-xs bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30",

    // X Para Cerrar Modal en Dietas Celular
    iconClose: "p-2 bg-black/40 rounded-full",
};