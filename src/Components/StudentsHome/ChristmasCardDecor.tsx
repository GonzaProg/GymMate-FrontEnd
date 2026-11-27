import React from "react";

export type ChristmasSectionVariant =
  | "planes"
  | "anuncios"
  | "concurrencia"
  | "nutricion"
  | "frase"
  | "evo-form"
  | "evo-empty"
  | "evo-card-1"
  | "evo-card-2"
  | "evo-card-3"
  | "pr-info"
  | "pr-form"
  | "pr-card-1"
  | "pr-card-2"
  | "pr-card-3"
  | "cardio-form"
  | "cardio-week"
  | "cardio-month"
  | "cardio-year"
  | "cardio-week-bar"
  | "cardio-empty"
  | "cardio-item-1"
  | "cardio-item-2";

type SnowflakeKind = "classic" | "hex" | "fern" | "starburst" | "floral" | "minimal";
type FourPointStarKind = "sharp" | "outline" | "plump" | "cross";

interface BaseDecorItem {
  id: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  size: number;
  rotate?: number;
  opacity: number;
  color: string;
}

interface SnowflakeItem extends BaseDecorItem {
  type: "snowflake";
  kind: SnowflakeKind;
}

interface StarItem extends BaseDecorItem {
  type: "star";
  kind: FourPointStarKind;
}

type DecorItem = SnowflakeItem | StarItem;

const ANGLES_6 = [0, 60, 120, 180, 240, 300] as const;
const ANGLES_4 = [0, 90, 180, 270] as const;

const StaticSnowflakeSvg = ({
  kind,
  size,
  color,
}: {
  kind: SnowflakeKind;
  size: number;
  color: string;
}) => {
  const commonProps = {
    "aria-hidden": true as const,
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 32 32",
    width: size,
    height: size,
    fill: "none",
    stroke: color,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    style: {
      display: "block",
      filter: `drop-shadow(0 0 5px ${color}) drop-shadow(0 0 10px rgba(186, 230, 253, 0.45))`,
    },
  };

  switch (kind) {
    case "classic":
      return (
        <svg {...commonProps} strokeWidth="1.55">
          <circle cx="16" cy="16" r="1.5" fill={color} stroke="none" />
          {ANGLES_6.map((angle) => (
            <g key={angle} transform={`rotate(${angle} 16 16)`}>
              <line x1="16" y1="16" x2="16" y2="2.5" />
              <path d="M12.8 5.4 L16 8.4 L19.2 5.4" />
              <path d="M13.6 9.8 L16 12.1 L18.4 9.8" />
            </g>
          ))}
        </svg>
      );

    case "hex":
      return (
        <svg {...commonProps} strokeWidth="1.4">
          {/* Anillo hexagonal central */}
          <polygon points="16,11.6 19.8,13.8 19.8,18.2 16,20.4 12.2,18.2 12.2,13.8" />
          {ANGLES_6.map((angle) => (
            <g key={angle} transform={`rotate(${angle} 16 16)`}>
              <line x1="16" y1="11.6" x2="16" y2="2.8" />
              <path d="M13.2 6.8 L16 9.4 L18.8 6.8" />
              <polygon points="16,1.6 17.3,3.5 16,5.2 14.7,3.5" fill={color} stroke="none" />
            </g>
          ))}
        </svg>
      );

    case "fern":
      return (
        <svg {...commonProps} strokeWidth="1.3">
          <circle cx="16" cy="16" r="1.8" />
          {ANGLES_6.map((angle) => (
            <g key={angle} transform={`rotate(${angle} 16 16)`}>
              <line x1="16" y1="14.2" x2="16" y2="2.2" />
              <path d="M13.8 4.4 L16 6.4 L18.2 4.4" />
              <path d="M13.0 7.4 L16 10.0 L19.0 7.4" />
              <path d="M13.8 10.8 L16 12.8 L18.2 10.8" />
            </g>
          ))}
        </svg>
      );

    case "starburst":
      return (
        <svg {...commonProps} strokeWidth="1.45">
          {/* Cristal de 8 ejes alternados */}
          <polygon points="16,13.2 18.8,16 16,18.8 13.2,16" />
          {ANGLES_4.map((angle) => (
            <g key={angle} transform={`rotate(${angle} 16 16)`}>
              <line x1="16" y1="13.2" x2="16" y2="2.4" />
              <path d="M13.4 5.8 L16 8.2 L18.6 5.8" />
              <circle cx="16" cy="2.2" r="1.15" fill={color} stroke="none" />
            </g>
          ))}
          {ANGLES_4.map((angle) => (
            <g key={`diag-${angle}`} transform={`rotate(${angle + 45} 16 16)`}>
              <line x1="16" y1="13.4" x2="16" y2="5.6" />
              <path d="M14.2 8.2 L16 10.0 L17.8 8.2" />
            </g>
          ))}
        </svg>
      );

    case "floral":
      return (
        <svg {...commonProps} strokeWidth="1.4">
          <circle cx="16" cy="16" r="2.6" />
          {ANGLES_6.map((angle) => (
            <g key={angle} transform={`rotate(${angle} 16 16)`}>
              <line x1="16" y1="13.4" x2="16" y2="5.0" />
              <path d="M13.6 8.8 L16 11.0 L18.4 8.8" />
              <circle cx="16" cy="3.6" r="1.45" />
            </g>
          ))}
        </svg>
      );

    case "minimal":
      return (
        <svg {...commonProps} strokeWidth="1.75">
          <circle cx="16" cy="16" r="1.4" fill={color} stroke="none" />
          {ANGLES_6.map((angle) => (
            <g key={angle} transform={`rotate(${angle} 16 16)`}>
              <line x1="16" y1="16" x2="16" y2="4.2" />
              <path d="M13.6 6.8 L16 9.2 L18.4 6.8" />
            </g>
          ))}
        </svg>
      );
  }
};

const StaticFourPointStarSvg = ({
  kind,
  size,
  color,
}: {
  kind: FourPointStarKind;
  size: number;
  color: string;
}) => {
  const commonProps = {
    "aria-hidden": true as const,
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    width: size,
    height: size,
    style: {
      display: "block",
      filter: `drop-shadow(0 0 4px #ffffff) drop-shadow(0 0 9px ${color})`,
    },
  };

  switch (kind) {
    case "sharp":
      return (
        <svg {...commonProps}>
          <path
            d="M12 1 Q12.8 11.2 23 12 Q12.8 12.8 12 23 Q11.2 12.8 1 12 Q11.2 11.2 12 1 Z"
            fill={color}
          />
          <circle cx="12" cy="12" r="2.1" fill="#ffffff" />
        </svg>
      );

    case "outline":
      return (
        <svg {...commonProps} fill="none">
          <path
            d="M12 2 Q13.4 10.6 22 12 Q13.4 13.4 12 22 Q10.6 13.4 2 12 Q10.6 10.6 12 2 Z"
            stroke={color}
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="1.6" fill="#ffffff" />
        </svg>
      );

    case "plump":
      return (
        <svg {...commonProps}>
          <path
            d="M12 1.8 Q14.2 9.8 22.2 12 Q14.2 14.2 12 22.2 Q9.8 14.2 1.8 12 Q9.8 9.8 12 1.8 Z"
            fill={color}
          />
          <circle cx="12" cy="12" r="2.3" fill="#ffffff" opacity="0.95" />
        </svg>
      );

    case "cross":
      return (
        <svg {...commonProps} fill="none">
          <path
            d="M12 1.5 Q12.5 11.5 22.5 12 Q12.5 12.5 12 22.5 Q11.5 12.5 1.5 12 Q11.5 11.5 12 1.5 Z"
            fill={color}
          />
          <line x1="8.2" y1="8.2" x2="15.8" y2="15.8" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.85" />
          <line x1="15.8" y1="8.2" x2="8.2" y2="15.8" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.85" />
          <circle cx="12" cy="12" r="1.9" fill="#ffffff" />
        </svg>
      );
  }
};

