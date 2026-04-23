import { useMemo, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrainCircuit, MonitorPlay, Eye, Server, Camera, Tv2, Smartphone, Network,
  Radio, Atom, Lock, ShieldCheck, Activity, ShieldAlert, LayoutDashboard, LineChart,
  type LucideIcon,
} from "lucide-react";
import {
  NODES,
  LINKS,
  LAYERS,
  type EcoNode,
  type LayerId,
} from "@/lib/ecosystem-data";

const ICONS: Record<string, LucideIcon> = {
  BrainCircuit, MonitorPlay, Eye, Server, Camera, Tv2, Smartphone, Network,
  Radio, Atom, Lock, ShieldCheck, Activity, ShieldAlert, LayoutDashboard, LineChart,
};

interface Props {
  activeLayers: Record<LayerId, boolean>;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  highlightedNodes: Set<string>;
  highlightedLinks: Set<string>;
  flowingLinks: Set<string>;
}

const W = 1200;
const H = 800;
const CENTER = { x: W / 2, y: H / 2 };
const RADIUS_SCALE = Math.min(W, H) * 0.55;

function polar(angleDeg: number, r: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CENTER.x + Math.cos(a) * r * RADIUS_SCALE,
    y: CENTER.y + Math.sin(a) * r * RADIUS_SCALE,
  };
}

function linkKey(s: string, t: string) {
  return `${s}->${t}`;
}

