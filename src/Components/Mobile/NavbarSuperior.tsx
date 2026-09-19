import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useNotificaciones } from "../../Hooks/Notificaciones/useNotificaciones";
import { useAuthUser } from "../../Hooks/Auth/useAuthUser";
import { useGymCachedImages } from "../../Hooks/StudentsHome/useGymCachedImages";
import { AppStyles } from "../../Styles/AppStyles";
import { Bell, BellOff } from "lucide-react";

export const NavbarSuperior = () => {
  const navigate = useNavigate();
  const { notificaciones, unreadCount, markAsRead, refresh } = useNotificaciones();
  const { currentUser } = useAuthUser();
  const { localLogoUrl } = useGymCachedImages(
    currentUser?.gym?.logoUrl, 
    currentUser?.gym?.fondoInicioCelularUrl,
    currentUser?.gym?.fechaModificacionLogo,
    currentUser?.gym?.fechaModificacionFondo
  );
  
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotifClick = (notif: any) => {
    if (!notif.leida) markAsRead(notif.id);
  };

  return (
    <>
    <nav className="fixed w-full z-50 top-0 start-0 bg-gradient-to-b from-gray-900 via-gray-900/90 to-transparent pt-safe pb-8 transition-all">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 relative">
        
        {/* IZQUIERDA: LOGO MIXTO (TEXTO + IMAGEN) */}
        <div 
            onClick={() => navigate("/home")} 
            className="flex items-center cursor-pointer group z-20 gap-3"
        >
            <span className="self-center text-2xl font-bold whitespace-nowrap">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00AEEF] to-[#0071BC]">Gym</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF8C00] to-[#d3932b]">Mate</span>
            </span>
            {localLogoUrl && (
                <img 
                    src={localLogoUrl} 
                    alt="Logo Gym" 
                    className="h-12 w-12 object-contain"
                />
            )}
        </div>
        
        {/* DERECHA: NOTIFICACIONES */}
        <div className="flex items-center gap-4 z-20">
          <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 text-gray-300 hover:text-white transition-colors hover:bg-white/10 rounded-full focus:outline-none"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-pulse shadow-red-500/50 shadow-lg">
                        {unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <div className="absolute -right-28 top-full mt-2 transform -translate-x-1/2 w-64 sm:w-80 md:w-96 max-w-[90vw] bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-fade-in origin-top ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="p-4 border-b border-white/10 bg-black/20">
                        <h3 className="text-sm font-bold text-white">Notificaciones</h3>
                    </div>
                    <div className={`max-h-80 ${AppStyles.customScrollbar}`}>
                        {notificaciones.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 text-sm flex flex-col items-center">
                                <BellOff className="w-8 h-8 mb-2 opacity-50" />
                                <p>No tienes notificaciones nuevas</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-white/5">
                                {notificaciones.map((n) => (
                                    <li key={n.id} onClick={() => handleNotifClick(n)} className={`p-4 hover:bg-white/5 cursor-pointer transition-colors relative group ${!n.leida ? 'bg-green-500/5' : ''}`}>
                                        {!n.leida && <span className="absolute left-2 top-4 w-2 h-2 rounded-full bg-green-500 shadow-green-500/50 shadow-md"></span>}
                                        <div className="ml-3">
                                            <p className={`text-sm mb-1 ${!n.leida ? 'text-white font-bold' : 'text-gray-300 font-medium'}`}>{n.titulo}</p>
                                            <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-wrap break-words">{n.mensaje}</p>
                                            <span className="text-[10px] text-gray-600 mt-2 block">{new Date(n.fechaCreacion).toLocaleDateString()}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="p-2 bg-black/20 text-center border-t border-white/10">
                        <button onClick={refresh} className="text-xs text-green-500/70 hover:text-green-400 transition-colors">Actualizar lista ↻</button>
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </nav>

    </>
  );
};