import React from "react";

type BulbColorKey = "red" | "yellow" | "cyan" | "green" | "orange" | "magenta" | "blue";

interface BulbPalette {
  glassEdge: string;
  glassMid: string;
  core: string;
  corona: string;
  glowInner: string;
  glowOuter: string;
  rim: string;
}

const BULB_PALETTES: Record<BulbColorKey, BulbPalette> = {
  red: {
    glassEdge: "#ff1744",
    glassMid: "#ff5c77",
    core: "#fff5f7",
    corona: "rgba(255, 42, 85, 0.95)",
    glowInner: "rgba(255, 23, 68, 0.75)",
    glowOuter: "rgba(255, 23, 68, 0.34)",
    rim: "#ff5c7c",
  },
  yellow: {
    glassEdge: "#ffb800",
    glassMid: "#ffea56",
    core: "#fffff2",
    corona: "rgba(255, 224, 51, 0.95)",
    glowInner: "rgba(255, 200, 0, 0.72)",
    glowOuter: "rgba(255, 175, 0, 0.32)",
    rim: "#ffec70",
  },
  cyan: {
    glassEdge: "#00d4ff",
    glassMid: "#6ef4ff",
    core: "#f2feff",
    corona: "rgba(0, 234, 255, 0.95)",
    glowInner: "rgba(0, 212, 255, 0.75)",
    glowOuter: "rgba(0, 175, 255, 0.34)",
    rim: "#75f5ff",
  },
  green: {
    glassEdge: "#18ff58",
    glassMid: "#70ff96",
    core: "#f2fff5",
    corona: "rgba(42, 255, 102, 0.95)",
    glowInner: "rgba(24, 255, 88, 0.72)",
    glowOuter: "rgba(0, 220, 64, 0.32)",
    rim: "#70ff98",
  },
  orange: {
    glassEdge: "#ff6a00",
    glassMid: "#ffab40",
    core: "#fff9f0",
    corona: "rgba(255, 132, 28, 0.95)",
    glowInner: "rgba(255, 106, 0, 0.74)",
    glowOuter: "rgba(255, 80, 0, 0.34)",
    rim: "#ffaa4d",
  },
  magenta: {
    glassEdge: "#ff1cf7",
    glassMid: "#ff80fa",
    core: "#fff5fe",
    corona: "rgba(255, 56, 240, 0.95)",
    glowInner: "rgba(255, 28, 247, 0.75)",
    glowOuter: "rgba(220, 0, 215, 0.34)",
    rim: "#ff80f7",
  },
  blue: {
    glassEdge: "#2979ff",
    glassMid: "#78adff",
    core: "#f2f7ff",
    corona: "rgba(66, 140, 255, 0.95)",
    glowInner: "rgba(41, 121, 255, 0.76)",
    glowOuter: "rgba(30, 90, 255, 0.35)",
    rim: "#80b3ff",
  },
};

interface Point {
  x: number;
  y: number;
}

type CubicSegment = readonly [Point, Point, Point, Point];

const evalCubicBezier = (seg: CubicSegment, t: number): Point => {
  const [p0, p1, p2, p3] = seg;
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;
  return {
    x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
    y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y,
  };
};

const segmentsToSvgPath = (segments: readonly CubicSegment[]): string => {
  if (segments.length === 0) return "";
  const [first] = segments;
  const parts = [`M ${first[0].x} ${first[0].y}`];
  for (const [, p1, p2, p3] of segments) {
    parts.push(`C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`);
  }
  return parts.join(" ");
};

// Guirnalda superior (viewBox 0 0 1000 30, altura real 30px)
// Los arcos suben sobre los 4 íconos (17.5%, 39.2%, 60.8%, 82.5%) y caen en los huecos intermedios
const TOP_WIRE_PRIMARY: readonly CubicSegment[] = [
  [{ x: 0, y: 14 }, { x: 60, y: 1 }, { x: 195, y: 1 }, { x: 280, y: 10 }],
  [{ x: 280, y: 10 }, { x: 335, y: 16 }, { x: 415, y: 1 }, { x: 515, y: 9 }],
  [{ x: 515, y: 9 }, { x: 580, y: 14 }, { x: 645, y: 1 }, { x: 730, y: 10 }],
  [{ x: 730, y: 10 }, { x: 800, y: 15 }, { x: 910, y: 1 }, { x: 1000, y: 14 }],
];