export function EcosystemGraph({
  activeLayers,
  selectedId,
  onSelect,
  highlightedNodes,
  highlightedLinks,
  flowingLinks,
}: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Pan & zoom
  const [view, setView] = useState({ x: 0, y: 0, k: 1 });
  const dragging = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setView((v) => {
        const k = Math.min(2.5, Math.max(0.5, v.k * (e.deltaY > 0 ? 0.92 : 1.08)));
        return { ...v, k };
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const positions = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    for (const n of NODES) {
      map.set(n.id, n.isBrain ? CENTER : polar(n.angle, n.radius));
    }
    return map;
  }, []);

  const visibleNode = (n: EcoNode) => activeLayers[n.layer];

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      onMouseDown={(e) => {
        dragging.current = { x: e.clientX - view.x, y: e.clientY - view.y };
      }}
      onMouseMove={(e) => {
        if (dragging.current) {
          setView((v) => ({ ...v, x: e.clientX - dragging.current!.x, y: e.clientY - dragging.current!.y }));
        }
      }}
      onMouseUp={() => (dragging.current = null)}
      onMouseLeave={() => (dragging.current = null)}
    >
      {/* Ambient grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.4 0.05 265 / 0.4) 1px, transparent 1px), linear-gradient(90deg, oklch(0.4 0.05 265 / 0.4) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="h-full w-full select-none"
        style={{ cursor: dragging.current ? "grabbing" : "grab" }}
      >
        <defs>
          <radialGradient id="brainGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.85 0.2 320)" stopOpacity="0.9" />
            <stop offset="60%" stopColor="oklch(0.6 0.2 290)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="oklch(0.2 0.05 265)" stopOpacity="0" />
          </radialGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g transform={`translate(${view.x} ${view.y}) scale(${view.k})`}>
          {/* Concentric guide rings */}
          {[0.18, 0.32, 0.42].map((r) => (
            <circle
              key={r}
              cx={CENTER.x}
              cy={CENTER.y}
              r={r * RADIUS_SCALE}
              fill="none"
              stroke="oklch(0.5 0.05 265 / 0.18)"
              strokeDasharray="4 6"
            />
          ))}

          {/* Brain glow */}
          <circle cx={CENTER.x} cy={CENTER.y} r={120} fill="url(#brainGlow)" />

          {/* Links */}
          {LINKS.map((l) => {
            const a = positions.get(l.source);
            const b = positions.get(l.target);
            const sNode = NODES.find((n) => n.id === l.source)!;
            const tNode = NODES.find((n) => n.id === l.target)!;
            if (!a || !b) return null;
            if (!visibleNode(sNode) || !visibleNode(tNode)) return null;
            const key = linkKey(l.source, l.target);
            const isHL = highlightedLinks.has(key);
            const isFlow = flowingLinks.has(key);
            const color = isHL
              ? "oklch(0.9 0.2 25)"
              : `var(--layer-${tNode.layer})`;
            return (
              <g key={key}>
                <line
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={color}
                  strokeOpacity={isHL ? 0.95 : 0.28}
                  strokeWidth={isHL ? 2.4 : 1.2}
                  filter={isHL ? "url(#glow)" : undefined}
                />
                {isFlow && (
                  <FlowingPulse a={a} b={b} color={color} />
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {NODES.filter(visibleNode).map((n) => {
            const p = positions.get(n.id)!;
            const isSelected = selectedId === n.id;
            const isHover = hovered === n.id;
            const isHL = highlightedNodes.has(n.id);
            const dim = (highlightedNodes.size > 0 || selectedId) && !isHL && !isSelected;
            const color = n.isBrain ? "var(--brain)" : `var(--layer-${n.layer})`;
            const r = n.isBrain ? 46 : isSelected || isHover ? 26 : 22;
            const Icon = ICONS[n.icon] ?? Server;
            const iconSize = n.isBrain ? 36 : 22;
            // Distinct shape per layer for instant visual recognition
            const shape = n.isBrain ? "hex" : layerShape(n.layer);
            return (
              <g
                key={n.id}
                transform={`translate(${p.x} ${p.y})`}
                style={{ cursor: "pointer", opacity: dim ? 0.22 : 1, transition: "opacity 250ms" }}
                onMouseEnter={() => setHovered(n.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(isSelected ? null : n.id);
                }}
              >
                {(isHL || isSelected || n.isBrain) && (
                  <NodeShape shape={shape} r={r + 14} fill={color} opacity={0.18} className="animate-pulse-ring" />
                )}
                {(isHL || isSelected || n.isBrain) && (
                  <NodeShape shape={shape} r={r + 7} fill="none" stroke={color} strokeOpacity={0.5} strokeWidth={1} />
                )}
                <NodeShape
                  shape={shape}
                  r={r}
                  fill="oklch(0.16 0.04 265)"
                  stroke={color}
                  strokeWidth={n.isBrain ? 2.5 : 2}
                  filter="url(#glow)"
                />
                {/* Icon */}
                <motion.g
                  animate={
                    n.id === "qrng"
                      ? { rotate: 360 }
                      : n.id === "lte" || n.id === "cameras"
                        ? { scale: [1, 1.08, 1] }
                        : n.isBrain
                          ? { scale: [1, 1.06, 1] }
                          : {}
                  }
                  transition={{
                    duration: n.id === "qrng" ? 12 : 2.4,
                    repeat: Infinity,
                    ease: n.id === "qrng" ? "linear" : "easeInOut",
                  }}
                  style={{ transformOrigin: "center", transformBox: "fill-box" }}
                >
                  <foreignObject
                    x={-iconSize / 2}
                    y={-iconSize / 2}
                    width={iconSize}
                    height={iconSize}
                    style={{ pointerEvents: "none" }}
                  >
                    <div
                      style={{
                        width: iconSize,
                        height: iconSize,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color,
                        filter: `drop-shadow(0 0 6px ${color})`,
                      }}
                    >
                      <Icon size={iconSize} strokeWidth={1.8} />
                    </div>
                  </foreignObject>
                </motion.g>

                {/* Label */}
                <text
                  textAnchor="middle"
                  y={r + 20}
                  fontSize="12"
                  fontWeight="600"
                  fill="oklch(0.95 0.02 240)"
                  style={{ pointerEvents: "none" }}
                >
                  {n.label}
                </text>
                {n.tagline && (isHover || isSelected || n.isBrain) && (
                  <text
                    textAnchor="middle"
                    y={r + 36}
                    fontSize="10"
                    fill="oklch(0.7 0.04 250)"
                    style={{ pointerEvents: "none" }}
                  >
                    {truncate(n.tagline, 42)}
                  </text>
                )}
                {isHover && !isSelected && (
                  <foreignObject x={r + 10} y={-36} width="240" height="74">
                    <div className="rounded-md border border-border bg-popover/95 px-2.5 py-1.5 text-[11px] leading-snug text-popover-foreground shadow-xl backdrop-blur">
                      <div className="font-semibold text-foreground">{n.label}</div>
                      <div className="text-muted-foreground">{n.tagline ?? n.role}</div>
                    </div>
                  </foreignObject>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Legend */}
      <div className="pointer-events-none absolute bottom-4 left-4 flex flex-wrap gap-3 rounded-lg border border-border bg-card/60 px-3 py-2 text-xs backdrop-blur">
        {(Object.keys(LAYERS) as LayerId[]).map((id) => (
          <div key={id} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: LAYERS[id].color, boxShadow: `0 0 8px ${LAYERS[id].color}` }}
            />
            <span className="text-muted-foreground">{LAYERS[id].label}</span>
          </div>
        ))}
      </div>

      <AnimatePresence>{/* placeholder for future overlays */}</AnimatePresence>
    </div>
  );
}

function FlowingPulse({
  a,
  b,
  color,
}: {
  a: { x: number; y: number };
  b: { x: number; y: number };
  color: string;
}) {
  return (
    <motion.circle
      r={4}
      fill={color}
      filter="url(#glow)"
      initial={{ cx: a.x, cy: a.y, opacity: 0 }}
      animate={{ cx: b.x, cy: b.y, opacity: [0, 1, 1, 0] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

function layerShape(layer: LayerId): "circle" | "square" | "diamond" | "hex" | "shield" {
  switch (layer) {
    case "infra": return "square";
    case "connect": return "diamond";
    case "intel": return "hex";
    case "security": return "shield";
    case "ops": return "circle";
  }
}

function NodeShape({
  shape, r, fill, stroke, strokeWidth, strokeOpacity, opacity, filter, className,
}: {
  shape: "circle" | "square" | "diamond" | "hex" | "shield";
  r: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  opacity?: number;
  filter?: string;
  className?: string;
}) {
  const common = { fill, stroke, strokeWidth, strokeOpacity, opacity, filter, className } as const;
  if (shape === "circle") return <circle r={r} {...common} />;
  if (shape === "square") {
    const s = r * 1.7;
    return <rect x={-s / 2} y={-s / 2} width={s} height={s} rx={r * 0.25} {...common} />;
  }
  if (shape === "diamond") {
    const s = r * 1.15;
    return <polygon points={`0,${-s} ${s},0 0,${s} ${-s},0`} {...common} />;
  }
  if (shape === "hex") {
    const pts = Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i - Math.PI / 2;
      return `${Math.cos(a) * r},${Math.sin(a) * r}`;
    }).join(" ");
    return <polygon points={pts} {...common} />;
  }
  // shield
  const w = r * 1.6, h = r * 1.9;
  const d = `M ${-w / 2} ${-h / 2} L ${w / 2} ${-h / 2} L ${w / 2} ${h / 4} Q ${w / 2} ${h / 2} 0 ${h / 2} Q ${-w / 2} ${h / 2} ${-w / 2} ${h / 4} Z`;
  return <path d={d} {...common} />;
}