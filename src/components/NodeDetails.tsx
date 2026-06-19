import { motion, AnimatePresence } from "framer-motion";
import {
  X, BrainCircuit, MonitorPlay, Eye, Server, Camera, Tv2, Smartphone, Network,
  Radio, Atom, Lock, ShieldCheck, Activity, ShieldAlert, LayoutDashboard, LineChart,
  Wrench, Gauge, Cpu, Link2, Cable, ServerCog, type LucideIcon,
} from "lucide-react";
import { NODES, LINKS, LAYERS, type EcoNode } from "@/lib/ecosystem-data";

const ICONS: Record<string, LucideIcon> = {
  BrainCircuit, MonitorPlay, Eye, Server, Camera, Tv2, Smartphone, Network,
  Radio, Atom, Lock, ShieldCheck, Activity, ShieldAlert, LayoutDashboard, LineChart,
  Cable, ServerCog,
};

interface Props {
  nodeId: string | null;
  onClose: () => void;
  onSelect: (id: string) => void;
}

export function NodeDetails({ nodeId, onClose, onSelect }: Props) {
  const node = NODES.find((n) => n.id === nodeId) ?? null;
  const Icon = node ? (ICONS[node.icon] ?? Server) : Server;
  const layerColor = node ? LAYERS[node.layer].color : "var(--primary)";

  return (
    <AnimatePresence>
      {node && (
        <motion.aside
          key={node.id}
          initial={{ x: 360, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 360, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 30 }}
          className="absolute right-2 top-20 bottom-2 z-20 w-[min(380px,calc(100vw-1rem))] overflow-y-auto rounded-xl border border-border bg-card/90 p-5 shadow-2xl backdrop-blur-xl sm:right-4"
          style={{ boxShadow: "var(--glow-primary)" }}
        >
          <div className="mb-4 flex items-start justify-between gap-2">
            <div className="flex items-start gap-3">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border"
                style={{
                  borderColor: `color-mix(in oklab, ${layerColor} 50%, transparent)`,
                  background: `color-mix(in oklab, ${layerColor} 12%, transparent)`,
                  color: layerColor,
                  boxShadow: `0 0 18px color-mix(in oklab, ${layerColor} 35%, transparent)`,
                }}
              >
                <Icon size={24} strokeWidth={1.8} />
              </div>
              <div>
                <div
                  className="mb-1 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                  style={{
                    color: layerColor,
                    background: `color-mix(in oklab, ${layerColor} 18%, transparent)`,
                  }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: layerColor }} />
                  {LAYERS[node.layer].label}
                </div>
                <h2 className="text-lg font-bold leading-tight text-foreground">{node.label}</h2>
                {node.tagline && (
                  <p className="mt-0.5 text-xs italic text-muted-foreground">{node.tagline}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{node.description}</p>

          <Section title="Role" icon={Link2}>
            <p className="text-sm text-foreground/90">{node.role}</p>
          </Section>

          <Section title="Features" icon={Cpu}>
            <ul className="grid grid-cols-2 gap-1.5">
              {node.features.map((f) => (
                <li
                  key={f}
                  className="rounded-md border border-border/60 bg-background/40 px-2 py-1 text-[11px] text-foreground/80"
                >
                  {f}
                </li>
              ))}
            </ul>
          </Section>

          {node.specs && node.specs.length > 0 && (
            <Section title="Specs" icon={Server}>
              <dl className="grid grid-cols-1 gap-1">
                {node.specs.map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center justify-between gap-3 rounded-md border border-border/50 bg-background/40 px-2 py-1 text-[11px]"
                  >
                    <dt className="text-muted-foreground">{s.label}</dt>
                    <dd className="font-mono text-foreground/90">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </Section>
          )}

          {node.kpis && node.kpis.length > 0 && (
            <Section title="Client KPIs" icon={Gauge}>
              <div className="grid grid-cols-2 gap-1.5">
                {node.kpis.map((k) => (
                  <div
                    key={k.label}
                    className="rounded-md border px-2 py-1.5"
                    style={{
                      borderColor: `color-mix(in oklab, ${layerColor} 35%, transparent)`,
                      background: `color-mix(in oklab, ${layerColor} 8%, transparent)`,
                    }}
                  >
                    <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{k.label}</div>
                    <div className="text-sm font-bold" style={{ color: layerColor }}>{k.value}</div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {node.setup && node.setup.length > 0 && (
            <Section title="Setup Guide" icon={Wrench}>
              <ol className="space-y-1.5">
                {node.setup.map((step, i) => (
                  <li key={i} className="flex gap-2 text-[12px] leading-snug text-foreground/85">
                    <span
                      className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold"
                      style={{
                        background: `color-mix(in oklab, ${layerColor} 25%, transparent)`,
                        color: layerColor,
                      }}
                    >
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </Section>
          )}

          <ConnectedNodes node={node} onSelect={onSelect} />
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function Section({ title, children, icon: Icon }: { title: string; children: React.ReactNode; icon?: LucideIcon }) {
  return (
    <div className="mb-4">
      <h3 className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
        {Icon && <Icon className="h-3 w-3" />}
        {title}
      </h3>
      {children}
    </div>
  );
}

function ConnectedNodes({ node, onSelect }: { node: EcoNode; onSelect: (id: string) => void }) {
  const connectedIds = new Set<string>();
  for (const l of LINKS) {
    if (l.source === node.id) connectedIds.add(l.target);
    if (l.target === node.id) connectedIds.add(l.source);
  }
  const connected = NODES.filter((n) => connectedIds.has(n.id));
  if (connected.length === 0) return null;

  return (
    <Section title={`Connected (${connected.length})`}>
      <div className="flex flex-wrap gap-1.5">
        {connected.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className="rounded-md border border-border/60 bg-background/40 px-2 py-1 text-[11px] text-foreground/80 transition hover:border-primary hover:text-foreground"
            style={{ borderColor: `color-mix(in oklab, ${LAYERS[c.layer].color} 35%, transparent)` }}
          >
            {c.label}
          </button>
        ))}
      </div>
    </Section>
  );
}