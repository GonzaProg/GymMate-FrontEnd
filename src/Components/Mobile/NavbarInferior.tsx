import { Dumbbell, Medal, User } from "lucide-react";

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
    <div className="fixed bottom-0 left-0 w-full bg-gray-900/95 backdrop-blur-md border-t border-white/10 px-6 z-50 flex justify-around items-center pt-2 pb-safe min-h-[5rem] shadow-2xl">
      {navItems.map((item) => {
        const isActive = activeTab === item.index;
        const IconComponent = item.Icon;

        return (
          <button
            key={item.index}
            onClick={() => setActiveTab(item.index)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 relative pb-2 ${
              isActive ? "text-white scale-110" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {/* Contenedor del icono con animación de rebote al activar */}
            <div className={`transition-transform duration-300 ${isActive ? "animate-bounce-short" : ""}`}>
              <IconComponent isActive={isActive} />
            </div>
            
            <span className={`text-[10px] font-bold tracking-wide uppercase transition-colors ${isActive ? "text-white" : "text-gray-500"}`}>
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