const TOP_WIRE_SECONDARY: readonly CubicSegment[] = [
  [{ x: 0, y: 9 }, { x: 80, y: 7 }, { x: 185, y: 0 }, { x: 280, y: 8 }],
  [{ x: 280, y: 8 }, { x: 355, y: 14 }, { x: 425, y: 4 }, { x: 515, y: 12 }],
  [{ x: 515, y: 12 }, { x: 595, y: 16 }, { x: 645, y: 1 }, { x: 730, y: 7 }],
  [{ x: 730, y: 7 }, { x: 815, y: 12 }, { x: 915, y: 4 }, { x: 1000, y: 10 }],
];

// Guirnalda inferior (viewBox 0 0 1000 26, altura real 26px)
const BOTTOM_WIRE_PRIMARY: readonly CubicSegment[] = [
  [{ x: 0, y: 12 }, { x: 65, y: 25 }, { x: 180, y: 25 }, { x: 265, y: 18 }],
  [{ x: 265, y: 18 }, { x: 335, y: 13 }, { x: 425, y: 25 }, { x: 505, y: 18 }],
  [{ x: 505, y: 18 }, { x: 580, y: 13 }, { x: 660, y: 25 }, { x: 740, y: 18 }],
  [{ x: 740, y: 18 }, { x: 820, y: 13 }, { x: 930, y: 25 }, { x: 1000, y: 12 }],
];

const BOTTOM_WIRE_SECONDARY: readonly CubicSegment[] = [
  [{ x: 0, y: 16 }, { x: 70, y: 21 }, { x: 185, y: 26 }, { x: 265, y: 21 }],
  [{ x: 265, y: 21 }, { x: 345, y: 17 }, { x: 420, y: 21 }, { x: 505, y: 21 }],
  [{ x: 505, y: 21 }, { x: 585, y: 17 }, { x: 665, y: 22 }, { x: 740, y: 21 }],
  [{ x: 740, y: 21 }, { x: 825, y: 17 }, { x: 925, y: 21 }, { x: 1000, y: 16 }],
];

// Cables laterales (viewBox 0 0 22 100, ancho real 22px, alto 100%)
const LEFT_WIRE_PRIMARY: readonly CubicSegment[] = [
  [{ x: 1, y: 14 }, { x: 11, y: 34 }, { x: 1, y: 66 }, { x: 6, y: 88 }],
];

const LEFT_WIRE_SECONDARY: readonly CubicSegment[] = [
  [{ x: 4, y: 11 }, { x: 2, y: 40 }, { x: 11, y: 62 }, { x: 2, y: 90 }],
];

const RIGHT_WIRE_PRIMARY: readonly CubicSegment[] = [
  [{ x: 21, y: 14 }, { x: 11, y: 36 }, { x: 21, y: 66 }, { x: 16, y: 88 }],
];

const RIGHT_WIRE_SECONDARY: readonly CubicSegment[] = [
  [{ x: 18, y: 11 }, { x: 20, y: 42 }, { x: 11, y: 62 }, { x: 20, y: 90 }],
];

const TOP_PRIMARY_PATH = segmentsToSvgPath(TOP_WIRE_PRIMARY);
const TOP_SECONDARY_PATH = segmentsToSvgPath(TOP_WIRE_SECONDARY);
const BOTTOM_PRIMARY_PATH = segmentsToSvgPath(BOTTOM_WIRE_PRIMARY);
const BOTTOM_SECONDARY_PATH = segmentsToSvgPath(BOTTOM_WIRE_SECONDARY);
const LEFT_PRIMARY_PATH = segmentsToSvgPath(LEFT_WIRE_PRIMARY);
const LEFT_SECONDARY_PATH = segmentsToSvgPath(LEFT_WIRE_SECONDARY);
const RIGHT_PRIMARY_PATH = segmentsToSvgPath(RIGHT_WIRE_PRIMARY);
const RIGHT_SECONDARY_PATH = segmentsToSvgPath(RIGHT_WIRE_SECONDARY);

interface BulbBlinkConfig {
  duration: number;
  delay: number;
}

interface PositionedBulb {
  id: string;
  color: BulbColorKey;
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  angle: number;
  scale?: number;
  depth?: "fg" | "bg";
  blink?: BulbBlinkConfig;
}

