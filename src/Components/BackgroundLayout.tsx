import React, { useState, useEffect, useMemo } from 'react';

interface BackgroundLayoutProps {
  children: React.ReactNode;
  className?: string;
}

interface SnowflakeConfig {
  id: number;
  left: number;
  size: number;
  opacity: number;
  fallDuration: number;
  fallDelay: number;
  swayDuration: number;
  swayDelay: number;
  swayDistance: number;
  spinDuration: number;
  spinReverse: boolean;
  variant: 'detailed' | 'simple';
  color: string;
}

interface SwayCSSProperties extends React.CSSProperties {
  '--sway-distance': string;
}

const SNOWFLAKE_ANGLES = [0, 60, 120, 180, 240, 300] as const;
const SNOWFLAKE_COLORS = ['#ffffff', '#f0f9ff', '#e0f2fe'] as const;

// Generador determinista para mantener posiciones y velocidades estables entre re-renders
const createSeededRandom = (seed: number) => {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
};

const generateSnowflakes = (count: number): SnowflakeConfig[] => {
  const rand = createSeededRandom(20261225 + count);

  return Array.from({ length: count }, (_, index) => {
    // Profundidad simulada (0 = lejano/pequeño/lento, 1 = cercano/grande/rápido)
    const depth = rand();
    const size = Math.round((10 + depth * 18) * 10) / 10;
    const opacity = Math.round((0.25 + depth * 0.6) * 100) / 100;
    const rawFallDuration = 17 - depth * 9.5 + (rand() - 0.5) * 2;
    const fallDuration = Math.round(Math.min(19, Math.max(6.5, rawFallDuration)) * 10) / 10;
    const fallDelay = Math.round(-rand() * fallDuration * 10) / 10;
    const swayDuration = Math.round((3 + rand() * 3.5) * 10) / 10;
    const swayDelay = Math.round(-rand() * swayDuration * 10) / 10;
    const swayDistance = Math.round(12 + depth * 22);
    const spinDuration = Math.round((8 + (1 - depth) * 10 + rand() * 4) * 10) / 10;

    // Distribución estratificada horizontal para evitar huecos o acumulaciones
    const left = Math.round((((index + 0.15 + rand() * 0.7) / count) * 100) * 100) / 100;

    return {
      id: index,
      left,
      size,
      opacity,
      fallDuration,
      fallDelay,
      swayDuration,
      swayDelay,
      swayDistance,
      spinDuration,
      spinReverse: rand() > 0.5,
      variant: size >= 18 ? 'detailed' : 'simple',
      color: SNOWFLAKE_COLORS[Math.floor(rand() * SNOWFLAKE_COLORS.length)],
    };
  });
};

// 1. ICONO COPO DE NIEVE
const SnowflakeIcon = ({
  size,
  variant,
  spinDuration,
  spinReverse,
}: {
  size: number;
  variant: 'detailed' | 'simple';
  spinDuration: number;
  spinReverse: boolean;
}) => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={variant === 'detailed' ? '1.35' : '1.6'}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      display: 'block',
      width: `${size}px`,
      height: `${size}px`,
      transformOrigin: 'center',
      animation: `snowSpin ${spinDuration}s linear infinite ${spinReverse ? 'reverse' : 'normal'}`,
    }}
  >
    <circle cx="12" cy="12" r={variant === 'detailed' ? '2.4' : '1.8'} fill="currentColor" opacity="0.22" stroke="none" />
    <circle cx="12" cy="12" r={variant === 'detailed' ? '1.1' : '0.9'} fill="currentColor" stroke="none" />

    {SNOWFLAKE_ANGLES.map((angle) => (
      <g key={angle} transform={`rotate(${angle} 12 12)`}>
        {variant === 'detailed' ? (
          <>
            <line x1="12" y1="12" x2="12" y2="2" />
            <path d="M9.7 4 L12 6.2 L14.3 4" />
            <path d="M10.4 7.5 L12 9 L13.6 7.5" />
          </>
        ) : (
          <>
            <line x1="12" y1="12" x2="12" y2="3" />
            <path d="M10.2 5.2 L12 7 L13.8 5.2" />
          </>
        )}
      </g>
    ))}
  </svg>
);

