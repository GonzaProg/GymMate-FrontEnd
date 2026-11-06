import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../../Hooks/Auth/useAuthUser";
import { useGymCachedImages } from "../../Hooks/StudentsHome/useGymCachedImages";

export const NavbarSuperior = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuthUser();
  const { localLogoUrl } = useGymCachedImages(
    currentUser?.gym?.logoUrl, 
    currentUser?.gym?.fondoInicioCelularUrl,
    currentUser?.gym?.fechaModificacionLogo,
    currentUser?.gym?.fechaModificacionFondo
  );
  
  const [_, setShowDropdown] = useState(false);
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
        
      </div>
    </nav>

    </>
  );
};