const buildTopBulb = (
  id: string,
  wire: readonly CubicSegment[],
  segIndex: number,
  t: number,
  color: BulbColorKey,
  angle: number,
  options?: { scale?: number; depth?: "fg" | "bg"; blink?: BulbBlinkConfig }
): PositionedBulb => {
  const pt = evalCubicBezier(wire[segIndex], t);
  return {
    id,
    color,
    left: `${(pt.x / 10).toFixed(2)}%`,
    top: `${pt.y.toFixed(1)}px`,
    angle,
    scale: options?.scale ?? 1,
    depth: options?.depth ?? "fg",
    blink: options?.blink,
  };
};

const buildBottomBulb = (
  id: string,
  wire: readonly CubicSegment[],
  segIndex: number,
  t: number,
  color: BulbColorKey,
  angle: number,
  options?: { scale?: number; depth?: "fg" | "bg"; blink?: BulbBlinkConfig }
): PositionedBulb => {
  const pt = evalCubicBezier(wire[segIndex], t);
  const fromBottom = 26 - pt.y;
  return {
    id,
    color,
    left: `${(pt.x / 10).toFixed(2)}%`,
    bottom: `${fromBottom.toFixed(1)}px`,
    angle,
    scale: options?.scale ?? 1,
    depth: options?.depth ?? "fg",
    blink: options?.blink,
  };
};

const buildSideBulb = (
  id: string,
  side: "left" | "right",
  wire: readonly CubicSegment[],
  t: number,
  color: BulbColorKey,
  angle: number,
  scale = 0.94
): PositionedBulb => {
  const pt = evalCubicBezier(wire[0], t);
  return {
    id,
    color,
    ...(side === "left" ? { left: `${pt.x.toFixed(1)}px` } : { right: `${(22 - pt.x).toFixed(1)}px` }),
    top: `${pt.y.toFixed(1)}%`,
    angle,
    scale,
    depth: "fg",
  };
};

