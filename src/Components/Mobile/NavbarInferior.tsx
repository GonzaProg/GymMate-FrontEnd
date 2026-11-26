import { Dumbbell, Medal, User } from "lucide-react";
import { ChristmasNavbarLights } from "./ChristmasNavbarLights";

interface NavbarInferiorProps {
  activeTab: number;
  setActiveTab: (index: number) => void;
}

export const NavbarInferior = ({ activeTab, setActiveTab }: NavbarInferiorProps) => {
  const navItems = [
    { id: "inicio", label: "Inicio", index: 0, Icon: HomeIcon },
    { id: "rutinas", label: "Rutinas", index: 1, Icon: DumbbellIcon },
    { id: "progreso", label: "Progreso", index: 2, Icon: MedalIcon },
    { id: "perfil", label: "Perfil", index: 3, Icon: UserIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-[#0a101d]/95 backdrop-blur-md border-t border-white/10 z-50 pb-safe shadow-[0_-8px_32px_rgba(0,0,0,0.65)]">
      <div className="relative w-full min-h-[5.5rem] px-6 py-3 flex justify-around items-center overflow-hidden">
        {/* Luces de Navidad con neón */}
        <ChristmasNavbarLights />

        {navItems.map((item) => {
          const isActive = activeTab === item.index;
          const IconComponent = item.Icon;

          return (
            <button
              key={item.index}
              onClick={() => setActiveTab(item.index)}
              className={`flex flex-col items-center gap-1 transition-all duration-300 relative z-10 pb-2 ${
                isActive ? "text-white scale-110" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {/* Contenedor del icono con animación de rebote al activar */}
              <div className={`transition-transform duration-300 ${isActive ? "animate-bounce-short" : ""}`}>
                <IconComponent isActive={isActive} />
              </div>
              
              <span className={`text-[10px] font-bold tracking-wide uppercase transition-colors ${isActive ? "text-white" : "text-gray-400"}`}>
                {item.label}
              </span>

              {/* Puntito indicador verde */}
              {isActive && (
                  <span className="absolute -bottom-1 w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e] transition-all duration-300" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

// Propiedades comunes para garantizar que la transición sea solo de color/relleno
const getIconProps = (isActive: boolean) => ({
    fill: isActive ? "currentColor" : "none", // Relleno si está activo
    stroke: "currentColor", // El color del trazo es el actual (gris o blanco)
    strokeWidth: isActive ? 0 : 1.5, // Si está relleno, quitamos el trazo. Si está vacío, trazo fino. Note that Lucide expects a number.
    className: "w-6 h-6 transition-all duration-300"
});

const HomeIcon = ({ isActive }: { isActive: boolean }) => (
  <svg viewBox="0 0 24 24" {...getIconProps(isActive)} strokeLinecap="round" strokeLinejoin="round">
    {/* Una sola forma cerrada que representa la casa con la puerta */}
    <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
  </svg>
);

const DumbbellIcon = ({ isActive }: { isActive: boolean }) => (
  <Dumbbell {...getIconProps(isActive)} />
);

// NUEVO ICONO DE MEDALLA - Hacemos un mapping similar
const MedalIcon = ({ isActive }: { isActive: boolean }) => (
  <Medal {...getIconProps(isActive)} />
);

const UserIcon = ({ isActive }: { isActive: boolean }) => (
  <User {...getIconProps(isActive)} />
);