export const BackgroundLayout: React.FC<BackgroundLayoutProps> = ({ children, className = '' }) => {
  // Mobile first para evitar lag en celulares
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : true
  );

  useEffect(() => {
    const checkScreenSize = () => {
      // 768px es el breakpoint estándar entre celular y tablet/escritorio
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Celulares: 24 copos livianos; Escritorio: 48 copos para cubrir pantallas anchas
  const snowflakes = useMemo(() => generateSnowflakes(isMobile ? 24 : 48), [isMobile]);

  return (
    <div style={styles.container} className={className}>
      {/* --- CAPA 0: NEON AURORA ANIMADA + LLUVIA DE NIEVE NAVIDEÑA --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Auroras */}
        <div style={styles.auroraNorth}></div>
        <div style={styles.auroraSouth}></div>
        <div style={styles.auroraEast}></div>
        <div style={styles.auroraWest}></div>

        {/* 2. LLUVIA DE COPOS DE NIEVE */}
        <div style={styles.snowContainer} aria-hidden="true">
          {snowflakes.map((flake) => {
            const swayStyle: SwayCSSProperties = {
              '--sway-distance': `${flake.swayDistance}px`,
              animation: `snowSway ${flake.swayDuration}s ease-in-out ${flake.swayDelay}s infinite alternate`,
            };

            return (
              <div
                key={flake.id}
                style={{
                  ...styles.snowflakeFaller,
                  left: `${flake.left}%`,
                  opacity: flake.opacity,
                  color: flake.color,
                  animation: `snowFall ${flake.fallDuration}s linear ${flake.fallDelay}s infinite`,
                }}
              >
                <div style={swayStyle}>
                  <SnowflakeIcon
                    size={flake.size}
                    variant={flake.variant}
                    spinDuration={flake.spinDuration}
                    spinReverse={flake.spinReverse}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Nebulosa central */}
        <div style={styles.nebula}></div>
      </div>

      {/* --- CAPA 1: CONTENIDO REAL --- */}
      <div className="relative z-10 flex-1 flex flex-col w-full h-full">
        {children}
      </div>

      {/* CSS Animaciones */}
      <style>{`
        @keyframes aurora {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); opacity: 0.3; }
          25% { transform: translateY(-20px) rotate(1deg) scale(1.1); opacity: 0.5; }
          50% { transform: translateY(10px) rotate(-1deg) scale(0.9); opacity: 0.4; }
          75% { transform: translateY(-10px) rotate(2deg) scale(1.05); opacity: 0.6; }
        }
        @keyframes snowFall {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(0, calc(100vh + 80px), 0); }
        }
        @keyframes snowSway {
          0% { transform: translate3d(calc(var(--sway-distance) * -1), 0, 0); }
          100% { transform: translate3d(var(--sway-distance), 0, 0); }
        }
        @keyframes snowSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.2); opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'relative',
    width: '100%',
    minHeight: '100vh',
    background: 'radial-gradient(ellipse at center, #0a0e27 0%, #020515 50%, #000000 100%)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  auroraNorth: {
    position: 'absolute',
    top: '-20%',
    left: '-10%',
    width: '120vw',
    height: '40vh',
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(59, 130, 246, 0.2) 25%, rgba(34, 211, 238, 0.1) 50%, rgba(168, 85, 247, 0.2) 75%, rgba(236, 72, 153, 0.1) 100%)',
    filter: 'blur(40px)',
    borderRadius: '50%',
    animation: 'aurora 15s infinite ease-in-out',
    transform: 'rotate(-15deg)',
  },
  auroraSouth: {
    position: 'absolute',
    bottom: '-20%',
    right: '-10%',
    width: '120vw',
    height: '40vh',
    background: 'linear-gradient(45deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.3) 25%, rgba(6, 182, 212, 0.2) 50%, rgba(59, 130, 246, 0.1) 75%, rgba(139, 92, 246, 0.1) 100%)',
    filter: 'blur(45px)',
    borderRadius: '50%',
    animation: 'aurora 18s infinite ease-in-out reverse',
    transform: 'rotate(10deg)',
  },
  auroraEast: {
    position: 'absolute',
    top: '30%',
    right: '-15%',
    width: '80vw',
    height: '60vh',
    background: 'linear-gradient(225deg, rgba(236, 72, 153, 0.2) 0%, rgba(249, 115, 22, 0.1) 25%, rgba(245, 158, 11, 0.1) 50%, rgba(239, 68, 68, 0.1) 75%, rgba(219, 39, 119, 0.2) 100%)',
    filter: 'blur(50px)',
    borderRadius: '50%',
    animation: 'aurora 20s infinite ease-in-out 2s',
    transform: 'rotate(25deg)',
  },
  auroraWest: {
    position: 'absolute',
    top: '20%',
    left: '-15%',
    width: '80vw',
    height: '60vh',
    background: 'linear-gradient(315deg, rgba(139, 92, 246, 0.2) 0%, rgba(91, 33, 182, 0.1) 25%, rgba(109, 40, 217, 0.1) 50%, rgba(124, 58, 237, 0.1) 75%, rgba(167, 139, 250, 0.2) 100%)',
    filter: 'blur(55px)',
    borderRadius: '50%',
    animation: 'aurora 22s infinite ease-in-out 4s',
    transform: 'rotate(-20deg)',
  },
  snowContainer: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  snowflakeFaller: {
    position: 'absolute',
    top: '-40px',
  },
  nebula: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '60vw',
    height: '60vw',
    transform: 'translate(-50%, -50%)',
    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, rgba(59, 130, 246, 0.03) 30%, rgba(34, 211, 238, 0.02) 60%, transparent 100%)',
    filter: 'blur(100px)',
    borderRadius: '50%',
    animation: 'pulse 8s infinite ease-in-out',
  },
};