// 5 luces con parpadeo distribuidas de forma equilibrada (10% sup., 31% inf., 52% sup., 73% sup., 89% inf.)
const ALL_BULBS: readonly PositionedBulb[] = [
  // --- GUIRNALDA SUPERIOR (primer plano) ---
  buildTopBulb("t-red-1", TOP_WIRE_PRIMARY, 0, 0.14, "red", -40, { scale: 0.96 }),
  buildTopBulb("t-yel-1", TOP_WIRE_PRIMARY, 0, 0.36, "yellow", -18, {
    scale: 0.94,
    blink: { duration: 4.4, delay: -0.4 },
  }),
  buildTopBulb("t-cya-1", TOP_WIRE_PRIMARY, 0, 0.85, "cyan", 20, { scale: 0.96 }),
  buildTopBulb("t-red-2", TOP_WIRE_PRIMARY, 1, 0.04, "red", 0, { scale: 0.98 }),
  buildTopBulb("t-ora-1", TOP_WIRE_PRIMARY, 1, 0.81, "orange", -18, { scale: 0.96 }),
  buildTopBulb("t-mag-1", TOP_WIRE_PRIMARY, 2, 0.05, "magenta", 18, {
    scale: 0.98,
    blink: { duration: 4.8, delay: -2.4 },
  }),
  buildTopBulb("t-blu-1", TOP_WIRE_PRIMARY, 2, 0.28, "blue", -14, { scale: 0.94 }),
  buildTopBulb("t-red-3", TOP_WIRE_PRIMARY, 2, 0.97, "red", 18, {
    scale: 0.96,
    blink: { duration: 4.2, delay: -1.3 },
  }),
  buildTopBulb("t-yel-2", TOP_WIRE_PRIMARY, 3, 0.54, "yellow", -16, { scale: 0.90 }),
  buildTopBulb("t-grn-1", TOP_WIRE_PRIMARY, 3, 0.72, "green", 24, { scale: 0.96 }),
  buildTopBulb("t-mag-2", TOP_WIRE_PRIMARY, 3, 0.88, "magenta", 38, { scale: 0.94 }),

  // --- GUIRNALDA SUPERIOR (profundidad bokeh suave de fondo) ---
  buildTopBulb("t-bg-grn-1", TOP_WIRE_SECONDARY, 1, 0.16, "green", -14, { scale: 0.84, depth: "bg" }),
  buildTopBulb("t-bg-cya-1", TOP_WIRE_SECONDARY, 1, 0.30, "cyan", 12, { scale: 0.80, depth: "bg" }),
  buildTopBulb("t-bg-grn-2", TOP_WIRE_SECONDARY, 2, 0.76, "green", 20, { scale: 0.84, depth: "bg" }),

  // --- GUIRNALDA INFERIOR (apuntando hacia arriba en los espacios libres) ---
  buildBottomBulb("b-red-1", BOTTOM_WIRE_PRIMARY, 0, 0.94, "red", 148, { scale: 0.94 }),
  buildBottomBulb("b-grn-1", BOTTOM_WIRE_PRIMARY, 1, 0.20, "green", 192, {
    scale: 0.95,
    blink: { duration: 5.0, delay: -3.5 },
  }),
  buildBottomBulb("b-cya-1", BOTTOM_WIRE_PRIMARY, 1, 0.78, "cyan", 214, { scale: 0.94 }),
  buildBottomBulb("b-mag-1", BOTTOM_WIRE_PRIMARY, 1, 0.98, "magenta", 180, { scale: 0.96 }),
  buildBottomBulb("b-red-2", BOTTOM_WIRE_PRIMARY, 2, 0.17, "red", 164, { scale: 0.95 }),
  buildBottomBulb("b-yel-1", BOTTOM_WIRE_PRIMARY, 2, 0.95, "yellow", 176, { scale: 0.96 }),
  buildBottomBulb("b-cya-2", BOTTOM_WIRE_PRIMARY, 3, 0.60, "cyan", 202, {
    scale: 0.94,
    blink: { duration: 4.6, delay: -1.0 },
  }),
  buildBottomBulb("b-mag-2", BOTTOM_WIRE_PRIMARY, 3, 0.84, "magenta", 148, { scale: 0.94 }),
  buildBottomBulb("b-bg-mag", BOTTOM_WIRE_SECONDARY, 2, 0.56, "magenta", 184, { scale: 0.72, depth: "bg" }),

  // --- BORDES LATERALES (izquierdo y derecho) ---
  buildSideBulb("l-cya-1", "left", LEFT_WIRE_PRIMARY, 0.42, "cyan", -86, 0.92),
  buildSideBulb("l-red-1", "left", LEFT_WIRE_SECONDARY, 0.72, "red", -112, 0.92),
  buildSideBulb("r-grn-1", "right", RIGHT_WIRE_PRIMARY, 0.53, "green", 70, 0.94),
];

interface SparkleConfig {
  id: string;
  left: string;
  top: string;
  size: number;
  color: string;
  kind: "flare" | "star" | "dot";
}

