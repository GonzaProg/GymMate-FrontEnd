import { useRef } from 'react';
import { MUSCULOS_PERMITIDOS } from '../../API/Ejercicios/EjerciciosApi';
import { MuscleImageMap } from './MuscleIcons';
import { AppStyles } from '../../Styles/AppStyles';

interface Props {
    selectedMuscle: string | null;
    onSelectMuscle: (muscle: string | null) => void;
}

export const MuscleFilter = ({ selectedMuscle, onSelectMuscle }: Props) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    return (
        <div className="w-full relative py-4">
            {/* Contenedor de Scroll */}
            <div 
                ref={scrollRef}
                className={`flex gap-4 overflow-x-auto pb-4 pt-2 px-10 scroll-px-10 snap-x ${AppStyles.customScrollbarHorizontal}`}
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#374151 #030712' }}
            >
                {MUSCULOS_PERMITIDOS.map(musculo => {
                    const IconSrc = MuscleImageMap[musculo];
                    const isActive = selectedMuscle === musculo;
                    
                    return (
                        <button
                            key={musculo}
                            onClick={() => onSelectMuscle(isActive ? null : musculo)}
                            className={`flex flex-col items-center justify-center min-w-[70px] transition-all duration-300 rounded-xl p-2 snap-start outline-none
                                ${isActive 
                                    ? 'bg-red-500/10 scale-110 shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                                    : 'hover:bg-gray-800/50 hover:scale-105 opacity-80'
                                }
                            `}
                        >
                            {IconSrc ? (
                                <img 
                                    src={IconSrc} 
                                    alt={musculo}
                                    className={`w-14 h-14 object-contain transition-all duration-300 ${isActive ? 'drop-shadow-[0_0_8px_rgba(239,68,68,0.6)] object-contain' : 'grayscale opacity-50 brightness-150'}`} 
                                />
                            ) : (
                                <div className={`w-14 h-14 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${isActive ? 'border-red-500 text-red-500' : 'border-gray-600 text-gray-500'}`}>
                                    <span className="text-[10px]">Sin IMG</span>
                                </div>
                            )}
                            <span className={`text-xs mt-2 font-medium transition-colors ${isActive ? 'text-red-400' : 'text-gray-400'}`}>
                                {musculo}
                            </span>
                        </button>
                    );
                })}
            </div>
            
            {/* Visual gradient edges to show layout scrollability */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#030712] to-transparent pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#030712] to-transparent pointer-events-none"></div>
        </div>
    );
};
