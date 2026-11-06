export const ProfileStyles = {
    // Header Decorativo
    coverGradient: "h-36 bg-gradient-to-r from-green-900 to-blue-900/40 relative",

    // Contenedor Foto
    avatarContainer: "relative flex justify-center -mt-20 mb-6",
    avatarWrapper: "w-32 h-32 rounded-full border-[6px] border-gray-800 bg-gray-700 shadow-2xl overflow-hidden relative group z-10",
    avatarImg: "w-full h-full object-cover",
    avatarPlaceholder: "w-full h-full flex items-center justify-center text-6xl text-gray-400 font-bold",

    // Overlay para subir foto
    uploadOverlay: "absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer text-white opacity-0 group-hover:opacity-100 transition-opacity",

    // Textos Perfil
    nameTitle: "text-4xl md:text-5xl font-black capitalize text-white tracking-tight drop-shadow-lg",
    usernameSubtitle: "text-base md:text-lg text-gray-300 font-medium",

    // Botón Editar grande
    editProfileBtn: "bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-base py-3 px-8 rounded-xl flex items-center gap-3 mx-auto transition-all hover:scale-105"
};