const SPARKLES: readonly SparkleConfig[] = [
  // Destellos fijos tipo lens-flare de 4 puntas (perímetro + zona central alrededor de las opciones)
  { id: "fl-1", left: "7.5%", top: "40%", size: 11, color: "#60a5fa", kind: "flare" },
  { id: "fl-2", left: "5.2%", top: "56%", size: 13, color: "#4ade80", kind: "flare" },
  { id: "fl-3", left: "5.8%", top: "90%", size: 10, color: "#93c5fd", kind: "flare" },
  { id: "fl-4", left: "61.8%", top: "16%", size: 11, color: "#ff5c77", kind: "flare" },
  { id: "fl-5", left: "62.0%", top: "86%", size: 12, color: "#ff4d6d", kind: "flare" },
  { id: "fl-6", left: "93.2%", top: "46%", size: 10, color: "#fb7185", kind: "flare" },
  { id: "fl-c1", left: "25.5%", top: "64%", size: 10, color: "#fb7185", kind: "flare" },
  { id: "fl-c2", left: "53.2%", top: "54%", size: 11, color: "#93c5fd", kind: "flare" },
  { id: "fl-c3", left: "74.5%", top: "64%", size: 10, color: "#38bdf8", kind: "flare" },

  // Estrellitas navideñas fijas de 5 puntas (bordes + zona central rodeando las 4 opciones)
  { id: "st-1", left: "39.8%", top: "11%", size: 8, color: "#38bdf8", kind: "star" },
  { id: "st-2", left: "67.5%", top: "89%", size: 8, color: "#4ade80", kind: "star" },
  { id: "st-3", left: "97.2%", top: "9%", size: 8, color: "#fbbf24", kind: "star" },
  { id: "st-c1", left: "9.2%", top: "62%", size: 8, color: "#fbbf24", kind: "star" },
  { id: "st-c2", left: "28.2%", top: "44%", size: 9, color: "#38bdf8", kind: "star" },
  { id: "st-c3", left: "49.8%", top: "38%", size: 9.5, color: "#fde047", kind: "star" },
  { id: "st-c4", left: "47.0%", top: "63%", size: 8, color: "#4ade80", kind: "star" },
  { id: "st-c5", left: "71.8%", top: "44%", size: 9, color: "#f472b6", kind: "star" },
  { id: "st-c6", left: "90.8%", top: "36%", size: 8, color: "#4ade80", kind: "star" },

  // Puntitos cálidos fijos de bokeh luminoso
  { id: "dt-1", left: "2.8%", top: "26%", size: 3.5, color: "#fef3c7", kind: "dot" },
  { id: "dt-2", left: "8.2%", top: "84%", size: 4, color: "#fde68a", kind: "dot" },
  { id: "dt-3", left: "36.2%", top: "12%", size: 3, color: "#fef9c3", kind: "dot" },
  { id: "dt-4", left: "36.8%", top: "90%", size: 3.5, color: "#fed7aa", kind: "dot" },
  { id: "dt-5", left: "50.5%", top: "6%", size: 3.5, color: "#fef3c7", kind: "dot" },
  { id: "dt-6", left: "80.8%", top: "6%", size: 3.5, color: "#fef08a", kind: "dot" },
  { id: "dt-c1", left: "29.5%", top: "58%", size: 3.5, color: "#fef08a", kind: "dot" },
  { id: "dt-c2", left: "70.2%", top: "58%", size: 3.5, color: "#fde68a", kind: "dot" },
  { id: "dt-c3", left: "92.0%", top: "66%", size: 3.5, color: "#fef3c7", kind: "dot" },
];

const WireLayer = ({
  primaryPath,
  secondaryPath,
  viewBox,
  className,
}: {
  primaryPath: string;
  secondaryPath: string;
  viewBox: string;
  className: string;
}) => (
  <svg
    aria-hidden="true"
    viewBox={viewBox}
    preserveAspectRatio="none"
    className={className}
    fill="none"
  >
    {/* Cable secundario (trenzado posterior) */}
    <path
      d={secondaryPath}
      stroke="rgba(2, 6, 23, 0.7)"
      strokeWidth="3.2"
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
    />
    <path
      d={secondaryPath}
      stroke="#14532d"
      strokeWidth="2"
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
    />
    <path
      d={secondaryPath}
      stroke="#22c55e"
      strokeWidth="0.75"
      strokeOpacity="0.55"
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
    />

    {/* Cable principal (trenzado frontal con brillo esmeralda) */}
    <path
      d={primaryPath}
      stroke="rgba(2, 6, 23, 0.75)"
      strokeWidth="3.6"
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
    />
    <path
      d={primaryPath}
      stroke="#15803d"
      strokeWidth="2.3"
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
    />
    <path
      d={primaryPath}
      stroke="#4ade80"
      strokeWidth="0.9"
      strokeOpacity="0.72"
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
    />
  </svg>
);

