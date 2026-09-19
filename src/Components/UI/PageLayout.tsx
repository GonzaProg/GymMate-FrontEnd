import React from "react";
import { NavbarSuperior } from "../Mobile/NavbarSuperior";

interface PageLayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
  centered?: boolean;
  backgroundImage?: string;
  className?: string; // NUEVA PROP para permitir personalizar el contenedor interno
}

export const PageLayout = ({ 
  children, 
  showNavbar = true, 
  centered = false,
  backgroundImage,
  className = "" // Valor por defecto vacío
}: PageLayoutProps) => {
  
  // --- MODO LOGIN (Centrado) ---
  if (centered) {
    return (
      <div 
        className={`min-h-screen w-full flex items-center justify-center relative overflow-y-auto py-10 ${!backgroundImage ? "bg-gradient-to-br from-green-900 via-green-700 to-green-500" : ""}`}
        style={backgroundImage ? { 
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        } : {}}
      >
        {backgroundImage && (
          <div className="absolute inset-0 bg-black/30 z-0"></div> // Oscurecimiento unificado
        )}

        {/* AQUÍ ESTÁ EL CAMBIO CLAVE: */}
        {/* Si pasamos className, lo usa. Si no, usa max-w-md por defecto */}
        <div className={`w-full p-4 relative z-10 mx-auto ${className || 'max-w-md'}`}>
          {children}
        </div>
      </div>
    );
  }

  // --- MODO NORMAL (Sin cambios) ---
  return (
    <div 
      className="min-h-screen flex flex-col relative"
      style={backgroundImage ? { 
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      } : {}}
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-black/60 z-0"></div> 
      )}
      
      {showNavbar && <div className="relative z-20"><NavbarSuperior /></div>}
      
      <div className={`container mx-auto p-4 relative z-10 flex-1 mt-6 ${!backgroundImage ? "bg-gray-100" : ""}`}>
        {children}
      </div>
    </div>
  );
};