// Composiciones únicas, luminosas y estáticas por sección para máxima variedad visual
const SECTION_DECORATIONS: Record<ChristmasSectionVariant, readonly DecorItem[]> = {
  planes: [
    // Copos de nieve (6 distintos, evitando tapar el anillo de la esquina superior derecha)
    { id: "pl-sf-1", type: "snowflake", kind: "hex", bottom: "-12px", left: "-10px", size: 64, rotate: 18, opacity: 0.36, color: "#e0f2fe" },
    { id: "pl-sf-2", type: "snowflake", kind: "classic", top: "-8px", left: "46%", size: 34, rotate: -22, opacity: 0.42, color: "#ffffff" },
    { id: "pl-sf-3", type: "snowflake", kind: "minimal", bottom: "12px", right: "12px", size: 26, rotate: 30, opacity: 0.48, color: "#bae6fd" },
    { id: "pl-sf-4", type: "snowflake", kind: "floral", top: "38%", left: "26%", size: 22, rotate: 14, opacity: 0.38, color: "#f0f9ff" },
    { id: "pl-sf-5", type: "snowflake", kind: "fern", top: "4%", left: "10px", size: 24, rotate: -16, opacity: 0.4, color: "#e0f2fe" },
    { id: "pl-sf-6", type: "snowflake", kind: "starburst", bottom: "30%", right: "28%", size: 28, rotate: 24, opacity: 0.36, color: "#ffffff" },

    // Estrellitas de 4 puntas (8 luminosas y variadas)
    { id: "pl-st-1", type: "star", kind: "sharp", top: "14px", right: "108px", size: 17, rotate: 6, opacity: 0.92, color: "#fde047" },
    { id: "pl-st-2", type: "star", kind: "outline", top: "48%", left: "14px", size: 15, rotate: -12, opacity: 0.84, color: "#7dd3fc" },
    { id: "pl-st-3", type: "star", kind: "plump", bottom: "16px", right: "46px", size: 13, rotate: 10, opacity: 0.88, color: "#ffffff" },
    { id: "pl-st-4", type: "star", kind: "cross", top: "54%", right: "14px", size: 15, opacity: 0.88, color: "#bae6fd" },
    { id: "pl-st-5", type: "star", kind: "sharp", top: "10px", left: "32%", size: 12, rotate: -8, opacity: 0.82, color: "#ffffff" },
    { id: "pl-st-6", type: "star", kind: "plump", bottom: "38%", left: "50%", size: 12, rotate: 12, opacity: 0.78, color: "#fef08a" },
    { id: "pl-st-7", type: "star", kind: "cross", bottom: "12px", left: "34%", size: 14, opacity: 0.84, color: "#e0f2fe" },
    { id: "pl-st-8", type: "star", kind: "outline", top: "24%", right: "8px", size: 12, rotate: 18, opacity: 0.8, color: "#fde68a" },
  ],

  anuncios: [
    // Copos de nieve (6 distintos)
    { id: "an-sf-1", type: "snowflake", kind: "fern", top: "-14px", left: "-10px", size: 62, rotate: -14, opacity: 0.36, color: "#f0f9ff" },
    { id: "an-sf-2", type: "snowflake", kind: "floral", top: "4px", right: "28%", size: 30, rotate: 22, opacity: 0.44, color: "#e0f2fe" },
    { id: "an-sf-3", type: "snowflake", kind: "starburst", bottom: "-10px", right: "-6px", size: 50, rotate: 15, opacity: 0.38, color: "#bae6fd" },
    { id: "an-sf-4", type: "snowflake", kind: "minimal", bottom: "10px", left: "34%", size: 22, rotate: -28, opacity: 0.44, color: "#ffffff" },
    { id: "an-sf-5", type: "snowflake", kind: "hex", top: "44%", right: "6px", size: 28, rotate: 12, opacity: 0.4, color: "#e0f2fe" },
    { id: "an-sf-6", type: "snowflake", kind: "classic", bottom: "18%", left: "8px", size: 24, rotate: 34, opacity: 0.42, color: "#ffffff" },

    // Estrellitas de 4 puntas (8 luminosas)
    { id: "an-st-1", type: "star", kind: "plump", top: "10px", left: "54%", size: 15, rotate: -8, opacity: 0.9, color: "#fcd34d" },
    { id: "an-st-2", type: "star", kind: "sharp", top: "36px", right: "10px", size: 16, rotate: 8, opacity: 0.88, color: "#ffffff" },
    { id: "an-st-3", type: "star", kind: "cross", bottom: "8px", left: "14px", size: 15, opacity: 0.88, color: "#fde68a" },
    { id: "an-st-4", type: "star", kind: "outline", top: "48%", left: "6px", size: 13, rotate: 16, opacity: 0.82, color: "#7dd3fc" },
    { id: "an-st-5", type: "star", kind: "sharp", top: "12px", left: "38%", size: 12, rotate: 14, opacity: 0.84, color: "#e0f2fe" },
    { id: "an-st-6", type: "star", kind: "plump", top: "8px", right: "12px", size: 13, rotate: -10, opacity: 0.86, color: "#fde047" },
    { id: "an-st-7", type: "star", kind: "cross", bottom: "10px", left: "58%", size: 13, opacity: 0.82, color: "#ffffff" },
    { id: "an-st-8", type: "star", kind: "outline", bottom: "32%", right: "16px", size: 12, rotate: -14, opacity: 0.8, color: "#fed7aa" },
  ],

  concurrencia: [
    // Copos de nieve (5 distintos, evitando tapar el botón QR de top-right)
    { id: "co-sf-1", type: "snowflake", kind: "starburst", bottom: "-14px", right: "-10px", size: 70, rotate: 12, opacity: 0.38, color: "#d1fae5" },
    { id: "co-sf-2", type: "snowflake", kind: "classic", top: "-8px", left: "42%", size: 36, rotate: -28, opacity: 0.42, color: "#ffffff" },
    { id: "co-sf-3", type: "snowflake", kind: "hex", bottom: "6px", left: "12px", size: 28, rotate: 20, opacity: 0.44, color: "#e0f2fe" },
    { id: "co-sf-4", type: "snowflake", kind: "floral", top: "10px", left: "6px", size: 24, rotate: -14, opacity: 0.4, color: "#a7f3d0" },
    { id: "co-sf-5", type: "snowflake", kind: "minimal", bottom: "32%", left: "36%", size: 20, rotate: 26, opacity: 0.38, color: "#ffffff" },

    // Estrellitas de 4 puntas (8 luminosas)
    { id: "co-st-1", type: "star", kind: "cross", top: "10px", left: "22%", size: 16, opacity: 0.92, color: "#6ee7b7" },
    { id: "co-st-2", type: "star", kind: "sharp", top: "56%", right: "22px", size: 16, rotate: -6, opacity: 0.9, color: "#ffffff" },
    { id: "co-st-3", type: "star", kind: "outline", bottom: "10px", left: "58%", size: 14, rotate: 14, opacity: 0.84, color: "#7dd3fc" },
    { id: "co-st-4", type: "star", kind: "plump", top: "14px", right: "28%", size: 13, opacity: 0.88, color: "#fde047" },
    { id: "co-st-5", type: "star", kind: "sharp", bottom: "14px", left: "28%", size: 13, rotate: 12, opacity: 0.86, color: "#a7f3d0" },
    { id: "co-st-6", type: "star", kind: "plump", top: "48%", left: "8px", size: 12, rotate: -10, opacity: 0.82, color: "#ffffff" },
    { id: "co-st-7", type: "star", kind: "cross", top: "24%", left: "64%", size: 12, opacity: 0.8, color: "#e0f2fe" },
    { id: "co-st-8", type: "star", kind: "outline", bottom: "26%", right: "32%", size: 12, rotate: -16, opacity: 0.82, color: "#fef08a" },
  ],

  nutricion: [
    // Copos de nieve (7 distintos repartidos a lo largo de toda la tarjeta alta)
    { id: "nu-sf-1", type: "snowflake", kind: "floral", top: "22%", right: "-14px", size: 74, rotate: -18, opacity: 0.36, color: "#e0f2fe" },
    { id: "nu-sf-2", type: "snowflake", kind: "fern", bottom: "-12px", left: "-10px", size: 60, rotate: 24, opacity: 0.36, color: "#ffffff" },
    { id: "nu-sf-3", type: "snowflake", kind: "classic", top: "8px", left: "54%", size: 28, rotate: 15, opacity: 0.44, color: "#bae6fd" },
    { id: "nu-sf-4", type: "snowflake", kind: "minimal", bottom: "20%", right: "16px", size: 24, rotate: -30, opacity: 0.46, color: "#f0f9ff" },
    { id: "nu-sf-5", type: "snowflake", kind: "hex", top: "46%", left: "-8px", size: 38, rotate: 12, opacity: 0.38, color: "#e0f2fe" },
    { id: "nu-sf-6", type: "snowflake", kind: "starburst", bottom: "6%", right: "34%", size: 32, rotate: -16, opacity: 0.4, color: "#ffffff" },
    { id: "nu-sf-7", type: "snowflake", kind: "classic", top: "64%", right: "26%", size: 22, rotate: 28, opacity: 0.38, color: "#bae6fd" },

    // Estrellitas de 4 puntas (10 luminosas y variadas)
    { id: "nu-st-1", type: "star", kind: "sharp", top: "56px", right: "30px", size: 17, rotate: 8, opacity: 0.92, color: "#fde047" },
    { id: "nu-st-2", type: "star", kind: "outline", top: "40%", left: "14px", size: 15, rotate: -10, opacity: 0.84, color: "#7dd3fc" },
    { id: "nu-st-3", type: "star", kind: "cross", bottom: "26%", left: "48%", size: 15, opacity: 0.86, color: "#ffffff" },
    { id: "nu-st-4", type: "star", kind: "plump", bottom: "12px", right: "24%", size: 14, rotate: 12, opacity: 0.9, color: "#fdba74" },
    { id: "nu-st-5", type: "star", kind: "sharp", top: "14px", left: "40%", size: 13, rotate: -6, opacity: 0.86, color: "#ffffff" },
    { id: "nu-st-6", type: "star", kind: "plump", top: "28%", left: "44%", size: 12, rotate: 14, opacity: 0.82, color: "#fde68a" },
    { id: "nu-st-7", type: "star", kind: "cross", top: "54%", right: "14px", size: 15, opacity: 0.88, color: "#bae6fd" },
    { id: "nu-st-8", type: "star", kind: "outline", bottom: "38%", left: "26%", size: 13, rotate: 18, opacity: 0.82, color: "#ffffff" },
    { id: "nu-st-9", type: "star", kind: "sharp", bottom: "14px", left: "30%", size: 14, rotate: -12, opacity: 0.88, color: "#fde047" },
    { id: "nu-st-10", type: "star", kind: "plump", top: "74%", left: "12px", size: 12, rotate: 8, opacity: 0.84, color: "#e0f2fe" },
  ],

  frase: [
    // Copos de nieve (6 distintos)
    { id: "fr-sf-1", type: "snowflake", kind: "classic", top: "-12px", right: "-8px", size: 66, rotate: -22, opacity: 0.4, color: "#e0f2fe" },
    { id: "fr-sf-2", type: "snowflake", kind: "hex", bottom: "-10px", left: "4px", size: 50, rotate: 16, opacity: 0.38, color: "#dbeafe" },
    { id: "fr-sf-3", type: "snowflake", kind: "floral", top: "50%", right: "12px", size: 28, rotate: 34, opacity: 0.44, color: "#ffffff" },
    { id: "fr-sf-4", type: "snowflake", kind: "minimal", top: "8px", left: "30%", size: 22, rotate: -12, opacity: 0.44, color: "#bae6fd" },
    { id: "fr-sf-5", type: "snowflake", kind: "fern", bottom: "10px", right: "32%", size: 26, rotate: 20, opacity: 0.4, color: "#f0f9ff" },
    { id: "fr-sf-6", type: "snowflake", kind: "starburst", top: "36%", left: "-8px", size: 32, rotate: 10, opacity: 0.38, color: "#e0f2fe" },

    // Estrellitas de 4 puntas (8 luminosas)
    { id: "fr-st-1", type: "star", kind: "plump", top: "10px", left: "48%", size: 14, rotate: -6, opacity: 0.9, color: "#93c5fd" },
    { id: "fr-st-2", type: "star", kind: "sharp", top: "24px", right: "60px", size: 17, rotate: 10, opacity: 0.92, color: "#fde047" },
    { id: "fr-st-3", type: "star", kind: "cross", bottom: "12px", right: "20px", size: 16, opacity: 0.9, color: "#ffffff" },
    { id: "fr-st-4", type: "star", kind: "outline", top: "44%", left: "12px", size: 13, rotate: 14, opacity: 0.84, color: "#e0f2fe" },
    { id: "fr-st-5", type: "star", kind: "sharp", top: "12px", left: "14px", size: 13, rotate: -10, opacity: 0.86, color: "#bae6fd" },
    { id: "fr-st-6", type: "star", kind: "plump", bottom: "14px", left: "34%", size: 13, rotate: 12, opacity: 0.86, color: "#fef08a" },
    { id: "fr-st-7", type: "star", kind: "cross", top: "34%", right: "26%", size: 13, opacity: 0.82, color: "#ffffff" },
    { id: "fr-st-8", type: "star", kind: "outline", bottom: "32%", right: "10px", size: 12, rotate: -16, opacity: 0.84, color: "#93c5fd" },
  ],

  // --- EVOLUCIÓN CORPORAL ---
  "evo-form": [
    { id: "ef-sf-1", type: "snowflake", kind: "hex", top: "-10px", right: "28px", size: 46, rotate: 16, opacity: 0.38, color: "#e0f2fe" },
    { id: "ef-sf-2", type: "snowflake", kind: "classic", bottom: "-10px", left: "14px", size: 40, rotate: -20, opacity: 0.38, color: "#ffffff" },
    { id: "ef-sf-3", type: "snowflake", kind: "minimal", top: "6px", left: "44%", size: 22, rotate: 28, opacity: 0.44, color: "#a7f3d0" },
    { id: "ef-sf-4", type: "snowflake", kind: "floral", bottom: "8px", right: "18%", size: 26, rotate: -14, opacity: 0.4, color: "#bae6fd" },
    { id: "ef-sf-5", type: "snowflake", kind: "fern", top: "48%", left: "-8px", size: 36, rotate: 18, opacity: 0.36, color: "#f0f9ff" },
    { id: "ef-st-1", type: "star", kind: "sharp", top: "10px", left: "62%", size: 15, rotate: 8, opacity: 0.9, color: "#fde047" },
    { id: "ef-st-2", type: "star", kind: "cross", bottom: "10px", left: "34%", size: 14, opacity: 0.86, color: "#ffffff" },
    { id: "ef-st-3", type: "star", kind: "plump", top: "12px", right: "84px", size: 13, rotate: -10, opacity: 0.88, color: "#6ee7b7" },
    { id: "ef-st-4", type: "star", kind: "outline", bottom: "12px", right: "44px", size: 13, rotate: 14, opacity: 0.84, color: "#7dd3fc" },
    { id: "ef-st-5", type: "star", kind: "sharp", top: "52%", right: "12px", size: 14, rotate: -6, opacity: 0.84, color: "#fef08a" },
    { id: "ef-st-6", type: "star", kind: "plump", top: "8px", left: "26%", size: 11, rotate: 12, opacity: 0.82, color: "#e0f2fe" },
  ],

  "evo-empty": [
    { id: "ee-sf-1", type: "snowflake", kind: "starburst", top: "-12px", left: "-8px", size: 60, rotate: 14, opacity: 0.38, color: "#e0f2fe" },
    { id: "ee-sf-2", type: "snowflake", kind: "fern", bottom: "-12px", right: "-8px", size: 58, rotate: -18, opacity: 0.38, color: "#ffffff" },
    { id: "ee-sf-3", type: "snowflake", kind: "floral", top: "14px", right: "22%", size: 28, rotate: 24, opacity: 0.44, color: "#bae6fd" },
    { id: "ee-sf-4", type: "snowflake", kind: "classic", bottom: "16px", left: "20%", size: 26, rotate: -26, opacity: 0.42, color: "#f0f9ff" },
    { id: "ee-st-1", type: "star", kind: "sharp", top: "18px", left: "30%", size: 16, rotate: 6, opacity: 0.9, color: "#fde047" },
    { id: "ee-st-2", type: "star", kind: "cross", top: "48%", right: "16px", size: 15, opacity: 0.88, color: "#ffffff" },
    { id: "ee-st-3", type: "star", kind: "outline", top: "46%", left: "16px", size: 14, rotate: 14, opacity: 0.84, color: "#7dd3fc" },
    { id: "ee-st-4", type: "star", kind: "plump", bottom: "14px", right: "32%", size: 13, rotate: -8, opacity: 0.88, color: "#a7f3d0" },
    { id: "ee-st-5", type: "star", kind: "sharp", top: "24px", right: "14px", size: 12, rotate: -12, opacity: 0.84, color: "#fef08a" },
    { id: "ee-st-6", type: "star", kind: "cross", bottom: "22px", left: "46%", size: 12, opacity: 0.82, color: "#e0f2fe" },
  ],

  "evo-card-1": [
    { id: "ec1-sf-1", type: "snowflake", kind: "classic", top: "-12px", right: "46px", size: 56, rotate: -16, opacity: 0.38, color: "#e0f2fe" },
    { id: "ec1-sf-2", type: "snowflake", kind: "hex", bottom: "-10px", left: "-8px", size: 54, rotate: 22, opacity: 0.36, color: "#ffffff" },
    { id: "ec1-sf-3", type: "snowflake", kind: "minimal", top: "36%", right: "8px", size: 24, rotate: 30, opacity: 0.46, color: "#a7f3d0" },
    { id: "ec1-sf-4", type: "snowflake", kind: "floral", top: "20%", left: "42%", size: 26, rotate: -24, opacity: 0.38, color: "#bae6fd" },
    { id: "ec1-sf-5", type: "snowflake", kind: "fern", bottom: "26%", right: "26%", size: 28, rotate: 12, opacity: 0.36, color: "#f0f9ff" },
    { id: "ec1-st-1", type: "star", kind: "sharp", top: "14px", left: "48%", size: 16, rotate: 8, opacity: 0.9, color: "#fde047" },
    { id: "ec1-st-2", type: "star", kind: "cross", top: "26%", left: "10px", size: 14, opacity: 0.86, color: "#ffffff" },
    { id: "ec1-st-3", type: "star", kind: "outline", top: "52%", right: "14px", size: 14, rotate: -14, opacity: 0.84, color: "#7dd3fc" },
    { id: "ec1-st-4", type: "star", kind: "plump", bottom: "12px", right: "16px", size: 13, rotate: 10, opacity: 0.88, color: "#6ee7b7" },
    { id: "ec1-st-5", type: "star", kind: "sharp", bottom: "14px", left: "34%", size: 13, rotate: -8, opacity: 0.86, color: "#fef08a" },
    { id: "ec1-st-6", type: "star", kind: "plump", top: "10px", left: "28%", size: 11, rotate: 14, opacity: 0.82, color: "#e0f2fe" },
    { id: "ec1-st-7", type: "star", kind: "cross", bottom: "40%", left: "54%", size: 13, opacity: 0.82, color: "#ffffff" },
  ],

  "evo-card-2": [
    { id: "ec2-sf-1", type: "snowflake", kind: "starburst", top: "-12px", left: "-10px", size: 58, rotate: 14, opacity: 0.36, color: "#bae6fd" },
    { id: "ec2-sf-2", type: "snowflake", kind: "floral", bottom: "-10px", right: "-8px", size: 58, rotate: -20, opacity: 0.38, color: "#ffffff" },
    { id: "ec2-sf-3", type: "snowflake", kind: "fern", top: "10px", right: "54px", size: 30, rotate: 26, opacity: 0.42, color: "#e0f2fe" },
    { id: "ec2-sf-4", type: "snowflake", kind: "classic", top: "48%", left: "12px", size: 24, rotate: -18, opacity: 0.42, color: "#d1fae5" },
    { id: "ec2-sf-5", type: "snowflake", kind: "minimal", bottom: "30%", left: "46%", size: 22, rotate: 32, opacity: 0.4, color: "#f0f9ff" },
    { id: "ec2-st-1", type: "star", kind: "plump", top: "14px", left: "38%", size: 15, rotate: -6, opacity: 0.9, color: "#6ee7b7" },
    { id: "ec2-st-2", type: "star", kind: "sharp", top: "30%", right: "14px", size: 16, rotate: 10, opacity: 0.92, color: "#fde047" },
    { id: "ec2-st-3", type: "star", kind: "cross", bottom: "12px", left: "22%", size: 15, opacity: 0.88, color: "#ffffff" },
    { id: "ec2-st-4", type: "star", kind: "outline", top: "16px", left: "64%", size: 13, rotate: 16, opacity: 0.84, color: "#7dd3fc" },
    { id: "ec2-st-5", type: "star", kind: "sharp", bottom: "36%", right: "24%", size: 13, rotate: -10, opacity: 0.86, color: "#e0f2fe" },
    { id: "ec2-st-6", type: "star", kind: "plump", bottom: "10px", right: "38%", size: 12, rotate: 8, opacity: 0.84, color: "#fef08a" },
    { id: "ec2-st-7", type: "star", kind: "outline", top: "60%", left: "8px", size: 12, rotate: -12, opacity: 0.82, color: "#ffffff" },
  ],

  "evo-card-3": [
    { id: "ec3-sf-1", type: "snowflake", kind: "fern", top: "18%", right: "-12px", size: 62, rotate: -14, opacity: 0.38, color: "#f0f9ff" },
    { id: "ec3-sf-2", type: "snowflake", kind: "hex", top: "-10px", left: "34%", size: 40, rotate: 24, opacity: 0.4, color: "#e0f2fe" },
    { id: "ec3-sf-3", type: "snowflake", kind: "starburst", bottom: "-10px", left: "12px", size: 46, rotate: -22, opacity: 0.38, color: "#a7f3d0" },
    { id: "ec3-sf-4", type: "snowflake", kind: "minimal", bottom: "14px", right: "26%", size: 22, rotate: 16, opacity: 0.46, color: "#ffffff" },
    { id: "ec3-sf-5", type: "snowflake", kind: "classic", top: "54%", left: "44%", size: 26, rotate: -12, opacity: 0.36, color: "#bae6fd" },
    { id: "ec3-st-1", type: "star", kind: "cross", top: "12px", right: "58px", size: 16, opacity: 0.9, color: "#fde047" },
    { id: "ec3-st-2", type: "star", kind: "sharp", top: "24%", left: "12px", size: 15, rotate: 8, opacity: 0.88, color: "#ffffff" },
    { id: "ec3-st-3", type: "star", kind: "plump", bottom: "14px", right: "14px", size: 14, rotate: -8, opacity: 0.9, color: "#7dd3fc" },
    { id: "ec3-st-4", type: "star", kind: "outline", top: "12px", left: "18%", size: 13, rotate: 12, opacity: 0.84, color: "#6ee7b7" },
    { id: "ec3-st-5", type: "star", kind: "sharp", bottom: "36%", left: "26%", size: 13, rotate: -10, opacity: 0.84, color: "#fef08a" },
    { id: "ec3-st-6", type: "star", kind: "cross", bottom: "10px", left: "52%", size: 13, opacity: 0.86, color: "#e0f2fe" },
    { id: "ec3-st-7", type: "star", kind: "plump", top: "46%", right: "22%", size: 11, rotate: 16, opacity: 0.82, color: "#ffffff" },
  ],

  // --- PERSONAL RECORDS ---
  "pr-info": [
    { id: "pi-sf-1", type: "snowflake", kind: "floral", top: "-10px", right: "32px", size: 42, rotate: 20, opacity: 0.4, color: "#bae6fd" },
    { id: "pi-sf-2", type: "snowflake", kind: "minimal", bottom: "-8px", left: "28%", size: 32, rotate: -18, opacity: 0.42, color: "#ffffff" },
    { id: "pi-sf-3", type: "snowflake", kind: "classic", top: "6px", left: "54%", size: 22, rotate: 14, opacity: 0.44, color: "#93c5fd" },
    { id: "pi-sf-4", type: "snowflake", kind: "hex", bottom: "6px", right: "10px", size: 26, rotate: -24, opacity: 0.38, color: "#e0f2fe" },
    { id: "pi-st-1", type: "star", kind: "sharp", top: "8px", left: "40%", size: 15, rotate: 6, opacity: 0.92, color: "#fde047" },
    { id: "pi-st-2", type: "star", kind: "cross", bottom: "8px", left: "14px", size: 14, opacity: 0.88, color: "#93c5fd" },
    { id: "pi-st-3", type: "star", kind: "plump", top: "10px", right: "84px", size: 13, rotate: -8, opacity: 0.88, color: "#ffffff" },
    { id: "pi-st-4", type: "star", kind: "outline", bottom: "10px", left: "64%", size: 13, rotate: 14, opacity: 0.84, color: "#fef08a" },
    { id: "pi-st-5", type: "star", kind: "sharp", top: "50%", left: "8px", size: 12, rotate: 10, opacity: 0.82, color: "#e0f2fe" },
    { id: "pi-st-6", type: "star", kind: "plump", top: "48%", right: "14px", size: 12, rotate: -12, opacity: 0.84, color: "#7dd3fc" },
  ],

  "pr-form": [
    { id: "pf-sf-1", type: "snowflake", kind: "starburst", top: "-10px", left: "56%", size: 46, rotate: -16, opacity: 0.38, color: "#e0f2fe" },
    { id: "pf-sf-2", type: "snowflake", kind: "fern", bottom: "-10px", right: "18px", size: 48, rotate: 22, opacity: 0.38, color: "#ffffff" },
    { id: "pf-sf-3", type: "snowflake", kind: "hex", top: "8px", right: "44px", size: 24, rotate: 12, opacity: 0.44, color: "#fde68a" },
    { id: "pf-sf-4", type: "snowflake", kind: "minimal", bottom: "8px", left: "16px", size: 26, rotate: -26, opacity: 0.44, color: "#bae6fd" },
    { id: "pf-sf-5", type: "snowflake", kind: "floral", top: "46%", left: "-8px", size: 36, rotate: 18, opacity: 0.36, color: "#f0f9ff" },
    { id: "pf-st-1", type: "star", kind: "plump", top: "10px", left: "44%", size: 15, rotate: -6, opacity: 0.9, color: "#fde047" },
    { id: "pf-st-2", type: "star", kind: "sharp", bottom: "12px", left: "48%", size: 15, rotate: 10, opacity: 0.88, color: "#ffffff" },
    { id: "pf-st-3", type: "star", kind: "outline", top: "12px", right: "80px", size: 13, rotate: 14, opacity: 0.86, color: "#7dd3fc" },
    { id: "pf-st-4", type: "star", kind: "cross", top: "52%", right: "14px", size: 15, opacity: 0.88, color: "#6ee7b7" },
    { id: "pf-st-5", type: "star", kind: "sharp", bottom: "12px", right: "76px", size: 13, rotate: -10, opacity: 0.84, color: "#fef08a" },
    { id: "pf-st-6", type: "star", kind: "cross", top: "8px", left: "26%", size: 12, opacity: 0.82, color: "#e0f2fe" },
  ],

  "pr-card-1": [
    { id: "pc1-sf-1", type: "snowflake", kind: "hex", top: "-12px", right: "32px", size: 48, rotate: 18, opacity: 0.38, color: "#e0f2fe" },
    { id: "pc1-sf-2", type: "snowflake", kind: "minimal", bottom: "-6px", left: "34%", size: 28, rotate: -24, opacity: 0.44, color: "#ffffff" },
    { id: "pc1-sf-3", type: "snowflake", kind: "classic", bottom: "6px", right: "8px", size: 24, rotate: 28, opacity: 0.44, color: "#bae6fd" },
    { id: "pc1-sf-4", type: "snowflake", kind: "floral", top: "6px", left: "16%", size: 22, rotate: -14, opacity: 0.4, color: "#f0f9ff" },
    { id: "pc1-st-1", type: "star", kind: "sharp", top: "10px", left: "50%", size: 15, rotate: 8, opacity: 0.92, color: "#fde047" },
    { id: "pc1-st-2", type: "star", kind: "cross", bottom: "10px", right: "54px", size: 14, opacity: 0.88, color: "#6ee7b7" },
    { id: "pc1-st-3", type: "star", kind: "outline", top: "48%", right: "18%", size: 13, rotate: -12, opacity: 0.84, color: "#7dd3fc" },
    { id: "pc1-st-4", type: "star", kind: "plump", bottom: "8px", left: "18%", size: 12, rotate: 10, opacity: 0.86, color: "#ffffff" },
    { id: "pc1-st-5", type: "star", kind: "sharp", top: "12px", right: "10px", size: 12, rotate: -6, opacity: 0.86, color: "#fef08a" },
    { id: "pc1-st-6", type: "star", kind: "plump", top: "54%", left: "58%", size: 11, rotate: 14, opacity: 0.82, color: "#e0f2fe" },
  ],

  "pr-card-2": [
    { id: "pc2-sf-1", type: "snowflake", kind: "fern", bottom: "-12px", right: "24px", size: 52, rotate: -18, opacity: 0.38, color: "#ffffff" },
    { id: "pc2-sf-2", type: "snowflake", kind: "starburst", top: "-10px", left: "26%", size: 42, rotate: 16, opacity: 0.38, color: "#bae6fd" },
    { id: "pc2-sf-3", type: "snowflake", kind: "floral", top: "8px", right: "10px", size: 24, rotate: -28, opacity: 0.44, color: "#d1fae5" },
    { id: "pc2-sf-4", type: "snowflake", kind: "minimal", bottom: "6px", left: "12px", size: 22, rotate: 20, opacity: 0.42, color: "#e0f2fe" },
    { id: "pc2-st-1", type: "star", kind: "plump", top: "10px", right: "52px", size: 15, rotate: -8, opacity: 0.9, color: "#fde047" },
    { id: "pc2-st-2", type: "star", kind: "sharp", bottom: "10px", left: "44%", size: 15, rotate: 10, opacity: 0.9, color: "#ffffff" },
    { id: "pc2-st-3", type: "star", kind: "cross", top: "48%", left: "62%", size: 14, opacity: 0.86, color: "#7dd3fc" },
    { id: "pc2-st-4", type: "star", kind: "outline", top: "10px", left: "10px", size: 13, rotate: 14, opacity: 0.84, color: "#6ee7b7" },
    { id: "pc2-st-5", type: "star", kind: "sharp", bottom: "12px", right: "10px", size: 12, rotate: -10, opacity: 0.86, color: "#fef08a" },
    { id: "pc2-st-6", type: "star", kind: "outline", top: "24%", left: "46%", size: 11, rotate: -14, opacity: 0.82, color: "#e0f2fe" },
  ],

  "pr-card-3": [
    { id: "pc3-sf-1", type: "snowflake", kind: "classic", bottom: "-12px", left: "42%", size: 48, rotate: 24, opacity: 0.38, color: "#e0f2fe" },
    { id: "pc3-sf-2", type: "snowflake", kind: "hex", top: "-10px", right: "8px", size: 44, rotate: -14, opacity: 0.38, color: "#ffffff" },
    { id: "pc3-sf-3", type: "snowflake", kind: "minimal", top: "8px", left: "12px", size: 24, rotate: 18, opacity: 0.44, color: "#bae6fd" },
    { id: "pc3-sf-4", type: "snowflake", kind: "fern", bottom: "6px", right: "44px", size: 26, rotate: -26, opacity: 0.42, color: "#f0f9ff" },
    { id: "pc3-st-1", type: "star", kind: "cross", top: "10px", left: "34%", size: 15, opacity: 0.9, color: "#6ee7b7" },
    { id: "pc3-st-2", type: "star", kind: "sharp", top: "44%", right: "22%", size: 16, rotate: 6, opacity: 0.92, color: "#fde047" },
    { id: "pc3-st-3", type: "star", kind: "plump", bottom: "10px", left: "24%", size: 13, rotate: -10, opacity: 0.88, color: "#ffffff" },
    { id: "pc3-st-4", type: "star", kind: "outline", top: "14px", right: "62px", size: 13, rotate: 16, opacity: 0.86, color: "#7dd3fc" },
    { id: "pc3-st-5", type: "star", kind: "sharp", bottom: "10px", right: "14px", size: 13, rotate: -8, opacity: 0.88, color: "#fef08a" },
    { id: "pc3-st-6", type: "star", kind: "plump", top: "54%", left: "14%", size: 11, rotate: 12, opacity: 0.82, color: "#e0f2fe" },
  ],

  // --- ACTIVIDAD CARDIO ---
  "cardio-form": [
    { id: "cf-sf-1", type: "snowflake", kind: "floral", top: "-10px", right: "30px", size: 46, rotate: -18, opacity: 0.38, color: "#e0f2fe" },
    { id: "cf-sf-2", type: "snowflake", kind: "classic", bottom: "-10px", left: "20px", size: 42, rotate: 20, opacity: 0.38, color: "#ffffff" },
    { id: "cf-sf-3", type: "snowflake", kind: "minimal", top: "8px", left: "46%", size: 22, rotate: -24, opacity: 0.44, color: "#fed7aa" },
    { id: "cf-sf-4", type: "snowflake", kind: "hex", bottom: "8px", right: "20%", size: 26, rotate: 14, opacity: 0.4, color: "#bae6fd" },
    { id: "cf-st-1", type: "star", kind: "sharp", top: "10px", left: "62%", size: 15, rotate: 8, opacity: 0.92, color: "#fde047" },
    { id: "cf-st-2", type: "star", kind: "cross", bottom: "10px", left: "40%", size: 14, opacity: 0.88, color: "#ffffff" },
    { id: "cf-st-3", type: "star", kind: "plump", top: "10px", right: "84px", size: 13, rotate: -10, opacity: 0.88, color: "#fdba74" },
    { id: "cf-st-4", type: "star", kind: "outline", bottom: "10px", right: "14px", size: 13, rotate: 14, opacity: 0.84, color: "#7dd3fc" },
    { id: "cf-st-5", type: "star", kind: "sharp", top: "50%", left: "10px", size: 13, rotate: -6, opacity: 0.84, color: "#fef08a" },
    { id: "cf-st-6", type: "star", kind: "plump", top: "8px", left: "28%", size: 11, rotate: 12, opacity: 0.82, color: "#e0f2fe" },
  ],

  "cardio-week": [
    { id: "cw-sf-1", type: "snowflake", kind: "classic", top: "-12px", right: "-8px", size: 54, rotate: 18, opacity: 0.4, color: "#e0f2fe" },
    { id: "cw-sf-2", type: "snowflake", kind: "hex", bottom: "-10px", left: "34%", size: 42, rotate: -22, opacity: 0.38, color: "#ffffff" },
    { id: "cw-sf-3", type: "snowflake", kind: "minimal", top: "10px", left: "28%", size: 22, rotate: 28, opacity: 0.46, color: "#bae6fd" },
    { id: "cw-sf-4", type: "snowflake", kind: "floral", bottom: "8px", left: "8px", size: 24, rotate: -14, opacity: 0.42, color: "#f0f9ff" },
    { id: "cw-st-1", type: "star", kind: "sharp", top: "10px", left: "48%", size: 16, rotate: 6, opacity: 0.92, color: "#fde047" },
    { id: "cw-st-2", type: "star", kind: "cross", bottom: "12px", right: "18%", size: 15, opacity: 0.88, color: "#ffffff" },
    { id: "cw-st-3", type: "star", kind: "outline", top: "48%", left: "44%", size: 13, rotate: 14, opacity: 0.84, color: "#7dd3fc" },
    { id: "cw-st-4", type: "star", kind: "plump", top: "14px", right: "54px", size: 13, rotate: -8, opacity: 0.88, color: "#fdba74" },
    { id: "cw-st-5", type: "star", kind: "sharp", bottom: "10px", left: "22%", size: 12, rotate: -10, opacity: 0.86, color: "#e0f2fe" },
    { id: "cw-st-6", type: "star", kind: "plump", top: "54%", right: "10px", size: 12, rotate: 10, opacity: 0.84, color: "#fef08a" },
  ],

  "cardio-month": [
    { id: "cm-sf-1", type: "snowflake", kind: "fern", top: "-12px", left: "-10px", size: 56, rotate: -16, opacity: 0.38, color: "#f0f9ff" },
    { id: "cm-sf-2", type: "snowflake", kind: "starburst", bottom: "-12px", right: "-8px", size: 56, rotate: 16, opacity: 0.38, color: "#bae6fd" },
    { id: "cm-sf-3", type: "snowflake", kind: "floral", top: "6px", left: "52%", size: 28, rotate: 24, opacity: 0.44, color: "#ffffff" },
    { id: "cm-sf-4", type: "snowflake", kind: "minimal", bottom: "8px", left: "24%", size: 22, rotate: -26, opacity: 0.44, color: "#e0f2fe" },
    { id: "cm-st-1", type: "star", kind: "plump", top: "10px", right: "24%", size: 15, rotate: -6, opacity: 0.9, color: "#7dd3fc" },
    { id: "cm-st-2", type: "star", kind: "sharp", bottom: "12px", left: "46%", size: 16, rotate: 8, opacity: 0.92, color: "#fde047" },
    { id: "cm-st-3", type: "star", kind: "cross", top: "48%", left: "10px", size: 14, opacity: 0.88, color: "#ffffff" },
    { id: "cm-st-4", type: "star", kind: "outline", top: "14px", left: "34%", size: 13, rotate: 16, opacity: 0.84, color: "#fdba74" },
    { id: "cm-st-5", type: "star", kind: "sharp", top: "52%", right: "26%", size: 13, rotate: -10, opacity: 0.86, color: "#e0f2fe" },
    { id: "cm-st-6", type: "star", kind: "cross", top: "8px", right: "10px", size: 12, opacity: 0.84, color: "#fef08a" },
  ],

  "cardio-year": [
    { id: "cy-sf-1", type: "snowflake", kind: "hex", top: "-12px", left: "38%", size: 54, rotate: 22, opacity: 0.4, color: "#fef3c7" },
    { id: "cy-sf-2", type: "snowflake", kind: "classic", bottom: "-12px", left: "-8px", size: 54, rotate: -18, opacity: 0.38, color: "#ffffff" },
    { id: "cy-sf-3", type: "snowflake", kind: "starburst", top: "-8px", right: "6px", size: 42, rotate: 14, opacity: 0.4, color: "#fde68a" },
    { id: "cy-sf-4", type: "snowflake", kind: "minimal", bottom: "8px", right: "32%", size: 24, rotate: -30, opacity: 0.46, color: "#e0f2fe" },
    { id: "cy-sf-5", type: "snowflake", kind: "floral", top: "46%", left: "14%", size: 24, rotate: 16, opacity: 0.38, color: "#fed7aa" },
    { id: "cy-st-1", type: "star", kind: "sharp", top: "10px", left: "24%", size: 17, rotate: 8, opacity: 0.94, color: "#fde047" },
    { id: "cy-st-2", type: "star", kind: "cross", bottom: "10px", right: "16px", size: 16, opacity: 0.92, color: "#ffffff" },
    { id: "cy-st-3", type: "star", kind: "plump", top: "14px", right: "54px", size: 14, rotate: -10, opacity: 0.9, color: "#fb923c" },
    { id: "cy-st-4", type: "star", kind: "outline", bottom: "12px", left: "44%", size: 14, rotate: 14, opacity: 0.86, color: "#fef08a" },
    { id: "cy-st-5", type: "star", kind: "sharp", top: "50%", right: "44%", size: 13, rotate: -6, opacity: 0.86, color: "#ffffff" },
    { id: "cy-st-6", type: "star", kind: "plump", top: "8px", left: "8px", size: 12, rotate: 12, opacity: 0.86, color: "#bae6fd" },
  ],

  "cardio-week-bar": [
    { id: "cwb-sf-1", type: "snowflake", kind: "minimal", top: "-4px", left: "18%", size: 24, rotate: 18, opacity: 0.44, color: "#e0f2fe" },
    { id: "cwb-sf-2", type: "snowflake", kind: "classic", bottom: "-6px", right: "18%", size: 26, rotate: -22, opacity: 0.44, color: "#ffffff" },
    { id: "cwb-sf-3", type: "snowflake", kind: "floral", top: "4px", right: "32%", size: 20, rotate: 12, opacity: 0.4, color: "#fed7aa" },
    { id: "cwb-st-1", type: "star", kind: "sharp", top: "8px", left: "30%", size: 14, rotate: 6, opacity: 0.9, color: "#fde047" },
    { id: "cwb-st-2", type: "star", kind: "cross", bottom: "6px", left: "26%", size: 13, opacity: 0.86, color: "#ffffff" },
    { id: "cwb-st-3", type: "star", kind: "plump", top: "8px", right: "24%", size: 13, rotate: -10, opacity: 0.88, color: "#7dd3fc" },
    { id: "cwb-st-4", type: "star", kind: "outline", bottom: "8px", left: "66%", size: 12, rotate: 14, opacity: 0.84, color: "#fdba74" },
    { id: "cwb-st-5", type: "star", kind: "sharp", top: "50%", left: "10%", size: 11, rotate: -8, opacity: 0.82, color: "#ffffff" },
    { id: "cwb-st-6", type: "star", kind: "plump", top: "46%", right: "10%", size: 11, rotate: 10, opacity: 0.82, color: "#fef08a" },
  ],

  "cardio-empty": [
    { id: "ce-sf-1", type: "snowflake", kind: "hex", top: "-12px", left: "-8px", size: 54, rotate: 16, opacity: 0.38, color: "#e0f2fe" },
    { id: "ce-sf-2", type: "snowflake", kind: "floral", bottom: "-12px", right: "-8px", size: 54, rotate: -20, opacity: 0.38, color: "#ffffff" },
    { id: "ce-sf-3", type: "snowflake", kind: "minimal", top: "10px", right: "22%", size: 24, rotate: 28, opacity: 0.44, color: "#fed7aa" },
    { id: "ce-sf-4", type: "snowflake", kind: "classic", bottom: "12px", left: "20%", size: 24, rotate: -18, opacity: 0.42, color: "#bae6fd" },
    { id: "ce-st-1", type: "star", kind: "sharp", top: "14px", left: "26%", size: 15, rotate: 8, opacity: 0.9, color: "#fde047" },
    { id: "ce-st-2", type: "star", kind: "cross", top: "46%", right: "14px", size: 15, opacity: 0.88, color: "#ffffff" },
    { id: "ce-st-3", type: "star", kind: "outline", top: "48%", left: "14px", size: 13, rotate: 12, opacity: 0.84, color: "#7dd3fc" },
    { id: "ce-st-4", type: "star", kind: "plump", bottom: "12px", right: "30%", size: 13, rotate: -8, opacity: 0.88, color: "#fdba74" },
    { id: "ce-st-5", type: "star", kind: "sharp", top: "16px", right: "12px", size: 12, rotate: -10, opacity: 0.84, color: "#fef08a" },
  ],

  "cardio-item-1": [
    { id: "ci1-sf-1", type: "snowflake", kind: "starburst", top: "-10px", right: "34px", size: 44, rotate: 14, opacity: 0.38, color: "#e0f2fe" },
    { id: "ci1-sf-2", type: "snowflake", kind: "minimal", bottom: "-8px", left: "32%", size: 28, rotate: -22, opacity: 0.44, color: "#ffffff" },
    { id: "ci1-sf-3", type: "snowflake", kind: "fern", bottom: "4px", right: "8px", size: 24, rotate: 24, opacity: 0.42, color: "#fed7aa" },
    { id: "ci1-st-1", type: "star", kind: "sharp", top: "10px", left: "54%", size: 15, rotate: 8, opacity: 0.92, color: "#fde047" },
    { id: "ci1-st-2", type: "star", kind: "cross", bottom: "10px", right: "62px", size: 14, opacity: 0.88, color: "#ffffff" },
    { id: "ci1-st-3", type: "star", kind: "outline", top: "10px", left: "14px", size: 12, rotate: 14, opacity: 0.84, color: "#7dd3fc" },
    { id: "ci1-st-4", type: "star", kind: "plump", bottom: "8px", left: "14%", size: 12, rotate: -8, opacity: 0.86, color: "#fdba74" },
    { id: "ci1-st-5", type: "star", kind: "sharp", top: "46%", right: "18%", size: 12, rotate: -10, opacity: 0.86, color: "#e0f2fe" },
  ],

  "cardio-item-2": [
    { id: "ci2-sf-1", type: "snowflake", kind: "floral", bottom: "-10px", right: "28px", size: 46, rotate: -18, opacity: 0.38, color: "#ffffff" },
    { id: "ci2-sf-2", type: "snowflake", kind: "hex", top: "-10px", left: "26%", size: 38, rotate: 20, opacity: 0.38, color: "#bae6fd" },
    { id: "ci2-sf-3", type: "snowflake", kind: "classic", top: "6px", right: "12px", size: 22, rotate: -26, opacity: 0.44, color: "#fde68a" },
    { id: "ci2-st-1", type: "star", kind: "plump", top: "10px", right: "54px", size: 15, rotate: -6, opacity: 0.9, color: "#fdba74" },
    { id: "ci2-st-2", type: "star", kind: "sharp", bottom: "10px", left: "44%", size: 14, rotate: 10, opacity: 0.9, color: "#fde047" },
    { id: "ci2-st-3", type: "star", kind: "cross", top: "48%", left: "62%", size: 13, opacity: 0.86, color: "#ffffff" },
    { id: "ci2-st-4", type: "star", kind: "outline", bottom: "10px", left: "12px", size: 12, rotate: 16, opacity: 0.84, color: "#7dd3fc" },
    { id: "ci2-st-5", type: "star", kind: "sharp", top: "12px", left: "46%", size: 12, rotate: -8, opacity: 0.84, color: "#e0f2fe" },
  ],
};

export const ChristmasCardDecor: React.FC<{ variant: ChristmasSectionVariant }> = ({ variant }) => {
  const items = SECTION_DECORATIONS[variant];

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none select-none overflow-hidden rounded-[inherit] z-0"
    >
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            position: "absolute",
            top: item.top,
            bottom: item.bottom,
            left: item.left,
            right: item.right,
            opacity: item.opacity,
            transform: item.rotate ? `rotate(${item.rotate}deg)` : undefined,
          }}
        >
          {item.type === "snowflake" ? (
            <StaticSnowflakeSvg kind={item.kind} size={item.size} color={item.color} />
          ) : (
            <StaticFourPointStarSvg kind={item.kind} size={item.size} color={item.color} />
          )}
        </div>
      ))}
    </div>
  );
};