const NeonBulb = ({ bulb }: { bulb: PositionedBulb }) => {
  const palette = BULB_PALETTES[bulb.color];
  const isBg = bulb.depth === "bg";
  const scale = bulb.scale ?? 1;

  // IDs locales para máxima compatibilidad en iOS WKWebView y Android WebView
  const socketGradId = `xmas-sock-${bulb.id}`;
  const glassGradId = `xmas-glass-${bulb.id}`;
  const coreGradId = `xmas-core-${bulb.id}`;

  return (
    <div
      style={{
        position: "absolute",
        left: bulb.left,
        right: bulb.right,
        top: bulb.top,
        bottom: bulb.bottom,
        width: 0,
        height: 0,
        zIndex: isBg ? 1 : 3,
        filter: isBg ? "blur(1.5px)" : undefined,
        opacity: isBg ? 0.48 : 1,
      }}
    >
      {/* Rotación exacta alrededor del punto de agarre al cable (0, 0) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transform: `rotate(${bulb.angle}deg) scale(${scale})`,
          transformOrigin: "0 0",
        }}
      >
        <div
          style={{
            position: "relative",
            transformOrigin: "0 0",
            animation: bulb.blink
              ? `xmasBulbBlink ${bulb.blink.duration}s ease-in-out ${bulb.blink.delay}s infinite`
              : undefined,
          }}
        >
          {/* Capa 1: Halo ambiental neón amplio sobre el fondo oscuro */}
          <div
            style={{
              position: "absolute",
              left: "-21px",
              top: "-8px",
              width: "42px",
              height: "42px",
              borderRadius: "9999px",
              background: `radial-gradient(circle, ${palette.glowInner} 0%, ${palette.glowOuter} 35%, rgba(0,0,0,0) 72%)`,
              pointerEvents: "none",
            }}
          />

          {/* Capa 2: Corona neón intensa pegada al contorno del vidrio */}
          <div
            style={{
              position: "absolute",
              left: "-9px",
              top: "0.5px",
              width: "18px",
              height: "23px",
              borderRadius: "9999px",
              background: `radial-gradient(ellipse at center, ${palette.corona} 0%, ${palette.glowInner} 42%, rgba(0,0,0,0) 76%)`,
              pointerEvents: "none",
            }}
          />

          {/* Capa 3: Foco de vidrio + casquillo verde 3D + filamento incandescente */}
          <svg
            aria-hidden="true"
            viewBox="-9 -2 18 34"
            width="11"
            height="20.8"
            style={{
              position: "absolute",
              left: "-5.5px",
              top: "-1.2px",
              overflow: "visible",
              display: "block",
            }}
          >
            <defs>
              {/* Sombreado cilíndrico 3D del casquillo verde */}
              <linearGradient id={socketGradId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#052e16" />
                <stop offset="28%" stopColor="#15803d" />
                <stop offset="52%" stopColor="#4ade80" />
                <stop offset="78%" stopColor="#166534" />
                <stop offset="100%" stopColor="#052e16" />
              </linearGradient>

              {/* Vidrio neón traslúcido con centro ardiente */}
              <radialGradient id={glassGradId} cx="50%" cy="46%" r="58%">
                <stop offset="0%" stopColor={palette.core} />
                <stop offset="34%" stopColor={palette.glassMid} />
                <stop offset="76%" stopColor={palette.glassEdge} />
                <stop offset="100%" stopColor={palette.glassEdge} stopOpacity="0.94" />
              </radialGradient>

              {/* Filamento luminoso blanco-neón */}
              <linearGradient id={coreGradId} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
                <stop offset="58%" stopColor={palette.core} stopOpacity="0.90" />
                <stop offset="100%" stopColor={palette.glassMid} stopOpacity="0.22" />
              </linearGradient>
            </defs>

            {/* Cuerpo de vidrio en forma de gota clásica navideña */}
            <path
              d="M -3.5 7.4 C -6.1 13.6, -5.5 23.4, 0 28.8 C 5.5 23.4, 6.1 13.6, 3.5 7.4 Z"
              fill={`url(#${glassGradId})`}
              stroke={palette.rim}
              strokeWidth="0.8"
            />

            {/* Núcleo incandescente interior */}
            <path
              d="M -1.9 9.4 C -3.2 14.2, -2.7 21.1, 0 25.0 C 2.7 21.1, 3.2 14.2, 1.9 9.4 Z"
              fill={`url(#${coreGradId})`}
            />

            {/* Filamento fino brillante */}
            <path
              d="M -0.85 9.2 C -1.35 14.2, -1.0 19.6, 0 22.0 C 1.0 19.6, 1.35 14.2, 0.85 9.2"
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.9"
              strokeLinecap="round"
              opacity="0.98"
            />

            {/* Reflejo especular sobre el vidrio */}
            <path
              d="M -3.2 11.4 C -4.0 15.0, -3.7 18.8, -2.3 21.6"
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.75"
              strokeLinecap="round"
              opacity="0.7"
            />

            {/* Casquillo / socket verde con reborde */}
            <rect x="-2.4" y="-1.2" width="4.8" height="2.4" rx="1" fill="#14532d" />
            <path
              d="M -3.2 0.6 L 3.2 0.6 L 4.0 7.6 Q 0 9.0 -4.0 7.6 Z"
              fill={`url(#${socketGradId})`}
            />
            <path
              d="M -3.9 7.2 Q 0 8.5 3.9 7.2"
              fill="none"
              stroke="#86efac"
              strokeWidth="0.6"
              strokeOpacity="0.6"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

const SparkleAccent = ({ item }: { item: SparkleConfig }) => {
  if (item.kind === "dot") {
    return (
      <span
        style={{
          position: "absolute",
          left: item.left,
          top: item.top,
          width: `${item.size}px`,
          height: `${item.size}px`,
          borderRadius: "9999px",
          backgroundColor: item.color,
          boxShadow: `0 0 ${item.size * 2.5}px ${item.color}`,
          transform: "translate(-50%, -50%)",
          opacity: 0.85,
        }}
      />
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        left: item.left,
        top: item.top,
        width: `${item.size}px`,
        height: `${item.size}px`,
        transform: "translate(-50%, -50%)",
        zIndex: 4,
      }}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        width={item.size}
        height={item.size}
        style={{
          display: "block",
          overflow: "visible",
          filter: `drop-shadow(0 0 3px ${item.color})`,
        }}
      >
        {item.kind === "flare" ? (
          <>
            <path
              d="M12 1 Q12.8 11.2 23 12 Q12.8 12.8 12 23 Q11.2 12.8 1 12 Q11.2 11.2 12 1 Z"
              fill={item.color}
            />
            <circle cx="12" cy="12" r="2.2" fill="#ffffff" />
          </>
        ) : (
          <path
            d="M12 2 L14.7 8.4 L21.6 9.1 L16.3 13.7 L17.9 20.5 L12 16.9 L6.1 20.5 L7.7 13.7 L2.4 9.1 L9.3 8.4 Z"
            fill={item.color}
          />
        )}
      </svg>
    </div>
  );
};

export const ChristmasNavbarLights: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
    >
      {/* Sutil resplandor multicolor navideño a lo largo del borde superior */}
      <div
        className="absolute inset-x-0 top-0 h-[1.5px] opacity-75"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,42,75,0.65) 0%, rgba(255,214,10,0.5) 14%, rgba(0,229,255,0.55) 28%, rgba(255,123,28,0.5) 46%, rgba(255,42,232,0.55) 60%, rgba(34,255,94,0.5) 82%, rgba(255,42,232,0.65) 100%)",
        }}
      />

      {/* Cables verdes trenzados perimetrales (superior, inferior y laterales) */}
      <WireLayer
        primaryPath={TOP_PRIMARY_PATH}
        secondaryPath={TOP_SECONDARY_PATH}
        viewBox="0 0 1000 30"
        className="absolute top-0 left-0 w-full h-[30px] z-[2]"
      />
      <WireLayer
        primaryPath={BOTTOM_PRIMARY_PATH}
        secondaryPath={BOTTOM_SECONDARY_PATH}
        viewBox="0 0 1000 26"
        className="absolute bottom-0 left-0 w-full h-[26px] z-[2]"
      />
      <WireLayer
        primaryPath={LEFT_PRIMARY_PATH}
        secondaryPath={LEFT_SECONDARY_PATH}
        viewBox="0 0 22 100"
        className="absolute top-0 left-0 w-[22px] h-full z-[2]"
      />
      <WireLayer
        primaryPath={RIGHT_PRIMARY_PATH}
        secondaryPath={RIGHT_SECONDARY_PATH}
        viewBox="0 0 22 100"
        className="absolute top-0 right-0 w-[22px] h-full z-[2]"
      />

      {/* Focos navideños de neón */}
      {ALL_BULBS.map((bulb) => (
        <NeonBulb key={bulb.id} bulb={bulb} />
      ))}

      {/* Destellos, estrellitas y bokeh navideño (fijos) */}
      {SPARKLES.map((item) => (
        <SparkleAccent key={item.id} item={item} />
      ))}

      <style>{`
        @keyframes xmasBulbBlink {
          0%, 100% {
            opacity: 1;
            transform: scale(1.03);
          }
          50% {
            opacity: 0.18;
            transform: scale(0.92);
          }
        }
      `}</style>
    </div>
  );
};
